# 设计模式

## 概念

> 设计模式是一套被反复使用的、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了重用代码、让代码更容易被他人理解、保证代码可靠性。 毫无疑问，设计模式于己于他人于系统都是多赢的，设计模式使代码编制真正工程化，设计模式是软件工程的基石，如同大厦的一块块砖石一样。

## 设计原则

1. S – Single Responsibility Principle 单一职责原则
  - 一个程序只做好一件事，就一个类而言，应该只有一个引起它变化的原因
  - 如果功能过于复杂就拆分开，每个部分保持独立

2. O – OpenClosed Principle 开放/封闭原则
  - 对扩展开放，对修改封闭
  - 增加需求时，扩展新代码，而非修改已有代码

3. L – Liskov Substitution Principle 里氏替换原则
  - 子类能覆盖父类
  - 父类能出现的地方子类就能出现

4. I – Interface Segregation Principle 接口隔离原则
  - 保持接口的单一独立
  - 类似单一职责原则，这里更关注接口

5. D – Dependency Inversion Principle 依赖倒转原则
  - 面向接口编程，依赖于抽象而不依赖于具
  - 使用方只关注接口而不关注具体类的实现

6. 迪米特法则（Law Of Demeter）
7. 组合/聚合复用原则 (Composite/Aggregate Reuse Principle)

## 设计模式的类型

**创建型模式（Creational Patterns）**： 处理对象的创建，根据实际情况使用合适的方式创建对象。常规的对象创建方式可能会导致设计上的问题，或增加设计的复杂度。创建型模式通过以某种方式控制对象的创建来解决问题。
  - 单例模式
  - 原型模式
  - 工厂模式
  - 抽象工厂模式

**结构型模式（Structural Patterns）**： 通过识别系统中组件间的简单关系来简化系统的设计。
  - 适配器模式
  - 装饰器模式
  - 代理模式
  - 外观模式
  - 桥接模式
  - 组合模式
  - 享元模式

**行为型模式（Behavioral Patterns）**： 用于识别对象之间常见的交互模式并加以实现，如此，增加了这些交互的灵活性。
  - 观察者模式
  - 迭代器模式
  - 策略模式
  - 模板方法模式
  - 职责链模式
  - 命令模式
  - 备忘录模式
  - 状态模式
  - 访问者模式
  - 中介者模式
  - 解释器模式

## 常见设计模式

### 单例模式

- 概念：单例模式即一个类只能构造出唯一实例，单例模式的意义在于共享、唯一
- 优点：
  - 划分命名空间，减少全局变量
  - 增强模块性，把自己的代码组织在一个全局变量名下，放在单一位置，便于维护
  - 且只会实例化一次。简化了代码的调试和维护
- 缺点：
  - 由于单例模式提供的是一种单点访问，所以它有可能导致模块间的强耦合 从而不利于单元测试。无法单独测试一个调用了来自单例的方法的类，而只能把它与那个单例作为一个单元一起测试
- 应用：全局缓存、全局状态管理，Redux/Vuex 中的 store、JQ 的$或者业务场景中的购物车、登录框
- 思路：判断对象是否已经被创建,若创建则返回旧对象
- 核心：保证全局只有一个对象可以访问。因为 JS 是门无类的语言，所以别的语言实现单例的方式并不能套入 JS 中，我们只需要用一个变量确保实例只创建一次就行，以下是如何实现单例模式的例子

```js
class Singleton {
  constructor(name, password) {
    this.name = name
    this.password = password
  }
  static getInstance(name, password) {
    if (!this.instance) {
      this.instance = new Singleton(name, password)
    }
    return this.instance
  }
}
let obj1 = Singleton.getInstance('xxx', '123')
let obj2 = Singleton.getInstance('yyy', '456')
console.log(obj1 === obj2) // true
console.log(obj1) // Singleton { name: 'xxx', password: '123' }
console.log(obj2) // Singleton { name: 'xxx', password: '123' }
```

### 工厂模式

- 概念：工厂模式即对创建对象逻辑的封装，或者可以简单理解为对 new 的封装，这种封装就像创建对象的工厂，故名工厂模式
- 优点：
  - 创建对象的过程可能很复杂，但我们只需要关心创建结果。
  - 构造函数和创建者分离, 符合“开闭原则”
  - 一个调用者想创建一个对象，只要知道其名称就可以了。
  - 扩展性高，如果想增加一个产品，只要扩展一个工厂类就可以。
