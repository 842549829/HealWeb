<template>
  <canvas id="draw"></canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'

const draw = () => {
  const canvas: HTMLCanvasElement | null = document.getElementById(
    'draw'
  ) as HTMLCanvasElement | null
  if (!canvas) return
  const ctx: CanvasRenderingContext2D | null = canvas.getContext(
    '2d'
  ) as CanvasRenderingContext2D | null
  if (!ctx) return
  ctx.fillStyle = 'green'
  ctx.fillRect(10, 10, 150, 100)
}

onMounted(() => {
  draw()
})
</script>
