<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { MultiTenancySides, PermissionType } from '@/api/common/type'

const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'permissionName',
    label: t('menu.code')
  },
  {
    field: 'groupName',
    label: t('menu.groupName')
  },
  {
    field: 'displayName',
    label: t('menu.menuName')
  },
  {
    field: 'parentName',
    label: t('menu.parentName')
  },
  {
    field: 'tag',
    label: t('menu.tag')
  },
  {
    field: 'path',
    label: t('menu.path')
  },
  {
    field: 'name',
    label: t('menu.name')
  },
  {
    field: 'component',
    label: t('menu.component')
  },
  {
    field: 'redirect',
    label: t('menu.redirect')
  },
  {
    field: 'alias',
    label: t('menu.alias')
  },
  {
    field: 'title',
    label: t('menu.title')
  },
  {
    field: 'icon',
    label: t('menu.icon'),
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
    label: t('menu.activeMenu')
  },
  {
    field: 'multiTenancySide',
    label: t('menu.multiTenancySide'),
    slots: {
      default: (data) => {
        const multiTenancySide = data.tag
        if (multiTenancySide == MultiTenancySides.Both) {
          return <>{t('menu.multiTenancySides.both')}</>
        }
        if (multiTenancySide == MultiTenancySides.Host) {
          return <>{t('menu.multiTenancySides.host')}</>
        }
        if (multiTenancySide == MultiTenancySides.Tenant) {
          return <>{t('menu.multiTenancySides.tenant')}</>
        }
        return null
      }
    }
  },
  {
    field: 'providers',
    label: t('menu.providers')
  },
  {
    field: 'stateCheckers',
    label: t('menu.stateCheckers')
  },
  {
    field: 'type',
    label: t('menu.type'),
    slots: {
      default: (data) => {
        const permissionType = data.tag
        if (permissionType == PermissionType.Module) {
          return <>{t('menu.types.module')}</>
        }
        if (permissionType == PermissionType.Button) {
          return <>{t('menu.types.button')}</>
        }
        if (permissionType == PermissionType.Menu) {
          return <>{t('menu.types.menu')}</>
        }
        return null
      }
    }
  },
  {
    field: 'isEnabled',
    label: t('menu.isEnabled')
  },
  {
    field: 'hidden',
    label: t('menu.hidden'),
    slots: {
      default: (data) => {
        return renderTag(data.hidden)
      }
    }
  },
  {
    field: 'alwaysShow',
    label: t('menu.alwaysShow'),
    slots: {
      default: (data) => {
        return renderTag(data.alwaysShow)
      }
    }
  },
  {
    field: 'noCache',
    label: t('menu.noCache'),
    slots: {
      default: (data) => {
        return renderTag(data.noCache)
      }
    }
  },
  {
    field: 'breadcrumb',
    label: t('menu.breadcrumb'),
    slots: {
      default: (data) => {
        return renderTag(data.breadcrumb)
      }
    }
  },
  {
    field: 'affix',
    label: t('menu.affix'),
    slots: {
      default: (data) => {
        return renderTag(data.affix)
      }
    }
  },
  {
    field: 'noTagsView',
    label: t('menu.noTagsView'),
    slots: {
      default: (data) => {
        return renderTag(data.noTagsView)
      }
    }
  },
  {
    field: 'canTo',
    label: t('menu.canTo'),
    slots: {
      default: (data) => {
        return renderTag(data.canTo)
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
