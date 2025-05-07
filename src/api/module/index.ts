import { AuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../urls/index'
import type { ModuleCreateDto, ModuleDto, ModuleListDto, ModuleUpdateDto } from './type'
import type { FilterInput, PagedResultDto } from '../common/type'
import { getUrlParameters } from '@/utils/urlSearchParams'

/**
 * 模块管理API
 */
export class ModuleHttpRequest {
  /**
   *  获取HttpClient
   * @returns ApiClient
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 创建模块
   * @param input
   * @returns
   */
  public async createAsync(input: ModuleCreateDto): Promise<void> {
    const client = this.getClinet()
    return await client.post(ApiUrls.Module.Default, input)
  }

  /**
   * 获取模块
   * @param id
   * @returns
   */
  public async getAsync(id: string): Promise<ModuleDto> {
    const client = this.getClinet()
    return await client.get<ModuleDto>(`${ApiUrls.Module.Default}/${id}`)
  }

  /**
   * 修改模块
   * @param id 模块id
   * @param input 修改模块
   * @returns
   */
  public async updateAsync(id: string, input: ModuleUpdateDto): Promise<void> {
    const client = this.getClinet()
    return await client.put(`${ApiUrls.Module.Default}/${id}`, input)
  }

  /**
   * 获取模块列表
   * @param id 模块id
   * @returns
   */
  public async getListAsync(input: FilterInput): Promise<PagedResultDto<ModuleListDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.Module.Default, input)
    return await client.get<PagedResultDto<ModuleListDto>>(url)
  }
}
