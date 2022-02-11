## Fiber

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

## 时间分片

Time Slice:
基于可随时打断、重启的 Fiber 架构,可打断当前任务,优先处理紧急且重要的任务,保证页面的流畅运行

1. React 在渲染（render）的时候，不会阻塞现在的线程
2. 如果你的设备足够快，你会感觉渲染是同步的
3. 如果你设备非常慢，你会感觉还算是灵敏的
4. 虽然是异步渲染，但是你将会看到完整的渲染，而不是一个组件一行行的渲染出来
5. 同样书写组件的方式

## 生命周期

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

### 发送请求

我们应当将 AJAX 请求放到 componentDidMount 函数中执行，主要原因有下：
React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数。对于 componentWillMount 这个生命周期函数的调用次数会变得不确定，React 可能会多次频繁调用 componentWillMount。如果我们将 AJAX 请求放到 componentWillMount 函数中，那么显而易见其会被触发多次，自然也就不是好的选择。
如果我们将 AJAX 请求放置在生命周期的其他函数中，我们并不能保证请求仅在组件挂载完毕后才会要求响应。如果我们的数据请求在组件挂载之前就完成，并且调用了 setState 函数将数据添加到组件状态中，对于未挂载的组件则会报错。而在 componentDidMount 函数中进行 AJAX 请求则能有效避免这个问题。

## 事件机制

JSX 上写的事件并没有绑定在对应的真实 DOM 上，而是通过事件代理的方式，将所有的事件都统一绑定在了 document 上。这样的方式不仅减少了内存消耗，还能在组件挂载销毁时统一订阅和移除事件
好处：

1. 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
2. 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象

## 组件通信

- 父子组件

  1. 父组件通过 props 传递数据给子组件，子组件通过调用父组件传来的函数传递数据给父组件
  2. ref 获取子组件实例、props 传 onRef（this）实例给子组件
  3. Slot

- 兄弟组件

  - 通过共同的父组件来管理状态和事件函数

- 跨层级组件

  - 使用 Context API：React.createContext(),使用 Provider 和 Customer 模式,在顶层的 Provider 中传入 value，在子孙级的 Consumer 中获取该值

- 任意组件
  - Redux、 Mobx、flux 或者 Event Bus

## Diff

diff 算法，会对比新老虚拟 DOM，记录下他们之间的变化，然后将变化的部分更新到视图上。其实之前的 diff 算法，是通过循环递归每个节点，然后进行对比，复杂程度为 O(n^3)，n 是树中节点的总数，这样性能是非常差的。

触发更新的时机主要在 state 变化与 hooks 调用之后。此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

- 策略：
  1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
  2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
  3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

基于以上三个策略，React 分别对 tree diff、component diff 以及 element diff 进行了算法优化

- tree diff：基于第一个策略，react 只会对同一层次的节点进行比较

- component diff：

  1. 如果是同一类型的组件，按照原策略继续比较虚拟 dom 树
  2. 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点
  3. 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算的时间，因此 React 允许用户通过 shouldComponentUpdate()判断该组件是否需要进行 diff

- element diff：
  当节点处于同一层级时，React diff 提供了三种节点操作：插入、移动和删除
  1. 插入：新的 component 类型不在老集合里 -> 全新的节点，需要对新节点执行插入操作
  2. 移动：在老集合里有新 component 类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 dom 节点
  3. 删除：老的 component 类型，在新集合中也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者老 component 不在新集合里，也需要执行删除操作

自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。整个更新过程由 current 与 workInProgress 两株树双缓冲完成。workInProgress 更新完成后，再通过修改 current 相关指针指向新节点

## 性能优化

### 两个方向

1. 减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconction(简单的可以理解为 diff)，如果不 render，就不会 reconction。（React.memo 和 useCallback ）
2. 减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。（useMemo ）
   在使用类组件的时候，使用的 React 优化 API 主要是：shouldComponentUpdate 和 PureComponent，这两个 API 所提供的解决思路都是为了减少重新 render 的次数，主要是减少父组件更新而子组件也更新的情况，虽然也可以在 state 更新的时候阻止当前组件渲染，如果要这么做的话，证明你这个属性不适合作为 state，而应该作为静态属性或者放在 class 外面作为一个简单的变量 。

### shouldComponentUpdate

