import { AuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../urls/index'
import type { RolePermissionTreeDto } from './type'
/**
 * 菜单管理API
 */
export class PermissionHttpRequest {
  /**
   * 获取Http请求实例
   * @returns Http请求实例
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 获取所有角色权限树
   * @returns 角色权限树
   */
  public async getAllRolePermissionTreeListAsync(): Promise<Array<RolePermissionTreeDto>> {
    const url = ApiUrls.Permissions.RoleList
    const response = await this.getClinet().get<Array<RolePermissionTreeDto>>(url)
    return response
  }
}
