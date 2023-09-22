# Vue

## 一、Vue 基础

### 1. 响应式原理

当一个 Vue 实例创建时，Vue 会遍历 data 选项的属性，用 Object.defineProperty（Vue3.0 使用 proxy）将它们转为 getter/setter 并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

```js
class Vue {
  /* Vue构造类 */
  constructor(options) {
    this._data = options.data;
    observer(this._data);
  }
}
function observer(value) {
  if (!value || typeof value !== 'object') {
    return;
  }

  Object.keys(value).forEach((key) => {
    defineReactive(value, key, value[key]);
  });
}
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true /* 属性可枚举 */,
    configurable: true /* 属性可被修改或删除 */,
    get: function reactiveGetter() {
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      cb(newVal);
    },
  });
}
```

![/images/](/images/vue1.jpg)

Vue 采用 **数据劫持** 结合 **发布者-订阅者模式** 的方式来实现数据的响应式，通过 `Object.defineProperty` 来劫持数据的 `setter` 和 `getter`，在数据变动时发布消息给订阅者，订阅者收到消息后进行相应的处理：

1. **Compile**：指令解析系统，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新

2. **Observer**：数据监听系统，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者

3. **Dep + Watcher**：发布订阅模型，作为连接 `Observer` 和 `Compile` 的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图。

#### defineReactive 详细逻辑

```js
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // 每个字段的 Dep 实例都被用于收集那些属于对应字段的依赖
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 如果原本对象拥有 getter 方法则执行
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        // 进行依赖收集
        dep.depend();
        if (childOb) {
          // 子对象进行依赖收集
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        // 如果原本对象拥有 setter 方法则执行 setter
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      // 新的值需要重新进行 observe，报纸数据响应式
      childOb = !shallow && observe(newVal);
      // dep 对象通知所有的观察者
      dep.notify();
    },
  });
}
```

所以响应式原理就是，我们通过递归遍历，把 vue 实例中 data 里面定义的数据，用`defineReactive（Object.defineProperty）`重新定义。每个数据内新建一个`Dep`实例，闭包中包含了这个 `Dep` 类的实例，用来收集 `Watcher` 对象。在对象被 **「读」** 的时候，会触发 `reactiveGetter` 函数把当前的 `Watcher` 对象（存放在 `Dep.target` 中）收集到 `Dep` 类中去。之后如果当该对象被 **「写」** 的时候，则会触发 `reactiveSetter` 方法，通知 `Dep` 类调用 `notify` 来触发所有 `Watcher` 对象的 `update` 方法更新对应视图。

**Tips：**

1. 任何一个 Vue Component 都有一个与之对应的 Watcher 实例。
2. Vue 的 data 上的属性会被添加 getter 和 setter 属性。
3. 当 Vue Component render 函数被执行的时候, data 上会被 触碰(touch), 即被读, getter 方法会被调用, 此时 Vue 会去记录此 Vue component 所依赖的所有 data。(这一过程被称为依赖收集)
4. data 被改动时（主要是用户操作）, 即被写, setter 方法会被调用, 此时 Vue 会去通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新。
5. 在初始化 data props 时，递归对象，给每一个属性双向绑定，对于数组而言，会拿到原型重写函数，实现手动派发更新。因为函数不能监听到数据的变动，和 proxy 比较一下。
6. 除了部分数组函数，通过索引改变数组数据或者给对象添加新属性也不能触发，需要使用自带的 set 函数，这个函数内部也是手动派发更新
7. 在组件挂载时，会实例化渲染观察者，传入组件更新的回调。在实例化过程中，会对模板中的值对象进行求值，触发依赖收集。在触发依赖之前，会保存当前的渲染观察者，用于组件含有子组件的时候，恢复父组件的观察者。触发依赖收集后，会清理掉不需要的依赖，性能优化，防止不需要的地方去重复渲染。
8. 改变值会触发依赖更新，会将收集到的所有依赖全部拿出来，放入 nextTick 中统一执行。执行过程中，会先对观察者进行排序，渲染的最后执行。先执行 beforeUpdate 钩子函数，然后执行观察者的回调。在执行回调的过程中，可能 watch 会再次 push 进来，因为存在在回调中再次赋值，判断无限循环。

### 2. 发布订阅模式

发布订阅模式主要包含哪些内容呢？

1. 发布函数：发布的时候执行相应的回调
2. 订阅函数：添加订阅者，传入发布时要执行的函数，可能会携额外参数
3. 一个缓存订阅者以及订阅者的回调函数的列表
4. 取消订阅

JavaScript 中事件模型，在 DOM 节点上绑定事件函数（`addEventListener`），触发的时候执行就是应用了发布-订阅模式。

#### Dep

**Dep 是发布订阅者模型中的发布者：** get 数据的时候，收集订阅者，触发 Watcher 的**依赖收集**；set 数据时发布更新，通知 Watcher 。一个 Dep 实例对应一个对象属性或一个被观察的对象，用来收集订阅者和在数据改变时，发布更新。

```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = []; // 用来存放Watcher对象的数组
  }

  addSub(sub: Watcher) {
    this.subs.push(sub); // 在subs中添加一个Watcher对象
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  //依赖收集，有需要才添加订阅
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  // 通知所有Watcher对象更新视图
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
```

Dep.target 相当于全局的 Watcher，因为同一时间只有一个 Watcher 被计算。这个静态属性表明了 Vue 当前计算的 Watcher。

#### Watcher

**Watcher 是发布订阅者模型中的订阅者：** 订阅的数据改变时执行相应的回调函数（更新视图或表达式的值）。一个 Watcher 可以更新视图，如 HTML 模板中用到的 `{{test}}`，也可以执行一个 `$watch` 监督的表达式的回调函数（Vue 实例中的 watch 项底层是调用的 `$watch` 实现的），还可以更新一个计算属性（即 Vue 实例中的 `computed` 项）。

**使用场景：**

- 第一种：观察模版中的数据
- 第二种：观察创建 Vue 实例时 watch 选项中的数据，
- 第三种：观察创建 Vue 实例时 computed 选项里的数据所以来的数据
- 第四种：调用 $watch API 观察的数据或表达式

Watcher 只有在这四种场景中，Watcher 才会**收集依赖，更新模版或表达式**，否则，数据变更后无法通知依赖这个数据的模版或表达式

```js
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    //传进来的对象 例如Vue
    this.vm = vm;
    //在Vue中cb是更新视图的核心，调用diff并更新视图的过程
    this.cb = cb;
    //收集Deps，用于移除监听
    this.newDeps = [];
    this.getter = expOrFn;
    //设置Dep.target的值，依赖收集时的watcher对象
    this.value = this.get();
  }

  get() {
    //设置Dep.target值，用以依赖收集
    pushTarget(this);
    const vm = this.vm;
    let value = this.getter.call(vm, vm);
    return value;
  }

  //添加依赖
  addDep(dep) {
    // 这里简单处理，在Vue中做了重复筛选，即依赖只收集一次，不重复收集依赖
    this.newDeps.push(dep);
    dep.addSub(this);
  }

  //更新
  update() {
    this.run();
  }

  //更新视图
  run() {
    //这里只做简单的console.log 处理，在Vue中会调用diff过程从而更新视图
    console.log(`这里会去执行Vue的diff相关方法，进而更新数据`);
  }
}

function pushTarget(_target) {
  Dep.target = _target;
}

updateComponent = () => {
  vm._update(vm._render());
};
new Watcher(vm, updateComponent);
```

#### 依赖收集

- 依赖收集就是订阅数据变化的 `watcher` 的收集
- 依赖收集的目的是为了当这些响应式数据发生变化时，触发它们的 `setter` 的时候，能知道应该通知哪些订阅者去做相应的逻辑处理

依赖收集的过程就是把 Watcher 实例存放到对应的 Dep 对象中去。get 方法可以让当前的 Watcher 对象（Dep.target）存放到它的 subs 中（addSub）方法，在数据变化时，set 会调用 Dep 对象的 notify 方法通知它内部所有 Watcher 对象进行视图更新。

#### 派发更新

- 派发更新就是当数据发生改变后，通知所有订阅了这个数据变化的 `watcher` 执行 `update`
- 派发更新的过程中会把所有执行 `update` 的 `watcher` 推入到队列中，在 `nextTick` 后执行 `flush`

派发更新的核心流程是给对象赋值，触发 set 中派发更新函数。将所有 Watcher 都放入 nextTick 中进行更新，nextTick 回调中执行用户 watch 的回调函数并且渲染组件。

