# 代码输出

涉及知识点：**异步编程、事件循环、this 指向、作用域、变量提升、闭包、原型、继承**等

::: details 点我查看输出

```js
console.log("Hello, VitePress!");
```

:::

## 一、异步&事件循环

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

### 11. 题十一

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
```

::: details 点我查看输出

```shell
1
```

`.then` 或 `.catch` 的参数期望是函数，传入非函数则会发生值透传。

第一个 then 和第二个 then 中传入的都不是函数，一个是数字，一个是对象，因此发生了透传，将 resolve(1) 的值直接传到最后一个 then 里，直接打印出 1

:::

### 12. 题十二

```js
Promise.reject("err!!!")
  .then(
    (res) => {
      console.log("success", res);
    },
    (err) => {
      console.log("error", err);
    }
  )
  .catch((err) => {
    console.log("catch", err);
  });
```

::: details 点我查看输出

```shell
error err!!!
```

`.then` 函数中的两个参数：

- 第一个参数是用来处理 Promise 成功的函数
- 第二个则是处理失败的函数

也就是说 `Promise.resolve('1')` 的值会进入成功的函数，`Promise.reject('2')` 的值会进入失败的函数。

在这道题中，错误直接被 then 的第二个参数捕获了，所以就不会被 catch 捕获了，输出结果为：`error err!!!`

:::

### 13. 题十三

```js
Promise.resolve("1")
  .then((res) => {
    console.log(res);
  })
  .finally(() => {
    console.log("finally");
  });
Promise.resolve("2")
  .finally(() => {
    console.log("finally2");
    return "我是finally2返回的值";
  })
  .then((res) => {
    console.log("finally2后面的then函数", res);
  });
```

::: details 点我查看输出

```shell
1
finally
finally2
finally2后面的then函数 我是finally2返回的值
```

`.finally()` 一般用的很少，只要记住以下几点就可以了：

- .finally() 方法不管 Promise 对象最后的状态如何都会执行
- .finally() 方法的回调函数不接受任何的参数，也就是说你在 .finally() 函数中是无法知道 Promise 最终的状态是 resolved 还是 rejected 的
- 它最终返回的默认会是一个上一次的 Promise 对象值，不过如果抛出的是一个异常则返回异常的 Promise 对象。
- finally 本质上是 then 方法的特例

finally 会在 Promise 结束时调用，无论结果是成功还是失败，它都会执行。并且 finally 会将值传递给下一个 then 方法。

:::

### 14. 题十四

```js
function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}

Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then((res) =>
  console.log(res)
);
```

::: details 点我查看输出

```shell
1
2
3
[1, 2, 3]
```

首先，定义了一个 Promise，来异步执行函数 runAsync，该函数传入一个值 x，然后间隔一秒后打印出这个 x。

之后再使用 `Promise.all` 来执行这个函数，执行的时候，看到一秒之后输出了 1，2，3，同时输出了数组[1, 2, 3]，三个函数是同步执行的，并且在一个回调函数中返回了所有的结果。并且结果和函数的执行顺序是一致的。

:::

### 15. 题十五

```js
function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) =>
    setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
  );
  return p;
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
```

::: details 点我查看输出

```shell
// 1s后输出
1
3
// 2s后输出
2
Error: 2
// 4s后输出
4
```

catch 捕获到了第一个错误，在这道题目中最先的错误就是 `runReject(2)` 的结果。如果一组异步操作中有一个异常都不会进入 .then() 的第一个回调函数参数中。会被 .then() 的第二个回调函数捕获

:::

### 16. 题十六

```js
function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
  .then((res) => console.log("result: ", res))
  .catch((err) => console.log(err));
```

::: details 点我查看输出

```shell
1
'result: ' 1
2
3
```

then 只会捕获第一个成功的方法，其他的函数虽然还会继续执行，但是不是被 then 捕获了

:::

### 17. 题十七

```js
function runAsync(x) {
  const p = new Promise((r) => setTimeout(() => r(x, console.log(x)), 1000));
  return p;
}
function runReject(x) {
  const p = new Promise((res, rej) =>
    setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
  );
  return p;
}
Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
  .then((res) => console.log("result: ", res))
  .catch((err) => console.log(err));
```

::: details 点我查看输出

```shell
0
Error: 0
1
2
3
```

在 catch 捕获到第一个错误之后，后面的代码还不执行，不过不会再被捕获了。

注意：all 和 race 传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被 then 的第二个参数或者后面的 catch 捕获；但并不会影响数组中其它的异步任务的执行。

:::

### 18. 题十八

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}
async1();
console.log("start");
```

