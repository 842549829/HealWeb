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
 * 身份类型
 */
export enum IdentityType {
  /**
   * 医护人员
   */
  Doctor = 1,

  /**
   * 患者
   */
  Patient = 2
}

/**
 * 启用状态
 */
export enum Enable {
  /**
   * 启用
   */
  Enable = 1,

  /**
   * 禁用
   */
  Disable = 0
}

/**
 * 组织类型
 */
export enum OrganizationType {
  /**
   * 机构
   */
  Organization = 1,

  /**
   * 院区
   */
  Campus = 2,

  /**
   * 科室
   */
  Department = 3
}
