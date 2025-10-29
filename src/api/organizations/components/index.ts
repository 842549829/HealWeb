import { AuthorizationHttpRequest } from '@/http/index'
import ApiConfig from '../../urls/index'
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
   * 获取院区列表
   * @param input 查询条件
   * @returns 院区列表
   */
  public async getListAsync(input: CampusInput): Promise<PagedResultDto<CampusListDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiConfig.api.net.basics.organizations.campus.default, input)
    return await client.get<PagedResultDto<CampusListDto>>(url)
  }

  /**
   * 创建院区
   * @param input 创建院区DTO
   * @returns 院区
   */
  public async createAsync(input: CampusCreateDto): Promise<CampusDto> {
    const client = this.getClinet()
    return await client.post<CampusDto>(
      ApiConfig.api.net.basics.organizations.campus.default,
      input
    )
  }

  /**
   * 更新院区
   * @param id 院区id
   * @param input 更新院区DTO
   * @returns 院区
   */
  public async updateAsync(id: string, input: CampusUpdateDto): Promise<CampusDto> {
    const client = this.getClinet()
    return await client.put<CampusDto>(
      `${ApiConfig.api.net.basics.organizations.campus.default}/${id}`,
      input
    )
  }
}
