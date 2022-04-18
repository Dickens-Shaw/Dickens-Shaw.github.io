## 输入 URL

- 首先会对 URL 进行解析，分析所需要使用的传输协议和请求的资源的路径。如果输入的 URL 中的协议或者主机名不合法，将会把地址栏中输入的内容传递给搜索引擎。如果没有问题，浏览器会检查 URL 中是否出现了非法字符，如果存在非法字符，则对非法字符进行转义后再进行下一过程。

- 浏览器会判断所请求的资源是否在缓存里，如果请求的资源在缓存里并且没有失效，那么就直接使用，否则向服务器发起新的请求。

1. 首先做 DNS 查询，如果这一步做了智能 DNS 解析的话，会提供访问速度最快的 IP 地址回来

2. 接下来是 TCP 握手，应用层会下发数据给传输层，这里 TCP 协议会指明两端的端口号，然后下发给网络层。网络层中的 IP 协议会确定 IP 地址，并且指示了数据传输中如何跳转路由器。然后包会再被封装到数据链路层的数据帧结构中，最后就是物理层面的传输了

3. TCP 握手结束后会进行 TLS 握手，然后就开始正式的传输数据

4. 数据在进入服务端之前，可能还会先经过负责负载均衡的服务器，它的作用就是将请求合理的分发到多台服务器上，这时假设服务端会响应一个 HTML 文件

5. 首先浏览器会判断状态码是什么，如果是 200 那就继续解析，如果 400 或 500 的话就会报错，如果 300 的话会进行重定向，这里会有个重定向计数器，避免过多次的重定向，超过次数也会报错

6. 浏览器开始解析文件，如果是 gzip 格式的话会先解压一下，然后通过文件的编码格式知道该如何去解码文件

浏览器渲染过程:

7. 文件解码成功后会正式开始渲染流程，先会根据 HTML 构建 DOM 树，有 CSS 的话会去构建 CSSOM 树。如果遇到 script 标签的话，会判断是否存在 async 或者 defer ，前者会并行进行下载并执行 JS，后者会先下载文件，然后等待 HTML 解析完成后顺序执行，如果以上都没有，就会阻塞住渲染流程直到 JS 执行完毕。遇到文件下载的会去下载文件，这里如果使用 HTTP 2.0 协议的话会极大的提高多图的下载效率。

8. 初始的 HTML 被完全加载和解析后会触发 DOMContentLoaded 事件

9. CSSOM 树和 DOM 树构建完成后会开始合并生成 Render 树，这一步就是确定页面元素的布局（回流）、样式等等诸多方面的东西

10. 在生成 Render 树的过程中，浏览器就开始调用 GPU 绘制，合成图层，将内容显示在屏幕上了

## 回流 reflow

当元素的尺寸或者位置发生了变化，就需要重新计算渲染树

- 触发：

  - 页面首次渲染
  - 浏览器窗口大小发生改变
  - DOM 元素的几何属性(width/height/padding/margin/border)发生变化
  - DOM 元素内容变化（文字数量或图片大小等等）
  - DOM 元素字体大小变化
  - DOM 元素移动或增加
  - 激活 CSS 伪类（例如：:hover）
  - 读写 offset/scroll/client 等属性
  - 调用 getComputedStyle()、getBoundingClientRect()、scrollTo()

- 减少：
  - 使用 transform 替代 top
  - 使用 class 替代 style，减少 style 的使用
  - 使用 resize、scroll 时进行防抖和节流处理，这两者会直接导致回流
  - 使用 visibility 替换 display: none，因为前者只会引起重绘，后者会引发回流
  - 不要把节点的属性值放在一个循环里当成循环里的变量
  - 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局
  - 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame
  - CSS 选择符从右往左匹配查找，避免节点层级过多
  - 批量修改元素时，可以先让元素脱离文档流，等修改完毕后，再放入文档流
  - 避免触发同步布局事件
  - 对于复杂动画效果,使用绝对定位让其脱离文档流

## 重绘 repaint

DOM 样式发生了变化，但没有影响 DOM 的几何属性和它在文档流中的位置时，会触发重绘，而不会触发回流

重绘由于 DOM 位置信息不需要更新，省去了布局过程，因而性能上优于回流

## 合成 composite

