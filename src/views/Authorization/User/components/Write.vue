<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { ref, onMounted, PropType, reactive } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { UserHttpRequest } from '@/api/user/index'
import { SelectDto } from '@/api/common/type'

const { t } = useI18n()
const { required } = useValidator()
const userHttpRequest = new UserHttpRequest()

const props = defineProps({
  id: {
    type: String as PropType<string>,
    required: false,
    default: undefined
  }
})

const roles = ref<SelectDto[]>()

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
  },
  {
    field: 'roleNames',
    label: t('userDemo.role'),
    component: 'Select',
    componentProps: {
      multiple: true,
      options: roles
    }
  }
])

const rules = reactive({
  userName: [required()]
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
    return formData
  }
}

// 组件挂载事件
onMounted(async () => {
  const currentId = props.id
  if (currentId) {
    // 编辑则查询数据并且绑定
    const user = await userHttpRequest.getDetailAsync(currentId)
    // 移除密码字段
    setSchema([
      {
        field: 'password',
        path: 'remove',
        value: true
      }
    ])

    setValues(user)
  }
  // 获取所有角色
  const roleList = await userHttpRequest.getAssignableRolesAsync()
  roles.value = roleList
})

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
