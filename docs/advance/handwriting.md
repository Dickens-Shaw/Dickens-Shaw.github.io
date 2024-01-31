# 手撸代码

## 一、Javascript 基础

### 1）Object.is

```js
/**
 * Object.is不会转换被比较的两个值的类型，这点和===更为相似，他们之间也存在一些区别。
 * 1. NaN在===中是不相等的，而在Object.is中是相等的
 * 2. +0和-0在===中是相等的，而在Object.is中是不相等的
 */

Object.is = function (x, y) {
  if (x === y) {
    // 当前情况下，只有一种情况是特殊的，即 +0 -0
    // 如果 x !== 0，则返回true
    // 如果 x === 0，则使用 1/+0 === Infinity 和 1/-0 === -Infinity来进行判断
    return x !== 0 || 1 / x === 1 / y;
  }

  // x !== y 的情况下，只需要判断是否为NaN，如果x!==x，则说明x是NaN，同理y也一样
  // x和y同时为NaN时，返回true
  return x !== x && y !== y;
};
```

### 2）Object.create

```js
/**
 * Object.create(proto, [propertiesObject])
 * proto: 新创建对象的原型对象
 */

Object.create = function (proto) {
  // 如果proto不是对象或者为null，则抛出异常
  if (typeof proto !== "object" && typeof proto !== "function") {
    throw new TypeError("Object prototype may only be an Object or null");
  }

  // 创建一个空函数
  function F() {}

  // 将F的原型指向proto
  F.prototype = proto;

  // 返回一个F的实例
  return new F();
};