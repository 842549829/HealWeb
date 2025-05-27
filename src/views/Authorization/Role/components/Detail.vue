<script setup lang="tsx">
import { nextTick, PropType, ref, unref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag, ElTree } from 'element-plus'
import { PermissionHttpRequest } from '@/api/permission/index'
import { RoleHttpRequest } from '@/api/role/index'
import { IdentityRoleDto } from '@/api/role/type'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const permissionHttpRequest = new PermissionHttpRequest()
const roleHttpRequest = new RoleHttpRequest()

const props = defineProps({
  currentRow: {
    type: Object as PropType<IdentityRoleDto>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

const treeRef = ref<typeof ElTree>()

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  currentTreeData.value = treeData
}

const treeData = ref<any[]>([])
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

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'name',
    label: t('role.roleName')
  },
  {
    field: 'isDefault',
    label: t('role.isDefault'),
    slots: {
      default: (data: any) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'isStatic',
    label: t('role.isStatic'),
    slots: {
      default: (data: any) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'isPublic',
    label: t('role.isPublic'),
    slots: {
      default: (data: any) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'permissionList',
    label: '菜单分配',
    span: 24,
    slots: {
      default: () => {
        return (
          <>
            <div class="flex w-full">
              <div class="flex-1">
                <ElTree
                  ref={treeRef}
                  node-key="id"
                  props={{ children: 'children', label: 'title' }}
                  highlight-current
                  expand-on-click-node={false}
                  data={treeData.value}
                  onNode-click={nodeClick}
                >
                  {{
                    default: (data) => {
                      return <span>{data?.data?.title}</span>
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
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
