import request from '@/axios'
import type { UserLoginType, UserType } from './types'
import { UnAuthorizationHttpRequest } from '@/http/index'
import { ApiUrls } from '../urls/index'

interface RoleParams {
  roleName: string
}

// 登录
export class LoginHttpRequest {
  // 登录
  public loginAsync(input: UserLoginType) {
    const client = this.getRequest()
    return client.post<UserType>(ApiUrls.Accounts.Login, input)
  }
  private getRequest() {
    return new UnAuthorizationHttpRequest()
  }
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/mock/user/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
