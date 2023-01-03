# 大前端

## H5

### JS-Bridge

### React Native

### Uni-app

### Taro

## PC

### Electron

### Tauri

## Node

### koa、express 区别

- Handler 处理方式

  - Express 使用普通的回调函数，一种线性的逻辑，在同一个线程上完成所有的 HTTP 请求
  - Koa2 这个现在是 Koa 的默认版本，与 Koa1 最大的区别是使用 ES7 的 Async/Await 替换了原来的 Generator + co 的模式，也无需引入第三方库，底层原生支持，Async/Await 现在也称为 JS 异步的终极解决方案

- 中间件

  - Express 中间件实现是基于 Callback 回调函数同步的，它不会去等待异步（Promise）完成
  - Koa 的中间件机制中使用 Async/Await（背后全是 Promise）通过 next 来驱动以同步的方式来管理异步代码，它则可以等待异步操作（洋葱模型）

- 响应机制
  - 在 Express 中我们直接操作的是 res 对象，res.send() 之后就立即响应了，无法在上层中间件做操作
  - Koa 中数据的响应是通过 ctx.body 进行设置，注意这里仅是设置并没有立即响应，而是在所有的中间件结束之后做了响应