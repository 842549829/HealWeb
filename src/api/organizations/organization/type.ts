import type {
  FilterInput,
  ExtensibleFullAuditedEntityDto,
  IMultiTenant,
  IHasConcurrencyStamp,
  ExtensibleObject
} from '@/api/common/type'

/**
 * 组织机构扩展对象
 */
export interface OrganizationExtensibleObject {
  /**
   * 联系电话
   */
  Phone?: string
  /**
   * 成立时间
   */
  EstablishmentDate?: string
  /**
   * 邮箱
   */
  Email?: string
  /**
   * 官方网站
   */
  WebsiteUrl?: string
  /**
   * 地址
   */
  Address?: string
  /**
   * 邮政编码
   */
  PostalCode?: string
  /**
   * 服务热线
   */
  ServiceHotline?: string
  /**
   * 医院简介
   */
  Introduction?: string
  /**
   * 交通指南
   */
  TrafficGuide?: string
  /**
   * 停车信息
   */
  ParkingInformation?: string
  /**
   * 备注描述
   */
  Describe?: string
  /**
   * 纬度
   */
  Latitude?: number
  /**
   * 经度
   */
  Longitude?: number
  /**
   * 封面图片
   */
  CoverImage?: string
  /**
   * 医院设施
   */
  Facilities?: string
  /**
   * 营业时间
   */
  OperatingHours?: Date
  /**
   * 是否提供急诊服务
   */
  IsEmergencyServices?: boolean
  /**
   * 是否接受医保
   */
  IsInsuranceAccepted?: boolean
}

/**
 * 组织机构DTO
 */
export interface GetOrganizationsInput extends FilterInput {
  /**
   * 父级Id
   */
  parentId?: string
}

/**
 * 组织机构DTO
 */
export interface OrganizationDto
  extends ExtensibleFullAuditedEntityDto<string, OrganizationExtensibleObject>,
    IMultiTenant,
    IHasConcurrencyStamp {
  /**
   * 父级Id
   */
  parentId?: string
  /**
   * 组织机构代码
   */
  code: string
  /**
   * 组织机构名称
   */
  displayName: string
}

/**
 * 组织机构树DTO
 */
export interface OrganizationTreeDto extends OrganizationDto {
  /**
   * 是否有子节点
   */
  hasChildren?: boolean
  /**
   * 子节点
   */
  children?: OrganizationTreeDto[]
}

/**
 * 创建组织机构DTO
 */
export interface OrganizationCreateDto extends ExtensibleObject<OrganizationExtensibleObject> {
  /**
   * 父级Id
   */
  parentId?: string
  /**
   * 组织机构名称
   */
  displayName: string
}

/**
 * 更新组织机构DTO
 */
export interface OrganizationUpdateDto
  extends ExtensibleObject<OrganizationExtensibleObject>,
    IHasConcurrencyStamp {
  /**
   * 组织机构名称
   */
  displayName: string
}
