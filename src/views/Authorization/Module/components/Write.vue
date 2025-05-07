<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ModuleListDto } from '@/api/module/type'
import { ModuleTag } from '@/api/common/type'
import { cloneDeep } from 'lodash-es'

// 引入i18n
const { t } = useI18n()

// 引入验证函数
const { required } = useValidator()

// 定义接收参数
const props = defineProps({
  currentRow: {
    type: Object as PropType<ModuleListDto>,
    default: () => null
  }
})

// 模块标签
const moduleTagOptions = [
  {
    label: t('module.tags.normal'),
    value: ModuleTag.Normal
  },
  {
    label: t('module.tags.normalSystem'),
    value: ModuleTag.NormalSystem
  },
  {
    label: t('module.tags.system'),
    value: ModuleTag.System
  },
  {
    label: t('module.tags.thirdParty'),
    value: ModuleTag.ThirdParty
  }
]

// 表单数据
const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('module.dislayName'),
    component: 'Input'
  },
  {
    field: 'displayName',
    label: t('module.name'),
    component: 'Input'
  },
  {
    field: 'tag',
    label: t('module.tag'),
    component: 'Select',
    componentProps: {
      options: moduleTagOptions
    }
  },
  {
    field: 'path',
    label: t('module.path'),
    component: 'Input'
  },
  {
    field: 'component',
    label: t('module.component'),
    component: 'Input'
  },
  {
    field: 'redirect',
    label: t('module.redirect'),
    component: 'Input'
  },
  {
    field: 'alias',
    label: t('module.alias'),
    component: 'Input'
  },
  {
    field: 'icon',
    label: t('module.icon'),
    component: 'Input'
  },
  {
    field: 'activeMenu',
    label: t('module.activeMenu'),
    component: 'Input'
  },
  {
    field: 'hidden',
    label: t('module.hidden'),
    component: 'Switch'
  },
  {
    field: 'alwaysShow',
    label: t('module.alwaysShow'),
    component: 'Switch'
  },
  {
    field: 'noCache',
    label: t('module.noCache'),
    component: 'Switch'
  },
  {
    field: 'breadcrumb',
    label: t('module.breadcrumb'),
    component: 'Switch'
  },
  {
    field: 'affix',
    label: t('module.affix'),
    component: 'Switch'
  },
  {
    field: 'noTagsView',
    label: t('module.noTagsView'),
    component: 'Switch'
  },
  {
    field: 'canTo',
    label: t('module.canTo'),
    component: 'Switch'
  }
])

// 表单验证规则
const rules = reactive({
  name: [required()],
  displayName: [required()],
  tag: [required()],
  component: [required()],
  path: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

// 表单提交
const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

// 初始化表单数据
watch(
  () => props.currentRow,
  (value) => {
    if (!value) return
    const currentRow = cloneDeep(value)
    setValues(currentRow)
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
