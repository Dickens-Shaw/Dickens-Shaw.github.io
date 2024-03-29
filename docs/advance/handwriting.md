# 代码实现

## 一、Javascript 基础

### 1. Object.is

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

### 2. Object.create

```js
/**
 * Object.create(proto, [propertiesObject])
 * proto: 新创建对象的原型对象
 */

Object.create = function (proto) {
  // 如果proto不是对象或者为null，则抛出异常
  if (typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError('Object prototype may only be an Object or null');
  }

  // 创建一个空函数
  function F() {}

  // 将F的原型指向proto
  F.prototype = proto;

  // 返回一个F的实例
  return new F();
};
```

### 3. instanceof

```js
/**
 * instanceof 运算符用于测试构造函数的 prototype 属性是否出现在对象的原型链中的任何位置
 */

function myInstanceof(left, right) {
  // 获取对象的原型
  let proto = Object.getPrototypeOf(left);
  // 获取构造函数的prototype对象
  let prototype = right.prototype;

  // 判断构造函数的prototype对象是否在对象的原型链上
  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }

```

### 4. new

1. 创建一个空对象
2. 设置原型，将对象的原型设置为函数的 prototype 对象
3. 让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
4. 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

```js
/**
 * new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例
 */

function objectFactory() {
  let newObject = null;
  let constructor = Array.prototype.shift.call(arguments);
  let result = null;
  // 判断参数是否是一个函数
  if (typeof constructor !== 'function') {
    console.error('type error');
    return;
  }
  // 新建一个空对象，对象的原型为构造函数的 prototype 对象
  newObject = Object.create(constructor.prototype);
  // 将 this 指向新建对象，并执行函数
  result = constructor.apply(newObject, arguments);
  // 判断返回对象
  let flag =
    result && (typeof result === 'object' || typeof result === 'function');
  // 判断返回结果
  return flag ? result : newObject;
}
```

### 5. 防抖

```js
/**
 * 防抖：触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次触发，则重新计算时间
 */

function debounce(fn, delay) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
```

### 6. 节流

```js
/**
 * 节流：高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率
 */

function throttle(fn, delay) {
  let flag = true;
  return function () {
    let context = this;
    let args = arguments;
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(context, args);
      flag = true;
    }, delay);
  };
}
```

### 7. 类型判断

```js
/**
 * 类型判断
 */

function getType(obj) {
  if (obj === null) return String(obj);
  let type = typeof obj;
  if (type !== 'object') {
    return type;
  }
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (\S+)\]$/, '$1');
}
```

### 8. call

- 判断调用对象是否为函数，即使我们是定义在函数的原型上的，但是可能出现使用 call 等方式调用的情况。
- 判断传入上下文对象是否存在，如果不存在，则设置为 window 。
- 处理传入的参数，截取第一个参数后的所有参数。
- 将函数作为上下文对象的一个属性。
- 使用上下文对象来调用这个方法，并保存返回结果。
- 删除刚才新增的属性。
- 返回结果。

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

### 9. apply

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

### 10. bind

```js
Function.prototype.myBind = function (context) {
  // 判断调用对象是否为函数
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  // 获取参数
  var args = [...arguments].slice(1),
    fn = this;
  return function Fn() {
    // 根据调用方式，传入不同绑定值
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    );
  };
};
```

### 11. 柯里化

```js
/**
 * 柯里化：将一个多参数函数转换成多个嵌套的单参数函数
 */
function curry(fn, args) {
  // 获取函数需要的参数长度
  let length = fn.length;

  args = args || [];

  return function () {
    let subArgs = args.slice(0);

    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }

    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}

// es6 实现
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}
```

### 12. 浅拷贝

```js
function shallowCopy(object) {
  // 只拷贝对象
  if (!object || typeof object !== 'object') return;

  // 根据 object 的类型判断是新建一个数组还是对象
  let newObject = Array.isArray(object) ? [] : {};

  // 遍历 object，并且判断是 object 的属性才拷贝
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key] = object[key];
    }
  }

  return newObject;
}
```

### 13. 深拷贝

```js
function deepCopy(object) {
  if (!object || typeof object !== 'object') return;

  let newObject = Array.isArray(object) ? [] : {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key] =
        typeof object[key] === 'object' ? deepCopy(object[key]) : object[key];
    }
  }

  return newObject;
}
```

### 14. sleep

```js
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
```

### 15. Object.assign

