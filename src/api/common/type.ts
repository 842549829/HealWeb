import { OrdinaryDict, BaseDict, EnumDict } from '@/api/common/const'

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

/**
 * 创建审计属性接口
 */
export interface ICreationAuditedObjectDto extends IHasCreationTime, IMayHaveCreator {}

/**
 * 创建审计属性接口
 */
export interface IMayHaveCreatorNameDto {
  /**
   * 创建者名称
   */
  creatorName?: string
}

/**
 * 创建审计属性接口
 */
export interface ICreationAuditedObjectExtensionDto
  extends ICreationAuditedObjectDto,
    IMayHaveCreatorNameDto {}

/**
 * 创建审计属性接口
 */
export interface ICreationAuditedObject extends IHasCreationTime, IMayHaveCreator {}

/**
 * 创建审计实体通用类型
 */
export interface CreationAuditedEntityDto<TPrimaryKey>
  extends EntityDto<TPrimaryKey>,
    ICreationAuditedObject {}

/**
 * 审计属性接口
 */
export interface IAuditedObject
  extends ICreationAuditedObject,
    IHasCreationTime,
    IMayHaveCreator,
    IModificationAuditedObject,
    IHasModificationTime {}

/**
 * 审计实体通用类型
 */
export interface AuditedEntityDto<TPrimaryKey>
  extends CreationAuditedEntityDto<TPrimaryKey>,
    IAuditedObject {}

/**
 * 审计实体扩展通用类型
 */
export interface AuditedEntityExtensionDto<TPrimaryKey>
  extends AuditedEntityDto<TPrimaryKey>,
    ICreationAuditedObjectExtensionDto {}

/**
 * 编码属性接口
 */
export interface IHasCodeDto {
  /**
   * 编码
   */
  code: string
}

/**
 * 名称接口
 */
export interface IHasNameDto {
  /**
   * 名称
   */
  name: string
}

/**
 * 组织属性接口
 */
export interface IHasOrganizationDto {
  /**
   * 组织Code
   */
  organizationCode: string
}

/**
 * 排序属性接口
 */
export interface IHasSortDto {
  /**
   * 排序值
   */
  sort: number
}

/**
 * 描述属性接口
 */
export interface IMayHaveDescribeDto {
  /**
   * 描述
   */
  describe?: string
}

/**
 * 并发控制戳接口
 */
export interface IHasConcurrencyStampDto {
  /**
   * 并发控制戳
   */
  concurrencyStamp: string
}

/**
 * 全局唯一标识符类型
 */
export type Guid = string

/**
 * 选择项数据传输对象
 * 用于描述下拉选择框的选项。
 */
export interface SelectDto {
  /**
   * 值
   */
  value: string
  /**
   * 标签
   */
  label: string
}

/**
 * 字典注册表
 */
export const Dict = {
  ...OrdinaryDict,
  ...BaseDict,
  ...EnumDict
} as const

// 定义字典下拉选项，每个字典项包含三个属性
export interface DictStateList {
  value: string | number // 字典项的唯一标识，使用字符串类型
  label: string // 字典项对应的值，使用字符串类型
  disabled: boolean // 是否可用
}

/**
 * 字典类型
 */
export type DictType = (typeof Dict)[keyof typeof Dict]

/**
 * 字典数据源
 */
export type DictDataSource = (type: DictType) => Promise<DictStateList[]>

/**
 * 默认值类型
 */
export type DefaultValueType = string | number | null

/**
 * 默认值源
 */
export type DefaultValueSource = (type: DictType) => Promise<DefaultValueType>
