<!--
 * @Author: Shaw
 * @Date: 2021-06-16 10:31:03
 * @Description: CSS规范
 * @LastEditors: Shaw
 * @LastEditTime: 2021-06-17 10:26:44
-->

# CSS 规范

## 缩进

使用 soft tab（4 个空格）。

```css
.element {
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 10px;
  width: 50px;
  height: 50px;
}
```

## 分号

每个属性声明末尾都要加分号。

```css
.element {
  width: 20px;
  height: 20px;
  background-color: red;
}
```

## 空格

以下几种情况不需要空格：

- 属性名后
- 多个规则的分隔符','前
- `!important` '!'后
- 属性值中'('后和')'前
- 行末不要有多余的空格

以下几种情况需要空格：

- 属性值前
- 选择器'>', '+', '~'前后
- '{'前
- `!important` '!'前
- `@else` 前后
- 属性值中的','后
- 注释'/_'后和'_/'前

## 空行

以下几种情况需要空行：

- 文件最后保留一个空行
- '}'后最好跟一个空行，包括 scss 中嵌套的规则
- 属性之间需要适当的空行，具体见[属性声明顺序](#属性声明顺序)

## 换行

以下几种情况不需要换行：

- '{'前

以下几种情况需要换行：

- '{'后和'}'前
- 每个属性独占一行
- 多个规则的分隔符','后

## 注释

注释统一用'/\* \*/'（scss 中也不要用'//'），具体参照右边的写法；

缩进与下一行代码保持一致；

可位于一个代码行的末尾，与代码间隔一个空格。

```css
/* Modal header */
.modal-header {
}

/*
 * Modal header
 */
.modal-header {
}

.modal-header {
  /* 50px */
  width: 50px;

  color: red; /* color red */
}
```

## 引号

最外层统一使用双引号；

url 的内容要用引号；

属性选择器中的属性值需要引号。

```css
.element:after {
  content: '';
  background-image: url('logo.png');
}

li[data-type='single'] {
}
```

## 命名

ID 和 class 的名称总是使用可以反应元素目的和用途的名称，或其他通用的名称，代替表象和晦涩难懂的名称。

- 类名使用小写字母，以中划线分隔
- id 采用驼峰式命名
- scss 中的变量、函数、混合、placeholder 采用驼峰式命名

不推荐：

```css
.fw-800 {
  font-weight: 800;
}

.red {
  color: red;
}
```

推荐：

```css
.heavy {
  font-weight: 800;
}

.important {
  color: red;
}

/* class */
.element-content {
}

/* id */
#myDialog {
}

/* 变量 */
$colorBlack: #000;

/* 函数 */
@function pxToRem($px) {
}

/* 混合 */
@mixin centerBlock {
}

/* placeholder */
%myDialog {
}
```

## 属性声明顺序

相关的属性声明按右边的顺序做分组处理，组之间需要有一个空行。

作为最佳实践，我们应该遵循以下顺序（应该按照下表的顺序）：

结构性属性：

1. display
2. position, left, top, right etc.
3. overflow, float, clear etc.
4. margin, padding

表现性属性：

1. background, border etc.
2. font, text

```css
.declaration-order {
  display: block;
  float: right;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  border: 1px solid #e5e5e5;
  border-radius: 3px;
  width: 100px;
  height: 100px;

  font: normal 13px 'Helvetica Neue', sans-serif;
  line-height: 1.5;
  text-align: center;

  color: #333;
  background-color: #f5f5f5;

  opacity: 1;
}
```

## 颜色

颜色 16 进制用小写字母；

颜色 16 进制尽量用简写。

```css
/* not good */
.element {
  color: #abcdef;
  background-color: #001122;
}

/* good */
.element {
  color: #abcdef;
  background-color: #012;
}
```

## 选择器

1. css 选择器中避免使用标签名
   从结构、表现、行为分离的原则来看，应该尽量避免 css 中出现 HTML 标签，并且在 css 选择器中出现标签名会存在潜在的问题。
2. 很多前端开发人员写选择器链的时候不使用 直接子选择器（注：直接子选择器和后代选择器的区别）。有时，这可能会导致疼痛的设计问题并且有时候可能会很耗性能。然而，在任何情况下，这是一个非常不好的做法。如果你不写很通用的，需要匹配到 DOM 末端的选择器， 你应该总是考虑直接子选择器。

不推荐：

```css
.content .title {
  font-size: 2rem;
}
```

推荐：

```css
.content > .title {
  font-size: 2rem;
}
```

## 属性简写

属性简写需要你非常清楚属性值的正确顺序，而且在大多数情况下并不需要设置属性简写中包含的所有值，所以建议尽量分开声明会更加清晰；

`margin` 和 `padding` 相反，需要使用简写；

常见的属性简写包括：

- `font`
- `background`
- `transition`
- `animation`

不推荐：

```css
border-top-style: none;
font-family: palatino, georgia, serif;
font-size: 100%;
line-height: 1.6;
padding-bottom: 2em;
padding-left: 1em;
padding-right: 1em;
padding-top: 0;

.element {
  transition: opacity 1s linear 2s;
}
```

推荐：

```css
border-top: 0;
font: 100%/1.6 palatino, georgia, serif;
padding: 0 1em 2em;

.element {
  transition-delay: 2s;
  transition-timing-function: linear;
  transition-duration: 1s;
  transition-property: opacity;
}
```

## 每个选择器及属性独占一行

不推荐：

```css
button {
  width: 100px;
  height: 50px;
  color: #fff;
  background: #00a0e9;
}
```

推荐：

```css
button {
  width: 100px;
  height: 50px;
  color: #fff;
  background: #00a0e9;
}
```

## 省略 0 后面的单位

不推荐：

```css
div {
  padding-bottom: 0px;
  margin: 0em;
}
```

推荐：

```css
div {
  padding-bottom: 0;
  margin: 0;
}
```

## 媒体查询

尽量将媒体查询的规则靠近与他们相关的规则，不要将他们一起放到一个独立的样式文件中，或者丢在文档的最底部，这样做只会让大家以后更容易忘记他们。

```css
.element {
}
.element-avatar {
}

@media (min-width: 480px) {
  .element {
  }
  .element-avatar {
  }
}
```

## 避免使用 ID 选择器及全局标签选择器

防止污染全局样式.

不推荐：

```css
#header {
  padding-bottom: 0px;
  margin: 0em;
}
```

推荐：

```css
.header {
  padding-bottom: 0px;
  margin: 0em;
}
```

## SCSS、LESS 规范

### 规范

提交的代码中不要有 `@debug`；

- 声明顺序：
- `@extend`
- 不包含 `@content` 的 `@include`
- 包含 `@content` 的 `@include`
- 自身属性
- 嵌套规则
  `@import` 引入的文件不需要开头的'\_'和结尾的'.scss'；

嵌套最多不能超过 5 层；

`@extend` 中使用 placeholder 选择器；

去掉不必要的父级引用符号'&'。

```css
/* not good */
@import '_dialog.scss';

/* good */
@import 'dialog';

/* not good */
.fatal {
  @extend .error;
}

/* good */
.fatal {
  @extend %error;
}

/* not good */
.element {
  & > .dialog {
  }
}

/* good */
.element {
  > .dialog {
  }
}
```

### 代码组织

- 将公共 less 文件放置在 style/less/common 文件夹

```
例:// color.scss,common.less
```

- 按以下顺序组织
  1. @import;
  2. 变量声明;
  3. 样式声明;

```css
@import 'mixin/size.scss';
@default-text-color: #333;
.page {
  width: 960px;
  margin: 0 auto;
}
```

### 避免层级过多

将嵌套深度限制在 3 级。对于超过 4 级的嵌套，给予重新评估。这可以避免出现过于详实的 CSS 选择器。
避免大量的嵌套规则。当可读性受到影响时，将之打断。推荐避免出现多于 20 行的嵌套规则出现。

不推荐：

```css
.main {
  .title {
    .name {
      color: #fff;
    }
  }
}
```

推荐：

```css
.main-title {
  .name {
    color: #fff;
  }
}
```

## 杂项

- 不允许有空的规则；
- 元素选择器用小写字母；
- 去掉小数点前面的 0；
- 去掉数字中不必要的小数点和末尾的 0；
- 属性值'0'后面不要加单位；
- 同个属性不同前缀的写法需要在垂直方向保持对齐，具体参照右边的写法；
- 无前缀的标准属性应该写在有前缀的属性后面；
- 不要在同个规则里出现重复的属性，如果重复的属性是连续的则没关系；
- 不要在一个文件里出现两个相同的规则；
- 用`border: 0;` 代替 `border: none;`；
- 选择器不要超过 4 层（在 scss 中如果超过 4 层应该考虑用嵌套的方式来写）；
- 发布的代码中不要有 `@import`；
- 尽量少用'\*'选择器。

```css
/* not good */
.element {
}

/* not good */
LI {
}

/* good */
li {
}

/* not good */
.element {
  color: rgba(0, 0, 0, 0.5);
}

/* good */
.element {
  color: rgba(0, 0, 0, 0.5);
}

/* not good */
.element {
  width: 50px;
}

/* good */
.element {
  width: 50px;
}

/* not good */
.element {
  width: 0px;
}

/* good */
.element {
  width: 0;
}

/* not good */
.element {
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;

  background: linear-gradient(to bottom, #fff 0, #eee 100%);
  background: -webkit-linear-gradient(top, #fff 0, #eee 100%);
  background: -moz-linear-gradient(top, #fff 0, #eee 100%);
}

/* good */
.element {
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;

  background: -webkit-linear-gradient(top, #fff 0, #eee 100%);
  background: -moz-linear-gradient(top, #fff 0, #eee 100%);
  background: linear-gradient(to bottom, #fff 0, #eee 100%);
}

/* not good */
.element {
  color: rgb(0, 0, 0);
  width: 50px;
  color: rgba(0, 0, 0, 0.5);
}

/* good */
.element {
  color: rgb(0, 0, 0);
  color: rgba(0, 0, 0, 0.5);
}
```
