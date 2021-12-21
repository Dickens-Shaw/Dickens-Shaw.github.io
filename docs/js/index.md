## 数据类型

> JavaScript 共有七种基本数据类型，分别是 Undefined、Null、Boolean、Number、String，还有在 ES6 中新增的 Symbol 和 BigInt 类型

- Symbol 代表创建后独一无二且不可变的数据类型，它的出现我认为主要是为了解决可能出现的全局变量冲突的问题。
- BigInt 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 BigInt 可以安全地存储和操作大整数，即使这个数已经超出了 Number 能够表示的安全整数范围。

这些数据可以分为原始数据类型和引用数据类型：

- 栈：原始数据类型（Undefined、Null、Boolean、Number、String）
- 堆：引用数据类型（对象、数组和函数）

两种类型的区别是：存储位置不同。

- 原始数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。
- 引用数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构中和操作系统内存中：

- 在数据结构中，栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。完全二叉树是堆的一种实现方式。

## 闭包

> `红宝书`：闭包是指有权访问另外一个函数作用域中的变量的函数
>
> `MDN`： 闭包是指那些能够访问自由变量的函数

自由变量：在函数中使用的，但既不是函数参数 arguments 也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量

函数 A 内部有一个函数 B，函数 B 可以访问到函数 A 中的变量，那么函数 B 就是闭包

所有的函数都是闭包，因为有全局环境，所有的函数都可以访问全局变量

意义：让我们可以间接访问函数内部的变量

特性：

1. 闭包可以访问当前函数以外的变量
2. 即使外部函数已经返回，闭包仍能访问外部函数定义的变量
3. 闭包可以更新外部变量的值

## 作用域、作用域链

`作用域`：指的是一个变量和函数的作用范围，JS 中函数内声明的所有变量在函数体内始终是可见的，在 ES6 前有全局作用域和局部作用域，但是没有块级作用域（catch 只在其内部生效），局部变量的优先级高于全局变量

`作用域链`：当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链

## 原型、原型链

`原型`：当构造函数被创建时，会在内存空间新建一个对象，构造函数内有一个属性 prototype 会指向这个对象的存储空间，这个对象称为构造函数的原型对象

除了 Function.prototype.bind()之外每个函数都有 prototype 属性就是原型，原型的 constructor 属性指向构造函数，构造函数又通过 prototype 属性指回原型

`原型链`：每个对象拥有一个原型对象，通过 **proto** 指针指向上一个原型 ，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向 null，这种关系被称为原型链 (prototype chain)

1. Object 是所有对象的爸爸，所有对象都可以通过 **proto** 找到它
2. Function 是所有函数的爸爸，所有函数都可以通过 **proto** 找到它
3. Function.prototype 和 Object.prototype 是两个特殊的对象，他们由引擎来创建
4. 除了以上两个特殊对象，其他对象都是通过构造器 new 出来的

![blockchain](../_media/js/prototype.png)

## 变量提升

在生成执行环境时，会有两个阶段。第一个阶段是创建的阶段，JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

在提升的过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升

## 防抖

即短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在 xx 毫秒后再触发事件处理，每次触发事件都会重新设置计时器，直到 xx 毫秒内无第二次操作。
常用于搜索框/滚动条的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

手撕：
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

手撕：
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

1. 默认绑定：全局环境中，this 默认绑定到 window。
2. 隐式绑定：一般地，被直接对象所包含的函数调用时，也称为方法调用，this 隐式绑定到该直接对象。
   隐式丢失：隐式丢失是指被隐式绑定的函数丢失绑定对象，从而默认绑定到 window。
3. 显式绑定：通过 call()、apply()、bind()方法把对象绑定到 this 上，叫做显式绑定。
4. new 绑定：如果函数或者方法调用之前带有关键字 new，它就构成构造函数调用。对于 this 绑定来说，称为 new 绑定。

> new > 显示 > 隐示

## 改变this指向
### call

> `call()` 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。
  
应用：
  1. 对象的继承
  2. 借用方法：类数组使用Array原型链上的方法

实现分析：
  1. 首先 context 为可选参数，如果不传的话默认上下文为 window
  2. 接下来给 context 创建一个 fn 属性，并将值设置为需要调用的函数
  3. 因为 call 可以传入多个参数作为调用函数的参数，所以需要将参数剥离出来
  4. 然后调用函数并将对象上的函数删除

手撕：
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
  
> `apply()` 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。

应用：
  1. `Math.max`。用它来获取数组中最大的一项
  2. 实现两个数组合并。在 ES6 的扩展运算符出现之前，我们可以用`Array.prototype.push`来实现。

手撕：
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
    
> `bind()` 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
    
实现分析：
  1. 前几步和之前的实现差不多，就不赘述了
  2. bind 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
  3. 对于直接调用来说，这里选择了 apply 的方式实现，但是对于参数需要注意以下情况：因为 bind 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`
  4. 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 this，对于 `new` 的情况来说，不会被任何方式改变 this，所以对于这种情况我们需要忽略传入的 this

手撕：
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
