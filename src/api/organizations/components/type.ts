import {
  AuditedEntityExtensionDto,
  EntityDto,
  FilterInput,
  IHasCodeDto,
  IHasConcurrencyStampDto,
  IHasNameDto,
  IHasOrganizationDto,
  IHasSortDto,
  IMayHaveDescribeDto
} from '@/api/common/type'

/**
 * 院区数据传输对象接口
 */
export interface CampusDto
  extends AuditedEntityExtensionDto<string>,
    IHasCodeDto,
    IHasNameDto,
    IHasOrganizationDto,
    IHasSortDto,
    IMayHaveDescribeDto,
    IHasConcurrencyStampDto {
  /**
   * 简称
   */
  shortName?: string

  /**
   * 所在大楼
   */
  building?: string

  /**
   * 所在楼层
   */
  floor?: string

  /**
   * 房间号
   */
  roomNumber?: string

  /**
   * 所在详细地址
   */
  address?: string

  /**
   * 床位数/接待能力(该院区可容纳的最大病人数或接诊量)
   */
  capacity: number

  /**
   * 联系电话
   */
  phone?: string

  /**
   * 电子邮箱
   */
  email?: string

  /**
   * 院区负责人
   */
  headOfCampus?: string

  /**
   * 负责人电话
   */
  headOfCampusPhone?: string

  /**
   * 负责人邮箱
   */
  headOfCampusEmail?: string

  /**
   * 院区网站
   */
  website?: string

  /**
   * 提供的服务
   */
  servicesOffered?: string

  /**
   * 紧急联系人
   */
  emergencyContact?: string

  /**
   * 紧急联系电话
   */
  emergencyPhone?: string
}

/**
 * 院区创建或更新数据传输对象接口
 */
export interface CampusCreateOrUpdateDto
  extends IHasNameDto,
    IHasOrganizationDto,
    IHasSortDto,
    IMayHaveDescribeDto {
  /**
   * 父级ID（GUID）
   */
  parentId?: string

  /**
   * 简称
   */
  shortName?: string

  /**
   * 所在大楼
   */
  building?: string

  /**
   * 所在楼层
   */
  floor?: string

  /**
   * 房间号
   */
  roomNumber?: string

  /**
   * 所在详细地址
   */
  address?: string

  /**
   * 床位数/接待能力(该院区可容纳的最大病人数或接诊量)
   */
  capacity: number

  /**
   * 联系电话
   */
  phone?: string

  /**
   * 电子邮箱
   */
  email?: string

  /**
   * 院区负责人
   */
  headOfCampus?: string

  /**
   * 负责人电话
   */
  headOfCampusPhone?: string

  /**
   * 负责人邮箱
   */
  headOfCampusEmail?: string

  /**
   * 院区网站
   */
  website?: string

  /**
   * 提供的服务
   */
  servicesOffered?: string

  /**
   * 紧急联系人
   */
  emergencyContact?: string

  /**
   * 紧急联系电话
   */
  emergencyPhone?: string
}

/**
 * 院区创建数据传输对象接口
 */
export type CampusCreateDto = CampusCreateOrUpdateDto

/**
 * 院区更新数据传输对象接口
 */
export interface CampusUpdateDto extends CampusCreateOrUpdateDto, IHasConcurrencyStampDto {}

/**
 * 院区列表数据传输对象接口
 */
export interface CampusListDto
  extends EntityDto<string>,
    IHasCodeDto,
    IHasNameDto,
    IHasOrganizationDto,
    IHasSortDto,
    IMayHaveDescribeDto,
    IHasConcurrencyStampDto {}

/**
 * 院区过滤输入接口
 */
export type CampusInput = FilterInput

/**
 * 院区数据传输对象接口
 */
export interface CampusDto
  extends AuditedEntityExtensionDto<string>,
    IHasCodeDto,
    IHasNameDto,
    IHasOrganizationDto,
    IHasSortDto,
    IMayHaveDescribeDto,
    IHasConcurrencyStampDto {
  /**
   * 简称
   */
  shortName?: string

  /**
   * 所在大楼
   */
  building?: string

  /**
   * 所在楼层
   */
  floor?: string

  /**
   * 房间号
   */
  roomNumber?: string

  /**
   * 所在详细地址
   */
  address?: string

  /**
   * 床位数/接待能力(该院区可容纳的最大病人数或接诊量)
   */
  capacity: number

  /**
   * 联系电话
   */
  phone?: string

  /**
   * 电子邮箱
   */
  email?: string

  /**
   * 院区负责人
   */
  headOfCampus?: string

  /**
   * 负责人电话
   */
  headOfCampusPhone?: string

  /**
   * 负责人邮箱
   */
  headOfCampusEmail?: string

  /**
   * 院区网站
   */
  website?: string

  /**
   * 提供的服务
   */
  servicesOffered?: string

  /**
   * 紧急联系人
   */
  emergencyContact?: string

  /**
   * 紧急联系电话
   */
  emergencyPhone?: string
}
