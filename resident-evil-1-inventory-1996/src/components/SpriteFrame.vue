<script setup lang="ts">
import { computed } from 'vue'
import type { SpriteView } from '../types/item-view'

// Without a label the sprite is decorative and hidden from assistive technology.
const { sprite, label = '' } = defineProps<{ sprite: SpriteView; label?: string }>()

// Sheet geometry is in source pixels; the CSS scales it by --ui-pixel.
const style = computed(() => {
  const { sheet, column, row } = sprite
  // Vite bundles every file in src/assets that this pattern can match.
  const url = new URL(`../assets/${sheet.file}`, import.meta.url).href
  return {
    '--sprite-url': `url("${url}")`,
    '--sheet-width': sheet.width,
    '--sheet-height': sheet.height,
    '--frame-width': sheet.frame.width,
    '--frame-height': sheet.frame.height,
    '--frame-x': column * sheet.cellWidth + sheet.frame.x,
    '--frame-y': row * sheet.cellHeight + sheet.frame.y,
  }
})
</script>

<template>
  <span
    class="sprite-frame"
    :style="style"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  ></span>
</template>

<style scoped>
.sprite-frame {
  display: block;
  width: calc(var(--frame-width) * var(--ui-pixel));
  height: calc(var(--frame-height) * var(--ui-pixel));
  background-image: var(--sprite-url);
  background-repeat: no-repeat;
  background-size:
    calc(var(--sheet-width) * var(--ui-pixel))
    calc(var(--sheet-height) * var(--ui-pixel));
  background-position:
    calc(var(--frame-x) * -1 * var(--ui-pixel))
    calc(var(--frame-y) * -1 * var(--ui-pixel));
  image-rendering: pixelated;
}
</style>
