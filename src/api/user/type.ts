import { IdentityType } from '../common/enum'
import {
  EntityDto,
  ExtensibleFullAuditedEntityDto,
  ExtensibleObject,
  IHasConcurrencyStamp,
  IHasEntityVersion,
  IMultiTenant
} from '../common/type'

/**
 * 用户信息数据传输对象（DTO）
 */
export interface IdentityUserDto
  extends IHasEntityVersion,
    IHasConcurrencyStamp,
    IMultiTenant,
    ExtensibleFullAuditedEntityDto<
      string,
      {
        /**
         * 密码
         */
        OpenId?: string
        /**
         * 头像
         */
        Avatar?: string
        /**
         * 身份标识
         */
        Identity?: IdentityType
      }
    > {
  /**
   * 用户名
   */
  userName: string

  /**
   * 名
   */
  name: string

  /**
   * 姓
   */
  surname: string

  /**
   * 邮箱地址
   */
  email: string

  /**
   * 邮箱是否已确认
   */
  emailConfirmed: boolean

  /**
   * 手机号码
   */
  phoneNumber?: string

  /**
   * 手机号是否已确认
   */
  phoneNumberConfirmed: boolean

  /**
   * 用户是否激活
   */
  isActive: boolean

  /**
   * 是否启用锁定功能
   */
  lockoutEnabled: boolean

  /**
   * 登录失败次数
   */
  accessFailedCount: number

  /**
   * 锁定结束时间（UTC时间）
   */
  lockoutEnd?: Date

  /**
   * 最后一次密码修改时间
   */
  lastPasswordChangeTime?: Date
}

/**
 * 用户详情信息 DTO
 */
export interface IdentityUserDetailDto extends IdentityUserDto {
  /**
   * 组织ID（可为空）
   */
  organizationId?: string | null

  /**
   * 角色名称列表（必填）
   */
  roleNames: string[]
}

/**
 * 用户更新角色
 */
export interface IdentityUserUpdateRolesDto {
  /**
   * 角色名称列表
   */
  roleNames: string[]
}

/**
 * 更新用户头像
 */
export interface UserAvatarUpdateDto
  extends ExtensibleObject<{
      /**
       * 头像
       */
      Avatar?: string
    }>,
    IHasConcurrencyStamp {}

/**
 * 用户列表查询参数 DTO
 */
export interface SearchUserListInputDto {
  /**
   * 排序字段（例如：name asc, creationTime desc）
   */
  sorting?: string

  /**
   * 过滤条件（关键字搜索内容）
   */
  filter?: string

  /**
   * 每页最大结果数，默认值：10
   */
  maxResultCount: number

  /**
   * 用户ID集合，用于按ID过滤
   */
  userIds: string[] // Guid 在前端通常用 string 表示 UUID
}

/**
 * 用户搜索结果 DTO
 */
export interface SearchUserOutputDto extends EntityDto<string> {
  /**
   * 用户名
   */
  userName?: string

  /**
   * 姓名（全名）
   */
  fullName?: string
}

/**
 * 用户创建或更新 DTO 基类（抽象）
 */
export interface IdentityUserCreateOrUpdateDtoBase
  extends ExtensibleObject<{
    /**
     * 密码
     */
    OpenId?: string
    /**
     * 头像
     */
    Avatar?: string
    /**
     * 身份标识
     */
    Identity?: IdentityType
  }> {
  /**
   * 用户名（必填）
   */
  userName: string

  /**
   * 名（可选）
   */
  name?: string

  /**
   * 姓（可选）
   */
  surname?: string

  /**
   * 邮箱地址（必填）
   */
  email: string

  /**
   * 手机号码（可选）
   */
  phoneNumber?: string

  /**
   * 是否激活（默认 false）
   */
  isActive: boolean

  /**
   * 是否启用锁定功能（默认 false）
   */
  lockoutEnabled: boolean

  /**
   * 角色名称列表（可为空数组）
   */
  roleNames?: string[]
}

/**
 * 用户创建 DTO
 */
export interface IdentityUserCreateDto extends IdentityUserCreateOrUpdateDtoBase {
  /**
   * 密码（必填）
   */
  password: string
}

/**
 * 创建用户 DTO
 */
export interface UserCreateDto extends IdentityUserCreateDto {
  /**
   * 组织ID（机构ID）
   */
  organizationId: string // Guid 在前端通常用 string 表示 UUID
}

/**
 * 用户更新 DTO
 */
export interface IdentityUserUpdateDto extends IdentityUserCreateOrUpdateDtoBase {
  /**
   * 新密码（可选）
   */
  password?: string

  /**
   * 并发控制戳（用于乐观并发控制）
   */
  concurrencyStamp: string
}

/**
 * 用户更新 DTO
 */
export type UserUpdateDto = IdentityUserUpdateDto
