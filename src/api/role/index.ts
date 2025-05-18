// 导入授权请求的Http请求模块类
import { AuthorizationHttpRequest } from '@/http/index'
import type { IdentityRoleDto, RoleCreateDto, RoleUpdateDto } from './type'
import { ApiUrls } from '../urls/index'
import { FilterInput, PagedResultDto } from '../common/type'
import { getUrlParameters } from '@/utils/urlSearchParams'

/**
 * 角色管理请求
 */
export class RoleHttpRequest {
  /**
   * 获取httpclient请求对象
   * @returns httpclient请求对象
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 创建菜单
   * @param input
   * @returns IdentityRoleDto
   */
  public async createAsync(input: RoleCreateDto): Promise<IdentityRoleDto> {
    const client = this.getClinet()
    return await client.post(ApiUrls.Role.Default, input)
  }

  /**
   * 删除角色
   * @param id 角色id
   * @returns void
   */
  public async deleteAsync(id: string): Promise<void> {
    const client = this.getClinet()
    return await client.delete(`${ApiUrls.Role.Default}/${id}`)
  }

  /**
   * 修改角色
   * @param id 角色id
   * @param input 修改角色信息
   * @returns IdentityRoleDto
   */
  public async updateAsync(id: string, input: RoleUpdateDto): Promise<IdentityRoleDto> {
    const client = this.getClinet()
    return await client.put(`${ApiUrls.Role.Default}/${id}`, input)
  }

  /**
   * 获取角色(所有)
   * @returns string[]
   */
  public async getAllListAsync(): Promise<string[]> {
    const client = this.getClinet()
    return await client.get(ApiUrls.Role.All)
  }

  /**
   * 获取角色权限
   * @returns string[]
   */
  public async getPermissionsAsync(): Promise<string[]> {
    const client = this.getClinet()
    return await client.get(ApiUrls.Role.Permissions)
  }

  /**
   * 获取角色列表
   * @param 分页查询条件
   * @returns 返回角色列表
   */
  public async getListAsync(input: FilterInput): Promise<PagedResultDto<IdentityRoleDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.Role.Default, input)
    return await client.get(url)
  }
}