在 DOM 树中每个节点都会对应一个 LayoutObject，当他们的 LayoutObject 处于相同的坐标空间时，就会形成一个 RenderLayers ，也就是渲染层。RenderLayers 来保证页面元素以正确的顺序合成，这时候就会出现层合成（composite），从而正确处理透明元素和重叠元素的显示

提升合成层的最好方式是使用 CSS 的 will-change 属性。而 will-change 设置为 opacity、transform、top、left、bottom、right 可以将元素提升为合成层。
video、iframe 标签也可以可以生成新图层

## GPU 加速

- 数据处理过程：

  - 将每个复合层绘制成一个单独的图像；
  - 准备层数据（尺寸、偏移量、透明度等）；
  - 准备动画着色器（如果适用）；
  - 将数据发送到 GPU

- 优点：使用 transform、opacity、filters 等属性时，会直接在 GPU 中完成处理，这些属性的变化不会引起回流重绘

- 缺点：GPU 渲染字体会导致字体模糊，过多的 GPU 处理会导致内存问题

## 事件

### 事件触发

事件触发有三个阶段：

1. window 往事件触发处传播，遇到注册的捕获事件会触发
2. 传播到事件触发处时触发注册的事件
3. 从事件触发处往 window 传播，遇到注册的冒泡事件会触发

捕获的流程为：window -> document -> html -> body -> ... -> 目标元素。

冒泡的流程为：目标元素 -> ... -> body -> html -> document -> window。

### 事件委托

**事件委托** 本质上是利用了浏览器事件冒泡的机制。因为事件在冒泡过程中会上传到父节点，并且父节点可以通过事件对象获取到 目标节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为**事件代理**。

使用事件代理我们可以不必要为每一个子元素都绑定一个监听事件，这样**减少了内存上的消耗**。并且使用事件代理我们还可以实现**事件的动态绑定**，比如说新增了一个子节点，我们并不需要单独地为它添加一个监听事件，它所发生的事件会交给父元素中的监听函数来处理。

## 存储

cookie，localStorage，sessionStorage，indexDB

| 特性         | cookie                                     | localStorage             | sessionStorage | indexDB                  |
| ------------ | ------------------------------------------ | ------------------------ | -------------- | ------------------------ |
| 数据生命周期 | 一般由服务器生成，可以设置过期时间         | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 |
| 数据存储大小 | 4K                                         | 5M                       | 5M             | 无限                     |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 | 不参与                   | 不参与         | 不参与                   |

- 从上表可以看到，cookie 已经不建议用于存储。
- 如果没有大量数据存储需求的话，可以使用 localStorage 和 sessionStorage 。
- 对于不怎么改变的数据尽量使用 localStorage 存储，否则可以用 sessionStorage 存储

对于 cookie，我们还需要注意安全性：

| 属性      | 作用                                                           |
| --------- | -------------------------------------------------------------- |
| value     | 如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识 |
| http-only | 不能通过 JS 访问 Cookie，减少 XSS 攻击                         |
| secure    | 只能在协议为 HTTPS 的请求中携带                                |
| same-site | 规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击          |

## 缓存

### 缓存位置

- Service Worker（目前该技术通常用来做缓存文件，提高首屏速度）:
  可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。
  本质上充当 Web 应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步 API。

- Memory Cache（内存缓存）：
  读取内存中的数据肯定比磁盘快，虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放

- Disk Cache（硬盘缓存）：
  读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上，并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据

- Push Cache（推送缓存）：
  HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。并且缓存时间也很短暂，只在会话（Session）中存在，一旦会话结束就被释放

以上缓存都没命中就会进行网络请求 

### 缓存策略

缓存策略都是通过设置 HTTP Header (response header)来实现的。

