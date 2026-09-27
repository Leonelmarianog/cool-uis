<script setup lang="ts">
import { computed } from 'vue'
import SpriteFrame from './SpriteFrame.vue'
import type { ItemView } from '../types/item-view'

// Items fill the first cells; the rest are empty.
const {
  slots = [],
  cursorSlot = 0,
  locked = false,
} = defineProps<{ slots?: ItemView[]; cursorSlot?: number; locked?: boolean }>()

const emit = defineEmits<{ hover: [slot: number]; select: [slot: number] }>()

const cellCount = 8

// Always render every cell; cells beyond the given slots are empty.
const cells = computed(() => Array.from({ length: cellCount }, (_, index) => slots[index] ?? null))

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
          <SpriteFrame :sprite="slot.sprite" />
          <span v-if="slot.amount !== undefined" class="inventory-grid__amount" aria-hidden="true">{{ slot.amount }}</span>
        </template>
        <span
          v-if="index === cursorSlot"
          class="inventory-grid__selection"
          :class="{ 'inventory-grid__selection--locked': locked }"
          aria-hidden="true"
        ></span>
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

.inventory-grid__amount {
  position: absolute;
  right: calc(2 * var(--ui-pixel));
  bottom: calc(1.5 * var(--ui-pixel));
  color: #009900;
  font-family: 'VT323', monospace;
  font-size: calc(12 * var(--ui-pixel));
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--ui-pixel);
  /* Same widened digits as the equipped ammo, anchored to the right edge. */
  transform: scaleX(1.4);
  transform-origin: right bottom;
  text-shadow: var(--ui-pixel) 0 #003800;
  pointer-events: none;
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
