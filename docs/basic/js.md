# JS

## 一、数据类型

### 1. 基本类型

> JavaScript 共有八种基本数据类型，分别是 `Undefined、Null、Boolean、Number、String、Object`，还有在 ES6 中新增的 `Symbol` 和 `BigInt` 类型

- `Symbol` 代表创建后独一无二且不可变的数据类型，它的出现我认为主要是为了解决可能出现的全局变量冲突的问题。
- `BigInt` 是一种数字类型的数据，它可以表示任意精度格式的整数，使用 `BigInt` 可以安全地存储和操作大整数，即使这个数已经超出了 `Number` 能够表示的安全整数范围。

这些数据可以分为原始数据类型和引用数据类型：

- 栈：原始数据类型（`Undefined、Null、Boolean、Number、String`）
- 堆：引用数据类型（`Object`对象、数组和函数）

两种类型的区别是：**存储位置不同**。

- 原始数据类型直接存储在栈（`stack`）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。
- 引用数据类型存储在堆（`heap`）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

堆和栈的概念存在于数据结构中和操作系统内存中，在数据结构中：

- 栈中数据的存取方式为先进后出。
- 堆是一个优先队列，是按优先级来进行排序的，优先级可以按照大小来规定。`完全二叉树`是堆的一种实现方式。

在操作系统中，内存被分为栈区和堆区：

- 栈区：由编译器自动分配释放，存放函数的参数值、局部变量的值等。其操作方式类似于数据结构中的栈。
- 堆区：一般由程序员分配释放，若程序员不释放，程序结束时可能由垃圾回收机制回收。注意它与数据结构中的堆是两回事，分配方式倒是类似于链表。

### 2. 类型判断

#### typeof

对于基本类型，除了 null 都可以显示正确的类型

```js
typeof 1; // 'number'
typeof '1'; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof b; // b 没有声明，但是还会显示 undefined
```

对于对象，除了函数都会显示 object

```js
typeof []; // 'object'
typeof {}; // 'object'
typeof console.log; // 'function'
```

对于 null 来说，虽然它是基本类型，但是会显示 object，这是一个存在很久了的 Bug

```js
// 在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象
// 然而 null 表示为全零，所以将它错误的判断为 object

typeof null; // 'object'
```

#### instanceof

> 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 prototype

```js
console.log(2 instanceof Number); // false
console.log(true instanceof Boolean); // false
console.log('str' instanceof String); // false

console.log([] instanceof Array); // true
console.log(function () {} instanceof Function); // true
console.log({} instanceof Object); // true
// console.log(undefined instanceof Undefined);
// console.log(null instanceof Null);
```

可以看出直接的字面量值判断数据类型， `instanceof` 可以精准判断引用数据类型（Array，Function，Object），而基本数据类型不能被`instanceof`精准判断。

#### constructor

```js
console.log((2).constructor === Number); // true
console.log(true.constructor === Boolean); // true
console.log('str'.constructor === String); // true
console.log([].constructor === Array); // true
console.log(function () {}.constructor === Function); // true
console.log({}.constructor === Object); // true
```

`constructor`有两个作用，一是判断数据的类型，二是对象实例通过 `constructor` 对象访问它的构造函数。需要注意，如果创建一个对象更改它的原型，那么它的 `constructor` 就会变得不可靠了，就不能用来判断数据类型

```js
function Fn() {}

Fn.prototype = new Array();

var f = new Fn();

console.log(f.constructor === Fn); // false
console.log(f.constructor === Array); // true
```

#### Object.prototype.toString.call

> 使用 Object 对象的原型方法 toString ，使用 call 进行狸猫换太子，借用 Object 的 toString 方法

```js
var a = Object.prototype.toString;

console.log(a.call(2)); // [object Number]
console.log(a.call(true)); // [object Boolean]
console.log(a.call('str')); // [object String]
console.log(a.call([])); // [object Array]
console.log(a.call(function () {})); // [object Function]
console.log(a.call({})); // [object Object]
console.log(a.call(undefined)); // [object Undefined]
console.log(a.call(null)); // [object Null]
```

同样是检测对象 obj 调用 toString 方法，obj.toString()的结果和 Object.prototype.toString.call(obj)的结果不一样，这是为什么？

这是因为 toString 是 Object 的原型方法，而**Array、function 等类型作为 Object 的实例，都重写了 toString 方法**。不同的对象类型调用 toString 方法时，根据原型链的知识，调用的是对应的重写之后的 toString 方法（function 类型返回内容为函数体的字符串，Array 类型返回元素组成的字符串…），而不会去调用 Object 上原型 toString 方法（返回对象的具体类型），所以采用 obj.toString()不能得到其对象类型，只能将 obj 转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用 Object 原型上的 toString 方法。

### 3. 判断数组

- 通过`Object.prototype.toString.call()`判断

```js
Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
```

- 通过原型链判断

```js
obj.__proto__ === Array.prototype;
```

- 通过 ES6 的`Array.isArray()`判断

```js
Array.isArray(obj);
```

- 通过`instanceof`判断

```js
obj instanceof Array;
```

- 通过`Array.prototype.isPrototypeOf()`判断

```js
Array.prototype.isPrototypeOf(obj);
```

### 4. instanceof 实现

在 MDN 中的解释：`instanceof`  运算符用来测试一个对象在其原型链中是否存在一个构造函数的  prototype  属性。其意思就是判断对象是否是某一数据类型（如 Array）的实例，请重点关注一下是判断一个对象是否是数据类型的实例。在这里字面量值，2， true ，'str'不是实例，所以判断值为 false。

**实现分析：**

1. 首先获取类型的原型
2. 然后获得对象的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 null，因为原型链最终为 null

```js
function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的 prototype 对象
  let prototype = right.prototype;

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    // 如果没有找到，就继续从其原型上找，Object.getPrototypeOf方法用来获取指定对象的原型
    proto = Object.getPrototypeOf(proto);
  }
}
```

### 5. 计算精度

> 为什么 `0.1 + 0.2 != 0.3 ？`
>
> 因为 JS 采用 `IEEE 754 双精度版本（64位）`，并且只要采用 `IEEE 754` 的语言都有该问题

0.1 在二进制中会表示为 `0.1 = 2^-4 * 1.10011(0011)`

很多十进制小数用二进制表示都是无限循环的，JS 采用的浮点数标准却会裁剪掉循环的数字，就会出现精度丢失的问题：

```js
0.100000000000000002 === 0.1; // true
0.200000000000000002 === 0.2; // true
0.1 + 0.2 === 0.30000000000000004; // true
```

console.log(0.1) 却是正确的？

因为在输入内容的时候，二进制被转换为了十进制，十进制又被转换为了字符串，在这个转换的过程中发生了取近似值的过程，所以打印出来的其实是一个近似值。

```js
console.log(0.100000000000000002); // 0.1
```

**解决办法：**

```js
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3; // true
```

**设置误差范围**

通常称为“`机器精度`”。对 JavaScript 来说，这个值通常为 2-52，在 ES6 中，提供了`Number.EPSILON`属性，而它的值就是`2-52`，只要判断`0.1+0.2-0.3`是否小于`Number.EPSILON`，如果小于，就可以判断为`0.1+0.2 ===0.3`

```js
function numberEpsilon(arg1, arg2) {
  return Math.abs(arg1 - arg2) < Number.EPSILON;
}

console.log(numberEpsilon(0.1 + 0.2, 0.3)); // true
```