在 shouldComponentUpdate 函数中我们可以通过返回布尔值来决定当前组件是否需要更新。这层代码逻辑可以是简单地浅比较一下当前 state 和之前的 state 是否相同，也可以是判断某个值更新了才触发组件更新。一般来说不推荐完整地对比当前 state 和之前的 state 是否相同，因为组件更新触发可能会很频繁，这样的完整对比性能开销会有点大，可能会造成得不偿失的情况。

当然如果真的想完整对比当前 state 和之前的 state 是否相同，并且不影响性能也是行得通的，可以通过 immutable 库来生成不可变对象。这类库对于操作大规模的数据来说会提升不错的性能，并且一旦改变数据就会生成一个新的对象，对比前后 state 是否一致也就方便多了。

另外如果只是单纯的浅比较一下，可以直接使用 Pure Component，底层就是实现了浅比较 state。

16.6.0 之后的版本的话，可以使用 React.memo 来实现相同的功能

### 21 项优化 React App

1. 使用不可变数据结构
2. 函数/无状态组件和 React.PureComponent
3. 生成多个块文件
4. 在 Webpack 中使用 Production 标识生产环境
5. 依赖优化
6. React.Fragments 用于避免额外的 HTML 元素包裹
7. 避免在渲染函数中使用内联函数定义
8. JavaScript 中事件的防抖和节流
9. 避免在 map 方法中使用 Index 作为组件的 Key
10. 避免使用 props 来初始化 state （直接赋值）
11. 在 DOM 元素上传递 Props
12. 在使用 Redux Connect 时，同时使用 Reselect 来避免组件的频繁重新渲染
13. 记忆化的 React 组件
14. 使用 CSS 动画代替 JS 动画
15. 使用 CDN
16. 在 CPU 扩展任务中使用 Web Workers
17. 虚拟化长列表
18. 分析和优化您的 Webpack 打包
19. 考虑服务端渲染
20. 在 Web 服务器上启用 Gzip 压缩

## Immutable

JavaScript 中的对象一般是可变的（Mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如 `foo={a: 1}; bar=foo; bar.a=2` 你会发现此时 foo.a 也被改成了 2。虽然这样做可以节约内存，但当应用复杂后，这就造成了非常大的隐患，Mutable 带来的优点变得得不偿失。为了解决这个问题，一般的做法是使用 shallow-copy（浅拷贝）或 deep-copy（深拷贝）来避免被修改，但这样做造成了 CPU 和内存的浪费。

Immutable 可以很好地解决这些问题。

### 什么是 IMMUTABLE DATA

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。

优点：

1. Immutable 降低了 Mutable 带来的复杂度：
   可变（Mutable）数据耦合了 Time 和 Value 的概念，造成了数据很难被回溯
2. 节省内存：
   Immutable.js 使用了 Structure Sharing 会尽量复用内存，甚至以前使用的对象也可以再次被复用。没有被引用的对象会被垃圾回收
3. Undo/Redo，Copy/Paste，甚至时间旅行这些功能做起来小菜一碟：
   因为每次数据都是不一样的，只要把这些数据放到一个数组里储存起来，想回退到哪里就拿出对应数据即可，很容易开发出撤销重做这种功能。
4. 并发安全：
   传统的并发非常难做，因为要处理各种数据不一致问题，因此『聪明人』发明了各种锁来解决。但使用了 Immutable 之后，数据天生是不可变的，并发锁就不需要了
5. 拥抱函数式编程：
   Immutable 本身就是函数式编程中的概念，纯函数式编程比面向对象更适用于前端开发。因为只要输入一致，输出必然一致，这样开发的组件更易于调试和组装
   与 Object.freeze、const 区别：
   Object.freeze 和 ES6 中新加入的 const 都可以达到防止对象被篡改的功能，但它们是 shallowCopy 的。对象层级一深就要特殊处理了

## Mixin

缺陷：

1. 组件与 Mixin 之间存在隐式依赖（Mixin 经常依赖组件的特定方法，但在定义组件时并不知道这种依赖关系）
2. 多个 Mixin 之间可能产生冲突（比如定义了相同的 state 字段）
3. Mixin 倾向于增加更多状态，这降低了应用的可预测性（The more state in your application, the harder it is to reason about it.），导致复杂度剧增
4. 隐式依赖导致依赖关系不透明，维护成本和理解成本迅速攀升

