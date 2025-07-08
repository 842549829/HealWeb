<script setup lang="tsx">
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { PropType, reactive, ref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { UserHttpRequest } from '@/api/user'
import { IdentityUserDetailDto } from '@/api/user/type'

const renderRoleNames = (roleNames: string[] | undefined) => {
  if (!roleNames || roleNames.length === 0) {
    return <span>无角色</span>
  }

  return <span>{roleNames.join(', ')}</span>
}

// 引入i18n
const { t } = useI18n()

const userHttpRequest = new UserHttpRequest()

// 定义接收参数
const props = defineProps({
  id: {
    type: String as PropType<string>,
    required: true
  }
})

// 表单数据
const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'userName',
    label: t('userDemo.account')
  },
  {
    field: 'surname',
    label: t('userDemo.surname')
  },
  {
    field: 'name',
    label: t('userDemo.name')
  },
  {
    field: 'email',
    label: t('userDemo.email')
  },
  {
    field: 'phoneNumber',
    label: t('userDemo.phoneNumber')
  },
  {
    field: 'roleNames',
    label: t('userDemo.role'),
    slots: {
      default: (data: IdentityUserDetailDto) => {
        return renderRoleNames(data.roleNames)
      }
    }
  }
])

const currentRow = ref<IdentityUserDetailDto>()

// 初始化表单数据
onMounted(async () => {
  // 编辑则查询数据并且绑定
  const user = await userHttpRequest.getDetailAsync(props.id)
  currentRow.value = user
})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
