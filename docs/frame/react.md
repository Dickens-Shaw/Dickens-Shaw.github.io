# React

## 一、组件基础

### 1. 事件机制

React 并不是将 click 事件绑定到了 div 的真实 DOM 上，而是在 document 处监听了所有的事件，当事件发生并且冒泡到 document 处的时候，React 将事件内容封装并交由真正的处理函数运行。这样的方式不仅仅减少了内存的消耗，还能在组件挂在销毁时统一订阅和移除事件。

除此之外，冒泡到 document 上的事件也不是原生的浏览器事件，而是由 react 自己实现的合成事件（SyntheticEvent）。因此如果不想要是事件冒泡的话应该调用`event.preventDefault()`方法，而不是调用`event.stopPropagation()`方法。

_注：React17 之后可以使用`e.stopPropagation()`阻止事件冒泡_

![/image](/images/syntheticEvent.png)

**好处：**

1. 合成事件首先抹平了浏览器之间的兼容问题，另外这是一个跨浏览器原生事件包装器，赋予了跨浏览器开发的能力
2. 对于原生浏览器事件来说，浏览器会给监听器创建一个事件对象。如果你有很多的事件监听，那么就需要分配很多的事件对象，造成高额的内存分配问题。但是对于合成事件来说，有一个事件池专门来管理它们的创建和销毁，当事件需要被使用时，就会从池子中复用对象，事件回调结束后，就会销毁事件对象上的属性，从而便于下次复用事件对象

**合成事件**

合成事件是 react 模拟原生 DOM 事件所有能力的一个事件对象，其优点如下：

- 兼容所有浏览器，更好的跨平台；
- 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）。
- 方便 react 统一管理和事务机制。

在 React 底层，主要对合成事件做了两件事：

- **事件委派**：React 会把所有的事件绑定到结构的最外层，使用统一的事件监听器，这个事件监听器上维持了一个映射来保存所有组件内部事件监听和处理函数。
- **自动绑定**：React 组件中，每个方法的上下文都会指向该组件的实例，即自动绑定 this 为当前组件。

事件的执行顺序为原生事件先执行，合成事件后执行，合成事件会冒泡绑定到 document 上，所以尽量避免原生事件与合成事件混用，如果原生事件阻止冒泡，可能会导致合成事件不执行，因为需要冒泡到 document 上合成事件才会执行。

### 2. Element 元素

一个元素 element 是一个普通对象(plain object)，描述了对于一个 DOM 节点或者其他组件 component，你想让它在屏幕上呈现成什么样子。元素 element 可以在它的属性 props 中包含其他元素(译注:用于形成元素树)。创建一个 React 元素 element 成本很低。元素 element 创建之后是不可变的。

createElement

- 语法：React.createElement( type, [props], [...children] )
- 原理：实质上 JSX 的 dom 最后转化为 js 都是 React.createElement

- cloneElement

  - 语法：

  ```js
  React.cloneElement(element, [props], [...children]);
  ```

  - 作用：这个方法的作用是复制组件,给组件传值或者添加属性
  - 核心代码：

  ```js
  React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      count: _this.state.count,
    });
  });
  ```

- Fragment

  在 React 中，组件返回的元素只能有一个根元素。为了不添加多余的 DOM 节点，我们可以使用 Fragment 标签来包裹所有的元素，Fragment 标签不会渲染出任何元素。React 官方对 Fragment 的解释：

  > React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

  ```js
  import React, { Component, Fragment } from 'react'

  // 一般形式
  render() {
    return (
      <React.Fragment>
        <ChildA />
        <ChildB />
        <ChildC />
      </React.Fragment>
    );
  }
  // 也可以写成以下形式
  render() {
    return (
      <>
        <ChildA />
        <ChildB />
        <ChildC />
      </>
    );
  }
  ```

### 3. Component 组件

一个组件 component 可以通过多种方式声明。可以是带有一个 render()方法的类，简单点也可以定义为一个函数。这两种情况下，它都把属性 props 作为输入，把返回的一棵元素树作为输出。

React **声明组件**的三种方式：

- **函数式定义的无状态组件**

  为了创建纯展示组件，这种组件只负责根据传入的 props 来展示，不涉及到 state 状态的操作组件不会被实例化，整体渲染性能得到提升，不能访问 this 对象，不能访问生命周期的方法

- **ES5 原生方式 React.createClass 定义的组件**

  React.createClass 会自绑定函数方法，导致不必要的性能开销，增加代码过时的可能性。

- **ES6 形式的 extends React.Component 定义的组件**

  相对于 React.createClass 可以更好实现代码复用。

### 4. PureComponent

PureComponent 表示一个纯组件，可以用来优化 React 程序，减少 render 函数执行的次数，从而提高组件的性能。

在 React 中，当 prop 或者 state 发生变化时，可以通过在 shouldComponentUpdate 生命周期函数中执行 return false 来阻止页面的更新，从而减少不必要的 render 执行。React.PureComponent 会自动执行 shouldComponentUpdate。

不过，pureComponent 中的 shouldComponentUpdate() 进行的是**浅比较**，也就是说如果是引用数据类型的数据，只会比较不是同一个地址，而不会比较这个地址里面的数据是否一致。浅比较会忽略属性和或状态突变情况，其实也就是数据引用指针没有变化，而数据发生改变的时候 render 是不会执行的。如果需要重新渲染那么就需要重新开辟空间引用数据。PureComponent 一般会用在一些纯展示组件上。

使用 pureComponent 的**好处**：当组件更新时，如果组件的 props 或者 state 都没有改变，render 函数就不会触发。省去虚拟 DOM 的生成和对比过程，达到提升性能的目的。这是因为 react 自动做了一层浅比较。

### 5. HOC

**官方解释 ∶**

> 高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

简言之，HOC 是一种组件的设计模式，HOC 接受一个组件和额外的参数（如果需要），返回一个新的组件。

高阶组件是重用组件逻辑的高级方法，是一种源于 React 的组件模式。 HOC 是自定义组件，在它之内包含另一个组件。它们可以接受子组件提供的任何动态，但不会修改或复制其输入组件中的任何行为。你可以认为 HOC 是“纯（Pure）”组件.

```jsx
// hoc的定义
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(DataSource, props)
      };
    }
    // 一些通用的逻辑处理
    render() {
      // ... 并使用新数据渲染被包装的组件!
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };

// 使用
const BlogPostWithSubscription = withSubscription(BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id));
```

**作用:**

1. 抽取重复代码，实现组件复用，常见场景,页面复用;
2. 条件渲染，控制组件的渲染逻辑（渲染劫持），常见场景,权限控制;
3. 捕获/劫持被处理组件的生命周期，常见场景,组件渲染性能追踪、日志打点

**实现：**

1. 属性代理
2. 反向继承：利用 super 改变改组件的 this 方向,继而就可以在该组件处理容器组件的一些值

**优势：**

1. HOC 通过外层组件通过 Props 影响内层组件的状态，而不是直接改变其 State 不存在冲突和互相干扰,这就降低了耦合度
2. 不同于 Mixin 的打平+合并，HOC 具有天然的层级结构（组件树结构），这又降低了复杂度

**缺陷：**

1. 扩展性限制: HOC 无法从外部访问子组件的 State 因此无法通过 shouldComponentUpdate 滤掉不必要的更新,React 在支持 ES6 Class 之后提供了 React.PureComponent 来解决这个问题
2. Ref 传递问题: Ref 被隔断,后来的 React.forwardRef 来解决这个问题
3. Wrapper Hell: HOC 可能出现多层包裹组件的情况,多层抽象同样增加了复杂度和理解成本
4. 命名冲突: 如果高阶组件多次嵌套,没有使用命名空间的话会产生冲突,然后覆盖老属性
5. 不可见性: HOC 相当于在原有组件外层再包装一个组件,你压根不知道外层的包装是啥,对于你是黑盒

### 6. Render props

**官方解释 ∶**

> "render prop"是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术

具有 render prop 的组件接受一个返回 React 元素的函数，将 render 的渲染逻辑注入到组件内部。在这里，"render"的命名可以是任何其他有效的标识符。

```jsx
// DataProvider组件内部的渲染逻辑如下
class DataProvider extends React.Components {
  state = {
    name: 'Tom',
  };

  render() {
    return (
      <div>
        <p>共享数据组件自己内部的渲染逻辑</p>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 调用方式
<DataProvider render={(data) => <h1>Hello {data.name}</h1>} />;
```

**优点**：数据共享、代码复用，将组件内的 state 作为 props 传递给调用者，将渲染逻辑交给调用者。

**缺点**：无法在 return 语句外访问数据、嵌套写法不够优雅

### 7. 受控 / 非受控组件

处理表单数据：

- 受控组件：组件的状态通过 React 的状态值 state 或者 props 控制
- 不受控组件：组件不被 React 的状态值控制,通过 dom 的特性或者 React 的 ref 来控制

### 8. React.lazy

对于最初 React.lazy() 所返回的 LazyComponent 对象，其 \_status 默认是 -1，所以首次渲染时，会进入 readLazyComponentType 函数中的 default 的逻辑，这里才会真正异步执行 import(url)操作，由于并未等待，随后会检查模块是否 Resolved，如果已经 Resolved 了（已经加载完毕）则直接返回 moduleObject.default（动态加载的模块的默认导出），否则将通过 throw 将 thenable 抛出到上层

