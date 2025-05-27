import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import type {
  HttpRequestConfig,
  Token,
  ResponseInterceptorCatchConfig,
  AbpErrorData,
  AbpError
} from './type'

import type { LocaleDropdownType } from '@/components/LocaleDropdown'
import { useLocaleStore } from '@/store/modules/locale'
import { useUserStore } from '@/store/modules/user'
import type { UserType } from '@/api/login/types'
import { Jwt, parseJwt } from '@/utils/token'
import { useI18n } from '@/hooks/web/useI18n'

// 获取i18n
const { t } = useI18n()

// 请求配置
export class HttpRequestOptions {
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
    let message = t('http.requestNetworkError')
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
        message = message ?? t('http.requestError400')
        break
      }
      case 401:
        {
          const msg = this.getHttpResponseError(axiosError)
          message = msg ?? t('http.requestError401')
        }
        break
      case 403:
        {
          const msg = this.getHttpResponseError(axiosError)
          message = msg ?? t('http.requestError403')
        }
        break
      case 404:
        message = t('http.requestError404')
        break
      case 405:
        message = t('http.requestError405')
        break
      case 408:
        message = t('http.requestError408')
        break
      case 500:
        message = t('http.requestError500')
        break
      case 501:
        message = t('http.requestError501')
        break
      case 502:
        message = t('http.requestError502')
        break
      case 503:
        message = t('http.requestError503')
        break
      case 504:
        message = t('http.requestError504')
        break
      case 505:
        message = t('http.requestError505')
        break
      default:
        message = `${t('http.requestNetworkError')}(${axiosError.response?.status})!`
    }
    return message
  }

  public setAuthorization(config: InternalAxiosRequestConfig): void {
    const userStore = useUserStore()
    const userType: UserType | undefined = userStore.getUserInfo
    if (userType && userType.accessToken) {
      const authorization = `Bearer ${userType.accessToken}`
      config.headers.set('Authorization', authorization)
    }
  }

  public setLanguage(config: InternalAxiosRequestConfig): void {
    const localeStore = useLocaleStore()
    let lang = this.config?.language?.defaultLanguage || 'zh-cn'
    const language: LocaleDropdownType = localeStore.getCurrentLocale
    if (language && language.lang) {
      lang = language.lang
    }
    config.headers.set('Accept-Language', lang)
  }

  // 处理错误信息
  public async handleResponseInterceptorCatch(
    axiosError: any,
    responseInterceptorCatchConfig: ResponseInterceptorCatchConfig
  ): Promise<any> {
    let message: string = t('http.requestNetworkError')
    // 这里用来处理http常见错误，进行全局提示
    if (axiosError.response === undefined) {
      message = t('http.networkError') //
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
        const userStore = useUserStore()
        const userType: UserType | undefined = userStore.getUserInfo
        if (!userType || !userType.accessToken || !userType.refreshToken) {
          this.config.authorization.routerPush()
          return Promise.reject('跳转到登录')
        }

        const token: Token = {
          accessToken: userType.accessToken,
          tokenType: userType.tokenType,
          refreshToken: userType.refreshToken,
          expiresIn: userType.expiresIn
        }

        try {
          // 正在刷新Token
          responseInterceptorCatchConfig.refreshToken.isRefreshing = true

          // 刷新token
          const tokenResult = await this.config.authorization.refreshToken(userType.refreshToken)
          const jwt: Jwt = parseJwt(tokenResult.accessToken)
          const res: UserType = {
            userId: jwt.payload.sub,
            username: jwt.payload.given_name,
            accessToken: tokenResult.accessToken,
            refreshToken: tokenResult.refreshToken,
            expiresIn: tokenResult.expiresIn,
            tokenType: tokenResult.tokenType
          }
          userStore.setUserInfo(res)

          axiosError.config.headers.Authorization = `Bearer ${tokenResult.accessToken}`

          // token 刷新后将数组的方法重新执行
          responseInterceptorCatchConfig.refreshToken.requests.forEach((cb: any) => cb(token))

          // 重试次数+1
          responseInterceptorCatchConfig.refreshToken.frequency++

          // 重新请求
          return responseInterceptorCatchConfig.instance.request(axiosError.config!)
        } catch (error: any) {
          // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
          console.log(error)
          userStore.logout()
          this.config.authorization?.routerPush?.()
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
    } else {
      this.config = defaultConfig
      return defaultConfig
    }
  }
}
