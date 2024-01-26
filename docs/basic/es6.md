# ES6+

::: info ES6 和 ES2015 的区别
`ES2015` 是一个年份标记，表示当年发布的 `ECMAScript` 标准的正式版本，其全称为《`ECMAScript 2015` 标准》（简称 `ES2015`）<br>
`ES6` 是一个历史名词也是一个泛指，含义是 `5.1` 版以后的 `JavaScript` 的下一代标准，涵盖了 `ES2015、ES2016、ES2017 ES2018` 等等
:::

## ES6(2015)

- **表达式**：声明、解构赋值
- **内置对象**：字符串扩展、数值扩展、对象扩展、数组扩展、函数扩展、正则扩展、Symbol、Set、Map、Proxy、Reflect
- **语句与运算**：Class、Module、Iterator
- **异步编程**：Promise、Generator、Async

### 1. 变量声明

> var、let、const

1. 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
2. var 存在提升，我们能在声明之前使用。let、const 因为暂时性死区的原因，不能在声明前使用
3. var 在全局作用域下声明变量会导致变量挂载在 window 上，其他两者不会
4. let 和 const 作用基本一致，但是后者声明的变量不能再次赋值

### 2. 暂时性死区

> 使用 let、const 命令声明变量之前，该变量都是不可用的

当程序的控制流程在新的作用域进行实例化时，在此作用域中用 let/const 声明的变量会先在作用域中被创建出来，但因此时还未进行`词法绑定`（对声明语句进行求值运算），所以不能被访问（访问就会抛出错误）。

所以在这运行流程进入作用域创建变量，到变量开始被访问之间的一段时间，就称之为`temporal dead zone（简称TDZ，暂时性死区）`

### 3. 箭头函数

1. 箭头函数没有 this，所以需要通过查找作用域链来确定 this 的值，这就意味着如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this，
2. 箭头函数没有自己的`arguments`对象，但是可以访问外围函数的`arguments`对象，可以用 rest 参数来获取箭头函数中传递的参数
3. 不能通过 new 关键字调用，同样也没有`new.target`值和原型`prototype`
4. 更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数。

### 4. Set / WekSet

#### Set

> Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。

```js
let set = new Set([1, 2, 3, 4, 3, 2, 1]);
console.log(set); // Set { 1, 2, 3, 4 }
```

Set 有几个常用的方法，`add\ clear\ delete\ entries\ forEach\ has\ keys\ values`

Set 常用于：

- 求并集

```js
function distinct(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}
let arr = distinct([1, 2, 3], [2, 3, 4, 5]);
console.log(arr); // [1, 2, 3, 4, 5]
```

- 求交集

```js
function intersect(arr1, arr2) {
  return [...new Set([...arr1].filter((x) => arr2.includes(x)))];
}
let arr = intersect([1, 2, 3], [2, 3, 4, 5]);
console.log(arr); // [2, 3]
```

- 求差集

```js
function difference(arr1, arr2) {
  return [...new Set([...arr1].filter((x) => !arr2.includes(x)))];
}
let arr = difference([1, 2, 3], [2, 3, 4, 5]);
console.log(arr); // [1]
```

#### WeakSet

WeakSet 的成员只能是对象，而不能是其他类型的值。

WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

### 5. Map / WeakMap

#### Map

> 类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键

| &nbsp;   | Map                                                                        | Object                                                                      |
| -------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 意外的键 | Map 默认情况不包含任何键，只包含显式插入的键。                             | Object 有一个原型, 原型链上的键名有可能和自己在对象上的设置的键名产生冲突。 |
| 键的类型 | Map 的键可以是任意值，包括函数、对象或任意基本类型。                       | Object 的键必须是 String 或是 Symbol。                                      |
| 键的顺序 | Map 中的 key 是有序的。因此，当迭代的时候， Map 对象以插入的顺序返回键值。 | Object 的键是无序的                                                         |
| Size     | Map 的键值对个数可以轻易地通过 size 属性获取                               | Object 的键值对个数只能手动计算                                             |
| 迭代     | Map 是 iterable 的，所以可以直接被迭代。                                   | 迭代 Object 需要以某种方式获取它的键然后才能迭代。                          |
| 性能     | 在频繁增删键值对的场景下表现更好。                                         | 在频繁添加和删除键值对的场景下未作出优化。                                  |

Map 有几个常用的方法，`clear\ delete\ entries\ forEach\ get\ has\ keys\ set\ values`

#### WeakMap

WeakMap 对象也是一组键值对的集合，其中的键是弱引用的。其键必须是对象，原始数据类型不能作为 key 值，而值可以是任意的。

