## 输入URL

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

9.  CSSOM 树和 DOM 树构建完成后会开始合并生成 Render 树，这一步就是确定页面元素的布局（回流）、样式等等诸多方面的东西

10. 在生成 Render 树的过程中，浏览器就开始调用 GPU 绘制，合成图层，将内容显示在屏幕上了

## 回流 reflow

当元素的尺寸或者位置发生了变化，就需要重新计算渲染树

- 触发：

  - DOM元素的几何属性(width/height/padding/margin/border)发生变化
  - DOM元素移动或增加
  - 读写offset/scroll/client等属性
  - 调用window.getComputedStyle

- 减少：

  - 使用 transform 替代 top
  - 使用class替代style，减少style的使用
  - 使用resize、scroll时进行防抖和节流处理，这两者会直接导致回流
  - 使用visibility替换display: none，因为前者只会引起重绘，后者会引发回流
  - 不要把节点的属性值放在一个循环里当成循环里的变量
  - 不要使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局
  - 动画实现的速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame
  - CSS 选择符从右往左匹配查找，避免节点层级过多
  - 批量修改元素时，可以先让元素脱离文档流，等修改完毕后，再放入文档流
  - 避免触发同步布局事件
  - 对于复杂动画效果,使用绝对定位让其脱离文档流

## 重绘 repaint

DOM样式发生了变化，但没有影响DOM的几何属性时，会触发重绘，而不会触发回流

重绘由于DOM位置信息不需要更新，省去了布局过程，因而性能上优于回流

## 合成 composite
在 DOM 树中每个节点都会对应一个 LayoutObject，当他们的 LayoutObject 处于相同的坐标空间时，就会形成一个 RenderLayers ，也就是渲染层。RenderLayers 来保证页面元素以正确的顺序合成，这时候就会出现层合成（composite），从而正确处理透明元素和重叠元素的显示

提升合成层的最好方式是使用 CSS 的 will-change 属性。而 will-change 设置为 opacity、transform、top、left、bottom、right 可以将元素提升为合成层。
video、iframe 标签也可以可以生成新图层

## GPU加速

- 数据处理过程：

  - 将每个复合层绘制成一个单独的图像；
  - 准备层数据（尺寸、偏移量、透明度等）；
  - 准备动画着色器（如果适用）；
  - 将数据发送到GPU

- 优点：使用transform、opacity、filters等属性时，会直接在GPU中完成处理，这些属性的变化不会引起回流重绘

- 缺点：GPU渲染字体会导致字体模糊，过多的GPU处理会导致内存问题

## 事件
### 事件触发

事件触发有三个阶段：

  1. window 往事件触发处传播，遇到注册的捕获事件会触发
  2. 传播到事件触发处时触发注册的事件
  3. 从事件触发处往 window 传播，遇到注册的冒泡事件会触发

捕获的流程为：window -> document -> html -> body -> ... -> 目标元素。

冒泡的流程为：目标元素 -> ... -> body -> html -> document -> window。

### 事件代理

如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上

事件代理的方式相对于直接给目标注册事件来说，有以下优点

  1. 节省内存
  2. 不需要给子节点注销事件

## 存储

cookie，localStorage，sessionStorage，indexDB

|  特性  |  cookie  |  localStorage   |  sessionStorage  |  indexDB   |
|  ----  |  ----  |  ----  |  ----  |  ----  |
| 数据生命周期  |  一般由服务器生成，可以设置过期时间 |  除非被清理，否则一直存在  |  页面关闭就清理  |  除非被清理，否则一直存在  |
| 数据存储大小  |  4K  |  5M  |  5M  |  无限  |
| 与服务端通信  |  每次都会携带在 header 中，对于请求性能影响  |  不参与  |  不参与  |  不参与  |

- 从上表可以看到，cookie 已经不建议用于存储。
- 如果没有大量数据存储需求的话，可以使用 localStorage 和 sessionStorage 。
- 对于不怎么改变的数据尽量使用 localStorage 存储，否则可以用 sessionStorage 存储

对于 cookie，我们还需要注意安全性：

|  属性  |  作用  |
|  ----  |  ----  |
|  value  |  如果用于保存用户登录态，应该将该值加密，不能使用明文的用户标识  |
|  http-only  |  不能通过 JS 访问 Cookie，减少 XSS 攻击  |
|  secure  |  只能在协议为 HTTPS 的请求中携带  |
|  same-site  |  规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击  |

## 缓存

### 缓存位置

