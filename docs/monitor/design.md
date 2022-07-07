# 监控系统设计

## 上报数据结构梳理

### sls-wpk-reporter

- JAVASCRIPT_ERROR

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

- VUE_ERROR

```js
function o(r, o) {
  var i, u;
  o
    ? (r.logger.info('vueplugin 已开启'),
      (i = o.config.errorHandler),
      (u = (function (o) {
        try {
          var e = (o.version || '').split('.');
          if (0 < e.length) return Number(e[0]);
        } catch (o) {}
        return 2;
      })(o)),
      r.logger.info('Vue version:', u),
      (o.config.errorHandler = function (o, e, t) {
        var n = '[object Object]' === Object.prototype.toString.call(e);
        r.reportError(o, {
          c1: n
            ? `${(function (o, e, t) {
                if ('vm' === o.$root) return '<Root>';
                var n =
                    3 === t
                      ? o.$options || o.constructor.options || {}
                      : 'function' == typeof o && null != o.cid
                      ? o.options
                      : o._isVue
                      ? o.$options || o.constructor.options
                      : o || {},
                  t = n.name || n._componentTag,
                  o = n.__file;
                return (
                  ((t = !t && o ? (n = o.match(/([^/\\]+)\.vue$/)) && n[1] : t)
                    ? 'component: <' +
                      t
                        .replace(/(?:^|[-_])(\w)/g, function (o) {
                          return o.toUpperCase();
                        })
                        .replace(/[-_]/g, '') +
                      '>'
                    : '<Anonymous>') + (o && !1 !== e ? ' file path: ' + o : '')
                );
              })(e, !0, u)}`
            : void 0,
          c2: void 0 !== t ? t : void 0,
        }),
          'function' == typeof i && i.call(this, o, e, t);
      }))
    : r.logger.warn('Vue 不存在');
}
```

- REACT_ERROR

```js
createErrorBoundaryHOC: function (n) {
      return function (e, o) {
        var r;
        function t() {
          var t = (null !== r && r.apply(this, arguments)) || this;
          return (t.state = { hasError: null, error: null, info: null }), t;
        }
        return (
          (function (t, r) {
            if (null !== r && 'function' != typeof r)
              throw new TypeError('superClass must be null or a function');
            t.prototype = Object.create(r && r.prototype, {
              constructor: {
                value: t,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            });
          })(t, (r = i.Component)),
          (t.prototype.componentDidCatch = function (t, r) {
            o && this.setState({ hasError: !0, error: t, info: r });
            try {
              n.reportError(t, { bl1: r.componentStack });
            } catch (t) {}
          }),
          (t.prototype.render = function () {
            if (this.state.hasError && o) {
              var t = this.state,
                r = t.error,
                t = t.info;
              return i.createElement(
                o,
                n.toolKit.extend({ error: r, info: t }, this.props)
              );
            }
            return i.createElement(e, this.props);
          }),
          t
        );
      };
    }
```

### Monitor

- JAVASCRIPT_ERROR、RESOURCE_ERROR

