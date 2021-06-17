<!--
 * @Author: Shaw
 * @Date: 2021-06-15 14:22:53
 * @Description:
 * @LastEditors: Shaw
 * @LastEditTime: 2021-06-17 11:19:43
-->

# Markdown 语法

一、标题

# 这是一级标题

## 这是二级标题

### 这是三级标题

#### 这是四级标题

##### 这是五级标题

###### 这是六级标题

二、字体
**这是加粗的文字**
_这是倾斜的文字_`
**_这是斜体加粗的文字_**
~~这是加删除线的文字~~

三、引用

> 这是引用的内容
>
> > 这是引用的内容
> >
> > > > > > > > > > 这是引用的内容

四、分割线

---

---

---

---

五、图片
![blockchain](https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=702257389,1274025419&fm=27&gp=0.jpg '区块链')

六、超链接
[简书](http://jianshu.com)
[百度](http://baidu.com)

七、列表
无序列表

- 列表内容
  - 列表内容
  - 列表内容
  - 列表内容

* 列表内容

- 列表内容

注意：- + \* 跟内容之间都要有一个空格

有序列表

1. 列表内容
   1. 列表内容
   2. 列表内容
   3. 列表内容
2. 列表内容
3. 列表内容

注意：序号跟内容之间要有空格

八、表格
姓名|技能|排行

--|:--:|--:

刘备|哭|大哥

关羽|打|二哥

张飞|骂|三弟

九、代码
`create database hero;`

```js
  function fun(){
        echo "这是一句非常牛逼的代码";
  }
  fun();
```

十、流程图

```flow
st=>start: 开始
op=>operation: My Operation
co=>condition: Yes or No?
e=>end
st->op->co
co(yes)->e
co(no)->op
```
