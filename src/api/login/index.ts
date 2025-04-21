import request from '@/axios'
import type { UserType } from './types'
import { authorizationHttpRequest as requestNew } from '@/http/index'

interface RoleParams {
  roleName: string
}

// Api地址
enum Api {
  LOGIN_URL = 'api/net/basics/Login'
}

// 登录
export class LoginHttpRequest {
  // 等了
  public loginAsync = (input: any) => requestNew.post<any>(Api.LOGIN_URL, input)
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
