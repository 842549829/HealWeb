import request from '@/axios'
import { AuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../urls/index'
import type { MenuCreateDto, MenuDto, MenuListDto, MenuUpdateDto } from './type'
import type { FilterInput, PagedResultDto } from '../common/type'
import { getUrlParameters } from '@/utils/urlSearchParams'

/**
 * 菜单管理API
 */
export class MenuHttpRequest {
  /**
   *  获取HttpClient
   * @returns ApiClient
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 创建菜单
   * @param input
   * @returns
   */
  public async createAsync(input: MenuCreateDto): Promise<void> {
    const client = this.getClinet()
    return await client.post(ApiUrls.Menu.Default, input)
  }

  /**
   * 获取菜单
   * @param id
   * @returns
   */
  public async getAsync(id: string): Promise<MenuDto> {
    const client = this.getClinet()
    return await client.get<MenuDto>(`${ApiUrls.Menu.Default}/${id}`)
  }

  /**
   * 修改菜单
   * @param id 菜单id
   * @param input 修改菜单
   * @returns
   */
  public async updateAsync(id: string, input: MenuUpdateDto): Promise<void> {
    const client = this.getClinet()
    return await client.put(`${ApiUrls.Menu.Default}/${id}`, input)
  }

  /**
   * 获菜单块列表
   * @param id 菜单id
   * @returns
   */
  public async getListAsync(input: FilterInput): Promise<PagedResultDto<MenuListDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.Menu.Default, input)
    return await client.get<PagedResultDto<MenuListDto>>(url)
  }
}

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}
