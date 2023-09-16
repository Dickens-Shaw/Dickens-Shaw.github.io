# CSS

## 一、CSS 基础

### 1. CSS 选择器及其优先级

| 选择器         | 格式          | 优先级权重 |
| -------------- | ------------- | ---------- |
| id 选择器      | #id           | 100        |
| 类选择器       | .classname    | 10         |
| 属性选择器     | a[ref=“eee”]  | 10         |
| 伪类选择器     | li:last-child | 10         |
| 标签选择器     | div           | 1          |
| 伪元素选择器   | li:after      | 1          |
| 相邻兄弟选择器 | h1+p          | 0          |
| 子选择器       | ul>li         | 0          |
| 后代选择器     | li a          | 0          |
| 通配符选择器   | \*            | 0          |

- 元素、伪元素选择器： 1
- 类、伪类、属性选择器： 10
- id 选择器：100
- 内联样式：1000

**注意：**

- !important 声明的样式优先级最高，如果冲突再进行计算。
- 如果优先级相同，则选择最后出现的样式。
- 继承得到的样式的优先级最低。
- 通用选择器（\*）、子选择器（>）和相邻同胞选择器（+）并不在这四个等级中，所以它们的权值都为 0
- 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。

### 2. link 和 @import 的区别

两者都是外部引用 CSS 的方式，它们的区别如下：

- link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；@import 属于 CSS 范畴，只能加载 CSS。
- link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完全载入以后加载。
- link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低版本的浏览器不支持。
- link 支持使用 Javascript 控制 DOM 去改变样式；而@import 不支持。

### 3. 盒模型

- 标准盒模型(`content-box`)：宽度=内容的宽度（content）+ border + padding + margin
- 低版本 IE 盒(怪异)模型(`border-box`)：宽度=内容宽度（content+border+padding）+ margin

### 4. 使⽤ translate 改变位置

translate 是 transform 属性的⼀个值。改变 transform 或 opacity 不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。⽽改变绝对定位会触发重新布局，进⽽触发重绘和复合。

transform 使浏览器为元素创建⼀个 GPU 图层，但改变绝对定位会使⽤到 CPU。 因此 translate()更⾼效，可以缩短平滑动画的绘制时间。 ⽽ translate 改变位置时，元素依然会占据其原始空间，绝对定位就不会发⽣这种情况。

### 5. CSS3 新特性

- 新增各种 CSS 选择器 （: not(.input)：所有 class 不是“input”的节点）
- 圆角 （border-radius:8px）
- 多列布局 （multi-column layout）
- 阴影和反射 （Shadoweflect）
- 文字特效 （text-shadow）
- 文字渲染 （Text-decoration）
- 线性渐变 （gradient）
- 旋转 （transform）
- 增加了旋转,缩放,定位,倾斜,动画,多背景

### 6. 物理 / 逻辑 / 像素密度

以 iPhone XS 为例，当写 CSS 代码时，针对于单位 px，其宽度为 414px & 896px，也就是说当赋予一个 DIV 元素宽度为 414px，这个 DIV 就会填满手机的宽度；

而如果有一把尺子来实际测量这部手机的物理像素，实际为 1242\*2688 物理像素；经过计算可知，1242/414=3，也就是说，在单边上，一个逻辑像素=3 个物理像素，就说这个屏幕的像素密度为 3，也就是常说的 3 倍屏。

对于图片来说，为了保证其不失真，1 个图片像素至少要对应一个物理像素，假如原始图片是 500300 像素，那么在 3 倍屏上就要放一个 1500900 像素的图片才能保证 1 个物理像素至少对应一个图片像素，才能不失真。

当然，也可以针对所有屏幕，都只提供最高清图片。虽然低密度屏幕用不到那么多图片像素，而且会因为下载多余的像素造成带宽浪费和下载延迟，但从结果上说能保证图片在所有屏幕上都不会失真。

