<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { MenuHttpRequest } from '@/api/menu'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import type { ActionType, FilterInput, PagedResultDto } from '@/api/common/type'
import type { MenuCreateDto, MenuDto, MenuListDto, MenuUpdateDto } from '@/api/menu/type'

// i18n
const { t } = useI18n()

// menuHttpRequest
const menuHttpRequest = new MenuHttpRequest()

// 删除的ids
const ids = ref<string[]>([])

// useTable
const { tableRegister, tableState, tableMethods } = useTable({
  // 获取数据
  fetchDataApi: async () => {
    const skipCount = (unref(currentPage) - 1) * unref(pageSize)
    const input: FilterInput = {
      skipCount: skipCount,
      maxResultCount: unref(pageSize),
      ...unref(searchParams)
    }
    const res: PagedResultDto<MenuListDto> = await menuHttpRequest.getListAsync(input)
    return {
      list: res.items || [],
      total: res.totalCount
    }
  },
  // 删除
  fetchDelApi: async () => {
    const idList = unref(ids)
    if (idList.length === 1) {
      await menuHttpRequest.deleteAsync(idList[0])
      return true
    }

    await menuHttpRequest.deleteBatchAsync(idList)
    return true
  }
})

const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

// 表格列定义
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
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
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row as MenuListDto
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
const searchParams = ref({})

// 设置查询条件数据
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('')

const currentRow = ref<MenuDto>()
const actionType = ref<ActionType>('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = async (row: MenuListDto, type: ActionType) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  dialogVisible.value = true
  currentRow.value = await menuHttpRequest.getAsync(row.id)
}

const delData = async (row: MenuListDto | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row ? [row.id] : elTableExpose?.getSelectionRows().map((v: MenuListDto) => v.id) || []
  loading.value = true
  await delList(unref(ids).length).finally(() => {
    loading.value = false
  })
}

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
        await menuHttpRequest.updateAsync(currentRow.value!.id, formData as MenuUpdateDto)
      } else if (actionType.value === '') {
        await menuHttpRequest.createAsync(formData as MenuCreateDto)
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