其 clear()方法已经被弃用，所以可以通过创建一个空的 WeakMap 并替换原对象来实现清除。

WeakMap 的设计目的在于，有时想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。一旦不再需要这两个对象，就必须手动删除这个引用，否则垃圾回收机制就不会释放对象占用的内存。

而 WeakMap 的**键名所引用的对象都是弱引用**，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的**键名对象和所对应的键值对会自动消失，不用手动删除引用**。

### 6. Class

> 核心还是继承，而 Class 我认为是 es5 面向对象使用构造函数的语法糖，在底层中使用仍然是原型和基于原型的继承。

Class 实现继承的核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，因为这段代码可以看成 `Parent.call(this, value)`

```js
class Parent {
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}
class Child extends Parent {
  constructor(value) {
    super(value); // 此处的 super 相当于 Parent.call(this, value)
    this.value = value;
  }
}
let child = new Child(1);
child.getValue(); // 1
child instanceof Parent; // true
```

### 7. extends 被编译

```js
function _possibleConstructorReturn(self, call) {
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var Parent = function Parent() {
  // 验证是否是 Parent 构造出来的 this
  _classCallCheck(this, Parent);
};
var Child = (function (_Parent) {
  _inherits(Child, _Parent);
  function Child() {
    _classCallCheck(this, Child);
    return _possibleConstructorReturn(
      this,
      (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments)
    );
  }
  return Child;
})(Parent);
```

核心是`_inherits`函数，可以看到它采用的是————**寄生组合继承方式**，同时证明了这种方式的成功。不过这里加了一个`Object.setPrototypeOf(subClass, superClass)`，用来继承父类的静态方法。

### 8. 装饰器 Decorator

> 装饰器是一种特殊的函数，它能够被附加到类声明，方法，属性或参数上，用来扩展类的功能

- 装饰类

```js
function myFunc(target) {
  target.name = 'xxx';
}
@myFunc
class Parent {}
Person.name; // 'xxx'
```

- 传参

```js
function myFunc(value) {
  return function (target) {
    target.name = value;
  };
}
@myFunc('xxx')
class Parent {}
Person.name; // 'xxx'
```

- 装饰方法

```js
// 参数为方法名/ 参数列表/ 函数体
function myFunc(target, key, descriptor) {
  Object.assign(target, {
    name: 'xxx',
  });
}
class Parent {
  @myFunc
  say() {}
}
let p = new Parent();
p.say.name; // 'xxx'
```

- 装饰属性

```js
// 参数为属性名/ 参数列表/ 属性描述符
function myFunc(target, key, descriptor) {
  descriptor.writable = false;
}
class Parent {
  @myFunc
  name = 'xxx';
}
let p = new Parent();
p.name = 'yyy'; // 报错, 不可修改
```

### 9. Proxy

> Proxy 是一个拦截对象的操作，可以拦截对象的属性的读取和设置，以及方法的调用，还可以拦截整个对象的操作

```js
let obj = {
  name: 'xxx',
};
let proxy = new Proxy(obj, {
  get(target, key) {
    return target[key].toUpperCase();
  },
  set(target, key, value) {
    target[key] = value.toUpperCase();
  },
});
proxy.name; // 'XXX'
proxy.name = 'yyy'; // 'YYY'
```

## 前端模块化

> 前端模块化，就是将代码分割成不同的文件，每个文件可以被认为是一个模块，模块之间可以相互调用，模块之间可以相互引用

好处：

1. 解决命名冲突
2. 提高复用性
3. 提高代码的可维护性

### 1. 立即执行函数

在早期，使用立即执行函数实现模块化是常见的手段，通过函数作用域解决了`命名冲突、污染全局作用域`的问题

```js
(function (exports, require, module, __filename, __dirname) {
  // 内部代码
})();
// exports
// require
// module
// __filename
// __dirname
```

### 2. AMD 和 require.js

使用 require.js 来编写模块化，特点：依赖必须`提前声明`

AMD 规范采用`异步`方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

这里介绍用 require.js 实现 AMD 规范的模块化：用`require.config()`指定引用路径等，用`define()`定义模块，用 require()加载模块。

### 3. CMD 和 sea.js

使用 sea.js 来编写模块化，特点：支持`动态引入`依赖文件

CMD 是另一种 js 模块化方案，它与 AMD 很类似，不同点在于：AMD 推崇`依赖前置、提前执行`，CMD 推崇`依赖就近、延迟执行`。此规范其实是在 sea.js 推广过程中产生的。

### 4. CommonJS

