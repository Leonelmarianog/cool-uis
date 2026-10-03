<script setup lang="ts">
import { ItemType } from '../types/item';
import type { ItemView } from '../types/item-view';
import { roundsColorStyle } from './rounds-colors';

/** The item whose amount shows: loaded rounds for a weapon, stack size for ammunition. */
const { item } = defineProps<{ item: ItemView }>();
</script>

<template>
  <span
    v-if="item.amount !== undefined"
    class="item-amount"
    :class="{ 'item-amount--weapon': item.type === ItemType.Weapon }"
    :style="roundsColorStyle(item.amountColor)"
    aria-hidden="true"
    >{{ item.amount }}{{ item.amountSuffix }}</span
  >
</template>

<style scoped>
/* Placed in a 40 × 30 item cell, such as a grid slot or the item box square. */
.item-amount {
  position: absolute;
  /* The digits fill rows 20–26 of the slot; stacks end at column 35. */
  top: calc(17 * var(--game-pixel));
  right: calc(3.5 * var(--game-pixel));
  color: var(--rounds-color);
  font-family: 'VT323', monospace;
  /* 7 game pixels tall; widened to the game's 5-pixel digits and 7-pixel spacing. */
  font-size: calc(12.5 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  transform: scaleX(1.4);
  transform-origin: right;
  /* The horizontal offset is divided by the scale so the shadow stays one pixel wide. */
  text-shadow: calc(var(--game-pixel) / 1.4) var(--game-pixel) var(--rounds-shadow);
  pointer-events: none;
}

/* A weapon's loaded rounds start at column 6 instead. */
.item-amount--weapon {
  right: auto;
  left: calc(4.5 * var(--game-pixel));
  transform-origin: left;
}
</style>