#### 总结

![/images/](/images/vue3.jpg)

Vue 的响应式原理的核心就是观察这些数据的变化，当这些数据发生变化以后，能通知到对应的观察者以实现相关的逻辑。整个响应式原理最核心的实现就是 Dep 类，这个类实际上是连接数据与观察者的桥梁。

在 Vue 初始化阶段，会对配置对象中定义的不同属性做相关的处理，对于 data 和 props 而言，Vue 会通过 observe 和 defineReactive 等一系列的操作把 data 和 props 的每个属性变成响应式属性，同时它们内部会持有一个 Dep 实例对象，当我们访问这些数据的时候，就会触发 dep 的 depend 方法来收集依赖，这些依赖是当前正在计算的 Watcher，当前在计算的依赖也就是 Dep.target，作为 Subscriber 订阅者用于订阅这些数据的变化。当修改数据的时候，会触发 dep 的 notify 方法通知这些订阅者执行 update 的逻辑。

对于 computed 计算属性而言，实际上会在内部创建一个 `computed watcher`，每个 `computed watcher` 会持有一个 Dep 实例，当我们访问 computed 属性的时候，会调用 `computed watcher` 的 evaluate 方法，这时候会触发其持有的 depend 方法用于收集依赖，同时也会收集到正在计算的 watcher，然后把它计算的 watcher 作为 Dep 的 Subscriber 订阅者收集起来，收集起来的作用就是当计算属性所依赖的值发生变化以后，会触发 `computed watcher` 重新计算，如果重新计算过程中计算结果变了也会调用 dep 的 notify 方法，然后通知订阅 computed 的订阅者触发相关的更新。

对于 watch 而言，会创建一个 `user watcher`，可以理解为用户的 watcher，也就是用户自定义的一些 watch，它可以观察 data 的变化，也可以观察 computed 的变化。当这些数据发生变化以后，我们创建的这个 watcher 去观察某个数据或计算属性，让他们发生变化就会通知这个 Dep 然后调用这个 Dep 去遍历所有 `user watcher`s，然后调用它们的 update 方法，然后求值发生新旧值变化就会触发 run 执行用户定义的回调函数（`user callback`）。

Vue 的渲染都是基于这个响应式系统的。在 Vue 的创建过程中，对于每个组件而言，它都会执行组件的 `$mount` 方法，`$mount` 执行过程中内部会创建唯一的 `render watcher`，该 `render watcher` 会在 render 也就是创建 VNode 过程中会访问到定义的 data、props 或者 computed 等等。`render watcher` 相当于订阅者，订阅了这些定义的数据的变化，一旦它们发生变化以后，就会触发例如 setter 里的 notify 或者 `computed watcher` 中的 dep.notify，从而触发 `render watcher` 的 update，然后执行其 run 方法，执行过程中最终会调用 `updateComponent` 的方法，该方法会重新进行视图渲染。

这就是整个 Vue 的响应式系统。

### 3. computed 计算属性

计算属性，依赖其他属性计算值。并且 computed 的值有缓存，只有当计算值变化才变化触发渲染

依赖两个 watcher，computer watcher 和渲染 watcher。判断计算出的值变化后渲染 watcher 派发更新触发渲染

适用于渲染页面，如购物车结算等

特点：

- 支持缓存，只有依赖的数据发生了变化，才会重新计算
- 不支持异步，当 Computed 中有异步操作时，无法监听数据的变化
- computed 的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于 data 声明过，或者父组件传递过来的 props 中的数据进行计算的。
- 如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用 computed
- 如果 computed 属性的属性值是函数，那么默认使用 get 方法，函数的返回值就是属性的属性值；在 computed 中，属性有一个 get 方法和一个 set 方法，当数据发生变化时，会调用 set 方法。

### 4. watch 侦听器

更多的是观察的作用，无缓存性，监听到值得变化就会执行回调

配置项有：handler deep(深度监听) immediate(组件加载立即触发回调函数)

适合做一些复杂业务逻辑，搜索数据，或想要执行异步或者昂贵的操作以响应不断的变化

特点：

- 不支持缓存，数据变化时，它就会触发相应的操作
- 支持异步监听
- 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
- 当一个属性发生变化时，就需要执行相应的操作
- 监听数据必须是 data 中声明的或者父组件传递过来的 props 中的数据，当发生变化时，会触发其他操作

### 5. slot 插槽

是 Vue 的内容分发机制，组件内部的模板引擎使用 slot 元素作为承载分发内容的出口。插槽 slot 是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。

分类：

- 默认插槽：又名匿名插槽，当 slot 没有指定 name 属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
- 具名插槽：带有具体名字的插槽，也就是带有 name 属性的 slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。

原理：

当子组件 vm 实例化时，获取到父组件传入的 slot 标签的内容，存放在 vm.$slot中，默认插槽为vm.$slot.default，具名插槽为 vm.$slot.xxx，xxx 为插槽名，当组件执行渲染函数时候，遇到slot标签，使用$slot 中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

### 6. filters 过滤器

根据过滤器的名称，过滤器是用来过滤数据的，在 Vue 中使用 filters 来过滤数据，filters 不会修改数据，而是过滤数据，改变用户看到的输出（计算属性 computed ，方法 methods 都是通过修改数据来处理数据格式的输出显示）。

使用场景：

- 需要格式化数据的情况，比如需要处理时间、价格等数据格式的输出 / 显示。
- 比如后端返回一个 年月日的日期字符串，前端需要展示为 多少天前 的数据格式，此时就可以用 fliters 过滤器来处理数据。

过滤器是一个函数，它会把表达式中的值始终当作函数的第一个参数。过滤器用在插值表达式 {{ }} 和 v-bind 表达式 中，然后放在操作符“ | ”后面进行指示。

例如，在显示金额，给商品价格添加单位：

```js
<li>商品价格：{{item.price | filterPrice}}</li>

 filters: {
    filterPrice (price) {
      return price ? ('￥' + price) : '--'
    }
  }
```

### 7. 事件修饰符

- `.stop`：等同于 JavaScript 中的 `event.stopPropagation()` ，防止事件冒泡；
- `.prevent`：等同于 JavaScript 中的 `event.preventDefault()` ，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）；
- `.capture`：与事件冒泡的方向相反，事件捕获由外到内；
- `.self`：只会触发自己范围内的事件，不包含子元素；
- `.once`：只会触发一次。

### 8. v-if / -show / -html 原理

- **v-if：** 调用`addIfCondition`方法，生成 vNode 的时候会忽略对应节点，`render`的时候就不会渲染；
- **v-show：** 生成 vNode，`render`的时候也会渲染成真实节点，只是在`render`过程中会在节点的属性中修改`show`属性值，也就是常说的`display`；
- **v-html：** 先移除节点下的所有节点，调用`html`方法，通过`addProp`添加`innerHTML`属性，归根结底还是设置`innerHTML`为 v-html 的值。

### 9. v-if 和 v-show 区别

- **手段：** v-if 是动态的向 DOM 树内添加或者删除 DOM 元素；v-show 是通过设置 DOM 元素的 display 样式属性控制显隐；
- **编译过程：** v-if 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show 只是简单的基于 css 切换；
- **编译条件：** v-if 是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; v-show 是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且 DOM 元素保留；
- **性能消耗：** v-if 有更高的切换消耗；v-show 有更高的初始渲染消耗；
- **使用场景：** v-if 适合运营条件不大可能改变；v-show 适合频繁切换。

### 10. v-model

v-model 在**模板编译的时候转换代码**

1. **作用在表单元素上**

   本质是 :value 和 @input，但是略微有点区别。在输入控件下，有两个事件监听，输入中文时只有当输出中文才触发数据赋值

   v-model 和:bind 同时使用，前者优先级更高，如果 :value 会出现冲突

   ```js
   <input v-model="sth" />
   //  等同于
   <input
    v-bind:value="message"
    v-on:input="message=$event.target.value"
   >
   //$event 指代当前触发的事件对象;
   //$event.target 指代当前触发的事件对象的dom;
   //$event.target.value 就是当前dom的value值;
   //在@input方法中，value => sth;
   //在:value中,sth => value;
   ```

