<!--
 * @Author: Shaw
 * @Date: 2021-06-16 10:31:03
 * @Description: HTML规范
 * @LastEditors: Shaw
 * @LastEditTime: 2021-06-16 16:17:34
-->

# HTML 规范

## HTML 类型

推荐使用 HTML5 的文档类型申明：

- doctype 大写
  > 在页面开头使用这个简单地 doctype 来启用标准模式，使其在每个浏览器中尽可能一致的展现；虽然 doctype 不区分大小写，但是按照惯例，doctype 大写
- IE 兼容模式
  > 用 <meta> 标签可以指定页面应该用什么版本的 IE 来渲染；
- 规定字符编码
  > 通过声明一个明确的字符编码，让浏览器轻松、快速的确定适合网页内容的渲染方式，通常指定为'UTF-8'。
- lang 属性
  > 应在 html 标签上加上 lang 属性。这会给语音工具和翻译工具帮助，告诉它们应当怎么去发音和翻译。如：en-us, zh-cn

```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta charset="UTF-8" />
    <title>Page title</title>
  </head>
  <body>
    <img src="images/company-logo.png" alt="Company" />
  </body>
</html>
```

## 语法

- 缩进使用 soft tab（4 个空格）；
- 嵌套的节点应该缩进；
- 在属性上，使用双引号，不要使用单引号；
- 属性名全小写，用中划线做分隔符；
- 不要在自动闭合标签结尾处使用斜线；
- 不要忽略可选的关闭标签，例：`</li>` 和 `</body>`。

## 缩进

缩进使用 2 个空格（一个 tab），嵌套的节点应该缩进。

## 分块注释

在每一个块状元素，列表元素和表格元素后，加上一对 HTML 注释。

## 语义化标签

HTML5 中新增很多语义化标签，所以优先使用语义化标签，避免一个页面都是 div 或者 p 标签。

正例:

```html
<header></header>
<footer></footer>
```

反例:

```html
<div>
  <p></p>
</div>
```

## alt 标签不为空

`<img>`标签的 alt 属性指定了替代文本，用于在图像无法显示或者用户禁用图像显示时，代替图像显示在浏览器中的内容。

假设由于下列原因用户无法查看图像，alt 属性可以为图像提供替代的信息：

- 网速太慢
- src 属性中的错误
- 浏览器禁用图像
- 用户使用的是屏幕阅读器

从 SEO 角度考虑，浏览器的爬虫爬不到图片的内容，所以我们要有文字告诉爬虫图片的内容

## 结构、表现、行为三者分离

尽量在文档和模板中只包含结构性的 HTML；而将所有表现代码，移入样式表中；将所有动作行为，移入脚本之中。

在此之外，为使得它们之间的联系尽可能的小，在文档和模板中也尽量少地引入样式和脚本文件。

建议：

- 不使用超过一到两张样式表
- 不使用超过一到两个脚本（学会用合并脚本）
- 不使用行内样式（`<style>.no-good {}</style>`）
- 不在元素上使用 style 属性（`<hr style="border-top: 5px solid black">`）
- 不使用行内脚本（`<script>alert('no good')</script>`）
- 不使用表象元素（`i.e. <b>, <u>, <center>, <font>, <b>`）
- 不使用表象 class 名（`i.e. red, left, center`）

## 只关注内容

- HTML 只显示展示内容信息
- 不要引入一些特定的 HTML 结构来解决一些视觉设计问题
- 不要将 img 元素当做专门用来做视觉设计的元素
- 样式上的问题应该使用 css 解决

## 引号

使用双引号(" ") 而不是单引号(’ ') 。

## 引入 CSS,JS

根据 HTML5 规范, 通常在引入 CSS 和 JS 时不需要指明 type，因为 text/css 和 text/javascript 分别是他们的默认值。

```html
<!-- External CSS -->
<link rel="stylesheet" href="code_guide.css" />

<!-- In-document CSS -->
<style></style>

<!-- External JS -->
<script src="code_guide.js"></script>

<!-- In-document JS -->
<script>
  ...
</script>
```

## 属性顺序

属性应该按照特定的顺序出现以保证易读性；

- `class`
- `id`
- `name`
- `data-*`
- `src, for, type, href, value , max-length, max, min, pattern`
- `placeholder, title, alt`
- `aria-*, role`
- `required, readonly, disabled`

class 是为高可复用组件设计的，所以应处在第一位；

id 更加具体且应该尽量少使用，所以将它放在第二位。

```html
<a class="..." id="..." data-modal="toggle" href="#">Example link</a>

<input class="form-control" type="text" />

<img src="..." alt="..." />
```

## boolean 属性

boolean 属性指不需要声明取值的属性，XHTML 需要每个属性声明取值，但是 HTML5 并不需要；

_boolean 属性的存在表示取值为 true，不存在则表示取值为 false。_

## JS 生成标签

在 JS 文件中生成标签让内容变得更难查找，更难编辑，性能更差。应该尽量避免这种情况的出现。

## 减少标签数量

在编写 HTML 代码时，需要尽量避免多余的父节点；很多时候，需要通过迭代和重构来使 HTML 变得更少。

```html
<!-- Not well -->
<span class="avatar">
  <img src="..." />
</span>

<!-- Better -->
<img class="avatar" src="..." />
```

## 实用高于完美

尽量遵循 HTML 标准和语义，但是不应该以浪费实用性作为代价；

任何时候都要用尽量小的复杂度和尽量少的标签来解决问题。
