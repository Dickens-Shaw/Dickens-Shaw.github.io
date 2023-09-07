# Vue

## 基本原理

当一个 Vue 实例创建时，vue 会遍历 data 选项的属性，用 Object.defineProperty（vue3.0 使用 proxy ）将它们转为 getter/setter 并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

![/images/](/images/vue1.png)

## 响应式原理

通过**数据劫持**结合**发布-订阅模式**实现：

1. 实现一个监听器 Observer：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。

```js
function definereactive(obj, key, val) {
  var dep = new Dep();
  Object.defineProperty(obj, key, {
    get: function () {
      //添加订阅者watcher到主题对象Dep
      if (Dep.target) {
        // js的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
        dep.addSub(Dep.target);
      }
      return val;
    },
    set: function (newVal) {
      if (newVal === val) return;
      val = newVal;
      console.log(val);
      // 作为发布者发出通知
      dep.notify(); //通知后dep会循环调用各自的update方法更新视图
    },
  });
}
function observe(obj, vm) {
  Object.keys(obj).forEach(function (key) {
    definereactive(vm, key, obj[key]);
  });
}
```

2. 实现一个解析器 Compile：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。

3. 实现一个订阅者 Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。

```js
function Watcher(vm, node, name, type) {
  Dep.target = this;
  this.name = name;
  this.node = node;
  this.vm = vm;
  this.type = type;
  this.update();
  Dep.target = null;
}
Watcher.prototype = {
  update: function () {
    this.get();
    this.node[this.type] = this.value; // 订阅者执行相应操作
  },
  // 获取data的属性值
  get: function () {
    console.log(1);
    this.value = this.vm[this.name]; //触发相应属性的get
  },
};
```

4.实现一个订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

```js
function Dep() {
  this.subs = [];
}
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    });
  },
};
```

![/images/](/images/vue2.png)

tips：

1. 任何一个 Vue Component 都有一个与之对应的 Watcher 实例。
2. Vue 的 data 上的属性会被添加 getter 和 setter 属性。
3. 当 Vue Component render 函数被执行的时候, data 上会被 触碰(touch), 即被读, getter 方法会被调用, 此时 Vue 会去记录此 Vue component 所依赖的所有 data。(这一过程被称为依赖收集)
4. data 被改动时（主要是用户操作）, 即被写, setter 方法会被调用, 此时 Vue 会去通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新。
5. 在初始化 data props 时，递归对象，给每一个属性双向绑定，对于数组而言，会拿到原型重写函数，实现手动派发更新。因为函数不能监听到数据的变动，和 proxy 比较一下。
6. 除了以上数组函数，通过索引改变数组数据或者给对象添加新属性也不能触发，需要使用自带的 set 函数，这个函数内部也是手动派发更新
7. 在组件挂载时，会实例化渲染观察者，传入组件更新的回调。在实例化过程中，会对模板中的值对象进行求值，触发依赖收集。在触发依赖之前，会保存当前的渲染观察者，用于组件含有子组件的时候，恢复父组件的观察者。触发依赖收集后，会清理掉不需要的依赖，性能优化，防止不需要的地方去重复渲染。
8. 改变值会触发依赖更新，会将收集到的所有依赖全部拿出来，放入 nextTick 中统一执行。执行过程中，会先对观察者进行排序，渲染的最后执行。先执行 beforeupdate 钩子函数，然后执行观察者的回调。在执行回调的过程中，可能 watch 会再次 push 进来，因为存在在回调中再次赋值，判断无限循环。

## 单项数据流

所有 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外修改父组件的状态。
额外的，每次父组件发生变更时，子组件中所有 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器控制台中发出警告。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

## 生命周期

1. 在 beforeCreate 钩子函数调用的时候，是获取不到 props 或者 data 中的数据的，因为这些数据的初始化都在 initState 中。

2. 然后会执行 created 钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的。

3. 接下来会先执行 beforeMount 钩子函数，开始创建 VDOM，最后执行 mounted 钩子，并将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。

4. 接下来是数据更新时会调用的钩子函数 beforeUpdate 和 updated，这两个钩子函数没什么好说的，就是分别在数据更新前和更新后会调用。

