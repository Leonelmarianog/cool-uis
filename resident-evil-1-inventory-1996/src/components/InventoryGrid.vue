<script setup>
import BlueSlotBackground from './BlueSlotBackground.vue'

const cellRows = 34
const cellCount = 8
</script>

<template>
  <section class="inventory-grid" aria-label="Inventory panel">
    <div class="inventory-grid__recess">
      <ol class="inventory-grid__cells" aria-label="Inventory slots">
        <li v-for="cell in cellCount" :key="cell" class="inventory-grid__cell" :aria-label="`Slot ${cell}: empty`">
          <BlueSlotBackground :rows="cellRows" />
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.inventory-grid {
  /* Same three-tone tube palette as the portrait, plus the separating ring. */
  --inventory-tube-dark: #091009;
  --inventory-tube-mid: #39433b;
  --inventory-tube-light: #5a5849;
  --inventory-ring: #192019;
  --inventory-bevel-dark: #050025;
  --inventory-bevel-light: #100078;
  --inventory-frame-width: calc(8 * var(--ui-pixel));
  --inventory-bevel-width: calc(4.5 * var(--ui-pixel));
  --inventory-cell-width: calc(45 * var(--ui-pixel));
  --inventory-cell-height: calc(v-bind(cellRows) * var(--ui-pixel));

  position: relative;
  width: calc(2 * (var(--inventory-cell-width) + var(--inventory-bevel-width) + var(--inventory-frame-width)));
  padding: var(--inventory-frame-width);
  background: var(--inventory-ring);
}

/* Eight one-art-pixel bands, outside to inside: dark, mid, light, mid,
   separator, mid, light, mid. The inner tube has no final dark edge. */
.inventory-grid::before {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
  box-shadow:
    inset 0 0 0 var(--ui-pixel) var(--inventory-tube-dark),
    inset 0 0 0 calc(2 * var(--ui-pixel)) var(--inventory-tube-mid),
    inset 0 0 0 calc(3 * var(--ui-pixel)) var(--inventory-tube-light),
    inset 0 0 0 calc(4 * var(--ui-pixel)) var(--inventory-tube-mid),
    inset 0 0 0 calc(5 * var(--ui-pixel)) var(--inventory-ring),
    inset 0 0 0 calc(6 * var(--ui-pixel)) var(--inventory-tube-mid),
    inset 0 0 0 calc(7 * var(--ui-pixel)) var(--inventory-tube-light),
    inset 0 0 0 var(--inventory-frame-width) var(--inventory-tube-mid);
}

.inventory-grid__recess {
  /* Equal border widths form the diagonal miter at every inner corner. */
  border: var(--inventory-bevel-width) solid;
  border-color: var(--inventory-bevel-dark) var(--inventory-bevel-light)
    var(--inventory-bevel-light) var(--inventory-bevel-dark);
}

.inventory-grid__cells {
  display: grid;
  grid-template-columns: repeat(2, var(--inventory-cell-width));
  grid-auto-rows: var(--inventory-cell-height);
  margin: 0;
  padding: 0;
  list-style: none;
}

.inventory-grid__cell {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
</style>
