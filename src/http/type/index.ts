import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosInterceptorOptions
} from 'axios'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  CONNECT = 'CONNECT',
  TRACE = 'TRACE'
  // 已废弃的方法，可以根据需要决定是否包含
  //LINK = 'LINK',
  //UNLINK = 'UNLINK'
}

// 刷新token请求
export interface RefreshTokenRequest {
  refreshToken: string
}

// 刷新Token标记
export interface RefreshTokenFlag {
  // 是否正在刷新
  isRefreshing: boolean
  // 重试队列
  requests: any
  // 刷新次数
  frequency: number
}

// 响应异常配置
export interface ResponseInterceptorCatchConfig {
  instance: AxiosInstance
  refreshToken?: RefreshTokenFlag
}

// token信息
export interface Token {
  accessToken: string
  tokenType: string
  refreshToken: string
  expiresIn: number
}

// 拦截配置
export interface InterceptorHooksConfig {
  // 请求拦截
  requestInterceptor?:
    | ((
        config: InternalAxiosRequestConfig
      ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>)
    | null
  // 请求异常拦截
  requestInterceptorCatch?: ((error: any) => any) | null
  // 请拦截配置
  requestInterceptorOptions?: AxiosInterceptorOptions
  // 响应拦截
  responseInterceptor?: ((response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>) | null
  // 响应异常拦截
  responseInterceptorCatch?: ((error: any, config: ResponseInterceptorCatchConfig) => any) | null
}

// 请求配置
export interface HttpRequestConfig extends AxiosRequestConfig, InterceptorHooksConfig {
  // 授权相
  authorization?: {
    // 刷新token最大重试次数
    maxRefreshTokenFrequency: number
    // 刷新token函数
    refreshToken: (refreshToken: string) => Promise<Token>
    // 如果异常则路由调整登录页面函数
    routerPush: () => void
  }
  // 语言
  language?: {
    // 默认语言
    defaultLanguage?: string
  }
  // 错误提示
  errorAlert?: (error: string) => void
}

// ABP错误信息数据格式{2}
export interface AbpError {
  error: AbpErrorItemData
}
export interface AbpErrorItemData {
  code?: string
  message: string
  details: string
  data: Record<string, any>
  validationErrors: Array<{
    message: string
    members: Array<string>
  }>
}

// ABP错误信息数据格式{1}
export interface AbpErrorData {
  traceId?: string
  type?: string
  title?: string
  status: number
  errors: Record<string, string>
}
