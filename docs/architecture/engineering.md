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

## Git

### git 和 svn 的区别
- git 和 svn 最大的区别在于 git 是分布式的，而 svn 是集中式的。因此我们不能再离线的情况下使用 svn。如果服务器出现问题，就没有办法使用 svn 来提交代码。
- svn 中的分支是整个版本库的复制的一份完整目录，而 git 的分支是指针指向某次提交，因此 git 的分支创建更加开销更小并且分支上的变化不会影响到其他人。svn 的分支变化会影响到所有的人。
- svn 的指令相对于 git 来说要简单一些，比 git 更容易上手。
- GIT把内容按元数据方式存储，而SVN是按文件：因为git目录是处于个人机器上的一个克隆版的版本库，它拥有中心版本库上所有的东西，例如标签，分支，版本记录等。
- GIT分支和SVN的分支不同：svn会发生分支遗漏的情况，而git可以同一个工作目录下快速的在几个分支间切换，很容易发现未被合并的分支，简单而快捷的合并这些文件。
- GIT没有一个全局的版本号，而SVN有
- GIT的内容完整性要优于SVN：GIT的内容存储使用的是SHA-1哈希算法。这能确保代码内容的完整性，确保在遇到磁盘故障和网络问题时降低对版本库的破坏

### 常用命令
```js
git init                     // 新建 git 代码库
git add                      // 添加指定文件到暂存区
git rm                       // 删除工作区文件，并且将这次删除放入暂存区
git commit -m [message]      // 提交暂存区到仓库区
git branch                   // 列出所有分支
git checkout -b [branch]     // 新建一个分支，并切换到该分支
git status                   // 显示有变更文件的状态
```

### git pull 和 git fetch 的区别
- git fetch 只是将远程仓库的变化下载下来，并没有和本地分支合并。
- git pull 会将远程仓库的变化下载下来，并和当前分支合并。


### git rebase 和 git merge 的区别
git merge 和 git rebase 都是用于分支合并，关键在 commit 记录的处理上不同：
- git merge 会新建一个新的 commit 对象，然后两个分支以前的 commit 记录都指向这个新 commit 记录。这种方法会保留之前每个分支的 commit 历史。
- git rebase 会先找到两个分支的第一个共同的 commit 祖先记录，然后将提取当前分支这之后的所有 commit 记录，然后将这个 commit 记录添加到目标分支的最新提交后面。经过这个合并后，两个分支合并后的 commit 记录就变为了线性的记录了。

### Git Hook 在项目中的作用

- 多人开发代码语法、规范强制统一
- commit message 格式化、是否符合某种规范
- 如果有需要，测试用例的检测
- 服务器代码有新的更新的时候通知所有开发成员
- 代码提交后的项目自动打包（git receive 之后）

### Git Hook 常用的钩子

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

## Webpack

一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 依赖图(`dependency graph`)，然后将你项目中所需的每一个模块组合成一个或多个 `bundles`，它们均为静态资源，用于展示你的内容。

作用：代码分割、文件压缩合并、编译兼容、模块合并、高级语法翻译、按需加载、代码校验、自动刷新、模块热替换、Tree Shaking

### 核心概念

- Entry：入口，指示 Webpack 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。
- Output：输出结果，告诉 Webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。
- Module：模块，在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。
- Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Bundle：bundle 也是代码块，但是在 webpack 中它是由 webpack 运行时和一些必要的模块组合而成的，bundle 也是最终输出的文件。
- Loader：模块代码转换器，让 webpack 能够去处理除了 JS、JSON 之外的其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。
- Plugin：扩展插件。在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 api 改变输出结果。常见的有：打包优化，资源管理，注入环境变量。
- Mode：模式，告知 webpack 使用相应模式的内置优化
- Browser Compatibility：浏览器兼容性，Webpack 支持所有符合 ES5 标准 的浏览器（IE8 以上版本）

### 构建流程

