<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { RoleHttpRequest } from '@/api/role/index'
import { ActionType, FilterInput, PagedResultDto } from '@/api/common/type'
import { IdentityRoleDto, RoleCreateDto, RoleUpdateDto } from '@/api/role/type'
import moment from 'moment'

// 多语言配装
const { t } = useI18n()

// 角色管理请求
const roleHttpRequest = new RoleHttpRequest()

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
    const res: PagedResultDto<IdentityRoleDto> = await roleHttpRequest.getListAsync(input)
    return {
      list: res.items || [],
      total: res.totalCount
    }
  },
  // 删除
  fetchDelApi: async () => {
    const idList = unref(ids)
    if (idList.length === 1) {
      await roleHttpRequest.deleteAsync(idList[0])
      return true
    }
    return false
  }
})

// 解构表格数据
const { dataList, loading, total, currentPage, pageSize } = tableState
const { getList, getElTableExpose, delList } = tableMethods

// 渲染tag
const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

// 表格列定义
const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: t('role.roleName')
  },
  {
    field: 'isDefault',
    label: t('role.isDefault'),
    slots: {
      default: (data: any) => {
        return renderTag(data.row.isDefault)
      }
    }
  },
  {
    field: 'isStatic',
    label: t('role.isStatic'),
    slots: {
      default: (data: any) => {
        return renderTag(data.row.isDefault)
      }
    }
  },
  {
    field: 'isPublic',
    label: t('role.isPublic'),
    slots: {
      default: (data: any) => {
        return renderTag(data.row.isDefault)
      }
    }
  },
  {
    field: 'creationTime',
    label: t('role.creationTime'),
    slots: {
      default: (data: any) => {
        const row = data.row
        return <>{moment(row.creationTime).format('YYYY-MM-DD HH:mm:ss')}</>
      }
    }
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status === 0 ? 'danger' : 'success'}>
              {data.row.status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
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
const currentRow = ref<IdentityRoleDto>()
// 当前操作的类型
const actionType = ref<ActionType>('')

// 编辑组件实例
const writeRef = ref<ComponentRef<typeof Write>>()

// 保存loading
const saveLoading = ref(false)
// 操作(编辑/详情)
const action = (row: IdentityRoleDto, type: ActionType) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

// 新增操作
const AddAction = () => {
  // 设置弹窗标题
  dialogTitle.value = t('exampleDemo.add')
  // 将当前行数据源清空(因为编辑会用到)
  currentRow.value = undefined
  // 显示弹窗
  dialogVisible.value = true
  // 操作类型设置为空表示是新增
  actionType.value = ''
}

const delData = async (row: IdentityRoleDto | null) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: IdentityRoleDto) => v.id) || []
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
        const roleUpdateDto = formData as RoleUpdateDto
        await roleHttpRequest.updateAsync(currentRow.value!.id, roleUpdateDto)
      } else if (actionType.value === '') {
        const roleCreateDto = formData as RoleCreateDto
        // 数据权限暂时先写死全部数据权限
        roleCreateDto.extraProperties = {
          DataPermission: 0
        }
        await roleHttpRequest.createAsync(formData as RoleCreateDto)
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
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
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
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-else :current-row="currentRow" />

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
