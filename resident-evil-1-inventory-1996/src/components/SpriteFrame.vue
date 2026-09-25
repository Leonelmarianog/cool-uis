<script setup>
import { computed } from 'vue'

const { sheet, column, row, label } = defineProps({
  sheet: { type: Object, required: true },
  column: { type: Number, required: true },
  row: { type: Number, required: true },
  // Without a label the sprite is decorative and hidden from assistive technology.
  label: { type: String, default: '' },
})

// Sheet geometry is in source pixels; the CSS scales it by --ui-pixel.
const style = computed(() => ({
  '--sprite-url': `url("${sheet.url}")`,
  '--sheet-width': sheet.size.width,
  '--sheet-height': sheet.size.height,
  '--frame-width': sheet.frame.width,
  '--frame-height': sheet.frame.height,
  '--frame-x': column * sheet.cell.width + sheet.frame.x,
  '--frame-y': row * sheet.cell.height + sheet.frame.y,
}))
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
