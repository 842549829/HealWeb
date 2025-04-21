import { HttpRequestOptions, HttpRequestBase } from './httpRequest'
import type { HttpRequestConfig } from './type'
import { useLocaleStore } from '@/store/modules/locale'

// 语言
const localeStore = useLocaleStore()

export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

// Http请求
export class DefaultHttpRequest extends HttpRequestBase {
  constructor(config?: HttpRequestConfig) {
    const options = new HttpRequestOptions()
    let defaultConfig = options.getConfig()
    if (config) {
      defaultConfig = Object.assign(defaultConfig, config)
    }

    // 获取当前语言
    const localeDropdownType = localeStore.currentLocale
    defaultConfig.language = {
      defaultLanguage: localeDropdownType.lang
    }

    // 配置默认请求地址
    defaultConfig.baseURL = PATH_URL

    super(defaultConfig)
  }
}
export const defaultHttpRequest = new DefaultHttpRequest()
