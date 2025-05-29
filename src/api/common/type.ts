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
 * 扩展属性通用类型（支持泛型）
 * @example
 * interface UserDto extends ExtensibleObject<{ age: number; roles: string[] }> {}
 */
export interface ExtensibleObject<TExtra = any> {
  /**
   * 额外属性
   */
  extraProperties?: Partial<Record<string, any> & TExtra>
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

/**
 * 操作类型
 * edit: 编辑
 * detail: 详情
 * '空'：新增
 */
export type ActionType = 'edit' | 'detail' | ''

/**
 * 带并发控制戳的实体通用类型
 */
export interface IHasConcurrencyStamp {
  /**
   * 并发控制戳，用于防止并发更新冲突。
   */
  concurrencyStamp: string
}

/**
 * 创建时间属性
 */
export interface IHasCreationTime {
  /**
   * 扩展属性
   */
  creationTime: Date
}

/**
 * 实体版本属性
 */
export interface IHasEntityVersion {
  /**
   * 版本号
   */
  entityVersion: number
}

/**
 * 多租户属性
 */
export interface IMultiTenant {
  /**
   * 租户Id
   */
  tenantId?: string
}

/**
 * 删除标记
 */
export interface ISoftDelete {
  /**
   * 是否已删除
   */
  isDeleted: boolean
}

/**
 * 删除时间
 */
export interface IHasDeletionTime extends ISoftDelete {
  /**
   * 删除时间
   */
  deletionTime?: Date
}

/**
 * 删除审计属性
 */
export interface IDeletionAuditedObject extends IHasDeletionTime {
  /**
   * 删除者Id
   */
  deleterId?: string
}

/**
 * 最后更新时间
 */
export interface IHasModificationTime {
  /**
   * 最后更新时间
   */
  lastModificationTime?: Date
}

/**
 * 最后更新审计属性
 */
export interface IModificationAuditedObject extends IHasModificationTime {
  /**
   * 最后更新者Id
   */
  lastModifierId?: string
}

/**
 * 创建审计属性
 */
export interface IMayHaveCreator {
  /**
   * 创建者Id
   */
  creatorId?: string
}

/**
 * 创建、修改、删除审计属性
 */
export interface ExtensibleFullAuditedEntityDto<T, TExtra = any>
  extends EntityDto<T>,
    IMayHaveCreator,
    IHasCreationTime,
    IHasModificationTime,
    IModificationAuditedObject,
    ExtensibleObject<TExtra>,
    IDeletionAuditedObject {}
