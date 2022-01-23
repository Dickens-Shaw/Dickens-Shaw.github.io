## MVC、MVVM

View 和 Model：

- View 很简单，就是用户看到的视图
- Model 同样很简单，一般就是本地数据和数据库中的数据

### MVC

传统的 MVC 架构通常是使用控制器更新模型，视图从模型中获取数据去渲染。当用户有输入时，会通过控制器去更新模型，并且通知视图进行更新。

但是 MVC 有一个巨大的缺陷就是控制器承担的责任太大了，随着项目愈加复杂，控制器中的代码会越来越臃肿，导致出现不利于维护的情况。

### MVVM

引入了 ViewModel 的概念。ViewModel 只关心数据和业务的处理，不关心 View 如何处理数据，在这种情况下，View 和 Model 都可以独立出来，任何一方改变了也不一定需要改变另一方，并且可以将一些可复用的逻辑放在一个 ViewModel 中，让多个 View 复用这个 ViewModel。

以 Vue 框架来举例：

- ViewModel 就是组件的实例。View 就是模板，Model 的话在引入 Vuex 的情况下是完全可以和组件分离的。
- 除了以上三个部分，其实在 MVVM 中还引入了一个隐式的 Binder 层，实现了 View 和 ViewModel 的绑定。
- 这个隐式的 Binder 层就是 Vue 通过解析模板中的插值和指令从而实现 View 与 ViewModel 的绑定。

对于 MVVM 来说，其实最重要的并不是通过双向绑定或者其他的方式将 View 与 ViewModel 绑定起来，而是 `通过 ViewModel 将视图中的状态和用户的行为分离出一个抽象`，这才是 MVVM 的精髓

## 虚拟 DOM

就是一个普通的 JavaScript 对象，包含了 tag(selector)、props(data)、children 三个属性

- 实现：

  1. 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
  2. diff 算法 — 比较两棵虚拟 DOM 树的差异；
  3. pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树

- 优势：
  1. 保证性能下限: 虚拟 DOM 可以经过 diff 找出最小差异,然后批量进行 patch,这种操作虽然比不上手动优化,但是比起粗暴的 DOM 操作性能要好很多,因此虚拟 DOM 可以保证性能下限
  2. 无需手动操作 DOM: 虚拟 DOM 的 diff 和 patch 都是在一次更新中自动进行的,我们无需手动操作 DOM,极大提高开发效率
  3. 跨平台: 虚拟 DOM 本质上是 JavaScript 对象,而 DOM 与平台强相关,相比之下虚拟 DOM 可以进行更方便地跨平台操作,例如服务器渲染、移动端开发等等
  4. 实现组件的高度抽象化

## 前端路由

本质就是监听 URL 的变化，然后匹配路由规则，显示相应的页面，并且无须刷新

- hash 模式

  当 # 后面的哈希值发生变化时，不会向服务器请求数据，可以通过 hashchange 事件来监听到 URL 的变化，从而进行跳转页面

- history 模式

  - 利用 HTML5 中 history 提供的 pushState、replaceState 这两个 API。它们提供了操作浏览器历史栈的方法。pushState、replaceState 能够在不加载页面的情况下改变浏览器的 URL

  - 通过 pushState 和 replaceState 虽然能改变 URL，但是不会主动触发浏览器 reload。

  - pushState、replaceState 的区别是 history.pushState()是新增历史记录条目； history.replaceState()是修改（替换）当前历史记录条目 window.onpopstate 事件监听的是浏览器前进、后退事件

- 对比
  1. Hash 模式只可以更改 # 后面的内容，History 模式可以通过 API 设置任意的同源 URL
  2. History 模式可以通过 API 添加任意类型的数据到历史记录中，Hash 模式只能更改哈希值，也就是字符串
  3. Hash 模式无需后端配置，并且兼容性好。History 模式在用户手动输入地址或者刷新页面的时候会发起 URL 请求，后端需要配置 index.html 页面用于匹配不到静态资源的时候

## Vue

### 基本原理

当一个 Vue 实例创建时，vue 会遍历 data 选项的属性，用 Object.defineProperty（vue3.0 使用 proxy ）将它们转为 getter/setter 并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

### 响应式原理

1. 任何一个 Vue Component 都有一个与之对应的 Watcher 实例。
2. Vue 的 data 上的属性会被添加 getter 和 setter 属性。
3. 当 Vue Component render 函数被执行的时候, data 上会被 触碰(touch), 即被读, getter 方法会被调用, 此时 Vue 会去记录此 Vue component 所依赖的所有 data。(这一过程被称为依赖收集)
4. data 被改动时（主要是用户操作）, 即被写, setter 方法会被调用, 此时 Vue 会去通知所有依赖于此 data 的组件去调用他们的 render 函数进行更新。

