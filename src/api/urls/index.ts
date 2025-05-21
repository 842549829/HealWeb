const PREFIX = 'api/net/basics'

const PermissionsPrefix = 'permissions'
const ModulesPrefix = 'modules'
const MenusPrefix = 'menus'
const RolesPrefix = 'roles'
const AccountPrefix = 'accounts'

/**
 * 权限接口
 */
const PermissionsUrl = {
  /**
   * 获取模块列表
   */
  ModuleList: `${PREFIX}/${PermissionsPrefix}/module-list`,
  /**
   * 获取路由列表
   */
  Routes: `${PREFIX}/${PermissionsPrefix}/routes`,
  /**
   * 获取权限列表
   */
  RoleList: `${PREFIX}/${PermissionsPrefix}/role-list`
}

/**
 * 账号接口
 */
const AccountsUrl = {
  Login: `${PREFIX}/${AccountPrefix}/login`
}

/**
 * 模块接口
 */
const ModuleUrl = {
  /**
   * 默认模块路径
   */
  Default: `${PREFIX}/${ModulesPrefix}`
}

/**
 * 菜单接口
 */
const MenuUrl = {
  /**
   * 默认菜单路径
   */
  Default: `${PREFIX}/${MenusPrefix}`,
  /**
   * 批量删除
   */
  DeleteBatch: `${PREFIX}/${MenusPrefix}/delete-batch`
}

/**
 * 角色接口
 */
const RoleUrl = {
  /**
   * 默认权限路径
   */
  Default: `${PREFIX}/${RolesPrefix}`,
  /**
   * 获取角色
   */
  Permissions: `${PREFIX}/${RolesPrefix}/permissions`,
  /**
   * 获取所有角色
   */
  All: `${PREFIX}/${RolesPrefix}/all`
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
  Menu: MenuUrl,
  /**
   * 角色接口
   */
  Role: RoleUrl
}
