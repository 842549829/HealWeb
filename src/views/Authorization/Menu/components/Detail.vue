<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { Icon } from '@/components/Icon'
import { ElTag } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { MultiTenancySides, PermissionType } from '@/api/common/enum'
import { getEnumKeyByValue } from '@/utils/enumUtils'
import { EnumShow } from '@/components/Enums/index'

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

const multiTenancySide = (
  enumObj: Record<string, any>,
  value: any,
  prefix: string | undefined = undefined
) => {
  const key = getEnumKeyByValue(enumObj, value, prefix)
  return <EnumShow value={key} />
}

const permissionType = (
  enumObj: Record<string, any>,
  value: any,
  prefix: string | undefined = undefined
) => {
  const key = getEnumKeyByValue(enumObj, value, prefix)
  return <EnumShow value={key} />
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
        return multiTenancySide(MultiTenancySides, data.tag, 'menu.multiTenancySides')
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
        return permissionType(PermissionType, data.tag, 'menu.types')
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
