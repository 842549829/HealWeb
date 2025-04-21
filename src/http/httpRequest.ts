import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import type {
  HttpRequestConfig,
  RefreshTokenFlag,
  Token,
  ResponseInterceptorCatchConfig,
  AbpErrorData,
  AbpError
} from './type'

import { tokenService, languageService } from './storageService'

/*
 * @description: 封装axios
 */
export class HttpRequestBase {
  // 取消令牌
  abortControllerMap: Map<string, AbortController>

  // axios 实例
  instance: AxiosInstance

  // 默认配置
  baseConfig: AxiosRequestConfig = { baseURL: '/api', timeout: 60000 }

  // 配置
  httpRequestConfig: HttpRequestConfig

  // 刷新token
  refreshToken?: RefreshTokenFlag

  // 构造函数
  constructor(config: HttpRequestConfig) {
    this.abortControllerMap = new Map()

    this.httpRequestConfig = config

    // 创建axios 实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    if (config.authorization) {
      // 初始化是否正在刷新
      this.refreshToken = { isRefreshing: false, requests: [], frequency: 0 }
    }

    this.setupInterceptor(config)
  }

  // 设置拦截器
  setupInterceptor(interceptorHooks: HttpRequestConfig): void {
    if (interceptorHooks) {
      // 取消令牌请求拦截拦截器
      this.instance.interceptors.request.use((res: InternalAxiosRequestConfig) => {
        const controller = new AbortController()
        const url = res.url || ''
        res.signal = controller.signal
        this.abortControllerMap.set(
          import.meta.env.VITE_USE_MOCK === 'true' ? url.replace('/mock', '') : url,
          controller
        )
        return res
      })

      this.instance.interceptors.request.use(
        interceptorHooks.requestInterceptor,
        interceptorHooks.requestInterceptorCatch,
        interceptorHooks.requestInterceptorOptions
      )

      // 取消令牌响应拦截器
      this.instance.interceptors.response.use((res: AxiosResponse) => {
        const url = res.config.url || ''
        this.abortControllerMap.delete(url)
        // 这里不能做任何处理，否则后面的 interceptors 拿不到完整的上下文了
        return res
      })

      this.instance.interceptors.response.use(
        interceptorHooks?.responseInterceptor,
        async (axiosError: any) => {
          if (interceptorHooks?.responseInterceptorCatch) {
            return interceptorHooks?.responseInterceptorCatch(axiosError, {
              instance: this.instance,
              refreshToken: this.refreshToken
            })
          }
          return await Promise.reject(axiosError.response)
        }
      )
    }
  }

  // request
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  // getUri
  public getUri(config?: AxiosRequestConfig): string {
    return this.instance.getUri(config)
  }

  // get
  public async get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return await this.instance.get(url, config)
  }

  // post (T:返回参数类型 D:传入参数类型)
  public post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.post(url, data, config)
  }

  // put
  public put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.put(url, data, config)
  }

  // delete
  public delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.delete(url, config)
  }

  // head
  public head<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.head(url, config)
  }

  // options
  public options<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.options(url, config)
  }

  // patch
  public patch<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  // postForm
  public postForm<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.postForm(url, data, config)
  }

  // putForm
  public putForm<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.putForm(url, data, config)
  }

  // patchForm
  public patchForm<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.instance.patchForm(url, data, config)
  }

  // 取消请求
  public cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      this.abortControllerMap.get(_url)?.abort()
      this.abortControllerMap.delete(_url)
    }
  }

  // 取消所有请求
  public cancelAllRequest() {
    for (const [_, controller] of this.abortControllerMap) {
      controller.abort()
    }
    this.abortControllerMap.clear()
  }
}

// 请求配置
export class HttpRequestOptions {
  // 请求配置
  private config?: HttpRequestConfig

  constructor(config?: HttpRequestConfig) {
    this.config = config
  }

  // 类型缩小
  public isAbpErrorData(data: AbpErrorData | AbpError): data is AbpErrorData {
    return 'errors' in data && typeof data.errors === 'object'
  }

  // 类型缩小
  public isAbpError(data: AbpErrorData | AbpError): data is AbpError {
    return 'error' in data && data.error !== undefined
  }

  // 获取返回数据
  public getHttpResponseError(axiosError: AxiosError) {
    const data: any = axiosError.response?.data
    return data?.error?.message
  }

  public getMessage(axiosError: AxiosError<AbpErrorData | AbpError>) {
    let message = '连接出错'
    switch (axiosError.response?.status) {
      case 400: {
        const data = axiosError.response?.data
        if (data) {
          if (this.isAbpError(data)) {
            const error = data?.error
            if (error) {
              const validationErrors = error.validationErrors
              if (validationErrors) {
                message = validationErrors[0].message
              } else {
                message = error.details ?? error.message
              }
            }
          } else if (this.isAbpErrorData(data)) {
            const errors = data?.errors
            message = errors?.[Object.keys(errors)[0]][0]
          }
        }
        message = message ?? '请求错误(400)'
        break
      }
      case 401:
        {
          const msg = this.getHttpResponseError(axiosError)
          message = msg ?? '未授权，请重新登录(401)'
        }
        break
      case 403:
        {
          const msg = this.getHttpResponseError(axiosError)
          message = msg ?? '拒绝访问(403)'
        }
        break
      case 404:
        message = '请求出错(404)'
        break
      case 408:
        message = '请求超时(408)'
        break
      case 500:
        message = '服务器错误(500)'
        break
      case 501:
        message = '服务未实现(501)'
        break
      case 502:
        message = '网络错误(502)'
        break
      case 503:
        message = '服务不可用(503)'
        break
      case 504:
        message = '网络超时(504)'
        break
      case 505:
        message = 'HTTP版本不受支持(505)'
        break
      default:
        message = `连接出错(${axiosError.response?.status})!`
    }
    return message
  }