Webpack 的运⾏流程是⼀个串⾏的过程，从启动到结束会依次执⾏以下流程： 

1. 初始化参数： 从配置文件和 Shell 语句中读取与合并参数，得到最终的参数
2. 开始编译： 用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
3. 确定入口： 根据配置中的 entry 找到所有的入口文件
4. 编译模块： 从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译： 在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
6. 输出资源： 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk, 再把每个 Chunk 转换为一个单独的文件加载到输出列表，这步是可以修改输出内容的最后机会。
7. 输出完成： 在确定好输出内容后，根据 output 配置确定输出的路径和文件名，把文件内容写入文件系统。

简单说：

- 初始化： 从启动构建，读取与合并配置参数，加载 Plugin， 实例化 Compiler
- 编译： 从 Entry 出发，针对每个 Module 串行调用对应的 Loader 去翻译文件的内容，再找到该 Module 依赖的 Module ，递归地进行编译处理
- 输出： 将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中。

### Loader

> webpack 中提供了一种处理多种文件格式的机制，这便是 Loader，我们可以把 Loader 当成一个转换器，它可以将某种格式的文件转换成 webpack 支持打包的模块。

在 Webpack 中，一切皆模块，我们常见的 Javascript、CSS、Less、Typescript、Jsx、图片等文件都是模块，不同模块的加载是通过模块加载器来统一管理的，当我们需要使用不同的 Loader 来解析不同类型的文件时，我们可以在 module.rules 字段下配置相关规则：

- test 属性，识别出哪些文件会被转换。
- use 属性，定义出在进行转换时，应该使用哪个 loader。

#### 特点

- loader 本质上是一个函数，output=loader(input) // input 可为工程源文件的字符串，也可是上一个 loader 转化后的结果；
- 第一个 loader 的传入参数只有一个：资源文件(resource file)的内容；
- loader 支持链式调用，webpack 打包时是按照数组从后往前的顺序将资源交给 loader 处理的。
- 支持同步或异步函数。

#### 代码结构

```js
// source：资源输入，对于第一个执行的 loader 为资源文件的内容；后续执行的 loader 则为前一个 loader 的执行结果
// sourceMap: 可选参数，代码的 sourcemap 结构
// data: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递参数的 AST 对象
const loaderUtils = require('loader-utils');
module.exports = function (source, sourceMap?, data?) {
  // 获取到用户给当前 Loader 传入的 options
  const options = loaderUtils.getOptions(this); // TODO： 此处为转换source的逻辑
  return source;
};
```

#### 类型

1. 同步 loader：

一般的 loader 转换都是同步的，我们可以采用上面说的直接 return 结果的方式，返回我们的处理结果：

```js
module.exports = function (source) {
  // 对 source 进行一些处理
  const res = doSomething(source);
  return res;
};
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
  const options = this.getOptions();
  const res = someSyncOperation(content, options);
  this.callback(null, res, sourceMaps);
  // 注意这里由于使用了 this.callback 直接 return 就行
  return;
};
```

_\*从 webpack 5 开始，this.getOptions 可以获取到 loader 上下文对象_

2. 异步 loader：

当我们遇到譬如需要网络请求等场景，那么为了避免阻塞构建步骤，我们会采取异步构建的方式，异步 loader 可以使用 `this.async()` 方法来告知 webpack 这次构建操作是异步的：

```js
module.exports = function (content) {
  var callback = this.async();
  someAsyncOperation(content, function (err, result) {
    if (err) return callback(err);
    callback(null, result, sourceMaps, meta);
  });
};
```

3. Raw loader：
   默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer。每一个 loader 都可以用 String 或者 Buffer 的形式传递它的处理结果。complier 将会把它们在 loader 之间相互转换。大家熟悉的 `file-loader` 就是用了这个。

```js
module.exports = function (content) {
  console.log(content instanceof Buffer); // true
  return doSomeOperation(content);
};

module.exports.raw = true;
```

4. Pitching loader：

