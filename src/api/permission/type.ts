import { RouteMetaCustom } from 'types/router'
import { PermissionType } from '../common/enum'

/**
 * 角色权限树
 */
export interface RolePermissionTreeDto {
  /**
   * 权限名称
   */
  permissionName: string

  /**
   * 父级权限名称
   */
  pathResolvearentName?: string | null

  /**
   * 权限类型
   */
  type?: PermissionType | null

  /**
   * 标签
   */
  tag: number

  /**
   * 权限前端路由
   */
  path: string

  /**
   * 路由名称，用于编程式导航（如 router.push({ name: 'Home' })
   */
  name?: string

  /**
   * 与该路由对应的组件
   */
  component: string

  /**
   * 重定向到另一个路径（可以是字符串或函数）
   */
  redirect?: string

  /**
   * 别名，访问 `/home` 时会匹配 `/` 的路由
   */
  alias?: string

  /**
   * 路由元信息，用于传递任何你想传递的数据
   */
  meta?: RouteMetaCustom

  /**
   * 子路由
   */
  children?: RolePermissionTreeDto[]
}

export interface RolePermissionTreePenultimateDto extends RolePermissionTreeDto {
  isPenultimate?: boolean
}

export interface RolePermissionTreeShowDto extends RolePermissionTreePenultimateDto {
  disabled: boolean
}
