import { RouteMetaCustom } from 'types/router'
import { PermissionType } from '../common/type'

/**
 * 角色权限树
 */
export interface RolePermissionTreeDto {
  /**
   * 权限名称
   */
  PermissionName: string

  /**
   * 父级权限名称
   */
  ParentName?: string | null

  /**
   * 权限类型
   */
  Type?: PermissionType | null

  /**
   * 标签
   */
  Tag: number

  /**
   * 权限前端路由
   */
  Path: string

  /**
   * 路由名称，用于编程式导航（如 router.push({ name: 'Home' })
   */
  Name?: string

  /**
   * 与该路由对应的组件
   */
  Component: string

  /**
   * 重定向到另一个路径（可以是字符串或函数）
   */
  Redirect?: string

  /**
   * 别名，访问 `/home` 时会匹配 `/` 的路由
   */
  Alias?: string

  /**
   * 路由元信息，用于传递任何你想传递的数据
   */
  Meta?: RouteMetaCustom

  /**
   * 子路由
   */
  Children?: RolePermissionTreeDto[]
}