### 6. BigInt

在 JS 中，所有的数字都以双精度 64 位浮点格式表示，只能安全地表示`-9007199254740991(-(2^53-1))`和`9007199254740991（(2^53-1)）`

```js
console.log(999999999999999); // 10000000000000000
9007199254740992 === 9007199254740993; // true
```

- 创建

```js
// 数字末尾加n
console.log(9007199254740995n); // → 9007199254740995n
console.log(9007199254740995); // → 9007199254740996

// 构造函数
BigInt('9007199254740995'); // → 9007199254740995n
```

- 警惕
  1. BigInt 不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js 代码。
  2. 因为隐式类型转换可能丢失信息，所以不允许在 bigint 和 Number 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由 BigInt 或 Number 精确表示。

```js
10 + 10n; // → TypeError
```

3. 不能将 BigInt 传递给 Web api 和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报 TypeError 错误。

```js
Math.max(2n, 4n, 6n); // → TypeError
```

4. 当 Boolean 类型与 BigInt 类型相遇时，BigInt 的处理方式与 Number 类似，换句话说，只要不是 0n，BigInt 就被视为 truthy 的值。

```js
if (0n) {
  //条件判断为false
}
if (3n) {
  //条件为true
}
```

5. 元素都为 BigInt 的数组可以进行 sort。
6. BigInt 可以正常地进行位运算，如|、&、<<、>>和^

### 7. 数组和函数的存储

1. 数组，JS 里的数组主要就是 以连续内存形式存储的`FixedArray`、以哈希表形式存储的`HashTable`。
2. 函数，函数属于引用数据类型，存储在堆中，在栈内存中只是存了一个地址来表示对堆内存中的引用。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

## 二、JS 基础

### 1. new 操作符

> `new`关键字就是绑定了实例与原型的关系，并且在实例的的上下文中调用构造函数

**实现分析：**

1. 创建一个空对象
2. 获取构造函数
3. 设置空对象的原型
4. 绑定 `this` 并执行构造函数
5. 确保返回值为对象

```js
function myNew() {
  const obj = {};
  //取得该方法的第一个参数(并删除第一个参数)，该参数是构造函数
  const constructor = [].shift.call(arguments);
  //将新对象的内部属性__proto__指向构造函数的原型，这样新对象就可以访问原型中的属性和方法
  obj.__proto__ = constructor.prototype;
  //取得构造函数的返回值
  const result = constructor.apply(obj, arguments);
  //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
  return result instanceof Object ? result : obj;
}
```

### 2. 内置对象

> js 中的内置对象主要指的是在程序执行前存在全局作用域里的由 js 定义的一些全局值属性、函数和用来实例化其他对象的构造函 数对象。

**全局的对象（ global objects ）**或称标准内置对象，不要和 **全局对象（global object）** 混淆。

这里说的全局的对象是说在全局作用域里的对象。全局作用域中的其他对象可以由用户的脚本创建或由宿主程序提供。

标准内置对象的分类:

- 1）**值属性**，这些全局属性返回一个简单值，这些值没有自己的属性和方法。

  例如：`Infinity、NaN、undefined、null` 字面量

- 2）**函数属性**，全局函数可以直接调用，不需要在调用时指定所属对象，执行结束后会将结果直接返回给调用者。

  例如：`eval()、parseFloat()、parseInt()` 等

- 3）**基本对象**，基本对象是定义或使用其他对象的基础。基本对象包括一般对象、函数对象和错误对象。

  例如：`Object、Function、Boolean、Symbol、Error` 等

- 4）**数字和日期对象**，用来表示数字、日期和执行数学计算的对象。

  例如：`Number、Math、Date`

- 5）**字符串**，用来表示和操作字符串的对象。

  例如：`String、RegExp`

- 6）**可索引的集合对象**，这些对象表示按照索引值来排序的数据集合，包括数组和类型数组，以及类数组结构的对象。

  例如：`Array`

- 7）**使用键的集合对象**，这些集合对象在存储数据时会使用到键，支持按照插入顺序来迭代元素。

  例如：`Map、Set、WeakMap、WeakSet`

- 8）**矢量集合**，`SIMD` 矢量集合中的数据会被组织为一个数据序列。

  例如：`SIMD` 等

- 9）**结构化数据**，这些对象用来表示和操作结构化的缓冲区数据，或使用 JSON 编码的数据。

  例如：`JSON` 等

- 10）**控制抽象对象**

  例如：`Promise、Generator` 等

- 11）**反射**

  例如：`Reflect、Proxy`

- 12）**国际化**，为了支持多语言处理而加入 ECMAScript 的对象。

  例如：`Intl、Intl.Collator` 等

- 13）**WebAssembly**

- 14）**其他**

  例如：`arguments`

### 3. 常用正则

```js
// （1）匹配 16 进制颜色值
var regex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g;

// （2）匹配日期，如 yyyy-mm-dd 格式
var regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

// （3）匹配 qq 号
var regex = /^[1-9][0-9]{4,10}$/g;

// （4）手机号码正则
var regex = /^1[34578]\d{9}$/g;

// （5）用户名正则
var regex = /^[a-zA-Z\$][a-zA-Z0-9_\$]{4,16}$/;
```

### 4. 类数组

一个拥有 length 属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。常见的类数组对象有 arguments 和 DOM 方法的返回结果，还有一个函数也可以被看作是类数组对象，因为它含有 length 属性值，代表可接收的参数个数。

常见的类数组转换为数组的方法有这样几种：

1. 通过 call 调用数组的 slice 方法

```js
Array.prototype.slice.call(arrayLike);
```

2. 通过 call 调用数组的 splice 方法

```js
Array.prototype.splice.call(arrayLike, 0);
```

3. 通过 apply 调用数组的 concat 方法

```js
Array.prototype.concat.apply([], arrayLike);
```

4. 通过 Array.from 方法

```js
Array.from(arrayLike);
```

5. 通过展开运算符

```js
[...arrayLike];
```

### 5. 数组展开

#### 递归

```js
function flatten(arr) {
  let result = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  });
  return result;
}
```

#### reduce

```js
function flatten(arr) {
  // 本质和 flat1 一样的，都是递归
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, []);
}
```

#### rest

```js
function flatten(arr) {
  while (arr.some((item) => Array.isArray(item))) {
    // 相当于 [].concat('1', 2, [3, 4])
    // concat 方法本身就会把参数中的数组展开
    arr = [].concat(...arr);
  }
}
```

#### ES6

```js
function flatten(arr) {
  // flat() 方法会移除数组中的空项
  return arr.flat(Infinity);
}
```

### 6. 数组遍历

| 方法                      | 是否改变原数组 | 特点                                                                                                                             |
| ------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| forEach()                 | 否             | 数组方法，不改变原数组，没有返回值                                                                                               |
| map()                     | 否             | 数组方法，不改变原数组，有返回值，可链式调用                                                                                     |
| filter()                  | 否             | 数组方法，过滤数组，返回包含符合条件的元素的数组，可链式调用                                                                     |
| for...of                  | 否             | for...of 遍历具有 Iterator 迭代器的对象的属性，返回的是数组的元素、对象的属性值，不能遍历普通的 obj 对象，将异步循环变成同步循环 |
| every() 和 some()         | 否             | 数组方法，some()只要有一个是 true，便返回 true；而 every()只要有一个是 false，便返回 false.                                      |
| find() 和 findIndex()     | 否             | 数组方法，find()返回的是第一个符合条件的值；findIndex()返回的是第一个返回条件的值的索引值                                        |
| reduce() 和 reduceRight() | 否             | 数组方法，reduce()对数组正序操作；reduceRight()对数组逆序操作                                                                    |

