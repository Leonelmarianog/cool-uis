<script setup lang="ts">
import { computed } from 'vue';
import ItemAmount from './ItemAmount.vue';
import type { ItemView } from '../types/item-view';

const {
  size,
  items = [],
  cursorIndex = null,
  locked = false,
  targetIndex = null,
} = defineProps<{
  /** The number of slots. */
  size: number;
  /** The items in slot order; the slots after the last item are empty. */
  items?: ItemView[];
  /** The main cursor's slot, or `null` while the main cursor is in another area. */
  cursorIndex?: number | null;
  /** The main cursor stops blinking and stays dark while an item is selected or the box list takes input. */
  locked?: boolean;
  /** The target cursor's slot, or `null` while it is hidden. */
  targetIndex?: number | null;
}>();

/** Every slot, with its item or `null` when it is empty. */
const cells = computed(() => Array.from({ length: size }, (_, index) => items[index] ?? null));

/** The slot's accessible name, such as "Slot 1: BERETTA, 15" or "Slot 2: empty". */
function cellLabel(item: ItemView | null, index: number): string {
  if (!item) return `Slot ${index + 1}: empty`;
  const amount = item.amount === undefined ? '' : `, ${item.amount}`;
  return `Slot ${index + 1}: ${item.name}${amount}`;
}
</script>

<template>
  <section class="inventory-grid" aria-label="Inventory panel">
    <ol class="inventory-grid__cells" aria-label="Inventory slots">
      <li v-for="(item, index) in cells" :key="index" class="inventory-grid__cell" :aria-label="cellLabel(item, index)">
        <template v-if="item">
          <img class="inventory-grid__sprite" :src="item.sprite" alt="" />
          <ItemAmount :item="item" />
        </template>
        <span
          v-if="index === cursorIndex"
          class="inventory-grid__selection"
          :class="{ 'inventory-grid__selection--locked': locked }"
          aria-hidden="true"
        ></span>
        <template v-if="index === targetIndex">
          <span class="inventory-grid__target inventory-grid__target--top" aria-hidden="true"></span>
          <span class="inventory-grid__target inventory-grid__target--bottom" aria-hidden="true"></span>
          <span class="inventory-grid__target inventory-grid__target--left" aria-hidden="true"></span>
          <span class="inventory-grid__target inventory-grid__target--right" aria-hidden="true"></span>
        </template>
      </li>
    </ol>
  </section>
</template>

<style scoped>
/* inventory-grid.png holds the frame's top (8 rows), one middle row and its
   bottom (8 rows); the middle row repeats for however many rows of cells there are. */
.inventory-grid {
  width: calc(104 * var(--game-pixel));
  border: solid;
  border-width: calc(8 * var(--game-pixel)) calc(12 * var(--game-pixel));
  border-image: url('../assets/ui/inventory-grid.png') 8 12;
  image-rendering: pixelated;
}

.inventory-grid__cells {
  display: grid;
  grid-template-columns: repeat(2, calc(40 * var(--game-pixel)));
  grid-auto-rows: calc(30 * var(--game-pixel));
  margin: 0;
  padding: 0;
  list-style: none;
}

.inventory-grid__cell {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: url('../assets/ui/item-slot.png') 0 0 / 100% 100%;
}

/* Item images are one slot in size. */
.inventory-grid__sprite {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* item-selection-frame.png holds the bright frame above the dark one. */
.inventory-grid__selection {
  position: absolute;
  inset: 0;
  background: url('../assets/ui/item-selection-frame.png') 0 0 / 100% 200%;
  animation: inventory-selection-blink 1s steps(1, end) infinite;
  pointer-events: none;
}

/* An item is selected or the box list takes input: the frame stops blinking and stays dark. */
.inventory-grid__selection--locked {
  animation: none;
  background-position: 0 100%;
}

/* COMBN's target cursor: four arrows pointing in at the cell, blinking between
   the bright and dark halves of their images like the selection frame. */
.inventory-grid__target {
  position: absolute;
  width: calc(4 * var(--game-pixel));
  height: calc(4 * var(--game-pixel));
  background: 0 0 / 100% 200% no-repeat;
  image-rendering: pixelated;
  animation: inventory-selection-blink 1s steps(1, end) infinite;
  pointer-events: none;
}

.inventory-grid__target--top {
  top: 0;
  left: calc(18 * var(--game-pixel));
  background-image: url('../assets/ui/target-arrow-down.png');
}

.inventory-grid__target--bottom {
  top: calc(26 * var(--game-pixel));
  left: calc(18 * var(--game-pixel));
  background-image: url('../assets/ui/target-arrow-up.png');
}

.inventory-grid__target--left {
  top: calc(13 * var(--game-pixel));
  left: calc(2 * var(--game-pixel));
  background-image: url('../assets/ui/target-arrow-right.png');
}

.inventory-grid__target--right {
  top: calc(13 * var(--game-pixel));
  left: calc(34 * var(--game-pixel));
  background-image: url('../assets/ui/target-arrow-left.png');
}

@keyframes inventory-selection-blink {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 0 100%;
  }
}
</style>