- 缺点：
  - 添加新产品时，需要编写新的具体产品类,一定程度上增加了系统的复杂度
  - 考虑到系统的可扩展性，需要引入抽象层，在客户端代码中均使用抽象层进行定义，增加了系统的抽象性和理解难度
- 应用：工厂模式常见于大型项目，比如 JQ 的$对象，我们创建选择器对象时之所以没有new selector就是因为$()已经是一个工厂方法，其他例子例如 React.createElement()、Vue.component()都是工厂模式的实现。
- 分类：
  - 简单工厂模式：又叫静态工厂方法，就是创建对象，并赋予属性和方法，应用：抽取类相同的属性和方法封装到对象上
  - 工厂方法模式：对产品类的抽象使其创建业务主要负责用于创建多类产品的实例
  - 抽象工厂模式
- 思路：工厂内部封装了创建对象的逻辑，隐藏了创建实例的复杂度，只需要提供一个接口

```js
class User {
  constructor(name, auth) {
    this.name = name
    this.auth = auth
  }
}
class UserFactory {
  static createUser(name, auth) {
    //工厂内部封装了创建对象的逻辑:
    //权限为admin时,auth=1, 权限为user时, auth为2
    //使用者在外部创建对象时,不需要知道各个权限对应哪个字段, 不需要知道赋权的逻辑，只需要知道创建了一个管理员和用户
    if (auth === 'admin') new User(name, 1)
    if (auth === 'user') new User(name, 2)
  }
}
const admin = UserFactory.createUser('cxk', 'admin')
const user = UserFactory.createUser('cxk', 'user')
```

### 装饰器模式

- 概念： 装饰器模式，可以理解为对类的一个包装，动态地拓展类的功能
- 优点：
  - 装饰类和被装饰类都只关心自身的核心业务，实现了解耦。
  - 方便动态的扩展功能，且提供了比继承更多的灵活性。
- 缺点：
  - 多层装饰比较复杂。
  - 常常会引入许多小对象，看起来比较相似，实际功能大相径庭，从而使得我们的应用程序架构变得复杂起来
- 应用： ES7 的装饰器语法以及 React 中的高阶组件(HoC)都是这一模式的实现。react-redux 的 connect()也运用了装饰器模式
- 使用场景：比如以前写jQ项目，可以自己快速动态拓展jQ上面的方法，或者vue的自定义指令，主要是希望通过继承的方式扩展老旧功能

```js
function info(target) {
  target.prototype.name = 'xxx'
  target.prototype.age = 10
}

@info
class Man {}
let man = new Man()
man.name // xxx
```

### 适配器模式

- 概念：适配器模式，将一个接口转换成客户希望的另一个接口，使接口不兼容的那些类可以一起工作
- 优点：
  - 可以让任何两个没有关联的类一起运行。
  - 提高了类的复用。
  - 适配对象，适配库，适配数据
- 缺点：
  - 额外对象的创建，非直接调用，存在一定的开销(且不像代理模式在某些功能点上可实现性能优化)
  - 如果没必要使用适配器模式的话，可以考虑重构，如果使用的话，尽量把文档完善
- 应用：Vue 的 computed ，例如出境旅游插头插座不匹配，这时我们就需要使用转换插头，也就是适配器来帮我们解决问题

```js
class Adaptor {
  test() {
    return 'old'
  }
}
class Target {
  constructor() {
    this.adaptor = new Adaptor()
  }
  test() {
    let result = this.adaptor.test()
    return `适配${result}`
  }
}
let target = new Target()
target.test() // 适配old
```

### 代理模式

- 概念： 代理模式，为一个对象找一个替代对象，以便对原对象进行访问。即在访问者与目标对象之间加一层代理，通过代理做授权和控制，不让外部直接访问到对象
- 优点：
  - 代理模式能将代理对象与被调用对象分离，降低了系统的耦合度。代理模式在客户端和目标对象之间起到一个中介作用，这样可以起到保护目标对象的作用
  - 代理对象可以扩展目标对象的功能；通过修改代理对象就可以了，符合开闭原则；
- 缺点：
  - 处理请求速度可能有差别，非直接访问存在开销
- 应用：事件代理、JQuery 的$.proxy、ES6 的 proxy 都是这一模式的实现

```js
const idol = {
  name: 'CXK',
  phone: '10086',
  price: '1000000',
}
const agent = new Proxy(idol, {
  get: (target) => {
    return '经纪人电话：10010'
  },
  set: (target, key, value) => {
    if (key === 'price') {
      if (value < target.price) {
        throw new Error('报价过低')
      }
      target[key] = value
    }
  },
})
agent.phone // 经纪人电话：10010
agent.price = 100 // 报价过低
```

