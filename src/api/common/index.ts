import request from '@/axios'
import { DictType } from './type'

// 获取所有字典
export const getDictApi = () => {
  return request.get({ url: '/mock/dict/list' })
}

// 模拟获取某个字典
export const getDictOneApi = async () => {
  return request.get({ url: '/mock/dict/one' })
}

/**
 * 获取枚举列表(TODO Test)
 * @param type 枚举名称
 * @returns 枚举列表
 */
export const getEnumListApi = (type: DictType) => {
  console.log('type: ', type)
  return new Promise<{ text: string; value: string }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { text: '枚举项1', value: 'enum1' },
        { text: '枚举项2', value: 'enum2' }
      ])
    }, 500)
  })
}

/**
 * 获取字典列表(TODO Test)
 * @param type 字典类型
 * @returns 字典列表
 */
export const getDictSelectListApi = (type: DictType) => {
  console.log('type: ', type)
  return new Promise<{ text: string; value: string; isEnabled: boolean }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { text: '字典项1', value: 'dict1', isEnabled: true },
        { text: '字典项2', value: 'dict2', isEnabled: false }
      ])
    }, 500)
  })
}

/**
 * 字典数据源映射(TODO Test)
 * @remarks 特殊字典类型的数据源处理
 */
export const getDepartmentSelectListApi = () => {
  return new Promise<{ text: string; value: string; isEnabled: boolean }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { text: '字典项1', value: 'dict1', isEnabled: true },
        { text: '字典项2', value: 'dict2', isEnabled: false }
      ])
    }, 500)
  })
}

/**
 * 获取血液匹配结果默认值(TODO Test)
 * @returns 匹配结果默认值
 */
export const getBloodMatchResultDefaultApi = () => {
  return new Promise<{ id: string }>((resolve) => {
    setTimeout(() => {
      resolve({ id: 'dict1' })
    }, 500)
  })
}