loader 是按照从右往左的顺序被调用的，但是实际上，在此之前会有一个按照从左往右执行每一个 loader 的 pitch 方法的过程。 pitch 方法共有三个参数：

- remainingRequest：loader 链中排在自己后面的 loader 以及资源文件的绝对路径以!作为连接符组成的字符串。
- precedingRequest：loader 链中排在自己前面的 loader 的绝对路径以!作为连接符组成的字符串。
- data：每个 loader 中存放在上下文中的固定字段，可用于 pitch 给 loader 传递数据。

在 pitch 中传给 data 的数据，在后续的调用执行阶段，是可以在 `this.data` 中获取到的：

```js
module.exports = function (content) {
  return someSyncOperation(content, this.data.value); // 这里的 this.data.value === 42
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  data.value = 42;
  // return 如果某一个 loader 的 pitch 方法中返回了值，那么他会直接跳过后续的步骤
};
```

#### API

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

#### 常用 loader

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

### Plugin

> Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

> Plugin 就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

#### 基本结构

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

#### Compiler and Compilation

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
        console.log('资源已经优化完毕。');
      });
    });
  }
}

module.exports = HelloCompilationPlugin;
```

#### 同步与异步

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
          console.log('异步任务完成...');
          callback();
        }, 1000);
      }
    );
  }
}

module.exports = HelloAsyncPlugin;
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
          console.log('异步任务完成...');
          resolve();
        }, 1000);
      });
    });
  }
}

module.exports = HelloAsyncPlugin;
```

#### 常用的 plugin

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
- webpack-bundle-analyzer 可视化 webpack 输出文件的体积，分析生成 Bundle 的每个模块体积大小
- terser-webpack-plugin 用于处理 js 的压缩和混淆，开启多进程并行、缓存模式
- speed-measure-webpack-plugin 分析每个 loader 和 plugin 执行耗时具体情况
- hard-source-webpack-plugin 为模块提供中间缓存，快速提升二次构建的速度。

### 动态加载

import()和 require.ensure

原理：动态的创建 script 标签，以及通过 jsonp 去请求 chunk

### Babel 原理

本质就是编译器，分为三步：

1. **解析 Parse**：将代码解析⽣成抽象语法树（AST），即词法分析与语法分析的过程；
2. **转换 Transform**：对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在此过程中进⾏添加、更新及移除等操作；
3. **⽣成 Generate**：将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator。

![babel](/images/babel.png)

### 热更新原理

webpack的热更新⼜称热替换（Hot Module Replacement），缩写为HMR。 这个机制可以做到不⽤刷新浏览器⽽将新变更的模块替换掉旧的模块。 

![热更新原理](/images/HMR.png)

1. 第⼀步，在 webpack 的 watch 模式下，⽂件系统中某⼀个⽂件发⽣修改，webpack 监听到⽂件变化，根据配置⽂ 
件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。 
2. 第⼆步是 webpack-dev-server 和 webpack 之间的接⼝交互，⽽在这⼀步，主要是 dev-server 的中间件 webpack- dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调⽤ webpack 暴露的 API对代码变化进⾏监 控，并且告诉 webpack，将代码打包到内存中。 
3. 第三步是 webpack-dev-server 对⽂件变化的⼀个监控，这⼀步不同于第⼀步，并不是监控代码变化重新打包。当我们在配置⽂件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置⽂件夹中静态⽂件的变化，变化后会通知浏览器端对应⽤进⾏ live reload。注意，这⼉是浏览器刷新，和 HMR 是两个概念。 
4. 第四步也是 webpack-dev-server 代码的⼯作，该步骤主要是通过 socket.io（webpack-dev-server 的依赖）在浏览器端和服务端之间建⽴⼀个 websocket ⻓连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态⽂件变化的信息。浏览器端根据这些 socket 消息进⾏不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后⾯的步骤根据这⼀ hash 值来进⾏模块热替换。 
5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执⾏热更模块操作，⽽把这些⼯作⼜交回给了webpack，webpack/hot/dev-server 的⼯作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进⾏模块热更新。当然如果仅仅是刷新浏览器，也就没有后⾯那些步骤了。 
6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上⼀步传递给他的新模块的 hash 值，它通过JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回⼀个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。 
7. ⽽第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进⾏对⽐，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引⽤。 
8. 最后⼀步，当 HMR 失败后，回退到 live reload 操作，也就是进⾏浏览器刷新来获取最新打包代码。