### 7. for in 和 for of

简单来说就是它们两者都可以用于遍历，不过 for in 遍历的是数组的索引（index），而 for of 遍历的是数组元素值（value）

```js
// for in
var obj = { a: 1, b: 2, c: 3 };

for (let key in obj) {
  console.log(key);
}
// a b c

//for of
const array1 = ['a', 'b', 'c'];

for (const val of array1) {
  console.log(val);
}
// a b c
```

#### for in

- `for in`更适合遍历对象，当然也可以遍历数组，但是会存在一些问题
  比如：
  - index 索引为字符串型数字，不能直接进行几何运算
  - 遍历顺序有可能不是按照实际数组的内部顺序
- `for in`遍历的是数组的索引（即键名）
- `for in`总是得到对象的 key 或数组、字符串的下标
- 使用`for in`会遍历数组所有的可枚举属性，包括原型，如果不想遍历原型方法和属性的话，可以在循环内部判断一下，使用`hasOwnProperty()`方法可以判断某属性是不是该对象的实例属性

```js
var arr = [1, 2, 3];
Array.prototype.a = 123;

for (let index in arr) {
  let res = arr[index];
  console.log(res);
}
//1 2 3 123

for (let index in arr) {
  if (arr.hasOwnProperty(index)) {
    let res = arr[index];
    console.log(res);
  }
}
// 1 2 3
```

#### for of

- `for of`遍历的是数组元素值，而且`for of`遍历的只是数组内的元素，不包括原型属性和索引
- `for of`总是得到对象的 value 或数组、字符串的值
- `for of`适用遍历数/数组对象/字符串/`map`/`set`等拥有迭代器对象（`iterator`）的集合，但是不能遍历对象，因为没有迭代器对象，但如果想遍历对象的属性，你可以用`for in`循环（这也是它的本职工作）或用内建的`Object.keys()`方法

```js
var myObject = {
  a: 1,
  b: 2,
  c: 3,
};
for (var key of Object.keys(myObject)) {
  console.log(key + ': ' + myObject[key]);
}
//a:1 b:2 c:3
```

### 8. 变量提升

造成变量声明提升的**本质原因**是 js 引擎在代码执行前有一个解析的过程，创建了执行上下文，初始化了一些代码执行时需要用到的对象。当访问一个变量时，会到当前执行上下文中的作用域链中去查找，而作用域链的首端指向的是当前执行上下文的变量对象，这个变量对象是执行上下文的一个属性，它包含了函数的形参、所有的函数和变量声明，这个对象的是在代码解析的时候创建的。

首先要知道，JS 在拿到一个变量或者一个函数的时候，会有两步操作，即解析和执行。

- 在**解析阶段**，JS 会检查语法，并对函数进行预编译。解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来，变量先赋值为 undefined，函数先声明好可使用。在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多出 this、arguments 和函数的参数。
  - 全局上下文：变量定义，函数声明
  - 函数上下文：变量定义，函数声明，this，arguments
- 在**执行阶段**，就是按照代码的顺序依次执行。

**原因：**

1. **提高性能**

在 JS 代码执行之前，会进行语法检查和预编译，并且这一操作只进行一次。这么做就是为了提高性能，如果没有这一步，那么每次执行代码前都必须重新解析一遍该变量（函数），而这是没有必要的，因为变量（函数）的代码并不会改变，解析一遍就够了。

在解析的过程中，还会为函数生成预编译代码。在预编译时，会统计声明了哪些变量、创建了哪些函数，并对函数的代码进行压缩，去除注释、不必要的空白等。这样做的好处就是每次执行函数时都可以直接为该函数分配栈空间（不需要再解析一遍去获取代码中声明了哪些变量，创建了哪些函数），并且因为代码压缩的原因，代码执行也更快了。

2. **容错性更好**

变量提升可以在一定程度上提高 JS 的容错性，看下面的代码：

```js
a = 1;
var a;
console.log(a);
```

如果没有变量提升，这两行代码就会报错，但是因为有了变量提升，这段代码就可以正常执行。

虽然，在可以开发过程中，可以完全避免这样写，但是有时代码很复杂的时候。可能因为疏忽而先使用后定义了，这样也不会影响正常使用。由于变量提升的存在，而会正常运行。

**总结：**

- 解析和预编译过程中的声明提升可以提高性能，让函数可以在执行时预先为变量分配栈空间
- 声明提升还可以提高 JS 代码的容错性，使一些不规范的代码也可以正常执行

### 9. 严格模式 use strict

use strict 是一种 ECMAscript5 添加的（严格模式）运行模式，这种模式使得 Javascript 在更严格的条件下运行。

设立严格模式的目的如下：

- 消除 Javascript 语法的不合理、不严谨之处，减少怪异行为;
- 消除代码运行的不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度；
- 为未来新版本的 Javascript 做好铺垫。

区别：

- 禁止使用 with 语句。
- 禁止 this 关键字指向全局对象。
- 对象不能有重名的属性。

### 10. Ajax

Ajax 即 `AsynchronousJavascriptAndXML`（异步 JavaScript 和 XML），是指一种创建交互式网页应用的网页开发技术。它是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。通过在后台与服务器进行少量数据交换，Ajax 可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。传统的网页（不使用 Ajax）如果需要更新内容，必须重载整个网页页面。

**缺点：**

- 本身是针对 MVC 编程，不符合前端 MVVM 的浪潮
- 基于原生 XHR 开发，XHR 本身的架构不清晰
- 不符合关注分离（Separation of Concerns）的原则
- 配置和调用方式非常混乱，而且基于事件的异步模型不友好。

```js
const ajax = (url,method,async,data){
  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    // 创建 Http 请求
    xhr.open(method,url,async);
    // 设置状态监听函数
    xhr.onreadystatechange = ()=>{
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          resolve(xhr.responseText);
        }else{
          reject(xhr.status);
        }
      }
    };
    // 设置请求失败时的监听函数
    xhr.onerror = () => {
      reject(new Error(xhr.statusText));
    };
    // 设置请求头信息
    xhr.responseType = "json";
    // 设置请求头信息
    xhr.setRequestHeader("Accept", "application/json");
    // 发送请求
    xhr.send(data || null);
  })
}
```

### 11. Fetch

fetch 号称是 AJAX 的替代品，是在 ES6 出现的，使用了 ES6 中的 promise 对象。Fetch 是基于 promise 设计的。Fetch 的代码结构比起 ajax 简单多。fetch 不是 ajax 的进一步封装，而是原生 js，没有使用 XMLHttpRequest 对象。

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

### 12. Axios

Axios 是一种基于 Promise 封装的 HTTP 客户端，其特点如下：

- 从浏览器中创建 `XMLHttpRequest`
- 从 `node.js` 发出 `http` 请求
- 支持 `Promise API`
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求 CancelToken
- 自动转换 JSON 数据
- 客户端支持防止 `CSRF/XSRF`
- 提供了并发的封装 `axios.all()`，只需将一个请求数组传递给这个方法，然后使用`axios.spread()`将响应数组的属性分配给多个变量

