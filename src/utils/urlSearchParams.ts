export const jsonToUrlParam = <T extends object>(json: T): string => {
  return Object.keys(json)
    .filter((key) => json[key as keyof T] !== null && json[key as keyof T] !== undefined)
    .map((key) => key + '=' + json[key as keyof T])
    .join('&')
}

export const jsonToUrlParam2 = (json: { [key: string]: string }): string => {
  return new URLSearchParams(json).toString()
}

export const urlParamToJson = (url: string): { [key: string]: string | null } => {
  const params = new URLSearchParams(url)
  const result: { [key: string]: string | null } = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

export const getApiUrl = (url: string, data: string): string => {
  return `${url}?${data}`
}

export const getUrlParameters = <T extends object>(url: string, json: T): string => {
  const paramenter = jsonToUrlParam(json)
  return getApiUrl(url, paramenter)
}