  public setAuthorization(config: InternalAxiosRequestConfig): void {
    const token: Token | null = tokenService.getTokens()
    if (token != null && token.accessToken !== '') {
      const authorization = `Bearer ${token.accessToken}`
      config.headers.set('Authorization', authorization)
    }
  }

  public setLanguage(config: InternalAxiosRequestConfig): void {
    let lang = this.config?.language?.defaultLanguage || 'zh-cn'
    const language: string | null = languageService.getLanguage()
    if (language != null && language !== '') {
      lang = language
    }
    config.headers.set('Accept-Language', lang)
  }

  // 处理错误信息
  public async handleResponseInterceptorCatch(
    axiosError: any,
    responseInterceptorCatchConfig: ResponseInterceptorCatchConfig
  ): Promise<any> {
    let message: string = '连接错误'
    // 这里用来处理http常见错误，进行全局提示
    if (axiosError.response === undefined) {
      message = '请检查网络或联系管理员'
    } else if (axiosError.response?.status === 401) {
      if (this.config?.authorization && responseInterceptorCatchConfig.refreshToken) {
        // 1.根据刷新refreshToken刷新accessToken
        // 2.刷新成功 则存将新的refreshToken存入localStorage 并且重新请求当前接口
        // 3.刷新失败 则跳转登录页面重新登录
        if (responseInterceptorCatchConfig.refreshToken.isRefreshing === true) {
          // 返回未执行 resolve 的 Promise
          return new Promise((resolve) => {
            if (responseInterceptorCatchConfig.refreshToken) {
              // 用函数形式将 resolve 存入，等待刷新后再执行
              responseInterceptorCatchConfig.refreshToken.requests.push((token: string) => {
                axiosError.config.headers.Authorization = `Bearer ${token}`
                resolve(responseInterceptorCatchConfig.instance.request(axiosError.config))
              })
            }
          })
        }

        if (
          responseInterceptorCatchConfig.refreshToken.frequency >
          this.config.authorization.maxRefreshTokenFrequency
        ) {
          this.config.authorization.routerPush()
          return Promise.reject('不在刷新')
        }

        // 刷新接口
        const token: Token | null = tokenService.getTokens()
        if (token === null) {
          this.config.authorization.routerPush()
          return Promise.reject('跳转到登录')
        }

        try {
          // 正在刷新Token
          responseInterceptorCatchConfig.refreshToken.isRefreshing = true

          // 刷新token
          const tokenResult = await this.config.authorization.refreshToken(token.refreshToken)
          tokenService.setTokens(tokenResult)
          axiosError.config.headers.Authorization = `Bearer ${tokenResult.accessToken}`

          // token 刷新后将数组的方法重新执行
          responseInterceptorCatchConfig.refreshToken.requests.forEach((cb: any) => cb(token))

          // 重试次数+1
          responseInterceptorCatchConfig.refreshToken.frequency++

          // 重新请求
          return responseInterceptorCatchConfig.instance.request(axiosError.config!)
        } catch (error: any) {
          // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
          return Promise.reject(axiosError.response)
        } finally {
          responseInterceptorCatchConfig.refreshToken.isRefreshing = false
        }
      }
    } else {
      // 继续处理 比如abp错误
      message = this.getMessage(axiosError)
    }
    if (this.config?.errorAlert) {
      // 这里错误消息可以使用全局弹框展示出来
      this.config.errorAlert(message)
    }

    // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
    return Promise.reject(message)
  }

  // 返回配置
  public getConfig(): HttpRequestConfig {
    const defaultConfig: HttpRequestConfig = {
      baseURL: import.meta.env.VITE_APP_BASE_API,
      requestInterceptor: (config: InternalAxiosRequestConfig) => {
        // 一般会请求拦截里面加token，用于后端的验证
        if (this.config?.authorization) {
          this.setAuthorization(config)
        }

        // 设置请求语言
        if (this.config?.language) {
          this.setLanguage(config)
        }

        return config
      },
      requestInterceptorCatch: (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err)
      },
      responseInterceptor: (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        return res.data
      },
      responseInterceptorCatch: async (error: any, config: ResponseInterceptorCatchConfig) => {
        // 错误异常处理
        return await this.handleResponseInterceptorCatch(error, config)
      }
    }

    if (this.config) {
      return Object.assign(defaultConfig, this.config)
    }
    return defaultConfig
  }
}
