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

# Git

## Git Hook 在项目中的作用

- 多人开发代码语法、规范强制统一
- commit message 格式化、是否符合某种规范
- 如果有需要，测试用例的检测
- 服务器代码有新的更新的时候通知所有开发成员
- 代码提交后的项目自动打包（git receive 之后）

## Git Hook 常用的钩子

1. ClientSide hooks：

- pre-commit，当执行 commit 动作时先执行此 hook，可以用此 hook 做一些检查，比如代码风格检查，或者先跑测试。
- prepare-commit-msg， 当 commit 时需要输入 message 前会触发此 hook，可以用此 hook 来定制自己的 default message 信息。
- commit-msg，当用户输入 commit 的 message 后被触发，可以用此 hook 校验 message 的信息，比如是否符合规定，有没有 cr 等。
- post-commit, 当 commit 完成后被触发，可以用此 hook 发送 notification 等。
- pre-rebase, rebase 之前会被触发，可以用此 hook 来拒绝所有的已经 push 的 commits 进行 rebase 操作。
- post-merge, 当 merge 成功后，会触发此 hook。
- pre-push, 当 push 时，remote refs 被更新，但是在所有的 objects 传输前被触发。
- pre-auto-gc, 当 git gc –auto 执行前被触发。在垃圾回收之前做一些验证或备份是挺不错的。

2. ServerSide hooks:

- pre-receive, 当收到 push 动作之前会被执行。
- update, 也是收到 push 动作之前被执行，但是有可能被执行多次，每个 branch 一次。
- post-receive, 当 push 动作已经完成的时候会被触发，可以用此 hook 来 push notification 等，比如发邮件，通知持续构建服务器等。

# Webpack

一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(`dependency graph`)，然后将你项目中所需的每一个模块组合成一个或多个 `bundles`，它们均为静态资源，用于展示你的内容。

作用：代码分割、文件压缩合并、编译兼容、模块合并、高级语法翻译、按需加载、代码校验、自动刷新、模块热替换、Tree Shaking

## 核心概念

- Entry：入口，指示 Webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。
- Output：输出结果，告诉 Webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader：模块代码转换器，让 webpack 能够去处理除了 JS、JSON 之外的其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
- Plugin：扩展插件。在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 api 改变输出结果。常见的有：打包优化，资源管理，注入环境变量。
- Mode：模式，告知 webpack 使用相应模式的内置优化
- Browser Compatibility：浏览器兼容性，Webpack 支持所有符合 ES5 标准 的浏览器（IE8 以上版本）

## 构建流程

- 初始化参数： 从配置文件和 Shell 语句中读取与合并参数，得到最终的参数
- 开始编译： 用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- 确定入口： 根据配置中的 entry 找到所有的入口文件
- 编译模块： 从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
- 完成模块编译： 在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
- 输出资源： 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk, 再把每个 Chunk 转换为一个单独的文件加载到输出列表，这步是可以修改输出内容的最后机会。
- 输出完成： 在确定好输出内容后，根据 output 配置确定输出的路径和文件名，把文件内容写入文件系统。

简单说：

- 初始化： 从启动构建，读取与合并配置参数，加载 Plugin， 实例化 Compiler
- 编译： 从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module ，递归地进行编译处理
- 输出： 将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中。

## Loader

> webpack 中提供了一种处理多种文件格式的机制，这便是 Loader，我们可以把 Loader 当成一个转换器，它可以将某种格式的文件转换成 webpack 支持打包的模块。

在 Webpack 中，一切皆模块，我们常见的 Javascript、CSS、Less、Typescript、Jsx、图片等文件都是模块，不同模块的加载是通过模块加载器来统一管理的，当我们需要使用不同的 Loader 来解析不同类型的文件时，我们可以在 module.rules 字段下配置相关规则：

- test 属性，识别出哪些文件会被转换。
- use 属性，定义出在进行转换时，应该使用哪个 loader。

### 特点

- loader 本质上是一个函数，output=loader(input) // input 可为工程源文件的字符串，也可是上一个 loader 转化后的结果；
- 第一个 loader 的传入参数只有一个：资源文件(resource file)的内容；
- loader 支持链式调用，webpack 打包时是按照数组从后往前的顺序将资源交给 loader 处理的。
- 支持同步或异步函数。

### 代码结构

```js
// source：资源输入，对于第一个执行的 loader 为资源文件的内容；后续执行的 loader 则为前一个 loader 的执行结果
// sourceMap: 可选参数，代码的 sourcemap 结构
// data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递参数的 AST 对象
const loaderUtils = require('loader-utils')
module.exports = function (source, sourceMap?, data?) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this) // TODO： 此处为转换source的逻辑
  return source
}
```

