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
 * 表示多租户应用程序中的侧面。
 * Tenant = 1：表示租户侧（Tenant Side）。在多租户应用中，租户是实际使用系统的用户或组织。
 * Host = 2：表示主机侧（Host Side）。主机是管理多个租户的超级管理员或系统本身。
 * Both = 3：表示同时适用于租户侧和主机侧。这里的值是 1 | 2 的结果（即 3），表示两个标志的组合。
 */
export enum MultiTenancySides {
  /**
   * 租户侧。
   */
  Tenant = 1,

  /**
   * 主机侧。
   */
  Host = 2,

  /**
   * 同时适用于租户侧和主机侧。
   */
  Both = 3
}

/**
 * 权限类型
 */
export enum PermissionType {
  /**
   * 模块
   */
  Module = 1,

  /**
   * 菜单
   */
  Menu = 2,

  /**
   * 按钮
   */
  Button = 3
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

/**
 * 操作类型
 * edit: 编辑
 * detail: 详情
 * '空'：新增
 */
export type ActionType = 'edit' | 'detail' | ''