通过数据劫持结合发布-订阅模式实现：

- 在初始化 data props 时，递归对象，给每一个属性双向绑定，对于数组而言，会拿到原型重写函数，实现手动派发更新。因为函数不能监听到数据的变动，和 proxy 比较一下。
- 除了以上数组函数，通过索引改变数组数据或者给对象添加新属性也不能触发，需要使用自带的 set 函数，这个函数内部也是手动派发更新
- 在组件挂载时，会实例化渲染观察者，传入组件更新的回调。在实例化过程中，会对模板中的值对象进行求值，触发依赖收集。在触发依赖之前，会保存当前的渲染观察者，用于组件含有子组件的时候，恢复父组件的观察者。触发依赖收集后，会清理掉不需要的依赖，性能优化，防止不需要的地方去重复渲染。
- 改变值会触发依赖更新，会将收集到的所有依赖全部拿出来，放入 nextTick 中统一执行。执行过程中，会先对观察者进行排序，渲染的最后执行。先执行 beforeupdate 钩子函数，然后执行观察者的回调。在执行回调的过程中，可能 watch 会再次 push 进来，因为存在在回调中再次赋值，判断无限循环。

1. 实现一个监听器 Observer：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。

```js
function definereactive(obj, key, val) {
  var dep = new Dep()
  Object.defineProperty(obj, key, {
    get: function () {
      //添加订阅者watcher到主题对象Dep
      if (Dep.target) {
        // js的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
        dep.addSub(Dep.target)
      }
      return val
    },
    set: function (newVal) {
      if (newVal === val) return
      val = newVal
      console.log(val)
      // 作为发布者发出通知
      dep.notify() //通知后dep会循环调用各自的update方法更新视图
    },
  })
}
function observe(obj, vm) {
  Object.keys(obj).forEach(function (key) {
    definereactive(vm, key, obj[key])
  })
}
```

2. 实现一个解析器 Compile：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。

3. 实现一个订阅者 Watcher：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。

```js
function Watcher(vm, node, name, type) {
  Dep.target = this
  this.name = name
  this.node = node
  this.vm = vm
  this.type = type
  this.update()
  Dep.target = null
}
Watcher.prototype = {
  update: function () {
    this.get()
    this.node[this.type] = this.value // 订阅者执行相应操作
  },
  // 获取data的属性值
  get: function () {
    console.log(1)
    this.value = this.vm[this.name] //触发相应属性的get
  },
}
```

4.实现一个订阅器 Dep：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

```js
function Dep() {
  this.subs = []
}
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub)
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update()
    })
  },
}
```

5. ![blockchain](../_media/imgs/vue.png)

### 单项数据流

所有 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外修改父组件的状态。
额外的，每次父组件发生变更时，子组件中所有 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器控制台中发出警告。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

### 生命周期

1. 在 beforeCreate 钩子函数调用的时候，是获取不到 props 或者 data 中的数据的，因为这些数据的初始化都在 initState 中。

2. 然后会执行 created 钩子函数，在这一步的时候已经可以访问到之前不能访问到的数据，但是这时候组件还没被挂载，所以是看不到的。

3. 接下来会先执行 beforeMount 钩子函数，开始创建 VDOM，最后执行 mounted 钩子，并将 VDOM 渲染为真实 DOM 并且渲染数据。组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子。

4. 接下来是数据更新时会调用的钩子函数 beforeUpdate 和 updated，这两个钩子函数没什么好说的，就是分别在数据更新前和更新后会调用。

5. 另外还有 keep-alive 独有的生命周期，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数。

6. 最后就是销毁组件的钩子函数 beforeDestroy 和 destroyed。前者适合移除事件、定时器等等，否则可能会引起内存泄露的问题。然后进行一系列的销毁操作，如果有子组件的话，也会递归销毁子组件，所有子组件都销毁完毕后才会执行根组件的 destroyed 钩子函数。

### 组件通信

- 父子组件
  1. 父组件通过 props 传递数据给子组件，子组件通过 emit 发送事件传递数据给父组件（单项数据流）
  2. ref、$parent / $children 对象来访问组件实例中的方法和数据
  3. .sync 属性是个语法糖

