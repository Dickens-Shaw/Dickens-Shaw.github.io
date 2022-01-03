## 数据类型

> JavaScript 共有七种基本数据类型，分别是 `Undefined、Null、Boolean、Number、String`，还有在 ES6 中新增的 `Symbol` 和 `BigInt` 类型

- `Symbol` 代表创建后独一无二且不可变的数据类型，它的出现我认为主要是为了解决可能出现的全局变量冲突的问题。
- `BigInt` 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 `BigInt` 可以安全地存储和操作大整数，即使这个数已经超出了 `Number` 能够表示的安全整数范围。

这些数据可以分为原始数据类型和引用数据类型：

- 栈：原始数据类型（`Undefined、Null、Boolean、Number、String`）
- 堆：引用数据类型（对象、数组和函数）

两种类型的区别是：存储位置不同。

- 原始数据类型直接存储在栈（`stack`）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。
- 引用数据类型存储在堆（`heap`）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构中和操作系统内存中：

- 在数据结构中，栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。`完全二叉树`是堆的一种实现方式。

## 闭包

> `红宝书`：闭包是指有权访问另外一个函数作用域中的变量的函数
>
> `MDN`： 闭包是指那些能够访问自由变量的函数

自由变量：在函数中使用的，但既不是函数参数 `arguments` 也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量

函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包

所有的函数都是闭包，因为有全局环境，所有的函数都可以访问全局变量

- 意义：让我们可以间接访问函数内部的变量

- 特性：

  1. 闭包可以访问当前函数以外的变量
  2. 即使外部函数已经返回，闭包仍能访问外部函数定义的变量
  3. 闭包可以更新外部变量的值

## 作用域、作用域链

`作用域`：指的是一个变量和函数的作用范围，JS 中函数内声明的所有变量在函数体内始终是可见的，在 ES6 前有全局作用域和局部作用域，但是没有块级作用域（`catch` 只在其内部生效），局部变量的优先级高于全局变量

`作用域链`：当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链

## 原型、原型链

`原型`：当构造函数被创建时，会在内存空间新建一个对象，构造函数内有一个属性 `prototype` 会指向这个对象的存储空间，这个对象称为构造函数的原型对象

除了 `Function.prototype.bind()` 之外每个函数都有 `prototype` 属性就是原型，原型的 `constructor` 属性指向构造函数，构造函数又通过 `prototype` 属性指回原型

`原型链`：每个对象拥有一个原型对象，通过 `__proto__` 指针指向上一个原型 ，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向 null，这种关系被称为原型链 (prototype chain)

1. `Object` 是所有对象的爸爸，所有对象都可以通过 `__proto__` 找到它
2. `Function` 是所有函数的爸爸，所有函数都可以通过 `__proto__` 找到它
3. `Function.prototype` 和 `Object.prototype` 是两个特殊的对象，他们由引擎来创建
4. 除了以上两个特殊对象，其他对象都是通过构造器 `new` 出来的

![blockchain](../_media/js/prototype.png)

## 变量提升

在生成执行环境时，会有两个阶段。第一个阶段是创建的阶段，JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 `undefined`，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

## 防抖

即短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在 xx 毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到 xx 毫秒内无第二次操作。
常用于搜索框/滚动条的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

- 手撕：

```js
function debounce(func, wait) {
  let timeout = null
  return function () {
    let context = this
    let args = arguments
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
```

## 节流

防抖是延迟执行，而节流是间隔执行，函数节流即每隔一段时间就执行一次，实现原理为设置一个定时器，约定 xx 毫秒后执行事件，如果时间到了，那么执行函数并重置定时器，和防抖的区别在于，防抖每次触发事件都重置定时器，而节流在定时器到时间后再清空定时器

- 手撕：

```js
function throttle(func, wait) {
  let timeout = null
  return function () {
    let context = this
    let args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
```

## this

> 绑定优先级 new > 显示 > 隐示

1. 默认绑定：全局环境中，`this` 默认绑定到 `window`。
2. 隐式绑定：一般地，被直接对象所包含的函数调用时，也称为方法调用，`this` 隐式绑定到该直接对象。
   隐式丢失：隐式丢失是指被隐式绑定的函数丢失绑定对象，从而默认绑定到 `window`。
