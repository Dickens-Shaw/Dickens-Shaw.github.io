# JS 规范

## 命名

- 标准变量采用驼峰式命名（除了对象的属性外，主要是考虑到 cgi 返回的数据）
- 'ID'在变量名中全大写
- 'URL'在变量名中全大写
- 'Android'在变量名中大写第一个字母
- 'iOS'在变量名中小写第一个，大写后两个字母
- 常量全大写，用下划线连接
- 构造函数，大写第一个字母
- jquery 对象必须以'$'开头命名

```js
var thisIsMyName

var goodID

var reportURL

var AndroidVersion

var iOSVersion

var MAX_COUNT = 10

function Person(name) {
  this.name = name
}

// not good
var body = $('body')

// good
var $body = $('body')
```

1. 采用小写驼峰命名 lowerCamelCase，代码中的命名均不能以下划线，也不能以下划线或美元符号结束。

```
反例： _name / name_ / name$
```

2. 方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase 风格，必须遵从驼峰形式。

```
正例： localValue / getHttpMessage() / inputUserId
```

**_\*方法命名必须是 动词 或者 动词+名词 形式。_**

```
正例：saveShopCarData /openShopCarInfoDialog

反例：save / open / show / go
```

**_\*特此说明，增删查改，详情统一使用如下 5 个单词，不得使用其他。（目的是为了统一各个端）_**

**附： 函数方法常用的动词:**

```
get 获取/set 设置,
add 增加/remove 删除
create 创建/destroy 移除
start 启动/stop 停止
open 打开/close 关闭,
read 读取/write 写入
load 载入/save 保存,
create 创建/destroy 销毁
begin 开始/end 结束,
backup 备份/restore 恢复
import 导入/export 导出,
split 分割/merge 合并
inject 注入/extract 提取,
attach 附着/detach 脱离
bind 绑定/separate 分离,
view 查看/browse 浏览
edit 编辑/modify 修改,
select 选取/mark 标记
copy 复制/paste 粘贴,
undo 撤销/redo 重做
insert 插入/delete 移除,
add 加入/append 添加
clean 清理/clear 清除,
index 索引/sort 排序
find 查找/search 搜索,
increase 增加/decrease 减少
play 播放/pause 暂停,
launch 启动/run 运行
compile 编译/execute 执行,
debug 调试/trace 跟踪
observe 观察/listen 监听,
build 构建/publish 发布
input 输入/output 输出,
encode 编码/decode 解码
encrypt 加密/decrypt 解密,
compress 压缩/decompress 解压缩
pack 打包/unpack 解包,
parse 解析/emit 生成
connect 连接/disconnect 断开,
send 发送/receive 接收
download 下载/upload 上传,
refresh 刷新/synchronize 同步
update 更新/revert 复原,
lock 锁定/unlock 解锁
check out 签出/check in 签入,
submit 提交/commit 交付
push 推/pull 拉,
expand 展开/collapse 折叠
begin 起始/end 结束,
start 开始/finish 完成
enter 进入/exit 退出,
abort 放弃/quit 离开
obsolete 废弃/depreciate 废旧,
collect 收集/aggregate 聚集
```

3. 常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长。

```
正例： MAX_STOCK_COUNT

反例： MAX_COUNT
```

## 缩进

使用 2 个空格进行缩进。

```js
if (x < y) {
  x += 10
} else {
  x += 1
}
```

## 单行长度

不要超过 80，但如果编辑器开启 word wrap 可以不考虑单行长度。

## 分号

以下几种情况后需加分号：

- 变量声明
- 表达式
- return
- throw
- break
- continue
- do-while

## 空格

以下几种情况不需要空格：

- 对象的属性名后
- 前缀一元运算符后
- 后缀一元运算符前
- 函数调用括号前
- 无论是函数声明还是函数表达式，'('前不要空格
- 数组的'['后和']'前
- 对象的'{'后和'}'前
- 运算符'('后和')'前

以下几种情况需要空格：

- 二元运算符前后
- 三元运算符'?:'前后
- 代码块'{'前
- 下列关键字前：`else, while, catch, finally`
- 下列关键字后：`if, else, for, while, do, switch, case, try, catch, finally, with, return, typeof`
- 单行注释'//'后（若单行注释和代码同行，则'//'前也需要），多行注释'\*'后
- 对象的属性值前
- for 循环，分号后留有一个空格，前置条件如果有多个，逗号后留一个空格
- 无论是函数声明还是函数表达式，'{'前一定要有空格
- 函数的参数之间

## 空行

不同逻辑、不同语义、不同业务的代码之间插入一个空行分隔开来以提升可读性。

> 说明：任何情形，没有必要插入多个空行进行隔开。

- 变量声明后（当变量声明在代码块的最后一行时，则无需空行）
- 注释前（当注释在代码块的第一行时，则无需空行）
- 代码块后（在函数调用、数组、对象中则无需空行）
- 文件最后保留一个空行

## 换行

换行的地方，行末必须有','或者运算符；

以下几种情况不需要换行：

- 下列关键字后：`else, catch, finally`
- 代码块'{'前

以下几种情况需要换行：

- 代码块'{'后和'}'前
- 变量赋值后

## 单行注释

双斜线后，必须跟一个空格；

缩进与下一行代码保持一致；

可位于一个代码行的末尾，与代码间隔一个空格。

```js
if (condition) {
  // if you made it here, then all security checks passed
  allowed()
}

var shangSan = 'shangSan' // one space after code
```

## 多行注释

最少三行, '\*'后跟一个空格，具体参照右边的写法；

建议在以下情况下使用：

- 难于理解的代码段
- 可能存在错误的代码段
- 浏览器特殊的 HACK 代码
- 业务逻辑强相关的代码

