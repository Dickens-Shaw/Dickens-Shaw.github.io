# 工程化
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

# Webpack

一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(`dependency graph`)，然后将你项目中所需的每一个模块组合成一个或多个 `bundles`，它们均为静态资源，用于展示你的内容。

作用：代码分割、文件压缩合并、编译兼容、模块合并、高级语法翻译、按需加载、代码校验、自动刷新、模块热替换、Tree Shaking

## 核心概念
- Entry：入口，指示 Webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。
- Output：输出结果，告诉 Webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块代码转换器，让webpack能够去处理除了JS、JSON之外的其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
- Plugin：扩展插件。在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的api改变输出结果。常见的有：打包优化，资源管理，注入环境变量。
- Mode：模式，告知 webpack 使用相应模式的内置优化
- Browser Compatibility：浏览器兼容性，Webpack 支持所有符合 ES5 标准 的浏览器（IE8以上版本）

## 构建流程

- 初始化参数： 从配置文件和 Shell 语句中读取与合并参数，得到最终的参数
- 开始编译： 用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- 确定入口： 根据配置中的 entry 找到所有的入口文件
- 编译模块： 从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
- 完成模块编译： 在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
- 输出资源： 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk, 再把每个 Chunk 转换为一个单独的文件加载到输出列表，这步是可以修改输出内容的最后机会。
- 输出完成： 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入文件系统。

简单说：

- 初始化： 从启动构建，读取与合并配置参数，加载 Plugin， 实例化 Compiler
- 编译： 从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module ，递归地进行编译处理
- 输出： 将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中。

## Loader

> webpack中提供了一种处理多种文件格式的机制，这便是Loader，我们可以把Loader当成一个转换器，它可以将某种格式的文件转换成webpack支持打包的模块。

在Webpack中，一切皆模块，我们常见的Javascript、CSS、Less、Typescript、Jsx、图片等文件都是模块，不同模块的加载是通过模块加载器来统一管理的，当我们需要使用不同的 Loader 来解析不同类型的文件时，我们可以在module.rules字段下配置相关规则。

### 特点
- loader 本质上是一个函数，output=loader(input) // input可为工程源文件的字符串，也可是上一个loader转化后的结果；
- 第一个 loader 的传入参数只有一个：资源文件(resource file)的内容；
- loader支持链式调用，webpack打包时是按照数组从后往前的顺序将资源交给loader处理的。
- 支持同步或异步函数。

### 代码结构
```js
// source：资源输入，对于第一个执行的 loader 为资源文件的内容；后续执行的 loader 则为前一个 loader 的执行结果
// sourceMap: 可选参数，代码的 sourcemap 结构
// data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递参数的 AST 对象
const loaderUtils = require('loader-utils');
module.exports = function(source, sourceMap?, data?) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this);
  // TODO： 此处为转换source的逻辑
  return source;
};
```

### 常用 loader
- babel-loader 中间桥梁，通过调用 babel/core 中的 api 来告诉 webpack 要如何处理 js
- style-loader 负责把样式插入到 DOM 中，方法是在 head 中插入一个 style 标签，并把样式写入到这个标签的 innerHTML 里
- css-loader 其中 css-loader 处理 js 中 import require() @import/url 引入的内容
- sass-loader 把 scss 转成 css
- less-loader 把 less 转成 css
- postcss-loader 在 css 文件中使用 postcss 插件，比如 autoprefixer，cssnano 等
- ts-loader 根据 tsconfig.json 的配置，自动编译 ts 文件
- svg-sprite-loader 将 svg 图标打包成一个雪碧图，并且把雪碧图的内容插入到 html 中
- markdown-loader 把 markdown 文件编译解析成 html 文件
- raw-loader 将文件中的内容作为字符串导入，并插入到 html 中
- file-loader 使得我们可以在 JS 文件中引入 png\jpg 等图片资源
- url-loader 跟 file-loader 类似；唯一不同的是在于用户可以设置一个文件大小的阈值，当大于阈值时跟 file-loader 一样返回 publicPath，而小于该阈值时则返回文件 base64 形式编码。

## Plugin

> Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

常用的 plugin：

- html-webpack-plugin 自动生成 HTML5 文件，并引入 webpack 打包好的 js 等文件。
- clean-webpack-plugin 用于打包前先把 dist 文件夹清空
- hot-module-replacement-plugin 模块热替换插件，即 HMR，webpack4 自带插件，无需安装，在开发模式下配合 devServer 使用
- mini-css-extract-plugin 将 CSS 提取到单独的文件中
- PurgecssPlugin 可以去除未使用的 css, 一般与 glob、glob-all 配合使用。
- optimize-css-assets-webpack-plugin 用于 CSS 压缩
- split-chunks-plugin 用于提取 js 中公共代码。webpack4 内置插件。相比于 commons-chunk-plugin 的优点：
- webpack-bundle-analyzer 可视化 webpack 输出文件的体积
- terser-webpack-plugin
- add-asset-html-webpack-plugin

### 实现插件

调用插件 apply 函数传入 compiler 对象

通过 compiler 对象监听事件

## 动态加载

import()和 require.ensure

原理：动态的创建 script 标签，以及通过 jsonp 去请求 chunk

## Babel 原理

本质就是编译器，分为三步：

1. 词法分析生成 Token，语法分析生成 AST，
2. 遍历 AST，根据插件变换相应的节点，
3. 最后把 AST 转换为代码

## 热跟新原理

1. 当修改了一个或多个文件；
2. 文件系统接收更改并通知 webpack；
3. webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
4. HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp；
5. HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

## Tree Shaking

需要静态分析，只有 ES6 的模块才支持，Webpack 4 生产环境自动开启

## 优化打包速度

- 减少文件搜索范围：比如通过别名、设置 loader 的 test，include & exclude
- Webpack4 默认压缩并行
- Happypack 将 Loader 的同步执行转换为并行的
- DLLPlugin 将特定的类库提前打包然后引入
- babel 也可以缓存编译

## 优化项目

- 对于 Webpack4，打包项目使用 production 模式，这样会自动开启代码压缩
- 使用 ES6 模块来开启 tree shaking，这个技术可以移除没有使用的代码
- 优化图片，对于小图可以使用 base64 的方式写入文件中
- 按照路由拆分代码，实现按需加载
- 给打包出来的文件名添加哈希，实现浏览器缓存文件
