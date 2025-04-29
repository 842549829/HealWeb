<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import type { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { ModuleHttpRequest } from '@/api/module/index'
import { FilterInput } from '@/api/common/type'
import { BaseButton } from '@/components/Button'

// 获取当前语言
const { t } = useI18n()

// 创建 ModuleHttpRequest 实例
const moduleHttpRequest = new ModuleHttpRequest()

// 注册表格
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const skipCount = (unref(currentPage) - 1) * unref(pageSize)
    const input: FilterInput = {
      skipCount: skipCount,
      maxResultCount: unref(pageSize),
      ...unref(searchParams)
    }
    const res = await moduleHttpRequest.getListAsync(input)
    return {
      list: res.items || [],
      total: res.totalCount
    }
  }
})

// 解构表格数据
const { dataList, loading, total, currentPage, pageSize } = tableState
// 设置默认页大小
pageSize.value = 3
const { getList } = tableMethods

// 定义表格的列
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: t('module.name'),
    slots: {
      default: (data: any) => {
        const name = data.row.name
        return <>{name}</>
      }
    }
  },
  {
    field: 'dislayName',
    label: t('module.dislayName'),
    slots: {
      default: (data: any) => {
        const dislayName = data.row.dislayName
        return <>{dislayName}</>
      }
    }
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
            <BaseButton type="danger">{t('exampleDemo.del')}</BaseButton>
          </>
        )
      }
    }
  }
])

// 定义查询条件
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'filter',
    label: t('userDemo.filter'),
    component: 'Input'
  }
])

// 查询条件ref对象
const searchParams = ref({})

// 设置查询条件
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

// 操作
const action = (row: any, type: string) => {
  console.log(row, type)
}

// 新增
const addAction = () => {}
</script>
<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="addAction">{{ t('exampleDemo.add') }}</BaseButton>
    </div>
    <Table
      v-model:pageSize="pageSize"
      v-model:currentPage="currentPage"
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        pageSizes: [1, 3, 5],
        pageSize: pageSize
      }"
      @register="tableRegister"
    />
  </ContentWrap>
</template>
