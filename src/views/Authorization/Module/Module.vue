<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import type { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import { Table, TableColumn } from '@/components/Table'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { useTable } from '@/hooks/web/useTable'
import { ModuleHttpRequest } from '@/api/module/index'
import { ActionType, FilterInput, PagedResultDto } from '@/api/common/type'
import { BaseButton } from '@/components/Button'
import { Dialog } from '@/components/Dialog'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { ModuleCreateDto, ModuleListDto, ModuleUpdateDto, ModuleDto } from '@/api/module/type'

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
    const res: PagedResultDto<ModuleListDto> = await moduleHttpRequest.getListAsync(input)
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
        const row = data.row as ModuleListDto
        return (
          <>
            <BaseButton type="primary" onClick={() => action(row, 'edit')}>
              {t('exampleDemo.edit')}
            </BaseButton>
            <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton>
            {/* <BaseButton type="danger" onClick={() => deleteAction(row.id)}>
              {t('exampleDemo.del')}
            </BaseButton> */}
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

// 弹窗操作
const action = async (row: ModuleListDto, type: ActionType) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  dialogVisible.value = true
  currentRow.value = await moduleHttpRequest.getAsync(row.id)
}

// 弹窗新增
const addAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

// // 弹窗删除
// const deleteAction = async (id: string) => {
//   try {
//     await moduleHttpRequest.deleteAsync(id)
//     getList()
//   } catch (error) {
//     console.log(error)
//   }
// }

// 弹窗当前选中的行
const currentRow = ref<ModuleDto>()

// 弹窗操作类型
const actionType = ref<ActionType>('')

// 弹窗组件ref
const writeRef = ref<ComponentRef<typeof Write>>()

// 弹窗状态
const dialogVisible = ref(false)

// 弹窗标题
const dialogTitle = ref('')

// 弹窗保存loading
const saveLoading = ref(false)

// 弹窗保存
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  console.log(formData)
  if (formData) {
    saveLoading.value = true
    try {
      if (actionType.value === 'edit') {
        await moduleHttpRequest.updateAsync(currentRow.value!.id, formData as ModuleUpdateDto)
      } else {
        await moduleHttpRequest.createAsync(formData as ModuleCreateDto)
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
  <div class="w-100% h-100%">
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
  </div>
</template>
