import { ElMessage } from 'element-plus'
import { HttpRequestBase } from './httpRequest'
import { HttpRequestOptions } from './httpRequestOptions'

// 未登录的请求
export class UnAuthorizationHttpRequest extends HttpRequestBase {
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
