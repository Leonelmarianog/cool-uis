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
  top: calc(3 * var(--game-pixel));
  left: calc(48 * var(--game-pixel));
  margin: 0;
  color: #c1beb2;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: calc(14 * var(--ui-pixel));
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--ui-pixel);

  /* A stroke straddles the glyph edge. Paint the fill last to preserve the
     letter face and leave one art pixel of outline visible on the outside. */
  -webkit-text-stroke: calc(2 * var(--ui-pixel)) #434356;
  paint-order: stroke fill;
}
</style>
