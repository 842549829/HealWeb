<script setup lang="tsx">
import { nextTick, PropType, ref, unref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag, ElTree } from 'element-plus'
import { PermissionHttpRequest } from '@/api/permission/index'
import { RoleHttpRequest } from '@/api/role/index'
import { IdentityRoleDto } from '@/api/role/type'
import { useI18n } from '@/hooks/web/useI18n'
import { RolePermissionTreeDto, RolePermissionTreeShowDto } from '@/api/permission/type'
import type { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import type Node from 'element-plus/es/components/tree/src/model/node'

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

// 递归转换数据结构将RolePermissionTreeDto[]==>RolePermissionTreeShowDto[]并且设置disabled并且设置isPenultimate
const setTreeDisabledPenultimate = (
  nodes: RolePermissionTreeDto[],
  disabled = true
): RolePermissionTreeShowDto[] =>
  nodes.map((node) => {
    const hasChildren = !!(node.children && node.children.length > 0)
    const isPenultimate =
      hasChildren &&
      node.children?.every((child) => !child.children || (child.children?.length ?? 0) === 0)

    return {
      ...node,
      disabled,
      isPenultimate,
      children: hasChildren ? setTreeDisabledPenultimate(node.children!, disabled) : undefined
    }
  })

// 自定义节点样式
const customNodeClass = ({ isPenultimate }: TreeNodeData, _: Node) =>
  isPenultimate ? 'is-penultimate' : ''

const treeData = ref<any[]>([])
const getMenuList = async () => {
  // 获取当前角色拥有的权限
  const res: RolePermissionTreeDto[] =
    await permissionHttpRequest.getAllRolePermissionTreeListAsync()
  if (res) {
    // 设置权限树
    const result = setTreeDisabledPenultimate(res)
    console.log(result)
    treeData.value = result
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
                  show-checkbox
                  node-key="permissionName"
                  default-expand-all
                  props={{ children: 'children', disabled: 'disabled', class: customNodeClass }}
                  highlight-current
                  expand-on-click-node={false}
                  data={treeData.value}
                  onNode-click={nodeClick}
                >
                  {{
                    default: (data: any) => {
                      return <span>{data.data.meta.title}</span>
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

<style lang="less" scoped>
// :deep(.is-penultimate > .el-tree-node__content) {
//   color: #626aef;
// }

:deep(.is-penultimate > .el-tree-node__children > div) {
  display: inline-block;
  margin-right: 4px;

  &:not(:first-child) .el-tree-node__content {
    padding-left: 0 !important;
  }

  .el-tree-node__content {
    padding-right: 16px;
  }
}
</style>
