## 变量声明

> var、let、const

1. 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
2. var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
3. var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
4. let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

## 暂时性死区

> 使用 let、const 命令声明变量之前，该变量都是不可用的

当程序的控制流程在新的作用域进行实例化时，在此作用域中用 let/const 声明的变量会先在作用域中被创建出来，但因此时还未进行`词法绑定`（对声明语句进行求值运算），所以不能被访问（访问就会抛出错误）。

所以在这运行流程进入作用域创建变量，到变量开始被访问之间的一段时间，就称之为`temporal dead zone（简称TDZ，暂时性死区）`

## 箭头函数

1. 箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值，这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this，
2. 箭头函数没有自己的`arguments`对象，但是可以访问外围函数的`arguments`对象
3. 不能通过 new 关键字调用，同样也没有`new.target`值和原型

## Set

> set 是放不重复的项，也就是去重

```js
let set = new Set([1, 2, 3, 4, 3, 2, 1])
console.log(set) // Set { 1, 2, 3, 4 }
```

Set 有几个常用的方法，`add\ clear\ delete\ entries\ forEach\ has\ keys\ values`

Set 常用于：

- 求并集

```js
function distinct(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])]
}
let arr = distinct([1, 2, 3], [2, 3, 4, 5])
console.log(arr) // [1, 2, 3, 4, 5]
```

- 求交集

```js
function intersect(arr1, arr2) {
  return [...new Set([...arr1].filter((x) => arr2.includes(x)))]
}
let arr = intersect([1, 2, 3], [2, 3, 4, 5])
console.log(arr) // [2, 3]
```

- 求差集

```js
function difference(arr1, arr2) {
  return [...new Set([...arr1].filter((x) => !arr2.includes(x)))]
}
let arr = difference([1, 2, 3], [2, 3, 4, 5])
console.log(arr) // [1]
```

## Map

> 也是集合，主要格式是 key => value，同样是不能放重复的 key

Map 有几个常用的方法，`clear\ delete\ entries\ forEach\ get\ has\ keys\ set\ values`

## Class

> 核心还是继承，而 Class 我认为是 es5 面向对象的语法糖。

Class 实现继承的核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，因为这段代码可以看成 `Parent.call(this, value)`

```js
class Parent {
  constructor(value) {
    this.value = value
  }
  getValue() {
    return this.value
  }
}
class Child extends Parent {
  constructor(value) {
    super(value) // 此处的 super 相当于 Parent.call(this, value)
    this.value = value
  }
}
let child = new Child(1)
child.getValue() // 1
child instanceof Parent // true
```

## 装饰器 Decorator

> 装饰器是一种特殊的函数，它能够被附加到类声明，方法，属性或参数上，用来扩展类的功能

- 装饰类

```js
function myFunc(target) {
  target.name = 'xxx'
}
@myFunc
class Parent {}
Person.name // 'xxx'
```

- 传参

```js
function myFunc(value) {
  return function (target) {
    target.name = value
  }
}
@myFunc('xxx')
class Parent {}
Person.name // 'xxx'
```

- 装饰方法

```js
// 参数为方法名/ 参数列表/ 函数体
function myFunc(target, key, descriptor) {
  Object.assign(target, {
    name: 'xxx',
  })
}
class Parent {
  @myFunc
  say() {}
}
let p = new Parent()
p.say.name // 'xxx'
```

- 装饰属性

```js
// 参数为属性名/ 参数列表/ 属性描述符
function myFunc(target, key, descriptor) {
  descriptor.writable = false
}
class Parent {
  @myFunc
  name = 'xxx'
}
let p = new Parent()
p.name = 'yyy' // 报错, 不可修改
```

## Proxy

> Proxy 是一个拦截对象的操作，可以拦截对象的属性的读取和设置，以及方法的调用，还可以拦截整个对象的操作

```js
let obj = {
  name: 'xxx',
}
let proxy = new Proxy(obj, {
  get(target, key) {
    return target[key].toUpperCase()
  },
  set(target, key, value) {
    target[key] = value.toUpperCase()
  },
})
proxy.name // 'XXX'
proxy.name = 'yyy' // 'YYY'
```

## 前端模块化

> 前端模块化，就是将代码分割成不同的文件，每个文件可以被认为是一个模块，模块之间可以相互调用，模块之间可以相互引用

好处：

1. 解决命名冲突
2. 提高复用性
3. 提高代码的可维护性

- 立即执行函数

在早期，使用立即执行函数实现模块化是常见的手段，通过函数作用域解决了`命名冲突、污染全局作用域`的问题

```js
;(function (exports, require, module, __filename, __dirname) {
  // 内部代码
})()
// exports
// require
// module
// __filename
// __dirname
```

- AMD 和 require.js

使用 require.js 来编写模块化，特点：依赖必须`提前声明`

AMD 规范采用`异步`方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

这里介绍用 require.js 实现 AMD 规范的模块化：用`require.config()`指定引用路径等，用`define()`定义模块，用 require()加载模块。

- CMD 和 sea.js

使用 sea.js 来编写模块化，特点：支持`动态引入`依赖文件

CMD 是另一种 js 模块化方案，它与 AMD 很类似，不同点在于：AMD 推崇`依赖前置、提前执行`，CMD 推崇`依赖就近、延迟执行`。此规范其实是在 sea.js 推广过程中产生的。

- CommonJS

Node.js 是 commonJS 规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module、exports、require、global`。

实际使用时，用`module.exports`定义当前模块对外输出的接口（不推荐直接用`exports`），用`require`加载模块。

CommonJS 用`同步`的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

CommonJS 模块加载过程是`同步阻塞性地加载`，在模块代码被运行前就已经写入了 cache，同一个模块被多次 require 时只会执行一次，重复的 require 得到的是相同的 exports 引用
运行机制：注入 exports、require、module 三个全局变量，然后执行模块的源码，然后将模块的 exports 变量的值输出

- ES6 Module

ES6 在`语言标准`的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：export 和 import。export 命令用于`规定模块的对外接口`，import 命令用于`输入其他模块提供的功能`。

还提供了`export default`命令，为模块`指定默认输出`，对应的 import 语句不需要使用大括号。这也更趋近于 ADM 的引用写法。

ES6 的模块不是对象，import 命令会被 JavaScript 引擎`静态分析`，在`编译时`就引入模块代码，而不是在代码`运行时`加载，所以`无法实现条件加载`。也正因为这个，使得`静态分析`成为可能。

运行机制：js 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，import 加载的值也会跟着变。因此，ES6 模块是`动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块。

- ESM 和 CJS 的差异

  1. CommonJS 模块输出的是一个值的`拷贝`，ES6 模块输出的是值的`引用`
  2. CommonJS 模块是`运行时加载`，ES6 模块是`编译时输出`接口
  3. CommonJS 支持`动态导入`，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
  4. CommonJS 是`同步`导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是`异步`导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
  5. CommonJS 在导出时都是`值拷贝`，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
  6. ES Module 会编译成 `require/exports `来执行的
