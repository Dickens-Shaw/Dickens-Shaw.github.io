## Iframe
> iframe 元素会创建包含另外一个文档的内联框架（即行内框架）。

- 优点：
  - 用来加载速度较慢的内容（如广告）
  - 可以使脚本可以并行下载
  - 可以实现跨子域通信

- 缺点：
  - iframe 会阻塞主页面的 onload 事件
  - 无法被一些搜索引擎索识别
  - 会产生很多页面，不容易管理

## single-spa
在single-spa中，通过reroute和路由控制不断地在调度子应用，加载子应用的代码，切换子应用，改变子应用的app.status。

所以single-spa解决了一个子应用之间的调度问题。

但是single-spa的加载函数registerApplication是需要用户自己去实现的，它的作用就是告诉single-spa需要如何去加载子应用的代码，同时让主应用获取到子应用的生命周期函数，这个地方的书写难度是比较高的

## Qiankun
qiankun的编写是基于single-spa和import-ht ml-entry两个库。

single-spa帮住qiankun如何调度子应用，import-html-entry提供了一种window.fetch方案去加载子应用的代码

qiankun这个微前端框架，就是帮助我们更加高效地使用single-spa。直接帮住用户解决了一个子应用代码加载的问题

整个qiankun框架中我们知道了什么东西：
1. qiankun是如何完善single-spa中留下的巨大缺口-————加载函数。
2. qiankun通过什么策略去加载子应用资源————window.fetch。
3. qiankun如何隔离子应用的js的全局环境————通过沙箱。
4. 沙箱的隔离原理是什么————在支持proxy中有一个代理对象，子应用优先访问到了代理对象，如果代理对象没有的值再从window中获取。如果不支持proxy，那么通过快照，缓存，复原的形式解决污染问题。
5. qiankun如何隔离css环境————shadowDOM隔离；加上选择器隔离。
6. qiankun如何获得子应用生命周期函数————export 存储在对象中，然后解构出来。
7. qiankun如何该改变子应用的window环境————通过立即执行函数，传入window.proxy为参数，改变window环境。

流程：

- 主应用：
1. 安装qiankun
2. 在主应用中注册微应用registerMicroApps()，执行start()
3. 也可以手动加载微应用loadMicroApp()

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子

- 微应用：(不需要安装依赖)

1. 导出相应的生命周期钩子

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 、update(可选)四个生命周期钩子，以供主应用在适当的时机调用

```js
/** 
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。 
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。 
 */  
export async function bootstrap() {  
  console.log('react app bootstraped');  
}  
  
/** 
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法 
 */  
export async function mount(props) {  
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));  
}  
  
/** 
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例 
 */  
export async function unmount(props) {  
  ReactDOM.unmountComponentAtNode(props.container ? props.container.querySelector('#root') : document.getElementById('root'));  
}  
  
/** 
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效 
 */  
export async function update(props) {  
  console.log('update props', props);  
}  
```

2. 配置微应用的打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置

```js
const packageName = require('./package.json').name;
module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};

// 判断是独立运行还是在qiankun中加载
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
    mode: 'history',
    routes,
  });	
// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```