## HOC

- 定义：就是类似高阶函数的定义,将组件作为参数或者返回一个组件的组件;

高阶组件是重用组件逻辑的高级方法，是一种源于 React 的组件模式。 HOC 是自定义组件，在它之内包含另一个组件。它们可以接受子组件提供的任何动态，但不会修改或复制其输入组件中的任何行为。你可以认为 HOC 是“纯（Pure）”组件.

- 作用:

  1. 抽取重复代码，实现组件复用，常见场景,页面复用;
  2. 条件渲染，控制组件的渲染逻辑（渲染劫持），常见场景,权限控制;
  3. 捕获/劫持被处理组件的生命周期，常见场景,组件渲染性能追踪、日志打点

- 实现：

  1. 属性代理
  2. 反向继承：利用 super 改变改组件的 this 方向,继而就可以在该组件处理容器组件的一些值

- 优势：

  1. HOC 通过外层组件通过 Props 影响内层组件的状态，而不是直接改变其 State 不存在冲突和互相干扰,这就降低了耦合度
  2. 不同于 Mixin 的打平+合并，HOC 具有天然的层级结构（组件树结构），这又降低了复杂度

- 缺陷：
  1. 扩展性限制: HOC 无法从外部访问子组件的 State 因此无法通过 shouldComponentUpdate 滤掉不必要的更新,React 在支持 ES6 Class 之后提供了 React.PureComponent 来解决这个问题
  2. Ref 传递问题: Ref 被隔断,后来的 React.forwardRef 来解决这个问题
  3. Wrapper Hell: HOC 可能出现多层包裹组件的情况,多层抽象同样增加了复杂度和理解成本
  4. 命名冲突: 如果高阶组件多次嵌套,没有使用命名空间的话会产生冲突,然后覆盖老属性
  5. 不可见性: HOC 相当于在原有组件外层再包装一个组件,你压根不知道外层的包装是啥,对于你是黑盒

## Hooks

> Hooks 让我们在函数组件中可以使用 state 和其他功能

- 原理：
  由于每次渲染都会不断的执行并产生闭包，那么从性能上和 GC 压力上都会稍逊于 Vue3。它的关键字是「每次渲染都重新执行」

- 限制：

  1. 不要在循环，条件或嵌套函数中调用 Hook
  2. 确保总是在你的 React 函数的最顶层调用他们。
  3. 遵守这条规则，你就能确保 Hook 在每一次渲染中都按照同样的顺序被调用。这让 React 能够在多次的 useState 和 useEffect 调用之间保持 hook 状态的正确。

- 优点：

  - 简洁: React Hooks 解决了 HOC 和 Render Props 的嵌套问题,更加简洁
  - 解耦: React Hooks 可以更方便地把 UI 和状态分离,做到更彻底的解耦
  - 组合: Hooks 中可以引用另外的 Hooks 形成新的 Hooks,组合变化万千
  - 函数友好: React Hooks 为函数组件而生,从而解决了类组件的几大问题:
    1. this 指向容易错误
    2. 分割在不同声明周期中的逻辑使得代码难以理解和维护
    3. 代码复用成本高（高阶组件容易使代码量剧增）

- 缺陷：

  1. 额外的学习成本（Functional Component 与 Class Component 之间的困惑）
  2. 写法上有限制（不能出现在条件、循环中），并且写法限制增加了重构成本
  3. 破坏了 PureComponent、React.memo 浅比较的性能优化效果（为了取最新的 props 和 state，每次 render()都要重新创建事件处函数）
  4. 在闭包场景可能会引用到旧的 state、props 值
  5. 内部实现上不直观（依赖一份可变的全局状态，不再那么“纯”）
  6. React.memo 并不能完全替代 shouldComponentUpdate（因为拿不到 state change，只针对 props change）

- 对原有 React 的 API 封装的钩子函数

