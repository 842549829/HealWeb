<script setup lang="ts">
import { onMounted, PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'

defineProps({
  id: {
    type: String as PropType<string>,
    required: true
  },
  detailSchema: {
    type: Array as PropType<DescriptionsSchema[]>,
    default: () => []
  }
})
const currentRow = ref()

onMounted(() => {})
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