还可以使用 CSS 媒体查询来判断不同的像素密度，从而选择不同的图片:

```css
my-image {
  background: (low.png);
}

@media only screen and (min-device-pixel-ratio: 1.5) {
  #my-image {
    background: (high.png);
  }
}
```

### 7. CSS 优化和提高性能

**加载性能：**

1. css 压缩：将写好的 css 进行打包压缩，可以减小文件体积。
2. css 单一样式：当需要下边距和左边距的时候，很多时候会选择使用 margin:top 0 bottom 0；但 margin-bottom:bottom;margin-left:left;执行效率会更高。
3. 减少使用@import，建议使用 link，因为后者在页面加载时一起加载，前者是等待页面加载完成之后再进行加载。

**选择器性能：**

1. 关键选择器（key selector）。选择器的最后面的部分为关键选择器-即用来匹配目标元素的部分。CSS 选择符是从右到左进行匹配的。当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等；
2. 如果规则拥有 ID 选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则-这样样式系统就不会浪费时间去匹配它们了。
3. 避免使用通配规则，如\*{}计算次数惊人，只对需要用到的元素进行选择。
4. 尽量少的去对标签进行选择，而是用 class。
5. 尽量少的去使用后代选择器，降低选择器的权重值。后代选择器的开销是最高的，尽量将选择器的深度降到最低，最高不要超过三层，更多的使用类来关联每一个标签元素。
6. 了解哪些属性是可以通过继承而来的，然后避免对这些属性重复指定规则。

**渲染性能：**

1. 慎重使用高性能属性：浮动、定位。
2. 尽量减少页面重排、重绘。
3. 去除空规则：｛｝。空规则的产生原因一般来说是为了预留样式。去除这些空规则无疑能减少 css 文档体积。
4. 属性值为 0 时，不加单位。
5. 属性值为浮动小数 0.\*\*，可以省略小数点之前的 0。
6. 标准化各种浏览器前缀：带浏览器前缀的在前。标准属性在后。
7. 不使用@import 前缀，它会影响 css 的加载速度。
8. 选择器优化嵌套，尽量避免层级过深。
9. css 雪碧图，同一页面相近部分的小图标，方便使用，减少页面的请求次数，但是同时图片本身会变大，使用时，优劣考虑清楚，再使用。
10. 正确使用 display 的属性，由于 display 的作用，某些样式组合会无效，徒增样式体积的同时也影响解析性能。
11. 不滥用 web 字体。对于中文网站来说 WebFonts 可能很陌生，国外却很流行。web fonts 通常体积庞大，而且一些浏览器在下载 web fonts 时会阻塞页面渲染损伤性能。

**可维护性、健壮性：**

1. 将具有相同属性的样式抽离出来，整合并通过 class 在页面中进行使用，提高 css 的可维护性。
2. 样式与内容分离：将 css 代码定义到外部 css 中。

### 8. CSS 预处理器 / 后处理器

**预处理器**，如：`less`，`sass`，`stylus`，用来预编译`sass`或者`less`，增加了 css 代码的复用性。层级，`mixin`， 变量，循环， 函数等对编写以及开发 UI 组件都极为方便。

**后处理器**， 如： `postCss`，通常是在完成的样式表中根据 css 规范处理 css，让其更加有效。目前最常做的是给 css 属性添加浏览器私有前缀，实现跨浏览器兼容性的问题。

css 预处理器为 css 增加一些编程特性，无需考虑浏览器的兼容问题，可以在 CSS 中使用变量，简单的逻辑程序，函数等在编程语言中的一些基本的性能，可以让 css 更加的简洁，增加适应性以及可读性，可维护性等。

其它 css 预处理器语言：`Sass（Scss）, Less, Stylus, Turbine, Swithch css, CSS Cacheer, DT Css`。

使用原因：

- 结构清晰， 便于扩展
- 可以很方便的屏蔽浏览器私有语法的差异
- 可以轻松实现多重继承
- 完美的兼容了 CSS 代码，可以应用到老项目中

