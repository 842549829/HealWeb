import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

import type { HttpRequestConfig, RefreshTokenFlag } from './type'

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
