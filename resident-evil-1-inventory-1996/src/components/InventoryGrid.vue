<script setup lang="ts">
import { computed } from 'vue'
import type { ItemView } from '../types/item-view'

// `size` is the number of cells. Items fill the first cells; the rest are empty.
const {
  size,
  slots = [],
  cursorSlot = 0,
  locked = false,
  targetSlot = null,
} = defineProps<{ size: number; slots?: ItemView[]; cursorSlot?: number; locked?: boolean; targetSlot?: number | null }>()

const emit = defineEmits<{ hover: [slot: number]; select: [slot: number] }>()

// Always render every cell; cells beyond the given slots are empty.
const cells = computed(() => Array.from({ length: size }, (_, index) => slots[index] ?? null))

function cellLabel(slot: ItemView | null, index: number): string {
  if (!slot) return `Slot ${index + 1}: empty`
  const amount = slot.amount === undefined ? '' : `, ${slot.amount}`
  return `Slot ${index + 1}: ${slot.name}${amount}`
}
</script>

<template>
  <section class="inventory-grid" aria-label="Inventory panel">
    <ol class="inventory-grid__cells" aria-label="Inventory slots">
      <li
        v-for="(slot, index) in cells"
        :key="index"
        class="inventory-grid__cell"
        :aria-label="cellLabel(slot, index)"
        @mousemove="emit('hover', index)"
        @click="emit('select', index)"
      >
        <template v-if="slot">
          <img class="inventory-grid__sprite" :src="slot.sprite" alt="" />
          <span
            v-if="slot.amount !== undefined"
            class="inventory-grid__amount"
            :class="{ 'inventory-grid__amount--weapon': slot.type === 'weapon' }"
            aria-hidden="true"
          >{{ slot.amount }}</span>
        </template>
        <span
          v-if="index === cursorSlot"
          class="inventory-grid__selection"
          :class="{ 'inventory-grid__selection--locked': locked }"
          aria-hidden="true"
        ></span>
        <template v-if="index === targetSlot">
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

.inventory-grid__amount {
  position: absolute;
  /* The digits fill rows 20–26 of the slot; stacks end at column 35. */
  top: calc(17 * var(--game-pixel));
  right: calc(3.5 * var(--game-pixel));
  color: #29a229;
  font-family: 'VT323', monospace;
  /* 7 game pixels tall; widened to the game's 5-pixel digits and 7-pixel spacing. */
  font-size: calc(12.5 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  transform: scaleX(1.4);
  transform-origin: right;
  /* The horizontal offset is divided by the scale so the shadow stays one pixel wide. */
  text-shadow: calc(var(--game-pixel) / 1.4) var(--game-pixel) #065909;
  pointer-events: none;
}

/* A weapon's loaded rounds start at column 6 instead. */
.inventory-grid__amount--weapon {
  right: auto;
  left: calc(4.5 * var(--game-pixel));
  transform-origin: left;
}

/* item-selection-frame.png holds the bright frame above the dark one. */
.inventory-grid__selection {
  position: absolute;
  inset: 0;
  background: url('../assets/ui/item-selection-frame.png') 0 0 / 100% 200%;
  animation: inventory-selection-blink 1s steps(1, end) infinite;
  pointer-events: none;
}

/* An item is selected: the frame stops blinking and stays dark. */
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
