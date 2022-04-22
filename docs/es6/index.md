## ES6(2015)

- 块作用域
- 类
- 箭头函数
- 模板字符串
- 对象属性简写
- 解构赋值
- Promise
- 模块化
- Symbol
- 代理（proxy）Set
- 函数默认参数
- 延展操作符 rest

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
2. 箭头函数没有自己的`arguments`对象，但是可以访问外围函数的`arguments`对象，可以用 rest 参数来获取箭头函数中传递的参数
3. 不能通过 new 关键字调用，同样也没有`new.target`值和原型
4. 更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

## Set

> Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

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

### WeakSet

WeakSet 的成员只能是对象，而不能是其他类型的值。

WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

## Map

> 类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键

Map 有几个常用的方法，`clear\ delete\ entries\ forEach\ get\ has\ keys\ set\ values`

## Class

> 核心还是继承，而 Class 我认为是 es5 面向对象使用构造函数的语法糖，在底层中使用仍然是原型和基于原型的继承。

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

### 装饰器 Decorator

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

### AMD 和 require.js

使用 require.js 来编写模块化，特点：依赖必须`提前声明`

AMD 规范采用`异步`方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

这里介绍用 require.js 实现 AMD 规范的模块化：用`require.config()`指定引用路径等，用`define()`定义模块，用 require()加载模块。

### CMD 和 sea.js

使用 sea.js 来编写模块化，特点：支持`动态引入`依赖文件

CMD 是另一种 js 模块化方案，它与 AMD 很类似，不同点在于：AMD 推崇`依赖前置、提前执行`，CMD 推崇`依赖就近、延迟执行`。此规范其实是在 sea.js 推广过程中产生的。

### CommonJS

Node.js 是 commonJS 规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module、exports、require、global`。

实际使用时，用`module.exports`定义当前模块对外输出的接口（不推荐直接用`exports`），用`require`加载模块。

CommonJS 用`同步`的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

CommonJS 模块加载过程是`同步阻塞性地加载`，在模块代码被运行前就已经写入了 cache，同一个模块被多次 require 时只会执行一次，重复的 require 得到的是相同的 exports 引用
运行机制：注入 exports、require、module 三个全局变量，然后执行模块的源码，然后将模块的 exports 变量的值输出

### ES6 Module

ES6 在`语言标准`的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：export 和 import。export 命令用于`规定模块的对外接口`，import 命令用于`输入其他模块提供的功能`。

还提供了`export default`命令，为模块`指定默认输出`，对应的 import 语句不需要使用大括号。这也更趋近于 ADM 的引用写法。

ES6 的模块不是对象，import 命令会被 JavaScript 引擎`静态分析`，在`编译时`就引入模块代码，而不是在代码`运行时`加载，所以`无法实现条件加载`。也正因为这个，使得`静态分析`成为可能。

运行机制：js 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，import 加载的值也会跟着变。因此，ES6 模块是`动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块。

### ESM 和 CJS 的差异

  1. CommonJS 模块输出的是一个值的`拷贝`，ES6 模块输出的是值的`引用`
  2. CommonJS 模块是`运行时加载`，ES6 模块是`编译时输出`接口
  3. CommonJS 支持`动态导入`，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
  4. CommonJS 是`同步`导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是`异步`导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
  5. CommonJS 在导出时都是`值拷贝`，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
  6. ES Module 会编译成 `require/exports `来执行的
  7. CommonJS和ES6 Module都可以对引入的对象进行赋值，即对对象内部属性的值进行改变；
  8. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。即ES6 Module只存只读，不能改变其值，具体点就是指针指向不能变；
  9. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
  10. CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。
  11. import 的接口是 read-only（只读状态），不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向，可以对 commonJS 对重新赋值（改变指针指向），但是对 ES6 Module 赋值会编译报错。

优势： CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 Modules不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

## ES7(2016)

- `Array.prototype.includes()`

```js
arr.indexOf(x) >= 0
// 等价于
arr.includes(x)
```

- 指数运算符`**`

