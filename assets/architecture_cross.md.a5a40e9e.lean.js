import{_ as e,o as r,c as t,N as i}from"./chunks/framework.ee5f5f8b.js";const p=JSON.parse('{"title":"大前端","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/cross.md"}'),o={name:"architecture/cross.md"};function l(s,a,n,h,c,d){return r(),t("div",null,a[0]||(a[0]=[i('<h1 id="大前端" tabindex="-1">大前端 <a class="header-anchor" href="#大前端" aria-label="Permalink to &quot;大前端&quot;">​</a></h1><h2 id="h5" tabindex="-1">H5 <a class="header-anchor" href="#h5" aria-label="Permalink to &quot;H5&quot;">​</a></h2><h3 id="js-bridge" tabindex="-1">JS-Bridge <a class="header-anchor" href="#js-bridge" aria-label="Permalink to &quot;JS-Bridge&quot;">​</a></h3><h3 id="react-native" tabindex="-1">React Native <a class="header-anchor" href="#react-native" aria-label="Permalink to &quot;React Native&quot;">​</a></h3><h3 id="uni-app" tabindex="-1">Uni-app <a class="header-anchor" href="#uni-app" aria-label="Permalink to &quot;Uni-app&quot;">​</a></h3><h3 id="taro" tabindex="-1">Taro <a class="header-anchor" href="#taro" aria-label="Permalink to &quot;Taro&quot;">​</a></h3><h2 id="pc" tabindex="-1">PC <a class="header-anchor" href="#pc" aria-label="Permalink to &quot;PC&quot;">​</a></h2><h3 id="electron" tabindex="-1">Electron <a class="header-anchor" href="#electron" aria-label="Permalink to &quot;Electron&quot;">​</a></h3><h3 id="tauri" tabindex="-1">Tauri <a class="header-anchor" href="#tauri" aria-label="Permalink to &quot;Tauri&quot;">​</a></h3><h2 id="node" tabindex="-1">Node <a class="header-anchor" href="#node" aria-label="Permalink to &quot;Node&quot;">​</a></h2><h3 id="koa、express-区别" tabindex="-1">koa、express 区别 <a class="header-anchor" href="#koa、express-区别" aria-label="Permalink to &quot;koa、express 区别&quot;">​</a></h3><ul><li><p>Handler 处理方式</p><ul><li>Express 使用普通的回调函数，一种线性的逻辑，在同一个线程上完成所有的 HTTP 请求</li><li>Koa2 这个现在是 Koa 的默认版本，与 Koa1 最大的区别是使用 ES7 的 Async/Await 替换了原来的 Generator + co 的模式，也无需引入第三方库，底层原生支持，Async/Await 现在也称为 JS 异步的终极解决方案</li></ul></li><li><p>中间件</p><ul><li>Express 中间件实现是基于 Callback 回调函数同步的，它不会去等待异步（Promise）完成</li><li>Koa 的中间件机制中使用 Async/Await（背后全是 Promise）通过 next 来驱动以同步的方式来管理异步代码，它则可以等待异步操作（洋葱模型）</li></ul></li><li><p>响应机制</p><ul><li>在 Express 中我们直接操作的是 res 对象，res.send() 之后就立即响应了，无法在上层中间件做操作</li><li>Koa 中数据的响应是通过 ctx.body 进行设置，注意这里仅是设置并没有立即响应，而是在所有的中间件结束之后做了响应</li></ul></li></ul>',12)]))}const b=e(o,[["render",l]]);export{p as __pageData,b as default};
