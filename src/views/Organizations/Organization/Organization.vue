<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import { FormSchema } from '@/components/Form'
import { ActionType, PagedResultDto } from '@/api/common/type'
import { GetOrganizationsInput, OrganizationDto } from '@/api/organizations/organization/type'
import { OrganizationsHttpRequest } from '@/api/organizations/organization/index'
import { BaseButton } from '@/components/Button'

// 多语言配置
const { t } = useI18n()

// 组织机构管理请求
const organizationsHttpRequest = new OrganizationsHttpRequest()

// 删除的ids
const ids = ref<string[]>([])

// useTable
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const skipCount = (unref(currentPage) - 1) * unref(pageSize)
    const input: GetOrganizationsInput = {
      skipCount: skipCount,
      maxResultCount: unref(pageSize),
      ...unref(searchParams)
    }
    const res: PagedResultDto<OrganizationDto> = await organizationsHttpRequest.getListAsync(input)
    return {
      list: res.items || [],
      total: res.totalCount
    }
  },
  // 删除
  fetchDelApi: async () => {
    const idList = unref(ids)
    if (idList.length === 1) {
      await organizationsHttpRequest.deleteAsync(idList[0])
      return true
    }
    return false
  }
})

// 解构表格数据
const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

// 弹窗属性
const dialogVisible = ref(false)
const dialogTitle = ref('')
// 当前选中的行
const currentRow = ref<OrganizationDto>()
// 当前操作的类型
const actionType = ref<ActionType>('')

// 操作(编辑/详情)
const action = (row: OrganizationDto, type: ActionType) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

// 删数据
const delData = async (row: OrganizationDto | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: OrganizationDto) => v.id) || []
  loading.value = true
  await delList(unref(ids).length).finally(() => {
    loading.value = false
  })
}

// 搜索表单数据
const searchParams = ref()

// 设置搜索表单数据
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

// 搜索表单定义
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'filter',
    label: t('userDemo.filter'),
    component: 'Input'
  }
])

// 表格列定义
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])
</script>
<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
