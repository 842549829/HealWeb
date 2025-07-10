<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import type { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { ComponentsHttpRequest } from '@/api/organizations/components/index'
import { ActionType, FilterInput, PagedResultDto } from '@/api/common/type'
import { BaseButton } from '@/components/Button'
import { Dialog } from '@/components/Dialog'
import {
  CampusCreateDto,
  CampusListDto,
  CampusUpdateDto
} from '@/api/organizations/components/type'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'

// i18n
const { t } = useI18n()

// 请求api
const componentsHttpRequest = new ComponentsHttpRequest()

// 弹窗显示状态
const dialogVisible = ref<boolean>(false)

// 弹窗标题
const dialogTitle = ref<string>('')

// 当前操作行数据
const currentRow = ref<CampusListDto>()

// 当前操作类型
const actionType = ref<ActionType>('')

// 写入组件引用
const writeRef = ref<ComponentRef<typeof Write>>()

// 保存按钮加载状态
const saveLoading = ref(false)

// 查询条件数据
const searchParams = ref({})

// 删除的ids
const ids = ref<string[]>([])

// 表格列定义
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'dislayName',
    label: t('menu.dislayName'),
    slots: {
      default: (data: any) => {
        const dislayName = data.row.dislayName
        return <>{dislayName}</>
      }
    }
  },
  {
    field: 'name',
    label: t('menu.code'),
    slots: {
      default: (data: any) => {
        const name = data.row.name
        return <>{name}</>
      }
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row as CampusListDto
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

// 查询条件定义
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'filter',
    label: t('userDemo.filter'),
    component: 'Input'
  }
])

// 查询条件数据
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const skipCount = (unref(currentPage) - 1) * unref(pageSize)
    const input: FilterInput = {
      skipCount: skipCount,
      maxResultCount: unref(pageSize),
      ...unref(searchParams)
    }
    const res: PagedResultDto<CampusListDto> = await componentsHttpRequest.getListAsync(input)
    return {
      list: res.items || [],
      total: res.totalCount
    }
  }
})
const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

// 设置查询条件数据
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

// 操作数据
const action = async (row: CampusListDto, type: ActionType) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  dialogVisible.value = true
  currentRow.value = row
}

// 删除数据
const delData = async (row: CampusListDto | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: CampusListDto) => v.id) || []
  loading.value = true
  await delList(unref(ids).length).finally(() => {
    loading.value = false
  })
}

// 添加操作
const addAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

// 保存
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      if (actionType.value === 'edit') {
        await componentsHttpRequest.updateAsync(currentRow.value!.id, formData as CampusUpdateDto)
      } else if (actionType.value === '') {
        await componentsHttpRequest.createAsync(formData as CampusCreateDto)
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }

    getList()
  }
}
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
      :data="dataList"
      :loading="loading"
      :pagination="{
        total: total,
        pageSizes: [10, 20, 30, 40, 50],
        pageSize: pageSize
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />

    <Detail v-if="actionType === 'detail'" :current-row="currentRow" />

    <template #footer>
      <BaseButton
        v-if="actionType !== 'detail'"
        type="primary"
        :loading="saveLoading"
        @click="save"
      >
        {{ t('exampleDemo.save') }}
      </BaseButton>
      <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
    </template>
  </Dialog>
</template>
