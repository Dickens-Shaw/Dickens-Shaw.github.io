import{_ as n,o as s,c as a,a as e}from"../app.42a1d2bb.mjs";const p={},t=e(`<h1 id="\u5F02\u6B65\u7F16\u7A0B" tabindex="-1"><a class="header-anchor" href="#\u5F02\u6B65\u7F16\u7A0B" aria-hidden="true">#</a> \u5F02\u6B65\u7F16\u7A0B</h1><h2 id="\u5E76\u53D1-concurrency" tabindex="-1"><a class="header-anchor" href="#\u5E76\u53D1-concurrency" aria-hidden="true">#</a> \u5E76\u53D1 Concurrency</h2><blockquote><p>\u5B8F\u89C2\u6982\u5FF5\uFF0C\u6211\u5206\u522B\u6709\u4EFB\u52A1 A \u548C\u4EFB\u52A1 B\uFF0C\u5728\u4E00\u6BB5\u65F6\u95F4\u5185\u901A\u8FC7\u4EFB\u52A1\u95F4\u7684\u5207\u6362\u5B8C\u6210\u4E86\u8FD9\u4E24\u4E2A\u4EFB\u52A1\uFF0C\u8FD9\u79CD\u60C5\u51B5\u5C31\u53EF\u4EE5\u79F0\u4E4B\u4E3A\u5E76\u53D1</p></blockquote><h2 id="\u5E76\u884C-parallelism" tabindex="-1"><a class="header-anchor" href="#\u5E76\u884C-parallelism" aria-hidden="true">#</a> \u5E76\u884C Parallelism</h2><blockquote><p>\u5FAE\u89C2\u6982\u5FF5\uFF0C\u5047\u8BBE CPU \u4E2D\u5B58\u5728\u4E24\u4E2A\u6838\u5FC3\uFF0C\u90A3\u4E48\u6211\u5C31\u53EF\u4EE5\u540C\u65F6\u5B8C\u6210\u4EFB\u52A1 A\u3001B\u3002\u540C\u65F6\u5B8C\u6210\u591A\u4E2A\u4EFB\u52A1\u7684\u60C5\u51B5\u5C31\u53EF\u4EE5\u79F0\u4E4B\u4E3A\u5E76\u884C</p></blockquote><h2 id="\u56DE\u8C03\u51FD\u6570-callback" tabindex="-1"><a class="header-anchor" href="#\u56DE\u8C03\u51FD\u6570-callback" aria-hidden="true">#</a> \u56DE\u8C03\u51FD\u6570 Callback</h2><p>\u7F3A\u70B9\uFF1A</p><ol><li><p>\u56DE\u8C03\u51FD\u6570\u6709\u4E00\u4E2A\u81F4\u547D\u7684\u5F31\u70B9\uFF0C\u5C31\u662F\u5BB9\u6613\u5199\u51FA<code>\u56DE\u8C03\u5730\u72F1(Callback hell)</code>\uFF1A</p><ul><li>\u5D4C\u5957\u51FD\u6570\u5B58\u5728\u8026\u5408\u6027\uFF0C\u4E00\u65E6\u6709\u6240\u6539\u52A8\uFF0C\u5C31\u4F1A\u7275\u4E00\u53D1\u800C\u52A8\u5168\u8EAB</li><li>\u5D4C\u5957\u51FD\u6570\u4E00\u591A\uFF0C\u5C31\u5F88\u96BE\u5904\u7406\u9519\u8BEF</li></ul></li><li><p>\u4E0D\u80FD\u4F7F\u7528 <code>try catch</code> \u6355\u83B7\u9519\u8BEF</p></li><li><p>\u4E0D\u80FD\u76F4\u63A5 <code>return</code></p></li></ol><h2 id="promise" tabindex="-1"><a class="header-anchor" href="#promise" aria-hidden="true">#</a> Promise</h2><ul><li>\u5B9E\u73B0\u539F\u7406\uFF1A</li></ul><p>\u53EF\u4EE5\u628A Promise \u770B\u6210\u4E00\u4E2A\u72B6\u6001\u673A\u3002\u521D\u59CB\u662F <code>pending</code> \u72B6\u6001\uFF0C\u53EF\u4EE5\u901A\u8FC7\u51FD\u6570 <code>resolve</code> \u548C <code>reject</code> \uFF0C\u5C06\u72B6\u6001\u8F6C\u53D8\u4E3A <code>fulfilled</code> \u6216\u8005 <code>rejected</code> \u72B6\u6001\uFF0C\u72B6\u6001\u4E00\u65E6\u6539\u53D8\u5C31\u4E0D\u80FD\u518D\u6B21\u53D8\u5316\u3002</p><p>then \u51FD\u6570\u4F1A\u8FD4\u56DE\u4E00\u4E2A Promise \u5B9E\u4F8B\uFF0C\u5E76\u4E14\u8BE5\u8FD4\u56DE\u503C\u662F\u4E00\u4E2A<code>\u65B0\u7684\u5B9E\u4F8B</code>\u800C\u4E0D\u662F\u4E4B\u524D\u7684\u5B9E\u4F8B\u3002\u56E0\u4E3A Promise \u89C4\u8303\u89C4\u5B9A\u9664\u4E86 pending \u72B6\u6001\uFF0C\u5176\u4ED6\u72B6\u6001\u662F\u4E0D\u53EF\u4EE5\u6539\u53D8\u7684\uFF0C\u5982\u679C\u8FD4\u56DE\u7684\u662F\u4E00\u4E2A\u76F8\u540C\u5B9E\u4F8B\u7684\u8BDD\uFF0C\u591A\u4E2A then \u8C03\u7528\u5C31\u5931\u53BB\u610F\u4E49\u4E86\u3002</p><p>\u5728\u4F20\u7EDF\u7684\u5F02\u6B65\u7F16\u7A0B\u4E2D\uFF0C\u5982\u679C\u5F02\u6B65\u4E4B\u95F4\u5B58\u5728\u4F9D\u8D56\u5173\u7CFB\uFF0C\u6211\u4EEC\u5C31\u9700\u8981\u901A\u8FC7\u5C42\u5C42\u5D4C\u5957\u56DE\u8C03\u6765\u6EE1\u8DB3\u8FD9\u79CD\u4F9D\u8D56\uFF0C\u5982\u679C\u5D4C\u5957\u5C42\u6570\u8FC7\u591A\uFF0C\u53EF\u8BFB\u6027\u548C\u53EF\u7EF4\u62A4\u6027\u90FD\u53D8\u5F97\u5F88\u5DEE\uFF0C\u4EA7\u751F\u6240\u8C13\u201C\u56DE\u8C03\u5730\u72F1\u201D\uFF0C\u800C Promise \u5C06\u56DE\u8C03\u5D4C\u5957\u6539\u4E3A<code>\u94FE\u5F0F\u8C03\u7528</code>\uFF0C\u589E\u52A0\u53EF\u8BFB\u6027\u548C\u53EF\u7EF4\u62A4\u6027</p><p>\u4F18\u70B9\uFF1A\u89E3\u51B3\u4E86\u56DE\u8C03\u5730\u72F1\u7684\u95EE\u9898</p><p>\u7F3A\u70B9\uFF1A<code>\u65E0\u6CD5\u53D6\u6D88</code> Promise \uFF0C\u9519\u8BEF\u9700\u8981\u901A\u8FC7\u56DE\u8C03\u51FD\u6570\u6765\u6355\u83B7</p><ul><li>Promise.resolve</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>MyPromise<span class="token punctuation">.</span><span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Promise.reject</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>MyPromise<span class="token punctuation">.</span><span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Promise.then</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token class-name">MyPromise</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">then</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> onFulfilled <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
          <span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token function">onFulfilled</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">resolve</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> onRejected <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
          <span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token function">onRejected</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>Promise.all</p><ul><li><p>\u539F\u7406\uFF1A\u8FD4\u56DE\u4E00\u4E2A promise\uFF0C\u5728\u8FD9\u4E2A promise \u4E2D\u7ED9\u6240\u6709\u4F20\u5165\u7684 promise \u7684 then \u65B9\u6CD5\u4E2D\u90FD\u6CE8\u518C\u4E0A\u56DE\u8C03\uFF0C\u56DE\u8C03\u6210\u529F\u4E86\u5C31\u628A\u503C\u653E\u5230\u7ED3\u679C\u6570\u7EC4\u4E2D\uFF0C\u6240\u6709\u56DE\u8C03\u90FD\u6210\u529F\u4E86\u5C31\u8BA9\u8FD4\u56DE\u7684\u8FD9\u4E2A promise \u53BB resolve\uFF0C\u628A\u7ED3\u679C\u6570\u7EC4\u8FD4\u56DE\u51FA\u53BB</p></li><li><p>\u624B\u6495</p></li></ul></li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>MyPromise<span class="token punctuation">.</span><span class="token function-variable function">all</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">iterable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> count <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token keyword">let</span> result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> iterable<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      iterable<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>
        <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          result<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> value
          count<span class="token operator">++</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">===</span> iterable<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">resolve</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>Promise.race</p><ul><li><p>\u539F\u7406\uFF1Arace \u548C all \u5927\u540C\u5C0F\u5F02\uFF0C\u53EA\u4E0D\u8FC7\u5B83\u4E0D\u4F1A\u7B49\u6240\u6709 promise \u90FD\u6210\u529F\uFF0C\u800C\u662F\u8C01\u5FEB\u5C31\u628A\u8C01\u8FD4\u56DE\u51FA\u53BB</p></li><li><p>\u624B\u6495</p></li></ul></li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>MyPromise<span class="token punctuation">.</span><span class="token function-variable function">race</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">iterable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> iterable<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      iterable<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>
        <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>Promise.allSettled</p><ul><li><p>\u539F\u7406\uFF1A\u8FD4\u56DE\u4E00\u4E2A promise\uFF0C\u5728\u8FD9\u4E2A promise \u4E2D\u7ED9\u6240\u6709\u4F20\u5165\u7684 promise \u7684 then \u65B9\u6CD5\u4E2D\u90FD\u6CE8\u518C\u4E0A\u56DE\u8C03\uFF0C\u56DE\u8C03\u6210\u529F\u4E86\u5C31\u628A\u503C\u653E\u5230\u7ED3\u679C\u6570\u7EC4\u4E2D\uFF0C\u6240\u6709\u56DE\u8C03\u90FD\u6210\u529F\u4E86\u5C31\u8BA9\u8FD4\u56DE\u7684\u8FD9\u4E2A promise \u53BB resolve\uFF0C\u628A\u7ED3\u679C\u6570\u7EC4\u8FD4\u56DE\u51FA\u53BB</p></li><li><p>\u624B\u6495</p></li></ul></li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>MyPromise<span class="token punctuation">.</span><span class="token function-variable function">allSettled</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">iterable</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> count <span class="token operator">=</span> <span class="token number">0</span>
    <span class="token keyword">let</span> result <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> iterable<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      iterable<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>
        <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          result<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">value</span><span class="token operator">:</span> value<span class="token punctuation">,</span>
          <span class="token punctuation">}</span>
          count<span class="token operator">++</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">===</span> iterable<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">resolve</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          result<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
            <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">,</span>
            <span class="token literal-property property">reason</span><span class="token operator">:</span> error<span class="token punctuation">,</span>
          <span class="token punctuation">}</span>
          count<span class="token operator">++</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">===</span> iterable<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">resolve</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>Promise.any</p></li><li><p>\u53D6\u6D88 Promise</p></li></ul><p><code>Promise.race(iterable)</code>\uFF0C\u5F53 iterable \u53C2\u6570\u91CC\u7684\u4EFB\u610F\u4E00\u4E2A\u5B50 promise \u88AB\u6210\u529F\u6216\u5931\u8D25\u540E\uFF0C\u7236 promise \u9A6C\u4E0A\u4E5F\u4F1A\u7528\u5B50 promise \u7684\u6210\u529F\u8FD4\u56DE\u503C\u6216\u5931\u8D25\u8BE6\u60C5\u4F5C\u4E3A\u53C2\u6570\u8C03\u7528\u7236 promise \u7ED1\u5B9A\u7684\u76F8\u5E94\u53E5\u67C4\uFF0C\u5E76\u8FD4\u56DE\u8BE5 promise \u5BF9\u8C61\u3002</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u901A\u8FC7promise.race\u7684\u7279\u6027\uFF0C\u6765\u8FDB\u884Cpromise\u7684\u53D6\u6D88</span>
<span class="token keyword">function</span> <span class="token function">stopPromise</span><span class="token punctuation">(</span><span class="token parameter">stopP</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> proObj <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token keyword">let</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    proObj<span class="token punctuation">.</span>resolve <span class="token operator">=</span> resolve
    proObj<span class="token punctuation">.</span>reject <span class="token operator">=</span> reject
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  proObj<span class="token punctuation">.</span>promise <span class="token operator">=</span> Promise<span class="token punctuation">.</span><span class="token function">race</span><span class="token punctuation">(</span><span class="token punctuation">[</span>stopP<span class="token punctuation">,</span> promise<span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token keyword">return</span> proObj
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="generator" tabindex="-1"><a class="header-anchor" href="#generator" aria-hidden="true">#</a> Generator</h2><blockquote><p>Generator \u662F ES6 \u4E2D\u65B0\u589E\u7684\u8BED\u6CD5\uFF0C\u548C Promise \u4E00\u6837\uFF0C\u90FD\u53EF\u4EE5\u7528\u6765\u5F02\u6B65\u7F16\u7A0B</p></blockquote><p>Generator \u5B9E\u73B0\u7684\u6838\u5FC3\u5728\u4E8E<code>\u4E0A\u4E0B\u6587\u7684\u4FDD\u5B58</code>\uFF0C\u51FD\u6570\u5E76\u6CA1\u6709\u771F\u7684\u88AB\u6302\u8D77\uFF0C\u6BCF\u4E00\u6B21 yield\uFF0C\u5176\u5B9E\u90FD\u6267\u884C\u4E86\u4E00\u904D\u4F20\u5165\u7684<code>\u751F\u6210\u5668\u51FD\u6570</code>\uFF0C\u53EA\u662F\u5728\u8FD9\u4E2A\u8FC7\u7A0B\u4E2D\u95F4\u7528\u4E86\u4E00\u4E2A context \u5BF9\u8C61\u50A8\u5B58\u4E0A\u4E0B\u6587\uFF0C\u4F7F\u5F97\u6BCF\u6B21\u6267\u884C\u751F\u6210\u5668\u51FD\u6570\u7684\u65F6\u5019\uFF0C\u90FD\u53EF\u4EE5\u4ECE\u4E0A\u4E00\u4E2A\u6267\u884C\u7ED3\u679C\u5F00\u59CB\u6267\u884C\uFF0C\u770B\u8D77\u6765\u5C31\u50CF\u51FD\u6570\u88AB\u6302\u8D77\u4E86\u4E00\u6837\u3002</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u4F7F\u7528 * \u8868\u793A\u8FD9\u662F\u4E00\u4E2AGenerator\u51FD\u6570</span>
<span class="token comment">// \u5185\u90E8\u53EF\u4EE5\u901A\u8FC7yield\u8868\u8FBE\u5F0F\u6765\u6682\u505C\u6267\u884C</span>
<span class="token comment">// \u901A\u8FC7next\u65B9\u6CD5\u6765\u6062\u590D\u6267\u884C</span>
<span class="token keyword">function</span><span class="token operator">*</span> <span class="token function">gen</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">+</span> <span class="token number">2</span>
  <span class="token keyword">yield</span> <span class="token number">2</span>
  <span class="token keyword">yield</span> <span class="token number">3</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> b <span class="token operator">=</span> <span class="token function">gen</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// { value: 2, done: false }</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// { value: 3, done: false }</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// { value: undefined, done: true }</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="async-await" tabindex="-1"><a class="header-anchor" href="#async-await" aria-hidden="true">#</a> async/await</h2><p>async \u548C await \u76F8\u6BD4\u76F4\u63A5\u4F7F\u7528 Promise \u6765\u8BF4\uFF0C\u4F18\u52BF\u5728\u4E8E\u5904\u7406 then \u7684\u8C03\u7528\u94FE\uFF0C\u80FD\u591F\u66F4\u6E05\u6670\u51C6\u786E\u7684\u5199\u51FA\u4EE3\u7801\u3002\u7F3A\u70B9\u5728\u4E8E\u6EE5\u7528 await \u53EF\u80FD\u4F1A\u5BFC\u81F4\u6027\u80FD\u95EE\u9898\uFF0C\u56E0\u4E3A await \u4F1A\u963B\u585E\u4EE3\u7801\uFF0C\u4E5F\u8BB8\u4E4B\u540E\u7684\u5F02\u6B65\u4EE3\u7801\u5E76\u4E0D\u4F9D\u8D56\u4E8E\u524D\u8005\uFF0C\u4F46\u4ECD\u7136\u9700\u8981\u7B49\u5F85\u524D\u8005\u5B8C\u6210\uFF0C\u5BFC\u81F4\u4EE3\u7801\u5931\u53BB\u4E86\u5E76\u53D1\u6027\u3002</p><ul><li>\u4F18\u70B9\uFF1A\u4EE3\u7801\u6E05\u6670\uFF0C\u4E0D\u7528\u50CF Promise \u5199\u4E00\u5927\u5806 then \u94FE\uFF0C\u5904\u7406\u4E86\u56DE\u8C03\u5730\u72F1\u7684\u95EE\u9898\uFF1B</li><li>\u7F3A\u70B9\uFF1Aawait \u5C06\u5F02\u6B65\u4EE3\u7801\u6539\u9020\u6210\u540C\u6B65\u4EE3\u7801\uFF0C\u5982\u679C\u591A\u4E2A\u5F02\u6B65\u64CD\u4F5C\u6CA1\u6709\u4F9D\u8D56\u6027\u800C\u4F7F\u7528 await \u4F1A\u5BFC\u81F4\u6027\u80FD\u4E0A\u7684\u964D\u4F4E\u3002</li></ul><p>await \u5185\u90E8\u5B9E\u73B0\u4E86 generator\uFF0C\u5176\u5B9E await \u5C31\u662F <code>generator \u52A0\u4E0A Promise \u7684\u8BED\u6CD5\u7CD6</code>\uFF0C\u4E14\u5185\u90E8\u4F7F\u7528<code>co\u51FD\u6570</code>\u5B9E\u73B0\u4E86\u81EA\u52A8\u6267\u884C generator</p><ul><li>async \u662F\u4E00\u4E2A\u4FEE\u9970\u7B26\uFF0Casync \u5B9A\u4E49\u7684\u51FD\u6570\u4F1A\u9ED8\u8BA4\u7684\u8FD4\u56DE\u4E00\u4E2A Promise \u5BF9\u8C61 resolve \u7684\u503C\uFF0C\u56E0\u6B64\u5BF9 async \u51FD\u6570\u53EF\u4EE5\u76F4\u63A5\u8FDB\u884C then \u64CD\u4F5C,\u8FD4\u56DE\u7684\u503C\u5373\u4E3A then \u65B9\u6CD5\u7684\u4F20\u5165\u51FD\u6570</li><li>await \u4E5F\u662F\u4E00\u4E2A\u4FEE\u9970\u7B26\uFF0C\u53EA\u80FD\u653E\u5728 async \u51FD\u6570\u5185\u90E8\u3002\u4F5C\u7528 \u5C31\u662F\u83B7\u53D6 Promise \u4E2D\u8FD4\u56DE\u7684\u5185\u5BB9\uFF0C \u83B7\u53D6\u7684\u662F Promise \u51FD\u6570\u4E2D resolve \u6216\u8005 reject \u7684\u503C\u3002\u5982\u679C await \u540E\u9762\u5E76\u4E0D\u662F\u4E00\u4E2A Promise \u7684\u8FD4\u56DE\u503C\uFF0C\u5219\u4F1A\u6309\u7167\u540C\u6B65\u7A0B\u5E8F\u8FD4\u56DE\u503C\u5904\u7406</li></ul>`,39),o=[t];function c(l,i){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","async.html.vue"]]);export{r as default};
