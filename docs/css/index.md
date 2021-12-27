## 盒模型

- 标准盒子模型(`content-box`)：宽度=内容的宽度（content）+ border + padding + margin

- 低版本 IE 盒子模型(`border-box`)：宽度=内容宽度（content+border+padding）+ margin

## 选择器

id 选择器、类选择器、标签选择器、相邻选择器、子选择器、后代选择器、通配符选择器、属性选择器、伪类选择器

## 优先级

- 元素、伪元素选择符： 1
- 类、伪类、属性选择符： 10
- id 选择符：100
- 内联样式：1000
- !important 声明的样式优先级最高，如果冲突再进行计算。

如果优先级相同，则选择最后出现的样式。<br/>
继承得到的样式的优先级最低。

## BFC

> 全称 `Block Formatting Context` 即块级格式上下文，简单的说，BFC 是页面上的一个隔离的独立容器，不受外界干扰或干扰外界

触发方式：

- float 的值不为 none（默认）

- overflow 的值不为 visible（默认）

- display 的值为 inline-block、table-cell、table-caption、grid

- position 的值为 absolute 或 fixed

应用场景:

- 清除浮动：BFC 内部的浮动元素会参与高度计算，因此可用于清除浮动，防止高度塌陷

- 避免某元素被浮动元素覆盖：BFC 的区域不会与浮动元素的区域重叠

- 阻止外边距重叠：属于同一个 BFC 的两个相邻 Box 的 margin 会发生折叠，不同 BFC 不会发生折叠

## CSS Modules

应用：Webpack 的 `css-loader` 插件： `style-loader!css-loader?modules`

原理：生成唯一的类名

优势：

- 解决全局命名冲突问题 `css modules` 只关心组件本身 命名唯一

- 模块化 可以使用 `composes` 来引入自身模块中的样式以及另一个模块的样式

- 解决嵌套层次过深的问题 使用扁平化的类名

## Sass

变量声明： `$var`

嵌套 CSS： `&`

导入 Sass：`@import`

混合器：`@mixin M($p){}` 使用 `@include()`

继承：`@extend：className`

## 移动端

距离单位：px、百分比、vw、vh、rem 等

媒体查询：`@media only screen and (max-device-width:480px)` {/css 样式/} // 页面头部必须有 meta 声明的 viewport

## Viewport

`width/height`，宽高，默认宽度 980px

`initial-scale`，初始缩放比例，1~10

`maximum-scale/minimum-scale`，允许用户缩放的最大/小比例

`user-scalable`，用户是否可以缩放 (yes/no)

## 初始化

> 由于浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对 CSS 初始化往往会出现浏览器之间的页面显示差异。

`Normalize.css`是一种`CSS reset`的替代方案，`Normalize.css` 保护了有价值的默认值、 修复了浏览器的 bug、不会让你的调试工具变的杂乱

## 清除浮动

- 父级 div 定义 height

- 最后一个浮动元素后加空 div 标签 并添加样式`clear:both`

- 对父元素添加伪元素`clear:both`

- 触发父元素 BFC

## Fixed 定位

什么时候会不相对于浏览器定位？

当元素祖先的 transform 属性非 none 时，容器由视口改为该祖先。

## 文本溢出

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
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

## Canvas 和 SVG

`Canvas`：是一种通过 JavaScript 来绘制 2D 图形的方法。Canvas 是逐像素来进行渲染的，因此当我们对 Canvas 进行缩放时，会出现锯齿或者失真的情况，特点：

- 不依赖分辨率
- 支持事件处理器
- 最适合带有大型渲染区域的应用程序（比如谷歌地图）
- 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
- 不适合游戏应用

`SVG`：是一种使用 XML 描述 2D 图形的语言。SVG 基于 XML，这意味着 SVG DOM 中的每个元素都是可用的。我们可以为某个元素附加 JavaScript 事件监听函数。并且 SVG 保存的是图形的绘制方法，因此当 SVG 图形缩放时并不会失真，特点：

- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像
- 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

## rAF

> 全称 `requestAnimationFrame`，请求桢动画。

实现动画效果的方法比较多，Javascript 中可以通过定时器 `setTimeout` 来实现，css3 可以使用 `transition` 和 `animation` 来实现，HTML5 中的 canvas 也可以实现。除此之外，HTML5 还提供一个专门用于请求动画的 API，那就是 `requestAnimationFrame` ，顾名思义就是请求动画帧

`window.requestAnimationFrame()` 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

优势：

CPU 节能：使用 `setTInterval` 实现的动画，当页面被隐藏或最小化时， `setTInterval` 仍然在后台执行动画任务，由于此时页面处于不可见或不可用状态，刷新动画是没有意义的，完全是浪费 CPU 资源。而 `requestAnimationFrame` 则完全不同，当页面处理未激活的状态下，该页面的屏幕刷新任务也会被系统暂停，因此跟着系统步伐走的 `requestAnimationFrame` 也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了 CPU 开销。

函数节流：在高频率事件( resize, scroll 等)中，为了防止在一个刷新间隔内发生多次函数执行， `requestAnimationFrame` 可保证每个刷新间隔内，函数只被执行一次，这样既能保证流畅性，也能更好的节省函数执行的开销，一个刷新间隔内函数执行多次时没有意义的，因为显示器每 16.7ms 刷新一次，多次绘制并不会在屏幕上体现出来。

减少 DOM 操作： `requestAnimationFrame` 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。

`setTimeout` 执行动画的缺点：

它通过设定间隔时间来不断改变图像位置，达到动画效果。但是容易出现卡顿、抖动的现象；原因是：

`setTimeout` 任务被放入异步队列，只有当主线程任务执行完后才会执行队列中的任务，因此实际执行时间总是比设定时间要晚；
`setTimeout` 的固定时间间隔不一定与屏幕刷新时间相同，会引起丢帧。

## 层叠顺序

> 层叠顺序，英文称作 `stacking orde`r，表示元素发生层叠时有着特定的垂直显示顺序。

盒模型的层叠规则：

1. 背景和边框：建立当前层叠上下文元素的背景和边框。
2. 负的 z-index：当前层叠上下文中，z-index 属性值为负的元素。
3. 块级盒：文档流内非行内级非定位后代元素。
4. 浮动盒：非定位浮动元素。
5. 行内盒：文档流内行内级非定位后代元素。
6. z-index:0：层叠级数为 0 的定位元素。
7. 正 z-index：z-index 属性值为正的定位元素。

## 两栏布局

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

## 三栏布局

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

## 水平垂直居中

- 居中元素定宽高
  - absolute + 负margin
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