2. **作用在组件上**

   因为语法糖的原因，还可以用于父子通信，默认会利用名为 value 的 prop 和名为 input 的事件，通过 prop 和 $.emit 实现

   ```js
   // 父组件
   <aa-input v-model="aa"></aa-input>
   // 等价于
   <aa-input :value="aa" @input="aa=$event.target.value"></aa-input>

   // 子组件：
   <input :value="aa" @input="onmessage"></aa-input>

   props:{value:aa}
   methods:{
     onmessage(e){
       $emit('input',e.target.value)
     }
   }

   ```

### 11. data 为什么是函数

Vue 组件可能存在多个实例，如果使用对象形式定义 data，则会导致它们共用一个 data 对象，作用域没有隔离，那么状态变更将会影响所有组件实例，这是不合理的；

采用函数形式定义，在 initData 时会将其作为工厂函数返回全新 data 对象，每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响，有效规避多实例之间状态污染问题。

而在 Vue 根实例创建过程中则不存在该限制，也是因为根实例只能有一个不会被复用，不存在引用对象的问题，所以不需要担心这种情况

### 12. keep-alive

keep-alive 是 Vue 内置组件，主要用于保留组件状态或避免重新渲染。

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。

对于 keep-alive 组件来说，它拥有两个独有的生命周期钩子函数，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 activated 钩子函数

**Props**

- include：字符串或正则表达式。只有名称匹配的组件会被缓存。
- exclude：字符串或正则表达式。任何名称匹配的组件都不会被缓存。
- max：数字。最多可以缓存多少组件实例。

**主要流程**

1. 判断组件 name ，不在 include 或者在 exclude 中，直接返回 vnode，说明该组件不被缓存。
2. 获取组件实例 key ，如果有获取实例的 key，否则重新生成。
3. key 生成规则，cid +"∶∶"+ tag ，仅靠 cid 是不够的，因为相同的构造函数可以注册为不同的本地组件。
4. 如果缓存对象内存在，则直接从缓存对象中获取组件实例给 vnode ，不存在则添加到缓存对象中。
5. 最大缓存数量，当缓存组件数量超过 max 值时，清除 keys 数组内第一个组件。

**实现**

```js
// 接收：字符串，正则，数组
const patternTypes: Array<Function> = [String, RegExp, Array];

export default {
  name: 'keep-alive',
  abstract: true, // 抽象组件，是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

  props: {
    include: patternTypes, // 匹配的组件，缓存
    exclude: patternTypes, // 不去匹配的组件，不缓存
    max: [String, Number], // 缓存组件的最大实例数量, 由于缓存的是组件实例（vnode），数量过多的时候，会占用过多的内存，可以用max指定上限
  },

  created() {
    // 用于初始化缓存虚拟DOM数组和vnode的key
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed() {
    // 销毁缓存cache的组件实例
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    // prune 削减精简[v.]
    // 去监控include和exclude的改变，根据最新的include和exclude的内容，来实时削减缓存的组件的内容
    this.$watch('include', (val) => {
      pruneCache(this, (name) => matches(val, name));
    });
    this.$watch('exclude', (val) => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },
};
```

**render 函数**

1. 会在 keep-alive 组件内部去写自己的内容，所以可以去获取默认 slot 的内容，然后根据这个去获取组件
2. keep-alive 只对第一个组件有效，所以获取第一个子组件。
3. 和 keep-alive 搭配使用的一般有：动态组件 和 router-view

```js
render () {
  //
  function getFirstComponentChild (children: ?Array<VNode>): ?VNode {
    if (Array.isArray(children)) {
  for (let i = 0; i < children.length; i++) {
    const c = children[i]
    if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
      return c
    }
  }
  }
  }
  const slot = this.$slots.default // 获取默认插槽
  const vnode: VNode = getFirstComponentChild(slot)// 获取第一个子组件
  const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions // 组件参数
  if (componentOptions) { // 是否有组件参数
    // check pattern
    const name: ?string = getComponentName(componentOptions) // 获取组件名
    const { include, exclude } = this
    if (
      // not included
      (include && (!name || !matches(include, name))) ||
      // excluded
      (exclude && name && matches(exclude, name))
    ) {
      // 如果不匹配当前组件的名字和include以及exclude
      // 那么直接返回组件的实例
      return vnode
    }

    const { cache, keys } = this

    // 获取这个组件的key
    const key: ?string = vnode.key == null
      // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
      : vnode.key

    if (cache[key]) {
      // LRU缓存策略执行
      vnode.componentInstance = cache[key].componentInstance // 组件初次渲染的时候componentInstance为undefined

      // make current key freshest
      remove(keys, key)
      keys.push(key)
      // 根据LRU缓存策略执行，将key从原来的位置移除，然后将这个key值放到最后面
    } else {
      // 在缓存列表里面没有的话，则加入，同时判断当前加入之后，是否超过了max所设定的范围，如果是，则去除
      // 使用时间间隔最长的一个
      cache[key] = vnode
      keys.push(key)
      // prune oldest entry
      if (this.max && keys.length > parseInt(this.max)) {
        pruneCacheEntry(cache, keys[0], keys, this._vnode)
      }
    }
    // 将组件的keepAlive属性设置为true
    vnode.data.keepAlive = true // 作用：判断是否要执行组件的created、mounted生命周期函数
  }
  return vnode || (slot && slot[0])
}
```

keep-alive 具体是通过 cache 数组缓存所有组件的 vnode 实例。当 cache 内原有组件被使用时会将该组件 key 从 keys 数组中删除，然后 push 到 keys 数组最后，以便清除最不常用组件。

**实现步骤**

1. 获取 keep-alive 下第一个子组件的实例对象，通过他去获取这个组件的组件名
2. 通过当前组件名去匹配原来 include 和 exclude，判断当前组件是否需要缓存，不需要缓存，直接返回当前组件的实例 vNode
3. 需要缓存，判断他当前是否在缓存数组里面：

- 存在，则将他原来位置上的 key 给移除，同时将这个组件的 key 放到数组最后面（LRU）
- 不存在，将组件 key 放入数组，然后判断当前 key 数组是否超过 max 所设置的范围，超过，那么削减未使用时间最长的一个组件的 key

4. 最后将这个组件的 keepAlive 设置为 true

**keep-alive 本身的创建过程和 patch 过程**
缓存渲染的时候，会根据 vnode.componentInstance（首次渲染 vnode.componentInstance 为 undefined） 和 keepAlive 属性判断不会执行组件的 created、mounted 等钩子函数，而是对缓存的组件执行 patch 过程 ∶ 直接把缓存的 DOM 对象直接插入到目标元素中，完成了数据更新的情况下的渲染过程。

**首次渲染**

- 组件的首次渲染 ∶ 判断组件的 abstract 属性，才往父组件里面挂载 DOM

```js
// core/instance/lifecycle
function initLifecycle(vm: Component) {
  const options = vm.$options;

  // locate first non-abstract parent
  let parent = options.parent;
  if (parent && !options.abstract) {
    // 判断组件的abstract属性，才往父组件里面挂载DOM
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}
```

- 判断当前 keepAlive 和 componentInstance 是否存在来判断是否要执行组件 prepatch 还是执行创建 componentlnstance

```js
// core/vdom/create-component
init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) { // componentInstance在初次是undefined!!!
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode) // prepatch函数执行的是组件更新的过程
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },
```

prepatch 操作就不会在执行组件的 mounted 和 created 生命周期函数，而是直接将 DOM 插入

**LRU （least recently used）缓存策略**

LRU 缓存策略 ∶ 从内存中找出最久未使用的数据并置换新的数据。
LRU（Least rencently used）算法根据数据的历史访问记录来进行淘汰数据，其核心思想是"**如果数据最近被访问过，那么将来被访问的几率也更高**"。 最常见的实现是使用一个链表保存缓存数据，详细算法实现如下 ∶

- 新数据插入到链表头部
- 每当缓存命中（即缓存数据被访问），则将数据移到链表头部
- 链表满的时候，将链表尾部的数据丢弃。

### 13. $nextTick

可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

在 Vue 2.4 之前都是使用的 microtasks，但是 microtasks 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macrotasks 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 microtasks，但在特殊情况下会使用 macrotasks，比如 v-on。

**核心：** 是利用了如 Promise 、MutationObserver、setImmediate、setTimeout 的原生 JavaScript 方法来模拟对应的微/宏任务的实现

**本质：** 是为了利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列，同时也允许开发者在实际项目中使用这个方法来满足实际应用中对 DOM 更新数据时机的后续逻辑处理