Node.js 是 commonJS 规范的主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module、exports、require、global`。

实际使用时，用`module.exports`定义当前模块对外输出的接口（不推荐直接用`exports`），用`require`加载模块。

CommonJS 用`同步`的方式加载模块。在服务端，模块文件都存在本地磁盘，读取非常快，所以这样做不会有问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

CommonJS 模块加载过程是`同步阻塞性地加载`，在模块代码被运行前就已经写入了 cache，同一个模块被多次 require 时只会执行一次，重复的 require 得到的是相同的 exports 引用
运行机制：注入 exports、require、module 三个全局变量，然后执行模块的源码，然后将模块的 exports 变量的值输出

### 5. ES6 Module

ES6 在`语言标准`的层面上，实现了模块功能，而且实现得相当简单，旨在成为浏览器和服务器通用的模块解决方案。其模块功能主要由两个命令构成：export 和 import。export 命令用于`规定模块的对外接口`，import 命令用于`输入其他模块提供的功能`。

还提供了`export default`命令，为模块`指定默认输出`，对应的 import 语句不需要使用大括号。这也更趋近于 ADM 的引用写法。

ES6 的模块不是对象，import 命令会被 JavaScript 引擎`静态分析`，在`编译时`就引入模块代码，而不是在代码`运行时`加载，所以`无法实现条件加载`。也正因为这个，使得`静态分析`成为可能。

运行机制：js 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，import 加载的值也会跟着变。因此，ES6 模块是`动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块。

### 6. ESM 和 CJS 的差异

1. CommonJS 模块输出的是一个值的`拷贝`，ES6 模块输出的是值的`引用`
2. CommonJS 模块是`运行时加载`，ES6 模块是`编译时输出`接口
3. CommonJS 支持`动态导入`，也就是 `require(${path}/xx.js)`，后者目前不支持，但是已有提案
4. CommonJS 是`同步`导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是`异步`导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响
5. CommonJS 在导出时都是`值拷贝`，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是 ES Module 采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化
6. ES Module 会编译成 `require/exports `来执行的
7. CommonJS 和 ES6 Module 都可以对引入的对象进行赋值，即对对象内部属性的值进行改变；
8. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。即 ES6 Module 只存只读，不能改变其值，具体点就是指针指向不能变；
9. CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
10. CommonJS 模块的 require()是同步加载模块，ES6 模块的 import 命令是异步加载，有一个独立的模块依赖的解析阶段。
11. import 的接口是 read-only（只读状态），不能修改其变量值。 即不能修改其变量的指针指向，但可以改变变量内部指针指向，可以对 commonJS 对重新赋值（改变指针指向），但是对 ES6 Module 赋值会编译报错。

优势： CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 Modules 不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

## ES7(2016)

### 1. Array.P.includes()

用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回 false

```js
const arr = ['es6', 'es7', 'es8'];
console.log(arr.includes('es6')); // true
console.log(arr.includes('es9')); // false
```

接收俩个参数，要搜索的值和搜索的开始索引。第二个参数可选。从该索引处开始查找 searchElement。如果为负值，则从末尾第几个开始查找。

```js
const arr = ['es6', 'es7', 'es8'];
console.log(arr.includes('es7', 1)); // true
console.log(arr.includes('es7', 2)); // false
console.log(arr.includes('es7', -1)); // false
console.log(arr.includes('es7', -2)); // true
```

**与 indexOf 比较：**

1. `indexOf`返回的不是`boolean`值，而是下标或-1
2. `includes`方法**只能判断简单类型的数据**，对于复杂类型的数据，比如对象类型的数组，二维数组，这些是无法判断的
3. 两者都是采用`===`的操作符来作比较的，不同之处在于：对于`NaN`的处理结果不同。我们知道 js 中 `NaN === NaN` 的结果是 false, `indexOf()`也是这样处理的，但是`includes()`不是这样的
4. 如果只想知道某个值**是否在数组中存在**，而并不关心它的索引位置，建议使用 includes()。如果想获取一个值**在数组中的位置**，那么只能使用 indexOf 方法。

### 2. 幂运算符 \*\*

```js
function calculateExponent(base, exponent) {
  if (exponent === 1) {
    return base;
  } else {
    return base * calculateExponent(base, exponent - 1);
  }
}

console.log(calculateExponent(2, 10)); // 输出1024
console.log(Math.pow(2, 10)); // 输出1024
// 指数运算符
console.log(2 ** 10); // 输出1024
```

## ES8(2017)

### 1. Async / Await

