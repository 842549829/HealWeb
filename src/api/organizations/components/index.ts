import { AuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../../urls/index'
import type {
  CampusCreateDto,
  CampusDto,
  CampusInput,
  CampusListDto,
  CampusUpdateDto
} from './type'
import type { PagedResultDto } from '../../common/type'
import { getUrlParameters } from '@/utils/urlSearchParams'

/**
 * 管理API
 */
export class ComponentsHttpRequest {
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
  public async getListAsync(input: CampusInput): Promise<PagedResultDto<CampusListDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.Organizations.Organization.Default, input)
    return await client.get<PagedResultDto<CampusListDto>>(url)
  }

  /**
   * 创建组织机构
   * @param input 创建组织机构DTO
   * @returns 组织机构
   */
  public async createAsync(input: CampusCreateDto): Promise<CampusDto> {
    const client = this.getClinet()
    return await client.post<CampusDto>(ApiUrls.Organizations.Campus.Default, input)
  }

  /**
   * 更新组织机构
   * @param id 组织机构id
   * @param input 更新组织机构DTO
   * @returns 组织机构
   */
  public async updateAsync(id: string, input: CampusUpdateDto): Promise<CampusDto> {
    const client = this.getClinet()
    return await client.put<CampusDto>(`${ApiUrls.Organizations.Campus.Default}/${id}`, input)
  }
}