### 类型

1. 同步 loader：

一般的 loader 转换都是同步的，我们可以采用上面说的直接 return 结果的方式，返回我们的处理结果：

```js
module.exports = function (source) {
  // 对 source 进行一些处理
  const res = doSomething(source)
  return res
}
```

也可以直接使用 `this.callback()` 这个 api，然后在最后直接 **return undefined** 的方式告诉 webpack 去 `this.callback()` 寻找他要的结果，这个 api 接受这些参数：

```js
this.callback(
  err: Error | null, // 一个无法正常编译时的 Error 或者 直接给个 null
  content: string | Buffer,// 我们处理后返回的内容 可以是 string 或者 Buffer（）
  sourceMap?: SourceMap, // 可选 可以是一个被正常解析的 source map
  meta?: any // 可选 可以是任何东西，比如一个公用的 AST 语法树
);
```

例：

```js
module.exports = function (content) {
  // 获取到用户传给当前 loader 的参数
  const options = this.getOptions()
  const res = someSyncOperation(content, options)
  this.callback(null, res, sourceMaps)
  // 注意这里由于使用了 this.callback 直接 return 就行
  return
}
```

_\*从 webpack 5 开始，this.getOptions 可以获取到 loader 上下文对象_

2. 异步 loader：

当我们遇到譬如需要网络请求等场景，那么为了避免阻塞构建步骤，我们会采取异步构建的方式，异步 loader 可以使用 `this.async()` 方法来告知 webpack 这次构建操作是异步的：

```js
module.exports = function (content) {
  var callback = this.async()
  someAsyncOperation(content, function (err, result) {
    if (err) return callback(err)
    callback(null, result, sourceMaps, meta)
  })
}
```

3. Raw loader：
   默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer。每一个 loader 都可以用 String 或者 Buffer 的形式传递它的处理结果。complier 将会把它们在 loader 之间相互转换。大家熟悉的 `file-loader` 就是用了这个。

```js
module.exports = function (content) {
  console.log(content instanceof Buffer) // true
  return doSomeOperation(content)
}

module.exports.raw = true
```

4. Pitching loader：

loader 是按照从右往左的顺序被调用的，但是实际上，在此之前会有一个按照从左往右执行每一个 loader 的 pitch 方法的过程。 pitch 方法共有三个参数：

- remainingRequest：loader 链中排在自己后面的 loader 以及资源文件的绝对路径以!作为连接符组成的字符串。
- precedingRequest：loader 链中排在自己前面的 loader 的绝对路径以!作为连接符组成的字符串。
- data：每个 loader 中存放在上下文中的固定字段，可用于 pitch 给 loader 传递数据。

在 pitch 中传给 data 的数据，在后续的调用执行阶段，是可以在 `this.data` 中获取到的：

```js
module.exports = function (content) {
  return someSyncOperation(content, this.data.value) // 这里的 this.data.value === 42
}

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  data.value = 42
  // return 如果某一个 loader 的 pitch 方法中返回了值，那么他会直接跳过后续的步骤
}
```

### API

- this.addDependency：加入一个文件进行监听，一旦文件产生变化就会重新调用这个 loader 进行处理
- this.cacheable：默认情况下 loader 的处理结果会有缓存效果，给这个方法传入 false 可以关闭这个效果
- this.clearDependencies：清除 loader 的所有依赖
- this.context：文件所在的目录（不包含文件名）
- this.data：pitch 阶段和正常调用阶段共享的对象
- this.getOptions(schema)：用来获取配置的 loader 参数选项
- this.resolve：像 require 表达式一样解析一个 `request。resolve(context: string, request: string, callback: function(err, result: string))`
- this.loaders：所有 loader 组成的数组。它在 pitch 阶段的时候是可以写入的。
- this.resource：获取当前请求路径，包含参数：`'/abc/resource.js?rrr'`
- this.resourcePath：不包含参数的路径：`'/abc/resource.js'`
- this.sourceMap：bool 类型，是否应该生成一个 sourceMap

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
- thread-loader 可以让 webpack 在多个进程中并行执行 loader，提高打包速度。
- cache-loader 在性能开销较大的 loader 之前添加此 loader，将结果缓存到磁盘里

## Plugin

> Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

> Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

### 基本结构

- 一个 JavaScript 命名函数或 JavaScript 类。
- 在插件函数的 prototype 上定义一个 apply 方法。
- 指定一个绑定到 webpack 自身的事件钩子。
- 处理 webpack 内部实例的特定数据。
- 功能完成后调用 webpack 提供的回调。