```js
Object.myAssign = function (target, ...sources) {
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  let to = Object(target);

  for (let i = 0; i < sources.length; i++) {
    let nextSource = sources[i];
    if (nextSource != null) {
      for (let nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
};
```

## 二、数据处理

### 1. 字符串反转

```js
function reverseString(str) {
  return str.split('').reverse().join('');
}
```

### 2. 字符串 repeat

```js
function repeatString(str, n) {
  return new Array(n + 1).join(str);
}
```

### 3. 模版字符串解析

```js
function render(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, function (_, key) {
    return data[key];
  });
}
```

### 4. 数字千分位

```js
function formatNumber(num) {
  return num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ',';
    });
  });
}
```

### 5. 手机号脱敏

```js
function desensitizationPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
```

### 6. URL 参数解析

```js
function parseQuery(url) {
  let query = url.split('?')[1];
  let queryArr = query.split('&');
  let params = {};
  queryArr.forEach((item) => {
    if (!/\=/.test(item)) {
      // 处理没有值的情况
      params[item] = true;
      return;
    }
    let [key, value] = item.split('=');
    // 解码
    value = decodeURIComponent(value);
    // 数字
    if (/^\d+$/.test(value)) {
      value = parseFloat(value);
    }
    if (params.hasOwnProperty(key)) {
      params[key] = [].concat(params[key], value);
    } else {
      params[key] = value;
    }
  });
  return params;
}
```

### 7. 版本号排序

```js
function sortVersion(versions) {
  return versions.sort((a, b) => {
    let i = 0;
    const arr1 = a.split('.');
    const arr2 = b.split('.');

    while (true) {
      const s1 = arr1[i];
      const s2 = arr2[i];
      i++;
      if (s1 === undefined || s2 === undefined) {
        return arr2.length - arr1.length;
      }

      if (s1 === s2) continue;

      return s2 - s1;
    }
  });
}
sortVersion(['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']);
// ['4.3.5', '4.3.4.5', '4.2', '2.3.3', '0.302.1', '0.1.1']
```

### 8. 数组扁平化

```js
// 递归
let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
  let result = [];

  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

// reduce
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

// 扩展运算符
function flatten(arr) {
  if (!arr.length) return;
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

// split 和 toString
function flatten(arr) {
  return arr.toString().split(',');
}

// 正则和 JSON 方法
function flatten(arr) {
  return JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']');
}
```

### 9. 数组去重

```js
// Set
function unique(arr) {
  return Array.from(new Set(arr));
}

// map
function unique(arr) {
  let map = new Map();
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    if (!map.has(arr[i])) {
      map.set(arr[i], true);
      result.push(arr[i]);
    }
  }
  return result;
}
```

### 10. 类数组转换

```js
/**
 * 类数组拥有 length 属性 可以使用下标来访问元素 但是不能使用数组的方法 如何把类数组转化为数组?
 */

const arrayLike = document.querySelectorAll('div');

// 1.扩展运算符
const array = [...arrayLike];
// 2.Array.from
Array.from(arrayLike);
// 3.Array.apply
Array.apply(null, arrayLike);
// 4.Array.prototype.concat
Array.prototype.concat.apply([], arrayLike);
// 5.Array.prototype.slice
Array.prototype.slice.call(arrayLike);
// 6.Array.prototype.splice
Array.prototype.splice.call(arrayLike, 0);
```

### 11. 列表转树形结构

```js
/**
  [
      {
          id: 1,
          text: '节点1',
          parentId: 0 //这里用0表示为顶级节点
      },
      {
          id: 2,
          text: '节点1_1',
          parentId: 1 //通过这个字段来确定子父级
      }
      ...
  ]

  转成
  [
      {
          id: 1,
          text: '节点1',
          parentId: 0,
          children: [
              {
                  id:2,
                  text: '节点1_1',
                  parentId:1
              }
          ]
      }
  ]
 */

function listToTree(data) {
  let temp = {};
  let treeData = [];
  for (let i = 0; i < data.length; i++) {
    temp[data[i].id] = data[i];
  }
  for (let i in temp) {
    if (+temp[i].parentId != 0) {
      if (!temp[temp[i].parentId].children) {
        temp[temp[i].parentId].children = [];
      }
      temp[temp[i].parentId].children.push(temp[i]);
    } else {
      treeData.push(temp[i]);
    }
  }
  return treeData;
}
```

### 12. 有序二维数组查找目标值

