import { Base64 } from 'js-base64'

// 定义JWT部分之间的分隔符
const JWT_PARTS_SEPARATOR = '.'

/**
 * 表示完整的 JWT（JSON Web Token）结构，包含头部、负载和签名三部分。
 */
export interface Jwt {
  /**
   * JWT 的头部信息，包含签名算法、密钥标识等元数据。
   * @example
   * {
   *   alg: 'RS256',
   *   kid: '7C686BD3ED4761F8E456A7ACB8E1E11AEF742EA2',
   *   x5t: 'fGhr0-1HYfjkVqesuOHhGu90LqI',
   *   typ: 'at+jwt'
   * }
   */
  header: JwtHeader

  /**
   * JWT 的负载信息，包含用户声明（claims）和元数据。
   * @example
   * {
   *   sub: '3a194f8d-d797-004e-d3b2-89c6a9684089',
   *   preferred_username: 'admin',
   *   email: 'admin@abp.io',
   *   role: 'admin',
   *   exp: 1745563475,
   *   ...
   * }
   */
  payload: JwtPayload

  /**
   * JWT 的签名部分，用于验证令牌的完整性和真实性。
   * - 由头部和负载的 Base64Url 编码字符串拼接后，使用密钥签名生成。
   * - 格式为 Base64Url 编码的二进制数据字符串。
   * @example
   * "dBJnhmsd3X7e0Q3gg347aT4..."
   */
  signature: string
}

export interface JwtHeader {
  // 签名算法（Algorithm），必须为非空字符串
  // 常见值：RS256（RSA 签名）、HS256（HMAC-SHA256）
  alg: string

  // 密钥标识符（Key ID），用于在密钥集中选择对应的公钥
  // 通常为 Base64 编码的字符串或唯一标识符
  kid: string

  // X.509 证书指纹（X.509 Certificate Thumbprint）
  // 通常为证书的 SHA-1 哈希值的 Base64 编码
  x5t: string

  // 令牌类型（Type），标识该令牌的用途或格式
  // 常见值：JWT（标准 JWT）、at+jwt（访问令牌）
  typ: string
}

export interface JwtPayload {
  // JWT 签发者（Issuer），标识颁发该 JWT 的服务或应用
  iss: string

  // 令牌过期时间（Unix 时间戳，单位：秒）
  exp: number

  // 令牌签发时间（Unix 时间戳，单位：秒）
  iat: number

  // 令牌的受众（Audience），标识该令牌的接收方或目标应用
  aud: string

  // 授予的权限范围（Scope），通常用于 OAuth 2.0 授权
  scope: string

  // 令牌唯一标识符（JWT ID），用于防止令牌重复使用
  jti: string

  // 主体标识（Subject），唯一标识令牌的用户或资源
  sub: string

  // 用户的首选用户名（通常用于登录显示）
  preferred_username: string

  // 用户邮箱地址
  email?: string

  // 用户角色（Role），表示用户在系统中的权限级别
  role: string | string[]

  // 用户名或显示名称（Given Name）
  given_name: string

  // 手机号码是否已验证（字符串类型，值为 "True" 或 "False"）
  phone_number_verified?: string

  // 邮箱是否已验证（字符串类型，值为 "True" 或 "False"）
  email_verified?: string

  // 用户唯一名称（Unique Name），通常为登录用户名
  unique_name: string

  // 数据权限级别（Data Permission），具体含义需根据业务定义
  data_permission: string

  // 是否启用记住我功能（Remember Me），值为 "True" 或 "False"
  remember_me: string

  // 用户所属组织或应用标识（Organization Instance），值为 "HealNetApp"
  oi_prst?: string

  // 用户账户唯一标识（Account Unique ID）
  oi_au_id: string

  // 客户端标识（Client ID），标识请求该令牌的客户端应用
  client_id: string

  // 令牌唯一标识（Token ID），用于追踪令牌生命周期
  oi_tkn_id: string
}

/**
 * 解析accessToken并返回完整的Jwt对象（包含Header、Payload和Signature）。
 * @param accessToken - 要解析的JWT令牌。
 * @returns 解析后的Jwt对象。
 * @throws 如果accessToken格式不正确或无法解析，则抛出错误。
 */
export const parseJwt = (accessToken: string): Jwt => {
  // 1. 拆分JWT的三个部分
  const parts = accessToken.split(JWT_PARTS_SEPARATOR)
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format: must have exactly 3 parts')
  }

  const [headerBase64, payloadBase64, signature] = parts

  // 2. 解析Header
  let headerJson: string
  try {
    // 使用URL安全的Base64解码（替换-和_）
    headerJson = Base64.decode(headerBase64)
  } catch (error) {
    console.log(error)
    throw new Error('Failed to decode JWT header: invalid Base64')
  }
  let header: JwtHeader
  try {
    header = JSON.parse(headerJson) as JwtHeader
  } catch (error) {
    console.log(error)
    throw new Error('Failed to parse JWT header: invalid JSON')
  }

  // 3. 解析Payload
  let payloadJson: string
  try {
    payloadJson = Base64.decode(payloadBase64)
  } catch (error) {
    console.log(error)
    throw new Error('Failed to decode JWT payload: invalid Base64')
  }
  let payload: JwtPayload
  try {
    payload = JSON.parse(payloadJson) as JwtPayload
  } catch (error) {
    console.log(error)
    throw new Error('Failed to parse JWT payload: invalid JSON')
  }

  // 4. 返回完整的Jwt对象
  return {
    header,
    payload,
    signature
  }
}
