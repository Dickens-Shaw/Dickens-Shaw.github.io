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