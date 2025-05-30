<script setup lang="ts">
import { Icon } from '@/components/Icon'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { useRouter } from 'vue-router'

const router = useRouter()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('home-heart')

defineProps({
  color: propTypes.string.def('')
})

const toggleHome = () => {
  router.push('/')
}
</script>

<template>
  <div :class="prefixCls" @click="toggleHome">
    <Icon :size="18" icon="bx:home-heart" :color="color" />
  </div>
</template>
