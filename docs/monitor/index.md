<!-- slide -->
### 为什么要有前端监控

- 用户体验直接决定用户留存，然而众多`体验问题`单靠用户反馈并不现实
  - 页面加载慢
  - 页面白屏
  - 操作卡顿或无响应请求响应慢
  - 一直在请求中请求频繁报错
  - 排版样式错乱
- 移动互联网时代，用户要求越来越高，耐心越来越差，对页面响应慢、页面不可用的容忍度低
- 使用场景复杂，H5、APP、Web、浏览器版本、手机机型、用户网速等等，都可能给业务带来影响
  
<!-- slide -->

### 前端监控能带来什么

1. 提升稳定性，更快地发现异常、定位异常、解决异常
   - JS 错误
   - 接口异常
   - 资源异常
   - 白屏
   - ...

2. 提升用户体验，建立性能规范，长期关注优化

   - 页面性能
   - 接口性能
   - 资源加载性能
   - 卡顿监控

3. 了解业务数据，指导产品升级

   - PV & UV
   - 业务数据
   - 行为监控

<!-- slide -->

## 前端监控的流程

### 数据采集

- PV 监控：页面切换后新的 url、页面切换原因
- JS 错误：错误对应类型、描述、行列号、堆栈，错误发生前的用户交互、错误的上下文等等
- 请求监控：请求的路径、状态码、请求头和响应头、请求各阶段耗时等等
- 性能监控：首屏加载各阶段耗时、各性能指标、SPA 切换耗时、longtask 等等
- 白屏监控：白屏发生的页面、关联的异常、相关的上下文等等
- 静态资源监控 & 用户行为监控 & 自定义监控

<!-- slide -->

### 组装上报

- 基础信息包装：页面路径、页面标识、全局 context、部署版本、部署环境、网络等等
- 采样逻辑
- 用户自定义包装逻辑执行：比如补充更多上下文、数据脱敏等
- 队列暂存 & 聚合发送
- 上报
  - xhr: 
    - 如果设置成异步的时候，当用户跳转新页面或者关闭页面时就会丢失当前这个请求，如果设置成同步，又会让页面造成卡顿的现象
  - Image
    - 没有跨域问题、
    - 发 GET 请求之后不需要获取和处理数据、
    - 服务器也不需要发送数据、
    - 不会携带当前域名 cookie、不会阻塞页面加载，影响用户的体验，只需 new Image 对象、
    - 相比于 BMP/PNG 体积最小，可以节约 41% / 35% 的网络资源小
  - sendBeacon：在页面关闭时发送请求，不阻塞页面卸载
    - 发出的是异步请求，并且是 POST 请求
    - 发出的请求，是放到的浏览器任务队列执行的，脱离了当前页面，所以不会阻塞当前页面的卸载和后面页面的加载过程，用户体验较好
    - 只能判断出是否放入浏览器任务队列，不能判断是否发送成功
    - Beacon API 不提供相应的回调，因此后端返回最好省略 response body
    - 兼容性不是很友好

<!-- slide -->

### 重点指标

![blockchain](../.vuepress/public/images/monitor/mark.png)

<!-- slide -->

### 站点体验

