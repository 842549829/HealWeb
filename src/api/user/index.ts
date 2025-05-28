// 导入授权请求的Http请求模块类
import { AuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../urls/index'
import {
  IdentityUserDetailDto,
  IdentityUserDto,
  IdentityUserUpdateRolesDto,
  SearchUserListInputDto,
  SearchUserOutputDto,
  UserAvatarUpdateDto,
  UserCreateDto,
  UserUpdateDto
} from './type'
import { getUrlParameters, urlFormatString } from '@/utils/urlSearchParams'
import { FilterInput, PagedResultDto } from '../common/type'
import { IdentityRoleDto, RoleDto } from '../role/type'

/**
 * 用户Http请求模块类
 */
export class UserHttpRequest extends AuthorizationHttpRequest {
  /**
   * 获取httpclient请求对象
   * @returns httpclient请求对象
   */
  private getClinet() {
    return new AuthorizationHttpRequest()
  }

  /**
   * 创建用户
   * @param input 创建用户输入参数
   * @returns 创建用户输出参数
   */
  public async createAsync(input: UserCreateDto): Promise<IdentityUserDto> {
    const client = this.getClinet()
    return await client.post(ApiUrls.User.Default, input)
  }

  /**
   * 更新用户
   * @param id 用户Id
   * @param input 更新用户输入参数
   * @returns 更新用户输出参数
   */
  public async updateAsync(id: string, input: UserUpdateDto): Promise<IdentityUserDto> {
    const client = this.getClinet()
    return await client.put(ApiUrls.User.Default + '/' + id, input)
  }

  /**
   * 获取用户
   * @param id 用户Id
   * @returns 获取用户输出参数
   */
  public async getAsync(id: string): Promise<IdentityUserDto> {
    const client = this.getClinet()
    return await client.get(ApiUrls.User.Default + '/' + id)
  }

  /**
   * 获取用户详情
   * @param id 用户Id
   * @returns 获取用户详情输出参数
   */
  public async getDetailAsync(id: string): Promise<IdentityUserDetailDto> {
    const client = this.getClinet()
    const url = urlFormatString(ApiUrls.User.Detail, id)
    return await client.get(url)
  }

  /**
   * 获取用户列表
   * @param input 查询条件
   * @returns 用户输出参数
   */
  public async getListAsync(input: FilterInput): Promise<PagedResultDto<IdentityUserDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.User.Default, input)
    return await client.get(url)
  }

  /**
   * 删除用户
   * @param id 用户Id
   * @returns void
   */
  public async deleteAsync(id: string): Promise<void> {
    const client = this.getClinet()
    return await client.delete(ApiUrls.User.Default + '/' + id)
  }

  /**
   * 获取用户角色
   * @param id 用户Id
   * @returns 用户角色输出参数
   */
  public async getRolesAsync(id: string): Promise<IdentityRoleDto[]> {
    const client = this.getClinet()
    const url = urlFormatString(ApiUrls.User.Roles, id)
    return await client.get(url)
  }

  /**
   * 获取可分配角色
   * @returns 可分配角色输出参数
   */
  public async getAssignableRolesAsync(): Promise<IdentityRoleDto[]> {
    const client = this.getClinet()
    return await client.get(ApiUrls.User.RolesAssignable)
  }

  /**
   * 更新用户角色
   * @param id 用户Id
   * @param input 更新用户角色输入参数
   * @returns void
   */
  public async updateRolesAsync(id: string, input: IdentityUserUpdateRolesDto): Promise<void> {
    const client = this.getClinet()
    const url = urlFormatString(ApiUrls.User.Roles, id)
    return await client.put(url, input)
  }

  /**
   * 更新用户头像
   * @param id 用户Id
   * @param input 更新用户头像输入参数
   * @returns void
   */
  public async updateAvatarAsync(id: string, input: UserAvatarUpdateDto): Promise<void> {
    const client = this.getClinet()
    const url = urlFormatString(ApiUrls.User.Avatar, id)
    return await client.put(url, input)
  }

  /**
   * 获取用户搜索列表
   * @param input 搜索条件
   * @returns 用户搜索列表输出参数
   */
  public async getSearchListAsync(
    input: SearchUserListInputDto
  ): Promise<PagedResultDto<SearchUserOutputDto>> {
    const client = this.getClinet()
    const url = getUrlParameters(ApiUrls.User.List, input)
    return await client.get(url)
  }

  /**
   * 获取角色列表
   * @returns 角色列表
   */
  public async getAllListAsync(): Promise<RoleDto[]> {
    const client = this.getClinet()
    return await client.get(ApiUrls.User.Roles)
  }
}
