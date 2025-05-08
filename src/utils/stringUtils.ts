/**
 * 将字符串首字母转为小写
 * @param str 输入字符串
 * @returns 将字符串首字母转为小写后的字符串
 */
export const toLowerCaseFirstLetter = (str: string): string =>
  str.charAt(0).toLowerCase() + str.slice(1)
