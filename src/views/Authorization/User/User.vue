<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
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
import { UserHttpRequest } from '@/api/user/index'
import { ActionType, FilterInput, PagedResultDto } from '@/api/common/type'
import { IdentityUserDto, UserCreateDto, UserUpdateDto } from '@/api/user/type'
import moment from 'moment'

// 多语言配装
const { t } = useI18n()

// 用户管理请求
const userHttpRequest = new UserHttpRequest()

// 删除的ids
const ids = ref<string[]>([])

// useTable
const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const skipCount = (unref(currentPage) - 1) * unref(pageSize)
    const input: FilterInput = {
      skipCount: skipCount,
      maxResultCount: unref(pageSize),
      ...unref(searchParams)
    }
    const res: PagedResultDto<IdentityUserDto> = await userHttpRequest.getListAsync(input)
    return {
      list: res.items || [],
      total: res.totalCount
    }
  },
  // 删除
  fetchDelApi: async () => {
    const idList = unref(ids)
    if (idList.length === 1) {
      await userHttpRequest.deleteAsync(idList[0])
      return true
    }
    return false
  }
})

// 解构表格数据
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
    field: 'userName',
    label: t('userDemo.account')
  },
  {
    field: 'surname',
    label: t('userDemo.surname')
  },
  {
    field: 'name',
    label: t('userDemo.name')
  },
  {
    field: 'email',
    label: t('userDemo.email')
  },
  {
    field: 'creationTime',
    label: t('userDemo.creationTime'),
    slots: {
      default: (data: any) => {
        const row = data.row
        return <>{moment(row.creationTime).format('YYYY-MM-DD HH:mm:ss')}</>
      }
    }
  },
  {
    field: 'phoneNumber',
    label: t('userDemo.phoneNumber')
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

// 搜索表单定义
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'filter',
    label: t('userDemo.filter'),
    component: 'Input'
  }
])

// 搜索表单数据
const searchParams = ref()
// 设置搜索表单数据
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

// 当前选中的行
const currentRow = ref<IdentityUserDto>()
// 当前操作的类型
const actionType = ref<ActionType>('')

// 编辑组件实例
const writeRef = ref<ComponentRef<typeof Write>>()

// 保存loading
const saveLoading = ref(false)
// 操作(编辑/详情)
const action = (row: IdentityUserDto, type: ActionType) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

// 新增操作
const addAction = () => {
  // 设置弹窗标题
  dialogTitle.value = t('exampleDemo.add')
  // 将当前行数据源清空(因为编辑会用到)
  currentRow.value = undefined
  // 显示弹窗
  dialogVisible.value = true
  // 操作类型设置为空表示是新增
  actionType.value = ''
}

// 删除操作
const delData = async (row: IdentityUserDto | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: IdentityUserDto) => v.id) || []
  loading.value = true
  await delList(unref(ids).length).finally(() => {
    loading.value = false
  })
}

// 保存操作
const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  if (formData) {
    saveLoading.value = true
    try {
      if (actionType.value === 'edit') {
        const roleUpdateDto = formData as UserUpdateDto
        await userHttpRequest.updateAsync(currentRow.value!.id, roleUpdateDto)
      } else if (actionType.value === '') {
        const userCreateDto = formData as UserCreateDto
        // 身份标识暂时写0 目前还没有用到
        userCreateDto.extraProperties = {
          Identity: 0
        }
        await userHttpRequest.createAsync(formData as UserCreateDto)
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

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :id="currentRow?.id" />
    <Detail v-else :id="currentRow!.id" />
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
