<!--
 * @Author: Shaw
 * @Date: 2021-06-15 14:40:04
 * @Description: 布局
 * @LastEditors: Shaw
 * @LastEditTime: 2021-06-25 15:27:26
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