::: details 点我查看输出

```shell
async1 start
async2
start
async1 end
```

代码的执行过程如下：

1. 首先执行函数中的同步代码 async1 start，之后遇到了 await，它会阻塞 async1 后面代码的执行，因此会先去执行 async2 中的同步代码 async2，然后跳出 async1；
2. 跳出 async1 函数后，执行同步代码 start；
3. 在一轮宏任务全部执行完之后，再来执行 await 后面的内容 async1 end。

这里可以理解为 await 后面的语句相当于放到了 `new Promise` 中，下一行及之后的语句相当于放在 `Promise.then` 中。

:::

### 19. 题十九

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
  setTimeout(() => {
    console.log("timer1");
  }, 0);
}
async function async2() {
  setTimeout(() => {
    console.log("timer2");
  }, 0);
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log("timer3");
}, 0);
console.log("start");
```

::: details 点我查看输出

```shell
async1 start
async2
start
async1 end
timer2
timer3
timer1
```

代码的执行过程如下：

1. 首先进入 async1，打印出 async1 start；
2. 之后遇到 async2，进入 async2，遇到定时器 timer2，加入宏任务队列，之后打印 async2；
3. 由于 async2 阻塞了后面代码的执行，所以执行后面的定时器 timer3，将其加入宏任务队列，之后打印 start；
4. 然后执行 async2 后面的代码，打印出 async1 end，遇到定时器 timer1，将其加入宏任务队列；
5. 最后，宏任务队列有三个任务，先后顺序为 timer2，timer3，timer1，没有微任务，所以直接所有的宏任务按照先进先出的原则执行。

:::

### 20. 题二十

```js
async function async1() {
  console.log("async1 start");
  await new Promise((resolve) => {
    console.log("promise1");
  });
  console.log("async1 success");
  return "async1 end";
}
console.log("script start");
async1().then((res) => console.log(res));
console.log("script end");
```

::: details 点我查看输出

```shell
script start
async1 start
promise1
script end
```

在 async1 中 await 后面的 Promise 是没有返回值的，也就是它的状态始终是 pending 状态，所以在 await 之后的内容是不会执行的，包括 async1 后面的 .then。

:::

### 21. 题二十一

```js
async function async1() {
  console.log("async1 start");
  await new Promise((resolve) => {
    console.log("promise1");
    resolve("promise1 resolve");
  }).then((res) => console.log(res));
  console.log("async1 success");
  return "async1 end";
}
console.log("script start");
async1().then((res) => console.log(res));
console.log("script end");
```

::: details 点我查看输出

```shell
script start
async1 start
promise1
script end
promise1 resolve
async1 success
async1 end
```

对上面一题进行了改造，加上了 resolve。

:::

### 22. 题二十二

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise((resolve) => {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
```

::: details 点我查看输出

```shell
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
```

代码执行过程如下：

1. 开头定义了 async1 和 async2 两个函数，但是并未执行，执行 script 中的代码，所以打印出 script start；
2. 遇到定时器 setTimeout，它是一个宏任务，将其加入到宏任务队列；
3. 之后执行函数 async1，首先打印出 async1 start；
4. 遇到 await，执行 async2，打印出 async2，并阻断后面代码的执行，将后面的代码加入到微任务队列；
5. 然后跳出 async1 和 async2，遇到 Promise，打印出 promise1；
6. 遇到 resolve，将其加入到微任务队列，然后执行后面的 script 代码，打印出 script end；
7. 之后就该执行微任务队列了，首先打印出 async1 end，然后打印出 promise2；
8. 执行完微任务队列，就开始执行宏任务队列中的定时器，打印出 setTimeout。

:::

### 23. 题二十三

```js
async function async1() {
  await async2();
  console.log("async1");
  return "async1 success";
}
async function async2() {
  return new Promise((resolve, reject) => {
    console.log("async2");
    reject("error");
  });
}
async1().then((res) => console.log(res));
```

::: details 点我查看输出

```shell {2}
async2
Uncaught (in promise) error
```

如果 async 函数中抛出了错误，就会终止错误结果，不会继续向下执行。想要让错误后面的代码执行，可以使用 catch 来捕获。

:::

### 24. 题二十四

```js
const first = () =>
  new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
      console.log(7);
      setTimeout(() => {
        console.log(5);
        resolve(6);
        console.log(p);
      }, 0);
      resolve(1);
    });
    resolve(2);
    p.then((arg) => {
      console.log(arg);
    });
  });
first().then((arg) => {
  console.log(arg);
});
console.log(4);
```

