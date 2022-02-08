## 特点

- 类型检查
  TypeScript 在编译代码时进行严格的静态类型检查。这就意味着在编码阶段可能存在的隐患，不必把它们带到线上。
- 语言扩展
  TypeScript 会包括 ES6 和未来提案中的特性，比如异步操作和装饰器。也会从其他语言借鉴某些特点，比如接口和抽象类。
- 工具属性
  TypeScript 可以编译成标准的 Javascript。可以在任何浏览器和操作系统上运行。无需任何运行时额外开销。从这个角度讲 TypeScript 更像时一个工具。

## 原始数据类型

原始数据类型包括：布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol 和 BigInt。

## 类型声明文件怎么写的

如果我们想在 TypeScript 中使用第三方类库如 jQuery、lodash 等，需要提供这些类库的声明文件（以.d.ts 结尾），对外暴露 API。

一般我们通过安装第三方类库的类型声明包后，即可在 TypeScript 中使用。以 jQuery 为例：

`npm install -D jquery @types/jquery`