React 捕获到异常之后，会判断异常是不是一个 thenable，如果是则会找到 SuspenseComponent ，如果 thenable 处于 pending 状态，则会将其 children 都渲染成 fallback 的值，一旦 thenable 被 resolve 则 SuspenseComponent 的子组件会重新渲染一次

### 9. forceUpdate()

如果你的 render() 方法依赖于一些其他数据，你可以告诉 React 组件需要通过调用 forceUpdate() 重新渲染。

调用 forceUpdate() 会导致组件跳过 shouldComponentUpdate() ，直接调用 render()。 这将触发子组件的正常生命周期方法，包括每个子组件的 shouldComponentUpdate() 方法。

forceUpdate 就是重新 render，使用场景：

1. 有些变量不在 state 上，但是你又想达到这个变量更新的时候，刷新 render；
2. state 里的某个变量层次太深，更新的时候没有自动触发 render

### 10. 异常捕获边界

在部分 UI 中出现的 JavaScript 异常是不应该导致整个应用的崩溃的。为了解决这个问题，React16 引进了一个新的概念“异常捕获边界(Error Boundaries)“。

异常捕获边界是一种 React 组件，它能够捕获在它子组件树中出现的任何 JavaScript 异常，将它们打印出来并展示一个备用 UI，这样就不会导致组件树的崩溃。异常捕获边界能够捕获它的子组件数中在渲染，生命周期方法和构造函数中出现的任何异常。

只要在组件中定义其中一个及以上的生命周期方法（static getDerivedStateFromError()或 componentDidCatch()），那么这个组件就变成了异常捕获边界。当异常被抛出时使用 static getDerivedStateFromError()来渲染一个备用 UI，使用 componentDidCatch()来打印异常信息。

### 11. Refs

> React 中引用的简写。它是一个有助于存储对特定的 React 元素或组件的引用的属性，它将由组件渲染配置函数返回。用于对 render() 返回的特定元素或组件的引用。

- 使用场景：
  - 需要管理焦点、选择文本或媒体播放时
  - 触发式动画
  - 与第三方 DOM 库集成

### 12. Portals 插槽

> Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

Portals 是 React 16 提供的官方解决方案，使得组件可以脱离父组件层级挂载在 DOM 树的任何位置。通俗来讲，就是我们 render 一个组件，但这个组件的 DOM 结构并不在本组件内。

Portals 语法如下：

```js
ReactDOM.createPortal(child, container);
```

- 第一个参数 child 是可渲染的 React 子项，比如元素，字符串或者片段等;
- 第二个参数 container 是一个 DOM 元素。

一般情况下，组件的 render 函数返回的元素会被挂载在它的父级组件上：

```js
import DemoComponent from './DemoComponent';
render() {
  // DemoComponent元素会被挂载在id为parent的div的元素上
  return (
    <div id="parent">
        <DemoComponent />
    </div>
  );
}
```

然而，有些元素需要被挂载在更高层级的位置。最典型的应用场景：当父组件具有 overflow: hidden 或者 z-index 的样式设置时，组件有可能被其他元素遮挡，这时就可以考虑要不要使用 Portal 使组件的挂载脱离父组件。例如：对话框，模态窗。

```js
import DemoComponent from './DemoComponent';
render() {
  // react会将DemoComponent组件直接挂载在真实的 dom 节点 domNode 上，生命周期还和16版本之前相同。
  return ReactDOM.createPortal(
    <DemoComponent />,
    domNode,
  );
}
```

### 13. Context

在 React 中，数据传递一般使用 props 传递数据，维持单向数据流，这样可以让组件之间的关系变得简单且可预测，但是单项数据流在某些场景中并不适用。单纯一对的父子组件传递并无问题，但要是组件之间层层依赖深入，props 就需要层层传递显然，这样做太繁琐了。

Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

可以把 context 当做是特定一个组件树内共享的 store，用来做数据传递。简单说就是，**当你不想在组件树中通过逐层传递 props 或者 state 的方式来传递数据时，可以使用 Context 来实现跨层级的组件数据传递**。

JS 的代码块在执行期间，会创建一个相应的作用域链，这个作用域链记录着运行时 JS 代码块执行期间所能访问的活动对象，包括变量和函数，JS 程序通过作用域链访问到代码块内部或者外部的变量和函数。

假如以 JS 的作用域链作为类比，React 组件提供的 Context 对象其实就好比一个提供给子组件访问的作用域，而 Context 对象的属性可以看成作用域上的活动对象。由于组件 的 Context 由其父节点链上所有组件通 过 `getChildContext()` 返回的 Context 对象组合而成，所以，组件通过 Context 是可以访问到其父组件链上所有节点组件提供的 Context 的属性。

#### 不足：

- Context 目前还处于实验阶段，可能会在后面的发行版本中有很大的变化，事实上这种情况已经发生了，所以为了避免给今后升级带来大的影响和麻烦，不建议在 app 中使用 context。
- 尽管不建议在 app 中使用 context，但是独有组件而言，由于影响范围小于 app，如果可以做到高内聚，不破坏组件树之间的依赖关系，可以考虑使用 context
- 对于组件之间的数据通信或者状态管理，有效使用 props 或者 state 解决，然后再考虑使用第三方的成熟库进行解决，以上的方法都不是最佳的方案的时候，在考虑 context。
- context 的更新需要通过 setState()触发，但是这并不是很可靠的，Context 支持跨组件的访问，但是如果中间的子组件通过一些方法不影响更新，比如 shouldComponentUpdate() 返回 false 那么不能保证 Context 的更新一定可以使用 Context 的子组件，因此，Context 的可靠性需要关注

### 14. 类组件和函数组件区别

#### 相同点：

组件是 React 可复用的最小代码片段，它们会返回要在页面中渲染的 React 元素。也正因为组件是 React 的最小编码单位，所以无论是函数组件还是类组件，在使用方式和最终呈现效果上都是完全一致的。

我们甚至可以将一个类组件改写成函数组件，或者把函数组件改写成一个类组件（虽然并不推荐这种重构行为）。从使用者的角度而言，很难从使用体验上区分两者，而且在现代浏览器中，闭包和类的性能只在极端场景下才会有明显的差别。所以，基本可认为两者作为组件是完全一致的。

#### 不同点：

- 它们在开发时的心智模型上却存在巨大的差异。类组件是基于面向对象编程的，它主打的是继承、生命周期等核心概念；而函数组件内核是函数式编程，主打的是 immutable、没有副作用、引用透明等特点。
- 之前，在使用场景上，如果存在需要使用生命周期的组件，那么主推类组件；设计模式上，如果需要使用继承，那么主推类组件。但现在由于 React Hooks 的推出，生命周期概念的淡出，函数组件可以完全取代类组件。其次继承并不是组件最佳的设计模式，官方更推崇“组合优于继承”的设计概念，所以类组件在这方面的优势也在淡出。
- 性能优化上，类组件主要依靠 shouldComponentUpdate 阻断渲染来提升性能，而函数组件依靠 React.memo 缓存渲染结果来提升性能。
- 从上手程度而言，类组件更容易上手，从未来趋势上看，由于 React Hooks 的推出，函数组件成了社区未来主推的方案。
- 类组件在未来时间切片与并发模式中，由于生命周期带来的复杂度，并不易于优化。而函数组件本身轻量简单，且在 Hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展。

## 二、数据管理

### 1. setState 原理

![setState](/images/setState.png)

#### 执行过程:

1. 首先调用了 `setState` 入口函数，入口函数在这里就是充当一个分发器的角色，根据入参的不同，将其分发到不同的功能函数中去；

```js
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

2. `enqueueSetState` 方法将新的 `state` 放进组件的状态队列里，并调用 `enqueueUpdate` 来处理将要更新的实例对象；

```js
enqueueSetState: function (publicInstance, partialState) {
  // 根据 this 拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state 数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);
  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}
