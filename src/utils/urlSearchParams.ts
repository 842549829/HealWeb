/**
 * 将json对象转换为url参数
 * @param json json对象
 * @returns url
 */
export const jsonToUrlParam = <T extends object>(json: T): string => {
  return Object.keys(json)
    .filter((key) => json[key as keyof T] !== null && json[key as keyof T] !== undefined)
    .map((key) => key + '=' + json[key as keyof T])
    .join('&')
}

/**
 * 将json对象转换为url参数
 * @param json json对象
 * @returns url
 */
export const jsonToUrlParam2 = (json: { [key: string]: string }): string => {
  return new URLSearchParams(json).toString()
}

/**
 * 将url参数转换为json对象
 * @param url url参数
 * @returns json对象
 */
export const urlParamToJson = (url: string): { [key: string]: string | null } => {
  const params = new URLSearchParams(url)
  const result: { [key: string]: string | null } = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

/**
 * 获取api url
 * @param url url
 * @param data data
 * @returns url
 */
export const getApiUrl = (url: string, data: string): string => {
  return `${url}?${data}`
}

/**
 * 获取url参数
 * @param url url
 * @param json json
 * @returns url
 */
export const getUrlParameters = <T extends object>(url: string, json: T): string => {
  const paramenter = jsonToUrlParam(json)
  return getApiUrl(url, paramenter)
}

/**
 * 替换字符串中的 {0}, {1}, {2}... 占位符
 * @param template 模板字符串，如 "/{0}/roles/{1}"
 * @param args 替换参数数组，如 ["users", "admin"]
 */
export const urlFormatString = (
  template: string,
  ...args: (string | number | undefined)[]
): string => template.replace(/{(\d+)}/g, (_, index) => String(args[index] ?? ''))
