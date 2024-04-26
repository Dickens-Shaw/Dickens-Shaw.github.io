# 代码输出

涉及知识点：**异步编程、事件循环、this 指向、作用域、变量提升、闭包、原型、继承**等

::: details 点我查看输出

```js
console.log("Hello, VitePress!");
```

:::

## 异步&事件循环

### 1. 题一

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);
```

::: details 点我查看输出

```shell
1
2
4
```

promise.then 是微任务，它会在所有的宏任务执行完之后才会执行，同时需要 promise 内部的状态发生变化，因为这里内部没有发生变化，一直处于 pending 状态，所以不输出 3。

:::

### 2. 题二

```js
const promise1 = new Promise((resolve, reject) => {
  console.log("promise1");
  resolve("resolve1");
});
const promise2 = promise1.then((res) => {
  console.log(res);
});
console.log("1", promise1);
console.log("2", promise2);
```

::: details 点我查看输出

```shell {2,3}
promise1
1 Promise{<resolved>: resolve1}
2 Promise{<pending>}
resolve1
```

需要注意的是，直接打印 promise1，会打印出它的状态值和参数。

代码执行过程如下：

1. script 是一个宏任务，按照顺序执行这些代码；
2. 首先进入 Promise，执行该构造函数中的代码，打印 promise1；
3. 碰到 resolve 函数, 将 promise1 的状态改变为 resolved, 并将结果保存下来；
4. 碰到 promise1.then 这个微任务，将它放入微任务队列；
5. promise2 是一个新的状态为 pending 的 Promise；
6. 执行同步代码 1， 同时打印出 promise1 的状态是 resolved；
7. 执行同步代码 2，同时打印出 promise2 的状态是 pending；
8. 宏任务执行完毕，查找微任务队列，发现 promise1.then 这个微任务且状态为 resolved，执行它。

:::

### 3. 题三

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
```

::: details 点我查看输出

```shell
1
2
4
timerStart
timerEnd
success
```

代码执行过程如下：

- 首先遇到 Promise 构造函数，会先执行里面的内容，打印 1；
- 遇到定时器 steTimeout，它是一个宏任务，放入宏任务队列；
- 继续向下执行，打印出 2；
- 由于 Promise 的状态此时还是 pending，所以 promise.then 先不执行；
- 继续执行下面的同步任务，打印出 4；
- 此时微任务队列没有任务，继续执行下一轮宏任务，执行 steTimeout；
- 首先执行 timerStart，然后遇到了 resolve，将 promise 的状态改为 resolved 且保存结果并将之前的 promise.then 推入微任务队列，再执行 timerEnd；
- 执行完这个宏任务，就去执行微任务 promise.then，打印出 resolve 的结果。

:::

### 4. 题四

```js
Promise.resolve().then(() => {
  console.log("promise1");
  const timer2 = setTimeout(() => {
    console.log("timer2");
  }, 0);
});
const timer1 = setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(() => {
    console.log("promise2");
  });
}, 0);
console.log("start");
```

::: details 点我查看输出

```shell
start
promise1
timer1
promise2
timer2
```

代码执行过程如下：

1. 首先，Promise.resolve().then 是一个微任务，加入微任务队列
2. 执行 timer1，它是一个宏任务，加入宏任务队列
3. 继续执行下面的同步代码，打印出 start
4. 这样第一轮宏任务就执行完了，开始执行微任务 Promise.resolve().then，打印出 promise1
5. 遇到 timer2，它是一个宏任务，将其加入宏任务队列，此时宏任务队列有两个任务，分别是 timer1、timer2；
6. 这样第一轮微任务就执行完了，开始执行第二轮宏任务，首先执行定时器 timer1，打印 timer1；
7. 遇到 Promise.resolve().then，它是一个微任务，加入微任务队列
8. 开始执行微任务队列中的任务，打印 promise2；
9. 最后执行宏任务 timer2 定时器，打印出 timer2；

:::

### 5. 题五

```js
const promise = new Promise((resolve, reject) => {
  resolve("success1");
  reject("error");
  resolve("success2");
});
promise
  .then((res) => {
    console.log("then:", res);
  })
  .catch((err) => {
    console.log("catch:", err);
  });
```

::: details 点我查看输出

```shell
then: success1
```

这个题目考察的就是`Promise的状态在发生变化之后，就不会再发生变化`。开始状态由 pending 变为 resolve，说明已经变为已完成状态，下面的两个状态的就不会再执行，同时下面的 catch 也不会捕获到错误。

:::

### 6. 题六

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
```

::: details 点我查看输出

```shell {2}
1
Promise {<fulfilled>: undefined}
```

Promise.resolve 方法的参数如果是一个原始值，或者是一个不具有 then 方法的对象，则 Promise.resolve 方法返回一个新的 Promise 对象，状态为 resolved，Promise.resolve 方法的参数，会同时传给回调函数。

then 方法接受的参数是函数，而如果传递的并非是一个函数，它实际上会将其解释为 then(null)，这就会导致前一个 Promise 的结果会传递下面。

:::

### 7. 题七

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);
```

::: details 点我查看输出

```shell {1,2,4-6}
promise1 Promise {<pending>}
promise2 Promise {<pending>}

Uncaught (in promise) Error: error!!!
promise1 Promise {<fulfilled>: "success"}
promise2 Promise {<rejected>: Error: error!!}
```

:::

### 8. 题八

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res);
    return 2;
  })
  .catch((err) => {
    return 3;
  })
  .then((res) => {
    console.log(res);
  });
```

::: details 点我查看输出

```shell
1
2
```

Promise 是可以链式调用的，由于每次调用 .then 或者 .catch 都会返回一个新的 promise，从而实现了链式调用, 它并不像一般任务的链式调用一样 return this。

上面的输出结果之所以依次打印出 1 和 2，是因为 resolve(1)之后走的是第一个 then 方法，并没有进 catch 里，所以第二个 then 中的 res 得到的实际上是第一个 then 的返回值。并且 return 2 会被包装成 resolve(2)，被最后的 then 打印输出 2。

:::

### 9. 题九

```js
Promise.resolve()
  .then(() => {
    return new Error("error!!!");
  })
  .then((res) => {
    console.log("then: ", res);
  })
  .catch((err) => {
    console.log("catch: ", err);
  });
```

::: details 点我查看输出

```shell {1}
"then: " "Error: error!!!"
```

返回任意一个非 promise 的值都会被包裹成 promise 对象，因此这里的 return new Error('error!!!')也被包裹成了 return Promise.resolve(new Error('error!!!'))，因此它会被 then 捕获而不是 catch。

:::

### 10. 题十

```js
const promise = Promise.resolve().then(() => {
  return promise;
});
promise.catch(console.err);
```

::: details 点我查看输出

```shell {1}
Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```

.then 或 .catch 返回的值不能是 promise 本身，否则会造成死循环。

:::
