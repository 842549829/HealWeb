import { toLowerCaseFirstLetter } from './stringUtils'

/**
 *  生成枚举绑定下拉数据
 * @param enumObj enum对象
 * @param t 语言函数
 * @param prefix 前缀
 * @returns 枚举绑定下拉数据
 */
export const generateEnumOptionsLocales = (
  enumObj: Record<string, any>,
  t: (key: string) => string,
  prefix: string | undefined = undefined
) => {
  const keys = Object.keys(enumObj).filter((k) => isNaN(Number(k)))
  return keys.map((key) => {
    const value = enumObj[key]
    return {
      label: prefix
        ? t(`${prefix}.${toLowerCaseFirstLetter(key)}`)
        : t(`${toLowerCaseFirstLetter(key)}`),
      value
    }
  })
}
