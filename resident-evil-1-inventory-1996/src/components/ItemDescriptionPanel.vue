<script setup lang="ts">
import panel from '../assets/ui/item-description-panel.png'

const { itemName = '' } = defineProps<{ itemName?: string }>()
</script>

<template>
  <section class="item-description-panel" aria-label="Item description panel">
    <img class="item-description-panel__artwork" :src="panel" alt="" />
    <p class="item-description-panel__name">{{ itemName }}</p>
  </section>
</template>

<style scoped>
.item-description-panel {
  position: relative;
  width: calc(320 * var(--game-pixel));
  height: calc(50 * var(--game-pixel));
}

.item-description-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.item-description-panel__name {
  position: absolute;
  /* Capitals (0.58em tall, their top 0.14em below the line's top) fill rows 187–196. */
  top: calc(5 * var(--game-pixel) - 0.14em);
  left: calc(48 * var(--game-pixel));
  margin: 0;
  color: #c1beb2;
  font-family: 'Courier Prime', monospace;
  font-size: calc(17.24 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  white-space: pre;
  /* Narrow each character to the game's 8-pixel cell. */
  transform: scaleX(0.774);
  transform-origin: left;

  /* A stroke straddles the glyph edge. Paint the fill last to preserve the
     letter face and leave one game pixel of outline visible on the outside. */
  -webkit-text-stroke: calc(2 * var(--game-pixel)) #303048;
  paint-order: stroke fill;
}
</style>