```js
function calculateExponent(base, exponent) {
  if (exponent === 1) {
    return base
  } else {
    return base * calculateExponent(base, exponent - 1)
  }
}

console.log(calculateExponent(2, 10)) // 输出1024
console.log(Math.pow(2, 10)) // 输出1024
// 指数运算符
console.log(2 ** 10) // 输出1024
```

## ES8(2017)

- async/await
- Object.values()

```js
const obj = { a: 1, b: 2, c: 3 }

const values1 = Object.keys(obj).map((key) => obj[key]) // ES7

const values2 = Object.values(obj) // ES8
```

- Object.entries()，函数返回一个给定对象自身可枚举属性的键值对的数组

```js
Object.keys(obj).forEach((key) => {
  console.log('key:' + key + ' value:' + obj[key])
}) // ES7

Object.entries(obj).forEach((entry) => {
  console.log('key:' + entry[0] + ' value:' + entry[1])
}) // ES8
```

- String padding: padStart()和 padEnd()，填充字符串达到当前长度

> String.padStart(targetLength,[padString])

1. targetLength:当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
2. padString:(可选)填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断，此参数的缺省值为 " "。

```js
console.log('0.0'.padStart(4, '10')) //10.0
console.log('0.0'.padStart(20)) // 0.00
```

> String.padEnd(targetLength,[padString])

1. targetLength:当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
2. padString:(可选) 填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断，此参数的缺省值为 " "；

```js
console.log('0.0'.padEnd(4, '0')) //0.00
console.log('0.0'.padEnd(10, '0')) //0.00000000
```

- 函数参数列表结尾允许逗号

主要作用是方便使用 git 进行多人协作开发时修改同一个函数减少不必要的行变更。

- Object.getOwnPropertyDescriptors()

获取一个对象的所有自身属性的描述符,如果没有任何自身属性，则返回空对象。

```js
const obj2 = {
  name: 'Jine',
  get age() {
    return '18'
  },
}
Object.getOwnPropertyDescriptors(obj2)
// {
//   age: {
//     configurable: true,
//     enumerable: true,
//     get: function age(){}, //the getter function
//     set: undefined
//   },
//   name: {
//     configurable: true,
//     enumerable: true,
//      value:"Jine",
//      writable:true
//   }
// }
```

- ShareArrayBuffer 和 Atomics 对象，用于从共享内存位置读取和写入

## ES9(2018)

- 异步迭代(asynchronous iterators)

ES2018 引入异步迭代器（asynchronous iterators），这就像常规迭代器，除了 next()方法返回一个 Promise。因此 await 可以和 for...of 循环一起使用，以串行的方式运行异步操作

```js
async function process(array) {
  for await (let i of array) {
    doSomething(i)
  }
}
```

- Promise.finally()
- Rest/Spread 属性
- 正则表达式命名捕获组（Regular Expression Named Capture Groups）
- 正则表达式反向断言（lookbehind）
- 正则表达式 dotAll 模式
- 正则表达式 Unicode 转义
- 非转义序列的模板字符串

## ES10(2019)

- 行分隔符（U + 2028）和段分隔符（U + 2029）符号现在允许在字符串文字中，与 JSON 匹配
- 更加友好的 JSON.stringify
- 新增了 Array 的 flat()方法和 flatMap()方法

flat()和 flatMap()本质上就是是归纳（reduce） 与 合并（concat）的操作。

- 新增了 String 的 trimStart()方法和 trimEnd()方法，去除字符串首尾空白字符
- Object.fromEntries()
- Symbol.prototype.description
- String.prototype.matchAll
- Function.prototype.toString()现在返回精确字符，包括空格和注释
- 简化 try {} catch {},修改 catch 绑定

```js
// 在 ES10 之前，我们必须通过语法为 catch 子句绑定异常变量，无论是否有必要。很多时候 catch 块是多余的。 ES10 提案使我们能够简单的把变量省略掉。
try {} catch(e) {}  => try {} catch {}
```

## ES11(2020)

- 新的基本数据类型 BigInt
- 空值合并运算符（??）
- 可选链操作符（?.）
- Promise.allSettled()
- import()
- globalThis

## ES12(2020)

- String.prototype.replaceAll()
- 数字分隔符 (1_000_000)
- Promise.any()