[Web Vitals](https://web.dev/vitals/) 定义了 LCP、FID、CLS 指标，成为了业界主流的标准

![blockchain](../.vuepress/public/images/monitor/webVitals.webp)

- `Largest Contentful Paint (LCP)`
  最大内容绘制，是用来测量加载的性能。这个指标上报视口中可见的最大图像或文本块的渲染的时间点，为了提供良好的用户体验，LCP 分数最好保证在 2.5 秒以内。

- `First Input Delay (FID)`
  第一次输入延迟，用于测量可交互性。FID 衡量的是从用户第一次与页面交互（例如，当他们点击链接，点击按钮，或使用自定义的 JavaScript 驱动的控件）到浏览器实际能够开始响应该交互的时间，为了提供良好的用户体验，站点应该努力使 FID 保持在 100 毫秒以内。

- `Cumulative Layout Shift (CLS)`
  累计布局位移，用于测量视觉稳定性。CLS 是衡量页面的整个生命周期中，发生的每次布局变化中的最大幅度的布局变化得分的指标。为了提供良好的用户体验，站点应该努力使 CLS 分数达到 0.1 或更低。

<!-- slide -->

### 采集

- **RUM (Real User Monitoring)** 指标，包括 FP, TTI, FCP, FMP, FID, MPFID。

  - 首次绘制时间（ FP ） ：即 First Paint，为首次渲染的时间点。
  - 首次内容绘制时间（ FCP ） ：即 First Contentful Paint，为首次有内容渲染的时间点。
  - 首次有效绘制时间（ FMP ） ：用户启动页面加载与页面呈现首屏之间的时间。
  - 首次交互时间（ FID ） ：即 First Input Delay，记录页面加载阶段，用户首次交互操作的延时时间。FID 指标影响用户对页面交互性和响应性的第一印象。
  - 交互中最大延时（ MPFID ） ：页面加载阶段，用户交互操作可能遇到的最大延时时间。
  - 完全可交互时间（TTI）：即 Time to interactive，记录从页面加载开始，到页面处于完全可交互状态所花费的时间。
  - 首次加载 跳出率：第一个页面完全加载前用户跳出率。

  以 FID 指标为例，先创建 `PerformanceObserver` 对象，监听 `first-input` 事件，监听到 `first-input` 事件后，利用 `Event Timing API`，通过事件的开始处理时间，减去事件的发生时间，即为 FID。

  ```js
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const FID = entry.processingStart - entry.startTime;
      console.log('FID:', FID);
    }
  });

  observer.observe({
    type: 'first-input',
    buffered: true,
  });
  ```

<!-- slide -->

- **Navigation Timing**，包括 DNS, TCP, DOM 解析等阶段的指标。

  Navigation Timing 指标，可以通过 PerformanceTiming 接口得到它们，以加载时间的计算为例：

  ```js
  function onLoad() {
    var now = new Date().getTime();

    var page_load_time = now - performance.timing.navigationStart;

    console.log('User-perceived page loading time: ' + page_load_time);
  }
  ```

<!-- slide -->

- **JS Error**，解析后可以细分为运行时异常、以及静态资源异常。

  JS Error 指标，通过` window.onerror` 回调函数即可监听 JavaScript 运行时错误：

  ```js
  window.onerror = function (message, source, lineno, colno, error) {
    // 构造异常数据格式并上报
  };
  ```

  通过 `unhandledrejection` 事件监听 `Promise rejections` 异步错误：

  ```js
  window.addEventListener('unhandledrejection', (event) => {
    // 构造异常数据格式并上报
  });
  ```

  使用 `addEventListener()` 监听 error 事件，可以捕获到资源加载失败错误:

  ```js
  // 捕获资源加载失败错误 js css img...
  window.addEventListener(
    'error',
    (e) => {
      const target = e.target;
      if (!target) return;
      if (target.src || target.href) {
        const url = target.src || target.href;
        // 构造异常数据格式并上报
      }
    },
    true
  );
  ```

<!-- slide -->

### 框架层次错误信息

  - **Vue**
    vue2.6 官网提供了两个报错函数的回调：`Vue.config.errorHandler` 和 `Vue.config.warnHandler`

  ```js
  Vue.config.errorHandler = function (
    err: Error,
    vm: ViewModel,
    info: string
  ): void {
    setTimeout(() => {
      throw err
    })
  };
  ```

  - **React**
    React16.13 中提供了 `componentDidCatch` 钩子函数来回调错误信息，所以我们可以新建一个类 `ErrorBoundary` 来继承 React，然后然后声明 `componentDidCatch` 钩子函数，可以拿到错误信息（目前没写 react 的错误收集，看官网文档简述，简易版应该是这样写的）。

    ```js
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
      static getDerivedStateFromError(error) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
      }
      componentDidCatch(error, info) {
        // 收集信息
      }
      render() {
        if (this.state.hasError) {
          // 你可以自定义降级后的 UI 并渲染
          return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
      }
    }
    ```
    **注意**: error boundaries并不会捕捉以下错误：React事件处理，异步代码，error boundaries自己抛出的错误。

<!-- slide -->

- **请求状态码**，采集上报后，可以分析请求异常等信息。

  请求状态码，则可以通过覆写 `window.fetch` 和` XMLHttpRequest` 对象来实现监听，以覆写 `fetch` 为例，以下是简化后的代码：

  ```js
  const _fetch = window.fetch;

  window.fetch = (req: RequestInfo, options: RequestInit = {}) => {
    // 省略一些逻辑……
    return _fetch(req, options).then(
      // 成功
      (res) => {
        // 上报成功请求信息
        return res;
      },
      // 失败
      (res) => {
        // 上报失败请求信息
        return Promise.reject(res);
      }
    );
  };
  ```

<!-- slide -->

## 错误类型/收集

### 常见 JS 执行错误

1. `SyntaxError` 解析时发生语法错误

```js
// 控制台运行
const xx,
```

window.onerror 捕获不到 SyntxError，一般 SyntaxError 在构建阶段，甚至本地开发阶段就会被发现。

2. `TypeError` 值不是所期待的类型

```js
// 控制台运行
const person = void 0;
person.name;
```

3. `ReferenceError` 引用未声明的变量

```js
// 控制台运行
nodefined;
```

4. `RangeError` 当一个值不在其所允许的范围或者集合中

```js
(function fn() {
  fn();
})();
```

<!-- slide -->

### 网络错误

1. `ResourceError` 资源加载错误

```js
new Image().src = '/remote/image/notdeinfed.png';
```

2. `HttpError` Http 请求错误

```js
// 控制台运行
fetch('/remote/notdefined', {});
```

<!-- slide -->

### 搜集错误

1. `try/catch` 能捕获常规运行时错误，语法错误和异步错误不行

```js
// 常规运行时错误，可以捕获 ✅
try {
  console.log(notdefined);
} catch(e) {
  console.log('捕获到异常：', e);
}

// 语法错误，不能捕获 ❌
try {
  const notdefined,
} catch(e) {
  console.log('捕获到异常：', e);
}

// 异步错误，不能捕获 ❌
try {
  setTimeout(() => {
    console.log(notdefined);
  }, 0)
} catch(e) {
  console.log('捕获到异常：',e);
}
```

<!-- slide -->

2. `window.onerror` pure js 错误收集，window.onerror，当 JS 运行时错误发生时，window 会触发一个 ErrorEvent 接口的 error 事件。

```js
/**
* @param {String}  message    错误信息
* @param {String}  source    出错文件
* @param {Number}  lineno    行号
* @param {Number}  colno    列号
* @param {Object}  error  Error对象
*/

window.onerror = function(message, source, lineno, colno, error) {
   console.log('捕获到异常：', {message, source, lineno, colno, error});
}

// 语法错误，不能捕获 ❌
const notdefined,

// 异步错误，可以捕获 ✅
setTimeout(() => {
  console.log(notdefined);
}, 0)

// 资源错误，不能捕获 ❌
<script>
  window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到异常：',{message, source, lineno, colno, error});
  return true;
}
</script>
<img src="https://xxx/image/xxx.png">
```

<!-- slide -->

3. `window.addEventListener`

```js
   <script>
    window.addEventListener('error', (error) => {
      console.log('捕获到异常：', error);
    }, true)
  </script>

  // 图片、script、css加载错误，都能被捕获 ✅
  <img src="https://xx.xx.cn/image/xxx.png" />
  <script src="https://xx.xx.cn/foundnull.js"></script>
  <link href="https://xx.xx.cn/foundnull.css" rel="stylesheet"/>

  // new Image错误，不能捕获 ❌
  <script>
    new Image().src = 'https://xx.xx.cn/image/lll.png'
  </script>

  // fetch错误，不能捕获 ❌
  <script>
    fetch('https://tuia.cn/test')
  </script>
```

<!-- slide -->

4. `Promise错误`

- **普通 Promise 错误** try/catch 不能捕获 Promise 中的错误

```js
// try/catch 不能处理 JSON.parse 的错误，因为它在 Promise 中
try {
  new Promise((resolve, reject) => {
    JSON.parse('');
    resolve();
  });
} catch (err) {
  console.error('in try catch', err);
}

// 需要使用catch方法
new Promise((resolve, reject) => {
  JSON.parse('');
  resolve();
}).catch((err) => {
  console.log('in catch fn', err);
});
```

- **async 错误** try/catch 不能捕获 async 包裹的错误

```js
const getJSON = async () => {
  throw new Error('inner error');
};

// 通过try/catch处理
const makeRequest = async () => {
  try {
    // 捕获不到
    JSON.parse(getJSON());
  } catch (err) {
    console.log('outer', err);
  }
};

try {
  // try/catch不到
  makeRequest();
} catch (err) {
  console.error('in try catch', err);
}

try {
  // 需要await，才能捕获到
  await makeRequest();
} catch (err) {
  console.error('in try catch', err);
}
```

<!-- slide -->

- `import chunk错误` import其实返回的也是一个promise，因此使用如下两种方式捕获错误

```js
// Promise catch方法
import(/* webpackChunkName: "incentive" */'./index').then(module => {
    module.default()
}).catch((err) => {
    console.error('in catch fn', err)
})

// await 方法，try catch
try {
    const module = await import(/* webpackChunkName: "incentive" */'./index');
    module.default()
} catch(err) {
    console.error('in try catch', err)
}
```

- **全局捕获Promise中的错误**
```js
// 全局统一处理Promise
window.addEventListener("unhandledrejection", function(e){
  console.log('捕获到异常：', e);
});
fetch('https://xx.cn/xxx')
```