|        钩子名        | 作用                                                                                                                                                                                                                        |
| :------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       useState       | 初始化和设置状态，返回的是 array 而不是 object 的原因就是为了降低使用的复杂度，返回数组的话可以直接根据顺序解构，而返回对象的话要想使用多次就需要定义别名了                                                                 |
|      useEffect       | componentDidMount，componentDidUpdate 和 componentWillUnmount 和结合体,所以可以监听 useState 定义值的变化                                                                                                                   |
|      useContext      | 定义一个全局的对象,类似 context                                                                                                                                                                                             |
|      useReducer      | 可以增强函数提供类似 Redux 的功能                                                                                                                                                                                           |
|     useCallback      | 记忆作用,共有两个参数，第一个参数为一个匿名函数，就是我们想要创建的函数体。第二参数为一个数组，里面的每一项是用来判断是否需要重新创建函数体的变量，如果传入的变量值保持不变，返回记忆结果。如果任何一项改变，则返回新的结果 |
|       useMemo        | 作用和传入参数与 useCallback 一致,useCallback 返回函数,useMemo 返回值                                                                                                                                                       |
|        useRef        | 获取 ref 属性对应的 dom                                                                                                                                                                                                     |
| useImperativeMethods | 自定义使用 ref 时公开给父组件的实例值                                                                                                                                                                                       |
|  useMutationEffect   | 作用与 useEffect 相同，但在更新兄弟组件之前，它在 React 执行其 DOM 改变的同一阶段同步触发                                                                                                                                   |
|   useLayoutEffect    | 作用与 useEffect 相同，但在所有 DOM 改变后同步触发                                                                                                                                                                          |

## Hooks & Mixin & HOC

- Mixin & HOC 模式的缺点：

  1. 渲染上下文中公开的属性的来源不清楚。 例如，当使用多个 mixin 读取组件的模板时，可能很难确定从哪个 mixin 注入了特定的属性。
  2. 命名空间冲突。 Mixins 可能会在属性和方法名称上发生冲突，而 HOC 可能会在预期的 prop 名称上发生冲突。
  3. 性能问题，HOC 和无渲染组件需要额外的有状态组件实例，这会降低性能。

- Hooks 模式优点：
  1. 暴露给模板的属性具有明确的来源，因为它们是从 Hook 函数返回的值。
  2. Hook 函数返回的值可以任意命名，因此不会发生名称空间冲突。
  3. 没有创建仅用于逻辑重用的不必要的组件实例

## props 和 state

| 条件                 | State | Props |
| -------------------- | :---: | :---: |
| 从父组件中接收初始值 |  Yes  |  Yes  |
| 父组件可以改变值     |  No   |  Yes  |
| 在组件中设置默认值   |  Yes  |  Yes  |
| 在组件的内部变化     |  Yes  |  No   |
| 设置子组件的初始值   |  Yes  |  Yes  |
| 在子组件的内部更改   |  No   |  Yes  |

- props:
  React 中属性的简写。它们是只读组件，必须保持纯，即不可变。它们总是在整个应用中从父组件传递到子组件。子组件永远不能将 prop 送回父组件。这有助于维护单向数据流，通常用于呈现动态生成的数据

- state:
  React 组件的核心，是数据的来源，必须尽可能简单。基本上状态是确定组件呈现和行为的对象。与 props 不同，它们是可变的，并创建动态和交互式组件。可以通过 this.state() 访问它们

## setState

- 原理

  1. 首先调用了 setState 入口函数，入口函数在这里就是充当一个分发器的角色，根据入参的不同，将其分发到不同的功能函数中去；
  2. enqueueSetState 方法将新的 state 放进组件的状态队列里，并调用 enqueueUpdate 来处理将要更新的实例对象；
  3. 在 enqueueUpdate 方法中引出了一个关键的对象——batchingStrategy，该对象所具备的 isBatchingUpdates 属性直接决定了当下是要走更新流程，还是应该排队等待；如果轮到执行，就调用 batchedUpdates 方法来直接发起更新流程。由此可以推测，batchingStrategy 或许正是 React 内部专门用于管控批量更新的对象。

- 调用后发生了什么
  1. React 会将传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程（Reconciliation）。
  2. 经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个 UI 界面。
  3. 在 React 得到元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。
  4. 在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

如果在短时间内频繁 setState。React 会将 state 的改变压入栈中，在合适的时机，批量更新 state 和视图，达到提高性能的效果。

- 同步还是异步

  1. setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
  2. setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的 callback 拿到更新后的结果。
     setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

