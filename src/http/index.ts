import { ElMessage } from 'element-plus'
import { HttpRequestBase } from './httpRequest'
import router from '@/router'
import { defaultHttpRequest } from './defaultHttpRequest'
import type { Token } from './type'
import { HttpRequestOptions } from './httpRequestOptions'

// 未登录的请求
class UnAuthorizationHttpRequest extends HttpRequestBase {
  constructor() {
    const options = new HttpRequestOptions()
    const config = options.getConfig()
    config.baseURL = import.meta.env.VITE_APP_BASE_API
    console.log(import.meta.env.VITE_APP_BASE_API)
    config.errorAlert = (error: string) => {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error'
      })
    }
    super(config)
  }
}

// 已认证的请求
class AuthorizationHttpRequest extends HttpRequestBase {
  constructor() {
    const options = new HttpRequestOptions()
    const config = options.getConfig()
    config.baseURL = import.meta.env.VITE_APP_BASE_API
    config.language = {
      defaultLanguage: 'zh-cn'
    }
    config.errorAlert = (error: string) => {
      ElMessage({
        showClose: true,
        message: error,
        type: 'error'
      })
    }
    config.authorization = {
      maxRefreshTokenFrequency: 3,
      refreshToken: async (refreshToken: string) => {
        const token = await defaultHttpRequest.post<Token>('/api/basics/accounts/refresh', {
          refreshToken
        })
        return token
      },
      routerPush: () => {
        router.push('/login')
      }
    }
    super(config)
  }
}

// 已认证的请求
const authorizationHttpRequest = new AuthorizationHttpRequest()

// 未认证的请求
const unAuthorizationHttpRequest = new UnAuthorizationHttpRequest()

// 导出
export { authorizationHttpRequest, unAuthorizationHttpRequest }
