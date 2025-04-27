/**
 * 模块首页列表信息
 */
export interface ModuleHomeListDto {
  /**
   * 模块名称
   */
  moduleName: string

  /**
   * 路由标题，通常用于菜单或标签页显示。
   */
  title: string

  /**
   * 菜单图标，通常是一个图标的名称或路径。
   */
  icon?: string

  /**
   * 必填。路由路径，支持动态参数和通配符。
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
}