3. 显式绑定：通过 `call()、apply()、bind()` 方法把对象绑定到 `this` 上，叫做显式绑定。
4. new 绑定：如果函数或者方法调用之前带有关键字 `new`，它就构成构造函数调用。对于 `this` 绑定来说，称为 `new` 绑定。

### call

> `call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

- 应用：

  1. 对象的继承
  2. 借用方法：类数组使用`Array`原型链上的方法

- 实现分析：

  1. 首先 `context` 为可选参数，如果不传的话默认上下文为 `window`
  2. 接下来给 `context` 创建一个 `fn` 属性，并将值设置为需要调用的函数
  3. 因为 `call` 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
  4. 然后调用函数并将对象上的函数删除

- 手撕：

```js
Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}
```

### apply

> `apply()` 方法调用一个具有给定 this 值的函数，以及作为一个数组（或类似数组对象）提供的参数。

- 应用：

  1. `Math.max`。用它来获取数组中最大的一项
  2. 实现两个数组合并。在 ES6 的扩展运算符出现之前，我们可以用`Array.prototype.push`来实现。

- 手撕：

```js
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

### bind

> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

- 实现分析：

1. 前几步和之前的实现差不多，就不赘述了
2. bind 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
3. 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`
4. 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this`

- 手撕：

```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const self = this
  const args = [...arguments].slice(1)
  return function F() {
    if (this instanceof F) {
      return new self(...args, ...arguments)
    }
    return self.apply(context, args.concat(...arguments))
  }
}
```

## new

- 实现分析：

  1. 创建一个空对象
  2. 获取构造函数
  3. 设置空对象的原型
  4. 绑定 `this` 并执行构造函数
  5. 确保返回值为对象

- 手撕：

```js
function myNew() {
  const obj = {}
  const constructor = [].shift.call(arguments)
  obj.__proto__ = constructor.prototype
  const result = constructor.apply(obj, arguments)
  return result instanceof Object ? result : obj
}
```

## 计算精度

> 为什么 `0.1 + 0.2 != 0.3 ？`
>
> 因为 JS 采用 `IEEE 754 双精度版本（64位）`，并且只要采用 `IEEE 754` 的语言都有该问题

0.1 在二进制中会表示为 `0.1 = 2^-4 * 1.10011(0011)`

很多十进制小数用二进制表示都是无限循环的，JS 采用的浮点数标准却会裁剪掉循环的数字，就会出现精度丢失的问题：

```js
0.100000000000000002 === 0.1 // true
0.200000000000000002 === 0.2 // true
0.1 + 0.2 === 0.30000000000000004 // true
```

console.log(0.1) 却是正确的？

因为在输入内容的时候，二进制被转换为了十进制，十进制又被转换为了字符串，在这个转换的过程中发生了取近似值的过程，所以打印出来的其实是一个近似值。

```js
console.log(0.100000000000000002) // 0.1
```

解决办法：

```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3 // true
```

## 浅拷贝

> 创建一个新对象，这个对象有着原始对象属性值的一份`精确拷贝`。
>
> 如果属性是`基本类型`，拷贝的就是基本类型的`值`，如果属性是`引用类型`，拷贝的就是`内存地址` ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
>
> 浅拷贝只解决了`第一层`的问题，拷贝第一层的基本类型值，以及第一层的引用类型地址

- `Object.assign()`
  只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，所以并不是深拷贝

- 拓展运算符 `...`

## 深拷贝

> 深拷贝会拷贝`所有的属性`，并拷贝属性指向的`动态分配的内存`。
>
> 当对象和它所引用的对象一起拷贝时即发生深拷贝。
>
> 深拷贝相比于浅拷贝速度较慢并且`花销较大`。拷贝前后两个对象`互不影响`

- `JSON.parse(JSON.stringify(object))`

局限性：

只能拷贝`基本类型`和`引用类型`，不能拷贝`函数`，`对象`，`数组`，`正则`，`日期`，`Map`，`Set`，`WeakMap`，`WeakSet`，会忽略 `undefined`，`symbol`

- `MessageChannel`