在 ES2017（ES8）中引入了 async 函数，使得异步操作变得更加方便。Async/Await 的出现，被很多人认为是 js 异步操作的最终且最优雅的解决方案。我们可以简单理解`Async/Await = Generator + Promise`

async 用于声明一个 function 是异步的，await 用于等待一个异步方法执行完成，只有当异步完成后才会继续往后执行。await 不是必须的并且 await 只能出现在 async 函数中。

```js
async function() {
  const result = await getData()
  console.log(result)
}
```

一个函数如果加上 async ，那么该函数就会返回一个 Promise

```js
async function async1() {
  return '1';
}
console.log(async1()); // -> Promise {<resolved>: "1"}
```

### 2. Object 扩展

#### Object.values()

返回一个数组，其元素是在对象上找到的可枚举属性值。属性的顺序与通过手动循环对象的属性值所给出的顺序相同(`for...in`，但是`for...in`还会遍历原型上的属性值)

```js
const obj = { a: 1, b: 2, c: 3 };

const values1 = Object.keys(obj).map((key) => obj[key]); // ES7

const values2 = Object.values(obj); // ES8
```

#### Object.entries()

方法返回一个给定对象自身可枚举属性的键值对数组

```js
Object.keys(obj).forEach((key) => {
  console.log('key:' + key + ' value:' + obj[key]);
}); // ES7

Object.entries(obj).forEach((entry) => {
  console.log('key:' + entry[0] + ' value:' + entry[1]);
}); // ES8
```

#### Object.getOwnPropertyDescriptors()

获取一个对象的所有自身属性的描述符,如果没有任何自身属性，则返回空对象。

```js
const obj = {
  name: 'XXX',
  get age() {
    return '18';
  },
};
Object.getOwnPropertyDescriptors(obj);
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
//     value:"XXX",
//     writable:true
//   }
// }
```

### 3. String 扩展

String padding: padStart()和 padEnd()，填充字符串达到当前长度

#### String.prototype.padStart(targetLength,[padString])

1. targetLength:当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
2. padString:(可选)填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断，此参数的缺省值为 " "。

```js
console.log('0.0'.padStart(4, '10')); //10.0
console.log('0.0'.padStart(20)); // 0.00
```

#### String.prototype.padEnd(targetLength,[padString])

1. targetLength:当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
2. padString:(可选) 填充字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断，此参数的缺省值为 " "；

```js
console.log('0.0'.padEnd(4, '0')); //0.00
console.log('0.0'.padEnd(10, '0')); //0.00000000
```

### 4. 尾逗号 Trailing commas

主要作用是方便使用 git 进行多人协作开发时修改同一个函数减少不必要的行变更。

### 5. SharedArrayBuffer 和 Atomics 对象

通过共享内存来提升 workers 之间或者 worker 和主线程之间的消息传递速度。

## ES9(2018)

### 1. for-await-of

异步迭代(asynchronous iterators)，循环等待每个 Promise 对象变为 resolved 状态才进入下一步。

await 可以和 for...of 循环一起使用，以串行的方式运行异步操作

```js
async function process(array) {
  for await (let i of array) {
    doSomething(i);
  }
}
```

### 2. Promise.finally()

指定不管最后状态如何都会执行的回调函数。

Promise.prototype.finally() 方法返回一个 Promise，在 promise 执行结束时，无论结果是 fulfilled 或者是 rejected，在执行 then()和 catch()后，都会执行 finally 指定的回调函数。这为指定执行完 promise 后，无论结果是 fulfilled 还是 rejected 都需要执行的代码提供了一种方式，避免同样的语句需要在 then()和 catch()中各写一次的情况。

```js
Promise.resolve()
  .then()
  .catch((e) => e)
  .finally();
```

比如我们常用的场景：loading 关闭

需要每次发送请求，都会有 loading 提示，请求发送完毕，就需要关闭 loading 提示框，不然界面就无法被点击。不管请求成功或是失败，这个 loading 都需要关闭掉，这时把关闭 loading 的代码写在 finally 里再合适不过了。

### 3. Object Rest / Spread

```js
const values = [1, 2, 3, 5, 6];
console.log(Math.max(...values)); // 6

const obj = { a: 1, b: 2, c: 3 };
const obj2 = { ...obj, d: 4 }; // { a: 1, b: 2, c: 3, d: 4 }
```

### 4. 正则扩展

- 正则表达式命名捕获组（Regular Expression Named Capture Groups）
- 正则表达式反向断言（lookbehind）
- 正则表达式 dotAll 模式
- 正则表达式 Unicode 转义

### 5. 非转义序列的模板字符串

