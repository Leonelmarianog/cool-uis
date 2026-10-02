<script setup lang="ts">
import { computed } from 'vue';
import ItemAmount from './ItemAmount.vue';
import { ITEM_BOX_SIZE } from '../stores/player';
import type { ItemView } from '../types/item-view';

const {
  rows,
  rowIndex,
  active = false,
} = defineProps<{
  /** The three visible rows: above the band, the band row, below the band. `null` is an empty row. */
  rows: (ItemView | null)[];
  /** The band row, from 0 to ITEM_BOX_SIZE - 1. */
  rowIndex: number;
  /** The list takes input and is bright; otherwise it is dimmed. */
  active?: boolean;
}>();

/** The visible row in the band. */
const BAND_POSITION = 1;
/** What an empty row reads. */
const EMPTY_ROW_TEXT = '-Nothing-';

/** The box row number (from 1) of each visible row; the list is a loop. */
const rowNumbers = computed(() =>
  rows.map((_, position) => ((rowIndex + position - BAND_POSITION + ITEM_BOX_SIZE) % ITEM_BOX_SIZE) + 1),
);
/** The band row's item, shown in the square. */
const bandItem = computed(() => rows[BAND_POSITION] ?? null);
/** How far down its track the slider is, from 0 to 1. */
const sliderPosition = computed(() => rowIndex / (ITEM_BOX_SIZE - 1));

/** The row's accessible name, such as "Row 5: SHOTGUN, 5" or "Row 6: empty". */
function rowLabel(item: ItemView | null, number: number): string {
  if (!item) return `Row ${number}: empty`;
  const amount = item.amount === undefined ? '' : `, ${item.amount}${item.amountSuffix ?? ''}`;
  return `Row ${number}: ${item.name}${amount}`;
}
</script>

<template>
  <div class="item-box-list" :class="{ 'item-box-list--active': active }" role="list" aria-label="Item box">
    <div
      v-for="(item, position) in rows"
      :key="rowNumbers[position]"
      class="item-box-list__row"
      :class="{
        'item-box-list__row--band': position === BAND_POSITION,
        'item-box-list__row--first': rowNumbers[position] === 1,
      }"
      role="listitem"
      :aria-label="rowLabel(item, rowNumbers[position])"
      :aria-current="position === BAND_POSITION ? 'true' : undefined"
    >
      <span class="item-box-list__name" :class="{ 'item-box-list__name--empty': !item }">{{
        item?.name ?? EMPTY_ROW_TEXT
      }}</span>
    </div>
  </div>
  <div class="item-box-scrollbar" aria-hidden="true">
    <span class="item-box-scrollbar__arrow item-box-scrollbar__arrow--up"></span>
    <span class="item-box-scrollbar__track">
      <span class="item-box-scrollbar__slider" :style="{ '--slider-position': sliderPosition }"></span>
    </span>
    <span class="item-box-scrollbar__arrow item-box-scrollbar__arrow--down"></span>
  </div>
  <div class="item-box-square" :class="{ 'item-box-square--active': active }" aria-hidden="true">
    <template v-if="bandItem">
      <img class="item-box-square__sprite" :src="bandItem.sprite" alt="" />
      <ItemAmount :item="bandItem" />
    </template>
  </div>
</template>

<style scoped>
/* Positions are in the preview panel's display. item-box.gif draws the panel
   taller than this layout, so each part is measured as a share of the
   display's inner edges in the GIF and scaled to this display. */
.item-box-list {
  position: absolute;
  top: calc(13 * var(--game-pixel));
  left: calc(10 * var(--game-pixel));
  display: grid;
  /* Names are narrowed by a transform, which layout ignores; without the cap a
     long name would widen the column, and the band, past the list. */
  grid-template-columns: minmax(0, 1fr);
  grid-auto-rows: calc(15 * var(--game-pixel));
  width: calc(129 * var(--game-pixel));
  height: calc(48 * var(--game-pixel));
  padding-block: var(--game-pixel);
  border: var(--game-pixel) solid #2ed110;
  color: #4a4740;
  background: #000008;
  font-family: 'Courier Prime', monospace;
  font-size: calc(17.24 * var(--game-pixel));
  line-height: calc(15 * var(--game-pixel));
}

.item-box-list--active {
  color: #c1beb2;
  background: #00003a;
}

.item-box-list__row {
  padding-left: var(--game-pixel);
  white-space: pre;
}

/* The description panel's letters: each character narrowed to the game's 8-pixel cell. */
.item-box-list__name {
  display: inline-block;
  transform: scaleX(0.774);
  transform-origin: left;
}

/* -Nothing- is about 65% as bright as an item name, in both states (item-box.gif). */
.item-box-list__name--empty {
  color: #302e2a;
}

.item-box-list--active .item-box-list__name--empty {
  color: #7d7b74;
}

/* Bright letters get one game pixel of outline outside the letter face; dimmed ones have none. */
.item-box-list--active .item-box-list__name {
  -webkit-text-stroke: calc(2 * var(--game-pixel)) #303048;
  paint-order: stroke fill;
}

.item-box-list__row--band {
  background: #010039;
}

.item-box-list--active .item-box-list__row--band {
  background: linear-gradient(#062055, #0c2968 50%, #062055);
}

/* The yellow line marks where the loop starts again: it is always the top of row 1. */
.item-box-list__row--first {
  border-top: var(--game-pixel) solid #7d6c1b;
}

.item-box-scrollbar {
  position: absolute;
  top: calc(5 * var(--game-pixel));
  left: calc(145 * var(--game-pixel));
  display: grid;
  grid-template-rows: calc(5 * var(--game-pixel)) 1fr calc(5 * var(--game-pixel));
  gap: var(--game-pixel);
  width: calc(8 * var(--game-pixel));
  height: calc(64 * var(--game-pixel));
}

.item-box-scrollbar__arrow {
  background: #e3d714;
}

.item-box-scrollbar__arrow--up {
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}

.item-box-scrollbar__arrow--down {
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.item-box-scrollbar__track {
  position: relative;
  border: var(--game-pixel) solid #2ed110;
  background: #011150;
}

/* The slider moves from the track's top to its bottom as the band goes from row 1 to the last row. */
.item-box-scrollbar__slider {
  position: absolute;
  top: calc(var(--slider-position) * (100% - 3 * var(--game-pixel)));
  right: 0;
  left: 0;
  height: calc(3 * var(--game-pixel));
  background: #e3d714;
}

.item-box-square {
  position: absolute;
  top: calc(68 * var(--game-pixel));
  left: calc(60 * var(--game-pixel));
  display: grid;
  place-items: center;
  width: calc(42 * var(--game-pixel));
  height: calc(32 * var(--game-pixel));
  overflow: hidden;
  border: var(--game-pixel) solid #269ed9;
  background: #000022;
}

.item-box-square--active {
  background: #07004f;
}

/* Item images are one 40 × 30 slot in size. */
.item-box-square__sprite {
  width: calc(40 * var(--game-pixel));
  height: calc(30 * var(--game-pixel));
  image-rendering: pixelated;
}
</style>