```js
function structuralClone(obj) {
  return new Promise((resolve) => {
    const { port1, port2 } = new MessageChannel()
    port2.onmessage = (ev) => resolve(ev.data)
    port1.postMessage(obj)
  })
}
```

- 手撕

```js
// 简单实现
function deepClone(obj) {
  function isObject(o) {
    return (typeof o === 'object' || typeof o === 'function') && o !== null
  }
  if (!isObject(obj)) {
    throw new Error('非对象')
  }
  let isArray = Array.isArray(obj)
  let newObj = isArray ? [...obj] : { ...obj }
  Reflect.ownKeys(newObj).forEach((key) => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })
  return newObj
}
```

## 内存泄漏

- 意外的`全局变量`： 由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。

- 被遗忘的`计时器`或`回调函数`： 设置了 `setInterval` 定时器，而忘记取消它，如果循环函数有对`外部变量`的引用的话，那么这个变量会被一直留在内存中，而无法被回收。

- 脱离 DOM 的引用： 获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。

- `闭包`： 不合理的使用闭包，从而导致某些变量一直被留在内存当中。

## 垃圾回收机制
V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。因此，V8 将内存（堆）分为新生代和老生代两部分

- 新生代：

新生代中的对象一般存活时间较短，使用 Scavenge GC 算法。

将内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象并复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了

- 老生代

老生代中的对象一般存活时间较长且数量也多，使用两个算法：
1. 标记清除：先所有都加上标记，再把环境中引用到的变量去除标记。剩下的就是没用的了
2. 引用计数：跟踪记录每个值被引用的次数。清除引用次数为0的变量。(会有循环引用问题:循环引用如果大量存在就会导致内存泄露。)

出现在老生代的情况：
1. 新生代中的对象是否已经经历过一次 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。
2. To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。

## 私有变量

- 配置属性

```js
const obj = {
  name: '张三',
  getName() {
    return this.name
  },
}
object.defineProperty(obj, 'name', {
  configurable: false,
  enumerable: false,
})
```

- 闭包实现

```js
function Person(name) {
  var _name = name
  this.getName = function () {
    return this.name
  }
}
var p = new Person('张三')
console.log(p._name) // undefined
console.log(p.getName()) // '张三'
```

## 类型判断

### typeof

