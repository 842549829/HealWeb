import request from '@/axios'

import { authorizationHttpRequest as requestNew } from '@/http/index'

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

export const getListAsync = (moduleName: string) => {
  const url = `api/net/basics/permissions/routes/${moduleName}`
  return requestNew.get<any>(url)
}