前两个特性解释了为什么 Axios 可以同时用于浏览器和 Node.js 的原因，简单来说就是通过判断是服务器还是浏览器环境，来决定使用 XMLHttpRequest 还是 Node.js 的 HTTP 来创建请求，这个兼容的逻辑被叫做适配器，对应的源码在 lib/defaults.js 中，

```js
// defaults.js
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}
```

以上是适配器的判断逻辑，通过侦测当前环境的一些全局变量，决定使用哪个 adapter。
其中对于 Node 环境的判断逻辑在我们做 ssr 服务端渲染的时候，也可以复用。

#### Adapter xhr

定位到源码文件 `lib/adapters/xhr.js`，先来看下整体结构

```js
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;

    var request = new XMLHttpRequest();

    request.open(
      config.method.toUpperCase(),
      buildURL(fullPath, config.params, config.paramsSerializer),
      true
    );
    request.onreadystatechange = function handleLoad() {};
    request.onabort = function handleAbort() {};
    request.onerror = function handleError() {};
    request.ontimeout = function handleTimeout() {};

    request.send(requestData);
  });
};
```

导出了一个函数，接受一个配置参数，返回一个 Promise。这就是 XMLHttpRequest 的使用姿势呀，先创建了一个 xhr 然后 open 启动请求，监听 xhr 状态，然后 send 发送请求。

展开看一下 Axios 对于 onreadystatechange 的处理

```js
request.onreadystatechange = function handleLoad() {
  if (!request || request.readyState !== 4) {
    return;
  }

  // The request errored out and we didn't get a response, this will be
  // handled by onerror instead
  // With one exception: request that using file: protocol, most browsers
  // will return status as 0 even though it's a successful request
  if (
    request.status === 0 &&
    !(request.responseURL && request.responseURL.indexOf('file:') === 0)
  ) {
    return;
  }

  // Prepare the response
  var responseHeaders =
    'getAllResponseHeaders' in request
      ? parseHeaders(request.getAllResponseHeaders())
      : null;
  var responseData =
    !config.responseType || config.responseType === 'text'
      ? request.responseText
      : request.response;
  var response = {
    data: responseData,
    status: request.status,
    statusText: request.statusText,
    headers: responseHeaders,
    config: config,
    request: request,
  };

  settle(resolve, reject, response);

  // Clean up request
  request = null;
};
```

首先对状态进行过滤，只有当请求完成时（readyState === 4）才往下处理。
需要注意的是，如果 XMLHttpRequest 请求出错，大部分的情况下我们可以通过监听 onerror 进行处理，但是也有一个例外：当请求使用文件协议（file://）时，尽管请求成功了但是大部分浏览器也会返回 0 的状态码。

Axios 针对这个例外情况也做了处理。

请求完成后，就要处理响应了。这里将响应包装成一个标准格式的对象，作为第三个参数传递给了 settle 方法，settle 在 lib/core/settle.js 中定义

```js
function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      )
    );
  }
}
```

对 Promise 的回调进行了简单的封装，确保调用按一定的格式返回

#### 防范 CSRF

**范伪造请求的关键就是检查请求来源**，Referer 字段虽然可以标识当前站点，但是不够可靠，现在业界比较通用的解决方案还是在每个请求上附带一个 anti-CSRF token，这个的原理是攻击者无法拿到 Cookie，所以我们可以通过对 Cookie 进行加密（比如对 sid 进行加密），然后配合服务端做一些简单的验证，就可以判断当前请求是不是伪造的。

```js
// Add xsrf header
// This is only done if running in a standard browser environment.
// Specifically not if we're in a web worker, or react-native.
if (utils.isStandardBrowserEnv()) {
  // Add xsrf header
  var xsrfValue =
    (config.withCredentials || isURLSameOrigin(fullPath)) &&
    config.xsrfCookieName
      ? cookies.read(config.xsrfCookieName)
      : undefined;

  if (xsrfValue) {
    requestHeaders[config.xsrfHeaderName] = xsrfValue;
  }
}
```

#### 拦截器 Interceptor

```js
// 拦截器可以拦截请求或响应
// 拦截器的回调将在请求或响应的 then 或 catch 回调前被调用
var instance = axios.create(options);

var requestInterceptor = axios.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config;
  },
  (err) => {
    // do something with request error
    return Promise.reject(err);
  }
);

// 移除已设置的拦截器
axios.interceptors.request.eject(requestInterceptor);
```

那么拦截器是怎么实现的呢？定位到源码 lib/core/Axios.js 第 14 行

```js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  };
}
```

拦截器 interceptors 中的 request 和 response 两者都是一个叫做 InterceptorManager 的实例,定位到源码 lib/core/InterceptorManager.js

```js
function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null,
  });
  return this.handlers.length - 1;
};

InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
```

**InterceptorManager 是一个简单的事件管理器**，实现了对拦截器的管理，通过 handlers 存储拦截器，然后提供了添加，移除，遍历执行拦截器的实例方法，存储的每一个拦截器对象都包含了作为 Promise 中 resolve 和 reject 的回调以及两个配置项。

值得一提的是，移除方法是**通过直接将拦截器对象设置为 null 实现的**，而不是 splice 剪切数组，遍历方法中也增加了相应的 null 值处理。这样做一方面使得每一项 ID 保持为项的数组索引不变，另一方面也避免了重新剪切拼接数组的性能损失。

拦截器的回调会在请求或响应的 then 或 catch 回调前被调用

当执行 request 时，实际的请求（dispatchRequest）和拦截器是通过一个叫 chain 的队列来管理的。整个请求的逻辑如下，

1. 首先初始化请求和响应的拦截器队列，将 resolve，reject 回调依次放入队头
2. 然后初始化一个 Promise 用来执行回调，chain 用来存储和管理实际请求和拦截器
3. 将请求拦截器放入 chain 队头，响应拦截器放入 chain 队尾
4. 队列不为空时，通过 Promise.then 的链式调用，依次将请求拦截器，实际请求，响应拦截器出队
5. 最后返回链式调用后的 Promise

这里的实际请求是对适配器的封装，请求和响应数据的转换都在这里完成。

#### 数据转换 Transform data

定位到源码 lib/core/dispatchRequest.js

```js
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(
    function onAdapterResolution(response) {
      throwIfCancellationRequested(config); // 如果请求被取消，则抛出异常

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    },
    function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config); // 取消请求

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    }
  );
}
```

转换通过 transformData 函数实现，它会遍历调用设置的转换函数，转换函数将 headers 作为第二个参数，所以我们可以根据 headers 中的信息来执行一些不同的转换操作

```js
// 源码 core/transformData.js
function transformData(data, headers, fns) {
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
}
```

Axios 也提供了两个默认的转换函数，用于对请求和响应数据进行转换。

默认情况下，Axios 会对请求传入的 data 做一些处理，比如请求数据如果是对象，会序列化为 JSON 字符串，响应数据如果是 JSON 字符串，会尝试转换为 JavaScript 对象，这些都是非常实用的功能

对应的转换器源码可以在 lib/default.js 的第 31 行找到

```js
var defaults = {
  // Line 31
  transformRequest: [
    function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(
          headers,
          'application/x-www-form-urlencoded;charset=utf-8'
        );
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    },
  ],

  transformResponse: [
    function transformResponse(data) {
      var result = data;
      if (utils.isString(result) && result.length) {
        try {
          result = JSON.parse(result);
        } catch (e) {
          /* Ignore */
        }
      }
      return result;
    },
  ],
};
```

