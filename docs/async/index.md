## 并发 Concurrency

> 宏观概念，我分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发

## 并行 Parallelism

> 微观概念，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行

## 回调函数 Callback

缺点：

1. 回调函数有一个致命的弱点，就是容易写出`回调地狱(Callback hell)`：

   - 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
   - 嵌套函数一多，就很难处理错误

2. 不能使用 `try catch` 捕获错误
3. 不能直接 `return`

## Promise

- 实现原理：

可以把 Promise 看成一个状态机。初始是 `pending` 状态，可以通过函数 `resolve` 和 `reject` ，将状态转变为 `resolved` 或者 `rejected` 状态，状态一旦改变就不能再次变化。

then 函数会返回一个 Promise 实例，并且该返回值是一个`新的实例`而不是之前的实例。因为 Promise 规范规定除了 pending 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 then 调用就失去意义了。

在传统的异步编程中，如果异步之间存在依赖关系，我们就需要通过层层嵌套回调来满足这种依赖，如果嵌套层数过多，可读性和可维护性都变得很差，产生所谓“回调地狱”，而 Promise 将回调嵌套改为`链式调用`，增加可读性和可维护性

优点：解决了回调地狱的问题

缺点：`无法取消` Promise ，错误需要通过回调函数来捕获

- Promise.resolve

```js
MyPromise.resolve = function (value) {
  return new MyPromise(function (resolve) {
    resolve(value)
  })
}
```

- Promise.reject

```js
MyPromise.reject = function (error) {
  return new MyPromise(function (resolve, reject) {
    reject(error)
  })
}
```

- Promise.then

```js
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  return new MyPromise(function (resolve, reject) {
    this.resolve = function (value) {
      if (typeof onFulfilled === 'function') {
        try {
          var x = onFulfilled(value)
          resolve(x)
        } catch (e) {
          reject(e)
        }
      } else {
        resolve(value)
      }
    }
    this.reject = function (error) {
      if (typeof onRejected === 'function') {
        try {
          var x = onRejected(error)
          resolve(x)
        } catch (e) {
          reject(e)
        }
      } else {
        reject(error)
      }
    }
  })
}
```

- Promise.all

  - 原理：返回一个 promise，在这个 promise 中给所有传入的 promise 的 then 方法中都注册上回调，回调成功了就把值放到结果数组中，所有回调都成功了就让返回的这个 promise 去 resolve，把结果数组返回出去

  - 手撕

```js
MyPromise.all = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    let count = 0
    let result = []
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (value) {
          result[i] = value
          count++
          if (count === iterable.length) {
            resolve(result)
          }
        },
        function (error) {
          reject(error)
        }
      )
    }
  })
}
```

- Promise.race

  - 原理：race 和 all 大同小异，只不过它不会等所有 promise 都成功，而是谁快就把谁返回出去

  - 手撕

```js
MyPromise.race = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (data) {
          resolve(data)
        },
        function (error) {
          reject(error)
        }
      )
    }
  })
}
```

- Promise.allSettled

  - 原理：返回一个 promise，在这个 promise 中给所有传入的 promise 的 then 方法中都注册上回调，回调成功了就把值放到结果数组中，所有回调都成功了就让返回的这个 promise 去 resolve，把结果数组返回出去

  - 手撕

```js
MyPromise.allSettled = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    let count = 0
    let result = []
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (value) {
          result[i] = {
            status: 'fulfilled',
            value: value,
          }
          count++
          if (count === iterable.length) {
            resolve(result)
          }
        },
        function (error) {
          result[i] = {
            status: 'rejected',
            reason: error,
          }
          count++
          if (count === iterable.length) {
            resolve(result)
          }
        }
      )
    }
  })
}
```

- Promise.any

- 取消 Promise

`Promise.race(iterable)`，当 iterable 参数里的任意一个子 promise 被成功或失败后，父 promise 马上也会用子 promise 的成功返回值或失败详情作为参数调用父 promise 绑定的相应句柄，并返回该 promise 对象。

```js
// 通过promise.race的特性，来进行promise的取消
function stopPromise(stopP) {
  let proObj = {}
  let promise = new Promise((resolve, reject) => {
    proObj.resolve = resolve
    proObj.reject = reject
  })
  proObj.promise = Promise.race([stopP, promise])
  return proObj
}
```

## Generator

> Generator 是 ES6 中新增的语法，和 Promise 一样，都可以用来异步编程

Generator 实现的核心在于`上下文的保存`，函数并没有真的被挂起，每一次 yield，其实都执行了一遍传入的`生成器函数`，只是在这个过程中间用了一个 context 对象储存上下文，使得每次执行生成器函数的时候，都可以从上一个执行结果开始执行，看起来就像函数被挂起了一样。

```js
// 使用 * 表示这是一个Generator函数
// 内部可以通过yield表达式来暂停执行
// 通过next方法来恢复执行
function* gen() {
  let a = 1 + 2
  yield 2
  yield 3
}
let b = gen()
console.log(b.next()) // { value: 2, done: false }
console.log(b.next()) // { value: 3, done: false }
console.log(b.next()) // { value: undefined, done: true }
```

## async/await

async 和 await 相比直接使用 Promise 来说，优势在于处理 then 的调用链，能够更清晰准确的写出代码。缺点在于滥用 await 可能会导致性能问题，因为 await 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。

- 优点：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题；
- 缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

await 内部实现了 generator，其实 await 就是 `generator 加上 Promise 的语法糖`，且内部使用`co函数`实现了自动执行 generator

- async 是一个修饰符，async 定义的函数会默认的返回一个 Promise 对象 resolve 的值，因此对 async 函数可以直接进行 then 操作,返回的值即为 then 方法的传入函数
- await 也是一个修饰符，只能放在 async 函数内部。作用 就是获取 Promise 中返回的内容， 获取的是 Promise 函数中 resolve 或者 reject 的值。如果 await 后面并不是一个 Promise 的返回值，则会按照同步程序返回值处理
