import { HttpRequestBase } from './httpRequest'
import { HttpRequestOptions } from './httpRequestOptions'
import type { HttpRequestConfig } from './type'
import { useStorage } from '@/hooks/web/useStorage'

const { getStorage } = useStorage('localStorage')

// Http请求
export class DefaultHttpRequest extends HttpRequestBase {
  constructor(config?: HttpRequestConfig) {
    const options = new HttpRequestOptions()
    let defaultConfig = options.getConfig()
    if (config) {
      defaultConfig = Object.assign(defaultConfig, config)
    }
    // 获取当前语言
    const localeDropdownType = getStorage('lang') || 'zh-CN'
    defaultConfig.language = {
      defaultLanguage: localeDropdownType
    }

    // 配置默认请求地址
    defaultConfig.baseURL = import.meta.env.VITE_APP_BASE_API

    super(defaultConfig)
  }
}