- 标签函数 Tagged templates
- String.raw()
- 原始字符串
- 带标签函数的转义序列
- ES2018 关于非法转义序列的修订

## ES10(2019)

### 1. Object.fromEntries()

把键值对列表转换为一个对象，这个方法是和 Object.entries() 相对的。

```js
Object.fromEntries([
  ['foo', 1],
  ['bar', 2],
]);
// {foo: 1, bar: 2}
```

### 2. String 扩展

#### String.prototype.trimStart() / String.prototype.trimLeft()

`String.prototype.trimLeft.name === 'trimStart'`

```js
let str = '   foo  ';
console.log(str.length); // 8
str = str.trimStart();
console.log(str.length); // 5
```

#### String.prototype.trimEnd() / String.prototype.trimRight()

`String.prototype.trimRight.name === 'trimEnd'`

```js
let str = '   foo  ';
console.log(str.length); // 8
str = str.trimEnd();
console.log(str.length); // 6
```

### 3. Array 扩展

#### Array.prototype.flat()

会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

- 最基本的作用就是数组降维

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity 作为深度，展开任意深度的嵌套数组
arr3.flat(Infinity);
// [1, 2, 3, 4, 5, 6]
```

- 其次，还可以利用 flat()方法的特性来去除数组的空项

```js
var arr4 = [1, 2, , 4, 5];
arr4.flat();
// [1, 2, 4, 5]
```

#### Array.prototype.flatMap()

首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。它与 map 和 深度值 1 的 flat 几乎相同，但 flatMap 通常在合并成一种方法的效率稍微高一些。 这里我们拿 map 方法与 flatMap 方法做一个比较。

```js
var arr1 = [1, 2, 3, 4];

arr1.map((x) => [x * 2]);
// [[2], [4], [6], [8]]

arr1.flatMap((x) => [x * 2]);
// [2, 4, 6, 8]

// 只会将 flatMap 中的函数返回的数组 “压平” 一层
arr1.flatMap((x) => [[x * 2]]);
// [[2], [4], [6], [8]]
```

### 4. Function.P.toString()

返回一个表示当前函数源代码的字符串，包括空格、注释和语法详细信息

```js
function foo() {
  // es10新特性
  console.log('randy');
}
console.log(foo.toString());

// 直接在方法名toString()
console.log(Number.parseInt.toString());
```

### 5. 可选的 Catch Binding

```js
// 在 ES10 之前，我们必须通过语法为 catch 子句绑定异常变量，无论是否有必要。很多时候 catch 块是多余的。 ES10 提案使我们能够简单的把变量省略掉。
try {} catch(e) {}  => try {} catch {}
```

### 6. JSON.stringify() 增强

`JSON.stringify` 在 `ES10` 修复了对于一些超出范围的 `Unicode` 展示错误的问题。因为 `JSON` 都是被编码成 `UTF-8`，所以遇到 `0xD800–0xDFFF` 之内的字符会因为无法编码成 `UTF-8` 进而导致显示错误。在 `ES10` 它会用转义字符的方式来处理这部分字符而非编码的方式，这样就会正常显示了。

```js
// \uD83D\uDE0E  emoji 多字节的一个字符
console.log(JSON.stringify('\uD83D\uDE0E')); // 笑脸

// 如果我们只去其中的一部分  \uD83D 这其实是个无效的字符串
// 之前的版本 ，这些字符将替换为特殊字符，而现在将未配对的代理代码点表示为JSON转义序列
console.log(JSON.stringify('\uD83D')); // "\ud83d"
```

### 7. Symbol.P.description

Symbol 的描述只被存储在内部的 Description ，没有直接对外暴露，我们只有调用 Symbol 的 toString() 时才可以读取这个属性：

```js
const name = Symbol('es');
console.log(name.toString()); // Symbol(es)
console.log(name); // Symbol(es)
console.log(name === 'Symbol(es)'); // false
console.log(name.toString() === 'Symbol(es)'); // true
```

现在可以通过 description 方法获取 Symbol 的描述:

```js
const name = Symbol('es');
console.log(name.description); // es
console.log(name.description === 'es'); // true
```

## ES11(2020)

### 1. BigInt

新基本数据类型，表示任意精度的整数，没有位数上限，任何位数的**整数**都可以精确表示，只要内存足够大。

```js
// 1. 在整数字面量后面加 n
const a = 1234567890123456789012345678901234567890n;