#### CancelToken

其实不管是浏览器端的 xhr 或 Node.js 里 http 模块的 request 对象，都提供了 abort 方法用于取消请求，所以我们只需要在合适的时机调用 abort 就可以实现取消请求了。

那么，什么是合适的时机呢？控制权交给用户就合适了。所以这个合适的时机应该由用户决定，也就是说我们需要将取消请求的方法暴露出去，Axios 通过 CancelToken 实现取消请求，我们来一起看下它的姿势。

首先 Axios 提供了两种方式创建 cancel token

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 方式一，使用 CancelToken 实例提供的静态属性 source
axios.post('/user/12345', { name: '***' }, { cancelToken: source.token });
source.cancel();

// 方式二，使用 CancelToken 构造函数自己实例化
let cancel;

axios.post(
  '/user/12345',
  { name: '***' },
  {
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    }),
  }
);

cancel();
```

到底什么是 CancelToken？定位到源码 lib/cancel/CancelToken.js 第 11 行

```js
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}
```

CancelToken 就是一个由 promise 控制的极简的状态机，实例化时会在实例上挂载一个 promise，这个 promise 的 resolve 回调暴露给了外部方法 executor，这样一来，我们从外部调用这个 executor 方法后就会得到一个状态变为 fulfilled 的 promise，那有了这个 promise 后我们如何取消请求呢？

是不是只要在请求时拿到这个 promise 实例，然后在 then 回调里取消请求就可以了？

定位到适配器的源码 lib/adapters/xhr.js 第 158 行

```js
if (config.cancelToken) {
  // Handle cancellation
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (!request) {
      return;
    }

    request.abort();
    reject(cancel);
    // Clean up request
    request = null;
  });
}
```

以及源码 lib/adaptors/http.js 第 291 行

```js
if (config.cancelToken) {
  // Handle cancellation
  config.cancelToken.promise.then(function onCanceled(cancel) {
    if (req.aborted) return;

    req.abort();
    reject(cancel);
  });
}
```

在适配器里 CancelToken 实例的 promise 的 then 回调里调用了 xhr 或 http.request 的 abort 方法。试想一下，如果我们没有从外部调用取消 CancelToken 的方法，是不是意味着 resolve 回调不会执行，适配器里的 promise 的 then 回调也不会执行，就不会调用 abort 取消请求了。

## 四、原型与原型链

### 1. 含义理解

《你不知道的 javascript》对原型的描述：

> javascript 中的对象有一个特殊的 [[Prototype]] 内置属性，其实就是对其他对象的引用。几乎所有的对象在创建时 [[Prototype]] 都会被赋予一个非空的值。

《javascript 高级程序设计》这样描述原型：

> 每个函数都会创建一个 prototype 属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法都可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型。

`原型`：当构造函数被创建时，会在内存空间新建一个对象，构造函数内有一个属性 `prototype` 会指向这个对象的存储空间，这个对象称为构造函数的原型对象

除了 `Function.prototype.bind()` 之外每个函数都有 `prototype` 属性就是原型，原型的 `constructor` 属性指向构造函数，构造函数又通过 `prototype` 属性指回原型

`原型链`：每个对象拥有一个原型对象，通过 `__proto__` 指针指向上一个原型 ，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向 null，这种关系被称为原型链 (prototype chain)，现在浏览器中都实现了 `__proto__ ` 属性来访问这个属性，但是最好不要使用这个属性，因为它不是规范中规定的。ES5 中新增了一个 `Object.getPrototypeOf()` 方法，可以通过这个方法来获取对象的原型。

1. `Object` 是所有对象的爸爸，所有对象都可以通过 `__proto__` 找到它
2. `Function` 是所有函数的爸爸，所有函数都可以通过 `__proto__` 找到它
3. `Function.prototype` 和 `Object.prototype` 是两个特殊的对象，他们由引擎来创建
4. 除了以上两个特殊对象，其他对象都是通过构造器 `new` 出来的

![/images/](/images/prototype.png)

- 构造函数、原型和实例的关系是这样的：
  每个`构造函数`都有一个`原型对象`（实例的原型），`原型`有一个`constructor`属性指回`构造函数`，而`实例`有一个内部指针指向原型。 在 chrome、firefox、safari 浏览器环境中这个指针就是`__proto__`，其他环境下没有访问`[[Prototype]]`的标准方式

### 2. 修改、重写

```js
function Person(name) {
  this.name = name;
}
// 修改原型
Person.prototype.getName = function () {};
var p = new Person('hello');
console.log(p.__proto__ === Person.prototype); // true
console.log(p.__proto__ === p.constructor.prototype); // true
// 重写原型
Person.prototype = {
  getName: function () {},
};
var p = new Person('hello');
console.log(p.__proto__ === Person.prototype); // true
console.log(p.__proto__ === p.constructor.prototype); // false
```

可以看到修改原型的时候 p 的构造函数不是指向 Person 了，因为直接给 Person 的原型对象直接用对象赋值时，它的构造函数指向的了根构造函数 Object，所以这时候 p.constructor === Object ，而不是 p.constructor === Person。要想成立，就要用 constructor 指回来：

```js
Person.prototype = {
  getName: function () {},
};
var p = new Person('hello');
p.constructor = Person;
console.log(p.__proto__ === Person.prototype); // true
console.log(p.__proto__ === p.constructor.prototype); // true
```

### 3. 原型链指向

```js
p.__proto__; // Person.prototype
Person.prototype.__proto__; // Object.prototype
p.__proto__.__proto__; //Object.prototype
p.__proto__.constructor.prototype.__proto__; // Object.prototype
Person.prototype.constructor.prototype.__proto__; // Object.prototype
p1.__proto__.constructor; // Person
Person.prototype.constructor; // Person
```

### 4. 原型链的终点

由于 Object 是构造函数，原型链终点是`Object.prototype.__proto__`，而`Object.prototype.__proto__=== null // true`，所以，原型链的终点是`null`。原型链上的所有原型都是对象，所有的对象最终都是由 Object 构造的，而` Object.prototype``的下一级是Object.prototype.__proto__ `。

```js
Object.prototype.__proto__; // null
```

### 5. 对象非原型链上的属性

使用后`hasOwnProperty()`方法来判断属性是否属于原型链的属性：

```js
function iterate(obj) {
  var res = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) res.push(key + ': ' + obj[key]);
  }
  return res;
}
```

## 五、闭包 / 作用域链 / 上下文

### 1. 闭包

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

- 表现形式

  1. 返回一个函数。刚刚已经举例。
  2. 作为函数参数传递
  3. 在定时器、事件监听、Ajax 请求、跨窗口通信、Web Workers 或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。
  4. IIFE(立即执行函数表达式)创建闭包, 保存了`全局作用域window`和`当前函数的作用域`，因此可以全局的变量。

### 2. 作用域、作用域链

`作用域`：指的是一个变量和函数的作用范围，JS 中函数内声明的所有变量在函数体内始终是可见的，在 ES6 前有全局作用域和局部作用域，但是没有块级作用域（`catch` 只在其内部生效），局部变量的优先级高于全局变量

作用域是定义变量的区域，它有一套访问变量的规则，这套规则来管理浏览器引擎如何在当前作用域以及嵌套的作用域中根据变量（标识符）进行变量查找。

**分类**

