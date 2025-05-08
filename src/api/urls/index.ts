const PREFIX = 'api/net/basics'

/**
 * 权限接口
 */
const PermissionsUrl = {
  /**
   * 获取模块列表
   */
  ModuleList: `${PREFIX}/permissions/module-list`,
  /**
   * 获取路由列表
   */
  Routes: `${PREFIX}/permissions/routes`
}

/**
 * 账号接口
 */
const AccountsUrl = {
  Login: `${PREFIX}/accounts/login`
}

/**
 * 模块接口
 */
const ModuleUrl = {
  /**
   * 默认模块路径
   */
  Default: `${PREFIX}/modules`
}

/**
 * 菜单接口
 */
const MenuUrl = {
  /**
   * 默认菜单路径
   */
  Default: `${PREFIX}/menus`
}

/**
 * 接口地址
 */
export const ApiUrls = {
  /**
   * 权限接口
   */
  Permissions: PermissionsUrl,
  /**
   * 账号接口
   */
  Accounts: AccountsUrl,
  /**
   * 模块接口
   */
  Module: ModuleUrl,
  /**
   * 菜单接口
   */
  Menu: MenuUrl
}