- 批量更新
  调用 setState 时，组件的 state 并不会立即改变， setState 只是把要修改的 state 放入一个队列， React 会优化真正的执行时机，并出于性能原因，会将 React 事件处理程序中的多次 React 事件处理程序中的多次 setState 的状态修改合并成一次状态修改。 最终更新只产生一次组件及其子组件的重新渲染，这对于大型应用程序中的性能提升至关重要。

- 第二个参数
  该函数会在 setState 函数调用完成并且组件开始重渲染的时候被调用，我们可以用该函数来监听渲染是否完成

## replaceState

setState 是修改其中的部分状态，相当于 Object.assign，只是覆盖，不会减少原来的状态。而 replaceState 是完全替换原来的状态，相当于赋值，将原来的 state 替换为另一个对象，如果新状态属性减少，那么 state 中就没有这个状态了

## Element

### createElement

语法：React.createElement( type, [props], [...children] )
原理：实质上 JSX 的 dom 最后转化为 js 都是 React.createElement

### cloneElement

- 语法：

```js
React.cloneElement(element, [props], [...children])
```

- 作用：这个方法的作用是复制组件,给组件传值或者添加属性
- 核心代码：

```js
React.Children.map(children, (child) => {
  return React.cloneElement(child, {
    count: _this.state.count,
  })
})
```

### Fragment

- 作用：React.Fragment 可以让你聚合一个子元素列表，并且不在 DOM 中增加额外节点
- 简写：<>

## Refs

> React 中引用的简写。它是一个有助于存储对特定的 React 元素或组件的引用的属性，它将由组件渲染配置函数返回。用于对 render() 返回的特定元素或组件的引用。

- 使用场景：
  - 需要管理焦点、选择文本或媒体播放时
  - 触发式动画
  - 与第三方 DOM 库集成

## 纯组件

纯（Pure） 组件是可以编写的最简单、最快的组件。它们可以替换任何只有 render() 的组件。这些组件增强了代码的简单性和应用的性能。

## Key

1. 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识
2. 用于识别唯一的 Virtual DOM 元素及其驱动 UI 的相应数据。它们通过回收 DOM 中当前所有的元素来帮助 React 优化渲染。这些 key 必须是唯一的数字或字符串，React 只是重新排序元素而不是重新渲染它们。这可以提高应用程序的性能

## Reducer

是纯函数，它规定应用程序的状态怎样因响应 ACTION 而改变。Reducers 通过接受先前的状态和 action 来工作，然后它返回一个新的状态。它根据操作的类型确定需要执行哪种更新，然后返回新的值。如果不需要完成任务，它会返回原来的状态.

## children.map

props.children 并不一定是数组类型

如果我们使用 props.children.map 函数来遍历时会受到异常提示，因为在这种情况下 props.children 是对象（object）而不是数组（array）。React 当且仅当超过一个子元素的情况下会将 props.children 设置为数组

优先选择使用 React.Children.map 函数的原因，其已经将 props.children 不同类型的情况考虑在内了

## Dirty component

React 的更新流程（批处理更新）是围绕待更新组件（React 称为 dirtyComponent）来实现，dirtyComponent 即 ReactCompositeComponent 实例。

批处理更新过程如下：

1. 开始一次批处理更新
2. 收集 dirtyComponents
3. 更新 dirtyComponent（更改 UI 的操作在这里）
4. 执行回调（生命周期函数、setState 传入的回调方法）
5. 若在 3、4 间产生了新的 dirtyComponent，重复 3、4 步，直至 dirtyComponents 清空，完成了一次完整的批处理更新

## React.lazy

对于最初 React.lazy() 所返回的 LazyComponent 对象，其 \_status 默认是 -1，所以首次渲染时，会进入 readLazyComponentType 函数中的 default 的逻辑，这里才会真正异步执行 import(url)操作，由于并未等待，随后会检查模块是否 Resolved，如果已经 Resolved 了（已经加载完毕）则直接返回 moduleObject.default（动态加载的模块的默认导出），否则将通过 throw 将 thenable 抛出到上层

React 捕获到异常之后，会判断异常是不是一个 thenable，如果是则会找到 SuspenseComponent ，如果 thenable 处于 pending 状态，则会将其 children 都渲染成 fallback 的值，一旦 thenable 被 resolve 则 SuspenseComponent 的子组件会重新渲染一次

