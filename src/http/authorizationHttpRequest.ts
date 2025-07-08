import { ElMessage } from 'element-plus'
import { HttpRequestBase } from './httpRequest'
import router from '@/router'
import { DefaultHttpRequest } from './defaultHttpRequest'
import type { Token } from './type'
import { HttpRequestOptions } from './httpRequestOptions'
import { useUserStore } from '@/store/modules/user'

export class AuthorizationHttpRequest extends HttpRequestBase {
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
        const defaultHttpRequest = new DefaultHttpRequest()
        const token = await defaultHttpRequest.post<Token>('/api/net/basics/accounts/refresh', {
          refreshToken
        })
        return token
      },
      routerPush: () => {
        // 跳转到登录页需要退出避免无法跳转到login页面
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
      }
    }
    super(config)
  }
}