1. 全局作用域和函数作用域
   - 全局作用域
     - 最外层函数和最外层函数外面定义的变量拥有全局作用域
     - 所有未定义直接赋值的变量自动声明为全局作用域
     - 所有 window 对象的属性拥有全局作用域
     - 全局作用域有很大的弊端，过多的全局作用域变量会污染全局命名空间，容易引起命名冲突。
   - 函数作用域
     - 函数作用域声明在函数内部的变零，一般只有固定的代码片段可以访问到
     - 作用域是分层的，内层作用域可以访问外层作用域，反之不行
2. 块级作用域
   - 使用 ES6 中新增的 let 和 const 指令可以声明块级作用域，块级作用域可以在函数中创建也可以在一个代码块中的创建（由{ }包裹的代码片段）
   - let 和 const 声明的变量不会有变量提升，也不可以重复声明
   - 在循环中比较适合绑定块级作用域，这样就可以把声明的计数器变量限制在循环内部。

`作用域链`：当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链

作用域链的作用是**保证对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，可以访问到外层环境的变量和函数**。

作用域链的本质上是一个指向变量对象的指针列表。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的前端始终都是当前执行上下文的变量对象。全局执行上下文的变量对象（也就是全局对象）始终是作用域链的最后一个对象。

当查找一个变量时，如果当前执行环境中没有找到，可以沿着作用域链向后查找。

### 3. 执行上下文

1. **执行上下文类型**

   - **全局**

     任何不在函数内部的都是全局执行上下文，它首先会创建一个全局的 window 对象，并且设置 this 的值等于这个全局对象，一个程序中只有一个全局执行上下文。

   - **函数**

     当一个函数被调用时，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个。

   - **eval 函数**

     执行在 eval 函数中的代码会有属于他自己的执行上下文，不过 eval 函数不常使用，不做介绍。

2. **执行上下文栈**

- JavaScript 引擎使用执行上下文栈来管理执行上下文

* 当 JavaScript 执行代码时，首先遇到全局代码，会创建一个全局执行上下文并且压入执行栈中，每当遇到一个函数调用，就会为该函数创建一个新的执行上下文并压入栈顶，引擎会执行位于执行上下文栈顶的函数，当函数执行完成之后，执行上下文从栈中弹出，继续执行下一个上下文。当所有的代码都执行完毕之后，从栈中弹出全局执行上下文。

```js
let a = 'Hello World!';
function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}
function second() {
  console.log('Inside second function');
}
first();
//执行顺序
//先执行second(),在执行first()
```

3. **创建执行上下文**
   创建执行上下文有两个阶段：**创建阶段**和**执行阶段**

   1. 创建阶段
      - this 绑定
        - 在全局执行上下文中，this 指向全局对象（window 对象）
        - 在函数执行上下文中，this 指向取决于函数如何调用。如果它被一个引用对象调用，那么 this 会被设置成那个对象，否则 this 的值被设置为全局对象或者 undefined
   2. 创建词法环境组件
      - 词法环境是一种有**标识符——变量映射**的数据结构，标识符是指变量/函数名，变量是对实际对象或原始数据的引用。
      - 词法环境的内部有两个组件：
        - **环境记录器**:用来储存变量个函数声明的实际位置
        - **外部环境的引用**：可以访问父级作用域
   3. 创建变量环境组件
      - 变量环境也是一个词法环境，其环境记录器持有变量声明语句在执行上下文中创建的绑定关系。

4. 执行阶段
   此阶段会完成对变量的分配，最后执行完代码。

**简单来说执行上下文就是指：**

在执行一点 JS 代码之前，需要先解析代码。解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来，变量先赋值为 undefined，函数先声明好可使用。这一步执行完了，才开始正式的执行程序。

在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多出 this、arguments 和函数的参数。

- 全局上下文：变量定义，函数声明
- 函数上下文：变量定义，函数声明，`this`，`arguments`

## 六、this / call / apply / bind

### 1. 对 this 对象的理解

this 是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this 的指向可以通过四种调用模式来判断。

- 第一种是**函数调用模式**（默认绑定），当一个函数不是一个对象的属性时，直接作为函数来调用时，this 指向全局对象。
- 第二种是**方法调用模式**（隐式绑定），如果一个函数作为一个对象的方法来调用时，this 指向这个对象。
- 第三种是**构造器调用模式**（new 绑定），如果一个函数用 new 调用时，函数执行前会新创建一个对象，this 指向这个新创建的对象。
- 第四种是 **apply 、 call 和 bind 调用模式**（显示绑定），这三个方法都可以显示的指定调用函数的 this 指向。

优先级：new > 显示 > 隐示 > 默认

### 2. call

> `call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

**应用：**

1. 对象的继承
2. 借用方法：类数组使用`Array`原型链上的方法

**实现步骤：**

1. 判断调用对象是否为函数，即使是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
2. 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
3. 处理传入的参数，截取第一个参数后的所有参数。
4. 将函数作为上下文对象的一个属性。
5. 使用上下文对象来调用这个方法，并保存返回结果。
6. 删除刚才新增的属性。
7. 返回结果。

```js
Function.prototype.myCall = function (context) {
  // 判断调用对象
  if (typeof this !== 'function') {
    console.error('type error');
  }
  // 获取参数
  let args = [...arguments].slice(1),
    result = null;
  // 判断 context 是否传入，如果未传入则设置为 window
  context = context || window;
  // 将调用函数设为对象的方法
  context.fn = this;
  // 调用函数
  result = context.fn(...args);
  // 将属性删除
  delete context.fn;
  return result;
};
```

### 3. apply

> `apply()` 方法调用一个具有给定 this 值的函数，以及作为一个数组（或类似数组对象）提供的参数。

**应用：**

1. `Math.max`。用它来获取数组中最大的一项
2. 实现两个数组合并。在 ES6 的扩展运算符出现之前，我们可以用`Array.prototype.push`来实现。

```js
Function.prototype.myApply = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  let result = null;
  // 判断 context 是否存在，如果未传入则为 window
  context = context || window;
  // 将函数设为对象的方法
  context.fn = this;
  // 调用方法
  if (arguments[1]) {
    result = context.fn(...arguments[1]);
  } else {
    result = context.fn();
  }
  // 将属性删除
  delete context.fn;
  return result;
};
```

### 4. bind

> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

**实现步骤：**

1. 前几步和之前的实现差不多，就不赘述了
2. bind 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式
3. 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`
4. 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this`

```js
Function.prototype.myBind = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  // 获取参数
  const args = [...arguments].slice(1),
    fn = this;
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? new fn(...arguments) : context,
      args.concat(...arguments)
    );
  };
};
```

## 七、对象创建

### 1. 工厂模式

用函数来封装创建对象的细节，从而通过调用函数来达到复用的目的。但是它有一个很大的问题就是创建出来的对象无法和某个类型联系起来，它只是简单的封装了复用代码，而没有建立起对象和类型间的关系

```js
function createPerson(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}
var person1 = createPerson('Nicholas', 29, 'Software Engineer');
var person2 = createPerson('Greg', 27, 'Doctor');
```

### 2. 构造函数模式

js 中每一个函数都可以作为构造函数，只要一个函数是通过 new 来调用的，那么就可以把它称为构造函数。执行构造函数首先会创建一个对象，然后将对象的原型指向构造函数的 prototype 属性，然后将执行上下文中的 this 指向这个对象，最后再执行整个函数，如果返回值不是对象，则返回新建的对象。因为 this 的值指向了新建的对象，因此可以使用 this 给对象赋值。构造函数模式相对于工厂模式的优点是，所创建的对象和构造函数建立起了联系，因此可以通过原型来识别对象的类型。但是构造函数存在一个缺点就是，造成了不必要的函数对象的创建，因为在 js 中函数也是一个对象，因此如果对象属性中如果包含函数的话，那么每次都会新建一个函数对象，浪费了不必要的内存空间，因为函数是所有的实例都可以通用的

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function () {
    console.log(this.name);
  };
}
var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');
```

