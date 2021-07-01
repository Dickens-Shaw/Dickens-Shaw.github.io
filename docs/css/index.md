<!--
 * @Author: Shaw
 * @Date: 2021-06-15 14:40:04
 * @Description: 布局
 * @LastEditors: Shaw
 * @LastEditTime: 2021-07-01 11:06:18
-->

## 盒模型(box-sizing)

- 标准盒子模型(content-box)：宽度=内容的宽度（content）+ border + padding + margin

- 低版本 IE 盒子模型(border-box)：宽度=内容宽度（content+border+padding）+ margin

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

> BFC 全称 Block Formatting Context 即块级格式上下文，简单的说，BFC 是页面上的一个隔离的独立容器，不受外界干扰或干扰外界

触发方式：

- float 的值不为 none（默认）

- overflow 的值不为 visible（默认）

- display 的值为 inline-block、table-cell、table-caption、grid

- position 的值为 absolute 或 fixed

应用场景:

- 清除浮动：BFC 内部的浮动元素会参与高度计算，因此可用于清除浮动，防止高度塌陷

- 避免某元素被浮动元素覆盖：BFC 的区域不会与浮动元素的区域重叠

- 阻止外边距重叠：属于同一个 BFC 的两个相邻 Box 的 margin 会发生折叠，不同 BFC 不会发生折叠