对于基本类型，除了 null 都可以显示正确的类型

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined
```

对于对象，除了函数都会显示 object

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

对于 null 来说，虽然它是基本类型，但是会显示 object，这是一个存在很久了的 Bug

```js
typeof null // 'object'
```

### instanceof

> 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype

- 实现分析

  1. 首先获取类型的原型
  2. 然后获得对象的原型
  3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null

- 手撕

```js
function instanceOf(left, right) {
  let proto = right.prototype // 获取类型的原型
  left = left.__proto__ // 获取对象的原型
  // 判断对象的类型是否等于类型的原型
  while (true) {
    if (left === null || left === undefined) return false
    if (left === proto) return true
    left = left.__proto__
  }
}
```

## 请求方法

- ajax

```js
const ajax = (url,method,async,data){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest()

    xhr.onreadystatechange = ()=>{
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          resolve(xhr.responseText)
        }else{
          reject(xhr.status)
        }
      }
    }
    xhr.open(method,url,async)
    xhr.send(data || null)
  })
}
```

- axios

1. 从浏览器中创建 `XMLHttpRequest`
2. 从 `node.js` 发出 `http` 请求
3. 支持 `Promise API`
4. 拦截请求和响应
5. 转换请求和响应数据
6. 取消请求
7. 自动转换 JSON 数据
8. 客户端支持防止 `CSRF/XSRF`
9. 提供了并发的封装 `axios.all()`，只需将一个请求数组传递给这个方法，然后使用`axios.spread()`将响应数组的属性分配给多个变量

- fetch

  - 优势：
    - 语法简洁，更加语义化
    - 基于标准 `Promise` 实现，支持 `async/await`
    - 同构方便，使用 `isomorphic-fetch`
    - 更加底层，提供的 API 丰富（`request, response`）
    - 脱离了`XHR`，是 ES 规范里新的实现方式
  - 缺陷：
    - fetch 只对网络请求报错，对 400，500 都当做成功的请求，服务器返回 400，500 错误码时并不会 `reject`，只有网络错误这些导致请求不能完成时，fetch 才会被 `reject`。
    - fetch 默认不会带`cookie`，需要添加配置项： `fetch(url, {credentials: 'include'})`
    - fetch 不支持`abort`，不支持超时控制，使用`setTimeout`及`Promise.reject`的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
    - fetch 没有办法原生监测请求的进度，而`XHR`可以

## 高阶函数

> 高阶函数英文叫 `Higher-order function`，它的定义很简单，就是至少满足下列一个条件的函数：
>
> - 接受一个或多个函数作为输入
> - 输出一个函数

也就是说高阶函数是对其他函数进行操作的函数，可以将它们作为参数传递，或者是返回它们。

简单来说，高阶函数是一个`接收函数作为参数`传递或者`将函数作为返回值`输出的函数

- 函数作为参数传递

  JavaScript 语言中内置了一些高阶函数，比如

  - `Array.prototype.map`：创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果，原始数组不会改变
  - `Array.prototype.filter`：创建一个新数组, 其包含通过提供函数实现的测试的所有元素，原始数组不会改变
  - `Array.prototype.reduce`：对数组中的每个元素执行一个提供的 `reducer` 函数(升序执行)，将其结果汇总为单个返回值

  它们接受一个函数作为参数，并应用这个函数到列表的每一个元素。

- 函数作为返回值输出

  - Add 无限累加函数

```js
function add(a) {
  function sum(b) { // 使用闭包
    a = a + b; // 累加
    return sum;
  }
  sum.toString = function() { // 重写toString()方法
    return a;
  }
  return sum; // 返回一个函数
}
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3)； // 6
add(1)(2)(3)(4)； // 10
```

## 继承

- 构造函数继承

使用父类的构造函数来增强子类实例，即复制父类的实例属性给子类，构造继承可以向父类传递参数，可以实现多继承，通过 call 多个父类对象。但是构造继承只能继承父类的实例属性和方法，不能继承原型属性和方法，无法实现函数服用，每个子类都有父类实例函数的副本，影响性能。

```js
function Parent() {
  this.name = 'parent'
}
function Child() {
  Parent.call(this)
  this.type = 'child'
}
```

- 原型继承

将父类的实例作为子类的原型，他的特点是实例是子类的实例也是父类的实例，父类新增的原型方法/属性，子类都能够访问，并且原型链继承简单易于实现，缺点是来自原型对象的所有属性被所有实例共享，无法实现多继承，无法向父类构造函数传参

```js
function Parent() {
  this.name = 'parent'
}
function Child() {
  this.type = 'child'
}
Child.prototype = new Parent()
```

- 组合继承

所谓组合继承，就是在上面原型链继承方式下，在子构造函数内，手动调用父构造函数，并传入子类 this

通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用

```js
function Parent(name) {
  this.name = [name]
}
Parent.prototype.getName = function () {
  return this.name
}
function Child() {
  Parent.call(this, 'xxx') // 构造函数继承
}
//原型链继承
Child.prototype = new Parent()
Child.prototype.constructor = Child
```

- 寄生组合继承

通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点

```js
function Parent(name) {
  this.name = [name]
}
Parent.prototype.getName = function () {
  return this.name
}
function Child() {
  // 构造函数继承
  Parent.call(this, 'xxx')
}
//原型链继承
// Child.prototype = new Parent()
Child.prototype = Parent.prototype //将`指向父类实例`改为`指向父类原型`
Child.prototype.constructor = Child
```

- 单继承？

让 ChildType.prototype.**proto**指向 ParentType.prototype

## 数组展开

- 递归

```js
function flatten(arr) {
  let result = []
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item))
    } else {
      result.push(item)
    }
  })
  return result
}
```

- reduce

```js
function flatten(arr) {
  // 本质和 flat1 一样的，都是递归
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}
```

- rest

```js
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    // 相当于 [].concat('1', 2, [3, 4])
    // concat 方法本身就会把参数中的数组展开
    arr = [].concat(...arr)
  }
}
```

- ES6

```js
function flatten(arr) {
  // flat() 方法会移除数组中的空项
  return arr.flat(Infinity)
}
```
