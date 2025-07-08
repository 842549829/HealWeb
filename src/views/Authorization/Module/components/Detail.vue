<script setup lang="tsx">
import { PropType, reactive } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ModuleListDto } from '@/api/module/type'
import { ModuleTag } from '@/api/common/enum'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

// 引入i18n
const { t } = useI18n()

// 定义接收参数
defineProps({
  currentRow: {
    type: Object as PropType<ModuleListDto>,
    default: () => null
  }
})

// 表单数据
const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'name',
    label: t('module.dislayName')
  },
  {
    field: 'displayName',
    label: t('module.name')
  },
  {
    field: 'tag',
    label: t('module.tag'),
    slots: {
      default: (data) => {
        const tag = data.tag
        if (tag == ModuleTag.Normal) {
          return <>{t('module.tags.normal')}</>
        }
        if (tag == ModuleTag.NormalSystem) {
          return <>{t('module.tags.normalSystem')}</>
        }
        if (tag == ModuleTag.System) {
          return <>{t('module.tags.system')}</>
        }
        if (tag == ModuleTag.ThirdParty) {
          return <>{t('module.tags.thirdParty')}</>
        }
        return null
      }
    }
  },
  {
    field: 'path',
    label: t('module.path')
  },
  {
    field: 'component',
    label: t('module.component')
  },
  {
    field: 'redirect',
    label: t('module.redirect')
  },
  {
    field: 'alias',
    label: t('module.alias')
  },
  {
    field: 'icon',
    label: t('module.icon'),
    slots: {
      default: (data) => {
        const icon = data.icon
        if (icon) {
          return (
            <>
              <Icon icon={icon} />
            </>
          )
        } else {
          return null
        }
      }
    }
  },
  {
    field: 'activeMenu',
    label: t('module.activeMenu'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'hidden',
    label: t('module.hidden'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'alwaysShow',
    label: t('module.alwaysShow'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'noCache',
    label: t('module.noCache'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'breadcrumb',
    label: t('module.breadcrumb'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'affix',
    label: t('module.affix'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'noTagsView',
    label: t('module.noTagsView'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  },
  {
    field: 'canTo',
    label: t('module.canTo'),
    slots: {
      default: (data) => {
        return renderTag(data.enablePinnedTab)
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
