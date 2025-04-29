import request from '@/axios'
import type { UserLoginType, UserType } from './types'
import { UnAuthorizationHttpRequest } from '@/http/index'

interface RoleParams {
  roleName: string
}

// Api地址
enum Api {
  LOGIN_URL = 'api/net/basics/accounts/login',
  PERMISSION_URL = 'api/net/basics/permissions/routes'
}

// 登录
export class LoginHttpRequest {
  // 登录
  public loginAsync(input: UserLoginType) {
    const client = this.getRequest()
    return client.post<UserType>(Api.LOGIN_URL, input)
  }

  // 获取权限
  public getPermissionAsync() {
    const client = this.getRequest()
    return client.get<AppCustomRouteRecordRaw[]>(Api.PERMISSION_URL)
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
