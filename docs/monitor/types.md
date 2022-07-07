## 监控数据类型定义

```ts
interface TransportDataType {
  authInfo?: AuthInfo
  deviceInfo?: DeviceInfo
  breadcrumb?: Breadcrumb[]
  data?: ReportDataType
}

interface AuthInfo { // 用户信息
  uid?: string // 用户ID
}

interface DeviceInfo { // 设备信息
   netType: string // 网络类型: 4g,3g,5g,wifi
}

interface Breadcrumb {
  type: BreadcrumbTypes
  data: ReportDataType | IRouter | TriggerConsole | TNumStrObj
  category?: BreadcrumbCategory
  time?: number
  level: Severity
}

type TNumStrObj = number | string | object

interface IRouter {
  from: string
  to: string
}

interface TriggerConsole {
  args: any[]
  level: string
}

enum BreadcrumbTypes {
  // BreadcrumbCategory.HTTP
  XHR = 'Xhr',
  // BreadcrumbCategory.USER
  ROUTE = 'Route',
  CLICK = 'Click',
  // BreadcrumbCategory.EXCEPTION
  CODE_ERROR = 'Code Error',
  RESOURCE = 'Resource',
  UNHANDLED_REJECTION = 'Unhandled Rejection',
  VUE = 'Vue',
  REACT = 'React',
  // BreadcrumbCategory.DEBUG
  CONSOLE = 'Console',

  CUSTOMER = 'Customer'
}

export enum BreadcrumbCategory {
  HTTP = 'http',
  USER = 'user',
  DEBUG = 'debug',
  EXCEPTION = 'exception',
}

interface ReportDataType extends ICommonDataType {
  type?: ErrorTypes
  message?: string
  url: string
  name?: string
  stack?: ErrorStack // 错误堆栈
  time?: number
  errorId?: number
  level: string
  // ajax
  elapsedTime?: number // 耗时
  request?: {
    httpType?: string
    traceId?: string
    method: string
    url: string
    data: any
  }
  response?: {
    status: number
    data: string
  }
  // vue
  componentName?: string
  propsData?: any
}

export enum ErrorTypes {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',
  LOG_ERROR = 'LOG_ERROR',
  FETCH_ERROR = 'HTTP_ERROR',
  VUE_ERROR = 'VUE_ERROR',
  REACT_ERROR = 'REACT_ERROR',
  RESOURCE_ERROR = 'RESOURCE_ERROR',
  PROMISE_ERROR = 'PROMISE_ERROR',
  ROUTE_ERROR = 'ROUTE_ERROR'
}

interface ErrorStack {
  args: any[]
  func: string
  column: number
  line: number
  url: string
}
```

```ts
// sls-wpk-reporter

interface JsError {
  msg: string, // 错误信息
  file: string, // 错误文件
  line: string, // 错误行号
  colum: string, // 错误列号
  stack, // 错误堆栈
  category: string, // 错误类型
  sampleRate: number, // JS错误采样率 0-1
}

interface ResourceError {
  msg: string, // 错误信息 资源 + ' 加载失败'
  res: string, // 错误资源
  type: string, // 资源类型
  xpath: string, // Xpath
  category: string, // 错误类型
  sampleRate: number, // JS错误采样率 0-1
}

interface HttpError {
  msg: string, // 错误信息 资源 + ' 加载失败'
  category: string, // 错误类型
  sampleRate: number, // JS错误采样率 0-1
  res: string, // 错误
  param: any, // 错误参数
  body: any, // 错误body
  method: string, // 错误方法
  code: number, // 错误码
  time: number, // 请求耗时
  resp: any, // 错误响应
  msg:string, // 错误信息
}

interface VueError {
  componentName?: string
}

interface VueError {
  componentStack?: string
}

```