强制缓存优先于协商缓存进行，若强制缓存(Expires 和 Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since 和 ETag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，返回 200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回 304，继续使用缓存。

- 强缓存
  在缓存期间不需要向服务器询，state code 为 200，实现方式：

  - 设置 Expires，过期时间，是绝对日期，容易因为服务端和客户端时间不一致而出错(基本淘汰)
  - 设置 Cache-Control，HTTP/1.1 新增字段，可以组合使用多种指令，通过 max-age 字段来设置相对过期时间
    - `private` 仅浏览器可以缓存
    - `public` 浏览器和代理服务器都可以缓存（对于 private 和 public ，前端可以认为一样，不用深究）
    - `max-age=xxx` 过期时间(**重要**)
    - `no-cache` 不进行强缓存(**重要**)
    - `no-store` 不强缓存，也不协商缓存，基本不用，缓存越多才越好呢
    - __注意：规则可以同时多个__

- 协商缓存
  强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程
  需要向服务器询问缓存是否已经过期，如果缓存有效会返回 304，实现方式：

  - Last-Modified，最后修改日期，客户端和服务端通过比较修改日期来决定是否使用缓存(-->If-Modified-Since)
  - ETag，HTTP/1.1 新增字段，表示文件唯一标识，只要文件内容改动，ETag 就会重新计算。客户端和服务端通过比较文件是否修改来决定是否使用缓存(-->If-None-Match)
  - 对比：
    - 精确度: ETag > Last-Modified：如果我们打开文件但并没有修改，Last-Modified 也会改变，并且 Last-Modified 的单位时间为一秒，如果一秒内修改完了文件，那么还是会命中缓存
    - 性能 ETag < Last-Modified
    - 优先级 ETag > Last-Modified
      如果什么缓存策略都没有设置，那么浏览器会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间

- 使用场景

对于大部分的场景都可以使用强缓存配合协商缓存解决，但是在一些特殊的地方可能需要选择特殊的缓存策略：

1. 对于某些不需要缓存的资源，可以使用 Cache-control: no-store ，表示该资源不需要缓存
2. 对于频繁变动的资源，可以使用 Cache-Control: no-cache 并配合 ETag 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。
3. 对于代码文件来说，通常使用 Cache-Control: max-age=31536000 并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件。
4. 用户行为对缓存的影响：F5 会 跳过强缓存规则，直接走协商缓存；Ctrl+F5 ，跳过所有缓存规则，和第一次请求一样，重新获取资源

## 跨域

### 同源策略

同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS、CSRF 等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个 ip 地址，也非同源。

- 同源策略限制内容有：

  - Cookie、LocalStorage、IndexedDB 等存储性内容
  - DOM 节点
  - AJAX 请求发送后，结果被浏览器拦截了

- 但是有三个标签是允许跨域加载资源：
  - `<img src=XXX>`
  - `<link href=XXX>`
  - `<script src=XXX>`

### JSONP

> 利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据

特点：使用简单且兼容性不错，但是只限于 get 请求

```js
function jsonp(url, callback, success) {
  let script = document.createElement('script')
  script.src = url
  script.async = true
  script.type = 'text/javascript'
  window[callback] = function (data) {
    success(data)
  }
  document.body.appendChild(script)
}

jsonp('https://api.github.com/users/octocat', 'callback', function (data) {
  console.log(data)
})
```

### CORS

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。

- 简单请求：
  以 Ajax 为例，当满足以下条件时，会触发简单请求

  - 使用下列方法之一：
    GET
    HEAD
    POST
  - Content-Type 的值仅限于下列三者之一：
    text/plain
    multipart/form-data
    application/x-www-form-urlencoded
  - 请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器； XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问。

- 复杂请求：
  那么很显然，不符合以上条件的请求就肯定是复杂请求了。
  对于复杂请求来说，首先会发起一个预检请求，该请求是 option 方法的，通过该请求来知道服务端是否允许跨域请求。

### Nginx 和 nodejs 中间件代理原理相同

实现原理：**同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略**。 代理服务器，需要做以下几个步骤：

- 接受客户端请求。
- 将请求转发给服务器。
- 拿到服务器响应数据。
- 将响应转发给客户端。

### document.domain

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。

只需要给页面添加 document.domain = 'test.com' 表示二级域名都相同就可以实现跨域

### postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', (event) => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
```

### webSocket

WebSocket 是 HTML5 提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于 TCP 传输协议，并复用 HTTP 的握手通道。浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接， 并进行双向数据传输。

WebSocket 的出现就解决了半双工通信的弊端。它最大的特点是：服务器可以向客户端主动推动消息，客户端也可以主动向服务器推送消息。

- 原理：客户端向 WebSocket 服务器通知（notify）一个带有所有接收者 ID（recipients IDs）的事件（event），服务器接收后立即通知所有活跃的（active）客户端，只有 ID 在接收者 ID 序列中的客户端才会处理这个事件。

- 特点：
  - 支持双向通信，实时性更强
  - 可以发送文本，也可以发送二进制数据
  - 建立在 TCP 协议之上，服务端的实现比较容易
  - 数据格式比较轻量，性能开销小，通信高效
  - 没有同源限制，客户端可以与任意服务器通信
  - 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL
  - 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

# API

## MutationObserver

MutationObserver 是一个可以监听 DOM 结构变化的接口。当 DOM 对象树发生任何变动时，MutationObserver 会得到通知。

MutationObserver 是一个构造器，接受一个 callback 参数，用来处理节点变化的回调函数，返回两个参数：

- mutations：节点变化记录列表（sequence<MutationRecord>）
- observer：构造 MutationObserver 对象。

MutationObserver 对象有三个方法，分别如下：

- observe：设置观察目标，接受两个参数，target：观察目标，options：通过对象成员来设置观察选项
- disconnect：阻止观察者观察任何改变
- takeRecords：清空记录队列并返回里面的内容

```js
//选择一个需要观察的节点
var targetNode = document.getElementById('root')
// 设置observer的配置选项
var config = { attributes: true, childList: true, subtree: true }
// 当节点发生变化时的需要执行的函数
var callback = function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type == 'childList') {
      console.log('A child node has been added or removed.')
    } else if (mutation.type == 'attributes') {
      console.log('The ' + mutation.attributeName + ' attribute was modified.')
    }
  }
}
// 创建一个observer示例与回调函数相关联
var observer = new MutationObserver(callback)
//使用配置文件对目标节点进行观测
observer.observe(targetNode, config)
// 停止观测
observer.disconnect()
```

observe 方法中 options 参数有已下几个选项：

- `childList`：设置 true，表示观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化
- `attributes`：设置 true，表示观察目标属性的改变
- `characterData`：设置 true，表示观察目标数据的改变
- `subtree`：设置为 true，目标以及目标的后代改变都会观察
- `attributeOldValue`：如果属性为 true 或者省略，则相当于设置为 true，表示需要记录改变前的目标属性值，设置了 attributeOldValue 可以省略 attributes 设置
- `characterDataOldValue`：如果 characterData 为 true 或省略，则相当于设置为 true,表示需要记录改变之前的目标数据，设置了 characterDataOldValue 可以省略 characterData 设置
- `attributeFilter`：如果不是所有的属性改变都需要被观察，并且 attributes 设置为 true 或者被忽略，那么设置一个需要观察的属性本地名称（不需要命名空间）的列表

MutationObserver 有以下特点：

- 它等待所有脚本任务完成后才会运行，即采用异步方式
- 它把 DOM 变动记录封装成一个数组进行处理，而不是一条条地个别处理 DOM 变动。
- 它即可以观察发生在 DOM 节点的所有变动，也可以观察某一类变动

当 DOM 发生变动会触发 MutationObserver 事件。但是，它与事件有一个本质不同：事件是同步触发，也就是说 DOM 发生变动立刻会触发相应的事件；MutationObserver 则是异步触发，DOM 发生变动以后，并不会马上触发，而是要等到当前所有 DOM 操作都结束后才触发。

举例来说，如果在文档中连续插入 1000 个段落（p 元素），会连续触发 1000 个插入事件，执行每个事件的回调函数，这很可能造成浏览器的卡顿；而 MutationObserver 完全不同，只在 1000 个段落都插入结束后才会触发，而且只触发一次，这样较少了 DOM 的频繁变动，大大有利于性能。

## IntersectionObserver

网页开发时，常常需要了解某个元素是否进入了"视口"（viewport），即用户能不能看到它。

传统的实现方法是，监听到 scroll 事件后，调用目标元素的 getBoundingClientRect()方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于 scroll 事件密集发生，计算量很大，容易造成性能问题。

目前有一个新的 IntersectionObserver API，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

IntersectionObserver 是浏览器原生提供的构造函数，接受两个参数：callback 是可见性变化时的回调函数，option 是配置对象（该参数可选）。

```js
var io = new IntersectionObserver(callback, option)
// 开始观察
io.observe(document.getElementById('example'))
// 停止观察
io.unobserve(element)
// 关闭观察器
io.disconnect()
```

目标元素的可见性变化时，就会调用观察器的回调函数 callback。callback 一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```js
var io = new IntersectionObserver((entries) => {
  console.log(entries)
})
```

callback 函数的参数（entries）是一个数组，每个成员都是一个 IntersectionObserverEntry 对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，entries 数组就会有两个成员。

- `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- `target`：被观察的目标元素，是一个 DOM 节点对象
- `isIntersecting`: 目标是否可见
- `rootBounds`：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
- `boundingClientRect`：目标元素的矩形区域的信息
- `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息
- `intersectionRatio`：目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0

相比于 getBoundingClientRect，它的优点是不会引起重绘回流。

## getComputedStyle

DOM2 Style 在 `document.defaultView` 上增加了 getComputedStyle()方法，该方法返回一个 `CSSStyleDeclaration` 对象（与 style 属性的类型一样），包含元素的计算样式。

```js
document.defaultView.getComputedStyle(element[,pseudo-element])
// or
window.getComputedStyle(element[,pseudo-element])
```

这个方法接收两个参数：要取得计算样式的元素和伪元素字符串（如":after"）。如果不需要查询伪元素，则第二个参数可以传 null。

- Polyfill:

```js
function getStyleByAttr(obj, name) {
  return window.getComputedStyle
    ? window.getComputedStyle(obj, null)[name]
    : obj.currentStyle[name]
}
```

- 和 style 的异同
  - getComputedStyle 和 element.style 的相同点就是二者返回的都是 CSSStyleDeclaration 对象。
  - element.style 读取的只是元素的内联样式，即写在元素的 style 属性上的样式；而 getComputedStyle 读取的样式是最终样式，包括了内联样式、嵌入样式和外部样式。
  - element.style 既支持读也支持写，我们通过 element.style 即可改写元素的样式。而 getComputedStyle 仅支持读并不支持写入。我们可以通过使用 getComputedStyle 读取样式，通过 element.style 修改样式

## getBoundingClientRect

getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。

```js
let DOMRect = object.getBoundingClientRect()
```

它的返回值是一个 DOMRect 对象，这个对象是由该元素的 getClientRects() 方法返回的一组矩形的集合，就是该元素的 CSS 边框大小。返回的结果是包含完整元素的最小矩形，并且拥有 left, top, right, bottom, x, y, width, 和 height 这几个以像素为单位的只读属性用于描述整个边框。除了 width 和 height 以外的属性是相对于视图窗口的左上角来计算的。

## requestAnimationFrame

window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。

该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

```js
window.requestAnimationFrame(callback)
```

- Polyfill:

```js
window._requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60)
    }
  )
})()
```

- 结束动画：

```js
var globalID
function animate() {
  // done(); 一直运行
  globalID = requestAnimationFrame(animate) // Do something animate
}
globalID = requestAnimationFrame(animate) //开始
cancelAnimationFrame(globalID) //结束
```

与 setTimeout 相比，requestAnimationFrame 最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是 60Hz,那么回调函数就每 16.7ms 被执行一次，如果刷新率是 75Hz，那么这个时间间隔就变成了 1000/75=13.3ms，换句话说就是，requestAnimationFrame 的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题

- 优点：

  - CPU 节能：使用 setTimeout 实现的动画，当页面被隐藏或最小化时，setTimeout 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费 CPU 资源。而 requestAnimationFrame 则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的 requestAnimationFrame 也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销。

  - 函数节流：在高频率事件(resize,scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行，使用 requestAnimationFrame 可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销。一个刷新间隔内函数执行多次时没有意义的，因为显示器每 16.7ms 刷新一次，多次绘制并不会在屏幕上体现出来。

- 应用场景

1. 监听 scroll 函数

```js
$(window).on('scroll', function () {
  window.requestAnimationFrame(scrollHandler)
})
```

2. 平滑滚动到页面顶部

```js
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, c - c / 8)
  }
}
scrollToTop()
```

3. 大量数据渲染
4. 监控卡顿方法： 每秒中计算一次网页的 FPS，获得一列数据，然后分析。通俗地解释就是，通过 requestAnimationFrame API 来定时执行一些 JS 代码，如果浏览器卡顿，无法很好地保证渲染的频率，1s 中 frame 无法达到 60 帧，即可间接地反映浏览器的渲染帧率。
