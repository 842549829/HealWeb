<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { PermissionHttpRequest } from '@/api/permission/index'
import type { RolePermissionTreeDto } from '@/api/permission/type'
import { filter } from '@/utils/tree'
import { RoleHttpRequest } from '@/api/role/index'
import { IdentityRoleDto } from '@/api/role/type'

const { t } = useI18n()

const { required } = useValidator()

const permissionHttpRequest = new PermissionHttpRequest()
const roleHttpRequest = new RoleHttpRequest()

const props = defineProps({
  currentRow: {
    type: Object as PropType<IdentityRoleDto>,
    default: () => null
  }
})

const treeRef = ref<typeof ElTree>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'roleName',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: 0
        },
        {
          label: t('userDemo.enable'),
          value: 1
        }
      ]
    }
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="permissionName"
                    highlight-current
                    expand-on-click-node={false}
                    data={treeData.value}
                    onNode-click={nodeClick}
                    onNode-expand={handleExpand}
                  >
                    {{
                      default: (data: any) => {
                        const isLastNode = data.data.type === 3
                        return (
                          <span class={isLastNode ? 'leaf-node' : ''}>{data.data.meta.title}</span>
                        )
                      }
                    }}
                  </ElTree>
                </div>
                <div class="flex-1">
                  {unref(currentTreeData) && unref(currentTreeData)?.permissionList ? (
                    <ElCheckboxGroup v-model={unref(currentTreeData).meta.permission}>
                      {unref(currentTreeData)?.permissionList.map((v: any) => {
                        return (
                          <ElCheckbox label={v.value} key={v.value}>
                            {v.label}
                          </ElCheckbox>
                        )
                      })}
                    </ElCheckboxGroup>
                  ) : null}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

// 更新树的css
const changeCss = () => {
  const levelNames = document.getElementsByClassName('leaf-node') // levelname是上面的最底层节点的名字
  for (let i = 0; i < levelNames.length; i++) {
    // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
    console.log(levelNames[i])
    const levelName = levelNames[i].parentNode?.parentNode as HTMLElement
    levelName.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
  }
}

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

// 节点被展开时触发的事件
const handleExpand = () => {
  //节点被展开时触发的事件
  //因为该函数执行在renderContent函数之前，所以得加this.$nextTick()
  nextTick(() => {
    changeCss()
  })
}

const rules = reactive({
  roleName: [required()],
  role: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref<RolePermissionTreeDto[]>([])
const getMenuList = async () => {
  // 获取当前角色拥有的权限
  const res = await permissionHttpRequest.getAllRolePermissionTreeListAsync()
  if (res) {
    // 设置权限树
    treeData.value = res
    // 根据当前角色去session中的权限去设置tree的选中
    if (!props.currentRow) return
    const checked: string[] = await roleHttpRequest.getPermissionsAsync(unref(props.currentRow).id)
    nextTick(() => {
      for (const item of checked) {
        unref(treeRef)?.setChecked(item, true, false)
      }
    })
  }
}
getMenuList()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const checkedKeys = unref(treeRef)?.getCheckedKeys() || []
    const data = filter(unref(treeData), (item: any) => {
      return checkedKeys.includes(item.id)
    })
    formData.menu = data || []
    console.log(formData)
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
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
