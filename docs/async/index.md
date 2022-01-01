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
MyPromise.resolve = function(value) {
    return new MyPromise(function(resolve) {
        resolve(value);
    });
}
```

- Promise.reject

```js
MyPromise.reject = function(error) {
    return new MyPromise(function(resolve, reject) {
        reject(error);
    });
}
```

- Promise.prototype.then

  -

```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    return new MyPromise(function(resolve, reject) {
        this.resolve = function(value) {
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
        }
        this.reject = function(error) {
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
        }
    });
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

  - 原理：race和all大同小异，只不过它不会等所有promise都成功，而是谁快就把谁返回出去

  - 手撕

```js
MyPromise.race = function(iterable) {
    return new MyPromise(function(resolve, reject) {
        for (let i = 0; i < iterable.length; i++) {
            iterable[i].then(function(data) {
                resolve(data);
            }, function(error) {
                reject(error);
            });
        }
    });
}
```

- Promise.allSettled

  - 原理：返回一个 promise，在这个 promise 中给所有传入的 promise 的 then 方法中都注册上回调，回调成功了就把值放到结果数组中，所有回调都成功了就让返回的这个 promise 去 resolve，把结果数组返回出去

  - 手撕

```js
MyPromise.allSettled = function(iterable) {
    return new MyPromise(function(resolve, reject) {
        let count = 0
        let result = []
        for (let i = 0; i < iterable.length; i++) {
            iterable[i].then(
                function (value) {
                    result[i] = {
                        status: 'fulfilled',
                        value: value
                    }
                    count++
                    if (count === iterable.length) {
                        resolve(result)
                    }
                },
                function (error) {
                    result[i] = {
                        status: 'rejected',
                        reason: error
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