## forceUpdate()

如果你的 render() 方法依赖于一些其他数据，你可以告诉 React 组件需要通过调用 forceUpdate() 重新渲染。

调用 forceUpdate() 会导致组件跳过 shouldComponentUpdate() ，直接调用 render()。 这将触发子组件的正常生命周期方法，包括每个子组件的 shouldComponentUpdate() 方法。

forceUpdate 就是重新 render，使用场景：

1. 有些变量不在 state 上，但是你又想达到这个变量更新的时候，刷新 render；
2. state 里的某个变量层次太深，更新的时候没有自动触发 render

## 异常捕获边界

在部分 UI 中出现的 JavaScript 异常是不应该导致整个应用的崩溃的。为了解决这个问题，React16 引进了一个新的概念“异常捕获边界(Error Boundaries)“。

异常捕获边界是一种 React 组件，它能够捕获在它子组件树中出现的任何 JavaScript 异常，将它们打印出来并展示一个备用 UI，这样就不会导致组件树的崩溃。异常捕获边界能够捕获它的子组件数中在渲染，生命周期方法和构造函数中出现的任何异常。

只要在组件中定义其中一个及以上的生命周期方法（static getDerivedStateFromError()或 componentDidCatch()），那么这个组件就变成了异常捕获边界。当异常被抛出时使用 static getDerivedStateFromError()来渲染一个备用 UI，使用 componentDidCatch()来打印异常信息。

## Context

context 提供了一种数据传输方式，它使得数据可以直接通过组件树传递而不需要在每一个层级上手动地传递 props。
在典型的 React 应用中，数据是通过 props 自上而下（父组件传递给子组件）传递的，但是对于同时被许多组件所需要的某些 props（如个人偏好，UI 主题）来说，使用这种方式传递数据简直就是受刑。Context 提供了不需要显式地在组件树上每个层级传递 prop 而是直接在组件之间传递的方法。

## react-router 实现思想

1. 基于 history 库来实现上述不同的客户端路由实现思想，并且能够保存历史记录等，磨平浏览器差异，上层无感知
2. 通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render

## 组件设计相关

### 组件划分

根据组件的职责通常把组件分为 UI 组件和容器组件。
UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。
两者通过 React-Redux 提供 connect 方法联系起来。

## 函数/无状态/展示组件

函数或无状态组件是一个纯函数，它可接受接受参数，并返回 react 元素。这些都是没有任何副作用的纯函数。这些组件没有状态或生命周期方法

## 类/有状态组件

类或有状态组件具有状态和生命周期方可能通过 setState()方法更改组件的状态。类组件是通过扩展 React 创建的。它在构造函数中初始化，也可能有子组件

## 异步组件

- 场景:路由切换,如果同步加载多个页面路由会导致缓慢

- 核心 API:
  loader:需要加载的组件
  loading:未加载出来的页面展示组件
  delay:延迟加载时间
  timeout:超时时间

- 使用方法:
  安装 react-loadable ,babel 插件安装 syntax-dynamic-import. react-loadable 是通过 webpack 的异步 import 实现的

## 动态组件

场景：做一个 tab 切换时就会涉及到组件动态加载
实现：条件判断渲染不同组件

## 递归组件

场景：tree 组件
利用 React.Fragment 或者 div 包裹循环

## 受控组件和不受控组件

处理表单数据：

- 受控组件：组件的状态通过 React 的状态值 state 或者 props 控制
- 不受控组件：组件不被 React 的状态值控制,通过 dom 的特性或者 React 的 ref 来控制

## 状态管理

把组件之间需要共享的状态抽取出来，遵循特定的约定，统一来管理，让状态的变化可以预测

## Flux

是一种强制单向数据流的架构模式。它控制派生数据，并使用具有所有数据权限的中心 store 实现多个组件之间的通信。整个应用中的数据更新必须只能在此处进行。 Flux 为应用提供稳定性并减少运行时的错误。

1. 核心模块:Store,Reduce,Store,Container;
2. 有多个 store;

## Redux

Redux 是 React 的一个状态管理库，是遵循 Flux 模式的一种实现。 Redux 简化了 React 中的单向数据流。 Redux 将状态管理完全从 React 中抽象出来。

