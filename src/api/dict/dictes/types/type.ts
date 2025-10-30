import { Enable } from '@/api/common/enum'
import {
  EntityDto,
  ExtensibleObject,
  FilterInput,
  IHasConcurrencyStamp,
  IMultiTenant
} from '@/api/common/type'

/**
 * 获取字典类型
 */
export type GetDictTypeInput = FilterInput

/**
 * 字典类型DTO
 */
export interface DictTypeDto
  extends ExtensibleObject<string>,
    EntityDto<string>,
    IMultiTenant,
    IHasConcurrencyStamp {
  /**
   * 别名
   */
  alias?: string

  /**
   * 父级字典类型
   */
  parentId?: string

  /**
   * 状态
   */
  status: Enable

  /**
   * 名称
   */
  name: string

  /**
   * 描述
   */
  describe: string

  /**
   * 编码
   */
  code: string

  /**
   * 排序
   */
  sort: number
}

/**
 * 创建或更新字典类型基类
 */
interface DictTypeCreateOrUpdateDtoBase extends ExtensibleObject<string> {
  /**
   * 名称
   */
  name: string

  /**
   * 描述
   */
  describe: string

  /**
   * 排序
   */
  sort: number
}

/**
 * 创建字典类型
 */
export interface DictTypeCreateDto extends DictTypeCreateOrUpdateDtoBase {
  /**
   * 父级字典类型
   */
  parentId?: string

  /**
   * 编码
   */
  code: string
}

/**
 * 修改字典类型
 */
export interface DictTypeUpdateDto extends DictTypeCreateOrUpdateDtoBase, IHasConcurrencyStamp {
  /**
   * 状态
   */
  status: Enable
}
