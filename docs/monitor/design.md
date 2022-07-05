# 监控系统设计

## 上报数据结构梳理

### sls-wpk-reporter

- JS_ERROR

```js
if (
  ('script error' === (r || '').toLowerCase() && (r = 'Script error'),
  o.ignoreScriptError && 'Script error' === r)
) {
  e.logger.warn('配置了ignoreScriptError，本次异常将不上报');
} else if (!l(o.jsErrFilter) || o.jsErrFilter.call(this, event)) {
  if (null != c) {
    var u = (c.stack || '').split('\n');
    u.shift();
    var f = {
      w_msg: message, // 错误信息
      w_file: file || '', // 错误文件
      w_line: line || '', // 错误行号
      w_col: colum || '', // 错误列号
      stack, // 错误堆栈
      category: 'JS_ERROR', // 错误类型
      sampleRate: 1, // JS错误采样率
    };
    e.report(f);
  }
} else {
  e.logger.warn('jserrFilter 返回false，本次日志将不上报, event: ', event);
}
```

- RESOURCE_ERROR

```js
c = function (e) {
  var r = -1;
  switch (e.tagName.toLowerCase()) {
    case 'img':
      r = 1;
      break;
    case 'link':
      e.rel && 'stylesheet' === e.rel.toLowerCase() && (r = 2);
      break;
    case 'script':
      r = 3;
      break;
    case 'video':
      r = 11;
  }
  return r;
};

p = function (e, r) {
  var t = e.id ? '#' + e.id : '',
    n = '';
  e.className &&
    'string' == typeof e.className &&
    (n = '.' + e.className.split(' ').join('.'));
  var o = e.tagName.toLowerCase();
  return e.parentNode && e.parentNode.tagName && r - 1 != 0
    ? p(e.parentNode, r - 1) + ' > ' + o.toLowerCase() + t + n
    : o + t + n;
};

if (!r.target.tagName || r.message || r.filename || r.lineno || r.colno) {
  e.logger.warn('非资源获取问题，跳出处理, event: ', r);
} else if (!l(o.resErrFilter) || o.resErrFilter.call(this, r)) {
  var t = r.target.src || r.target.href; // 资源路径
  e.report({
    category: 'RESOURCE_ERROR', // 错误类型
    sampleRate: 1, // 资源错误采样率
    msg: t + ' 加载失败', // 错误信息
    w_res: t, // 错误资源
    w_type: c(r.target), // 资源类型
    w_xpath: p(r.target, 5), // Xpath
  });
} else {
  e.logger.warn('resErrFilter 返回false，本次日志将不上报, event: ', r);
}
```

- HTTP_ERROR

```js
if (
  ('function' == typeof t.errorFilter &&
    ((o = !!(a = t.errorFilter.call(this, {
      url: h,
      status: r.status,
      response: n,
      body: w,
      queryString: y,
      reqHeaders: g,
      resHeaders: O,
    }))),
    e.logger.warn('api errorFilter执行结果：', a)),
  (n = n.length > 2048 ? '[response content too large]' : n),
  o && d - u < 121e3 && c(h))
) {
  var f = a.bizCode || r.status,
    _ = {
      category: 'HTTP_ERROR', // 错误类型
      sampleRate: 1, // HTTP错误采样率
      w_res: h, // 错误资源
      w_param: y, // 错误参数
      w_body: s(f) || !t.withBody ? '' : w, // 错误body
      w_method: l, // 错误方法
      w_rc: f, // 错误码
      w_rt: d - u, // 请求耗时
      w_resp: s(f) || !t.withResp ? '' : a.resp || n, // 错误响应
      msg: a.msg || '', // 错误信息
      w_type: 16, // 错误类型
    };
  e.report(_);
}
```
