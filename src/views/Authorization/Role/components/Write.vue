<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElCheckbox, ElTree, ElMessage } from 'element-plus'
import { PermissionHttpRequest } from '@/api/permission/index'
import type { RolePermissionTreeDto } from '@/api/permission/type'
import { RoleHttpRequest } from '@/api/role/index'
import { IdentityRoleDto, UpdatePermissionDto } from '@/api/role/type'
import { differ } from '@/utils/enumerable'

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
    field: 'name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'isDefault',
    label: t('role.isDefault'),
    component: 'Switch',
    componentProps: {
      disabled: false
    }
  },
  {
    field: 'isStatic',
    label: t('role.isStatic'),
    component: 'Switch',
    componentProps: {
      disabled: false
    }
  },
  {
    field: 'isPublic',
    label: t('role.isPublic'),
    component: 'Switch',
    componentProps: {
      disabled: false
    }
  },
  {
    field: 'permissions',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full items-center p-2">
                <div class="mr-4">
                  <ElCheckbox
                    value={checked.value}
                    onUpdate:modelValue={handleToggleSelection}
                    label="全选/反选"
                    size="large"
                  />
                </div>
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="permissionName"
                    highlight-current
                    check-strictly
                    expand-on-click-node={false}
                    data={treeData.value}
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
              </div>
            </>
          )
        }
      }
    }
  }
])

const checked = ref(false)
function getAllNodeKeys(nodeList: any) {
  const keys: string[] = []
  function traverse(nodes: any) {
    for (const node of nodes) {
      keys.push(node.permissionName)
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(nodeList)
  return keys
}

function handleToggleSelection() {
  const allKeys = getAllNodeKeys(treeData.value)
  const currentCheckedKeys = unref(treeRef)?.getCheckedKeys()
  const invertKeys = allKeys.filter((key) => !currentCheckedKeys.includes(key))
  unref(treeRef)?.setCheckedKeys(invertKeys)
}

// 加载角色权限
const beforePermissions: Array<string> = []

// 加载操作前选中数据
const initDefaultCheckedkeys = () => {
  const checkedNodes = unref(treeRef)?.getCheckedNodes(false, true)
  for (let index = 0; index < checkedNodes.length; index++) {
    const item = checkedNodes[index]
    beforePermissions.push(item.permissionName)
  }
}

// 更新树的css
const changeCss = () => {
  const levelNames = document.getElementsByClassName('leaf-node') // levelname是上面的最底层节点的名字
  for (let i = 0; i < levelNames.length; i++) {
    // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
    const levelName = levelNames[i].parentNode?.parentNode as HTMLElement
    levelName.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
  }
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
  name: [required()]
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
      initDefaultCheckedkeys()
    })
  }
}
getMenuList()

const getUpdatePermissionDto = () => {
  // 选中的的数据
  const checkedNodes = treeRef.value!.getCheckedNodes(false, true)
  const permissions = new Array<UpdatePermissionDto>()
  for (let index = 0; index < checkedNodes.length; index++) {
    const item = checkedNodes[index]
    permissions.push({ name: item.permissionName, isGranted: true })
  }
  if (permissions.length <= 0) {
    ElMessage({
      showClose: true,
      message: '请选择角色权限',
      type: 'error'
    })
    return null
  }

  const afterPermissions = permissions.map((item) => item.name)
  const differResult = differ(beforePermissions, afterPermissions)
  const result = new Array<UpdatePermissionDto>()
  differResult.after.forEach((item) => {
    result.push({ name: item, isGranted: true })
  })
  differResult.before.forEach((item) => {
    result.push({ name: item, isGranted: false })
  })
  return result
}

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const data = getUpdatePermissionDto()
    const formData = await getFormData()
    formData.permissions = data || []
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
