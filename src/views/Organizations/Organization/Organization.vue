<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { ref, unref, reactive } from 'vue'
import { FormSchema } from '@/components/Form'
import { ActionType, PagedResultDto } from '@/api/common/type'
import {
  GetOrganizationsInput,
  OrganizationCreateDto,
  OrganizationDto,
  OrganizationTreeDto,
  OrganizationUpdateDto
} from '@/api/organizations/organization/type'
import { OrganizationsHttpRequest } from '@/api/organizations/organization/index'
import { BaseButton } from '@/components/Button'
import { Dialog } from '@/components/Dialog'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { TreeNode } from 'element-plus'

// 多语言配置
const { t } = useI18n()

// 组织机构管理请求
const organizationsHttpRequest = new OrganizationsHttpRequest()

// 删除的ids
const ids = ref<string[]>([])

// 弹窗属性
const dialogVisible = ref(false)
const dialogTitle = ref('')

// 当前选中的行
const currentRow = ref<OrganizationDto>()

// 当前操作的类型
const actionType = ref<ActionType>('')

// 搜索表单数据
const searchParams = ref()

// 写入组件引用
const writeRef = ref<ComponentRef<typeof Write>>()

// 保存按钮加载状态
const saveLoading = ref(false)

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
    field: 'displayName',
    label: t('organization.displayName')
  },
  {
    field: 'code',
    label: t('organization.code')
  },
  {
    field: 'extraProperties.Phone',
    label: t('organization.phone')
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
            {/* <BaseButton type="success" onClick={() => action(row, 'detail')}>
              {t('exampleDemo.detail')}
            </BaseButton> */}
            <BaseButton type="danger" onClick={() => delData(row)}>
              {t('exampleDemo.del')}
            </BaseButton>
          </>
        )
      }
    }
  }
])

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

// 设置搜索表单数据
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
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
        await organizationsHttpRequest.updateAsync(
          currentRow.value!.id,
          formData as OrganizationUpdateDto
        )
      } else if (actionType.value === '') {
        await organizationsHttpRequest.createAsync(formData as OrganizationCreateDto)
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
// 标记当前已执行load
const hasLoad = ref(false)
const currentLoadTreeData = ref<OrganizationTreeDto>()
const resolveObj = ref<(date: OrganizationTreeDto[]) => void>()
const load = async (
  row: OrganizationTreeDto,
  treeNode: TreeNode,
  resolve: (date: OrganizationTreeDto[]) => void
): Promise<void> => {
  if (!treeNode) return

  hasLoad.value = true
  currentLoadTreeData.value = row
  resolveObj.value = resolve

  const childOrganizationDto: OrganizationTreeDto[] = await organizationsHttpRequest.getTreeAsync(
    row.id
  )
  resolve(childOrganizationDto)
}

// 展开/收起时触发
const handleExpandChange = (_row: OrganizationTreeDto, expanded: boolean) => {
  if (expanded) {
    // 当前是展开状态
    if (hasLoad.value) {
      // 已执行过load，则去掉执行过的标记
      hasLoad.value = false
    } else {
      // 不然，则执行load。因为load只会执行一次，所以需要在expand事件触发再次执行
      load(currentLoadTreeData.value!, {}, resolveObj.value!)
    }
  }
}
</script>
<template>
  <ContentWrap>
    <Search :schema="searchSchema" @search="setSearchParams" @reset="setSearchParams" />
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
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :lazy="true"
      :load="load"
      @expand-change="handleExpandChange"
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