5. 另外还有 keep-alive 独有的生命周期，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

6. 最后就是销毁组件的钩子函数 beforeDestroy 和 destroyed。前者适合移除事件、定时器等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 destroyed 钩子函数。

## 组件通信

- 父子组件
  1. 父组件通过 props 传递数据给子组件，子组件通过 emit 发送事件传递数据给父组件（单项数据流）
  2. ref、$parent / $children 对象来访问组件实例中的方法和数据
  3. .sync 属性是个语法糖

```js
<!--父组件中-->
<input :value.sync="value" />
<!--以上写法等同于-->
<input :value="value" @update:value="(v) => (value = v)" />
<!--子组件中-->
<script>
this.$emit('update:value', 1)
</script>
```

- 兄弟组件
  查找父组件中的子组件实现，也就是 this.$parent.$children，在 $children 中可以通过组件 name 查询到需要的组件实例，然后进行通信

- 跨层级组件

  1. provide / inject：祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。
  2. $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。
  3. $listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件

- 任意组件
  Vuex 或者 Event Bus

## 渲染过程

- 初次渲染：

  1. 解析模板为 render 函数
  2. 触发响应式，监听 data 属性的 getter setter
  3. 执行 render 函数，会生成 vnode 并且渲染出页面

- 更新渲染：

  1. 修改 data，触发 setter
  2. 重新执行 render 函数，生成新的 vnode
  3. diff 算法对比新旧 vnode ，更新页面

- 异步渲染

Vue 是组件级更新，如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染，所以为了性能， Vue 会在本轮数据更新后，在异步更新视图。核心思想 nextTick。

如果同一个watcher被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。

`dep.notify（）` 通知 watcher 进行更新， `subs[i].update` 依次调用 `watcher` 的 `update` ， `queueWatcher` 将 `watcher` 去重放入队列， `nextTick（ flushSchedulerQueue ）`在下一 `tick` 中刷新 并执行（已去重）`watcher` 队列（异步）。

## 编译过程

vue 的模版编译过程主要如下：**template -> ast -> render 函数**

vue 在模版编译版本的码中会执行 `compileToFunctions` 将 template 转化为 render 函数：

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

1. **调用parse方法将template转化为 AST（抽象语法树）：**

通过各种各样的正则表达式去匹配模板中的内容，然后将内容提取出来做各种逻辑操作生成一个最基本的 AST 对象
```js
const ast = parse(template.trim(), options)
```
**AST元素节点总共三种类型：type为1表示普通元素、2为表达式、3为纯文本*

2. **对静态节点做优化：**

对节点进行了静态内容提取，也就是将永远不会变动的节点提取了出来打个标记，实现复用 Virtual DOM，跳过对比算法的功能，这对运行时模板更新起到了极大的优化作用。
```js
optimize(ast,options)
```
3. **将 AST 转换为 render 函数：**

generate将ast抽象语法树编译成 render字符串并将静态部分放到 `staticRenderFns` 中，最后通过 `new Function(render)` 生成render函数
```js
const code = generate(ast, options)
```

## 性能优化

- v-if 和 v-show 区分使用场景
- computed 和 watch 区分使用场景
- v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
- 长列表性能优化
- 事件的销毁
- 图片资源懒加载
- 路由懒加载
- 第三方插件的按需引入
- 优化无限列表性能
- 服务端渲染 SSR or 预渲染

## Diff

diff 学习 snabbdom.js
双端标记学习 cito.js
vue 的数据检测原理是可以知道哪里用到了某个数据，数据变化的时候可以直接通知到对应的 watcher 进行修改。那为什么还需要用 diff 算法呢？因为粒度太细，会有很多 watcher 同时观察某个状态，会有一些内存开销以及一些依赖追踪的开销，所以 Vue.js 2.0 采用了一个中等粒度的解决方案，状态侦测不再细化到某个具体节点，而是组件，组件内部通过虚拟 DOM 来渲染视图，这可以大大缩减依赖数量和 watcher 数量

