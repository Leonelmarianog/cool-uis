<script setup lang="ts">
import { ItemType } from '../types/item';
import type { ItemView } from '../types/item-view';
import { roundsPalette } from './rounds-colors';

/** The item whose amount shows: loaded rounds for a weapon, stack size for ammunition. */
const { item } = defineProps<{ item: ItemView }>();
</script>

<template>
  <span
    v-if="item.amount !== undefined"
    class="item-amount"
    :class="{ 'item-amount--weapon': item.type === ItemType.Weapon }"
    :style="{ fontPalette: roundsPalette(item.amountColor) }"
    aria-hidden="true"
    >{{ item.amount }}</span
  >
</template>

<style scoped>
/* Placed in a 40 × 30 item cell, such as a grid slot or the item box square. */
.item-amount {
  position: absolute;
  /* The digits' face fills rows 20–26 of the cell; stacks end at column 35. */
  top: calc(20 * var(--game-pixel));
  right: calc(3 * var(--game-pixel));
  font-family: 're1-digits';
  font-size: calc(8 * var(--game-pixel));
  line-height: 1;
  pointer-events: none;
}

/* A weapon's loaded rounds start at column 6 instead. */
.item-amount--weapon {
  right: auto;
  left: calc(6 * var(--game-pixel));
}
</style>
