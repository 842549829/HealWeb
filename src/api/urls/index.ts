/**
 * API定义类型
 */
type ApiDefinition = {
  [key: string]: boolean | string | ApiDefinition
}

/**
 * 映射后的API地址类型
 */
type MappedApis<T extends ApiDefinition> = {
  [K in keyof T]: T[K] extends boolean
    ? string
    : T[K] extends ApiDefinition
      ? MappedApis<T[K]>
      : never
}

/**
 * 定义模块
 * @param module 模块名称
 * @param apis API定义
 * @returns 映射后的API地址
 */
const defineModule = <T extends ApiDefinition>(module: string, apis: T): MappedApis<T> => {
  const modulePath = `/${module}`
  const result = Object.create(null)

  for (const key in apis) {
    if (Object.prototype.hasOwnProperty.call(apis, key)) {
      const value = apis[key]
      if (typeof value === 'boolean') {
        if (value === true) {
          result[key] = `${modulePath}/${key}`
        } else {
          result[key] = modulePath
        }
      } else if (typeof value === 'string') {
        const suffix = value
        result[key] = `${modulePath}/${key}/${suffix}`
      } else {
        // 递归处理子模块
        result[key] = defineModule(`${module}/${key}`, value)
      }
    }
  }

  return result as MappedApis<T>
}

/**
 * API配置
 * @description 模块化API接口地址（扁平结构，自动路径生成）
 */
const ApiConfig = {
  api: defineModule('api', {
    net: {
      basics: {
        permissions: {
          moduleList: 'module-list',
          routes: 'routes',
          roleList: 'role-list'
        },
        modules: {
          default: false,
          deleteBatch: 'delete-batch'
        },
        menus: {
          default: false,
          deleteBatch: 'delete-batch'
        },
        roles: {
          default: false,
          permissions: 'permissions'
        },
        accounts: {
          login: true
        },
        users: {
          default: false,
          roles: '{0}/roles',
          rolesAssignable: 'assignable-roles',
          detail: '{0}/detail',
          findByUserName: 'by-username/{0}',
          findByEmail: 'by-email/{0}',
          avatar: '{0}/avatar',
          list: 'user-select',
          roleList: 'role-list'
        },
        organizations: {
          organization: {
            default: false,
            select: 'select',
            tree: 'tree'
          },
          campus: {
            default: false
          },
          department: {
            default: false,
            detail: 'detail'
          }
        }
      }
    }
  })
}

// 导出
export default ApiConfig

// 类型导出
export type ApiConfigType = typeof ApiConfig