::: details 点我查看输出

```shell {7}
3
7
4
1
2
5
Promise{<resolved>: 1}
```

代码的执行过程如下：

1. 首先会进入 Promise，打印出 3，之后进入下面的 Promise，打印出 7；
2. 遇到了定时器，将其加入宏任务队列；
3. 执行 Promise p 中的 resolve，状态变为 resolved，返回值为 1；
4. 执行 Promise first 中的 resolve，状态变为 resolved，返回值为 2；
5. 遇到 p.then，将其加入微任务队列，遇到 first().then，将其加入任务队列；
6. 执行外面的代码，打印出 4；
7. 这样第一轮宏任务就执行完了，开始执行微任务队列中的任务，先后打印出 1 和 2；
8. 这样微任务就执行完了，开始执行下一轮宏任务，宏任务队列中有一个定时器，执行它，打印出 5，由于执行已经变为 resolved 状态，所以`resolve(6)`不会再执行；
9. 最后`console.log(p)`打印出 `Promise{<resolved>: 1}；`

:::

### 25. 题二十五

```js
const async1 = async () => {
  console.log("async1");
  setTimeout(() => {
    console.log("timer1");
  }, 2000);
  await new Promise((resolve) => {
    console.log("promise1");
  });
  console.log("async1 end");
  return "async1 success";
};
console.log("script start");
async1().then((res) => console.log(res));
console.log("script end");
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then((res) => console.log(res));
setTimeout(() => {
  console.log("timer2");
}, 1000);
```

::: details 点我查看输出

```shell
script start
async1
promise1
script end
1
timer2
timer1
```

代码的执行过程如下：

1. 首先执行同步带吗，打印出 script start；
2. 遇到定时器 timer1 将其加入宏任务队列；
3. 之后是执行 Promise，打印出 promise1，由于 Promise 没有返回值，所以后面的代码不会执行；
4. 然后执行同步代码，打印出 script end；
5. 继续执行下面的 Promise，.then 和.catch 期望参数是一个函数，这里传入的是一个数字，因此就会发生值渗透，将 resolve(1)的值传到最后一个 then，直接打印出 1；
6. 遇到第二个定时器，将其加入到微任务队列，执行微任务队列，按顺序依次执行两个定时器，但是由于定时器时间的原因，会在两秒后先打印出 timer2，在四秒后打印出 timer1

:::

### 26. 题二十六

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("resolve3");
    console.log("timer1");
  }, 0);
  resolve("resovle1");
  resolve("resolve2");
})
  .then((res) => {
    console.log(res); // resolve1
    setTimeout(() => {
      console.log(p1);
    }, 1000);
  })
  .finally((res) => {
    console.log("finally", res);
  });
```

::: details 点我查看输出

```shell
resolve1
finally undefined
timer1
Promise{<resolved>: undefined}
```

需要注意的是最后一个定时器打印出的 p1 其实是.finally 的返回值，我们知道.finally 的返回值如果在没有抛出错误的情况下默认会是上一个 Promise 的返回值，而这道题中.finally 上一个 Promise 是.then()，但是这个.then()并没有返回值，所以 p1 打印出来的 Promise 的值会是 undefined，如果在定时器的下面加上一个 return 1，则值就会变成 1。

:::

### 27. 题二十七

```js
console.log("1");

setTimeout(function () {
  console.log("2");
  process.nextTick(function () {
    console.log("3");
  });
  new Promise(function (resolve) {
    console.log("4");
    resolve();
  }).then(function () {
    console.log("5");
  });
});
process.nextTick(function () {
  console.log("6");
});
new Promise(function (resolve) {
  console.log("7");
  resolve();
}).then(function () {
  console.log("8");
});

setTimeout(function () {
  console.log("9");
  process.nextTick(function () {
    console.log("10");
  });
  new Promise(function (resolve) {
    console.log("11");
    resolve();
  }).then(function () {
    console.log("12");
  });
});
```

::: details 点我查看输出

```shell
1
7
6
8
2
4
3
5
9
11
10
12
```

事件循环流程分析如下：

- 整体 script 作为第一个宏任务进入主线程，遇到 console.log，输出 1。
- 遇到 setTimeout，其回调函数被分发到宏任务 Event Queue 中。暂且记为 setTimeout1。
- 遇到 process.nextTick()，其回调函数被分发到微任务 Event Queue 中。记为 process1。
- 遇到 Promise，new Promise 直接执行，输出 7。then 被分发到微任务 Event Queue 中。记为 then1。
- 又遇到了 setTimeout，其回调函数被分发到宏任务 Event Queue 中，记为 setTimeout2
- setTimeout1 和 setTimeout 内容一样，不再赘述

:::

### 28. 题二十八

```js
console.log(1);

