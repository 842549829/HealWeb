<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { DropdownTable } from '@/components/DropdownTable'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, ref, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { OrganizationDto } from '@/api/organizations/organization/type'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<OrganizationDto>,
    default: () => null
  }
})

const parentId = ref<string | null>(null)

const handleUpdate = (value: string | null) => {
  parentId.value = value
}

const formSchema = reactive<FormSchema[]>([
  {
    field: 'displayName',
    label: t('organization.displayName'),
    component: 'Input'
  },
  {
    field: 'parentId',
    label: t('organization.parentId'),
    formItemProps: {
      slots: {
        default: () => {
          return <DropdownTable modelValue={parentId.value} onUpdate:modelValue={handleUpdate} />
        }
      }
    }
  },
  {
    field: 'extraProperties.Phone',
    label: t('organization.phone'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Email',
    label: t('organization.email'),
    component: 'Input'
  },
  {
    field: 'extraProperties.EstablishmentDate',
    label: t('organization.establishmentDate'),
    component: 'DatePicker'
  },
  {
    field: 'extraProperties.WebsiteUrl',
    label: t('organization.websiteUrl'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Address',
    label: t('organization.address'),
    component: 'Input'
  },
  {
    field: 'extraProperties.PostalCode',
    label: t('organization.postalCode'),
    component: 'Input'
  },
  {
    field: 'extraProperties.ServiceHotline',
    label: t('organization.serviceHotline'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Introduction',
    label: t('organization.introduction'),
    component: 'Input'
  },
  {
    field: 'extraProperties.TrafficGuide',
    label: t('organization.trafficGuide'),
    component: 'Input'
  },
  {
    field: 'extraProperties.ParkingInformation',
    label: t('organization.parkingInformation'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Longitude',
    label: t('organization.longitude'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Latitude',
    label: t('organization.latitude'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Facilities',
    label: t('organization.facilities'),
    component: 'Input'
  },
  {
    field: 'extraProperties.Describe',
    label: t('organization.describe'),
    component: 'Input'
  },
  {
    field: 'extraProperties.IsEmergencyServices',
    label: t('organization.isEmergencyServices'),
    component: 'Switch',
    value: true
  },
  {
    field: 'extraProperties.IsInsuranceAccepted',
    label: t('organization.isEmergencyServices'),
    component: 'Switch',
    value: true
  }
])

const rules = reactive({
  displayName: [required()],
  'extraProperties.Phone': [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    formData.parentId = parentId.value
    return formData
  }
}

watch(
  () => props.currentRow,
  (value) => {
    if (!value) return
    // 如果是编辑节点，则隐藏name和tag字段
    setSchema([
      {
        field: 'permissionName',
        path: 'remove',
        value: true
      },
      {
        field: 'parentName',
        path: 'remove',
        value: true
      },
      {
        field: 'type',
        path: 'remove',
        value: true
      },
      {
        field: 'multiTenancySide',
        path: 'remove',
        value: true
      }
    ])

    setValues(value)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