在 Vue.js 2.0 版本中组件更新渲染的时候，会使用新创建的虚拟节点和将上一次渲染时缓存的虚拟节点进行对比，然后根据对比结果只更新需要更新的真实 DOM 节点，从而避免不必要的 DOM 操作，节省一定的性能。
在采取 diff 算法比较新旧节点的时候，比较只会在同层级进行, 不会跨层级比较。

diff 算法源码执行函数依次是：

- patch (oldVnode, vnode) ：
  - 调用 sameVnode 方法更具 tag、key 判断是否为相同元素：
  - 相同则走 patchVnode()
  - 不同则创建新的删除旧的
- patchVnode (oldVnode, vnode)
  - 如果新旧节点都有 children 则调用 updateChildren
  - 否则通过对比新旧节点有无 text 和 children 来做相应的增删或更新
- updateChildren (parentElm, oldCh, newCh)

  通过`双端标记法`
  对比新老 children 的 start 和 end 是否相等，头头、尾尾、头尾、尾头

  如果四种都未命中则拿新 children 的开始的 key 去老 children 里找：

  - 没有的话直接添加
  - 有的话对比 tag(sel)是否相等：
    - 不等则直接添加
    - 相等的话，调用 patchVnode 后。将找到的 old 节点值为 undefine，然后添加新的节点

## mixin 和 mixins 区别

mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的，可以全局混入装好的 ajax 或者一些工具函数

mixins 应该是我们最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如上拉下拉加载数据这种逻辑等等。
mixins 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并

## v-show 与 v-if 区别

v-show 只是在 display: none 和 display: block 之间切换。无论初始条件是什么都会被渲染出来，后面只需要切换 CSS，DOM 还是一直保留着的。所以总的来说 v-show 在初始渲染时有更高的开销，但是切换开销很小，**更适合于频繁切换的场景**。

v-if 会调用`addIfCondition`方法，生成 vnode 的时候会忽略对应节点，render 的时候就不会渲染。当属性切换时会触发销毁/挂载组件，所以总的来说在切换时开销更高，更适合不经常切换的场景。
并且基于 v-if 的这种**惰性渲染机制**，可以在必要的时候才去渲染组件，**减少整个页面的初始渲染开销**。

## computed

计算属性，依赖其他属性计算值。并且 computed 的值有缓存，只有当计算值变化才变化触发渲染

依赖两个 watcher，computer watcher 和渲染 watcher。判断计算出的值变化后渲染 watcher 派发更新触发渲染

适用于渲染页面，如购物车结算等

特点：

- 支持缓存，只有依赖的数据发生了变化，才会重新计算
- 不支持异步，当 Computed 中有异步操作时，无法监听数据的变化
- computed 的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于 data 声明过，或者父组件传递过来的 props 中的数据进行计算的。
- 如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用 computed
- 如果 computed 属性的属性值是函数，那么默认使用 get 方法，函数的返回值就是属性的属性值；在 computed 中，属性有一个 get 方法和一个 set 方法，当数据发生变化时，会调用 set 方法。

## watch

更多的是观察的作用，无缓存性，监听到值得变化就会执行回调

配置项有：handler deep(深度监听) immediate(组件加载立即触发回调函数)

适合做一些复杂业务逻辑，搜索数据，或想要执行异步或者昂贵的操作以响应不断的变化

特点：

- 不支持缓存，数据变化时，它就会触发相应的操作
- 支持异步监听
- 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
- 当一个属性发生变化时，就需要执行相应的操作
- 监听数据必须是 data 中声明的或者父组件传递过来的 props 中的数据，当发生变化时，会触发其他操作

## 组件 data 为什么是函数

Vue 组件可能存在多个实例，如果使用对象形式定义 data，则会导致它们共用一个 data 对象，作用域没有隔离，那么状态变更将会影响所有组件实例，这是不合理的；

采用函数形式定义，在 initData 时会将其作为工厂函数返回全新 data 对象，每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响，有效规避多实例之间状态污染问题。

而在 Vue 根实例创建过程中则不存在该限制，也是因为根实例只能有一个不会被复用，不存在引用对象的问题，所以不需要担心这种情况

## v-for 的 key

在虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNode。

