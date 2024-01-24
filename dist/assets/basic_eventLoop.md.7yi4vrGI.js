import{_ as i,c as s,o as a,V as l}from"./chunks/framework.3r87iXRe.js";const c=JSON.parse('{"title":"事件循环","description":"","frontmatter":{},"headers":[],"relativePath":"basic/eventLoop.md","filePath":"basic/eventLoop.md"}'),n={name:"basic/eventLoop.md"},t=l(`<h1 id="事件循环" tabindex="-1">事件循环 <a class="header-anchor" href="#事件循环" aria-label="Permalink to &quot;事件循环&quot;">​</a></h1><h2 id="进程" tabindex="-1">进程 <a class="header-anchor" href="#进程" aria-label="Permalink to &quot;进程&quot;">​</a></h2><blockquote><p>并发执行的程序在执行过程中分配和管理资源的基本单位，是一个动态概念，竞争计算机系统资源的基本单位</p><p>描述了 CPU 在运行指令及加载和保存上下文所需的时间，放在应用上来说就代表了一个程序</p></blockquote><h2 id="线程" tabindex="-1">线程 <a class="header-anchor" href="#线程" aria-label="Permalink to &quot;线程&quot;">​</a></h2><blockquote><p>进程的一部分，一个没有线程的进程可以被看作是单线程的。又被称为轻权进程或轻量级进程，也是 CPU 调度的一个基本单位</p><p>描述了执行一段指令所需的时间</p></blockquote><h2 id="执行栈" tabindex="-1">执行栈 <a class="header-anchor" href="#执行栈" aria-label="Permalink to &quot;执行栈&quot;">​</a></h2><blockquote><p>可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则</p></blockquote><h2 id="单线程模型" tabindex="-1">单线程模型 <a class="header-anchor" href="#单线程模型" aria-label="Permalink to &quot;单线程模型&quot;">​</a></h2><blockquote><p>单线程模型，是指 JS 脚本只在一个线程上运行。JS 同时只能执行一个任务，其他任务都必须等待。</p></blockquote><p>但是 JS 脚本只在一个线程上执行，不代表 JS 引擎只有一个线程。事实上，JS 引擎有多个线程，是一种主线程运行脚本，其他线程后台配合的模式</p><p>原因： JavaScript 的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？</p><p>为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。所以，这个新标准并没有改变 JavaScript 单线程的本质。</p><h2 id="事件循环-event-loop" tabindex="-1">事件循环 Event loop <a class="header-anchor" href="#事件循环-event-loop" aria-label="Permalink to &quot;事件循环 Event loop&quot;">​</a></h2><blockquote><p>主线程从&quot;任务队列&quot;中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）</p></blockquote><ol><li>整体的 script(作为第一个宏任务)开始执行的时候，会把所有代码分为两部分：“同步任务”、“异步任务”；</li><li>同步任务会直接进入主线程依次执行；</li><li>异步任务会再分为宏任务和微任务；</li><li>宏任务进入到 Event Table 中，并在里面注册回调函数，每当指定的事件完成时，Event Table 会将这个函数移到 Event Queue 中；</li><li>微任务也会进入到另一个 Event Table 中，并在里面注册回调函数，每当指定的事件完成时，Event Table 会将这个函数移到 Event Queue 中；</li><li>当主线程内的任务执行完毕，主线程为空时，会检查微任务的 Event Queue，如果有任务，就全部执行，如果没有就执行下一个宏任务；</li><li>上述过程会不断重复，这就是 Event Loop 事件循环；</li></ol><h2 id="宏任务、微任务" tabindex="-1">宏任务、微任务 <a class="header-anchor" href="#宏任务、微任务" aria-label="Permalink to &quot;宏任务、微任务&quot;">​</a></h2><p>这里需要注意的是 new Promise 是会进入到主线程中立刻执行，而 promise.then 则属于微任务</p><ul><li>宏任务(macro-task)，ES6 规范称为 task： <ul><li>整体代码 script</li><li>setTimeOut</li><li>setInterval</li><li>setImmediate 一类的定时事件</li><li>I/O 操作</li><li>UI 渲染</li><li>event listener</li></ul></li><li>微任务(micro-task)，ES6 规范称为 jobs： <ul><li>promise.then</li><li>process.nextTick(node)</li><li>Observer.observe</li><li>对 Dom 变化监听的 MutationObserver</li></ul></li></ul><h2 id="浏览器和-node-js-中区别" tabindex="-1">浏览器和 Node.js 中区别 <a class="header-anchor" href="#浏览器和-node-js-中区别" aria-label="Permalink to &quot;浏览器和 Node.js 中区别&quot;">​</a></h2><ol><li>在浏览器里，每当一个被监听的事件发生时，事件监听器绑定的相关任务就会被添加进回调队列。通过事件产生的任务是异步任务，常见的事件任务包括：</li></ol><ul><li>用户交互事件产生的事件任务，比如输入操作；</li><li>计时器产生的事件任务，比如 setTimeout；</li><li>异步请求产生的事件任务，比如 HTTP 请求。</li></ul><p>主线程运行的时候，会产生堆（heap）和栈（stack），其中堆为内存、栈为函数调用栈。我们能看到，Event Loop 负责执行代码、收集和处理事件以及执行队列中的子任务，具体包括以下过程：</p><ul><li>JavaScript 有一个主线程和调用栈，所有的任务最终都会被放到调用栈等待主线程执行。</li><li>同步任务会被放在调用栈中，按照顺序等待主线程依次执行。</li><li>主线程之外存在一个回调队列，回调队列中的异步任务最终会在主线程中以调用栈的方式运行。</li><li>同步任务都在主线程上执行，栈中代码在执行的时候会调用浏览器的 API，此时会产生一些异步任务。</li><li>异步任务会在有了结果（比如被监听的事件发生时）后，将异步任务以及关联的回调函数放入回调队列中。</li><li>调用栈中任务执行完毕后，此时主线程处于空闲状态，会从回调队列中获取任务进行处理。</li><li>上述过程会不断重复，这就是 JavaScript 的运行机制，称为事件循环机制（Event Loop）。</li></ul><ol start="2"><li>NodeJs 中的事件循环：</li></ol><ul><li>timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调</li><li>I/O callbacks：执行一些系统调用错误，比如网络通信的错误回调</li><li>idle,prepare：仅 node 内部使用</li><li>poll：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里</li><li>check：执行 setImmediate() 的回调</li><li>close callbacks：执行 socket 的 close 事件回调</li></ul><ol start="3"><li>区别： 浏览器环境下，microTask 的任务队列是每个 macroTask 执行完之后执行。</li></ol><p>而在 Node.js 中，microTask 会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行 microTask 队列的任务。 如果是 node11 版本一旦执行一个阶段里的一个宏任务(setTimeout,setInterval 和 setImmediate)就立刻执行微任务队列，这就跟浏览器端运行一致。</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setTimeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;timer1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">resolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;promise1&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setTimeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(() </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;timer2&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">resolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;promise2&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 浏览器环境：</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">promise1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> promise2;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// node V11之后</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">promise1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> promise2;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// node 10及其之前</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">promise1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  promise2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(如果是第二个定时器还未在完成队列中);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">timer2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">promise1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  promise2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(如果是第二个定时器已经在完成队列中);</span></span></code></pre></div>`,28),h=[t];function e(k,p,E,r,o,d){return a(),s("div",null,h)}const y=i(n,[["render",e]]);export{c as __pageData,y as default};