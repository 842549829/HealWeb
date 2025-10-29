import { AuthorizationHttpRequest } from '@/http/index'
import ApiConfig from '../../urls/index'
import type {
  GetOrganizationsInput,
  OrganizationCreateDto,
  OrganizationDto,
  OrganizationTreeDto,
  OrganizationUpdateDto
} from './type'
import type { PagedResultDto } from '../../common/type'
import { getUrlParameters } from '@/utils/urlSearchParams'

/**
 * 模块管理API
 */
export class OrganizationsHttpRequest {
  /**
   *  获取HttpClient
   * @returns ApiClient
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 获取组织机构列表
   * @param input 查询条件
   * @returns 组织机构列表
   */
  public async getListAsync(
    input: GetOrganizationsInput
  ): Promise<PagedResultDto<OrganizationDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiConfig.api.net.basics.organizations.organization.default, input)
    return await client.get<PagedResultDto<OrganizationDto>>(url)
  }

  /**
   * 获取组织机构
   * @param id 组织机构id
   * @returns 组织机构
   */
  public async getAsync(id: string): Promise<OrganizationDto> {
    const client = this.getClinet()
    return await client.get<OrganizationDto>(
      `${ApiConfig.api.net.basics.organizations.organization.default}/${id}`
    )
  }

  /**
   * 获取组织机构列表(根据上级选择)
   * @param parentId 父级组织机构id
   * @param recursive 是否递归获取子组织机构
   * @returns 组织机构列表
   */
  public async getSelectAsync(
    parentId?: string,
    recursive: boolean = false
  ): Promise<OrganizationDto[]> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiConfig.api.net.basics.organizations.organization.select, {
      parentId,
      recursive
    })
    return await client.get<OrganizationDto[]>(url)
  }

  /**
   * 获取组织树形结构
   * @param parentId 父级Id
   * @returns 组织机构树形结构
   * @description 如果parentId为空，则获取所有组织机构的树形结构
   */
  public async getTreeAsync(parentId?: string): Promise<OrganizationTreeDto[]> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiConfig.api.net.basics.organizations.organization.tree, {
      parentId
    })
    return await client.get<OrganizationTreeDto[]>(url)
  }

  /**
   * 创建组织机构
   * @param input 创建组织机构DTO
   * @returns 组织机构
   */
  public async createAsync(input: OrganizationCreateDto): Promise<OrganizationDto> {
    const client = this.getClinet()
    return await client.post<OrganizationDto>(
      ApiConfig.api.net.basics.organizations.organization.default,
      input
    )
  }

  /**
   * 更新组织机构
   * @param id 组织机构id
   * @param input 更新组织机构DTO
   * @returns 组织机构
   */
  public async updateAsync(id: string, input: OrganizationUpdateDto): Promise<OrganizationDto> {
    const client = this.getClinet()
    return await client.put<OrganizationDto>(
      `${ApiConfig.api.net.basics.organizations.organization.default}/${id}`,
      input
    )
  }
  /**
   * 删除组织机构
   * @param id 组织机构id
   */
  public async deleteAsync(id: string): Promise<void> {
    const client = this.getClinet()
    return await client.delete(
      `${ApiConfig.api.net.basics.organizations.organization.default}/${id}`
    )
  }
}
