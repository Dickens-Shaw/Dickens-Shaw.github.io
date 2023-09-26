# 异步编程

## 一、JS 异步机制

- **回调函数** 的方式，使用回调函数的方式有一个缺点是，多个回调函数嵌套的时候会造成回调函数地狱，上下两层的回调函数间的代码耦合度太高，不利于代码的可维护。
- **Promise** 的方式，使用 Promise 的方式可以将嵌套的回调函数作为链式调用。但是使用这种方法，有时会造成多个 then 的链式调用，可能会造成代码的语义不够明确。
- **generator** 的方式，它可以在函数的执行过程中，将函数的执行权转移出去，在函数外部还可以将执行权转移回来。当遇到异步函数执行的时候，将函数执行权转移出去，当异步函数执行完毕时再将执行权给转移回来。因此在 generator 内部对于异步操作的方式，可以以同步的顺序来书写。使用这种方式需要考虑的问题是何时将函数的控制权转移回来，因此需要有一个自动执行 generator 的机制，比如说 co 模块等方式来实现 generator 的自动执行。
- **async** 函数 的方式，async 函数是 generator 和 promise 实现的一个自动执行的语法糖，它内部自带执行器，当函数内部执行到一个 await 语句的时候，如果语句返回一个 promise 对象，那么函数将会等待 promise 对象的状态变为 resolve 后再继续向下执行。因此可以将异步逻辑，转化为同步的顺序来书写，并且这个函数可以自动执行。

## 二、Promise

Promise 是一个构造函数，接收一个函数作为参数，返回一个 Promise 实例。可以看成一个状态机，Promise 实例有三种状态，分别是`pending、resolved 和 rejected`，分别代表了进行中、已成功和已失败。实例的状态只能由 pending 转变 `resolved` 或者 `rejected` 状态，并且**状态一经改变，就无法再被改变了**。

状态的改变是通过 `resolve()` 和 `reject()` 函数来实现的，可以在异步操作结束后调用这两个函数改变 Promise 实例的状态，它的原型上定义了一个 `then` 方法，使用这个 `then` 方法可以为两个状态的改变注册回调函数。这个**回调函数属于微任务**，会在本轮事件循环的末尾执行。

注意：在构造 Promise 的时候，**构造函数内部的代码是立即执行的**。

**Promise 的特点：**

- 对象的状态不受外界影响。promise 对象代表一个异步操作，有三种状态，pending（进行中）、fulfilled（已成功）、rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态，这也是 promise 这个名字的由来——“**承诺**”；
- 一旦状态改变就不会再变，任何时候都可以得到这个结果。promise 对象的状态改变，只有两种可能：从 pending 变为 fulfilled，从 pending 变为 rejected。这时就称为 resolved（已定型）。如果改变已经发生了，你再对 promise 对象添加回调函数，也会立即得到这个结果。这与事件（event）完全不同，事件的特点是：如果你错过了它，再去监听是得不到结果的。

**Promise 的缺点：**

- 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
- 当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

### 1. resolve()

```js
MyPromise.resolve = function (value) {
  return new MyPromise(function (resolve) {
    resolve(value);
  });
};
```

### 2. reject()

```js
MyPromise.reject = function (error) {
  return new MyPromise(function (resolve, reject) {
    reject(error);
  });
};
```

### 3. then()

```js
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  return new MyPromise(function (resolve, reject) {
    this.resolve = function (value) {
      if (typeof onFulfilled === 'function') {
        try {
          var x = onFulfilled(value);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(value);
      }
    };
    this.reject = function (error) {
      if (typeof onRejected === 'function') {
        try {
          var x = onRejected(error);
          resolve(x);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(error);
      }
    };
  });
};
```

### 4. all()

返回一个 promise，在这个 promise 中给所有传入的 promise 的 then 方法中都注册上回调，回调成功了就把值放到结果数组中，所有回调都成功了就让返回的这个 promise 去 resolve，把结果数组返回出去

```js
MyPromise.all = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    let count = 0;
    let result = [];
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (value) {
          result[i] = value;
          count++;
          if (count === iterable.length) {
            resolve(result);
          }
        },
        function (error) {
          reject(error);
        }
      );
    }
  });
};
```

### 5. race()