// 2. 使用 BigInt() 函数
const b = BigInt(1234567890123456789012345678901234567890);
```

### 2. 空值合并运算符(??)

```js
let user = {
    u1: 0,
    u2: false,
    u3: null,
    u4: undefined
    u5: '',
}
let u2 = user.u2 ?? '用户2'  // false
let u3 = user.u3 ?? '用户3'  // 用户3
let u4 = user.u4 ?? '用户4'  // 用户4
let u5 = user.u5 ?? '用户5'  // ''
```

### 3. 可选链操作符(?.)

```js
let user = {};
let u1 = user.children.name; // TypeError: Cannot read property 'name' of undefined
let u1 = user.children?.name; // undefined
```

### 4. Promise.allSettled()

Promise.all() 具有并发执行异步任务的能力。但它的最大问题就是如果其中某个任务出现异常 reject，所有任务都会挂掉，Promise 直接进入 reject 状态。

Promise.allSettled()不管是否成功失败，都会返回一个在所有给定的 promise 已被决议或被拒绝后决议的 promise 进入 then 方法，并带有一个对象数组，每个对象表示对应的 promise 结果

```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) =>
  reject('我是失败的Promise_1')
);
const promise4 = new Promise((resolve, reject) =>
  reject('我是失败的Promise_2')
);
const promiseList = [promise1, promise2, promise3, promise4];
Promise.allSettled(promiseList).then((values) => {
  console.log(values);
});
// [
//   {status: "fulfilled", value: 3},
//   {status: "fulfilled", value: 42},
//   {status: "rejected", reason: "我是失败的Promise_1"},
//   {status: "rejected", reason: "我是失败的Promise_2"}
// ]
```

### 5. import()

按需导入，返回一个 Promise 对象

```js
const oBtn = document.querySelector('#btn');
oBtn.addEventListener('click', () => {
  import('./ajax').then((mod) => {
    // console.log(mod)
    mod.default('static/a.json', (res) => {
      console.log(res);
    });
  });
});
```

### 6. globalThis

- 浏览器：window
- worker：self
- node：global

```js
// before
const getGlobal = () => {
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('无法找到全局对象');
};

const globals = getGlobal();
console.log(globals);

// now
console.log(globalThis);
```

### 7. String.P.matchAll()

返回一个包含所有匹配正则表达式及分组捕获结果的迭代器

## ES12(2021)

### 1. String.P.replaceAll()

```js
// 当 pattern 是正则的时候没有区别
const str1 = 'hello word';
console.log(str1.replace(/o/g, '哦')); // hell哦 w哦rd
console.log(str1.replaceAll(/o/g, '哦')); // hell哦 w哦rd

// 当 pattern 是字符串的时候，replaceAll() 会替换所有匹配的字符串，而 replace() 只会替换第一个匹配的字符串
const str1 = 'hello word';
console.log(str1.replace('o', '哦')); // hell哦 word
console.log(str1.replaceAll('o', '哦')); // hell哦 w哦rd
```

### 2. 数字分隔符(1_000_000)

```js
// 让数据更美观易懂，并不会影响该数据的值
const num1 = 1000000000;
const num2 = 1000_000_000;

console.log(num1); // 1000000000
console.log(num2); // 1000000000
```

### 3. Promise.any()

Promise.any()和 Promise.race()类似都是返回第一个结果，但是 Promise.any()只返回第一个成功的，尽管某个 promise 的 reject 早于另一个 promise 的 resolve，仍将返回那个首先 resolve 的 promise。

如果都被 reject 则会抛出 All promises were rejected 错误。

```js
Promise.any([Promise.reject('1'), Promise.resolve('2'), Promise.resolve('3')])
  .then((res) => console.log(res)) // 2
  .catch((err) => console.error(err));

Promise.any([Promise.resolve('1'), Promise.resolve('2'), Promise.resolve('3')])
  .then((res) => console.log(res)) // 1
  .catch((err) => console.error(err));

Promise.any([
  Promise.reject('错误 1'),
  Promise.reject('错误 2'),
  Promise.reject('错误 3'),
])
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
// AggregateError: All promises were rejected
```

### 4. 逻辑操作符和赋值表达

- &&= 逻辑与赋值
- ||= 逻辑或赋值
- ??= 逻辑空赋值

```js
a &&= b; // a && (a = b);
a ||= b; // a || (a = b);
a ??= b; // a ?? (a = b);
```

### 5. WeakRef

WeakRef 允许创建对象的弱引用。弱引用笔者在前面讲 weakSet、weakMap 的时候说过了，就是在进行垃圾回收的时候不会考虑该对象是否还在 WeakRef 中使用。

我们必须用 new 关键字创建新的 WeakRef，然后使用 deref() 读取引用的对象。

```js
let weakRef = new WeakRef({ name: 'randy', age: 27 });

