## 概念

> 工程化是一种思想，而不是某种技术。其主要目的为了提高效率和降低成本，即提高开发过程中的开发效率，减少不必要的重复工作时间等

- 模块化
  模块化就是把一个大的文件，拆分成多个相互依赖的小文件，按一个个模块来划分

- 组件化
  页面上所有的东西都可以看成组件，页面是个大型组件，可以拆成若干个中型组件，然后中型组件还可以再拆，拆成若干个小型组件

组件化 ≠ 模块化。模块化只是在文件层面上，对代码和资源的拆分；组件化是在设计层面上，对于 UI 的拆分
目前市场上的组件化的框架，主要的有 Vue，React，Angular2

- 规范化
  在项目规划初期制定的好坏对于后期的开发有一定影响。包括的规范有

  - 目录结构的制定
  - 编码规范
  - 前后端接口规范
  - 文档规范
  - 组件管理
  - Git 分支管理
  - Commit 描述规范
  - 定期 codeReview
  - 视觉图标规范

- 自动化
  也就是简单重复的工作交给机器来做，自动化也就是有很多自动化工具代替我们来完成，例如持续集成、自动化构建、自动化部署、自动化测试等等

## Webpack

### Loader

> Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译预处理工作

常用 loader

- file-loader 使得我们可以在 JS 文件中引入 png\jpg 等图片资源
- url-loader 跟 file-loader 类似；唯一不同的是在于用户可以设置一个文件大小的阈值，当大于阈值时跟 file-loader 一样返回 publicPath，而小于该阈值时则返回文件 base64 形式编码。
- style-loader css-loader 其中 css-loader 处理 js 中 import require() @import/url 引入的内容；style-loader 负责把样式插入到 DOM 中，方法是在 head 中插入一个 style 标签，并把样式写入到这个标签的 innerHTML 里。
- sass-loader 把 scss 转成 css
- less-loader 把 less 转成 css
- babel-loader 中间桥梁，通过调用 babel/core 中的 api 来告诉 webpack 要如何处理 js
