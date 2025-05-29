import { EntityDto } from '../common/type'
import { MultiTenancySides, PermissionType } from '../common/enum'

/**
 * 菜单创建或更新 DTO 接口定义
 */
export interface IMenuCreateOrUpdateDto {
  /**
   * 标签[特殊标记;例如1标记是跳转第三方的]
   */
  tag: number

  /**
   * 权限前端路由
   */
  path: string

  /**
   * 可选。路由名称，用于编程式导航（如 router.push({ name: 'Home' })）。
   */
  name?: string

  /**
   * 必填。与该路由对应的组件。
   */
  component: string

  /**
   * 可选。重定向到另一个路径（可以是字符串或函数）。
   */
  redirect?: string

  /**
   * 可选。别名，访问 `/home` 时会匹配 `/` 的路由。
   */
  alias?: string

  /**
   * 是否隐藏该路由。如果为 true，则该路由不会显示在菜单中。
   */
  hidden?: boolean

  /**
   * 是否始终显示根菜单。如果为 true，即使只有一个子路由，也会显示父级菜单。
   */
  alwaysShow?: boolean

  /**
   * 路由标题，通常用于菜单或标签页显示。
   */
  title: string

  /**
   * 权限前端图标
   */
  icon?: string

  /**
   * 是否禁用页面缓存。如果为 true，则该页面不会被缓存。
   */
  noCache?: boolean

  /**
   * 是否显示面包屑导航。如果为 false，则该路由不会出现在面包屑中。
   */
  breadcrumb?: boolean

  /**
   * 是否固定在标签页中。如果为 true，则该路由会始终显示在标签页中。
   */
  affix?: boolean

  /**
   * 当前路由激活时，需要高亮的菜单项路径。
   */
  activeMenu?: string

  /**
   * 是否禁用标签页视图。如果为 true，则该路由不会显示在标签页中。
   */
  noTagsView?: boolean

  /**
   * 是否允许跳转到该路由。如果为 false，则无法通过编程式导航跳转到该路由。
   */
  canTo?: boolean
}

/**
 * 菜单创建 DTO 接口定义
 */
export interface MenuCreateDto extends IMenuCreateOrUpdateDto {
  /**
   * 权限名称
   */
  permissionName: string

  /**
   * 所属模块名称
   */
  groupName: string

  /**
   * 显示名称
   */
  displayName: string

  /**
   * 父级菜单
   */
  parentName?: string

  /**
   * 是否启用
   */
  isEnabled: boolean

  /**
   * 多租户设置
   * Tenant = 1
   * Host = 2
   * Both = 3
   */
  multiTenancySide: MultiTenancySides

  /**
   * Comma separated list of provider names.
   */
  providers: string

  /**
   * Serialized string to store info about the state checkers.
   */
  stateCheckers?: string

  /**
   * 权限类型
   */
  type?: PermissionType
}

/**
 * 菜单更新 DTO 接口定义（包含完整字段）
 */
export interface MenuUpdateDto extends IMenuCreateOrUpdateDto {
  /**
   * 显示名称
   */
  displayName: string

  /**
   * 是否启用
   * @default true
   */
  isEnabled: boolean
}

/**
 * 菜单列表 DTO 接口定义
 */
export interface MenuListDto extends EntityDto<string> {
  /**
   * 权限名称
   */
  name: string

  /**
   * 所属权限组
   */
  groupName: string

  /**
   * 显示名称
   */
  displayName: string
}

/**
 * 菜单 DTO 接口定义
 */
export interface MenuDto extends IMenuCreateOrUpdateDto, EntityDto<string> {
  /**
   * 权限名称
   */
  permissionName: string

  /**
   * 所属权限组
   */
  groupName: string

  /**
   * 显示名称
   */
  displayName: string

  /**
   * 父级菜单名称（可为空）
   */
  parentName?: string

  /**
   * 是否启用
   * @default true
   */
  isEnabled: boolean

  /**
   * 多租户设置
   * Tenant = 1
   * Host = 2
   * Both = 3
   */
  multiTenancySide: MultiTenancySides

  /**
   * Comma separated list of provider names.
   */
  providers: string

  /**
   * Serialized string to store info about the state checkers.
   */
  stateCheckers?: string

  /**
   * 权限类型（可为空）
   */
  type?: PermissionType
}
