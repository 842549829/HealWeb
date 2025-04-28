import { authorizationHttpRequest as request } from '@/http/index'
import { ModuleHomeListDto } from './type'

// Api地址
enum Api {
  MODULE_LIST_URL = 'api/net/basics/permissions/module-list',
  MENU_LIST_URL = 'api/net/basics/permissions/routes'
}

// 首页
export class HomeHttpRequest {
  // 获取模块列表
  public getModuleHomeListAsync = () => request.get<ModuleHomeListDto[]>(Api.MODULE_LIST_URL)

  // 获取菜单列表
  public getMenuListAsync = (moduleName: string) => {
    const url = `${Api.MENU_LIST_URL}/${moduleName}`
    return request.get<AppCustomRouteRecordRaw[]>(url)
  }
}
