import type {
  EntityDto,
  ExtensibleObject,
  IHasConcurrencyStamp,
  IHasCreationTime
} from '../common/type'

/**
 * IdentityRoleDto
 * 用于描述角色信息的数据传输对象。
 */
export interface IdentityRoleDto
  extends EntityDto<string>,
    ExtensibleObject,
    IHasConcurrencyStamp,
    IHasCreationTime {
  /**
   * 角色名称。
   */
  name: string

  /**
   * 指示此角色是否为默认角色。
   */
  isDefault: boolean

  /**
   * 指示此角色是否是静态的（不可修改）。
   */
  isStatic: boolean

  /**
   * 指示此角色是否公开。
   */
  isPublic: boolean

  /**
   * 创建时间，指示对象创建的时间点。
   */
  creationTime: Date
}

/**
 * 权限实体
 */
export interface UpdatePermissionDto {
  /**
   * 权限标识符
   */
  name: string

  /**
   * 权限值
   */
  isGranted: boolean
}

/**
 * 角色实体
 */
export interface RoleDto {
  /**
   * 角色标识符
   */
  permissions: UpdatePermissionDto[]
}

/**
 * IdentityRoleCreateOrUpdateDtoBase 接口定义了创建或更新角色的基本信息。
 * 注意：以下属性的要求来源于原始C#代码中的属性注解。
 */
export interface IdentityRoleCreateOrUpdateDtoBase {
  /**
   * 角色名称。
   * - 必填（[Required]）
   * - 字符串长度需小于等于 IdentityRoleConsts.MaxNameLength （[DynamicStringLength]）
   * - 显示名称为 "RoleName" （[Display]）
   */
  name: string

  /**
   * 指示此角色是否为默认角色。
   */
  isDefault: boolean

  /**
   * 指示此角色是否公开。
   */
  isPublic: boolean
}

/**
 * 创建角色的 DTO 类。
 */
export interface RoleCreateDto extends IdentityRoleCreateOrUpdateDtoBase {
  /**
   * 角色标识符
   */
  permissions: UpdatePermissionDto[]
}

/**
 * 更新角色的 DTO 类。
 */
export interface RoleUpdateDto extends IdentityRoleCreateOrUpdateDtoBase {
  /**
   * 角色标识符
   */
  permissions: UpdatePermissionDto[]
}