### 观察者模式

- 概念：观察者监听被观察者的变化，被观察者发生改变时，通知所有的观察者
- 优点：
  - 支持简单的广播通信，自动通知所有已经订阅过的对象
  - 目标对象与观察者之间的抽象耦合关系能单独扩展以及重用
  - 增加了灵活性
  - 观察者模式所做的工作就是在解耦，让耦合的双方都依赖于抽象，而不是依赖于具体。从而使得各自的变化都不会影响到另一边的变化。
- 缺点：
  - 过度使用会导致对象与对象之间的联系弱化，会导致程序难以跟踪维护和理解
- 应用：观察者模式被广泛用于监听事件的实现、Vue响应式原理

```js
// 观察者
class Observer {
  constructor(fn) {
    this.update = fn
  }
}
// 被观察者
class Subject {
  constructor() {
    this.observers = [] // 观察者队列
  }
  addObserver(observer) {
    this.observers.push(observer) // 添加观察者
  }
  removeObserver(observer) {
    this.observers = this.observers.filter((item) => item !== observer)
  }
  notify(context) {
    this.observers.forEach((item) => item.update(context)) // 通知所有观察者，实际上是把观察者的update()都执行了一遍
  }
}
let subject = new Subject()
const update = (context) => {
  // 收到通知后要执行的方法
  console.log(context)
}
let observer1 = new Observer(update)
let observer2 = new Observer(update)
subject.addObserver(observer1)
subject.addObserver(observer2)
subject.notify('hello')
```

![/images/](/images/observer.png '观察者&发布订阅')

### 发布订阅模式

发布订阅模式相较于观察者模式多一个调度中心

```js
class EventEmitter {
  constructor() {
    this.events = {} // 事件对象，用于存放事件名和事件处理函数
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback) // 一个事件可以订阅多个事件处理函数
  }
  emit(eventName, ...args) {
    if (!this.events[eventName]) return
    this.events[eventName].forEach((cb) => cb(...args)) // 遍历执行所有订阅的事件处理函数
  }
  removeListener(eventName, callback) {
    if (!this.events[eventName]) return
    this.events[eventName] = this.events[eventName].filter(
      (cb) => cb !== callback
    )
  }
  once(eventName, callback) {
    // 只执行一次
    let cb = (...args) => {
      // 创建一个匿名函数，用于解除订阅
      callback(...args)
      this.removeListener(eventName, cb)
    }
    this.on(eventName, cb)
  }
}
```

### 发布 / 订阅模式和观察者模式的区别

在观察者模式中，被观察者通常会维护一个观察者列表。当被观察者的状态发生改变时，就会通知观察者。

在发布订阅模式中，具体发布者会动态维护一个订阅者的列表：可在运行时根据程序需要开始或停止发布给对应订阅者的事件通知。

区别在于发布者本身并不维护订阅列表（它不会像观察者一样主动维护一个列表），它会将工作委派给具体发布者（相当于秘书，任何人想知道我的事情，直接问我的秘书就可以了）；订阅者在接收到发布者的消息后，会委派具体的订阅者来进行相关的处理。

# 编程思想

## 柯里化

函数柯里化又叫部分求值，维基百科中对柯里化 (Currying) 的定义为：

> 在数学和计算机科学中，柯里化是一种将使用多个参数的函数转换成一系列使用一个参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

用大白话来说就是只传递给函数一部分参数来调用它，让它返回一个新函数去处理剩下的参数。使用一个简单的例子来介绍下，最常用的就是 add 函数了。

- 应用：

  1. 延迟计算：部分求和、bind 函数
  2. 动态创建函数：添加监听 addEvent、惰性函数
  3. 参数服用
  4. Function.prototype.call.bind(Object.prototype.toString)

- 实现：
  用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数

```js
function currying(fn, length) {
  length = length || fn.length // 第一次调用获取函数 fn 参数的长度，后续调用获取 fn 剩余参数的长度
  return function (...args) {
    // currying 包裹之后返回一个新函数，接收参数为 ...args
    return args.length >= length // 新函数接收的参数长度是否大于等于 fn 剩余参数需要接收的长度
      ? fn.apply(this, args) // 满足要求，执行 fn 函数，传入新函数的参数
      : currying(fn.bind(this, ...args), length - args.length) // 不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数(bind 绑定了 ...args 参数，未执行)，新的 length 为 fn 剩余参数的长度
  }
}
```

- ES6 写法：

```js
function curryingES6 = fn =>
  judge = (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...arg) =>
          judge(...args, ...arg)
```

## 属性描述符

