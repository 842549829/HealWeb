const PREFIX = 'api/net/basics'

const PermissionsPrefix = 'permissions'
const ModulesPrefix = 'modules'
const MenusPrefix = 'menus'
const RolesPrefix = 'roles'
const AccountPrefix = 'accounts'
const UsersPrefix = 'users'
const OrganizationsPrefix = 'organizations'
const CampusPrefix = 'campuses'
const DepartmentsPrefix = 'departments'

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
 * 用户接口
 */
const UserUrl = {
  /**
   * 默认用户路径
   */
  Default: `${PREFIX}/${UsersPrefix}`,
  /**
   * 获取角色
   */
  Roles: `${PREFIX}/${UsersPrefix}/{0}/roles`,
  /**
   * 获取可分配绝
   */
  RolesAssignable: `${PREFIX}/${UsersPrefix}/roles-assignable`,
  /**
   * 详情
   */
  Detail: `${PREFIX}/${UsersPrefix}/{0}/detail`,
  /**
   * 根据用户名查找用户
   */
  FindByUserName: `${PREFIX}/${UsersPrefix}/by-username/{0}`,
  /**
   * 根据邮箱查找用户
   */
  FindByEmail: `${PREFIX}/${UsersPrefix}/by-email/{0}`,
  /**
   * 更新头像
   */
  Avatar: `${PREFIX}/${UsersPrefix}/{0}/avatar`,
  /**
   * 获取用户列表
   */
  List: `${PREFIX}/${UsersPrefix}/user-select`,
  /**
   * 获取角色列表
   */
  RoleList: `${PREFIX}/${UsersPrefix}/role-list`
}

/**
 * 组织机构接口
 */
const OrganizationUrl = {
  /**
   * 默认组织机构路径
   */
  Default: `${PREFIX}/${OrganizationsPrefix}`,
  /**
   * 获取组织机构列表
   */
  Select: `${PREFIX}/${OrganizationsPrefix}/select`,
  /**
   * 获取组织机构树
   */
  Tree: `${PREFIX}/${OrganizationsPrefix}/tree`
}

/**
 * 院区接口
 */
const CampusUrl = {
  /**
   * 默认组织机构路径
   */
  Default: `${PREFIX}/${CampusPrefix}`
}

/**
 * 科室接口
 */
const DepartmentUrl = {
  /**
   * 默认组织机构路径
   */
  Default: `${PREFIX}/${DepartmentsPrefix}`,
  /**
   * 详情
   */
  Detail: `${PREFIX}/${DepartmentsPrefix}/detail`
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
  Role: RoleUrl,
  /**
   * 用户接口
   */
  User: UserUrl,
  /**
   * 组织机构接口
   */
  Organizations: {
    /**
     * 医院组织接口
     */
    Organization: OrganizationUrl,
    /**
     * 院区接口
     */
    Campus: CampusUrl,
    /**
     * 科室接口
     */
    Department: DepartmentUrl
  }
}
