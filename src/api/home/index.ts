import { AuthorizationHttpRequest } from '@/http/index'
import { ModuleHomeListDto } from './type'
import { ApiUrls } from '../urls/index'
// 首页
export class HomeHttpRequest {
  // 获取模块列表
  public getModuleHomeListAsync() {
    const request = this.getRequest()
    return request.get<ModuleHomeListDto[]>(ApiUrls.Permissions.ModuleList)
  }

  // 获取菜单列表
  public getMenuListAsync(moduleName: string) {
    const request = this.getRequest()
    const url = `${ApiUrls.Permissions.Routes}/${moduleName}`
    return request.get<AppCustomRouteRecordRaw[]>(url)
  }

  // 获取请求实例
  private getRequest() {
    return new AuthorizationHttpRequest()
  }
}
