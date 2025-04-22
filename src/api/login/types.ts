export interface UserLoginType {
  username: string
  password: string
  remember: boolean
  tenantId?: string
}

export interface UserType {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  // TODO根据token自己解析这里这样写是为了编译能通过
  username?: string
}