### 3. 原型模式

每一个函数都有一个 prototype 属性，这个属性是一个对象，它包含了通过构造函数创建的所有实例都能共享的属性和方法。因此可以使用原型对象来添加公用属性和方法，从而实现代码的复用。这种方式相对于构造函数模式来说，解决了函数对象的复用问题。但是这种模式也存在一些问题，一个是没有办法通过传入参数来初始化值，另一个是如果存在一个引用类型如 Array 这样的值，那么所有的实例将共享一个对象，一个实例对引用类型值的改变会影响所有的实例

```js
function Person() {}
Person.prototype.name = 'Nicholas';
Person.prototype.age = 29;
Person.prototype.job = 'Software Engineer';
Person.prototype.sayName = function () {
  console.log(this.name);
};
var person1 = new Person();
person1.sayName(); // 'Nicholas'
var person2 = new Person();
person2.sayName(); // 'Nicholas'
console.log(person1.sayName === person2.sayName); // true
```

### 4. 组合模式(构造函数+原型)

创建自定义类型的最常见方式。因为构造函数模式和原型模式分开使用都存在一些问题，因此可以组合使用这两种模式，通过构造函数来初始化对象的属性，通过原型对象来实现函数方法的复用。这种方法很好的解决了两种模式单独使用时的缺点，但是有一点不足的就是，因为使用了两种不同的模式，所以对于代码的封装性不够好

```js
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
Person.prototype = {
  constructor: Person,
  sayName: function () {
    console.log(this.name);
  },
};
var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');
```

### 5. 动态原型模式

将原型方法赋值的创建过程移动到了构造函数的内部，通过对属性是否存在的判断，可以实现仅在第一次调用函数时对原型对象赋值一次的效果。这一种方式很好地对上面的混合模式进行了封装

```js
function Person(name, age, job) {
  // 属性
  this.name = name;
  this.age = age;
  this.job = job;
  // 方法
  if (typeof this.sayName != 'function') {
    Person.prototype.sayName = function () {
      console.log(this.name);
    };
  }
}
var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');
```

### 6. 寄生构造函数模式

基于一个已有的类型，在实例化时对实例化的对象进行扩展。这样既不用修改原来的构造函数，也达到了扩展对象的目的。它的一个缺点和工厂模式一样，无法实现对象的识别

```js
function Person(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function () {
    console.log(this.name);
  };
  return o;
}
var person1 = new Person('Nicholas', 29, 'Software Engineer');
var person2 = new Person('Greg', 27, 'Doctor');
```

## 八、对象继承

> 继承是面向对象编程的三大特征之一（封装、继承、多态）。多个类中存在相同的属性和行为时，将这些内容抽取到单独一个类中，那么多个类无需再定义这些属性和行为，只需要继承那个类即可。多个类可以称为子类，单独这个类称为父类或者超类，基类等。子类可以直接访问父类中的非私有的属性和行为。

在其他面向类语言中，继承意味着复制操作，子类是实实在在地将父类的属性和方法复制了过来，但 javascript 中的继承不是这样的。根据原型的特性，js 中继承的本质是一种委托机制，对象可以将需要的属性和方法委托给原型，需要用的时候就去原型上拿，这样多个对象就可以共享一个原型上的属性和方法，这个过程中是没有复制操作的。

javascript 中的继承主要还是依靠于原型链，原型处于原型链中时即可以是某个对象的原型也可以是另一个原型的实例，这样就能形成原型之间的继承关系。

### 1. 原型链继承

将父类的实例作为子类的原型(让构造函数的 `prototype` 指向另一个构造函数的实例)，他的特点是实例是子类的实例也是父类的实例，父类新增的原型方法/属性，子类都能够访问，并且原型链继承简单易于实现.

**缺点:**

1. 当原型上的属性是引用数据类型时，所有实例都会共享这个属性，即某个实例对这个属性重写会影响其他实例
2. 无法实现多继承
3. 无法向父类构造函数传参

```js
function Parent() {
  this.name = 'parent';
}
function Child() {
  this.type = 'child';
}
Child.prototype = new Parent();
```

### 2. 原型式继承

> 2006 年，道格拉斯.克罗克福德写了一篇文章《Javascript 中的原型式继承》。这片文章介绍了一种不涉及严格意义上构造函数的继承方法。他的出发点是即使不自定义类型也可以通过原型实现对象之间的信息共享。

```js
const parent = {
  name: 'parent',
};
const object = function (o) {
  function F() {}
  F.prototype = o;
  return new F();
};
const child1 = object(parent);
console.log(child1.name); // parent
```

这个函数将原型链继承的核心代码封装成了一个函数，但这个函数有了不同的适用场景：如果你有一个已知的对象，想在它的基础上再创建一个新对象，那么你只需要把已知对象传给 object 函数即可。

ES5 新增了一个方法`Object.create()`将原型式继承规范化了。相比于上述的 `object()` 方法，`Object.create()`可以接受两个参数，第一个参数是作为新对象原型的对象，第二个参数也是个对象，里面放入需要给新对象增加的属性（可选）。第二个参数与 `Object.defineProperties()` 方法的第二个参数是一样的，每个新增的属性都通过自己的属性描述符来描述，以这种方式添加的属性会遮蔽原型上的同名属性。当`Object.create()`只传入第一个参数时，功效与上述的 `object()` 方法是相同的

```js
const child2 = Object.create(parent, {
  sex: {
    value: 'man',
    writable: false,
    enumerable: true,
    configurable: true,
  },
});
console.log(child2.name); // parent
```

**注意**，`object.create()`通过第二个参数新增的属性是直接挂载到新建对象本身，而不是挂载在它的原型上。**_原型式继承非常适合不需要单独创建构造函数，但仍然需要在对象间共享信息的场合。_**

### 3. 构造函数继承

盗用构造函数也叫作“**对象伪装**”或者“**经典继承**”，原理就是通过在子类中调用父类构造函数实现上下文的绑定。

使用父类的构造函数来增强子类实例，即复制父类的实例属性给子类，构造继承可以向父类传递参数，可以实现多继承，通过 call 多个父类对象。

**缺点：**

1. 必须在构造函数中定义方法，通过盗用构造函数继承的方法本质上都变成了实例自己的方法，不是公共的方法，因此失去了复用性
2. 子类不能访问父类原型上定义的方法，因此所有类型只能继承父类的实例属性和方法
3. 每个子类都有父类实例函数的副本，影响性能。

```js
function Parent() {
  this.name = 'parent';
}
function Child() {
  Parent.call(this);
  this.type = 'child';
}
```

### 4. 组合继承

所谓组合继承，就是在上面原型链继承方式下，在子构造函数内，手动调用父构造函数，并传入子类 this

通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用

```js
function Parent(name) {
  this.name = [name];
}
Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  Parent.call(this, 'xxx'); // 调用构造函数并传入参数
}
//原型链继承
Child.prototype = new Parent(); // 将父类的实例作为子类的原型 再次调用父类构造函数
```