```js
/**
 * 处理window的error的监听回调
 */
handleError(errorEvent: ErrorEvent) {
  const target = errorEvent.target as ResourceErrorTarget
  if (target.localName) {
    // 资源加载错误 提取有用数据
    const data = resourceTransform(errorEvent.target as ResourceErrorTarget)
    breadcrumb.push({
      type: BREADCRUMBTYPES.RESOURCE,
      category: breadcrumb.getCategory(BREADCRUMBTYPES.RESOURCE),
      data,
      level: Severity.Error
    })
    return transportData.send(data)
  }
  // code error
  const { message, filename, lineno, colno, error } = errorEvent
  let result: ReportDataType
  if (error && isError(error)) {
    result = extractErrorStack(error, Severity.Normal)
  }
  // 处理SyntaxError，stack没有lineno、colno
  result || (result = HandleEvents.handleNotErrorInstance(message, filename, lineno, colno))
  result.type = ERRORTYPES.JAVASCRIPT_ERROR
  breadcrumb.push({
    type: BREADCRUMBTYPES.CODE_ERROR,
    category: breadcrumb.getCategory(BREADCRUMBTYPES.CODE_ERROR),
    data: { ...result },
    level: Severity.Error
  })
  transportData.send(result)
}

handleNotErrorInstance(message: string, filename: string, lineno: number, colno: number) {
  let name: string | ERRORTYPES = ERRORTYPES.UNKNOWN
  const url = filename || getLocationHref()
  let msg = message
  const matches = message.match(ERROR_TYPE_RE)
  if (matches[1]) {
    name = matches[1]
    msg = matches[2]
  }
  const element = {
    url,
    func: ERRORTYPES.UNKNOWN_FUNCTION,
    args: ERRORTYPES.UNKNOWN,
    line: lineno,
    col: colno
  }
  return {
    url,
    name,
    message: msg,
    level: Severity.Normal,
    time: getTimestamp(),
    stack: [element]
  }
}
```

- PROMISE_ERROR

```js
/**
 * 处理Promise的reject的监听回调
 */
handleUnhandleRejection(ev: PromiseRejectionEvent): void {
  let data: ReportDataType = {
    type: ERRORTYPES.PROMISE_ERROR,
    message: unknownToString(ev.reason),
    url: getLocationHref(),
    name: ev.type,
    time: getTimestamp(),
    level: Severity.Low
  }
  if (isError(ev.reason)) {
    data = {
      ...data,
      ...extractErrorStack(ev.reason, Severity.Low)
    }
  }
  breadcrumb.push({
    type: BREADCRUMBTYPES.UNHANDLEDREJECTION,
    category: breadcrumb.getCategory(BREADCRUMBTYPES.UNHANDLEDREJECTION),
    data: { ...data },
    level: Severity.Error
  })
  transportData.send(data)
}

```

- HTTP_ERROR

```js
handleHttp(data: MITOHttp, type: BREADCRUMBTYPES): void {
    const isError = data.status === 0 || data.status === HTTP_CODE.BAD_REQUEST || data.status > HTTP_CODE.UNAUTHORIZED
    const result = httpTransform(data)
    breadcrumb.push({
      type,
      category: breadcrumb.getCategory(type),
      data: { ...result },
      level: Severity.Info,
      time: data.time
    })
    if (isError) {
      breadcrumb.push({
        type,
        category: breadcrumb.getCategory(BREADCRUMBTYPES.CODE_ERROR),
        data: { ...result },
        level: Severity.Error,
        time: data.time
      })
      transportData.send(result)
    }
  },
```

- VUE_ERROR

```js
Vue.config.errorHandler = function (err, vm, info) {
  handleVueError.apply(null, [
    err,
    vm,
    info,
    Severity.Normal,
    Severity.Error,
    Vue,
  ]);
};

function handleVueError(err, vm, info, level, breadcrumbLevel, Vue) {
  var version = Vue === null || Vue === void 0 ? void 0 : Vue.version;
  var data = {
    type: ERRORTYPES.VUE_ERROR,
    message: err.message + '(' + info + ')',
    level: level,
    url: getLocationHref(),
    name: err.name,
    stack: err.stack || [],
    time: getTimestamp(),
  };
  data = __assign(__assign({}, data), {
    componentName: '',
    propsData: {},
  });
  breadcrumb.push({
    type: BREADCRUMBTYPES.VUE,
    category: breadcrumb.getCategory(BREADCRUMBTYPES.VUE),
    data: data,
    level: breadcrumbLevel,
  });
  transportData.send(data);
}
```