```js
function findInOrderedSet(matrix, target) {
  if (matrix == null || matrix.length == 0) {
    return false;
  }
  let row = 0;
  let col = matrix[0].length - 1;
  while (row < matrix.length && col >= 0) {
    if (matrix[row][col] === target) {
      return true;
    } else if (matrix[row][col] > target) {
      col--;
    } else {
      row++;
    }
  }
  return false;
}
```

### 13. 对象扁平化

```js
/**
  const obj = {
  a: {
          b: 1,
          c: 2,
          d: {e: 5}
      },
  b: [1, 3, {a: 2, b: 3}],
  c: 3
  }

  flatten(obj) 结果返回如下
  // {
  //  'a.b': 1,
  //  'a.c': 2,
  //  'a.d.e': 5,
  //  'b[0]': 1,
  //  'b[1]': 3,
  //  'b[2].a': 2,
  //  'b[2].b': 3
  //   c: 3
  // }
 */
function isObject(val) {
  return typeof val === 'object' && val !== null;
}

function flatten(obj) {
  if (!isObject(obj)) {
    return;
  }
  let res = {};
  const dfs = (cur, prefix) => {
    if (isObject(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((item, index) => {
          dfs(item, `${prefix}[${index}]`);
        });
      } else {
        for (let k in cur) {
          dfs(cur[k], `${prefix}${prefix ? '.' : ''}${k}`);
        }
      }
    } else {
      res[prefix] = cur;
    }
  };
  dfs(obj, '');

  return res;
}
```

## 三、场景应用

### 1. setTimeout 实现 setInterval

```js
/**
 *
 * 使用 setTimeout 实现 setInterval 的根本原因是：
 * setTimeout 不管上次异步任务是否完成，它都会将当前异步任务推入队列（很容易理解，setTimeout本身就是一次调用一次执行）
 * 而 setInterval 则会在任务推入异步队列时判断上次异步任务是否被执行。
 * 这就导致 setInterval 在做定时轮训时，出现耗时操作，或者调用的异步操作耗时会导致异步任务不按照期待的时间间隔执行。
 * setTimeout 保证调用的时间间隔是一致的，setInterval的设定的间隔时间包括了执行回调的时间。
 */

function mySetInterval(fn, time) {
  let timer = null;
  let intervalFn = () => {
    fn();
    timer = setTimeout(intervalFn, time);
  };
  intervalFn();
  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
}
```


### 2. 取消 Promise

```js
/**
 * Promise.race()方法可以用来竞争 Promise 可以借助这个特性 自己包装一个 空的 Promise 与要发起的 Promise 来实现
 */

function wrap(pro) {
  let obj = {};
  // 构造一个新的promise用来竞争
  let p1 = new Promise((resolve, reject) => {
    obj.resolve = resolve;
    obj.reject = reject;
  });

  obj.promise = Promise.race([p1, pro]);
  return obj;
}

let testPro = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 1000);
});

let wrapPro = wrap(testPro);
wrapPro.promise.then((res) => {
  console.log(res);
});
wrapPro.resolve('被拦截了');

```

### 3. 并发限制Promise调度器

```js
/**
 * JS 实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有两个
 * 
 * addTask(1000,"1");
 * addTask(500,"2");
 * addTask(300,"3");
 * addTask(400,"4");
 * 的输出顺序是：2 3 1 4
 * 
 * 整个的完整执行流程：
 * 
 * 一开始1、2两个任务开始执行
 * 500ms时，2任务执行完毕，输出2，任务3开始执行
 * 800ms时，3任务执行完毕，输出3，任务4开始执行
 * 1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
 * 1200ms时，4任务执行完毕，输出4
 */

 class Scheduler {
  constructor(limit) {
    this.queue = [];
    this.maxCount = limit;
    this.runCounts = 0;
  }
  add(time, order) {
    const promiseCreator = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, time);
      });
    };
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
      return;
    }
    this.runCounts++;
    this.queue
      .shift()()
      .then(() => {
        this.runCounts--;
        this.request();
      });
  }
}
const scheduler = new Scheduler(2);
const addTask = (time, order) => {
  scheduler.add(time, order);
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
scheduler.taskStart();
```

### 4. 分片处理大量数据渲染