```js
// 一个 JavaScript 类
class HelloPlugin{
  // 在插件函数的 prototype 上定义一个 `apply` 方法，以 compiler 为参数。
  apply(compiler){
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler/compilation.hooks.<hookName>.tap/tapAsync/tapPromise(PluginName,(compilation, callback)=>{
      console.log('这是一个示例插件！');
      console.log(
        '这里表示了资源的单次构建的 `compilation` 对象：',
        compilation
      );

      // 用 webpack 提供的插件 API 处理构建过程
      compilation.addModule(/* ... */);

      callback();
    })
  }
}
module.exports = HelloPlugin
```

### Compiler and Compilation

- `compiler` 对象可以理解为一个和 webpack 环境整体绑定的一个对象，它包含了所有的环境配置，包括 options，loader 和 plugin，当 webpack 启动时，这个对象会被实例化，并且他是**全局唯一**的，上面我们说到的 apply 方法传入的参数就是它。

- `compilation` 在每次构建资源的过程中都会被创建出来，一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。它同样也提供了很多的 hook 。

Compiler 和 Compilation 提供了非常多的钩子供我们使用，这些方法的组合可以让我们在构建过程的不同时间获取不同的内容。

```js
class HelloCompilationPlugin {
  apply(compiler) {
    // 指定一个挂载到 compilation 的钩子，回调函数的参数为 compilation 。
    compiler.hooks.compilation.tap('HelloCompilationPlugin', (compilation) => {
      // 现在可以通过 compilation 对象绑定各种钩子
      compilation.hooks.optimize.tap('HelloCompilationPlugin', () => {
        console.log('资源已经优化完毕。')
      })
    })
  }
}

module.exports = HelloCompilationPlugin
```

### 同步与异步

plugin 的 hooks 是有同步和异步区分的，在同步的情况下，我们使用 `<hookName>.tap` 的方式进行调用，而在异步 hook 内我们可以进行一些异步操作，并且有异步操作的情况下，请使用 `tapAsync` 或者 `tapPromise` 方法来告知 webpack 这里的内容是异步的

- tapAsync

使用 `tapAsync` 的时候，我们需要多传入一个 `callback` 回调，并且在结束的时候一定要调用这个回调告知 webpack 这段异步操作结束了

```js
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'HelloAsyncPlugin',
      (compilation, callback) => {
        // 执行某些异步操作...
        setTimeout(function () {
          console.log('异步任务完成...')
          callback()
        }, 1000)
      }
    )
  }
}

module.exports = HelloAsyncPlugin
```

- tapPromise

当使用 `tapPromise` 来处理异步的时候，我们需要返回一个 `Promise` 对象并且让它在结束的时候 `resolve`

```js
class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapPromise('HelloAsyncPlugin', (compilation) => {
      // 返回一个 promise ，异步任务完成后 resolve
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          console.log('异步任务完成...')
          resolve()
        }, 1000)
      })
    })
  }
}

module.exports = HelloAsyncPlugin
```

### 常用的 plugin

- copy-webpack-plugin 将已存在的文件复制到指定目录
- html-webpack-plugin 自动生成 HTML5 文件，并引入 webpack 打包好的 js 等文件。
  - 单页应用可以生成一个 html 入口，多页应用可以配置多个 html-webpack-plugin 实例来生成多个页面入口
  - 为 html 引入外部资源如 script、link，将 entry 配置的相关入口 chunk 以及 mini-css-extract-plugin 抽取的 css 文件插入到基于该插件设置的 template 文件生成的 html 文件里面，具体的方式是 link 插入到 head 中，script 插入到 head 或 body 中。
- clean-webpack-plugin 用于打包前先把 dist 文件夹清空，删除 webpack 的 output.path 中的所有文件，以及每次成功重新构建后所有未使用的资源
- hot-module-replacement-plugin 模块热替换插件，即 HMR，webpack4 自带插件，无需安装，在开发模式下配合 devServer 使用
  - 保留在完全重新加载页面期间丢失的应用程序状态。
  - 只更新变更内容，以节省宝贵的开发时间。
  - 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式。
- mini-css-extract-plugin 将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件
- purge-css-plugin 可以去除未使用的 css, 一般与 glob、glob-all 配合使用。
- optimize-css-assets-webpack-plugin 用于 CSS 压缩
- split-chunks-plugin 用于提取 js 中公共代码。webpack4 内置插件。
- webpack-bundle-analyzer 可视化 webpack 输出文件的体积，分析生成Bundle的每个模块体积大小
- terser-webpack-plugin 用于处理 js 的压缩和混淆，开启多进程并行、缓存模式
- speed-measure-webpack-plugin 分析每个loader和plugin执行耗时具体情况
- hard-source-webpack-plugin 为模块提供中间缓存，快速提升二次构建的速度。

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

