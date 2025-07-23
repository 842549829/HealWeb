<script setup lang="tsx">
import { ref, onMounted, unref } from 'vue'
import { ElPopover, ElInput, ElTable, ElTableColumn, ElPagination } from 'element-plus'
import { GetOrganizationsInput, OrganizationTreeDto } from '@/api/organizations/organization/type'
import { OrganizationsHttpRequest } from '@/api/organizations/organization/index'
import { PagedResultDto } from '@/api/common/type'

// 组织机构管理请求
const organizationsHttpRequest = new OrganizationsHttpRequest()

const props = defineProps<{
  modelValue: string | null
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const selectedLabel = ref('')

const findLabel = (data: OrganizationTreeDto[]): string => {
  for (const node of data) {
    if (node.id === props.modelValue) return node.displayName
    if (node.children) {
      const res = findLabel(node.children)
      if (res) return res
    }
  }
  return ''
}

const popoverVisible = ref(false)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(5)

const total = ref(0)
const list = ref()
const handleRowClick = (row: OrganizationTreeDto) => {
  emits('update:modelValue', row.id)
  selectedLabel.value = row.displayName
  popoverVisible.value = false
}

// 分页切换
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const fetchDataApi = async () => {
  const skipCount = (unref(currentPage) - 1) * unref(pageSize)
  const input: GetOrganizationsInput = {
    skipCount: skipCount,
    maxResultCount: unref(pageSize)
  }
  const res: PagedResultDto<OrganizationTreeDto> =
    await organizationsHttpRequest.getListAsync(input)
  total.value = res.totalCount
  list.value = res.items || []
}
onMounted(async () => {
  await fetchDataApi()

  if (props.modelValue !== null) {
    selectedLabel.value = findLabel(list.value) || ''
  } else {
    selectedLabel.value = ''
  }
})

const clear = () => {
  emits('update:modelValue', null)
  selectedLabel.value = ''
}

const load = async (
  row: OrganizationTreeDto,
  treeNode: unknown,
  resolve: (date: OrganizationTreeDto[]) => void
): Promise<void> => {
  if (!treeNode) return
  const childOrganizationDto: OrganizationTreeDto[] = await organizationsHttpRequest.getTreeAsync(
    row.id
  )
  resolve(childOrganizationDto)
}
</script>

<template>
  <ElPopover v-model:visible="popoverVisible" trigger="click" placement="bottom-start" :width="400">
    <template #reference>
      <ElInput v-model="selectedLabel" clearable @clear="clear" />
    </template>
    <ElTable
      :data="list"
      highlight-current-row
      @row-click="handleRowClick"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :lazy="true"
      :load="load"
      style="width: 100%; cursor: pointer"
    >
      <ElTableColumn prop="code" label="code" />
      <ElTableColumn prop="displayName" label="名称" />
    </ElTable>
    <!-- 分页组件 -->
    <ElPagination
      :current-page="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />
  </ElPopover>
</template>
