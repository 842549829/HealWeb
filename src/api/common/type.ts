/**
 * 模块标签（支持位运算）
 */
export enum ModuleTag {
  /**
   * 正常
   */
  Normal = 1,

  /**
   * 跳转第三方
   */
  ThirdParty = 2,

  /**
   * 系统(不允许删除)
   */
  System = 4,

  /**
   * 正常系统（Normal | System）
   */
  NormalSystem = Normal | System
}

/**
 * 过滤条件通用类型
 */
export interface FilterInput extends ExtensiblePagedAndSortedResultRequestDto {
  /**
   * 过滤条件
   */
  filter?: string
}

/**
 * 分页请求通用类型
 */
export interface ExtensiblePagedAndSortedResultRequestDto extends ExtensiblePagedResultRequestDto {
  /**
   * 排序条件
   */
  sorting?: string
}

/**
 * 分页请求通用类型
 */
export interface ExtensiblePagedResultRequestDto extends ExtensibleLimitedResultRequestDto {
  /**
   * 跳过记录数
   */
  skipCount: number
}

/**
 * 分页请求通用类型
 */
export interface ExtensibleLimitedResultRequestDto extends ExtensibleObject {
  /**
   * 最大记录数
   */
  maxResultCount: number
}

/**
 * 扩展属性通用类型
 */
export interface ExtensibleObject {
  /**
   * 额外属性
   */
  extraProperties?: Record<string, any>
}

/**
 * 分页结果通用类型
 */
export interface PagedResultDto<T> extends ListResultDto<T> {
  /**
   * 数据总条数（全部记录数）
   */
  totalCount: number
}

/**
 * 列表结果通用类型
 */
export interface ListResultDto<T> {
  /**
   * 当前数据列表
   */
  items: T[]
}

/**
 * 实体通用类型
 */
export interface EntityDto<T> {
  /**
   * 主键
   */
  id: T
}
