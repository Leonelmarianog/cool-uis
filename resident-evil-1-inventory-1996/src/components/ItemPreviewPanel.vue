<script setup lang="ts">
import panel from '../assets/ui/item-preview-panel.png'
</script>

<template>
  <section class="item-preview-panel" aria-label="Item preview">
    <img class="item-preview-panel__artwork" :src="panel" alt="" />
    <div class="item-preview-panel__display">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.item-preview-panel {
  position: relative;
  width: calc(192 * var(--game-pixel));
  height: calc(128 * var(--game-pixel));
}

.item-preview-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* The display's frame: from its left line to the end of the ribbed right edge. */
.item-preview-panel__display {
  position: absolute;
  top: calc(8 * var(--game-pixel));
  left: calc(23 * var(--game-pixel));
  width: calc(165 * var(--game-pixel));
  height: calc(112 * var(--game-pixel));
}
</style>