属性描述符(Property Descriptor)是对 JavaScript 属性的描述，包括：value、writable、enumerable、configurable，除 value 其他默认为 true：

1. Configurable(可配置性)

可配置性决定是否可以使用delete删除属性，以及是否可以修改属性描述符的特性，默认值为true

2. Enumerable(可枚举性)

可枚举性决定属性是否出现在对象的属性枚举中，比如是否可以通过for-in循环返回该属性，默认值为true

3. Writable(可写性)

可写性决定是否可以修改属性的值，默认值为true

4. Value(属性值)

属性值包含这个属性的数据值，读取属性值的时候，从这个位置读；写入属性值的时候，把新值保存在这个位置。默认值为undefined

5. getter

在读取属性时调用的函数。默认值为undefined

6. setter

在写入属性时调用的函数。默认值为undefined


## 编程范式

声明式、命令式、函数式

## 函数式和响应式

- 函数式编程是面向数学的抽象，关心数据（代数结构）之间的映射关系。函数式编程将计算描述为一种表达式求值。
  在函数式中，函数是一等公民，函数能作为变量的值，函数可以是另一个函数的参数，函数可以返回另一个函数
  - 赋值`(var func = function(){})`
  - 传参`(function func(x,callback){callback();})`
  - 返回`(function(){return function(){}})`

  这样的函数也称之为第一级函数`(First-class Function)`。不仅如此，JavaScript中的函数还充当了类的构造函数的作用，同时又是一个Function类的实例`(instance)`。这样的多重身份让JavaScript的函数变得非常重要。

- 响应式编程是一种面向数据流和变化传播的编程范式，数据更新是相关联的。
- 把函数范式里的一套思路和响应式编程合起来就是函数响应式编程，响应式编程思想为体, 函数式编程思想为用。


## 纯函数

要点：

1. 函数的结果只受函数参数影响。
2. 函数内部不使用能被外部函数影响的变量。
3. 函数的结果不影响外部变量。

当你有一堆函数对某个数据进行操作的时候，就能轻松定位到哪些函数出了问题，这也就是 Redux 的中心思想，控制状态的 Reducer 就是一个纯函数。

## 反模式

指对反复出现的设计问题的常见的无力而低效的设计模式，俗话说就是重蹈覆辙：

1. 硬编码
2. 重复代码
3. 假模块化
4. 注释膨胀
5. 函数体膨胀

React 反模式：

1. 修改 props、state
2. 在 getInitialState 中使用 props
3. 判断 isMounted
4. 使用 mixins
5. 在 componentWillMount 使用 setState

## 调用优化\尾递归

- 尾调用：指某个函数的最后一步是调用另一个函数
- 尾调用优化：只保留内层函数的调用记录。
- 意义： 如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。
- 尾递归：函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
  - 递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误(stack overflow)。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。
  - 实现：柯里化、ES6函数默认参数

## 对大型项目的代码解耦设计理解？什么是 Ioc？一般 DI 采用什么设计模式实现？

1. 代码解耦、一定要按模块划分而不是按功能划分
  - 各个模块的生命周期（初始化、销毁）统一由框架进行管理：通过提供通用类Disposable，统一管理相关资源的注册和销毁。
  - 模块间不直接引入和调用，而是通过声明依赖的方式，从框架中获取相应的服务并使用。
  - 不直接使用全局事件进行通信，而是通过订阅具体服务的方式来处理：通过使用同样的方式this._register()注册事件和订阅事件，将事件相关资源的处理统一挂载到dispose()方法中

2. 各个部分各个模块开发职责的仔细拆分
3. 代码开发尽快组件化、提高可复用性，避免业务逻辑过度耦合臃肿，最终难以拓展

Ioc是指依赖注入，简单理解就是借助于"第三方"实现具有依赖关系的对象之间的解耦。一般使用代理模式。

## 控制反转、依赖注入

> 控制反转(Inversion of Control，缩写为 IoC)，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入(Dependency Injection，简称 DI)，还有一种方式叫“依赖查找”(Dependency Lookup)。通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。

原则：

1. 高层模块不应该依赖低层模块。两个都应该依赖抽象
2. 抽象不应该依赖具体实现
3. 面向接口编程，而非面向实现编程

## 面向切面编程

面向切面编程是面向对象中的一种方式而已。在代码执行过程中，动态嵌入其他代码，叫做面向切面编程

重点就是将核心关注面分离出横切关注面，前端可以用 AOP 优雅的来组织数据上报、性能分析、统计函数的执行时间、动态改变函数参数、插件式的表单验证等代码。