```

3. 在 `enqueueUpdate` 方法中引出了一个关键的对象—— `batchingStrategy`，该对象所具备的 `isBatchingUpdates` 属性直接决定了当下是要走更新流程，还是应该排队等待；如果轮到执行，就调用 `batchedUpdates`（合并更新） 方法来直接发起更新流程。由此可以推测，`batchingStrategy` 或许正是 React 内部专门用于管控批量更新的对象。

```js
function enqueueUpdate(component) {
  ensureInjected();
  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

### 2. setState 调用之后

React 会将传入的参数对象与组件当前的状态合并，然后触发所谓的调和过程（Reconciliation）。经过调和过程，React 会以相对高效的方式根据新的状态构建 React 元素树并且着手重新渲染整个 UI 界面。

在 React 得到元素树之后，React 会自动计算出新的树与老树的节点差异，然后根据差异对界面进行最小化重渲染。在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

如果在短时间内频繁 setState。React 会将 state 的改变压入栈中，在合适的时机，批量更新 state 和视图，达到提高性能的效果。

### 3. 同步还是异步

假如所有 setState 是同步的，意味着每执行一次 setState 时（有可能一个同步代码中，多次 setState），都重新`vnode diff + dom`修改，这对性能来说是极为不好的。如果是异步，则可以把一个同步代码中的多个 setState 合并成一次组件更新。所以默认是异步的，但是在一些情况下是同步的。

setState 并不是单纯同步/异步的，它的表现会因调用场景的不同而不同。在源码中，通过 `isBatchingUpdates` 来判断 setState 是先存进 state 队列还是直接更新，如果值为 true 则执行异步操作，为 false 则直接更新。

- **异步**：在 React 可以控制的地方，就为 true，比如在 React 生命周期事件和合成事件中，都会走合并操作，延迟更新的策略。
- **同步**：在 React 无法控制的地方，比如原生事件，具体就是在 `addEventListener 、setTimeout、setInterval` 等事件中，就只能同步更新。

一般认为，做异步设计是为了性能优化、减少渲染次数：

- setState 设计为异步，可以显著的提升性能。如果每次调用 setState 都进行一次更新，那么意味着 render 函数会被频繁调用，界面重新渲染，这样效率是很低的；最好的办法应该是获取到多个更新，之后进行批量更新；
- 如果同步更新了 state，但是还没有执行 render 函数，那么 state 和 props 不能保持同步。state 和 props 不能保持一致性，会在开发中产生很多的问题；
- setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形成了所谓的“异步”，当然可以通过第二个参数 `setState(partialState, callback)` 中的 callback 拿到更新后的结果。
  setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和 setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState，setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

### 4. 批量更新

调用 setState 时，组件的 state 并不会立即改变， setState 只是把要修改的 state 放入一个队列， React 会优化真正的执行时机，并出于性能原因，会将 React 事件处理程序中的多次 React 事件处理程序中的多次 setState 的状态修改合并成一次状态修改。 最终更新只产生一次组件及其子组件的重新渲染，这对于大型应用程序中的性能提升至关重要。

```js
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务]
});
this.setState({
  count: this.state.count + 1    ===>    入队，[count+1的任务，count+1的任务]
});
                                          ↓
                                         合并 state，[count+1的任务]
                                          ↓
                                         执行 count+1的任务
```

#### 怎么进行合并更新

这里 react 用到了事务机制。

React 中的 `Batch Update` 是通过 **「Transaction」** 实现的。在 React 源码关于 Transaction 的部分， Transaction 的作用：

用大白话说就是在实际的 useState/setState 前后各加了段逻辑给包了起来。只要是在同一个事务中的 setState 会进行合并（注意，useState 不会进行 state 的合并）处理。

#### 为什么 setTimeout 不能进行事务操作

由于 react 的事件委托机制，调用 onClick 执行的事件，是处于 react 的控制范围的。

而 `setTimeout` 已经超出了 react 的控制范围，react 无法对 `setTimeout` 的代码前后加上事务逻辑（除非 react 重写 `setTimeout`）。

所以当遇到 `setTimeout/setInterval/Promise.then(fn)/fetch 回调/xhr 网络回调` 时，react 都是无法控制的。

相关 react 源码如下：

```js
if (executionContext === NoContext) {
  // Flush the synchronous work now, unless we're already working or inside
  // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
  // scheduleCallbackForFiber to preserve the ability to schedule a callback
  // without immediately flushing it. We only do this for user-initiated
  // updates, to preserve historical behavior of legacy mode.
  flushSyncCallbackQueue();
}
```

> executionContext 代表了目前 react 所处的阶段，而 NoContext 你可以理解为是 react 已经没活干了的状态。而 flushSyncCallbackQueue 里面就会去同步调用我们的 this.setState ，也就是说会同步更新我们的 state 。所以，我们知道了，当 executionContext 为 NoContext 的时候，我们的 setState 就是同步的

### 5. 第二个参数

setState 的第二个参数是一个可选的回调函数。这个回调函数将在组件重新渲染后执行。等价于在 `componentDidUpdate` 生命周期内执行。通常建议使用 `componentDidUpdate` 来代替此方式。在这个回调函数中你可以拿到更新后 state 的值：

```js
this.setState({
    key1: newState1,
    key2: newState2,
    ...
}, callback) // 第二个参数是 state 更新完成后的回调函数，我们可以用来监听渲染是否完成
```

### 6. replaceState

- `setState` 是修改其中的部分状态，相当于 `Object.assign`，只是覆盖，不会减少原来的状态。
- `replaceState` 是完全替换原来的状态，相当于赋值，将原来的 state 替换为另一个对象，如果新状态属性减少，那么 state 中就没有这个状态了

### 7. DirtyComponent

React 的更新流程（批处理更新）是围绕待更新组件（React 称为 dirtyComponent）来实现，dirtyComponent 即 ReactCompositeComponent 实例。

批处理更新过程如下：

1. 开始一次批处理更新
2. 收集 dirtyComponents
3. 更新 dirtyComponent（更改 UI 的操作在这里）
4. 执行回调（生命周期函数、setState 传入的回调方法）
5. 若在 3、4 间产生了新的 dirtyComponent，重复 3、4 步，直至 dirtyComponents 清空，完成了一次完整的批处理更新

### 8. props 和 state 区别

#### props

props 是一个从外部传进组件的参数，主要作为就是从父组件向子组件传递数据，它具有可读性和不变性，只能通过外部组件主动传入新的 props 来重新渲染子组件，否则子组件的 props 以及展现形式不会改变。

汲取了纯函数的思想，保证的相同的输入，页面显示的内容是一样的，并且不会产生副作用。

#### state

state 的主要作用是用于组件保存、控制以及修改自己的状态，它只能在 constructor 中初始化，它算是组件的私有属性，不可通过外部访问和修改，只能通过组件内部的 this.setState 来修改，修改 state 属性会导致组件的重新渲染。

#### 区别

- props 是传递给组件的（类似于函数的形参），而 state 是在组件内被组件自己管理的（类似于在一个函数内声明的变量）。
- props 是不可修改的，所有 React 组件都必须像纯函数一样保护它们的 props 不被更改。
- state 是在组件中创建的，一般在 constructor 中初始化 state。state 是多变的、可以修改，每次 setState 都异步更新的。

## 三、生命周期

**V16.4 之后的生命周期函数**

```js
class ExampleComponent extends React.Component {
  //用于初始化state，挂载类组件的时候，先执行构造函数
  constructor(props) {
    super(props);
    // 不要在构造函数中调用 setState，可以直接给 state 设置初始值
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  //用于替换`componentWillReceiveProps`，该函数会在初始化和`update`时被调用
  //因为该函数是静态函数，所以取不到`this`
  //如果需要对比`prevProps`需要单独在`state`中维护
  //它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
  static getDerivedStateFromProps(nextProps, prevState) {}
  //判断是否需要更新组件，多用于组件性能优化
  //可以在这里进行性能优化，减少浅层比较
  shouldComponentUpdate(nextProps, nextState) {}
  //组件挂载后调用
  //可以在该函数中进行请求或者订阅
  componentDidMount() {}
  //用于获得最新的DOM数据
  //在最近一次渲染中，从之前的DOM拿到一些有用的信息，比如滚动位置等
  getSnapshotBeforeUpdate(prevProps, prevState) {}
  //组件即将销毁
  //可以在此处移除订阅，定时器等等
  componentWillUnmount() {}
  //组件销毁后调用
  //清空数据，取消网络请求等等
  componentDidUnMount() {}
  //组件更新后调用
  //当组件更新后，可以在此处对 DOM 进行操作。
  //如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。（例如，当 props 未发生变化时，则不会执行网络请求）
  // snapshot是getSnapshotBeforeUpdate()生命周期的返回值
  componentDidUpdate(prevProps, prevState, snapshot) {}

  //渲染组件函数
  render() {}
  //以下函数不建议使用
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}
}
```

React 通常将组件生命周期分为三个阶段：

- 装载阶段（Mount），组件第一次在 DOM 树中被渲染的过程；
- 更新过程（Update），组件状态发生变化，重新更新渲染的过程；
- 卸载过程（Unmount），组件从 DOM 树中被移除的过程；

![生命周期](/images/lifecycle.png)

React16 自上而下地对生命周期做了另一种维度的解读：

- Render 阶段：用于计算一些必要的状态信息。这个阶段可能会被 React 暂停，这一点和 React16 引入的 Fiber 架构（我们后面会重点讲解）是有关的；
- Pre-commit 阶段：所谓“commit”，这里指的是“更新真正的 DOM 节点”这个动作。所谓 Pre-commit，就是说我在这个阶段其实还并没有去更新真实的 DOM，不过 DOM 信息已经是可以读取的了；
- Commit 阶段：在这一步，React 会完成真实 DOM 的更新工作。Commit 阶段，我们可以拿到真实 DOM（包括 refs）。

### 1. 挂载(创建)阶段

挂载阶段组件被创建，然后组件实例插入到 DOM 中，完成组件的第一次渲染，该过程只会发生一次，在此阶段会依次调用以下这些方法：

- constructor
- getDerivedStateFromProps
- render
- componentDidMount

#### constructor

组件的构造函数，第一个被执行，若没有显式定义它，会有一个默认的构造函数，但是若显式定义了构造函数，我们必须在构造函数中执行 `super(props)`，否则无法在构造函数中拿到 this。

如果不初始化 state 或不进行方法绑定，则不需要为 React 组件实现构造函数 Constructor。

constructor 中通常只做两件事：

- 初始化组件的 state
- 给事件处理方法绑定 this

#### getDerivedStateFromProps

这是个静态方法，所以不能在这个函数里使用 this，有两个参数 props 和 state，分别指接收到的新参数和当前组件的 state 对象，这个函数会返回一个对象用来更新当前的 state 对象，如果不需要更新可以返回 null。

该函数会在装载时，接收到新的 props 或者调用了 `setState` 和 `forceUpdate` 时被调用。如当接收到新的属性想修改 state ，就可以使用。

#### render

render 是 React 中最核心的方法，一个组件中必须要有这个方法，它会根据状态 `state` 和属性 `props` 渲染组件。这个函数只做一件事，就是返回需要渲染的内容，所以不要在这个函数内做其他业务逻辑，通常调用该方法会返回以下类型中一个：

- React 元素：这里包括原生的 DOM 以及 React 组件；
- 数组和 Fragment（片段）：可以返回多个元素；
- Portals（插槽）：可以将子元素渲染到不同的 DOM 子树种；
- 字符串和数字：被渲染成 DOM 中的 text 节点；
- 布尔值或 null：不渲染任何内容。

#### componentDidMount

`componentDidMount()` 会在组件挂载后（插入 DOM 树中）立即调。该阶段通常进行以下操作：

- 执行依赖于 DOM 的操作；
- 发送网络请求；（官方建议）
- 添加订阅消息（会在 componentWillUnmount 取消订阅）；

如果在 `componentDidMount` 中调用 setState ，就会触发一次额外的渲染，多调用了一次 render 函数，由于它是在浏览器刷新屏幕前执行的，所以用户对此是没有感知的，但是我应当避免这样使用，这样会带来一定的性能问题，尽量是在 constructor 中初始化 state 对象。

### 2. 更新阶段

当组件的 props 改变了，或组件内部调用了 `setState/forceUpdate`，会触发更新重新渲染，这个过程可能会发生多次。这个阶段会依次调用下面这些方法：

- getDerivedStateFromProps
- shouldComponentUpdate
- render
- getSnapshotBeforeUpdate
- componentDidUpdate

#### shouldComponentUpdate

这个生命周期函数是用来提升速度的，它是在重新渲染组件开始前触发的，默认返回 true，可以比较 this.props 和 nextProps ，this.state 和 nextState 值是否变化，来确认返回 true 或者 false。当返回 false 时，组件的更新过程停止，后续的 `render、componentDidUpdate` 也不会被调用。

注意：添加 shouldComponentUpdate 方法时，不建议使用**深度相等检查**（如使用 `JSON.stringify()`），因为深比较效率很低，可能会比重新渲染组件效率还低。而且该方法维护比较困难，建议使用该方法会产生明显的性能提升时使用。

#### getSnapshotBeforeUpdate

这个方法在 render `之后，componentDidUpdate` 之前调用，有两个参数 prevProps 和 prevState，表示更新之前的 props 和 state，这个函数必须要和 `componentDidUpdate` 一起使用，并且要有一个返回值，默认是 null，这个返回值作为第三个参数传给 `componentDidUpdate`。

#### componentDidUpdate

`componentDidUpdate()` 会在更新后会被立即调用，首次渲染不会执行此方法。 该阶段通常进行以下操作：

- 当组件更新后，对 DOM 进行操作；
- 如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求；（例如，当 props 未发生变化时，则不会执行网络请求）。

### 3. 卸载阶段

卸载阶段只有一个生命周期函数，`componentWillUnmount()` 会在组件卸载及销毁之前直接调用。在此方法中执行必要的清理操作：

- 清除 timer，取消网络请求或清除

- 取消在 `componentDidMount()` 中创建的订阅等；
  这个生命周期在一个组件被卸载和销毁之前被调用，因此你不应该再这个方法中使用 setState，因为组件一旦被卸载，就不会再装载，也就不会重新渲染

### 4. 错误处理阶段

`componentDidCatch(error, info)`，此生命周期在后代组件抛出错误后被调用。 它接收两个参数 ∶

- error：抛出的错误。
- info：带有 componentStack key 的对象，其中包含有关组件引发错误的栈信息

### 5. 废弃的函数

被废弃的三个函数都是在 render 之前，因为 fiber 的出现，很可能因为高优先级任务的出现而打断现有任务导致它们会被执行多次。

#### componentWillMount

首先这个函数的功能完全可以使用 componentDidMount 和 constructor 来代替，异步获取的数据的情况上面已经说明了，而如果抛去异步获取数据，其余的即是初始化而已，这些功能都可以在 constructor 中执行，除此之外，如果在 willMount 中订阅事件，但在服务端这并不会执行 willUnMount 事件，也就是说服务端会导致内存泄漏所以 componentWilIMount 完全可以不使用，但使用者有时候难免因为各 种各样的情况在 componentWilMount 中做一些操作，那么 React 为了约束开发者，干脆就抛掉了这个 API

#### componentWillReceiveProps

在老版本的 React 中，如果组件自身的某个 state 跟其 props 密切相关的话，一直都没有一种很优雅的处理方式去更新 state，而是需要在 componentWilReceiveProps 中判断前后两个 props 是否相同，如果不同再将新的 props 更新到相应的 state 上去。这样做一来会破坏 state 数据的单一数据源，导致组件状态变得不可预测，另一方面也会增加组件的重绘次数。类似的业务需求也有很多，如一个可以横向滑动的列表，当前高亮的 Tab 显然隶属于列表自身的时，根据传入的某个值，直接定位到某个 Tab。为了解决这些问题，React 引入了第一个新的生命周期：getDerivedStateFromProps。它有以下的优点 ∶

- getDerivedStateFromProps 是静态方法，在这里不能使用 this，也就是一个纯函数，开发者不能写出副作用的代码
- 开发者只能通过 prevState 而不是 prevProps 来做对比，保证了 state 和 props 之间的简单关系以及不需要处理第一次渲染时 prevProps 为空的情况
- 基于第一点，将状态变化（setState）和昂贵操作（tabChange）区分开，更加便于 render 和 commit 阶段操作或者说优化。

#### componentWillUpdate

与 componentWillReceiveProps 类似，许多开发者也会在 componentWillUpdate 中根据 props 的变化去触发一些回调 。 但不论是 componentWilReceiveProps 还 是 componentWilUpdate，都有可能在一次更新中被调用多次，也就是说写在这里的回调函数也有可能会被调用多次，这显然是不可取的。与 componentDidMount 类 似， componentDidUpdate 也不存在这样的问题，一次更新中 componentDidUpdate 只会被调用一次，所以将原先写在 componentWillUpdate 中 的 回 调 迁 移 至 componentDidUpdate 就可以解决这个问题。

另外一种情况则是需要获取 DOM 元素状态，但是由于在 fiber 中，render 可打断，可能在 wilMount 中获取到的元素状态很可能与实际需要的不同，这个通常可以使用第二个新增的生命函数的解决 getSnapshotBeforeUpdate(prevProps, prevState)

### 6. 发起网络请求

对于异步请求，最好放在 componentDidMount 中去操作，对于同步的状态改变，可以放在 componentWillMount 中，一般用的比较少。

如果认为在 componentWillMount 里发起请求能提早获得结果，这种想法其实是错误的，通常 componentWillMount 比 componentDidMount 早不了多少微秒，网络上任何一点延迟，这一点差异都可忽略不计。

**react 的生命周期**：constructor() -> componentWillMount() -> render() -> componentDidMount()

上面这些方法的调用是有次序的，由上而下依次调用。

- constructor 被调用是在组件准备要挂载的最开始，此时组件尚未挂载到网页上。
- componentWillMount 方法的调用在 constructor 之后，在 render 之前，在这方法里的代码调用 setState 方法不会触发重新 render，所以它一般不会用来作加载数据之用。
- componentDidMount 方法中的代码，是在组件已经完全挂载到网页上才会调用被执行，所以可以保证数据的加载。此外，在这方法中调用 setState 方法，会触发重新渲染。所以，官方设计这个方法就是用来加载外部数据用的，或处理其他的副作用代码。与组件上的数据无关的加载，也可以在 constructor 里做，但 constructor 是做组件 state 初绐化工作，并不是做加载数据这工作的，constructor 里也不能 setState，还有加载的时间太长或者出错，页面就无法加载出来。所以有副作用的代码都会集中在 componentDidMount 方法里。

**总结**：

- 跟服务器端渲染（同构）有关系，如果在 componentWillMount 里面获取数据，fetch data 会执行两次，一次在服务器端一次在客户端。在 componentDidMount 中可以解决这个问题，componentWillMount 同样也会 render 两次。
- 在 componentWillMount 中 fetch data，数据一定在 render 后才能到达，如果忘记了设置初始状态，用户体验不好。
- react16.0 以后，componentWillMount 可能会被执行多次。

## 四、组件通信

### 1. 父子组件

- 父组件通过 props 传递数据给子组件
  ```js
  // 子组件: Child
  const Child = (props) => {
    return <p>{props.name}</p>;
  };
  // 父组件 Parent
  const Parent = () => {
    return <Child name='react'></Child>;
  };
  ```
- 子组件通过调用父组件传来的函数传递数据给父组件
  ```js
  // 子组件: Child
  const Child = (props) => {
    const cb = (msg) => {
      return () => {
        props.callback(msg);
      };
    };
    return <button onClick={cb('你好!')}>你好</button>;
  };
  // 父组件 Parent
  class Parent extends Component {
    callback(msg) {
      console.log(msg);
    }
    render() {
      return <Child callback={this.callback.bind(this)}></Child>;
    }
  }
  ```
- ref 获取子组件实例、props 传 onRef（this）实例给子组件
  ```js
  // 子组件: Child
  const Child = (props) => {
    return <p>我是子组件</p>;
  };
  // 父组件 Parent
  const Parent = () => {
    const child = useRef(null);
    useEffect(() => {
      console.log(child);
    }, []);
    return <Child onRef={child}></Child>;
  };
  ```
- Slot
  ```js
  // 子组件: Child
  const Child = (props) => {
    return <div>{props.children}</div>;
  };
  // 父组件 Parent
  const Parent = () => {
    return (
      <Child>
        <p>我是子组件</p>
      </Child>
    );
  };
  ```

### 2. 跨层级组件

使用 **Context API**：React.createContext(),使用 Provider 和 Customer 模式,在顶层的 Provider 中传入 value，在子孙级的 Consumer 中获取该值

```js
// context方式实现跨级组件通信
// Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据
const BatteryContext = createContext();
//  子组件的子组件
class GrandChild extends Component {
  render() {
    return (
      <BatteryContext.Consumer>
        {(color) => <h1>我是红色的:{color}</h1>}
      </BatteryContext.Consumer>
    );
  }
}
//  子组件
const Child = () => {
  return <GrandChild />;
};
// 父组件
class Parent extends Component {
  state = {
    color: 'red',
  };
  render() {
    const { color } = this.state;
    return (
      <BatteryContext.Provider value={color}>
        <Child />
      </BatteryContext.Provider>
    );
  }
}
```

### 3. 兄弟组件

通过共同的父组件来管理状态和事件函数

### 4. 任意组件

Redux、 Mobx、Flux 或者 Event Bus

## 五、路由

### 1. react-router 实现思想

#### 前端路由实现：

- 基于 hash 的路由：通过监听 `onhashchange` 事件，感知 hash 的变化
  - 改变 hash 可以直接通过 location.hash=xxx
- 基于 H5 history 路由：
  - 改变 url 可以通过 `history.pushState` 和 `replaceState` 等，会将 URL 压入堆栈，同时能够应用 `history.go()` 等 API
  - 监听 url 的变化可以通过自定义事件触发实现

#### react-router 实现：

1. 基于 history 库来实现上述不同的客户端路由实现思想，并且能够保存历史记录等，磨平浏览器差异，上层无感知
2. 通过维护的列表，在每次 URL 发生变化的回收，通过配置的 路由路径，匹配到对应的 Component，并且 render

### 2. 路由切换配置

#### 使用 `<Route>` 组件

路由匹配是通过比较 `<Route>` 的 path 属性和当前地址的 pathname 来实现的。当一个 `<Route>` 匹配成功时，它将渲染其内容，当它不匹配时就会渲染 null。没有路径的 `<Route>` 将始终被匹配。

```jsx
// when location = { pathname: '/about' }
<Route path='/about' component={About}/> // renders <About/>
<Route path='/contact' component={Contact}/> // renders null
<Route component={Always}/> // renders <Always/>
```

#### 结合使用 `<Switch> `组件和 `<Route>` 组件

`<Switch>` 用于将 `<Route>` 分组。

```jsx
<Switch>
  <Route exact path='/' component={Home} />
  <Route path='/about' component={About} />
  <Route path='/contact' component={Contact} />
</Switch>
```

`<Switch>` 不是分组 `<Route>` 所必须的，但他通常很有用。 一个 `<Switch>` 会遍历其所有的子 `<Route>` 元素，并仅渲染与当前地址匹配的第一个子 `<Route>` 或 `<Redirect>`。

#### 使用 `<Link>、 <NavLink>、<Redirect>` 组件

##### Link

`<Link>` 组件来在你的应用程序中创建链接。无论你在何处渲染一个 `<Link>` ，都会在应用程序的 HTML 中渲染锚（`<a>`）。

```jsx
<Link to='/'>Home</Link>
// <a href='/'>Home</a>
```

##### NavLink

`<NavLink>` 是一种特殊类型的 `<Link>` 当它的 to 属性与当前地址匹配时，可以将其定义为"活跃的"。

```jsx
// location = { pathname: '/react' }
<NavLink to='/react' activeClassName='hurray'>
  React
</NavLink>
// <a href='/react' className='hurray'>React</a>
```

##### Redirect

当我们想强制导航时，可以渲染一个`<Redirect>`实现路由的重定向，当一个`<Redirect>`渲染时，它将使用它的 to 属性进行定向。

```jsx
<Switch>
  <Redirect from='/users/:id' to='/users/profile/:id' />
  <Route path='/users/profile/:id' component={Profile} />
</Switch>
```

- 属性 from: string：需要匹配的将要被重定向路径。
- 属性 to: string：重定向的 URL 字符串
- 属性 to: object：重定向的 location 对象
- 属性 push: bool：若为真，重定向操作将会把新地址加入到访问历史记录里面，并且无法回退到前面的页面。

### 3. Link 和 a 标签的区别

`<Link>`是 react-router 里实现路由跳转的链接，一般配合`<Route>` 使用，react-router 接管了其默认的链接跳转行为，区别于传统的页面跳转，`<Link>` 的“跳转”行为只会触发相匹配的`<Route>`对应的页面内容更新，而不会刷新整个页面。

`<Link>`做了 3 件事情:

- 有 onclick 那就执行 onclick
- click 的时候阻止 a 标签默认事件
- 根据跳转 href(即是 to)，用 history (web 前端路由两种方式之一，history & hash)跳转，此时只是链接变了，并没有刷新页面而`<a>`标签就是普通的超链接了，用于从当前页面跳转到 href 指向的另一 个页面(非锚点情况)。

#### a 标签默认事件禁掉之后做了什么才实现了跳转?

```js
let domArr = document.getElementsByTagName('a')
[...domArr].forEach(item=>{
    item.addEventListener('click',function () {
        location.href = this.href
    })
})
```

### 4. 获取 URL 参数和历史对象

#### 获取 URL 的参数

- **get 传值**
  路由配置还是普通的配置，如：`'admin'`，传参方式如：`'admin?id='1111''`。通过 `this.props.location.search` 获取 url 获取到一个字符串`'?id='1111'`
  可以用 `url，qs，queryString`，浏览器提供的 `api URLSearchParams` 对象或者自己封装的方法去解析出 id 的值。
- **动态路由传值**
  路由需要配置成动态路由：如 `path='/admin/:id'`，传参方式，如`'admin/111'`。通过 `this.props.match.params.id` 取得 url 中的动态路由 id 部分的值，除此之外还可以通过 `useParams（Hooks）`来获取
- **通过 query 或 state 传值**
  传参方式如：在 `Link` 组件的 to 属性中可以传递对象`{pathname:'/admin',query:'111',state:'111'}`;。通过 `this.props.location.state` 或 `this.props.location.query`来获取即可，传递的参数可以是对象、数组等，但是存在缺点就是只要刷新页面，参数就会丢失。

#### 获取历史对象

- 如果 React >= 16.8 时可以使用 React Router 中提供的 Hooks
  ```js
  import { useHistory } from 'react-router-dom';
  let history = useHistory();
  ```
- 使用 this.props.history 获取历史对象
  ```js
  let history = this.props.history;
  ```

### 5. 路由模式

支持使用 browser（对应 `BrowserRouter`） 和 hash（对应 `HashRouter`）两种路由规则， react-router-dom 提供了 `BrowserRouter` 和 `HashRouter` 两个组件来实现应用的 UI 和 URL 同步。

#### BrowserRouter

URL 格式：[http://xxx.com/path](http://xxx.com/path)

使用 HTML5 提供的 history API（`pushState、replaceState 和 popstate` 事件）来保持 UI 和 URL 的同步。由此可以看出，**BrowserRouter 是使用 HTML 5 的 history API 来控制路由跳转的**：

```jsx
<BrowserRouter
  basename={string}
  forceRefresh={bool}
  getUserConfirmation={func}
  keyLength={number}
/>
```

**属性**：

- basename 所有路由的基准 URL。basename 的正确格式是前面有一个前导斜杠，但不能有尾部斜杠；
  ```jsx
  <BrowserRouter basename="/calendar">
    <Link to="/today" />
  </BrowserRouter>
  // 等同于
  <a href="/calendar/today" />
  ```
- forceRefresh 如果为 true，在导航的过程中整个页面将会刷新。一般情况下，只有在不支持 HTML5 history API 的浏览器中使用此功能；
- getUserConfirmation 用于确认导航的函数，默认使用 window.confirm。例如，当从 /a 导航至 /b 时，会使用默认的 confirm 函数弹出一个提示，用户点击确定后才进行导航，否则不做任何处理；
  ```js
  // 这是默认的确认函数
  const getConfirmation = (message, callback) => {
    const allowTransition = window.confirm(message);
    callback(allowTransition);
  };
  <BrowserRouter getUserConfirmation={getConfirmation} />;
  // 需要配合<Prompt> 一起使用
  ```
- KeyLength 用来设置 Location.Key 的长度。

#### HashRouter

URL 格式：[http://xxx.com/#/path](http://xxx.com/#/path)

使用 URL 的 hash 部分（即 window.location.hash）来保持 UI 和 URL 的同步。由此可以看出，**HashRouter 是通过 URL 的 hash 属性来控制路由跳转的**：

```jsx
<HashRouter basename={string} getUserConfirmation={func} hashType={string} />
```

**属性**：

- basename, getUserConfirmation 和 `BrowserRouter` 功能一样；
- hashType window.location.hash 使用的 hash 类型，有如下几种：
  - slash - 后面跟一个斜杠，例如 #/ 和 #/sunshine/lollipops；
  - noslash - 后面没有斜杠，例如 # 和 #sunshine/lollipops；
  - hashbang - Google 风格的 ajax crawlable，例如 #!/ 和 #!/sunshine/lollipops。

## 六、状态管理

把组件之间需要共享的状态抽取出来，遵循特定的约定，统一来管理，让状态的变化可以预测

### 1. Redux 概念原理

Redux 是 React 的一个状态管理库，是遵循 Flux 模式的一种实现。 Redux 简化了 React 中的单向数据流。 Redux 将状态管理完全从 React 中抽象出来。

Redux 提供了一个叫 store 的统一仓储库，组件通过 dispatch 将 state 直接传入 store，不用通过其他的组件。并且组件通过 subscribe 从 store 获取到 state 的改变。使用了 Redux，所有的组件都可以从 store 中获取到所需的 state，他们也能从 store 获取到 state 的改变。这比组件之间互相传递数据清晰明朗的多。

单纯的 Redux 只是一个状态机，是没有 UI 呈现的，react- redux 作用是将 Redux 的状态机和 React 的 UI 呈现绑定在一起，当你 dispatch action 改变 state 的时候，会自动更新页面。

#### 核心概念：

- **Store**：保存数据的地方，你可以把它看成一个容器，整个应用只能有一个 Store。

  管理 action 和 reducer 及其关系的对象，主要提供以下功能 ∶

  - 维护应用状态并支持访问状态(getState());
  - 支持监听 action 的分发，更新状态(dispatch(action));
  - 支持订阅 store 的变更(subscribe(listener));

- **State**：Store 对象包含所有数据，如果想得到某个时点的数据，就要对 Store 生成快照，这种时点的数据集合，就叫做 State。

- **Action**：State 的变化，会导致 View 的变化。但是，用户接触不到 State，只能接触到 View。所以，State 的变化必须是 View 导致的。Action 就是 View 发出的通知，表示 State 应该要发生变化了。

  一个 JavaScript 对象，描述动作相关信息，主要包含 type 属性和 payload 属性 ∶

  - type∶ action 类型;
  - payload∶ 负载数据;

- **Action Creator**：View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦，所以我们定义一个函数来生成 Action，这个函数就叫 Action Creator。
- **Reducer**：Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

  定义应用状态如何响应不同动作（action），如何更新状态;

- **dispatch**：是 View 发出 Action 的唯一方法。
- **connect**：将 React 组件与 Redux 的 store 连接起来，从而使得组件可以获取 store 中的状态，并且在状态更新的时候得到通知。
  - 获取 state
    connect 通过 context 获取 Provider 中的 store，通过 `store.getState()` 获取整个 store tree 上所有 state
  - 包装原组件
    将 state 和 action 通过 props 的方式传入到原组件内部 `wrapWithConnect` 返回—个 `ReactComponent` 对 象 Connect，Connect 重 新 render 外部传入的原组件 WrappedComponent ，并把 connect 中传入的 `mapStateToProps，mapDispatchToProps` 与组件上原有的 props 合并后，通过属性的方式传给 `WrappedComponent`
  - 监听 store tree 变化
    connect 缓存了 store tree 中 state 的状态，通过当前 state 状态 和变更前 state 状态进行比较，从而确定是否调用 `this.setState()` 方法触发 Connect 及其子组件的重新渲染

#### 原理

Redux 源码主要分为以下几个模块文件：

- compose.js 提供从右到左进行函数式编程
- createStore.js 提供作为生成唯一 store 的函数
- combineReducers.js 提供合并多个 reducer 的函数，保证 store 的唯一性
- bindActionCreators.js 可以让开发者在不直接接触 dispatch 的前提下进行更改 state 的操作
- applyMiddleware.js 这个方法通过中间件来增强 dispatch 的功能

```js
const actionTypes = {
    ADD: 'ADD',
    CHANGEINFO: 'CHANGEINFO',
}

const initState = {
    info: '初始化',
}

export default function initReducer(state=initState, action) {
    switch(action.type) {
        case actionTypes.CHANGEINFO:
            return {
                ...state,
                info: action.preload.info || '',
            }
        default:
            return { ...state };
    }
}

export default function createStore(reducer, initialState, middleFunc) {

    if (initialState && typeof initialState === 'function') {
        middleFunc = initialState;
        initialState = undefined;
    }

    let currentState = initialState;

    const listeners = [];

    if (middleFunc && typeof middleFunc === 'function') {
        // 封装dispatch
        return middleFunc(createStore)(reducer, initialState);
    }

    const getState = () => {
        return currentState;
    }

    const dispatch = (action) => {
        currentState = reducer(currentState, action);

        listeners.forEach(listener => {
            listener();
        })
    }

    const subscribe = (listener) => {
        listeners.push(listener);
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}
```

#### 工作流程：

- `const store= createStore（fn）`生成数据;
- action: `{type: Symbol('action01), payload:'payload'}`定义行为;
- dispatch 发起 action：`store.dispatch(doSomething('action001'))`;
- reducer：处理 action，返回新的 state;

**通俗讲**：

- 首先，用户（通过 View）发出（一个包含 id 和负载 payload 的）Action，发出方式就用到了 dispatch 方法。
- 然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action，Reducer 会返回新的 State
- State 一旦有变化，Store 就会调用监听函数，来更新 View。

以 store 为核心，可以把它看成数据存储中心，但是他要更改数据的时候不能直接修改，数据修改更新的角色由 Reducers 来担任，store 只做存储，中间人，当 Reducers 的更新完成以后会通过 store 的订阅来通知 react component，组件把新的状态重新获取渲染，组件中也能主动发送 action，创建 action 后这个动作是不会执行的，所以要 dispatch 这个 action，让 store 通过 reducers 去做更新 React Component 就是 react 的每个组件。

### 2. Redux 异步请求

#### redux 异步中间件

redux 中间件本质就是一个函数柯里化。redux applyMiddleware Api 源码中每个 middleware 接受 2 个参数， Store 的 getState 函数和 dispatch 函数，代表着 Redux Store 上的两个同名函数，分别获得 store 和 action，最终返回一个函数。该函数会被传入 next 的下一个 middleware 的 dispatch 方法，并返回一个接收 action 的新函数，这个函数可以直接调用 next（action），或者在其他需要的时刻调用，甚至根本不去调用它

柯里化函数两端参数一个是 middlewares，一个是 store.dispatch

Redux 的中间件提供的是位于 action 被发起之后，到达 reducer 之前的扩展点，换而言之，原本 view -→> action -> reducer -> store 的数据流加上中间件后变成了 view -> action -> middleware -> reducer -> store ，在这一环节可以做一些"副作用"的操作，如异步请求、打印日志等。

**applyMiddleware 源码：**

```js
export default function applyMiddleware(...middlewares) {
  return (createStore) =>
    (...args) => {
      // 利用传入的createStore和reducer和创建一个store
      const store = createStore(...args);
      let dispatch = () => {
        throw new Error();
      };
      const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args),
      };
      // 让每个 middleware 带着 middlewareAPI 这个参数分别执行一遍
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      // 接着 compose 将 chain 中的所有匿名函数，组装成一个新的函数，即新的 dispatch
      dispatch = compose(...chain)(store.dispatch);
      return {
        ...store,
        dispatch,
      };
    };
}
```

#### redux-thunk

```js
/**
 * 配置中间件，在store的创建中配置
 */
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import thunk from 'redux-thunk'

// 设置调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
// 设置中间件
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);

const store = createStore(reducer, enhancer);

export default store;

/**
 * 添加一个返回函数的actionCreator，将异步请求逻辑放在里面
 * 发送get请求，并生成相应action，更新store的函数
 * @param url {string} 请求地址
 * @param func {function} 真正需要生成的action对应的actionCreator
 * @return {function}
*/
// dispatch为自动接收的store.dispatch函数
export const getHttpAction = (url, func) => (dispatch) => {
    axios.get(url).then(function(res){
        const action = func(res.data)
        dispatch(action)
    })
}

/**
 * 生成action，并发送action
 */
componentDidMount(){
    var action = getHttpAction('/getData', getInitTodoItemAction)
    // 发送函数类型的action时，该action的函数体会自动执行
    store.dispatch(action)
}
```

- 优点：

  - 体积小: redux-thunk 的实现方式很简单,只有不到 20 行代码
  - 使用简单: redux-thunk 没有引入像 redux-saga 或者 redux-observable 额外的范式,上手简单

- 缺陷：

  - 样板代码过多: 与 redux 本身一样,通常一个请求需要大量的代码,而且很多都是重复性质的
  - 耦合严重: 异步操作与 redux 的 action 偶合在一起,不方便管理
  - 功能孱弱: 有一些实际开发中常用的功能需要自己进行封装

- 处理副作用：
  既可以 dispatch action 对象，也可以 dispatch 一个函数。函数的第一个参数为 dispatch 函数，在函数内部我们可以处理一些副作用，完成后再调用 dispatch 函数就又回到了纯函数的流

#### redux-saga

```js
/**
 * 配置中间件
 */
import {createStore, applyMiddleware, compose} from 'redux';
import reducer from './reducer';
import createSagaMiddleware from 'redux-saga'
import TodoListSaga from './sagas'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const sagaMiddleware = createSagaMiddleware()

const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware)
);

const store = createStore(reducer, enhancer);
sagaMiddleware.run(TodoListSaga)

export default store;

/**
 * 将异步请求放在sagas.js中
 */
import {takeEvery, put} from 'redux-saga/effects'
import {initTodoList} from './actionCreator'
import {GET_INIT_ITEM} from './actionTypes'
import axios from 'axios'

function* func(){
    try{
        // 可以获取异步返回数据
        const res = yield axios.get('/getData')
        const action = initTodoList(res.data)
        // 将action发送到reducer
        yield put(action)
    }catch(e){
        console.log('网络请求失败')
    }
}

function* mySaga(){
    // 自动捕获GET_INIT_ITEM类型的action，并执行func
    yield takeEvery(GET_INIT_ITEM, func)
}

export default mySaga

/**
 * 发送action
 */
componentDidMount(){
  const action = getInitTodoItemAction()
  store.dispatch(action)
}
```

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

    ```js
    import { fork, take } from 'redux-saga/effects';

    const takeEvery = (pattern, saga, ...args) =>
      fork(function* () {
        while (true) {
          const action = yield take(pattern);
          yield fork(saga, ...args.concat(action));
        }
      });
    ```

  - takeLatest：takeLatest 不允许多个 saga 任务并行地执行。一旦接收到新的发起的 action，它就会取消前面所有 fork 过的任务（如果这些任务还在执行的话）。在处理 AJAX 请求的时候，如果只希望获取最后那个请求的响应， takeLatest 就会非常有用。

    ```js
    import { cancel, fork, take } from 'redux-saga/effects';

    const takeLatest = (pattern, saga, ...args) =>
      fork(function* () {
        let lastTask;
        while (true) {
          const action = yield take(pattern);
          if (lastTask) {
            yield cancel(lastTask); // 如果任务已经结束，则 cancel 为空操作
          }
          lastTask = yield fork(saga, ...args.concat(action));
        }
      });
    ```

### 3. Redux 属性传递

react-redux 数据传输 ∶ `view-->action-->reducer-->store-->view`。看下点击事件的数据是如何通过 redux 传到 view 上：

- view 上的 `AddClick` 事件通过 `mapDispatchToProps` 把数据传到 action ---> click:()=>dispatch(ADD)
- action 的 ADD 传到 reducer 上
- reducer 传到 store 上 `const store = createStore(reducer)`;
- store 再通过 mapStateToProps 映射穿到 view 上 text:State.text

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
class App extends React.Component {
  render() {
    let { text, click, clickR } = this.props;
    return (
      <div>
        <div>数据:已有人{text}</div>
        <div onClick={click}>加人</div>
        <div onClick={clickR}>减人</div>
      </div>
    );
  }
}
const initialState = {
  text: 5,
};
const reducer = function (state, action) {
  switch (action.type) {
    case 'ADD':
      return { text: state.text + 1 };
    case 'REMOVE':
      return { text: state.text - 1 };
    default:
      return initialState;
  }
};

let ADD = {
  type: 'ADD',
};
let Remove = {
  type: 'REMOVE',
};

const store = createStore(reducer);

let mapStateToProps = function (state) {
  return {
    text: state.text,
  };
};

let mapDispatchToProps = function (dispatch) {
  return {
    click: () => dispatch(ADD),
    clickR: () => dispatch(Remove),
  };
};

const App1 = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <App1></App1>
  </Provider>,
  document.getElementById('root')
);
```

### 4. Flux

是一种强制单向数据流的架构模式。它控制派生数据，并使用具有所有数据权限的中心 store 实现多个组件之间的通信。整个应用中的数据更新必须只能在此处进行。 Flux 为应用提供稳定性并减少运行时的错误。

1. 核心模块:Store,Reduce,Store,Container;
2. 有多个 store;

### 5. Dva

dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架

核心概念：

- State：一个对象，保存整个应用状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect 方法：一个函数，绑定 State 到 View
- dispatch 方法：一个函数，发送 Action 到 State

### 6. Mobx

透明函数响应式编程的状态管理库，它使得状态管理简单可伸缩

1. 核心模块:

- Action:定义改变状态的动作函数，包括如何变更状态;
- Reducer:集中管理模块状态（State）和动作(action)
- Derivation(衍生):从应用状态中派生而出，且没有任何其他影响的数据

2. 有多个 store;
3. 设计更多偏向于面向对象编程和响应式编程，通常将状态包装成可观察对象，一旦状态对象变更，就能自动获得更新

#### 与 Redux 对比：

- redux 将数据保存在单一的 store 中，mobx 将数据保存在分散的多个 store 中
- redux 使用 plain object 保存数据，需要手动处理变化后的操作;mobx 适用 observable 保存数据，数据变化后自动处理响应的操作
- redux 使用不可变状态，这意味着状态是只读的，不能直接去修改它，而是应该返回一个新的状态，同时使用纯函数;mobx 中的状态是可变的，可以直接对其进行修改
- mobx 相对来说比较简单，在其中有很多的抽象，mobx 更多的使用面向对象的编程思维;redux 会比较复杂，因为其中的函数式编程思想掌握起来不是那么容易，同时需要借助一系列的中间件来处理异步和副作用
- mobx 中有更多的抽象和封装，调试会比较困难，同时结果也难以预测;而 redux 提供能够进行时间回溯的开发工具，同时其纯函数以及更少的抽象，让调试变得更加的容易

## 七、Hooks

### 1. 理解 & 原理

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。通过自定义 hook，可以复用代码逻辑。

#### 原理：

由于每次渲染都会不断的执行并产生闭包，那么从性能上和 GC 压力上都会稍逊于 Vue3。它的关键字是「每次渲染都重新执行」

#### 优点：

- 简洁: React Hooks 解决了 HOC 和 Render Props 因共享数据而出现嵌套地狱问题，更加简洁
- 解耦: React Hooks 可以更方便地把 UI 和状态分离,做到更彻底的解耦
- 组合: Hooks 中可以引用另外的 Hooks 形成新的 Hooks,组合变化万千
- 函数友好: React Hooks 为函数组件而生,从而解决了类组件的几大问题:
  1. this 指向容易错误
  2. 分割在不同声明周期中的逻辑使得代码难以理解和维护
  3. 代码复用成本高（高阶组件容易使代码量剧增）
  4. 暴露给模板的属性具有明确的来源，且函数返回的值可以任意命名，因此不会发生名称空间冲突。
  5. 没有创建仅用于逻辑重用的不必要的组件实例

#### 缺陷：

1. 额外的学习成本（Functional Component 与 Class Component 之间的困惑）
2. 写法上有限制（只能在组件顶层使，且不能出现在条件、循环中），并且写法限制增加了重构成本
3. 破坏了 PureComponent、React.memo 浅比较的性能优化效果（为了取最新的 props 和 state，每次 render()都要重新创建事件处函数）
4. 在闭包场景可能会引用到旧的 state、props 值
5. 内部实现上不直观（依赖一份可变的全局状态，不再那么“纯”）
6. React.memo 并不能完全替代 shouldComponentUpdate（因为拿不到 state change，只针对 props change）

#### 对原有 React 的 API 封装的钩子函数

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

## 八、虚拟 DOM

### 1. Diff

diff 算法，会对比新老虚拟 DOM，记录下他们之间的变化，然后将变化的部分更新到视图上。其实之前的 diff 算法，是通过循环递归每个节点，然后进行对比，复杂程度为 O(n^3)，n 是树中节点的总数，这样性能是非常差的。

触发更新的时机主要在 state 变化与 hooks 调用之后。此时触发虚拟 DOM 树变更遍历，采用了深度优先遍历算法。但传统的遍历方式，效率较低。为了优化效率，使用了分治的方式。将单一节点比对转化为了 3 种类型节点的比对，分别是树、组件及元素，以此提升效率。

#### 策略：
  1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
  2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。
  3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

基于以上三个策略，React 分别对 `tree diff、component diff 以及 element diff` 进行了算法优化

- **tree diff**：基于第一个策略，react 只会对同一层次的节点进行比较

- **component diff**：

  1. 如果是同一类型的组件，按照原策略继续比较虚拟 dom 树
  2. 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点
  3. 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算的时间，因此 React 允许用户通过 shouldComponentUpdate()判断该组件是否需要进行 diff

- **element diff**：
  当节点处于同一层级时，React diff 提供了三种节点操作：插入、移动和删除
  1. 插入：新的 component 类型不在老集合里 -> 全新的节点，需要对新节点执行插入操作
  2. 移动：在老集合里有新 component 类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 dom 节点
  3. 删除：老的 component 类型，在新集合中也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者老 component 不在新集合里，也需要执行删除操作

自 React 16 起，引入了 Fiber 架构。为了使整个更新过程可随时暂停恢复，节点与树分别采用了 FiberNode 与 FiberTree 进行重构。fiberNode 使用了双链表的结构，可以直接找到兄弟节点与子节点。整个更新过程由 current 与 workInProgress 两株树双缓冲完成。workInProgress 更新完成后，再通过修改 current 相关指针指向新节点

### 2. Key

1. 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识
2. 用于识别唯一的 Virtual DOM 元素及其驱动 UI 的相应数据。它们通过回收 DOM 中当前所有的元素来帮助 React 优化渲染。这些 key 必须是唯一的数字或字符串，React 只是重新排序元素而不是重新渲染它们。这可以提高应用程序的性能

## 九、 性能优化

### 1. 两个方向

- 减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconciliation(简单的可以理解为 diff)，如果不 render，就不会 reconciliation。（React.memo 和 useCallback ）
- 减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。（useMemo ）

在使用类组件的时候，使用的 React 优化 API 主要是：shouldComponentUpdate 和 PureComponent，这两个 API 所提供的解决思路都是为了减少重新 render 的次数，主要是减少父组件更新而子组件也更新的情况，虽然也可以在 state 更新的时候阻止当前组件渲染，如果要这么做的话，证明你这个属性不适合作为 state，而应该作为静态属性或者放在 class 外面作为一个简单的变量 。

### 2. shouldComponentUpdate

在 shouldComponentUpdate 函数中我们可以通过返回布尔值来决定当前组件是否需要更新。这层代码逻辑可以是简单地浅比较一下当前 state 和之前的 state 是否相同，也可以是判断某个值更新了才触发组件更新。一般来说不推荐完整地对比当前 state 和之前的 state 是否相同，因为组件更新触发可能会很频繁，这样的完整对比性能开销会有点大，可能会造成得不偿失的情况。

当然如果真的想完整对比当前 state 和之前的 state 是否相同，并且不影响性能也是行得通的，可以通过 immutable 库来生成不可变对象。这类库对于操作大规模的数据来说会提升不错的性能，并且一旦改变数据就会生成一个新的对象，对比前后 state 是否一致也就方便多了。

另外如果只是单纯的浅比较一下，可以直接使用 Pure Component，底层就是实现了浅比较 state。

16.6.0 之后的版本的话，可以使用 React.memo 来实现相同的功能

### 3. Memoization

memoization 是一个过程，它允许我们缓存递归/昂贵的函数调用的值，以便下次使用相同的参数调用函数时，返回缓存的值而不必重新计算函数。

从而确保了我们的应用程序运行得更快，因为我们通过返回一个已经存储在内存中的值来避免重新执行函数需要的时间。

### 4. React.memo()

React.memo() 是一个高阶组件 (HOC)，它接收一个组件 A 作为参数并返回一个组件 B，如果组件 B 的 props（或其中的值）没有改变，则组件 B 会阻止组件 A 重新渲染

### 5. useMemo()

useMemo() 是一个 React Hook，我们可以使用它在组件中包装函数。 我们可以使用它来确保该函数中的值仅在其依赖项之一发生变化时才重新计算

### 6. Immutable

JavaScript 中的对象一般是可变的（Mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如 `foo={a: 1}; bar=foo; bar.a=2` 你会发现此时 foo.a 也被改成了 2。虽然这样做可以节约内存，但当应用复杂后，这就造成了非常大的隐患，Mutable 带来的优点变得得不偿失。为了解决这个问题，一般的做法是使用 shallow-copy（浅拷贝）或 deep-copy（深拷贝）来避免被修改，但这样做造成了 CPU 和内存的浪费。

Immutable 可以很好地解决这些问题。

- IMMUTABLE DATA

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

### 7. 21 项优化 React App

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

## 十、Fiber 架构

### 1. Fiber

React Fiber 是一种基于浏览器的单线程调度算法.

React 16 之前 ，reconciliation 算法实际上是递归，想要中断递归是很困难的，React 16 开始使用了循环来代替之前的递归.

Fiber：一种将 reconciliation （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。

为了给用户制造一种应用很快的“假象”，不能让一个任务长期霸占着资源。 可以将浏览器的渲染、布局、绘制、资源加载(例如 HTML 解析)、事件响应、脚本执行视作操作系统的“进程”，需要通过某些调度策略合理地分配 CPU 资源，从而提高浏览器的用户响应速率, 同时兼顾任务执行效率。

所以 React 通过 Fiber 架构，让这个执行过程变成可被中断。“适时”地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互，还有其他好处:

- 分批延时对 DOM 进行操作，避免一次性操作大量 DOM 节点，可以得到更好的用户体验；
- 给浏览器一点喘息的机会，它会对代码进行编译优化（JIT）及进行热代码优化，或者对 reflow 进行修正。

react 在进行组件渲染时，从 setState 开始到渲染完成整个过程是同步的（“一气呵成”）。如果需要渲染的组件比较庞大，js 执行会占据主线程时间较长，会导致页面响应度变差，使得 react 在动画、手势等应用中效果比较差。
为了解决这个问题，react 团队经过两年的工作，重写了 react 中核心算法——reconciliation。并在 v16 版本中发布了这个新的特性。为了区别之前和之后的 reconciler，通常将之前的 reconciler 称为 stack reconciler，重写后的称为 fiber reconciler，简称为 Fiber。

Fiber 可以提升复杂 React 应用的可响应性和性能。

从**架构角度**来看，Fiber 即是 React 新的调度算法（reconciliation algorithm）(即调和过程)，每次有 state 的变化 React 重新计算，如果计算量过大，浏览器主线程来不及做其他的事情，比如 rerender 或者 layout，那例如动画就会出现卡顿现象。

从**编码角度**来看，React 制定了一种名为 Fiber 的数据结构，加上新的算法，使得大量的计算可以被拆解，异步化，浏览器主线程得以释放，保证了渲染的帧率。从而提高响应性。

React 将更新分为了两个时期：

- render/reconciliation：可打断，React 在 workingProgressTree 上复用 current 上的 Fiber 数据结构来一步地（通过 requestIdleCallback）来构建新的 tree，标记处需要更新的节点，放入队列中。
- commit：不可打断。在第二阶段，React 将其所有的变更一次性更新到 DOM 上。

**核心思想**

Fiber 也称协程或者纤程。它和线程并不一样，协程本身是没有并发或者并行能力的（需要配合线程），它只是一种控制流程的让出机制。让出 CPU 的执行权，让 CPU 能在这段时间执行其他的操作。渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。

将渲染分割成多个事务，更新的时候根据事务优先级来调度执行顺序。之前的更新是直接从父节点递归子节点压栈，执行，弹栈，没有优先级，也不能控制顺序；Fiber 为了实现调度功能，重构了栈，即虚拟栈(virtual stack)，这样栈的执行顺序就能定制了，调度、暂停、终止、复用事务都成为可能。

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

**Fiber 的数据结构**

一个 fiber 就是一个 JavaScript 对象，包含了元素的信息、该元素的更新操作队列、类型，其数据结构如下

```js
type Fiber = {
  // 用于标记fiber的WorkTag类型，主要表示当前fiber代表的组件类型如FunctionComponent、ClassComponent等
  tag: WorkTag,
  // ReactElement里面的key
  key: null | string,
  // ReactElement.type，调用`createElement`的第一个参数
  elementType: any,
  // The resolved function/class/ associated with this fiber.
  // 表示当前代表的节点类型
  type: any,
  // 表示当前FiberNode对应的element组件实例
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  index: number,

  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,

  // 当前处理过程中的组件props对象
  pendingProps: any,
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 上一次渲染的时候的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency: ContextDependency<mixed> | null,

  mode: TypeOfMode,

  // Effect
  // 用来记录Side Effect
  effectTag: SideEffectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成，之后版本改名为 lanes
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,

  // fiber的版本池，即记录fiber更新过程，便于恢复
  alternate: Fiber | null,
};
```

### 2. 时间分片

Time Slice:
基于可随时打断、重启的 Fiber 架构,可打断当前任务,优先处理紧急且重要的任务,保证页面的流畅运行

1. React 在渲染（render）的时候，不会阻塞现在的线程
2. 如果你的设备足够快，你会感觉渲染是同步的
3. 如果你设备非常慢，你会感觉还算是灵敏的
4. 虽然是异步渲染，但是你将会看到完整的渲染，而不是一个组件一行行的渲染出来
5. 同样书写组件的方式