### 9. 文本溢出

- 单行

```css
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

- 多行

```css
.ellipsis-2 {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
```

### 10. 媒体查询

媒体查询由⼀个可选的媒体类型和零个或多个使⽤媒体功能的限制了样式表范围的表达式组成，例如宽度、⾼度和颜⾊。媒体查询，添加⾃ CSS3，允许内容的呈现针对⼀个特定范围的输出设备⽽进⾏裁剪，⽽不必改变内容本身，适合 web ⽹⻚应对不同型号的设备⽽做出对应的响应适配。

媒体查询包含⼀个可选的媒体类型和满⾜ CSS3 规范的条件下，包含零个或多个表达式，这些表达式描述了媒体特征，最终会被解析为 true 或 false。如果媒体查询中指定的媒体类型匹配展示⽂档所使⽤的设备类型，并且所有的表达式的值都是 true，那么该媒体查询的结果为 true。那么媒体查询内的样式将会⽣效。

```html
<!-- link元素中的CSS媒体查询 -->
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
<!-- 样式表中的CSS媒体查询 -->
<style>
  @media (max-width: 600px) {
    .facet_sidebar {
      display: none;
    }
  }
</style>
```

简单来说，使用 @media 查询，可以针对不同的媒体类型定义不同的样式。@media 可以针对不同的屏幕尺寸设置不同的样式，特别是需要设置设计响应式的页面，@media 是非常有用的。当重置浏览器大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。

### 11. CSS Modules

应用：Webpack 的 `css-loader` 插件： `style-loader!css-loader?modules`

原理：生成唯一的类名

优势：

- 解决全局命名冲突问题 `css modules` 只关心组件本身 命名唯一
- 模块化 可以使用 `composes` 来引入自身模块中的样式以及另一个模块的样式
- 解决嵌套层次过深的问题 使用扁平化的类名

webpack 处理 CSS:

- css-loader：导入 CSS 模块，对 CSS 代码进行编译处理；
- style-loader：创建 style 标签，把 CSS 内容写入标签。

在实际使用中，css-loader 的执行顺序一定要安排在 style-loader 的前面。因为只有完成了编译过程，才可以对 css 代码进行插入；若提前插入了未编译的代码，那么 webpack 是无法理解这坨东西的，它会无情报错

### 12. requestAnimationFrame

> 全称 `requestAnimationFrame`，请求桢动画。

实现动画效果的方法比较多，Javascript 中可以通过定时器 `setTimeout` 来实现，css3 可以使用 `transition` 和 `animation` 来实现，HTML5 中的 canvas 也可以实现。除此之外，HTML5 还提供一个专门用于请求动画的 API，那就是 `requestAnimationFrame` ，顾名思义就是**请求动画帧**

> `window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

**语法：** window.requestAnimationFrame(callback); 其中，callback 是下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。该回调函数会被传入 DOMHighResTimeStamp 参数，它表示 requestAnimationFrame() 开始去执行回调函数的时刻。该方法属于**宏任务**，所以会在执行完微任务之后再去执行。

**取消动画：** 使用 cancelAnimationFrame()来取消执行动画，该方法接收一个参数——requestAnimationFrame 默认返回的 id，只需要传入这个 id 就可以取消动画了。

```js
var globalID;
function animate() {
  // done(); 一直运行
  globalID = requestAnimationFrame(animate); // Do something animate
}
globalID = requestAnimationFrame(animate); //开始
cancelAnimationFrame(globalID); //结束
```

**优势：**

- **CPU 节能**：使用 `setTInterval` 实现的动画，当页面被隐藏或最小化时， `setTInterval` 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费 CPU 资源。而 `requestAnimationFrame` 则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的 `requestAnimationFrame` 也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销。
- **函数节流**：在高频率事件( resize, scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行， `requestAnimationFrame` 可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销，一个刷新间隔内函数执行多次时没有意义的，因为显示器每 16.7ms 刷新一次，多次绘制并不会在屏幕上体现出来。
- **减少 DOM 操作**： `requestAnimationFrame` 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。

**Polyfill:**

```js
window._requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
```
`setTimeout` 执行动画的缺点：它通过设定间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿、抖动的现象；原因是：

- `setTimeout` 任务被放入异步队列，只有当主线程任务执行完后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；
- `setTimeout` 的固定时间间隔不一定与屏幕刷新时间相同，会引起丢帧。

**应用场景：**

1. 监听 scroll 函数

```js
$(window).on('scroll', function () {
  window.requestAnimationFrame(scrollHandler);
});
```

2. 平滑滚动到页面顶部

```js
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};
scrollToTop();
```

3. 大量数据渲染
4. 监控卡顿方法： 每秒中计算一次网页的 FPS，获得一列数据，然后分析。通俗地解释就是，通过 requestAnimationFrame API 来定时执行一些 JS 代码，如果浏览器卡顿，无法很好地保证渲染的频率，1s 中 frame 无法达到 60 帧，即可间接地反映浏览器的渲染帧率。

## 二、页面布局

### 1. 两栏布局

```html
<div class="wrap">
  <div class="left">左侧固定内容</div>
  <div class="right">右侧内容自适应</div>
</div>
```

- 浮动

```css
.wrap {
  overflow: hidden;
}
.left {
  float: left;
  width: 200px;
}
.right {
  margin-left: 200px;
}
```

- 绝对定位

```css
.wrap {
  position: relative;
}
.left {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
}
.right {
  margin-left: 200px;
}
```

- Table

```css
.wrap {
  display: table;
  width: 100%;
}
.left {
  display: table-cell;
  width: 200px;
}
.right {
  display: table-cell;
}
```

- calc 函数

```css
/* 也可结合display:inline-block, wrap需设置font-size:0*/
.wrap {
  overflow: hidden;
}
.left {
  float: left;
  width: 200px;
}
.right {
  float: left;
  width: calc(100% - 200px);
}
```

- flex

```css
.wrap {
  display: flex;
}
.left {
  width: 200px;
}
.right {
  flex: 1;
}
```

- grid

```css
.wrap {
  display: grid;
  grid-template-columns: 200px 1fr;
}
```

### 2. 三栏布局

```html
<div class="wrap">
  <!-- float实现：DOM顺序为 左右中 -->
  <div class="left">左侧固定内容</div>
  <div class="center">中间自适应</div>
  <div class="right">右侧固定内容</div>
</div>
```

- 浮动

```css
.wrap {
  overflow: hidden;
}
.left {
  float: left;
  width: 200px;
}
.center {
  margin-left: 300px;
  margin-right: 300px;
}
.right {
  float: right;
  margin-left: 200px;
}
```

- 绝对定位

```css
.wrap {
  position: relative;
}
.left {
  position: absolute;
  left: 0;
  width: 200px;
}
.center {
  position: absolute;
  left: 200px;
  right: 200px;
}
.right {
  position: absolute;
  right: 0;
  width: 200px;
}
```

- Table

```css
.wrap {
  display: table;
  width: 100%;
}
.left {
  display: table-cell;
  width: 200px;
}
.center {
  display: table-cell;
}
.right {
  display: table-cell;
  width: 200px;
}
```

- flex

```css
.wrap {
  display: flex;
}
.left {
  width: 200px;
}
.center {
  flex: 1;
}
.right {
  width: 200px;
}
```

- grid

```css
.wrap {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```

### 3. 水平垂直居中

### 4. Flex 布局

Flex 是`FlexibleBox`的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。任何一个容器都可以指定为 Flex 布局。行内元素也可以使用 Flex 布局。注意，设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。

采用 Flex 布局的元素，称为 Flex 容器`（flex container）`，简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目`（flex item）`，简称"项目"。容器默认存在两根轴：水平的主轴`（main axis）`和垂直的交叉轴`（cross axis）`，项目默认沿水平主轴排列。

以下 6 个属性设置在**容器**上：

- flex-direction 属性决定主轴的方向（即项目的排列方向）。
- flex-wrap 属性定义，如果一条轴线排不下，如何换行。
- flex-flow 属性是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap。
- justify-content 属性定义了项目在主轴上的对齐方式。
- align-items 属性定义项目在交叉轴上如何对齐。
- align-content 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

以下 6 个属性设置在**项目**上：

- order 属性定义项目的排列顺序。数值越小，排列越靠前，默认为 0。
- flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
- flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
- flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。
- flex 属性是 flex-grow，flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。
- align-self 属性允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

简单来说：
flex 布局是 CSS3 新增的一种布局方式，可以通过将一个元素的 display 属性值设置为 flex 从而使它成为一个 flex 容器，它的所有子元素都会成为它的项目。一个容器默认有两条轴：一个是水平的主轴，一个是与主轴垂直的交叉轴。可以使用 flex-direction 来指定主轴的方向。可以使用 justify-content 来指定元素在主轴上的排列方式，使用 align-items 来指定元素在交叉轴上的排列方式。还可以使用 flex-wrap 来规定当一行排列不下时的换行方式。对于容器中的项目，可以使用 order 属性来指定项目的排列顺序，还可以使用 flex-grow 来指定当排列空间有剩余的时候，项目的放大比例，还可以使用 flex-shrink 来指定当排列空间不足时，项目的缩小比例。

### 5. flex: 1

flex 属性是`flex-grow，flex-shrink和flex-basis`的简写，默认值为 0 1 auto。flex:1 表示 flex: 1 1 0%：

- 第一个参数表示: `flex-grow` 定义项目的**放大比例**，默认为 0，即如果存在剩余空间，也不放大；
- 第二个参数表示: `flex-shrink` 定义了项目的**缩小比例**，默认为 1，即如果空间不足，该项目将缩小；
- 第三个参数表示: `flex-basis` **给上面两个属性分配多余空间之前, 计算项目是否有多余空间**, 默认值为 auto, 即项目本身的大小。

- 居中元素定宽高

  - absolute + 负 margin
  - absolute + margin auto
  - absolute + calc

- 居中元素不定宽高
  - absolute + transform
  - line-height
  - writing-mode
  - table
  - css-table
  - flex
  - grid

### 6. 响应式设计的概念及原理

响应式网站设计 `（Responsive Web design）`是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

关于原理： 基本原理是通过媒体查询`（@media）`查询检测不同的设备屏幕尺寸做处理。
关于兼容： 页面头部必须有 mate 声明的`viewport`。

```html
<meta
  name="’viewport’"
  content="”width=device-width,"
  initial-scale="1."
  maximum-scale="1,user-scalable=no”"
/>
```

**常见 Viewport：**

- `width/height`，宽高，默认宽度 980px
- `initial-scale`，初始缩放比例，1~10
- `maximum-scale/minimum-scale`，允许用户缩放的最大/小比例
- `user-scalable`，用户是否可以缩放 (yes/no)

## 三、定位与浮动

### 1. 清除浮动

**浮动的定义：**

非 IE 浏览器下，容器不设高度且子元素浮动时，容器高度不能被内容撑开。 此时，内容会溢出到容器外面而影响布局。这种现象被称为浮动（溢出）。

**浮动的工作原理：**

- 浮动元素脱离文档流，不占据空间（引起“高度塌陷”现象）
- 浮动元素碰到包含它的边框或者其他浮动元素的边框停留

浮动元素可以左右移动，直到遇到另一个浮动元素或者遇到它外边缘的包含框。浮动框不属于文档流中的普通流，当元素浮动之后，不会影响块级元素的布局，只会影响内联元素布局。此时文档流中的普通流就会表现得该浮动框不存在一样的布局模式。当包含框的高度小于浮动框的时候，此时就会出现“高度塌陷”。

**浮动元素引起的问题？**

- 父元素的高度无法被撑开，影响与父元素同级的元素
- 与浮动元素同级的非浮动元素会跟随其后
- 若浮动的元素不是第一个元素，则该元素之前的元素也要浮动，否则会影响页面的显示结构

**清除浮动的方式如下：**

- 给父级 div 定义 height 属性
- 最后一个浮动元素之后添加一个空的 div 标签，并添加 clear:both 样式
- 包含浮动元素的父级标签添加 overflow:hidden 或者 overflow:auto
- 使用 :after 伪元素。由于 IE6-7 不支持 :after，使用 zoom:1 触发 hasLayout\*\*

```css
.clearfix:after {
  content: '\200B';
  display: table;
  height: 0;
  clear: both;
}
.clearfix {
  *zoom: 1;
}
```

### 2. BFC

块格式化上下文 `Block Formatting Context` 是 Web 页面的可视化 CSS 渲染的一部分，是布局过程中生成块级盒子的区域，也是浮动元素与其他元素的交互限定区域。

通俗来讲：BFC 是一个独立的布局环境，可以理解为一个容器，在这个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物品。如果一个元素符合触发 BFC 的条件，则 BFC 中的元素布局不受外部影响。

**创建 BFC 的条件：**

- 根元素：body；
- 元素设置浮动：float 除 none 以外的值；
- 元素设置绝对定位：position (absolute、fixed)；
- display 值为：inline-block、table-cell、table-caption、flex 等；
- overflow 值为：hidden、auto、scroll；

**BFC 的特点：**

- 垂直方向上，自上而下排列，和文档流的排列方式一致。
- 在 BFC 中上下相邻的两个容器的 margin 会重叠
- 计算 BFC 的高度时，需要计算浮动元素的高度
- BFC 区域不会与浮动的容器发生重叠
- BFC 是独立的容器，容器内部元素不会影响外部元素
- 每个元素的左 margin 值和容器的左 border 相接触

**BFC 的作用：**

- **解决 margin 的重叠问题**：由于 BFC 是一个独立的区域，内部的元素和外部的元素互不影响，将两个元素变为两个 BFC，就解决了 margin 重叠的问题。
- **解决高度塌陷的问题**：在对子元素设置浮动后，父元素会发生高度塌陷，也就是父元素的高度变为 0。解决这个问题，只需要把父元素变成一个 BFC。常用的办法是给父元素设置 overflow:hidden。
- **创建自适应两栏布局**：可以用来创建自适应两栏布局：左边的宽度固定，右边的宽度自适应。

### 3. 层叠顺序

> 层叠顺序，英文称作 `stacking order`，表示元素发生层叠时有着特定的垂直显示顺序。

![/images/](/images/stackingOrder.png 'stacking order')

**盒模型的层叠规则：**

1. 背景和边框：建立当前层叠上下文元素的背景和边框。
2. 负的 z-index：当前层叠上下文中，z-index 属性值为负的元素。
3. 块级盒：文档流内非行内级非定位后代元素。
4. 浮动盒：非定位浮动元素。
5. 行内盒：文档流内行内级非定位后代元素。
6. z-index:0：层叠级数为 0 的定位元素。
7. 正 z-index：z-index 属性值为正的定位元素。

z-index 元素的 position 属性需要是 relative，absolute 或是 fixed。

**z-index 属性在什么情况下会失效:**

1. 父元素 position 为 relative 时，子元素的 z-index 失效。解决：父元素 position 改为 absolute 或 static；
2. 元素没有设置 position 属性为非 static 属性。解决：设置该元素的 position 属性为 relative，absolute 或是 fixed 中的一种；
3. 元素在设置 z-index 的同时还设置了 float 浮动。解决：float 去除，改为 display：inline-block；

### 4. fixed 不相对于浏览器定位

当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先。

## 四、场景应用

### 1. 样式初始化

> 由于浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异。

`Normalize.css`是一种`CSS reset`的替代方案，`Normalize.css` 保护了有价值的默认值、 修复了浏览器的 bug、不会让你的调试工具变的杂乱

### 2. 如何解决 1px 问题？

1px 问题指的是：在一些 `Retina屏幕` 的机型上，移动端页面的 1px 会变得很粗，呈现出不止 1px 的效果。原因很简单——CSS 中的 1px 并不能和移动设备上的 1px 划等号。它们之间的比例关系有一个专门的属性来描述：

> 像素比 window.devicePixelRatio = 设备的物理像素 / CSS 像素

打开 Chrome 浏览器，启动移动端调试模式，在控制台去输出这个 devicePixelRatio 的值。这里选中 iPhone6/7/8 这系列的机型，输出的结果就是 2

这就意味着设置的 1px CSS 像素，在这个设备上实际会用 2 个物理像素单元来进行渲染，所以实际看到的一定会比 1px 粗一些。

解决方案：

1. **直接写 0.5px**

如果之前 1px 的样式这样写：

```css
border: 1px solid #333;
```

可以先在 JS 中拿到 window.devicePixelRatio 的值，然后把这个值通过 JSX 或者模板语法给到 CSS 的 data 里，达到这样的效果（这里用 JSX 语法做示范）：

```jsx
<div id="container" data-device={{window.devicePixelRatio}}></div>
```

然后就可以在 CSS 中用属性选择器来命中 devicePixelRatio 为某一值的情况，比如说这里尝试命中 devicePixelRatio 为 2 的情况：

```css
#container[data-device='2'] {
  border: 0.5px solid #333;
}
```

直接把 1px 改成 1/devicePixelRatio 后的值，这是目前为止最简单的一种方法。这种方法的缺陷在于兼容性不行，IOS 系统需要 8 及以上的版本，安卓系统则直接不兼容。

2. **伪元素先放大后缩小**
   
这个方法的可行性会更高，兼容性也更好。唯一的缺点是代码会变多。

思路是先放大、后缩小：

在目标元素的后面追加一个 ::after 伪元素，让这个元素布局为 absolute 之后、整个伸展开铺在目标元素上
然后把它的宽和高都设置为目标元素的两倍，border 值设为 1px。
接着借助 CSS 动画特效中的放缩能力，把整个伪元素缩小为原来的 50%。
此时，伪元素的宽高刚好可以和原有的目标元素对齐，而 border 也缩小为了 1px 的二分之一，间接地实现了 0.5px 的效果

```css
#container[data-device="2"] {
    position: relative;
}
#container[data-device="2"]::after{
      position:absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      content:"";
      transform: scale(0.5);
      transform-origin: left top;
      box-sizing: border-box;
      border: 1px solid #333;
    }
}
```

3. **viewport 缩放来解决**

这个思路就是对 meta 标签里几个关键属性下手：

```html
<meta
  name="viewport"
  content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no"
/>
```

这里针对像素比为 2 的页面，把整个页面缩放为了原来的 1/2 大小。这样，本来占用 2 个物理像素的 1px 样式，现在占用的就是标准的一个物理像素。根据像素比的不同，这个缩放比例可以被计算为不同的值，用 js 代码实现如下：

```js
const scale = 1 / window.devicePixelRatio;
// 这里 metaEl 指的是 meta 标签对应的 Dom
metaEl.setAttribute(
  'content',
  `width=device-width,user-scalable=no,initial-scale=${scale},maximum-scale=${scale},minimum-scale=${scale}`
);
```

这样解决了，但这样做的副作用也很大，整个页面被缩放了。这时 1px 已经被处理成物理像素大小，这样的大小在手机上显示边框很合适。但是，一些原本不需要被缩小的内容，比如文字、图片等，也被无差别缩小掉了