- Service Worker（目前该技术通常用来做缓存文件，提高首屏速度）:
可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。
本质上充当Web应用程序与浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。它们旨在（除其他之外）使得能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步API。

- Memory Cache（内存缓存）：
读取内存中的数据肯定比磁盘快，虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放

- Disk Cache（硬盘缓存）：
读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上，并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据

- Push Cache（推送缓存）：
HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。并且缓存时间也很短暂，只在会话（Session）中存在，一旦会话结束就被释放

以上缓存都没命中就会进行网络请求

### 缓存策略

缓存策略都是通过设置 HTTP Header 来实现的。

强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since和ETag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回304，继续使用缓存。

- 强缓存
在缓存期间不需要向服务器询，state code 为 200，实现方式：
  - 设置Expires，过期时间，是绝对日期，容易因为服务端和客户端时间不一致而出错
  - 设置Cache-Control，HTTP/1.1新增字段，可以组合使用多种指令，通过max-age字段来设置相对过期时间

- 协商缓存
强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程
需要向服务器询问缓存是否已经过期，如果缓存有效会返回 304，实现方式：
  - Last-Modified，最后修改日期，客户端和服务端通过比较修改日期来决定是否使用缓存
  - ETag，HTTP/1.1新增字段，表示文件唯一标识，只要文件内容改动，ETag就会重新计算。客户端和服务端通过比较文件是否修改来决定是否使用缓存
  - 对比：
    - 精确度: ETag >  Last-Modified：如果我们打开文件但并没有修改，Last-Modified 也会改变，并且 Last-Modified 的单位时间为一秒，如果一秒内修改完了文件，那么还是会命中缓存
    - 性能ETag < Last-Modified
    - 优先级 ETag >  Last-Modified
  如果什么缓存策略都没有设置，那么浏览器会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间

- 使用场景

对于大部分的场景都可以使用强缓存配合协商缓存解决，但是在一些特殊的地方可能需要选择特殊的缓存策略：
  1. 对于某些不需要缓存的资源，可以使用 Cache-control: no-store ，表示该资源不需要缓存
  2. 对于频繁变动的资源，可以使用 Cache-Control: no-cache 并配合 ETag 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新。
  3. 对于代码文件来说，通常使用 Cache-Control: max-age=31536000 并配合策略缓存使用，然后对文件进行指纹处理，一旦文件名变动就会立刻下载新的文件。

## 跨域

### JSONP

> 利用 `<script>` 标签没有跨域限制的漏洞。通过 `<script>` 标签指向一个需要访问的地址并提供一个回调函数来接收数据

特点：使用简单且兼容性不错，但是只限于 get 请求

```js
function jsonp(url, callback, success) {
  let script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.type = 'text/javascript';
  window[callback] = function(data) {
    success(data);
  };
  document.body.appendChild(script);
}

jsonp('https://api.github.com/users/octocat', 'callback', function(data) {
  console.log(data);
});
```

### CORS

CORS需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

浏览器会自动进行 CORS 通信，实现CORS通信的关键是后端。只要后端实现了 CORS，就实现了跨域。

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

### Nginx和nodejs中间件代理原理相同

### document.domain

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。

只需要给页面添加 document.domain = 'test.com' 表示二级域名都相同就可以实现跨域

### postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage('message', 'http://test.com');
// 接收消息端
var mc = new MessageChannel();
mc.addEventListener('message', (event) => {
    var origin = event.origin || event.originalEvent.origin; 
    if (origin === 'http://test.com') {
        console.log('验证通过')
    }
});
```

### webSocket

WebSocket是HTML5提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于TCP传输协议，并复用HTTP的握手通道。浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接， 并进行双向数据传输。

WebSocket 的出现就解决了半双工通信的弊端。它最大的特点是：服务器可以向客户端主动推动消息，客户端也可以主动向服务器推送消息。

- 原理：客户端向 WebSocket 服务器通知（notify）一个带有所有接收者ID（recipients IDs）的事件（event），服务器接收后立即通知所有活跃的（active）客户端，只有ID在接收者ID序列中的客户端才会处理这个事件。

- 特点：
  - 支持双向通信，实时性更强
  - 可以发送文本，也可以发送二进制数据
  - 建立在TCP协议之上，服务端的实现比较容易
  - 数据格式比较轻量，性能开销小，通信高效
  - 没有同源限制，客户端可以与任意服务器通信
  - 协议标识符是ws（如果加密，则为wss），服务器网址就是 URL
  - 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。