race 和 all 大同小异，只不过它不会等所有 promise 都成功，而是谁快就把谁返回出去

```js
MyPromise.race = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (data) {
          resolve(data);
        },
        function (error) {
          reject(error);
        }
      );
    }
  });
};
```

#### 可用于取消 Promise

`Promise.race(iterable)`，当 iterable 参数里的任意一个子 promise 被成功或失败后，父 promise 马上也会用子 promise 的成功返回值或失败详情作为参数调用父 promise 绑定的相应句柄，并返回该 promise 对象。

```js
// 通过promise.race的特性，来进行promise的取消
function stopPromise(stopP) {
  let proObj = {};
  let promise = new Promise((resolve, reject) => {
    proObj.resolve = resolve;
    proObj.reject = reject;
  });
  proObj.promise = Promise.race([stopP, promise]);
  return proObj;
}
```

### 6. allSettled()

返回一个 promise，在这个 promise 中给所有传入的 promise 的 then 方法中都注册上回调，回调成功了就把值放到结果数组中，所有回调都成功了就让返回的这个 promise 去 resolve，把结果数组返回出去

```js
MyPromise.allSettled = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    let count = 0;
    let result = [];
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (value) {
          result[i] = {
            status: 'fulfilled',
            value: value,
          };
          count++;
          if (count === iterable.length) {
            resolve(result);
          }
        },
        function (error) {
          result[i] = {
            status: 'rejected',
            reason: error,
          };
          count++;
          if (count === iterable.length) {
            resolve(result);
          }
        }
      );
    }
  });
};
```

### 7. any()

返回一个 promise，只要有一个 promise 成功了，就把这个成功的值返回出去

```js
MyPromise.any = function (iterable) {
  return new MyPromise(function (resolve, reject) {
    let count = 0;
    let errs = [];
    for (let i = 0; i < iterable.length; i++) {
      iterable[i].then(
        function (value) {
          resolve(value);
        },
        function (error) {
          errs[i] = error;
          count++;
          if (count === iterable.length) {
            reject(new AggregateError(errs));
          }
        }
      );
    }
  });
};
```

## 三、Generator

> Generator 是 ES6 中新增的语法，和 Promise 一样，都可以用来异步编程

Generator 实现的核心在于`上下文的保存`，函数并没有真的被挂起，每一次 yield，其实都执行了一遍传入的`生成器函数`，只是在这个过程中间用了一个 context 对象储存上下文，使得每次执行生成器函数的时候，都可以从上一个执行结果开始执行，看起来就像函数被挂起了一样。

```js
// 使用 * 表示这是一个Generator函数
// 内部可以通过yield表达式来暂停执行
// 通过next方法来恢复执行
function* gen() {
  let a = 1 + 2;
  yield 2;
  yield 3;
}
let b = gen();
console.log(b.next()); // { value: 2, done: false }
console.log(b.next()); // { value: 3, done: false }
console.log(b.next()); // { value: undefined, done: true }
```

## 四、Async / Await

async 和 await 相比直接使用 Promise 来说，优势在于处理 then 的调用链，能够更清晰准确的写出代码。缺点在于滥用 await 可能会导致性能问题，因为 await 会阻塞代码，也许之后的异步代码并不依赖于前者，但仍然需要等待前者完成，导致代码失去了并发性。

错误处理友好，async/await 可以⽤成熟的`try/catch`，Promise 的错误捕获⾮常冗余

- 优点：代码清晰，不用像 Promise 写一大堆 then 链，处理了回调地狱的问题；
- 缺点：await 将异步代码改造成同步代码，如果多个异步操作没有依赖性而使用 await 会导致性能上的降低。

await 内部实现了 generator，其实 await 就是 `generator 加上 Promise 的语法糖`，且内部使用`co函数`实现了自动执行 generator

- **async：** async 定义的函数会默认的返回一个 Promise 对象 resolve 的值，因此对 async 函数可以直接进行 then 操作,返回的值即为 then 方法的传入函数
- **await：** 只能放在 async 函数内部。作用 就是获取 Promise 中返回的内容， 获取的是 Promise 函数中 resolve 或者 reject 的值。如果 await 后面并不是一个 Promise 的返回值，则会按照同步程序返回值处理

**注意**：`Promise.resolve(x)` 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。
