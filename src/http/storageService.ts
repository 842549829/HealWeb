// 操作浏览器localStorage
export class StorageService {
  // 使用localStorage存储数据
  setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  // 从localStorage获取数据
  getItem<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key)
    return itemStr ? JSON.parse(itemStr) : null
  }

  // 从localStorage删除数据
  removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  // 清空所有localStorage数据
  clear(): void {
    localStorage.clear()
  }
}

import type { Token } from './type'

class TokenService {
  private storageKey = 'authTokens'

  // 获取Token信息
  getTokens(): Token | null {
    const tokensStr = localStorage.getItem(this.storageKey)
    return tokensStr ? JSON.parse(tokensStr) : null
  }

  // 设置Token信息
  setTokens(tokenInfo: Token): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tokenInfo))
  }

  // 清除Token信息
  clearTokens(): void {
    localStorage.removeItem(this.storageKey)
  }

  // 获取当前AccessToken
  getAccessToken(): string | null {
    const tokens = this.getTokens()
    return tokens ? tokens.accessToken : null
  }

  // 获取当前RefreshToken
  getRefreshToken(): string | null {
    const tokens = this.getTokens()
    return tokens ? tokens.refreshToken : null
  }
}

class LanguageService {
  private storageKey = 'language'

  getLanguage(): string | null {
    return localStorage.getItem(this.storageKey)
  }

  setLanguage(language: string): void {
    localStorage.setItem(this.storageKey, language)
  }

  clearLanguage(): void {
    localStorage.removeItem(this.storageKey)
  }
}

export const tokenService = new TokenService()
export const languageService = new LanguageService()
