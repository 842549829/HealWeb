import { AuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../../urls/index'
import type {
  DepartmentCreateDto,
  DepartmentDto,
  DepartmentInput,
  DepartmentListDto,
  DepartmentUpdateDto
} from './type'
import type { PagedResultDto } from '../../common/type'
import { getUrlParameters } from '@/utils/urlSearchParams'

/**
 * 管理API
 */
export class DepartmentHttpRequest {
  /**
   *  获取HttpClient
   * @returns ApiClient
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 创建科室
   * @param input 创建科室DTO
   * @returns 科室
   */
  public async createAsync(input: DepartmentCreateDto): Promise<DepartmentDto> {
    const client = this.getClinet()
    return await client.post<DepartmentDto>(ApiUrls.Organizations.Department.Default, input)
  }

  /**
   * 更新科室
   * @param id 科室id
   * @param input 更新科室DTO
   * @returns 科室
   */
  public async updateAsync(id: string, input: DepartmentUpdateDto): Promise<DepartmentDto> {
    const client = this.getClinet()
    return await client.put<DepartmentDto>(
      `${ApiUrls.Organizations.Department.Default}/${id}`,
      input
    )
  }

  /**
   * 获取科室列表
   * @param input 查询条件
   * @returns 科室列表
   */
  public async getListAsync(input: DepartmentInput): Promise<PagedResultDto<DepartmentListDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.Organizations.Department.Default, input)
    return await client.get<PagedResultDto<DepartmentListDto>>(url)
  }
}