### 5. 寄生式继承

创建一个用于封装继承过程的函数，通过传入一个对象，然后复制一个对象的副本，然后对象进行扩展，最后返回这个对象。

- 优点：对一个简单对象实现继承，无需定义新的类型
- 缺点：无法实现函数复用，每次创建对象都会创建一遍方法

```js
function createAnother(original) {
  var clone = object(original); // 通过调用函数创建一个新对象
  clone.sayHi = function () {
    // 以某种方式来增强这个对象
    console.log('hi');
  };
  return clone; // 返回这个对象
}
var person = {
  name: 'Nicholas',
  friends: ['Shelby', 'Court', 'Van'],
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); // 'hi'
```

### 6. 寄生组合继承

通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点

```js
function Parent(name) {
  this.name = [name];
}
Parent.prototype.getName = function () {
  return this.name;
};
function Child() {
  // 构造函数继承
  Parent.call(this, 'xxx');
}
// 原型链继承
// Child.prototype = new Parent()
Child.prototype = Object.create(Parent.prototype); // 将`指向父类实例`改为`指向父类原型`
Child.prototype.constructor = Child; // 修正构造函数
```

## 九、垃圾回收与内存泄漏

### 1. 垃圾回收机制

V8 实现了准确式 GC，GC 算法采用了分代式垃圾回收机制。这个机制又基于世代假说，这个假说有两个特点，一是新生的对象容易早死，另一个是不死的对象会活得更久。基于这个假说，因此，V8 将内存（堆）分为新生代和老生代两部分

新创建的对象或者只经历过一次的垃圾回收的对象被称为新生代。经历过多次垃圾回收的对象被称为老生代。

**新生代**：

新生代中的对象一般存活时间较短，使用 `Scavenge GC` 算法。

将内存空间分为两部分，分别为 From 空间和 To 空间。在这两个空间中，必定有一个空间是使用的，另一个空间是空闲的。新分配的对象会被放入 From 空间中，当 From 空间被占满时，新生代 GC 就会启动了。算法会检查 From 空间中存活的对象，如果满足条件则晋升到老生代，不满足则复制到 To 空间中，如果有失活的对象就会销毁。当复制完成后将 From 空间和 To 空间互换，这样 GC 就结束了

**老生代**：

老生代中的对象一般存活时间较长且数量也多，使用两个算法：

1. **标记清除**：先所有都加上标记，再把环境中引用到的变量去除标记。剩下的就是没用的了
2. **引用计数**：跟踪记录每个值被引用的次数。清除引用次数为 0 的变量。(会有**循环引用**问题：循环引用如果大量存在就会导致内存泄露。)

**出现在老生代的情况：**

1. 新生代中的对象是否已经经历过一次 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。
2. To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。

**减少垃圾回收**

- **对数组进行优化**：在清空一个数组时，最简单的方法就是给其赋值为[ ]，但是与此同时会创建一个新的空对象，可以将数组的长度设置为 0，以此来达到清空数组的目的。
- **对 object 进行优化**：对象尽量复用，对于不再使用的对象，就将其设置为 null，尽快被回收。
- **对函数进行优化**：在循环中的函数表达式，如果可以复用，尽量放在函数的外面。

### 2. 内存泄漏

- **意外的全局变量**： 由于使用未声明的变量，而意外的创建了一个全局变量，而使这个变量一直留在内存中无法被回收。

- **被遗忘的计时器或回调函数**： 设置了 `setInterval` 定时器，而忘记取消它，如果循环函数有对**外部变量**的引用的话，那么这个变量会被一直留在内存中，而无法被回收。

- **脱离 DOM 的引用**： 获取一个 DOM 元素的引用，而后面这个元素被删除，由于一直保留了对这个元素的引用，所以它也无法被回收。

- **闭包**： 不合理的使用闭包，从而导致某些变量一直被留在内存当中。

## 十、其它

### 1. 私有变量

- 配置属性

```js
const obj = {
  name: '张三',
  getName() {
    return this.name;
  },
};
object.defineProperty(obj, 'name', {
  configurable: false,
  enumerable: false,
});
```

- 闭包实现

```js
function Person(name) {
  var _name = name;
  this.getName = function () {
    return this.name;
  };
}
var p = new Person('张三');
console.log(p._name); // undefined
console.log(p.getName()); // '张三'
```

### 2. 定义方法

1. 函数声明

函数声明有预解析,而且函数声明的优先级高于变量

```js
//ES5
function getSum(){}
function (){}//匿名函数
//ES6
()=>{}//如果{}内容只有一行{}和return关键字可省,
```

2. 函数表达式(函数字面量)

```js
//ES5
var sum = function () {};
//ES6
let sum = () => {}; //如果{}内容只有一行{}和return关键字可省,
```

3. 构造函数

使用 Function 构造函数定义函数的方式是一个函数表达式,这种方式会导致解析两次代码，影响性能。第一次解析常规的 JavaScript 代码，第二次解析传入构造函数的字符串

```js
const sum = new Function('a', 'b', 'return a + b');
```

### 3. 防抖

即短时间内大量触发同一事件，只会执行一次函数，实现原理为设置一个定时器，约定在 xx 毫秒后再触发事件处理，`每次触发事件都会重新设置计时器`，直到 xx 毫秒内无第二次操作。

常用于搜索框/滚动条的监听事件处理，如果不做防抖，每输入一个字/滚动屏幕，都会触发事件处理，造成性能浪费。

```js
function debounce(func, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
```

### 4. 节流

防抖是延迟执行，而节流是间隔执行，函数节流即每隔一段时间就执行一次，实现原理为设置一个定时器，约定 xx 毫秒后执行事件，如果时间到了，那么执行函数并重置定时器，和防抖的区别在于，防抖每次触发事件都重置定时器，而节流在`定时器到时间后再清空定时器`

节流可以使用在 scroll 函数的事件监听上

```js
function throttle(func, wait) {
  let timeout = null;
  return function () {
    let context = this;
    let args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
```

### 5. 浅拷贝

> 创建一个新对象，这个对象有着原始对象属性值的一份`精确拷贝`。
>
> 如果属性是`基本类型`，拷贝的就是基本类型的`值`，如果属性是`引用类型`，拷贝的就是`内存地址` ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
>
> 浅拷贝只解决了`第一层`的问题，拷贝第一层的基本类型值，以及第一层的引用类型地址

- `Object.assign()`
  只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，所以并不是深拷贝

- 拓展运算符 `...`

- `Array.prototype.slice()`：slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end（不包括 end）决定的原数组的浅拷贝。原始数组不会被改变。

### 6. 深拷贝

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
    const { port1, port2 } = new MessageChannel();
    port2.onmessage = (ev) => resolve(ev.data);
    port1.postMessage(obj);
  });
}
```

- 递归

```js
function isObject(val) {
  return typeof val === "object" && val !== null;
}

function deepClone(obj, hash = new WeakMap()) {
  if (!isObject(obj)) return obj;
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  let target = Array.isArray(obj) ? [] : {};
  hash.set(obj, target);
  Reflect.ownKeys(obj).forEach((item) => {
    if (isObject(obj[item])) {
      target[item] = deepClone(obj[item], hash);
    } else {
      target[item] = obj[item];
    }
  });

  return target;
}
```

### 7. 高阶函数

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