```vue
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

### 渲染过程

- 初次渲染：

  1. 解析模板为 render 函数
  2. 触发响应式，监听 data 属性的 getter setter
  3. 执行 render 函数，会生成 vnode 并且渲染出页面

- 更新渲染：

  1. 修改 data，触发 setter
  2. 重新执行 render 函数，生成新的 vnode
  3. diff 算法对比新旧 vnode ，更新页面

- 异步渲染

Vue 是组件级更新，如果不采用异步更新，那么每次更新数据都会对当前组件进行重新渲染，所以为了性能， Vue 会在本轮数据更新后，在异步更新视图。核心思想 nextTick 。

dep.notify（） 通知 watcher 进行更新， subs[i].update 依次调用 watcher 的 update ， queueWatcher 将 watcher 去重放入队列， nextTick（ flushSchedulerQueue ）在下一 tick 中刷新 watcher 队列（异步）。

### 编译过程

1. 将模板解析为 AST：
   通过各种各样的正则表达式去匹配模板中的内容，然后将内容提取出来做各种逻辑操作生成一个最基本的 AST 对象
2. 优化 AST：
   对节点进行了静态内容提取，也就是将永远不会变动的节点提取了出来，实现复用 Virtual DOM，跳过对比算法的功能
3. 将 AST 转换为 render 函数：
   遍历整个 AST，根据不同的条件生成不同的代码

### 性能优化

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

### Diff

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

### mixin 和 mixins 区别

mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的，可以全局混入装好的 ajax 或者一些工具函数

mixins 应该是我们最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如上拉下拉加载数据这种逻辑等等。
mixins 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并

### v-show 与 v-if 区别

v-show 只是在 display: none 和 display: block 之间切换。无论初始条件是什么都会被渲染出来，后面只需要切换 CSS，DOM 还是一直保留着的。所以总的来说 v-show 在初始渲染时有更高的开销，但是切换开销很小，更适合于频繁切换的场景。

v-if 的话就得说到 Vue 底层的编译了。当属性初始为 false 时，组件就不会被渲染，直到条件为 true，并且切换条件时会触发销毁/挂载组件，所以总的来说在切换时开销更高，更适合不经常切换的场景。
并且基于 v-if 的这种惰性渲染机制，可以在必要的时候才去渲染组件，减少整个页面的初始渲染开销。

### computed

计算属性，依赖其他属性计算值。并且 computed 的值有缓存，只有当计算值变化才变化触发渲染

依赖两个 watcher，computer watcher 和渲染 watcher。判断计算出的值变化后渲染 watcher 派发更新触发渲染

适用于渲染页面，购物车结算

### watch

更多的是观察的作用,无缓存性，监听到值得变化就会执行回调

配置项有：handler deep immediate

适合做一些复杂业务逻辑，搜索数据

### 组件 data 为什么是函数

因为组件是用来复用的，且 JS 里对象是引用关系，如果组件中 data 是一个对象，那么这样作用域没有隔离，子组件中的 data 属性值会相互影响

如果组件中 data 选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的 data 属性值不会互相影响

而 new Vue 的实例，是根组件不会被复用的，因此不存在引用对象的问题。

### v-for 的 key

在虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNode。

如果不使用 key，Vue 会使用一种最大限度减少新增或删除元素并且尽可能地尝试修复/再利用相同类型元素的算法。（就地复用 tag 相同的真实 DOM 元素）。

使用 key, 则直接复用 key 值相同的元素。

带 key 的组件能够触发过渡效果，以及触发组件的声明周期

### v-model

v-model 在模板编译的时候转换代码

v-model 本质是 :value 和 @input，但是略微有点区别。在输入控件下，有两个事件监听，输入中文时只有当输出中文才触发数据赋值

v-model 和:bind 同时使用，前者优先级更高，如果 :value 会出现冲突

v-model 因为语法糖的原因，还可以用于父子通信

### Vue.set 原理

1. 如果目标是数组，直接使用数组的 splice 方法触发相应式；

2. 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

### nextTick

可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM

在 Vue 2.4 之前都是使用的 microtasks，但是 microtasks 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 macrotasks 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 microtasks，但在特殊情况下会使用 macrotasks，比如 v-on。

对于实现 macrotasks ，会先判断是否能使用 setImmediate ，不能的话降级为 MessageChannel ，以上都不行的话就使用 setTimeout
nextTick 同时也支持 Promise 的使用，会判断是否实现了 Promise，可以的话给 \_resolve 赋值，这样回调函数就能以 promise 的方式调用

### keep-alive

keep-alive 是 Vue 内置组件，主要用于保留组件状态或避免重新渲染。

如果你需要在组件切换的时候，保存一些组件的状态防止多次渲染，就可以使用 keep-alive 组件包裹需要保存的组件。

对于 keep-alive 组件来说，它拥有两个独有的生命周期钩子函数，分别为 activated 和 deactivated 。用 keep-alive 包裹的组件在切换时不会进行销毁，而是缓存到内存中并执行 deactivated 钩子函数，命中缓存渲染后会执行 actived 钩子函数

Props:
include：字符串或正则表达式。只有名称匹配的组件会被缓存。
exclude：字符串或正则表达式。任何名称匹配的组件都不会被缓存。

### Proxy 对比

Proxy 的优势如下:

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化，也就是传说中的新标准的性能红利；

Object.defineProperty 的优势如下:

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平

### Vue-Composition-Api:

- 原理：
  在 Vue 中，之所以 setup 函数只执行一次，后续对于数据的更新也可以驱动视图更新，归根结底在于它的「响应式机制」

- 对比：
  1. 与 React Hooks 相同级别的逻辑组合功能，但有一些重要的区别。 与 React Hook 不同，setup 函数仅被调用一次，这在性能上比较占优。
  2. 对调用顺序没什么要求，每次渲染中不会反复调用 Hook 函数，产生的的 GC 压力较小。
  3. 不必考虑几乎总是需要 useCallback 的问题，以防止传递函数 prop 给子组件的引用变化，导致无必要的重新渲染。
  4. React Hook 有臭名昭著的闭包陷阱问题，如果用户忘记传递正确的依赖项数组，useEffect 和 useMemo 可能会捕获过时的变量，这不受此问题的影响。 Vue 的自动依赖关系跟踪确保观察者和计算值始终正确无误。
  5. 不得不提一句，React Hook 里的「依赖」是需要你去手动声明的，而且官方提供了一个 eslint 插件，这个插件虽然大部分时候挺有用的，但是有时候也特别烦人，需要你手动加一行丑陋的注释去关闭它。

### Vuex

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

### Action 和 mutation 的区别

action 中处理异步操作，mutation 最好不要。（ mutation 处理异步操作页面数据会修改，但是 devtools 里面的值还是原来的并没有修改。出现了数据不一致，无法追踪数据变化。）
mutation 做原子操作
action 可以整合多个 mutation

## React

### Fiber

React Fiber 是一种基于浏览器的单线程调度算法.
React 16 之前 ，reconcilation 算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归.
Fiber：一种将 recocilation （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。

react 在进行组件渲染时，从 setState 开始到渲染完成整个过程是同步的（“一气呵成”）。如果需要渲染的组件比较庞大，js 执行会占据主线程时间较长，会导致页面响应度变差，使得 react 在动画、手势等应用中效果比较差。
为了解决这个问题，react 团队经过两年的工作，重写了 react 中核心算法——reconciliation。并在 v16 版本中发布了这个新的特性。为了区别之前和之后的 reconciler，通常将之前的 reconciler 称为 stack reconciler，重写后的称为 fiber reconciler，简称为 Fiber。

Fiber 可以提升复杂 React 应用的可响应性和性能。Fiber 即是 React 新的调度算法（reconciliation algorithm）
每次有 state 的变化 React 重新计算，如果计算量过大，浏览器主线程来不及做其他的事情，比如 rerender 或者 layout，那例如动画就会出现卡顿现象。
React 制定了一种名为 Fiber 的数据结构，加上新的算法，使得大量的计算可以被拆解，异步化，浏览器主线程得以释放，保证了渲染的帧率。从而提高响应性。
React 将更新分为了两个时期：

- render/reconciliation：可打断，React 在 workingProgressTree 上复用 current 上的 Fiber 数据结构来一步地（通过 requestIdleCallback）来构建新的 tree，标记处需要更新的节点，放入队列中。
- Commit：不可打断。在第二阶段，React 将其所有的变更一次性更新到 DOM 上。

核心思想是将渲染分割成多个事务，更新的时候根据事务优先级来调度执行顺序。之前的更新是直接从父节点递归子节点压栈，执行，弹栈，没有优先级，也不能控制顺序；Fiber 为了实现调度功能，重构了栈，即虚拟栈(virtual stack)，这样栈的执行顺序就能定制了，调度、暂停、终止、复用事务都成为可能。

### 时间分片

Time Slice:
基于可随时打断、重启的 Fiber 架构,可打断当前任务,优先处理紧急且重要的任务,保证页面的流畅运行

1. React 在渲染（render）的时候，不会阻塞现在的线程
2. 如果你的设备足够快，你会感觉渲染是同步的
3. 如果你设备非常慢，你会感觉还算是灵敏的
4. 虽然是异步渲染，但是你将会看到完整的渲染，而不是一个组件一行行的渲染出来
5. 同样书写组件的方式

### 生命周期

在 V16 版本中引入了 Fiber 机制。这个机制一定程度上的影响了部分生命周期的调用，并且也引入了新的 2 个 API 来解决问题。

在之前的版本中，如果你拥有一个很复杂的复合组件，然后改动了最上层组件的 state，那么调用栈可能会很长

调用栈过长，再加上中间进行了复杂的操作，就可能导致长时间阻塞主线程，带来不好的用户体验。Fiber 就是为了解决该问题而生。
Fiber 本质上是一个虚拟的堆栈帧，新的调度器会按照优先级自由调度这些帧，从而将之前的同步渲染改成了异步渲染，在不影响体验的情况下去分段计算更新。
对于如何区别优先级，React 有自己的一套逻辑。对于动画这种实时性很高的东西，也就是 16 ms 必须渲染一次保证不卡顿的情况下，React 会每 16 ms（以内） 暂停一下更新，返回来继续渲染动画。

对于异步渲染，现在渲染有两个阶段：reconciliation 和 commit 。前者过程是可以打断的，后者不能暂停，会一直更新界面直到完成。

- Reconciliation 阶段

  - componentWillMount（UNSAFE）
  - componentWillReceiveProps（UNSAFE）
  - shouldComponentUpdate
  - componentWillUpdate（UNSAFE）

- Commit 阶段

  - componentDidMount
  - componentDidUpdate
  - componentWillUnmount

因为 reconciliation 阶段是可以被打断的，所以 reconciliation 阶段会执行的生命周期函数就可能会出现调用多次的情况，从而引起 Bug。所以对于 reconciliation 阶段调用的几个函数，除了 shouldComponentUpdate 以外，其他都应该避免去使用，并且 V16 中也引入了新的 API 来解决这个问题。

- getDerivedStateFromProps 用于替换 componentWillReceiveProps ，该函数会在初始化和 update 时被调用
- getSnapshotBeforeUpdate 用于替换 componentWillUpdate ，该函数会在 update 后 DOM 更新前被调用，用于读取最新的 DOM 数据。

V16 生命周期函数用法建议
```js
classExampleComponentextendsReact.Component{
  //用于初始化state
  constructor(){}
  //用于替换`componentWillReceiveProps`，该函数会在初始化和`update`时被调用
  //因为该函数是静态函数，所以取不到`this`
  //如果需要对比`prevProps`需要单独在`state`中维护
  staticgetDerivedStateFromProps(nextProps,prevState){}
  //判断是否需要更新组件，多用于组件性能优化
  shouldComponentUpdate(nextProps,nextState){}
  //组件挂载后调用
  //可以在该函数中进行请求或者订阅
  componentDidMount(){}
  //用于获得最新的DOM数据
  getSnapshotBeforeUpdate(){}
  //组件即将销毁
  //可以在此处移除订阅，定时器等等
  componentWillUnmount(){}
  //组件销毁后调用
  componentDidUnMount(){}
  //组件更新后调用
  componentDidUpdate(){}
  //渲染组件函数
  render(){}
  //以下函数不建议使用
  UNSAFE_componentWillMount(){}
  UNSAFE_componentWillUpdate(nextProps,nextState){}
  UNSAFE_componentWillReceiveProps(nextProps){}
}
```

#### 发送请求
我们应当将AJAX 请求放到 componentDidMount 函数中执行，主要原因有下：
React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数。对于 componentWillMount 这个生命周期函数的调用次数会变得不确定，React 可能会多次频繁调用 componentWillMount。如果我们将 AJAX 请求放到 componentWillMount 函数中，那么显而易见其会被触发多次，自然也就不是好的选择。
如果我们将 AJAX 请求放置在生命周期的其他函数中，我们并不能保证请求仅在组件挂载完毕后才会要求响应。如果我们的数据请求在组件挂载之前就完成，并且调用了setState函数将数据添加到组件状态中，对于未挂载的组件则会报错。而在 componentDidMount 函数中进行 AJAX 请求则能有效避免这个问题。

### 事件机制
JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件
好处：
  1. 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
  2. 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象