```js
/**
 * 渲染百万条结构简单的大数据时 怎么使用分片思想优化渲染
 */

let ul = document.getElementById('container');
// 插入十万条数据
let total = 100000;
// 一次插入 20 条
let once = 20;
//总页数
let page = total / once;
//每条记录的索引
let index = 0;
//循环加载数据
function loop(curTotal, curIndex) {
  if (curTotal <= 0) {
    return false;
  }
  //每页多少条
  let pageCount = Math.min(curTotal, once);
  window.requestAnimationFrame(function () {
    for (let i = 0; i < pageCount; i++) {
      let li = document.createElement('li');
      li.innerText = curIndex + i + ' : ' + ~~(Math.random() * total);
      ul.appendChild(li);
    }
    loop(curTotal - pageCount, curIndex + pageCount);
  });
}
loop(total, index);

```

### 5. 实现 LRUCache(Least Recently Used)

```js
// 运用你所掌握的数据结构，设计和实现—个 LRU(最近最少使用)缓存机制。它应该支持以下操作：获取数据get 和写入数据put
// 获取数据
// get (key) - 如果密钥 (key)存在于缓存中，则获取密钥的值（总是正数），否则返回-1。
// 写入数据 out (key, value) - 如果密钥己经存在，则变更其数据值;如果密钥不存在，则插入该组「密钥/数据值」。
// 当缓存容量达到上限时，它应该在写入新数据之前删除最久末使用的数据值，从而为新的数据值留出空间。
// 进阶：
// 你是否可以在 O(1) 时间复杂度内完成这两种操作？
// 示例：
// LRUCache cache = new LRuCache （ 2 /* 缓存容量*/)；
// cache.put (1, 1);
// cache.put (2, 2) ;
// cache.get (1); // 返回1
// cache.put (3, 3); // 该操作会使得密钥 2作废
// cache.get (2); // 返回 -1未找到
// cache.put (4, 4); // 该操作会使得密钥 1作废
// cache.get (1); // 返回 -1（末找到）
// cache.get (3); // 返回3
// cache.get (4); // 返回4

//  一个Map对象在迭代时会根据对象中元素的插入顺序来进行
// 新添加的元素会被插入到map的末尾，整个栈倒序查看
class LRUCache {
  constructor(capacity) {
    this.secretKey = new Map();
    this.capacity = capacity;
  }
  get(key) {
    if (this.secretKey.has(key)) {
      let tempValue = this.secretKey.get(key);
      this.secretKey.delete(key);
      this.secretKey.set(key, tempValue);
      return tempValue;
    } else return -1;
  }
  put(key, value) {
    // key存在，仅修改值
    if (this.secretKey.has(key)) {
      this.secretKey.delete(key);
      this.secretKey.set(key, value);
    }
    // key不存在，cache未满
    else if (this.secretKey.size < this.capacity) {
      this.secretKey.set(key, value);
    }
    // 添加新key，删除旧key
    else {
      this.secretKey.set(key, value);
      // 删除map的第一个元素，即为最长未使用的
      this.secretKey.delete(this.secretKey.keys().next().value);
    }
  }
}
// let cache = new LRUCache(2);
// cache.put(1, 1);
// cache.put(2, 2);
// console.log("cache.get(1)", cache.get(1))// 返回  1
// cache.put(3, 3);// 该操作会使得密钥 2 作废
// console.log("cache.get(2)", cache.get(2))// 返回 -1 (未找到)
// cache.put(4, 4);// 该操作会使得密钥 1 作废
// console.log("cache.get(1)", cache.get(1))// 返回 -1 (未找到)
// console.log("cache.get(3)", cache.get(3))// 返回  3
// console.log("cache.get(4)", cache.get(4))// 返回  4
```

### 6. 判断对象是否存在循环引用

循环引用对象本来没有什么问题，但是序列化的时候就会发生问题，比如调用JSON.stringify()对该类对象进行序列化，就会报错: `Converting circular structure to JSON.`

```js
const isCycleObject = (obj,parent) => {
    const parentArr = parent || [obj];
    for(let i in obj) {
        if(typeof obj[i] === 'object') {
            let flag = false;
            
            parentArr.forEach((pObj) => {
                if(pObj === obj[i]){
                    flag = true;
                }
            })
            if(flag) return true;
            flag = isCycleObject(obj[i],[...parentArr,obj[i]]);
            if(flag) return true;
        }
    }
    return false;
}


const a = 1;
const b = {a};
const c = {b};
const o = {d:{a:3},c}
o.c.b.aa = a;

console.log(isCycleObject(o))
```