- REACT_ERROR

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, errorInfo) {
    MITO.errorBoundaryReport(error)
    if (error) {
      this.setState({
        hasError: true
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', null, '子组件抛出异常')
    }
    return this.props.children
  }
}

/**
 * 收集react ErrorBoundary中的错误对象
 * 需要用户手动在componentDidCatch中设置
 * @param ex ErrorBoundary中的componentDidCatch的一个参数error
 */
export function errorBoundaryReport(ex: any): void {
  if (!isError(ex)) {
    console.warn('传入的react error不是一个object Error')
    return
  }
  const error = extractErrorStack(ex, Severity.Normal) as ReportDataType
  error.type = ERRORTYPES.REACT_ERROR
  breadcrumb.push({
    type: BREADCRUMBTYPES.REACT,
    category: breadcrumb.getCategory(BREADCRUMBTYPES.REACT),
    data: `${error.name}: ${error.message}`,
    level: Severity.fromString(error.level)
  })
  transportData.send(error)
}

/**
 * 解析error的stack，并返回args、column、line、func、url:
 * @param ex
 * @param level
 */
export function extractErrorStack(ex: any, level: Severity): ReportDataType {
  const normal = {
    time: getTimestamp(),
    url: getLocationHref(),
    name: ex.name,
    level,
    message: ex.message
  }
  if (typeof ex.stack === 'undefined' || !ex.stack) {
    return normal
  }

  const chrome =
      /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
    gecko =
      /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
    winjs = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
    // Used to additionally parse URL/line/column from eval frames
    geckoEval = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
    chromeEval = /\((\S*)(?::(\d+))(?::(\d+))\)/,
    lines = ex.stack.split('\n'),
    stack = []

  let submatch, parts, element
  // reference = /^(.*) is undefined$/.exec(ex.message)

  for (let i = 0, j = lines.length; i < j; ++i) {
    if ((parts = chrome.exec(lines[i]))) {
      const isNative = parts[2] && parts[2].indexOf('native') === 0 // start of line
      const isEval = parts[2] && parts[2].indexOf('eval') === 0 // start of line
      if (isEval && (submatch = chromeEval.exec(parts[2]))) {
        // throw out eval line/column and use top-most line/column number
        parts[2] = submatch[1] // url
        parts[3] = submatch[2] // line
        parts[4] = submatch[3] // column
      }
      element = {
        url: !isNative ? parts[2] : null,
        func: parts[1] || ERRORTYPES.UNKNOWN_FUNCTION,
        args: isNative ? [parts[2]] : [],
        line: parts[3] ? +parts[3] : null,
        column: parts[4] ? +parts[4] : null
      }
    } else if ((parts = winjs.exec(lines[i]))) {
      element = {
        url: parts[2],
        func: parts[1] || ERRORTYPES.UNKNOWN_FUNCTION,
        args: [],
        line: +parts[3],
        column: parts[4] ? +parts[4] : null
      }
    } else if ((parts = gecko.exec(lines[i]))) {
      const isEval = parts[3] && parts[3].indexOf(' > eval') > -1
      if (isEval && (submatch = geckoEval.exec(parts[3]))) {
        // throw out eval line/coluqqqqqqqqqqqqqqqqqqqqqqqqqqqqmn and use top-most line number
        parts[3] = submatch[1]
        parts[4] = submatch[2]
        parts[5] = null // no column when eval
      } else if (i === 0 && !parts[5] && typeof ex.columnNumber !== 'undefined') {
        // FireFox uses this awesome columnNumber property for its top frame
        // Also note, Firefox's column number is 0-based and everything else expects 1-based,
        // so adding 1
        // NOTE: this hack doesn't work if top-most frame is eval
        stack[0].column = ex.columnNumber + 1
      }
      element = {
        url: parts[3],
        func: parts[1] || ERRORTYPES.UNKNOWN_FUNCTION,
        args: parts[2] ? parts[2].split(',') : [],
        line: parts[4] ? +parts[4] : null,
        column: parts[5] ? +parts[5] : null
      }
    } else {
      continue
    }

    if (!element.func && element.line) {
      element.func = ERRORTYPES.UNKNOWN_FUNCTION
    }

    stack.push(element)
  }

  if (!stack.length) {
    return null
  }
  return {
    ...normal,
    stack: stack
  }
}
```