简：
1. 当修改了一个或多个文件；
2. 文件系统接收更改并通知 webpack；
3. webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新；
4. HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp；
5. HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新。

### Tree Shaking

Tree-Shaking 是一种基于 ES Module 规范的 Dead Code Elimination 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾其它模块使用，并将其删除，以此实现打包产物的优化。

需要静态分析，只有 ES6 的模块才支持，Webpack 4 生产环境自动开启

```js
// package.json中添加
{
    "sideEffects": ["*.css", "babel-polyfill"]
}
```

通过配置 sideEffects，Tree Shaking 便开启了，webpack 打包时会自动剔除没有引用的 js 文件。对于业务文件冗余，但又不敢轻易删除的项目特别适合开启 Tree Shaking，可以大幅度减少打包体积。

#### 在 Webpack 中启动 Tree Shaking

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
  entry: './src/index',
  mode: 'production',
  devtool: false,
  optimization: {
    usedExports: true,
  },
};
```

#### 理论基础

在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的，例如：

```js
if (process.env.NODE_ENV === 'development') {
  require('./bar');
  exports.foo = 'foo';
}
```

而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，这意味着下述代码在 ESM 方案下是非法的：

```js
if (process.env.NODE_ENV === 'development') {
  import bar from 'bar';
  export const foo = 'foo';
}
```

所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。

#### 实现原理

Webpack 中，Tree-shaking 的实现一是先标记出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 生成产物时，若变量没有被其它模块使用则删除对应的导出语句

> 标记功能需要配置 `optimization.usedExports = true` 开启

也就是说，标记的效果就是删除没有被其它模块使用的导出语句

但实际上标记功能只会影响到模块的导出语句，真正执行“Shaking”操作的是 Terser 插件提供的 DCE 功能。

##### 收集模块导出

首先，Webpack 需要弄清楚每个模块分别有什么导出值，这一过程发生在 make 阶段，大体流程：

1. 将模块的所有 ESM 导出语句转换为 Dependency 对象，并记录到 module 对象的 dependencies 集合，转换规则：

- 具名导出转换为 HarmonyExportSpecifierDependency 对象
- default 导出转换为 HarmonyExportExpressionDependency 对象

2. 所有模块都编译完毕后，触发 compilation.hooks.finishModules 钩子，开始执行 FlagDependencyExportsPlugin 插件回调
3. FlagDependencyExportsPlugin 插件从 entry 开始读取 ModuleGraph 中存储的模块信息，遍历所有 module 对象
4. 遍历 module 对象的 dependencies 数组，找到所有 HarmonyExportXXXDependency 类型的依赖对象，将其转换为 ExportInfo 对象并记录到 ModuleGraph 体系中

经过 FlagDependencyExportsPlugin 插件处理后，所有 ESM 风格的 export 语句都会记录在 ModuleGraph 体系内，后续操作就可以从 ModuleGraph 中直接读取出模块的导出值。

##### 标记模块导出

模块导出信息收集完毕后，Webpack 需要标记出各个模块的导出列表中，哪些导出值有被其它模块用到，哪些没有，这一过程发生在 Seal 阶段，主流程：

1. 触发 compilation.hooks.optimizeDependencies 钩子，开始执行 FlagDependencyUsagePlugin 插件逻辑
2. 在 FlagDependencyUsagePlugin 插件中，从 entry 开始逐步遍历 ModuleGraph 存储的所有 module 对象
3. 遍历 module 对象对应的 exportInfo 数组
4. 为每一个 exportInfo 对象执行 compilation.getDependencyReferencedExports 方法，确定其对应的 dependency 对象有否被其它模块使用
5. 被任意模块使用到的导出值，调用 exportInfo.setUsedConditionally 方法将其标记为已被使用。
6. exportInfo.setUsedConditionally 内部修改 exportInfo.\_usedInRuntime 属性，记录该导出被如何使用

上面是极度简化过的版本，中间还存在非常多的分支逻辑与复杂的集合操作，我们抓住重点：标记模块导出这一操作集中在 FlagDependencyUsagePlugin 插件中，执行结果最终会记录在模块导出语句对应的 exportInfo.\_usedInRuntime 字典中

##### 生成代码

由导出语句对应的 HarmonyExportXXXDependency 类实现，大体的流程：

1. 打包阶段，调用 HarmonyExportXXXDependency.Template.apply 方法生成代码
2. 在 apply 方法内，读取 ModuleGraph 中存储的 exportsInfo 信息，判断哪些导出值被使用，哪些未被使用
3. 对已经被使用及未被使用的导出值，分别创建对应的 HarmonyExportInitFragment 对象，保存到 initFragments 数组
4. 遍历 initFragments 数组，生成最终结果

基本上，这一步的逻辑就是用前面收集好的 exportsInfo 对象未模块的导出值分别生成导出语句。

##### 删除代码

经过前面几步操作之后，模块导出列表中未被使用的值都不会定义在 **webpack_exports** 对象中，形成一段不可能被执行的 Dead Code 效果.

在此之后，将由 Terser、UglifyJS 等 DCE 工具“摇”掉这部分无效代码，构成完整的 Tree Shaking 操作。

##### 总结

- 在 FlagDependencyExportsPlugin 插件中根据模块的 dependencies 列表收集模块导出值，并记录到 ModuleGraph 体系的 exportsInfo 中
- 在 FlagDependencyUsagePlugin 插件中收集模块的导出值的使用情况，并记录到 exportInfo.\_usedInRuntime 集合中
- 在 HarmonyExportXXXDependency.Template.apply 方法中根据导出值的使用情况生成不同的导出语句
- 使用 DCE 工具删除 Dead Code，实现完整的树摇效果

### 优化打包速度

#### 优化 Loader

对于 Loader 来说，影响打包效率首当其冲必属 `Babel` 了。因为 `Babel` 会将代码转为字符串生成 AST，然后对 AST 继续进行转变最后再生成新的代码，项目越大，转换代码越多，效率就越低。

**优化 Loader 的文件搜索范围**

```js
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        loader: 'babel-loader',
        // 只在 src 文件夹下查找
        include: [resolve('src')],
        // 不会去查找的路径
        exclude: /node_modules/,
      },
    ],
  },
};
```

**缓存 Babel 编译过的文件**

```js
// 下次只需要编译更改过的代码文件即可，这样可以大幅度加快打包时间
loader: 'babel-loader?cacheDirectory=true';
```

#### Happypack

```js
module: {
  loaders: [
    {
      test: /\.js$/,
      include: [resolve('src')],
      exclude: /node_modules/,
      // id 后面的内容对应下面
      loader: 'happypack/loader?id=happybabel'
    }
  ]
},
plugins: [
  new HappyPack({
    id: 'happybabel',
    loaders: ['babel-loader?cacheDirectory'],
    // 开启 4 个线程
    threads: 4
  })
]
```

受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况。

HappyPack **可以将 Loader 的同步执行转换为并行的**，这样就能充分利用系统资源来加快打包效率了

#### DLLPlugin

**DLLPlugin 可以将特定的类库提前打包然后引入。** 这种方式可以极大的减少打包类库的次数，只有当类库更新版本才有需要重新打包，并且也实现了将公共代码抽离成单独文件的优化方案。

```js
// 单独配置在一个文件中
// webpack.dll.conf.js
const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    // 想统一打包的类库
    vendor: ['react'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]-[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      // name 必须和 output.library 一致
      name: '[name]-[hash]',
      // 该属性需要与 DllReferencePlugin 中一致
      context: __dirname,
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
    }),
  ],
};
```

然后需要执行这个配置文件生成依赖文件，接下来需要使用 DllReferencePlugin 将依赖文件引入项目中

```js
// webpack.conf.js
module.exports = {
  // ...省略其他配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest 就是之前打包出来的 json 文件
      manifest: require('./dist/vendor-manifest.json'),
    }),
  ],
};
```

#### 代码压缩

在 Webpack3 中，一般使用 `UglifyJS` 来压缩代码，但是这个是单线程运行的，为了加快效率，可以使用 `webpack-parallel-uglify-plugin` 来并行运行` UglifyJS`，从而提高效率。

在 Webpack4 中，不需要以上这些操作了，只需要将 `mode` 设置为 `production` 就可以默认开启以上功能。代码压缩也是我们必做的性能优化方案，当然我们不止可以压缩 JS 代码，还可以压缩 HTML、CSS 代码，并且在压缩 JS 代码的过程中，我们还可以通过配置实现比如删除 `console.log` 这类代码的功能。

#### 其它

- resolve.extensions：用来表明文件后缀列表，默认查找顺序是 ['.js', '.json']，如果你的导入文件没有添加后缀就会按照这个顺序查找文件。我们应该尽可能减少后缀列表长度，然后将出现频率高的后缀排在前面
- resolve.alias：可以通过别名的方式来映射一个路径，能让 Webpack 更快找到路径
- module.noParse：如果你确定一个文件下没有其他依赖，就可以使用该属性让 Webpack 不扫描该文件，这种方式对于大型的类库很有帮助

### 减少打包体积

- 优化图片，对于小图可以使用 base64 的方式写入文件中
- 按照路由拆分代码，实现**按需加载**，将每个路由页面单独打包为一个文件，对于 `loadash` 这种大型类库同样可以使用这个功能
- **Scope Hoisting** 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去

```js
module.exports = {
  optimization: {
    concatenateModules: true,
  },
};
```

- 使用 ES6 模块来开启 `tree shaking`，这个技术可以移除没有使用的代码，Webpack 4 后开启生产环境就会自动启动这个优化功能

### 优化项目性能

- **压缩代码**：删除多余的代码、注释、简化代码的写法等等⽅式。可以利⽤ webpack 的 UglifyJsPlugin 和 ParallelUglifyPlugin 来压缩 JS ⽂件， 利⽤ cssnano （css-loader?minimize）来压缩 css
- **利⽤ CDN 加速**: 在构建过程中，将引⽤的静态资源路径修改为 CDN 上对应的路径。可以利⽤ webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径
- **Tree Shaking**: 将代码中永远不会⾛到的⽚段删除掉。可以通过在启动 webpack 时追加参数 --optimize-minimize 来实现
- **Code Splitting**: 将代码按路由维度或者组件分块(chunk),这样做到按需加载,同时可以充分利⽤浏览器缓存
- **提取公共第三⽅库**: SplitChunksPlugin 插件来进⾏公共模块抽取,利⽤浏览器缓存可以⻓期缓存这些⽆需频繁变动的公共代码

### 提⾼构建速度

- 多⼊⼝情况下，使⽤ CommonsChunkPlugin 来提取公共代码
- 通过 externals 配置来提取常⽤库
- 利⽤ DllPlugin 和 DllReferencePlugin 预编译资源模块 通过 DllPlugin 来对那些我们引⽤但是绝对不会修改的 npm 包来进⾏预编译，再通过 DllReferencePlugin 将预编译的模块加载进来。
- 使⽤ Happypack 实现多线程加速编译
- 使⽤ webpack-uglify-parallel 来提升 uglifyPlugin 的压缩速度。 原理上 webpack-uglify-parallel 采⽤了多核并⾏压缩来提升压缩速度
- 使⽤ Tree-shaking 和 Scope Hoisting 来剔除多余代码

## Rollup

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。并且可以对代码模块使用新的标准化格式，比如 CommonJS 和 es module。

### 构建流程

Rollup 相对 Webpack 而言，打包出来的包会更加轻量化，更适用于类库打包，因为内置了 Tree Shaking 机制，在分析代码阶段就知晓哪些文件引入并未调用，打包时就会自动擦除未使用的代码。

工作机制：

1. 确定入口文件
2. 使用 `Acorn` 读取解析文件，获取抽象语法树 AST
3. 分析代码
4. 生成代码，输出

> Acorn 是一个 JavaScript 语法解析器，它将 JavaScript 字符串解析成语法抽象树 AST

### 核心概念

- input：入口文件路径
- output：输出文件、输出格式（amd/es6/iife/umd/cjs）、sourcemap 启用等
- plugin: 各种插件使用的配置
- external: 提取外部依赖
- global: 配置全局变量

### 配置

```js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// 解析json
import json from '@rollup/plugin-json';
// 压缩代码
import { terser } from 'rollup-plugin-terser';
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
};
```

## 测试

### 单元测试

> 对最小可测试单元（一般为单个函数、类或组件）进行检查和验证

Mocha、断言库 Chai、Sinon、Jest 等。我们可以先选择 jest 来学习，因为它集成了 Mocha，chai，jsdom，sinon 等功能

### 组件测试

> 针对某个组件功能进行测试

因为很多组件涉及了 DOM 操作，可以借助组件测试框架来做，比如使用 Cypress

### e2e 测试

> 端到端测试，主要是模拟用户对页面进行一系列操作并验证其是否符合预期，使用 Cypress

## 基础建设

### 脚手架

解耦：脚手架与模板分离
脚手架负责构建流程，通过命令行与用户交互，获取项目信息
模板负责统一项目结构、工作流程、依赖项管理
脚手架需要检测模板的版本是否有更新，支持模板的删除与新建

### 组件库

选择通用、合适、便捷的构建工具，方便打包代码，并且易于调试；
注重代码质量和开发效率，有类型推断及静态检查能力（提前写好 TS）；
api 简单易用，易于上手，文档实时更新；
支持按需加载，支持组件的继承，支持组件的插件化；
易于开发者拓展、版本升级保持向前兼容。

### NPM

### npm run \*\*\*

1. 运行 npm run xxx 的时候，npm 会先在当前目录的 node_modules/.bin 查找要执行的程序，如果找到则运行；
2. 没有找到则从全局的 node_modules/.bin 中查找，npm i -g xxx 就是安装到到全局目录；
3. 如果全局目录还是没找到，那么就从 path 环境变量中查找有没有其他同名的可执行程序。

```js
# unix 系默认的可执行文件，必须输入完整文件名
vue-cli-service

# windows cmd 中默认的可执行文件，当我们不添加后缀名时，自动根据 pathext 查找文件
vue-cli-service.cmd

# Windows PowerShell 中可执行文件，可以跨平台
vue-cli-service.ps1
```

以 vue-cli-service serve 为例

从 package-lock.json 中可知，当我们 npm i 整个新建的 Vue 项目的时候，npm 将 bin/vue-cli-service.js 作为 bin 声明了。

所以在 npm install 时，npm 读到该配置后，就将该文件软链接到 ./node_modules/.bin 目录下，而 npm 还会自动把 node_modules/.bin 加入$PATH，这样就可以直接作为命令运行依赖程序和开发依赖程序，不用全局安装了。

假如我们在安装包时，使用 npm install -g xxx 来安装，那么会将其中的 bin 文件加入到全局，比如 create-react-app 和 vue-cli ，在全局安装后，就可以直接使用如 vue-cli projectName 这样的命令来创建项目了。
