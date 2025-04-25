export interface TenantOption {
  label: string
  value: string
}

export interface UserLoginType {
  userName: string
  password: string
  remember: boolean
  tenantId?: string
}

export interface UserType {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
  userId: string
  username?: string
}
