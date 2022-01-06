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

主要的语法为 name=>type: describe，其中 type 主要有以下几种：
1.开始和结束：start end
2.输入输出：inputoutput
3.操作：operation
4.条件：condition
5.子程序：subroutine

```flow
st=>start: 开始
op=>operation: My Operation
co=>condition: Yes or No?
e=>end
st->op->co
co(yes)->e
co(no)->op
```

十一、折叠

<details>
  <summary><mark><font color=darkred>点击查看详细内容</font></mark></summary>
  <p> - 测试 测试测试</p>
  <pre><code>  
for i in a:
    print(i)
  </code></pre>
</details>


十二、数学公式

使用 $ 表示，其中一个 $ 表示在行内，两个 $ 表示独占一行。

eg : $\sum_{i=1}^n a_i=0$

支持 LaTeX 编辑显示支持，访问 MathJax 参考更多使用方法。

推荐一个常用的数学公式在线编译网站：https://private.codecogs.com/latex/eqneditor.php
