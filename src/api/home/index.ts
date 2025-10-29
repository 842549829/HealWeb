import { AuthorizationHttpRequest } from '@/http/index'
import { ModuleHomeListDto } from './type'
import ApiConfig from '../urls/index'

/**
 * 首页API请求类
 */
export class HomeHttpRequest {
  /**
   * 获取模块列表
   * @returns
   */
  public getModuleHomeListAsync(): Promise<ModuleHomeListDto[]> {
    const request = this.getRequest()
    return request.get<ModuleHomeListDto[]>(ApiConfig.api.net.basics.permissions.moduleList)
  }

  /**
   * 获取菜单列表
   * @param moduleName 模块名称
   * @returns
   */
  public getMenuListAsync(moduleName: string): Promise<AppCustomRouteRecordRaw[]> {
    const request = this.getRequest()
    const url = `${ApiConfig.api.net.basics.permissions.routes}/${moduleName}`
    return request.get<AppCustomRouteRecordRaw[]>(url)
  }

  /**
   * 获取HttpClient实例
   * @returns HttpClient实例
   */
  private getRequest(): AuthorizationHttpRequest {
    return new AuthorizationHttpRequest()
  }
}
