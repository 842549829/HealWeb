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
}