nextTick 是典型的将底层 JavaScript 执行原理应用 `EventLoop` 到具体案例中的示例，引入异步更新队列机制的原因 ∶

- 如果是同步更新，则多次对一个或多个属性赋值，会频繁触发 UI/DOM 的渲染，可以减少一些无用渲染
- 同时由于 VirtualDOM 的引入，每一次状态发生变化后，状态变化的信号会发送给组件，组件内部使用 VirtualDOM 进行计算得出需要更新的具体的 DOM 节点，然后对 DOM 进行更新操作，每次更新状态后的渲染过程需要更多的计算，而这种无用功也将浪费更多的性能，所以异步渲染变得更加至关重要

**使用场景**

- 在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的 DOM 结构的时候，这个操作就需要方法在 nextTick()的回调函数中。
- 在 vue 生命周期中，如果在 created()钩子进行 DOM 操作，也一定要放在 nextTick()的回调函数中。

第一个参数为：回调函数（可以获取最近的 DOM 结构）

第二个参数为：执行函数上下文

```js
// 修改数据
vm.message = '修改后的值';
// DOM 还没有更新
console.log(vm.$el.textContent); // 原始的值
Vue.nextTick(function () {
  // DOM 更新了
  console.log(vm.$el.textContent); // 修改后的值
});
```

组件内使用 `vm.$nextTick()` 实例方法只需要通过`this.$nextTick()`，并且回调函数中的 this 将自动绑定到当前的 Vue 实例上

```js
this.message = '修改后的值';
console.log(this.$el.textContent); // => '原始的值'
this.$nextTick(function () {
  console.log(this.$el.textContent); // => '修改后的值'
});
```

`$nextTick()` 会返回一个 `Promise` 对象，可以是用`async/await`完成相同作用的事情

```js
this.message = '修改后的值';
console.log(this.$el.textContent); // => '原始的值'
await this.$nextTick();
console.log(this.$el.textContent); // => '修改后的值'
```

**实现原理**

源码位置：`/src/core/util/next-tick.js`

`callbacks` 也就是异步操作队列

`callbacks` 新增回调函数后又执行了 `timerFunc` 函数， `pending` 是用来标识同一个时间只能执行一次

```js
let callbacks = [];
let pending = false;

export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve;

  // cb 回调函数会经统一处理压入 callbacks 数组
  callbacks.push(() => {
    if (cb) {
      // 给 cb 回调函数执行加上了 try-catch 错误处理
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  // 执行异步延迟函数 timerFunc
  if (!pending) {
    pending = true;
    timerFunc();
  }

  // 当 nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
```

`timerFunc` 函数定义，这里是根据当前环境支持什么方法则确定调用哪个，分别有：

`Promise.then、MutationObserver、setImmediate、setTimeout`

通过上面任意一种方法，进行降级操作

```js
export let isUsingMicroTask = false;
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  //判断1：是否原生支持Promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  };
  isUsingMicroTask = true;
} else if (
  !isIE &&
  typeof MutationObserver !== 'undefined' &&
  (isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
  //判断2：是否原生支持MutationObserver
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}
```

无论是微任务还是宏任务，都会放到 flushCallbacks 使用

这里将 callbacks 里面的函数复制一份，同时 callbacks 置空

依次执行 callbacks 里面的函数

```js
function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
```

**小结：**

1. 把回调函数放入 callbacks 等待执行
2. 将执行函数放到微任务或者宏任务中
3. 事件循环到了微任务或者宏任务，执行函数依次执行 callbacks 中的回调

### 14. 异步批量更新

Vue 在默认情况下，每次触发某个数据的 setter 方法后，对应的 Watcher 对象其实会被 push 进一个队列 queue 中，在下一个 tick 的时候将这个队列 queue 全部拿出来 run（Watcher 类的一个方法，用来触发 patch 操作）一遍。

Vue 源码为每个 Watcher 都提供了唯一的 id 用于标识。

实现 update 方法，在修改数据后由 Dep 来调用，而 run 方法才是真正的触发 patch 更新视图的方法。

```js
let uid = 0;

class Watcher {
  constructor() {
    this.id = ++uid;
  }
  update() {
    console.log('watch' + this.id + ' update');
    queueWatcher(this);
  }
  run() {
    console.log('watch' + this.id + ' ViewRendering');
  }
}
```

#### queueWatcher

将 Watcher 对象自身传递给 queueWatcher 方法。

```js
let has = {};
let queue = [];
let waiting = false;

function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] === null) {
    has[id] === true;
    queue.push(watcher);

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}
```

这里使用一个叫做 `has` 的 map，里面存放 id -> true(false) 的形式，用力啊判断是否已经存在相同的 `Watcher` 对象（这样比每次都去遍历 queue 效率上会高很多）。

如果目前队列 `queue` 中还没有这个 `Watcher` 对象，则该对象会被 `push` 进队列 `queue` 中去。

`waiting` 是一个标记位，标记是否已经向 `nextTick` 传递了 `flushSchedulerQueue` 方法，在下一个 `tick` 执行时 `flushSchedulerQueue` 方法来 `flush` 队列 `queue`，执行它里面的所有 `Watcher` 对象的 `run` 方法。

#### flushSchedulerQueue

```js
function flushSchedulerQueue() {
  queue.sort((a, b) => a.id - b.id); //
  let watcher, id;

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        );
        break;
      }
    }
  }

  waiting = false;
}
```

**Schedule 调度的作用：**

1. **去重**，每个 Watcher 有一个唯一的 id。首先，如果 id 已经在队列里了，跳过，没必要重复执行，如果 id 不在队列里，要看队列是否正在执行中。如果不在执行中，则在下一个时间片执行队列，因此队列永远是异步执行的。
2. **排序**，按解析渲染的先后顺序执行，即 Watcher 小的先执行。Watcher 里面的 id 是自增的，先创键的比后创建的 id 小。所以会有如下规律：
   - 组件是允许嵌套的，而且解析必然是先解析了父组件再到子组件。所以父组件的 id 比子组件小。
   - 用户创建的 Watcher 会比 render 时候创建的先解析。所以用户创建的 Watcher 的 id 比 render 时候创建的小。
3. 删除 Watcher，如果一个组件的 Watcher 在队列中，而他的父组件被删除了，这个时候也要删掉这个 Watcher。
4. 队列执行过程中，存一个对象 circular，里面有每个 watcher 的执行次数，如果哪个 watcher 执行超过 `MAX_UPDATE_COUNT` 定义的次数就认为是死循环，不再执行，默认是 100 次。

### 15. 数组封装

在 Vue 中，对响应式处理利用的是 Object.defineProperty 对数据进行拦截，而这个方法并不能监听到数组内部变化，数组长度变化，数组的截取变化等，所以需要对这些操作进行 hack，让 Vue 能监听到其中的变化。

```js
// 缓存数组原型
const arrayProto = Array.prototype;
// 实现 arrayMethods.__proto__ === Array.prototype
export const arrayMethods = Object.create(arrayProto);
// 需要进行功能拓展的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // 缓存原生数组方法
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    // 执行并缓存原生数组功能
    const result = original.apply(this, args);
    // 响应式处理
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      // push、unshift会新增索引，所以要手动observer
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      // splice方法，如果传入了第三个参数，也会有索引加入，也要手动observer。
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    //
    if (inserted) ob.observeArray(inserted); // 获取插入的值，并设置响应式监听
    // notify change
    ob.dep.notify(); // 通知依赖更新
    // 返回原生数组方法的执行结果
    return result;
  });
});
```

简单来说就是，重写了数组中的那些原生方法，首先获取到这个数组的`__ob__`，也就是它的`Observer`对象，如果有新的值，就调用`observeArray`继续对新的值观察变化（也就是通过`target__proto__ == arrayMethods`来改变了数组实例的型），然后手动调用 notify，通知渲染 watcher，执行 update。

### 16. 模板编译

Vue 的模版编译过程主要如下：**template -> ast -> render 函数**

Vue 在模版编译版本的码中会执行 `compileToFunctions` 将 template 转化为 render 函数：

```js
// 将模板编译为render函数
const { render, staticRenderFns } = compileToFunctions(
  template,
  {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: this.$options.delimiters,
    comments: this.$options.comments,
  },
  this
);
```

1. **调用 parse 方法将 template 转化为 AST（抽象语法树）：**

通过各种各样的正则表达式去匹配模板中的内容，然后将标签、指令、属性等内容提取出来做各种逻辑操作生成一个最基本的 AST 对象

