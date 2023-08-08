# HTML

## src 和 href 的区别

**src 用于替换当前元素，href 用于在当前文档和引用资源之间确立联系。**

- src

src 是 `source` 的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求 src 资源时会将其指向的资源下载并应用到文档内，例如 js 脚本，img 图片和 frame 等元素。

```html
<script src =”js.js”></script>
```

当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js 脚本放在底部而不是头部。

- href

href 是 `Hypertext Reference` 的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果在文档中添加 

```html
<link href=”common.css” rel=”stylesheet”/>
```

那么浏览器会识别该文档为 css 文件，就会并行下载资源并且不会停止对当前文档的处理。 这也是为什么建议使用 link 方式来加载 css，而不是使用@import 方式。

## 对HTML语义化的理解

**语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）。通俗来讲就是用正确的标签做正确的事情。**

语义化的优点如下：
* 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录；
* 对开发者友好，使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。

常见的语义化标签：
```html
<header></header>  头部

<nav></nav>  导航栏

<section></section>  区块（有语义化的div）

<main></main>  主要区域

<article></article>  主要内容

<aside></aside>  侧边栏

<footer></footer>  底部
```

## DOCTYPE(⽂档类型) 的作⽤

DOCTYPE是HTML5中一种标准通用标记语言的文档类型声明，它的目的是**告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档**，不同的渲染模式会影响浏览器对 CSS 代码甚⾄ JavaScript 脚本的解析。它必须声明在HTML⽂档的第⼀⾏。

浏览器渲染页面的两种模式（可通过document.compatMode获取）：
* **`CSS1Compat`：标准模式（Strick mode）**，默认模式，浏览器使用W3C的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面。
* **`BackCompat`：怪异模式(混杂模式)(Quick mode)**，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示。

## script标签中defer和async的区别

如果没有defer或async属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载。

下图可以直观的看出三者之间的区别:

![/images/](/images/script.png)

其中蓝色代表js脚本网络加载时间，红色代表js脚本执行时间，绿色代表html解析。

**defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析**，其区别如下：
* **执行顺序**：
  * 多个带async属性的标签，不能保证加载的顺序；
  * 多个带defer属性的标签，按照加载顺序执行；
* **脚本是否并行执行**：
  * async属性，表示**后续文档的加载和执行与js脚本的加载和执行是并行进行的**，即异步执行；
  * defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本需要等到文档所有元素解析完成之后才执行，DOMContentLoaded事件触发执行之前。

## 常⽤的meta标签有哪些

`meta` 标签由 `name` 和 `content` 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了HTTP标准固定了一些name作为大家使用的共识，开发者还可以自定义name。

常用的meta标签：

1. charset，用来描述HTML文档的编码类型：
```html
<meta charset="UTF-8" >
```
2. keywords，页面关键词：
```html
<meta name="keywords" content="关键词" />
```
3. description，页面描述：
```html
<meta name="description" content="页面描述内容" />
```
4. refresh，页面重定向和刷新：
```html
<meta http-equiv="refresh" content="0;url=" />
```
5. viewport，适配移动端，可以控制视口的大小和比例：
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```
其中，content 参数有以下几种：
* width viewport：宽度(数值/device-width)
* height viewport：高度(数值/device-height)
* initial-scale：初始缩放比例
* maximum-scale：最大缩放比例
* minimum-scale：最小缩放比例
* user-scalable：是否允许用户缩放(yes/no）
6. 搜索引擎索引方式：
```html
<meta name="robots" content="index,follow" />
```
其中，content 参数有以下几种：
* all：文件将被检索，且页面上的链接可以被查询；
* none：文件将不被检索，且页面上的链接不可以被查询；
* index：文件将被检索；
* follow：页面上的链接可以被查询；
* noindex：文件将不被检索；
* nofollow：页面上的链接不可以被查询。

## HTML5有哪些更新

1. **语义化标签**
* header：定义文档的页眉（头部）；
* nav：定义导航链接的部分；
* footer：定义文档或节的页脚（底部）；
* article：定义文章内容；
* section：定义文档中的节（section、区段）；
* aside：定义其所处内容之外的内容（侧边）

2. **媒体标签**
* audio：音频
  ```html
  <audio src='' controls autoplay loop='true'></audio>
  ```
  属性：
  * controls 控制面板
  * autoplay 自动播放
  * loop=‘true’ 循环播放

* video视频
  ```html
  <video src='' poster='imgs/aa.jpg' controls></video>
  ```
  属性：
  * poster：指定视频还没有完全下载完毕，或者用户还没有点击播放前显示的封面。默认显示当前视频文件的第一针画面，当然通过poster也可以自己指定。
  * controls 控制面板
  * width
  * height

* source标签
  ```html
  <video>
    <source src='aa.flv' type='video/flv'></source>
    <source src='aa.mp4' type='video/mp4'></source>
  </video>
  ```
  因为浏览器对视频格式支持程度不一样，为了能够兼容不同的浏览器，可以通过source来指定视频源。

3. **表单**

**表单类型**：
* email ：能够验证当前输入的邮箱地址是否合法
* url ： 验证URL
* number ： 只能输入数字，其他输入不了，而且自带上下增大减小箭头，max属性可以设置为最大值，min可以设置为最小值，value为默认值。
* search ： 输入框后面会给提供一个小叉，可以删除输入的内容，更加人性化。
* range ： 可以提供给一个范围，其中可以设置max和min以及value，其中value属性可以设置为默认值
* color ： 提供了一个颜色拾取器
* time ： 时分秒
* date ： 日期选择年月日
* datatime ： 时间和日期(目前只有Safari支持)
* datatime-local ：日期时间控件
* week ：周控件
* month：月控件

**表单属性**：
* placeholder ：提示信息
* autofocus ：自动获取焦点
* autocomplete=“on” 或者 autocomplete=“off” 使用这个属性需要有两个前提：
  * 表单必须提交过
  * 必须有name属性。
* required：要求输入框不能为空，必须有值才能够提交。
* pattern=" " 里面写入想要的正则模式，例如手机号patte="^(+86)?\d{10}$"
* multiple：可以选择多个文件或者多个邮箱
* form=" form表单的ID"

**表单事件**：
* oninput 每当input里的输入框内容发生变化都会触发此事件。
* oninvalid 当验证不通过时触发此事件。

4. **进度条、度量器**
* progress标签：用来表示任务的进度（IE、Safari不支持），max用来表示任务的进度，value表示已完成多少
* meter属性：用来显示剩余容量或剩余库存（IE、Safari不支持）
  * high/low：规定被视作高/低的范围
  * max/min：规定最大/小值
  * value：规定当前度量值

设置规则：min < low < high < max

5. **DOM查询操作**
* `document.querySelector()`
* `document.querySelectorAll()`

6. **Web存储**
HTML5 提供了两种在客户端存储数据的新方法：
* `localStorage` - 没有时间限制的数据存储
* `sessionStorage` - 针对一个 session 的数据存储

7. **其它**
  * **拖放**：拖放是一种常见的特性，即抓取对象以后拖到另一个位置。设置元素可拖放：
  * **画布（canvas）**： canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
  * **SVG**：SVG 指可伸缩矢量图形，用于定义用于网络的基于矢量的图形，使用 XML 格式定义图形，图像在放大或改变尺寸的情况下其图形质量不会有损失，它是万维网联盟的标准
  * **地理定位**：Geolocation（地理定位）用于定位用户的位置。

## img的srcset属性的作⽤