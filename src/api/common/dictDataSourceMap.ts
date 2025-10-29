// @/hooks/dictDataSourceMap.ts
import {
  getEnumListApi,
  getDictSelectListApi,
  getDepartmentSelectListApi,
  getBloodMatchResultDefaultApi
} from '@/api/common/index'
import { BaseDict } from '@/api/common/const'
import { DefaultValueSource, DictDataSource, DictType } from './type'

/**
 * 获取枚举数据源
 * @param type 枚举类型
 * @returns 枚举数据列表
 */
export const enumDataSource: DictDataSource = async (type: DictType) => {
  const res = await getEnumListApi(type)
  return res.map((item) => ({
    label: item.text,
    value: item.value,
    disabled: false
  }))
}

/**
 * 通用字典（兜底）
 * @param type 普通数据源类型
 * @returns 普通数据源列表
 */
export const commonDictDataSource: DictDataSource = async (type: DictType) => {
  const res = await getDictSelectListApi(type)
  return res.map((item) => ({
    label: item.text,
    value: item.value,
    disabled: item.isEnabled === false
  }))
}

/**
 * 字典数据源映射
 * @remarks 特殊字典类型的数据源处理
 */
export const dictDataSourceMap: Partial<Record<DictType, DictDataSource>> = {
  // 特殊类型：department
  [BaseDict.department]: async () => {
    const res = await getDepartmentSelectListApi()
    return res.map((item) => ({
      label: item.text,
      value: item.value,
      disabled: item.isEnabled === false
    }))
  }
}

/**
 * 默认值提取映射
 * @remarks 特殊字典类型的默认值处理
 */
export const extractDefaultValue: Partial<Record<DictType, DefaultValueSource>> = {
  // 特殊类型：bloodMatchResult
  [BaseDict.bloodMatchResult]: async () => {
    const res = await getBloodMatchResultDefaultApi()
    return res?.id ?? null
  }
}