```js
const ast = parse(template.trim(), options);
```

\*_AST 元素节点总共三种类型：type 为 1 表示普通元素、2 为表达式、3 为纯文本_

2. **对静态节点做优化：**

对节点进行了静态内容提取，也就是将永远不会变动的节点提取了出来打个标记，实现复用 Virtual DOM，跳过对比算法的功能，这对运行时模板更新起到了极大的优化作用。

```js
optimize(ast, options);
```

3. **将 AST 转换为 render 函数：**

generate 将 ast 抽象语法树编译成 render 字符串并将静态部分放到 `staticRenderFns` 中，最后通过 `new Function(render)` 生成 render 函数

```js
const code = generate(ast, options);
```

### 17. 自定义指令

**指令系统**是计算机硬件的语言系统，也叫机器语言，它是系统程序员看到的计算机的主要属性。因此指令系统表征了计算机的基本功能决定了机器所要求的能力

在 vue 中提供了一套为数据驱动视图更为方便的操作，这些操作被称为指令系统

我们看到的 v-开头的行内属性，都是指令，不同的指令可以完成或实现不同的功能

除了核心功能默认内置的指令 (`v-model` 和 `v-show`)，Vue 也允许注册自定义指令:

```js
//会实例化一个指令，但这个指令没有参数
`v-xxx` // -- 将值传到指令中
`v-xxx="value"` // -- 将字符串传入到指令中，如`v-html="'<p>内容</p>'"`
`v-xxx="'string'"` // -- 传参数（`arg`），如`v-bind:class="className"`
`v-xxx:arg="value"` // -- 使用修饰符（`modifier`）
`v-xxx:arg.modifier="value"`;
```

**实现：**

- **全局注册:** 主要是通过`Vue.directive`方法进行注册

  `Vue.directive`第一个参数是指令的名字（不需要写上`v-`前缀），第二个参数可以是对象数据，也可以是一个指令函数

- **局部注册:** 通过在组件`options`选项中设置`directive`属性

```js
// 注册一个自定义指令 `v-focus`

// 全局
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})

// 局部
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
    }
  }
}

// 在模板中任何元素上使用新的 v-focus property
<input v-focus />
```

**钩子函数：**

- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
- `update`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
- `componentUpdated`：指令所在组件的 VNode 及其子 VNode 全部更新后调用
- `unbind`：只调用一次，指令与元素解绑时调用

**钩子函数参数：**

- `el`：指令所绑定的元素，可以用来直接操作 DOM
- `binding`：一个对象，包含以下 property：
  - `name`：指令名，不包括 v- 前缀。
  - `value`：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
  - `oldValue`：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
  - `expression`：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  - `arg`：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  - `modifiers`：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }
- `vnode`：Vue 编译生成的虚拟节点
- `oldVnode`：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用

\*_除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行_

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
<script>
  Vue.directive('demo', function (el, binding) {
    console.log(binding.value.color); // "white"
    console.log(binding.value.text); // "hello!"
  });
