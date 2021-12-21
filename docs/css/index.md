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

> 全称 Block Formatting Context 即块级格式上下文，简单的说，BFC 是页面上的一个隔离的独立容器，不受外界干扰或干扰外界

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

`width/height`，宽高，默认宽度980px

`initial-scale`，初始缩放比例，1~10

`maximum-scale/minimum-scale`，允许用户缩放的最大/小比例

`user-scalable`，用户是否可以缩放 (yes/no)

## 初始化

> 由于浏览器的兼容问题，不同浏览器对有些标签的默认值是不同的，如果没对CSS初始化往往会出现浏览器之间的页面显示差异。

`Normalize.css`是一种`CSS reset`的替代方案，`Normalize.css` 保护了有价值的默认值、 修复了浏览器的bug、不会让你的调试工具变的杂乱

## 清除浮动

- 父级div定义height

- 最后一个浮动元素后加空div标签 并添加样式`clear:both`

- 对父元素添加伪元素`clear:both`

- 触发父元素BFC

## Fixed定位

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

## Canvas和SVG

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

