# 微前端

## 概念

微前端架构是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将 Web 应用由单一的单体应用转变为**多个小型前端应用聚合为一的应用**。

由此带来的变化是，这些前端应用可以**独立运行、独立开发、独立部署**。以及，它们应该可以在**共享组件**的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 等来管理。

微前端是一种架构风格，将众多独立交付的前端应用组合成一个大型整体。

_* 一些微前端实现可能导致重复依赖，使用户不得不下载更多内容。此外，大幅提升的团队自治水平可能会让各个团队的工作愈加分裂。只不过我们认为这些风险都能控制在合理水平上，微前端终究还是利大于弊的。_

## 解决方案

- [single-spa](https://single-spa.js.org/) 在官网中被自称是一个元框架，可以实现在一个页面将多个不同的框架整合。很多微前端方案基于此进行二次开发或者是灵感来源，支持 esm
- [qiankun](https://qiankun.umijs.org/zh) 基于 `single-spa` 的微前端解决方案,生产可用
- [icestark](https://micro-frontends.ice.work/) 面向大型应用的微前端解决方案
- [MicroApp](https://cangdu.org/micro-app/) 一种用于构建微前端应用的极简方案，支持 esm（需要关闭沙箱）
- [Garfish](https://garfish.top/) 包含构建微前端系统时所需要的基本能力，任意前端框架均可使用。接入简单，可轻松将多个前端应用组合成内聚的单个产品。沙箱隔离机制更完善
- [emp](https://github.com/efoxTeam/emp) 基于`Webpack5 Module Federation`搭建的微前端解决方案

> 若无特殊要求，建议使用当前使用人数最多的方案 **qiankun** ；
> 
> 如果要求沙箱机制更完善可以尝试 **Garfish** ；
>
> 若没有类似于后台需要标签切换保存状态的需求，可以尝试 **MicroApp** ；
>
> 若微应用是第三方开发、部署，无法要求设置跨域，建议使用 **icestark** ；
>
> 不怕麻烦使用 **single-spa** ，什么都支持。

## single-spa

在 single-spa 中，通过 reroute 和路由控制不断地在调度子应用，加载子应用的代码，切换子应用，改变子应用的 app.status。

所以 single-spa 解决了一个子应用之间的调度问题。

但是 single-spa 的加载函数 registerApplication 是需要用户自己去实现的，它的作用就是告诉 single-spa 需要如何去加载子应用的代码，同时让主应用获取到子应用的生命周期函数，这个地方的书写难度是比较高的

## Qiankun

qiankun 的编写是基于 single-spa 和 import-ht ml-entry 两个库。

single-spa 帮住 qiankun 如何调度子应用，import-html-entry 提供了一种 window.fetch 方案去加载子应用的代码

qiankun 这个微前端框架，就是帮助我们更加高效地使用 single-spa。直接帮住用户解决了一个子应用代码加载的问题

整个 qiankun 框架中我们知道了什么东西：

1. qiankun 是如何完善 single-spa 中留下的巨大缺口-————加载函数。
2. qiankun 通过什么策略去加载子应用资源————window.fetch。
3. qiankun 如何隔离子应用的 js 的全局环境————通过沙箱。
4. 沙箱的隔离原理是什么————在支持 proxy 中有一个代理对象，子应用优先访问到了代理对象，如果代理对象没有的值再从 window 中获取。如果不支持 proxy，那么通过快照，缓存，复原的形式解决污染问题。
5. qiankun 如何隔离 css 环境————shadowDOM 隔离；加上选择器隔离。
6. qiankun 如何获得子应用生命周期函数————export 存储在对象中，然后解构出来。
7. qiankun 如何该改变子应用的 window 环境————通过立即执行函数，传入 window.proxy 为参数，改变 window 环境。

流程：

- 主应用：

1. 安装 qiankun
2. 在主应用中注册微应用 registerMicroApps()，执行 start()
3. 也可以手动加载微应用 loadMicroApp()

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子

- 微应用：(不需要安装依赖)

1. 导出相应的生命周期钩子

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 、update(可选)四个生命周期钩子，以供主应用在适当的时机调用

```js
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */ export async function bootstrap() {
  console.log('react app bootstraped')
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */ export async function mount(props) {
  ReactDOM.render(
    <App />,
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root')
  )
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */ export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container
      ? props.container.querySelector('#root')
      : document.getElementById('root')
  )
}
/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */ export async function update(props) {
  console.log('update props', props)
}
```

2. 配置微应用的打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置

```js
const packageName = require('./package.json').name
module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
}

// 判断是独立运行还是在qiankun中加载
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
router = new VueRouter({
  base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
  mode: 'history',
  routes,
})
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}
```
