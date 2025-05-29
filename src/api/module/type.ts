import type { EntityDto } from '../common/type'
import type { ModuleTag } from '../common/enum'

/**
 * 模块创建DTO
 */
export interface ModuleCreateDto {
  /**
   * 权限名称
   */
  name: string

  /**
   * 显示名称
   */
  displayName: string

  /**
   * 标签[特殊标记;例如 1 表示跳转第三方的]
   */
  tag: ModuleTag

  /**
   * 权限前端路由路径
   */
  path: string

  /**
   * 必填。与该路由对应的组件。
   */
  component: string

  /**
   * 可选。重定向到另一个路径（可以是字符串或函数）。
   */
  redirect?: string | Function

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
 * 模块修改DTO
 */
export interface ModuleUpdateDto {
  /**
   * 显示名称
   */
  displayName: string

  /**
   * 标签[特殊标记;例如 1 表示跳转第三方]
   */
  tag: ModuleTag

  /**
   * 权限前端路由路径
   */
  path: string

  /**
   * 必填。与该路由对应的组件。
   */
  component: string

  /**
   * 可选。重定向到另一个路径（可以是字符串或函数）。
   */
  redirect?: string | (() => void)

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
 * 模块列表 DTO
 */
export interface ModuleListDto extends EntityDto<string> {
  /**
   * 权限名称
   */
  name: string

  /**
   * 显示名称
   */
  displayName: string

  /**
   * 标签[特殊标记;比如1标记是跳转第三方的]
   */
  tag: ModuleTag
}

/**
 * 模块 DTO（用于获取模块详情）
 */
export interface ModuleDto extends EntityDto<string> {
  /**
   * 权限名称
   */
  name: string

  /**
   * 显示名称
   */
  displayName: string

  /**
   * 标签[特殊标记;例如 1 表示跳转第三方]
   */
  tag: ModuleTag

  /**
   * 权限前端路由路径
   */
  path: string

  /**
   * 必填。与该路由对应的组件。
   */
  component: string

  /**
   * 可选。重定向到另一个路径（可以是字符串或函数）。
   */
  redirect?: string | (() => void)

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
