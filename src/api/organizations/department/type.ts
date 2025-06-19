import {
  AuditedEntityExtensionDto,
  EntityDto,
  FilterInput,
  Guid,
  IHasCodeDto,
  IHasConcurrencyStampDto,
  IHasNameDto,
  IHasOrganizationDto,
  IHasSortDto,
  IMayHaveDescribeDto
} from '@/api/common/type'

/**
 * 科室
 */
export interface DepartmentCreateOrUpdateDto extends IHasNameDto, IHasSortDto, IMayHaveDescribeDto {
  /**
   * 父级ID（GUID）
   */
  parentId?: string

  /**
   * 科室简称
   */
  shortName?: string

  /**
   * 科室类型ID（GUID）
   */
  departmentTypeId: string

  /**
   * 所在院区名称（多个可用逗号分隔）
   */
  campuses?: string

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
   * 床位数/接待能力(该科室可容纳的最大病人数或接诊量)
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
   * 科室负责人
   */
  headOfDepartment?: string

  /**
   * 负责人电话
   */
  headOfDepartmentPhone?: string

  /**
   * 负责人邮箱
   */
  headOfDepartmentEmail?: string

  /**
   * 科室网站
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
 * 科室创建DTO
 */
export interface DepartmentCreateDto extends DepartmentCreateOrUpdateDto, IHasOrganizationDto {
  /**
   * 所在院区Id
   */
  campusId: string
}

/**
 * 更新科室DTO
 */
export type DepartmentUpdateDto = DepartmentCreateOrUpdateDto

/**
 * 科室DTO
 */
export interface DepartmentDto
  extends AuditedEntityExtensionDto<Guid>,
    IHasCodeDto,
    IHasNameDto,
    IHasOrganizationDto,
    IHasSortDto,
    IMayHaveDescribeDto,
    IHasConcurrencyStampDto {
  /**
   * 所在院区ID（GUID）
   */
  campusId?: string

  /**
   * 科室简称
   */
  shortName?: string

  /**
   * 科室类型ID（GUID）
   */
  departmentTypeId: string

  /**
   * 所在院区名称（多个可用逗号分隔）
   */
  campuses?: string

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
   * 床位数/接待能力(该科室可容纳的最大病人数或接诊量)
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
   * 科室负责人
   */
  headOfDepartment?: string

  /**
   * 负责人电话
   */
  headOfDepartmentPhone?: string

  /**
   * 负责人邮箱
   */
  headOfDepartmentEmail?: string

  /**
   * 科室网站
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
 * 科室列表DTO
 */
export interface DepartmentListDto
  extends EntityDto<Guid>,
    IHasCodeDto,
    IHasNameDto,
    IHasOrganizationDto,
    IHasSortDto,
    IMayHaveDescribeDto,
    IHasConcurrencyStampDto {
  /**
   * 组织名称（必填）
   */
  organizationName: string

  /**
   * 院区Code（必填）
   */
  campusCode: string

  /**
   * 院区名称（必填）
   */
  campusName: string

  /**
   * 科室负责人（可选）
   */
  headOfDepartment?: string

  /**
   * 负责人电话（可选）
   */
  headOfDepartmentPhone?: string
}

/**
 * 科室查询输入
 */
export interface DepartmentInput extends FilterInput {
  /**
   * 院区Code
   */
  campusCode?: string
  /**
   * 机构Code
   */
  organizationCode?: string
}
