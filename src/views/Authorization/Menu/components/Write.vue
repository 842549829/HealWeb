<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { MenuDto } from '@/api/menu/type'
import { MultiTenancySides, PermissionType } from '@/api/common/enum'
import { generateEnumOptionsLocales } from '@/utils/enumUtils'

const { t } = useI18n()

const { required, number } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<MenuDto>,
    default: () => null
  }
})

// 多租户
const multiTenancySideOptions = generateEnumOptionsLocales(
  MultiTenancySides,
  t,
  'menu.multiTenancySides'
)

const typeOptions = generateEnumOptionsLocales(PermissionType, t, 'menu.types')

const formSchema = reactive<FormSchema[]>([
  {
    field: 'permissionName',
    label: t('menu.code'),
    component: 'Input'
  },
  // {
  //   field: 'groupName',
  //   label: t('menu.groupName'),
  //   component: 'Input'
  // },
  {
    field: 'displayName',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'parentName',
    label: t('menu.parentName'),
    component: 'Input'
  },
  {
    field: 'tag',
    label: t('menu.tag'),
    component: 'Input'
  },
  {
    field: 'path',
    label: t('menu.path'),
    component: 'Input'
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input'
  },
  {
    field: 'component',
    label: t('menu.component'),
    component: 'Input'
  },
  {
    field: 'redirect',
    label: t('menu.redirect'),
    component: 'Input'
  },
  {
    field: 'alias',
    label: t('menu.alias'),
    component: 'Input'
  },
  {
    field: 'title',
    label: t('menu.title'),
    component: 'Input'
  },
  {
    field: 'icon',
    label: t('menu.icon'),
    component: 'Input'
  },
  {
    field: 'activeMenu',
    label: t('menu.activeMenu'),
    component: 'Input'
  },
  {
    field: 'multiTenancySide',
    label: t('menu.multiTenancySide'),
    component: 'Select',
    componentProps: {
      options: multiTenancySideOptions
    }
  },
  {
    field: 'providers',
    label: t('menu.providers'),
    component: 'Input'
  },
  {
    field: 'stateCheckers',
    label: t('menu.stateCheckers'),
    component: 'Input'
  },
  {
    field: 'type',
    label: t('menu.type'),
    component: 'Select',
    componentProps: {
      options: typeOptions
    }
  },
  {
    field: 'isEnabled',
    label: t('menu.isEnabled'),
    component: 'Switch',
    componentProps: {
      default: true
    }
  },
  {
    field: 'hidden',
    label: t('menu.hidden'),
    component: 'Switch',
    componentProps: {
      default: true
    }
  },
  {
    field: 'alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch',
    componentProps: {
      default: true
    }
  },
  {
    field: 'noCache',
    label: t('menu.noCache'),
    component: 'Switch',
    componentProps: {
      default: true
    }
  },
  {
    field: 'breadcrumb',
    label: t('menu.breadcrumb'),
    component: 'Switch'
  },
  {
    field: 'affix',
    label: t('menu.affix'),
    component: 'Switch',
    componentProps: {
      default: true
    }
  },
  {
    field: 'noTagsView',
    label: t('menu.noTagsView'),
    component: 'Switch',
    componentProps: {
      default: true
    }
  },
  {
    field: 'canTo',
    label: t('menu.canTo'),
    component: 'Switch'
  }
])

const rules = reactive({
  permissionName: [required()],
  //groupName: [required()],
  displayName: [required()],
  tag: [required(), number()],
  name: [required()],
  component: [required()],
  path: [required()],
  title: [required()],
  type: [required()]
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
      // {
      //   field: 'groupName',
      //   path: 'remove',
      //   value: true
      // },
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