</script>
```

**应用场景**

- 表单防止重复提交
  ```js
   // 1.设置v-throttle自定义指令
   Vue.directive('throttle', {
     bind: (el, binding) => {
       let throttleTime = binding.value; // 节流时间
       if (!throttleTime) { // 用户若不设置节流时间，则默认2s
         throttleTime = 2000;
       }
       let cbFun;
       el.addEventListener('click', event => {
         if (!cbFun) { // 第一次执行
           cbFun = setTimeout(() => {
             cbFun = null;
           }, throttleTime);
         } else {
           event && event.stopImmediatePropagation();
         }
       }, true);
     },
   });
   // 2.为button标签设置v-throttle自定义指令
   <button @click="sayHello" v-throttle>提交</button>
  ```
- 图片懒加载

  ```js
  const LazyLoad = {
    // install方法
    install(Vue, options) {
      // 代替图片的loading图
      let defaultSrc = options.default;
      Vue.directive('lazy', {
        bind(el, binding) {
          LazyLoad.init(el, binding.value, defaultSrc);
        },
        inserted(el) {
          // 兼容处理
          if ('IntersectionObserver' in window) {
            LazyLoad.observe(el);
          } else {
            LazyLoad.listenerScroll(el);
          }
        },
      });
    },
    // 初始化
    init(el, val, def) {
      // data-src 储存真实src
      el.setAttribute('data-src', val);
      // 设置src为loading图
      el.setAttribute('src', def);
    },
    // 利用IntersectionObserver监听el
    observe(el) {
      let io = new IntersectionObserver((entries) => {
        let realSrc = el.dataset.src;
        if (entries[0].isIntersecting) {
          if (realSrc) {
            el.src = realSrc;
            el.removeAttribute('data-src');
          }
        }
      });
      io.observe(el);
    },
    // 监听scroll事件
    listenerScroll(el) {
      let handler = LazyLoad.throttle(LazyLoad.load, 300);
      LazyLoad.load(el);
      window.addEventListener('scroll', () => {
        handler(el);
      });
    },
    // 加载真实图片
    load(el) {
      let windowHeight = document.documentElement.clientHeight;
      let elTop = el.getBoundingClientRect().top;
      let elBtm = el.getBoundingClientRect().bottom;
      let realSrc = el.dataset.src;
      if (elTop - windowHeight < 0 && elBtm > 0) {
        if (realSrc) {
          el.src = realSrc;
          el.removeAttribute('data-src');
        }
      }
    },
    // 节流
    throttle(fn, delay) {
      let timer;
      let prevTime;
      return function (...args) {
        let currTime = Date.now();
        let context = this;
        if (!prevTime) prevTime = currTime;
        clearTimeout(timer);

        if (currTime - prevTime > delay) {
          prevTime = currTime;
          fn.apply(context, args);
          clearTimeout(timer);
          return;
        }

        timer = setTimeout(function () {
          prevTime = Date.now();
          timer = null;
          fn.apply(context, args);
        }, delay);
      };
    },
  };
  export default LazyLoad;
  ```

- 一键 Copy 的功能

  ```js
  import { Message } from 'ant-design-vue';

  const vCopy = {
    //
    /*
       bind 钩子函数，第一次绑定时调用，可以在这里做初始化设置
       el: 作用的 dom 对象
       value: 传给指令的值，也就是我们要 copy 的值
     */
    bind(el, { value }) {
      el.$value = value; // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
      el.handler = () => {
        if (!el.$value) {
          // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
          Message.warning('无复制内容');
          return;
        }
        // 动态创建 textarea 标签
        const textarea = document.createElement('textarea');
        // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
        textarea.readOnly = 'readonly';
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        // 将要 copy 的值赋给 textarea 标签的 value 属性
        textarea.value = el.$value;
        // 将 textarea 插入到 body 中
        document.body.appendChild(textarea);
        // 选中值并复制
        textarea.select();
        // textarea.setSelectionRange(0, textarea.value.length);
        const result = document.execCommand('Copy');
        if (result) {
          Message.success('复制成功');
        }
        document.body.removeChild(textarea);
      };
      // 绑定点击事件，就是所谓的一键 copy 啦
      el.addEventListener('click', el.handler);
    },
    // 当传进来的值更新的时候触发
    componentUpdated(el, { value }) {
      el.$value = value;
    },
    // 指令与元素解绑的时候，移除事件绑定
    unbind(el) {
      el.removeEventListener('click', el.handler);
    },
  };

  export default vCopy;
  ```

### 18. mixin 和 mixins 区别

mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的，可以全局混入装好的 ajax 或者一些工具函数

mixins 应该是我们最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如上拉下拉加载数据这种逻辑等等。
mixins 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并

### 19. SSR 服务端渲染

SSR 也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端

SSR 的优势：

- 更好的 SEO
- 首屏加载速度更快

SSR 的缺点：

- 开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子；
- 当需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境；
- 更多的服务端负载。

### 20. 性能优化

1. **编码阶段**

- 尽量减少 data 中的数据，data 中的数据都会增加 getter 和 setter，会收集对应的 watcher
- v-for 遍历必须为 item 添加唯一 key，且避免同时使用 v-if
- 如果需要使用 v-for 给每项元素绑定事件时使用事件代理
- SPA 页面采用 keep-alive 缓存组件
- v-if 和 v-show 区分使用场景
- 无状态的组件标记为函数式组件 functional
- computed 和 watch 区分使用场景
- 虚拟长列表性能优化
- 事件的销毁
- 图片资源懒加载
- 路由懒加载、异步组件
- 防抖、节流
- 第三方插件的按需引入
- 服务端渲染 SSR or 预渲染

2. **SEO**

- 预渲染
- 服务端渲染 SSR

3. **打包优化**

- 压缩代码
- Tree Shaking/Scope Hoisting
- 使用 cdn 加载第三方模块
- 多线程打包 thread-loader/happypack
- splitChunks 抽离公共文件
- sourceMap 优化

4. **用户体验**

- 骨架屏
- PWA
- 还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启 gzip 压缩等

### 21. 单 / 多页应用

- SPA 单页面应用（`SinglePage Web Application`），指只有一个主页面的应用，一开始只需要加载一次 js、css 等相关资源。所有内容都包含在主页面，对每一个功能模块组件化。单页应用跳转，就是切换相关组件，仅仅刷新局部资源。
- MPA 多页面应用 （`MultiPage Application`），指有多个独立页面的应用，每个页面必须重复加载 js、css 等相关资源。多页应用跳转，需要整页资源刷新。

| 对比项 / 模式 | SPA                                                           | MPA                                                                |
| ------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| 结构          | 一个主页面+许多模块的组件                                     | 徐多完整的页面                                                     |
| 体验          | 页面切换快，体验佳；当初次加载文件过多时，需要做相关的调优。  | 页面切换慢，网速慢的时候，体验尤其不好                             |
| 资源文件      | 组件公用的资源只需要加载一次                                  | 每个页面都要自己加载公用的资源                                     |
| 适用场景      | 对体验度和流畅度有较高要求的应用，不利于 seo(可借助 ssr 优化) | 适用于对 seo 要求较高的应用                                        |
| 过渡动画      | vue 提供了 transition 的封装组件，容易实现                    | 很难实现                                                           |
| 内容更新      | 相关组件的切换，即局部更新                                    | 整体 html 的切换，费钱（重复 http 请求）                           |
| 路由模式      | 可以使用 hash,也可以使用 history                              | 普通链接跳转                                                       |
| 数据传递      | 因为单页面，使用全局变量就好(vuex)                            | cookie,localStorage 等缓存方案，url 参数，调用接口保存等           |
| 相关成本      | 前期开发成本较高，后期维护较为容易                            | 前期开发成本低，后期维护就比较麻烦，因为可能一个功能需要改很多地方 |

## 二、生命周期

### 1. 完整过程

Vue 实例有⼀个完整的⽣命周期，也就是从开始创建、初始化数据、编译模版、挂载 Dom -> 渲染、更新 -> 渲染、卸载 等⼀系列过程，称这是 Vue 的⽣命周期。

1. **beforeCreate（创建前）**：数据观测和初始化事件还未开始，此时 data 的响应式追踪、event/watcher 都还没有被设置，也就是说不能访问到 data、computed、watch、methods 上的方法和数据。
2. **created（创建后）**：实例创建完成，实例上配置的 options 包括 data、computed、watch、methods 等都配置完成，但是此时渲染得节点还未挂载到 DOM，所以不能访问到 `$el` 属性。
3. **beforeMount（挂载前）**：在挂载开始之前被调用，相关的 render 函数首次被调用。实例已完成以下的配置：编译模板，把 data 里面的数据和模板生成 html。此时还没有挂载 html 到页面上。
4. **mounted（挂载后）**：在 `el` 被新创建的 `vm.$el` 替换，并挂载到实例上去之后调用。实例已完成以下的配置：用上面编译好的 html 内容替换 `el` 属性指向的 DOM 对象。完成模板中的 html 渲染到 html 页面中。此过程中进行 ajax 交互。
5. **beforeUpdate（更新前）**：响应式数据更新时调用，此时虽然响应式数据更新了，但是对应的真实 DOM 还没有被渲染。
6. **updated（更新后）**：在由于数据更改导致的虚拟 DOM 重新渲染和打补丁之后调用。此时 DOM 已经根据响应式数据的变化更新了。调用时，组件 DOM 已经更新，所以可以执行依赖于 DOM 的操作。然而在大多数情况下，应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用。
7. **beforeDestroy（销毁前）**：实例销毁之前调用。这一步，实例仍然完全可用，`this` 仍能获取到实例。
8. **destroyed（销毁后）**：实例销毁后调用，调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务端渲染期间不被调用。

另外还有 `keep-alive` 独有的生命周期，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `activated` 钩子函数。

### 2. 父子组件执行顺序

**加载渲染过程：**

1. 父组件 beforeCreate
2. 父组件 created
3. 父组件 beforeMount
4. 子组件 beforeCreate
5. 子组件 created
6. 子组件 beforeMount
7. 子组件 mounted
8. 父组件 mounted

**更新过程：**

1. 父组件 beforeUpdate
2. 子组件 beforeUpdate
3. 子组件 updated
4. 父组件 updated

**销毁过程：**

1. 父组件 beforeDestroy
2. 子组件 beforeDestroy
3. 子组件 destroyed
4. 父组件 destroyed

### 3. created 和 mounted 区别

- created:在模板渲染成 html 前调用，即通常初始化某些属性值，然后再渲染成视图。
- mounted:在模板渲染成 html 后调用，通常是初始化页面完成后，再对 html 的 dom 节点进行一些需要的操作。

### 4. 异步请求

我们可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面加载时间，用户体验更好；
- SSR 不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。

## 三、组件通信

### 1. props 传递

- 适用场景：父组件传递数据给子组件
- 子组件设置 props 属性，定义接收父组件传递过来的参数
- 父组件在使用子组件标签中通过字面量来传递值

```js
// Children.vue
props:{
    // 字符串形式
 name:String // 接收的类型参数
    // 对象形式
    age:{
        type:Number, // 接收的类型为数值
        default:18,  // 默认值为18
       require:true // age属性必须传递
    }
}

// Father.vue
<Children name="jack" age="18" />
```

### 2. $emit 触发自定义事件

- 适用场景：子组件传递数据给父组件
- 子组件通过$emit触发自定义事件，$emit 第二个参数为传递的数值
- 父组件绑定监听器获取到子组件传递过来的参数

```js
// Children.vue
this.$emit('add', good)

// Father.vue
<Children @add="cartAdd($event)" />
```

### 3. ref / $refs

- 父组件在使用子组件的时候设置 ref
- 父组件通过设置子组件 ref 来获取数据

```js
<Children ref='foo' />;

