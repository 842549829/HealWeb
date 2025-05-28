<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { onMounted, PropType, reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const { required } = useValidator()

const props = defineProps({
  id: {
    type: String as PropType<string>,
    required: false,
    default: undefined
  }
})

// 表格列定义
const formSchema = reactive<FormSchema[]>([
  {
    field: 'userName',
    label: t('userDemo.account'),
    component: 'Input'
  },
  {
    field: 'surname',
    label: t('userDemo.surname'),
    component: 'Input'
  },
  {
    field: 'name',
    label: t('userDemo.name'),
    component: 'Input'
  },
  {
    field: 'email',
    label: t('userDemo.email'),
    component: 'Input'
  },
  {
    field: 'phoneNumber',
    label: t('userDemo.phoneNumber'),
    component: 'Input'
  },
  {
    field: 'password',
    label: t('userDemo.password'),
    component: 'InputPassword'
  }
])

const rules = reactive({
  userName: [required()]
})

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

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

// 组件挂载事件
onMounted(() => {
  const currentRow = props.id
  if (currentRow) {
    // 查询接口获取当前行数据
    //setValues({})
  }
})

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