```js
/*
 * one space after '*'
 */
var x = 1
```

## 文档注释

各类标签@param, @method 等请参考[use JSDoc](https://jsdoc.app/)和[JSDoc Guide](http://yuri4ever.github.io/jsdoc/)；

建议在以下情况下使用：

- 所有常量
- 所有函数
- 所有类

```js
/**
 * @func
 * @desc 一个带参数的函数
 * @param {string} a - 参数a
 * @param {number} b=1 - 参数b默认值为1
 * @param {string} c=1 - 参数c有两种支持的取值</br>1—表示x</br>2—表示xx
 * @param {object} d - 参数d为一个对象
 * @param {string} d.e - 参数d的e属性
 * @param {string} d.f - 参数d的f属性
 * @param {object[]} g - 参数g为一个对象数组
 * @param {string} g.h - 参数g数组中一项的h属性
 * @param {string} g.i - 参数g数组中一项的i属性
 * @param {string} [j] - 参数j是一个可选参数
 */
function foo(a, b, c, d, g, j) {
    ...
}
```

## 引号

统一使用单引号(‘)，不使用双引号(“)。这在创建 HTML 字符串非常有好处：

正例：

```js
let str = 'foo'
let testDiv = '<div id="test"></div>'
```

反例：

```js
let str = 'foo'
let testDiv = "<div id='test'></div>"
```

## 变量声明

一个函数作用域中所有的变量声明尽量提到函数首部，用一个 var 声明，不允许出现两个连续的 var 声明。

```js
function doSomethingWithItems(items) {
  // use one var
  var value = 10,
    result = value + 10,
    i,
    len

  for (i = 0, len = items.length; i < len; i++) {
    result += 10
  }
}
```

## 函数

无论是函数声明还是函数表达式，'('前不要空格，但'{'前一定要有空格；

函数调用括号前不需要空格；

立即执行函数外必须包一层括号；

不要给 inline function 命名；

参数之间用', '分隔，注意逗号后有一个空格。

## 数组、对象

对象属性名不需要加引号；

对象以缩进的形式书写，不要写在一行；

数组、对象最后不要有逗号。

```js
// not good
var a = {
  b: 1,
}

var a = { b: 1 }

var a = {
  b: 1,
  c: 2,
}

// good
var a = {
  b: 1,
  c: 2,
}
```

## 对象声明

1. 使用字面值创建对象

```js
正例： let user = {};

反例： let user = new Object();
```

2. 使用字面量来代替对象构造器

正例：

```js
var user = {
  age: 0,
  name: 1,
  city: 3,
}
```

反例：

```js
var user = new Object()
user.age = 0
user.name = 0
user.city = 0
```

## 使用 ES6、7

必须优先使用 ES6,7 中新增的语法糖和函数。这将简化你的程序，并让你的代码更加灵活和可复用。

> 必须强制使用 ES6, ES7 的新语法，比如箭头函数、await/async ， 解构， let ， for…of 等等

## 括号

下列关键字后必须有大括号（即使代码块的内容只有一行）：
`if, else, for, while, do, switch, try, catch, finally, with`

```js
// not good
if (condition) doSomething()

// good
if (condition) {
  doSomething()
}
```

## null

适用场景：

- 初始化一个将来可能被赋值为对象的变量
- 与已经初始化的变量做比较
- 作为一个参数为对象的函数的调用传参
- 作为一个返回对象的函数的返回值

不适用场景：

- 不要用 null 来判断函数调用时有无传参
- 不要与未初始化的变量做比较

```js
// not good
function test(a, b) {
  if (b === null) {
    // not mean b is not supply
    ...
  }
}
var a;
if (a === null) {
  ...
}

// good
var a = null;
if (a === null) {
  ...
}
```

## undefined 判断

永远不要直接使用 undefined 进行变量判断；使用 typeof 和字符串’undefined’对变量进行判断。

正例：

```js
if (typeof person === 'undefined') {
    ...
}
```

反例：

```js
if (person === undefined) {
    ...
}
```

## 条件判断和循环最多三层

条件判断能使用三目运算符和逻辑运算符解决的，就不要使用条件判断，但是谨记不要写太长的三目运算符。如果超过 3 层请抽成函数，并写清楚注释。

## this 的转换命名

对上下文 this 的引用只能使用’self’来命名。

## 慎用 console.log

因 console.log 大量使用会有性能问题，所以在非 webpack 项目中谨慎使用 log 功能。

## jshint

- 用'===', '!=='代替'==', '!='；
- for-in 里一定要有 hasOwnProperty 的判断；
- 不要在内置对象的原型上添加方法，如 Array, Date；
- 不要在内层作用域的代码里声明了变量，之后却访问到了外层作用域的同名变量；
- 变量不要先使用后声明；
- 不要在一句代码中单单使用构造函数，记得将其赋值给某个变量；
- 不要在同个作用域下声明同名变量；
- 不要在一些不需要的地方加括号，例：delete(a.b)；
- 不要使用未声明的变量（全局变量需要加到.jshintrc 文件的 globals 属性里面）；
- 不要声明了变量却不使用；
- 不要在应该做比较的地方做赋值；
- debugger 不要出现在提交的代码里；
- 数组中不要存在空元素；
- 不要在循环内部声明函数；
- 不要像这样使用构造函数，例：new function () { ... }, new Object；

## 杂项

- 不要混用 tab 和 space；
- 不要在一处使用多个 tab 或 space；
- 换行符统一用'LF'；
- 对上下文 this 的引用只能使用'\_this', 'that', 'self'其中一个来命名；
- 行尾不要有空白字符；
- switch 的 falling through 和 no default 的情况一定要有注释特别说明；
- 不允许有空的代码块。