如果不使用 key，Vue 会使用一种最大限度减少新增或删除元素并且尽可能地尝试修复/再利用相同类型元素的算法。（就地复用 tag 相同的真实 DOM 元素）。

使用 key, 则直接复用 key 值相同的元素。

带 key 的组件能够触发过渡效果，以及触发组件的声明周期

## v-model

v-model 在模板编译的时候转换代码

v-model 本质是 :value 和 @input，但是略微有点区别。在输入控件下，有两个事件监听，输入中文时只有当输出中文才触发数据赋值

v-model 和:bind 同时使用，前者优先级更高，如果 :value 会出现冲突

v-model 因为语法糖的原因，还可以用于父子通信，默认会利用名为 value 的 prop 和名为 input 的事件，通过 prop 和 $.emit 实现

## Vue.set 原理

1. 如果目标是数组，直接使用数组的 splice 方法触发相应式；

2. 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

## slot 插槽

是 Vue 的内容分发机制，组件内部的模板引擎使用 slot 元素作为承载分发内容的出口。插槽 slot 是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。

分类：

- 默认插槽：又名匿名插槽，当 slot 没有指定 name 属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
- 具名插槽：带有具体名字的插槽，也就是带有 name 属性的 slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。

原理：

当子组件 vm 实例化时，获取到父组件传入的 slot 标签的内容，存放在 vm.$slot中，默认插槽为vm.$slot.default，具名插槽为 vm.$slot.xxx，xxx 为插槽名，当组件执行渲染函数时候，遇到slot标签，使用$slot 中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

## nextTick

可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

在 Vue 2.4 之前都是使用的 microtasks，但是 microtasks 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macrotasks 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 microtasks，但在特殊情况下会使用 macrotasks，比如 v-on。

**使用场景**

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

## keep-alive

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

## 数组封装

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

## Proxy 对比

Proxy 的优势如下:

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题，而且无法用 polyfill 磨平

## Vue-Composition-Api

- 原理：
  在 Vue 中，之所以 setup 函数只执行一次，后续对于数据的更新也可以驱动视图更新，归根结底在于它的「响应式机制」

- 对比：
  1. 与 React Hooks 相同级别的逻辑组合功能，但有一些重要的区别。 与 React Hook 不同，setup 函数仅被调用一次，这在性能上比较占优。
  2. 对调用顺序没什么要求，每次渲染中不会反复调用 Hook 函数，产生的的 GC 压力较小。
  3. 不必考虑几乎总是需要 useCallback 的问题，以防止传递函数 prop 给子组件的引用变化，导致无必要的重新渲染。
  4. React Hook 有臭名昭著的闭包陷阱问题，如果用户忘记传递正确的依赖项数组，useEffect 和 useMemo 可能会捕获过时的变量，这不受此问题的影响。 Vue 的自动依赖关系跟踪确保观察者和计算值始终正确无误。
  5. 不得不提一句，React Hook 里的「依赖」是需要你去手动声明的，而且官方提供了一个 eslint 插件，这个插件虽然大部分时候挺有用的，但是有时候也特别烦人，需要你手动加一行丑陋的注释去关闭它。

## Vuex

Vuex 把组件的共享状态抽出来，以一个全局单例模式管理。

主要包括：

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。

Vuex 应用的核心就是 store (仓库)。 store 基本上就是一个容器，它包含着你的应用中的大部分 状态 (state). Vuex 和单纯的全局对象有以下两点不同：

1. Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应的得到高效更新。
2. 你不能直接修改 store 中的状态。改变 store 中的状态的唯一途径就是显示地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态地变化。

Vuex 实现原理是将 state 的数据通过 new Vue() 后，将数据转为响应式的。同时，将 getter 里面定义的数据通过 new Vue 的 computed 实现了计算属性的特点，只有当它的依赖值发生了改变才会被重新计算。

### action 和 mutation 的区别

action 中处理异步操作，mutation 最好不要。（ mutation 处理异步操作页面数据会修改，但是 devtools 里面的值还是原来的并没有修改。出现了数据不一致，无法追踪数据变化。）
mutation 做原子操作
action 可以整合多个 mutation