weakRef.deref(); // {name: 'randy', age: 27}
weakRef.deref().age; // 27
```

## ES13(2022)

### 1. Class 扩展

#### 类成员声明

在 ES13 之前，我们只能在构造函数里面声明类的成员，而不能像其他大多数语言一样在类的最外层作用域里面声明成员.

```js
class Car {
  color = 'blue';
  age = 2;
}

const car = new Car();
console.log(car.color); // blue
console.log(car.age); // 2
```

#### 私有属性和私有方法

给类的属性/方法添加一个 hashtag(#)前缀，这个属性/方法就变成私有的了。当我们的属性变为私有后，任何外界对其的访问都会出错。

```js
class Person {
  #firstName = 'randy';
  #lastName = 'su';

  #say() {
    console.log('say hello');
  }

  get name() {
    this.#say();
    return `${this.#firstName} ${this.#lastName}`;
  }
}

const person = new Person();
console.log(person.name); // say hello randy su

// 下面都会报错
// SyntaxError: Private field '#firstName' must be
// declared in an enclosing class
console.log(person.#firstName);
console.log(person.#lastName);
console.log(person.#say);
```

#### 静态私有属性和私有方法

跟私有属性和方法一样，我们只需要给我们的静态属性/方法添加一个 hashtag(#)前缀，这个静态属性/方法就变成私有的了。只能在类内部访问啦。

类的静态方法可以使用 this 关键字访问其他的私有或者公有静态成员，而在类的实例方法中则可以通过 this.constructor 来访问这些静态属性.

```js
class Person {
  static #count = 0;

  static getCount() {
    return this.#count;
  }

  constructor() {
    this.constructor.#incrementCount();
  }

  static #incrementCount() {
    this.#count++;
  }
}

const person1 = new Person();
const person2 = new Person();

console.log(Person.getCount()); // 2

// 下面都会报错
console.log(Person.#count);
console.log(Person.#incrementCount);
```

#### 判断是否有私有变量

通过 in 操作符来判断对象是否具有某私有属性

```js
class Car {
  #color;

  hasColor() {
    return #color in this;
  }
}

const car = new Car();
console.log(car.hasColor()); // true
```

#### 支持定义静态代码块

允许在类中通过 static 关键字定义一系列静态代码块，这些代码块只会在类被创造的时候执行一次。

一个类可以定义任意多的静态代码块，这些代码块会和穿插在它们之间的静态成员变量一起按照定义的顺序在类初始化的时候执行一次。我们还可以使用 super 关键字来访问父类的属性。

```js
class Vehicle {
  static defaultColor = 'blue';
}

class Car extends Vehicle {
  static colors = [];

  static {
    this.colors.push(super.defaultColor, 'red');
  }

  static {
    this.colors.push('green');
  }

  console.log(Car.colors); ['blue', 'red', 'green']
}
```

### 2. Async / Await 扩展

**支持在最外层写 await**，在 ES13 之前，我们的 await 必须写在 async 方法里面，否则会报错。

```js
function setTimeoutAsync(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

await setTimeoutAsync(3000);
```

### 3. at 函数

索引元素，支持数组和字符串

```js
const arr = ['a', 'b', 'c', 'd'];

// 第一个元素
console.log(arr.at(0)); // a
// 倒数第一个元素
console.log(arr.at(-1)); // d
// 倒数第二个元素
console.log(arr.at(-2)); // c

const str = 'randy';

// 第一个元素
console.log(str.at(0)); // r
// 倒数第一个元素
console.log(str.at(-1)); // y
// 倒数第二个元素
console.log(str.at(-2)); // d
```

### 4. 正则支持返回结束索引

可以给正则表达式添加一个 d 的标记来让它在匹配的时候给我们既返回匹配到的子字符串的起始位置还返回其结束位置:

```js
const str = 'sun and moon';
const regex = /and/d;
const matchObj = regex.exec(str);
/**
[
  'and',
  index: 4,
  input: 'sun and moon',
  groups: undefined,
  indices: [ [ 4, 7 ], groups: undefined ] // 新增的属性，匹配到的子字符串的范围
]
 */
console.log(matchObj);
```

### 5. Object.hasOwn()

函数接收两个参数，一个是对象，一个是属性，如果这个对象本身就有这个属性的话，这个函数就会返回 true，否则就返回 false。

```js
const obj = Object.create(null);
obj.color = 'green';
obj.age = 2;

console.log(Object.hasOwn(obj, 'color')); // true
console.log(Object.hasOwn(obj, 'name')); // false
```

**和 hasOwnProperty()的区别**

- hasOwnProperty()是 Object.prototype 的一个方法，所以可以被覆盖，如果覆盖了就达不到我们想要的结果了。
- 如果我们创建了一个原型为 null 的对象(Object.create(null))，也会获取不到该方法而报错

### 6. Error.cause

Error 对象多了一个 cause 属性来指明错误出现的原因。这个属性可以帮助我们为错误添加更多的上下文信息，从而帮助使用者们更好地定位错误。这个属性是我们在创建 error 对象时传进去的第二个参数对象的 cause 属性:

```js
function userAction() {
  try {
    apiCallThatCanThrow();
  } catch (err) {
    throw new Error('New error message', { cause: '请求出错啦' });
  }
}

try {
  userAction();
} catch (err) {
  console.log(err);
  console.log(`Cause by: ${err.cause}`); // Cause by: 请求出错啦
}
```

## ES14(2023)

### 1. Array 扩展

#### 数组支持倒序查找

在 JS 中，我们可以使用数组的`find()`函数来在数组中找到第一个满足某个条件的元素。同样地，我们还可以通过`findIndex()`函数来返回这个元素的位置。可是，无论是`find()`还是`findIndex()`，它们都是从数组的头部开始查找元素的，可是在某些情况下，我们可能有从数组后面开始查找某个元素的需要。

ES13 出来后，我们终于有办法处理这种情况了，那就是使用新的`findLast()`和`findLastIndex()`函数。这两个函数都会从数组的末端开始寻找某个满足条件的元素。

```js
const letters = [
  { value: 'z' },
  { value: 'y' },
  { value: 'x' },
  { value: 'y' },
  { value: 'z' },
];

// 倒序查找
const found = letters.findLast((item) => item.value === 'y');
const foundIndex = letters.findLastIndex((item) => item.value === 'y');

console.log(found); // { value: 'y' }
console.log(foundIndex); // 3
```

#### toSorted

sort 方法的复制版本，区别就是 sort 是修改原数组，而 toSorted 是返回新数组且不会修改原数组。

```js
// sort方法
const arr1 = [1, 3, 5, 2, 8];
const newArr1 = arr1.sort();
console.log('原数组:', arr1); // [1, 2, 3, 5, 8]
console.log('新数组:', newArr1); // [1, 2, 3, 5, 8]

// toSorted方法
const arr2 = [1, 3, 5, 2, 8];
const newArr2 = arr2.toSorted();
console.log('原数组:', arr2); // [1, 3, 5, 2, 8]
console.log('新数组:', newArr2); // [1, 2, 3, 5, 8]
```

#### toReversed

reverse 方法的复制版本，区别就是 reverse 是修改原数组，而 toReversed 是返回新数组且不会修改原数组。

```js
// reverse方法
const arr1 = [1, 3, 5, 2, 8];
const newArr1 = arr1.reverse();
console.log('原数组:', arr1); // [8, 2, 5, 3, 1]
console.log('新数组:', newArr1); // [8, 2, 5, 3, 1]

// toReversed方法
const arr2 = [1, 3, 5, 2, 8];
const newArr2 = arr2.toReversed();
console.log('原数组:', arr2); // [1, 3, 5, 2, 8]
console.log('新数组:', newArr2); // [8, 2, 5, 3, 1]
```

#### toSpliced

toSpliced 与 splice 区别就很大了。splice 是截取原数组的数据，并返回截取出来的数据。toSpliced 是对原数组的副本进行操作，然后返回被截取完后的新数组，并不会修改原数组。

```js
// splice
const arr1 = [1, 3, 5, 2, 8];
const newArr1 = arr1.splice(1, 2);
console.log('原数组:', arr1); // [1, 2, 8]
console.log('新数组:', newArr1); // [3, 5]

// toSpliced
const arr2 = [1, 3, 5, 2, 8];
const newArr2 = arr2.toSpliced(1, 2);
console.log('原数组:', arr2); // [1, 3, 5, 2, 8]
console.log('新数组:', newArr2); // [1, 2, 8]
```

#### with

with 有点类似我们通过[index]来修改数组，区别就是 with 不是修改原数组，而是返回整个新数组。

```js
const arr = [1, 3, 5, 2, 8];

const newArr = arr.with(1, 10);
console.log('原数组:', arr);
console.log('新数组:', newArr);
```

### 2. WeakMap 支持 Symbol 键

```js
const weak = new WeakMap();
const key = Symbol('ref');
weak.set(key, 'randy');

console.log(weak.get(key)); // randy
```