setTimeout(() => {
  console.log(2);
});

new Promise((resolve) => {
  console.log(3);
  resolve(4);
}).then((d) => console.log(d));

setTimeout(() => {
  console.log(5);
  new Promise((resolve) => {
    resolve(6);
  }).then((d) => console.log(d));
});

setTimeout(() => {
  console.log(7);
});

console.log(8);
```

::: details 点我查看输出

```shell
1
3
8
4
2
5
6
7
```

代码执行过程如下：

1. 首先执行 script 代码，打印出 1；
2. 遇到第一个定时器，加入到宏任务队列；
3. 遇到 Promise，执行代码，打印出 3，遇到 resolve，将其加入到微任务队列；
4. 遇到第二个定时器，加入到宏任务队列；
5. 遇到第三个定时器，加入到宏任务队列；
6. 继续执行 script 代码，打印出 8，第一轮执行结束；
7. 执行微任务队列，打印出第一个 Promise 的 resolve 结果：4；
8. 开始执行宏任务队列，执行第一个定时器，打印出 2；
9. 此时没有微任务，继续执行宏任务中的第二个定时器，首先打印出 5，遇到 Promise，首选打印出 6，遇到 resolve，将其加入到微任务队列；
10. 执行微任务队列，打印出 6；
11. 执行宏任务队列中的最后一个定时器，打印出 7

:::

### 29. 题二十九

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
  });
});

new Promise((resolve, reject) => {
  console.log(4);
  resolve(5);
}).then((data) => {
  console.log(data);
});

setTimeout(() => {
  console.log(6);
});

console.log(7);
```

::: details 点我查看输出

```shell
1
4
7
5
2
3
6
```

代码执行过程如下：

1. 首先执行 scrip 代码，打印出 1；
2. 遇到第一个定时器 setTimeout，将其加入到宏任务队列；
3. 遇到 Promise，执行里面的同步代码，打印出 4，遇到 resolve，将其加入到微任务队列；
4. 遇到第二个定时器 setTimeout，将其加入到红任务队列；
5. 执行 script 代码，打印出 7，至此第一轮执行完成；
6. 指定微任务队列中的代码，打印出 resolve 的结果：5；
7. 执行宏任务中的第一个定时器 setTimeout，首先打印出 2，然后遇到 Promise.resolve().then()，将其加入到微任务队列；
8. 执行完这个宏任务，就开始执行微任务队列，打印出 3；
9. 继续执行宏任务队列中的第二个定时器，打印出 6

:::

### 30. 题三十

```js
Promise.resolve()
  .then(() => {
    console.log("1");
    throw "Error";
  })
  .then(() => {
    console.log("2");
  })
  .catch(() => {
    console.log("3");
    throw "Error";
  })
  .then(() => {
    console.log("4");
  })
  .catch(() => {
    console.log("5");
  })
  .then(() => {
    console.log("6");
  });
```

::: details 点我查看输出

```shell
1
3
5
6
```

无论是 then 还是 catch 中，只要 throw 抛出了错误，就会被 catch 捕获，如果没有 throw 出错误，就被继续执行后面的 then。

:::

### 31. 题三十一

```js
setTimeout(function () {
  console.log(1);
}, 100);

new Promise(function (resolve) {
  console.log(2);
  resolve();
  console.log(3);
}).then(function () {
  console.log(4);
  new Promise((resove, reject) => {
    console.log(5);
    setTimeout(() =>  {
      console.log(6);
    }, 10);
  })
});
console.log(7);
console.log(8);
```

::: details 点我查看输出

```shell
2
3
7
8
4
5
6
1
```

代码执行过程如下：

1. 首先遇到定时器，将其加入到宏任务队列；
2. 遇到Promise，首先执行里面的同步代码，打印出2，遇到resolve，将其加入到微任务队列，执行后面同步代码，打印出3；
3. 继续执行script中的代码，打印出7和8，至此第一轮代码执行完成；
4. 执行微任务队列中的代码，首先打印出4，如遇到Promise，执行其中的同步代码，打印出5，遇到定时器，将其加入到宏任务队列中，此时宏任务队列中有两个定时器；
5. 执行宏任务队列中的代码，这里我们需要注意是的第一个定时器的时间为100ms，第二个定时器的时间为10ms，所以先执行第二个定时器，打印出6；
6. 此时微任务队列为空，继续执行宏任务队列，打印出1

:::