- 核心概念：

  - Store：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个 Store。
  - State：Store 对象包含所有数据，如果想得到某个时点的数据，就要对 Store 生成快照，这种时点的数据集合，就叫做 State。
  - Action：State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。
  - Action Creator：View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦，所以我们定义一个函数来生成 Action，这个函数就叫 Action Creator。
  - Reducer：Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。
  - dispatch：是 View 发出 Action 的唯一方法。

- 工作流程：
  1. 首先，用户（通过 View）发出（一个包含 id 和负载 payload 的）Action，发出方式就用到了 dispatch 方法。
  2. 然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action，Reducer 会返回新的 State
  3. State 一旦有变化，Store 就会调用监听函数，来更新 View。

### redux 异步中间件

redux 中间件本质就是一个函数柯里化。redux applyMiddleware Api 源码中每个 middleware 接受 2 个参数， Store 的 getState 函数和 dispatch 函数，分别获得 store 和 action，最终返回一个函数。该函数会被传入 next 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 next（action），或者在其他需要的时刻调用，甚至根本不去调用它

### redux-thunk

- 优点：

  - 体积小: redux-thunk 的实现方式很简单,只有不到 20 行代码
  - 使用简单: redux-thunk 没有引入像 redux-saga 或者 redux-observable 额外的范式,上手简单

- 缺陷：

  - 样板代码过多: 与 redux 本身一样,通常一个请求需要大量的代码,而且很多都是重复性质的
  - 耦合严重: 异步操作与 redux 的 action 偶合在一起,不方便管理
  - 功能孱弱: 有一些实际开发中常用的功能需要自己进行封装

- 处理副作用：
  既可以 dispatch action 对象，也可以 dispatch 一个函数。函数的第一个参数为 dispatch 函数，在函数内部我们可以处理一些副作用，完成后再调用 dispatch 函数就又回到了纯函数的流

### redux-saga

- 优点：

  - 异步解耦: 异步操作被被转移到单独 saga.js 中，不再是掺杂在 action.js 或 component.js 中
    action 摆脱 thunk function: dispatch 的参数依然是一个纯粹的 action (FSA)，而不是充满 “黑魔法” thunk function
  - 异常处理: 受益于 generator function 的 saga 实现，代码异常/请求失败 都可以直接通过 try/catch 语法直接捕获处理
  - 功能强大: redux-saga 提供了大量的 Saga 辅助函数和 Effect 创建器供开发者使用,开发者无须封装或者简单封装即可使用
  - 灵活: redux-saga 可以将多个 Saga 可以串行/并行组合起来,形成一个非常实用的异步 flow
  - 易测试，提供了各种 case 的测试方案，包括 mock task，分支覆盖等等

- 缺陷：

  - 额外的学习成本: redux-saga 不仅在使用难以理解的 generator function,而且有数十个 API,学习成本远超 redux-thunk,最重要的是你的额外学习成本是只服务于这个库的,与 redux-observable 不同,redux-observable 虽然也有额外学习成本但是背后是 rxjs 和一整套思想
  - 体积庞大: 体积略大,代码近 2000 行，min 版 25KB 左右
  - 功能过剩: 实际上并发控制等功能很难用到,但是我们依然需要引入这些代码
  - ts 支持不友好: yield 无法返回 TS 类型

- 处理副作用：redux-saga 会用它的生成器函数执器来替我们完成在生成器函数内部定义的"一系列操作"

- 处理并发：
  - takeEvery：可以让多个 saga 任务并行被 fork 执行
  - takeLatest：takeLatest 不允许多个 saga 任务并行地执行。一旦接收到新的发起的 action，它就会取消前面所有 fork 过的任务（如果这些任务还在执行的话）。在处理 AJAX 请求的时候，如果只希望获取最后那个请求的响应， takeLatest 就会非常有用。

## Mobx

透明函数响应式编程的状态管理库，它使得状态管理简单可伸缩

1. 核心模块:Action,Reducer,Derivation;
2. 有多个 store;
3. 设计更多偏向于面向对象编程和响应式编程，通常将状态包装成可观察对象，一旦状态对象变更，就能自动获得更新

## Dva

dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架

核心概念：

- State：一个对象，保存整个应用状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect 方法：一个函数，绑定 State 到 View
- dispatch 方法：一个函数，发送 Action 到 State