Tree-Shaking 是一种基于 ES Module 规范的 Dead Code Elimination 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。

需要静态分析，只有 ES6 的模块才支持，Webpack 4 生产环境自动开启

```js
// package.json中添加
{
    "sideEffects": ["*.css", "babel-polyfill"]
}
```

通过配置sideEffects，Tree Shaking便开启了，webpack打包时会自动剔除没有引用的js文件。对于业务文件冗余，但又不敢轻易删除的项目特别适合开启Tree Shaking，可以大幅度减少打包体积。

### 在 Webpack 中启动 Tree Shaking

必须同时满足三个条件：

1. 使用 ESM 规范编写模块代码
2. 配置 optimization.usedExports 为 true，启动标记功能
3. 启动代码优化功能，可以通过如下方式实现：
  - 配置 mode = production
  - 配置 optimization.minimize = true
  - 提供 optimization.minimizer 数组

```js
// webpack.config.js
module.exports = {
  entry: "./src/index",
  mode: "production",
  devtool: false,
  optimization: {
    usedExports: true,
  },
};
```

### 理论基础

在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的，例如：
```js
if(process.env.NODE_ENV === 'development'){
  require('./bar');
  exports.foo = 'foo';
}
```

而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，这意味着下述代码在 ESM 方案下是非法的：
```js
if(process.env.NODE_ENV === 'development'){
  import bar from 'bar';
  export const foo = 'foo';
}
```

所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。

### 实现原理

Webpack 中，Tree-shaking 的实现一是先标记出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

> 标记功能需要配置 `optimization.usedExports = true` 开启

也就是说，标记的效果就是删除没有被其它模块使用的导出语句

#### 收集模块导出
#### 标记模块导出
#### 生成代码
#### 删除代码

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

# Rollup

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。并且可以对代码模块使用新的标准化格式，比如 CommonJS 和 es module。

## 构建流程

Rollup 相对 Webpack 而言，打包出来的包会更加轻量化，更适用于类库打包，因为内置了 Tree Shaking 机制，在分析代码阶段就知晓哪些文件引入并未调用，打包时就会自动擦除未使用的代码。

工作机制：

1. 确定入口文件
2. 使用 `Acorn` 读取解析文件，获取抽象语法树 AST
3. 分析代码
4. 生成代码，输出

> Acorn 是一个 JavaScript 语法解析器，它将 JavaScript 字符串解析成语法抽象树 AST

## 核心概念

- input：入口文件路径
- output：输出文件、输出格式（amd/es6/iife/umd/cjs）、sourcemap 启用等
- plugin: 各种插件使用的配置
- external: 提取外部依赖
- global: 配置全局变量

## 配置

```js
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
// 解析json
import json from '@rollup/plugin-json'
// 压缩代码
import { terser } from 'rollup-plugin-terser'
export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/esmbundle.js',
      format: 'esm',
      plugins: [terser()],
    },
    {
      file: 'dist/cjsbundle.js',
      format: 'cjs',
    },
  ],
  // commonjs 需要放到 transform 插件之前，
  // 但是又个例外， 是需要放到 babel 之后的
  plugins: [json(), resolve(), commonjs()],
  external: ['vue'],
}
```

# 测试

## 单元测试

> 对最小可测试单元（一般为单个函数、类或组件）进行检查和验证

Mocha、断言库 Chai、Sinon、Jest 等。我们可以先选择 jest 来学习，因为它集成了 Mocha，chai，jsdom，sinon 等功能

## 组件测试

> 针对某个组件功能进行测试

因为很多组件涉及了 DOM 操作，可以借助组件测试框架来做，比如使用 Cypress

## e2e 测试

> 端到端测试，主要是模拟用户对页面进行一系列操作并验证其是否符合预期，使用 Cypress

# 基础建设

## 脚手架

解耦：脚手架与模板分离
脚手架负责构建流程，通过命令行与用户交互，获取项目信息
模板负责统一项目结构、工作流程、依赖项管理
脚手架需要检测模板的版本是否有更新，支持模板的删除与新建

## 组件库

选择通用、合适、便捷的构建工具，方便打包代码，并且易于调试；
注重代码质量和开发效率，有类型推断及静态检查能力（提前写好 TS）；
api 简单易用，易于上手，文档实时更新；
支持按需加载，支持组件的继承，支持组件的插件化；
易于开发者拓展、版本升级保持向前兼容。
