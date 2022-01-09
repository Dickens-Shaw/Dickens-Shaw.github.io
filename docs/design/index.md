## 单一职责原则

> 一个类只负责一个功能领域中的相应职责，或者可以定义为：就一个类而言，应该只有一个引起它变化的原因

## 开放封闭原则

> 核心的思想是软件实体（类、模块、函数等）是可扩展的、但不可修改的。也就是说,对扩展是开放的,而对修改是封闭的

## 单例模式

- 概念：单例模式即一个类只能构造出唯一实例，单例模式的意义在于共享、唯一
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

## 工厂模式

- 概念：工厂模式即对创建对象逻辑的封装，或者可以简单理解为对 new 的封装，这种封装就像创建对象的工厂，故名工厂模式
- 应用：工厂模式常见于大型项目，比如 JQ 的$对象，我们创建选择器对象时之所以没有new selector就是因为$()已经是一个工厂方法，其他例子例如 React.createElement()、Vue.component()都是工厂模式的实现。
- 分类：简单工厂模式、工厂方法模式、抽象工厂模式
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

## 观察者模式

- 概念：观察者监听被观察者的变化，被观察者发生改变时，通知所有的观察者
- 应用：观察者模式被广泛用于监听事件的实现

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

![blockchain](../_media/imgs/observer.png '观察者&发布订阅')

## 发布订阅模式

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

## 装饰器模式

- 概念： 装饰器模式，可以理解为对类的一个包装，动态地拓展类的功能
- 应用： ES7 的装饰器语法以及 React 中的高阶组件（HoC）都是这一模式的实现。react-redux 的 connect()也运用了装饰器模式

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

## 适配器模式

- 概念：适配器模式，将一个接口转换成客户希望的另一个接口，使接口不兼容的那些类可以一起工作
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

## 代理模式

- 概念： 代理模式，为一个对象找一个替代对象，以便对原对象进行访问。即在访问者与目标对象之间加一层代理，通过代理做授权和控制，不让外部直接访问到对象
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
      : currying(fn.bind(this, ...args), length - args.length) // 不满足要求，递归 currying 函数，新的 fn 为 bind 返回的新函数（bind 绑定了 ...args 参数，未执行），新的 length 为 fn 剩余参数的长度
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

属性描述符（Property Descriptor）是对 JavaScript 属性的描述，包括：value、writable、enumerable、configurable，除 value 其他默认为 true：

1. writable[对象是否可以再赋值]
2. enumerable[对象是否可以迭代]
3. configurable[是否可以通过 Object.defineProperty 对对象再次配置]


## 函数式和响应式

- 在函数式中，函数是一等公民，函数能作为变量的值，函数可以是另一个函数的参数，函数可以返回另一个函数
- 响应式编程是一种面向数据流和变化传播的编程范式，数据更新是相关联的。
- 把函数范式里的一套思路和响应式编程合起来就是函数响应式编程。