this.$refs.foo; // 获取子组件实例，通过子组件实例我们就能拿到对应的数据
```

### 4. EventBus

- 使用场景：兄弟组件传值
- 创建一个中央事件总线 EventBus
- 兄弟组件通过$emit触发自定义事件，$emit 第二个参数为传递的数值
- 另一个兄弟组件通过$on 监听自定义事件

```js
// Bus.js
// 创建一个中央时间总线类
class Bus {
  constructor() {
    this.callbacks = {}; // 存放事件的名字
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}

// main.js
Vue.prototype.$bus = new Bus(); // 将$bus挂载到vue实例的原型上
// 另一种方式
Vue.prototype.$bus = new Vue(); // Vue已经实现了Bus的功能

// Children1.vue
this.$bus.$emit('foo');

// Children2.vue
this.$bus.$on('foo', this.handle);
```

### 5. $parent 或 $root

- 通过共同祖辈$parent或者$root 搭建通信桥连

```js
// Children1.vue
this.$parent.on('add', this.add);

// Children2.vue
this.$parent.emit('add');
```

### 6. $attrs 与$ listeners

- 适用场景：祖先传递数据给子孙
- 设置批量向下传属性$attrs 和 $listeners
- 包含了父级作用域中不作为 prop 被识别 (且获取) 的特性绑定 ( class 和 style 除外)。
- 可以通过 v-bind="$attrs" 传⼊内部组件

```vue
<!-- child：并未在props中声明foo -->
<p>{{$attrs.foo}}</p>

<!-- parent -->
<HelloWorld foo="foo" />
```

```vue
<!-- 给Grandson隔代传值，communication/index.vue -->
<Child2 msg="***" @some-event="onSomeEvent"></Child2>

<!-- Child2做展开 -->
<Grandson v-bind="$attrs" v-on="$listeners"></Grandson>

<!-- Grandson使⽤ -->
<div @click="$emit('some-event', 'msg from grandson')">
  {{msg}}
</div>
```

### 7. provide 与 inject

- 在祖先组件定义 provide 属性，返回传递的值
- 在后代组件通过 inject 接收组件传递过来的值

```js
// 祖先组件
provide(){
    return {
        foo:'foo'
    }
}

// 后代组件
inject:['foo'] // 获取到祖先组件传递过来的值
```

### 8. Vuex

- 适用场景: 复杂关系的组件数据传递
- Vuex 作用相当于一个用来存储共享变量的容器
- state 用来存放共享变量的地方
- getter，可以增加一个 getter 派生状态，（相当于 store 中的计算属性），用来获得共享变量的值
- mutations 用来存放修改 state 的方法。
- actions 也是用来存放修改 state 的方法，不过 action 是在 mutations 的基础上进行。常用来做一些异步操作

### 9. 总结

- **父子关系**的组件数据传递选择 `props` 与 `$emit` 进行传递，也可选择 `ref`
- **兄弟关系**的组件数据传递可选择 `EventBus`，其次可以选择 `$parent` 进行传递
- **祖先与后代**组件数据传递可选择 `$attrs` 与 `$listeners` 或者 `Provide` 与 `Inject`
- **复杂关系**的组件数据传递可以通过 `vuex` 存放共享的变量

## 四、Vue-router 路由

### 1. 懒加载

**正常路由**

```js
import List from '@/components/list.vue';
const router = new VueRouter({
  routes: [{ path: '/list', component: List }],
});
```

1. 箭头函数+import

```js
const router = new VueRouter({
  routes: [{ path: '/list', component: () => import('@/components/list.vue') }],
});
```

2. 箭头函数+require

```js
const router = new VueRouter({
  routes: [
    {
      path: '/list',
      component: (resolve) => require(['@/components/list.vue'], resolve),
    },
  ],
});
```

3. require.ensure

```js
const router = new VueRouter({
  routes: [
    {
      path: '/list',
      component: (resolve) =>
        require.ensure(
          [],
          () => resolve(require('@/components/list.vue')),
          'list'
        ),
    },
  ],
});
```

### 2. 获取页面 hash 变化

```js
// 监听,当路由发生变化的时候执行
watch: {
  $route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
},
```

### 3. $route 和 $router 区别

- `$route` 是“**路由信息对象**”，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数
- `$router` 是“**路由实例**”对象包括了路由的跳转方法，钩子函数等。

### 4. 动态路由

#### params 方式

- 配置路由格式：`/router/:id`
- 传递的方式：在 path 后面跟上对应的值
- 传递后形成的路径：`/router/123`

1. 路由定义

```js
//在APP.vue中
<router-link :to="'/user/'+userId" replace>用户</router-link>

//在index.js
{
   path: '/user/:useId',
   component: User,
},
```

2. 路由跳转

```js
// 方法1：
<router-link :to="{ name: 'users', params: { userName: 'AAA'}}">按钮</router-link>

// 方法2：
this.$router.push({name:'users',params:{userName:'AAA'}})

// 方法3：
this.$router.push('/user/' + 'AAA')
```

3. 参数获取

```js
this.$route.params.userId;
```

#### query 方式

- 配置路由格式：`/router`，也就是普通配置
- 传递的方式：对象中使用 query 的 key 作为传递方式
- 传递后形成的路径：`/route?id=123`

1. 路由定义

```js
//方式1：直接在router-link 标签上以对象的形式
<router-link :to="{path:'/profile',query:{name:'BBB',age:28,height:198}}">档案</router-link>

// 方式2：写成按钮以点击事件形式
<button @click='profileClick'>我的</button>

profileClick(){
  this.$router.push({
    path: "/profile",
    query: {
        name: "BBB",
        age: "28",
        height: 198
    }
  });
}
```

2. 路由跳转

```js
// 方法1：
<router-link :to="{ name: 'users', query: { userName: 'CCC' }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ userName:'CCC' }})

// 方法3：
<router-link :to="{ path: '/users', query: { userName:'CCC' }}">按钮</router-link>

// 方法4：
this.$router.push({ path: '/users', query:{ userName:'CCC' }})

// 方法5：
this.$router.push('/users?userName=' + 'CCC')
```

3. 参数获取

```js
this.$route.query.userName;
```

### 5. 导航守卫

1. 全局路由钩子

- **`router.beforeEach`** 全局前置守卫 进入路由之前，可用做判断是否登陆，没有就跳转到登录页面
  ```js
  router.beforeEach((to, from, next) => {
    let ifInfo = Vue.prototype.$common.getSession('userData'); // 判断是否登录的存储信息
    if (!ifInfo) {
      // sessionStorage里没有储存user信息
      if (to.path == '/') {
        //如果是登录页面路径，就直接next()
        next();
      } else {
        //不然就跳转到登录
        Message.warning('请重新登录！');
        window.location.href = Vue.prototype.$loginUrl;
      }
    } else {
      return next();
    }
  });
  ```
- **`router.beforeResolve`** 全局解析守卫（2.5.0+）在 beforeRouteEnter 调用之后调用
- **`router.afterEach`** 全局后置钩子 进入路由之后，可用作跳转之后滚动条回到顶部
  ```js
  router.afterEach((to, from) => {
    // 跳转之后滚动条回到顶部
    window.scrollTo(0, 0);
  });
  ```

2. 单个路由独享钩子

- **`beforeEnter`**

```js
export default [
  {
    path: '/',
    name: 'login',
    component: login,
    beforeEnter: (to, from, next) => {
      console.log('即将进入登录页面');
      next();
    },
  },
];
```

3. 组件内钩子

- **`beforeRouteEnter`** 进入组件前触发
- **`beforeRouteUpdate`** 当前地址改变并且改组件被复用时触发，举例来说，带有动态参数的路径`foo/∶id`，在 `/foo/1` 和 `/foo/2` 之间跳转的时候，由于会渲染同样的 `foo`组件，这个钩子在这种情况下就会被调用
- **`beforeRouteLeave`** 离开组件被调用

注意，`beforeRouteEnter` 组件内还访问不到 `this`，因为该守卫执行前组件实例还没有被创建，需要传一个回调给 `next` 来访问，例如：

```js
beforeRouteEnter(to, from, next) {
    next(target => {
        if (from.path == '/classProcess') {
            target.isFromProcess = true
        }
    })
}
```

### 6. 与 location.href 区别

- 使用 `location.href=/url` 来跳转，简单方便，但是刷新了页面；
- 使用 `history.pushState(/url)` ，无刷新页面，静态跳转；
- 引进 router ，然后使用 `router.push(/url)` 来跳转，使用了 `diff` 算法，实现了按需加载，减少了 dom 的消耗。其实使用 router 跳转和使用 `history.pushState()` 没什么差别的，因为 vue-router 就是用了 `history.pushState()` ，尤其是在 history 模式下。

## 五、Vuex 状态管理

### 1. 流程 / 原理

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样可以方便地跟踪每一个状态的变化。

![vuex](/images/vuex.png)

**核心流程：**

- Vue Components 是 vue 组件，组件会触发（dispatch）一些事件或动作，也就是图中的 Actions;
- 在组件中发出的动作，肯定是想获取或者改变数据的，但是在 vuex 中，数据是集中管理的，不能直接去更改数据，所以会把这个动作提交（Commit）到 Mutations 中;
- 然后 Mutations 就去改变（Mutate）State 中的数据;
- 当 State 中的数据被改变之后，就会重新渲染（Render）到 Vue Components 中去，组件展示更新后的数据，完成一个流程。

**各模块功能：**

- `Vue Components`∶ Vue 组件。HTML 页面上，负责接收用户操作等交互行为，执行 dispatch 方法触发对应 action 进行回应。
- `Dispatch`∶ 操作行为触发方法，是唯一能执行 action 的方法。
- `Actions`∶ 操作行为处理模块。负责处理 Vue Components 接收到的所有交互行为。包含**同步/异步**操作，支持多个同名方法，按照注册的顺序依次触发。向后台 API 请求的操作就在这个模块中进行，包括触发其他 action 以及提交 mutation 的操作。该模块提供了 Promise 的封装，以支持 action 的链式触发。
- `Commit`∶ 状态改变提交操作方法。对 mutation 进行提交，是唯一能执行 mutation 的方法。
- `Mutation`∶ 状态改变操作方法。是 Vuex 修改 state 的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行**同步操作**，且方法名只能全局唯一。操作之中会有一些 hook 暴露出来，以进行 state 的监控等。
- `State`∶ 页面状态管理容器对象。集中存储 Vue Components 中 data 对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用 Vue 的细粒度数据响应机制来进行高效的状态更新。
- `Getter`∶ state 对象读取方法。图中没有单独列出该模块，应该被包含在了 render 中，Vue Components 通过该方法读取全局 state 对象，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- `Module`：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

**总结：**
Vuex 实现了一个单向数据流，在全局拥有一个 State 存放数据，当组件要更改 State 中的数据时，必须通过 Mutation 提交修改信息， Mutation 同时提供了订阅者模式供外部插件调用获取 State 数据的更新。而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走 Action ，但 Action 也是无法直接修改 State 的，还是需要通过 Mutation 来修改 State 的数据。最后，根据 State 的变化，渲染到视图上。

Vuex 实现原理是将 state 的数据通过 new Vue() 后，将数据转为响应式的。同时，将 getter 里面定义的数据通过 new Vue() 的 computed 实现了计算属性的特点，只有当它的依赖值发生了改变才会被重新计算。

### 2. mutation 和 action 区别

action 中处理异步操作，mutation 最好不要。（ mutation 处理异步操作页面数据会修改，但是 devtools 里面的值还是原来的并没有修改。出现了数据不一致，无法追踪数据变化。）
mutation 做原子操作
action 可以整合多个 mutation

#### Mutation

mutation 中的操作是一系列的同步函数，用于修改 state 中的变量的的状态。当使用 vuex 时需要通过 commit 来提交需要操作的内容。mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```js
const store = new Vuex.Store({
  // 开启严格模式, 确保state中的数据只能通过mutation进行修改, 不能直接修改, 否则抛出错误，便于监控数据的流动
  strict: true,
  state: {
    count: 1,
  },
  mutations: {
    increment(state) {
      state.count++; // 变更状态
    },
  },
});

// 触发调用
store.commit('increment');
```

**为什么 Vuex 的 mutation 中不能做异步操作？**

- Vuex 中所有的状态更新的唯一途径都是 mutation，异步操作通过 Action 来提交 mutation 实现，这样可以方便地跟踪每一个状态的变化，从而能够实现一些工具帮助更好地了解我们的应用。
- 每个 mutation 执行完成后都会对应到一个新的状态变更，这样 devtools 就可以打个快照存下来，然后就可以实现 time-travel 了。如果 mutation 支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

#### Action

action 类似于 mutation，不同点在于：

- action 可以包含任意异步操作。
- action 提交的是 mutation，而不是直接变更状态。

```js
const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment(context) {
      context.commit('increment');
    },
  },
});
```

action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。
所以，两者的不同点如下：

- mutation 专注于修改 State，理论上是修改 State 的唯一途径；action 业务代码、异步请求。
- mutation：必须同步执行；action：可以异步，但不能直接操作 state。
- 在视图更新时，先触发 actions，actions 再触发 mutation
- mutation 的参数是 state，它包含 store 中的数据；store 的参数是 context，它是 state 的父级，包含 state、getters

### 3. Redux 和 Vuex 区别

#### Redux 和 Vuex 区别

- Vuex 改进了 Redux 中的 Action 和 Reducer 函数，以 mutations 变化函数取代 Reducer，无需 switch，只需在对应的 mutation 函数里改变 state 值即可
- Vuex 由于 Vue 自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的 State 即可
- Vuex 数据流的顺序是 ∶View 调用 store.commit 提交对应的请求到 Store 中对应的 mutation 函数->store 改变（vue 检测到数据变化自动渲染）

通俗点理解就是，vuex 弱化 dispatch，通过 commit 进行 store 状态的一次更变;取消了 action 概念，不必传入特定的 action 形式进行指定变更;弱化 reducer，基于 commit 参数直接对数据进行转变，使得框架更加简易;

#### 共同思想

- 单—的数据源
- 变化可以预测

**本质上**：redux 与 vuex 都是对 mvvm 思想的服务，将数据从视图中抽离的一种方案;
**形式上**：vuex 借鉴了 redux，将 store 作为全局的数据中心，进行 mode 管理;

## 六、Vue 3.0

### Proxy 对比

Proxy 的优势如下:

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题，而且无法用 polyfill 磨平

### Vue-Composition-Api

- 原理：
  在 Vue 中，之所以 setup 函数只执行一次，后续对于数据的更新也可以驱动视图更新，归根结底在于它的「响应式机制」

- 对比：
  1. 与 React Hooks 相同级别的逻辑组合功能，但有一些重要的区别。 与 React Hook 不同，setup 函数仅被调用一次，这在性能上比较占优。
  2. 对调用顺序没什么要求，每次渲染中不会反复调用 Hook 函数，产生的的 GC 压力较小。
  3. 不必考虑几乎总是需要 useCallback 的问题，以防止传递函数 prop 给子组件的引用变化，导致无必要的重新渲染。
  4. React Hook 有臭名昭著的闭包陷阱问题，如果用户忘记传递正确的依赖项数组，useEffect 和 useMemo 可能会捕获过时的变量，这不受此问题的影响。 Vue 的自动依赖关系跟踪确保观察者和计算值始终正确无误。
  5. 不得不提一句，React Hook 里的「依赖」是需要你去手动声明的，而且官方提供了一个 eslint 插件，这个插件虽然大部分时候挺有用的，但是有时候也特别烦人，需要你手动加一行丑陋的注释去关闭它。

## 七、虚拟 DOM

### Diff

diff 学习 snabbdom.js
双端标记学习 cito.js
Vue 的数据检测原理是可以知道哪里用到了某个数据，数据变化的时候可以直接通知到对应的 watcher 进行修改。那为什么还需要用 diff 算法呢？因为粒度太细，会有很多 watcher 同时观察某个状态，会有一些内存开销以及一些依赖追踪的开销，所以 Vue.js 2.0 采用了一个中等粒度的解决方案，状态侦测不再细化到某个具体节点，而是组件，组件内部通过虚拟 DOM 来渲染视图，这可以大大缩减依赖数量和 watcher 数量

在 Vue.js 2.0 版本中组件更新渲染的时候，会使用新创建的虚拟节点和将上一次渲染时缓存的虚拟节点进行对比，然后根据对比结果只更新需要更新的真实 DOM 节点，从而避免不必要的 DOM 操作，节省一定的性能。
在采取 diff 算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较。

diff 算法源码执行函数依次是：

#### patch (oldVnode, vnode) ：

- 调用 sameVnode 方法根据 tag、key 判断是否为相同元素：
- 相同则走 `patchVnode()` 进行深度比较，得出最小差异
- 不同则创建新的删除旧的

#### patchVnode (oldVnode, vnode)

如果新旧 VNode 都是静态（`isStatic`）的，同时它们的 key 相同（代表同一节点），并且新的 VNode 是 clone 或者是标记了 once（标记 `v-once` 属性，只渲染一次），那么只需要替换 `elm` 以及 `componentInstance` 即可

1. 如果 oldVnode 和 Vnode **都有文本节点且不相等**，那么会将 oldVnode 的文本节点更新为 Vnode 的文本节点

2. 如果 oldVnode 和 Vnode 均有子节点，则执行 **`updateChildren`** 对子节点进行 diff 操作，这也是 diff 的核心部分

3. 如果 oldVnode 有文本节点而 Vnode 有子节点，则将 oldVnode 的文本节点清空，然后插入 Vnode 的子节点

4. 如果 oldVnode 有子节点而 Vnode 没有子节点，则删除 el 的所有子节点

5. 如果 oldVnode 有文本节点但和 Vnode 一样没有子节点，则清空 oldVnode 的文本节点即可

#### updateChildren (parentElm, oldCh, newCh)

通过`双端标记法`
对比新老 children 的 start 和 end 是否相等，头头、尾尾、头尾、尾头

如果四种都未命中则拿新 children 的开始的 key 去老 children 里找：

- 没有的话直接添加
- 有的话对比 tag(sel)是否相等：
  - 不等则直接添加
  - 相等的话，调用 patchVnode 后。将找到的 old 节点值为 undefine，然后添加新的节点

### v-for 的 key

在虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNode。

如果不使用 key，Vue 会使用一种最大限度减少新增或删除元素并且尽可能地尝试修复/再利用相同类型元素的算法。（就地复用 tag 相同的真实 DOM 元素）。

使用 key, 则直接复用 key 值相同的元素。

带 key 的组件能够触发过渡效果，以及触发组件的声明周期
