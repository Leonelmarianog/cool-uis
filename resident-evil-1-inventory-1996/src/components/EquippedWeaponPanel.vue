<script setup lang="ts">
import panel from '../assets/ui/equipped-weapon-panel.png';
import type { ItemView } from '../types/item-view';
import { roundsPalette } from './rounds-colors';

// null leaves the screen empty.
const { weapon = null } = defineProps<{ weapon?: ItemView | null }>();
</script>

<template>
  <section class="equipped-weapon-panel" aria-label="Equipped weapon panel">
    <img class="equipped-weapon-panel__artwork" :src="panel" alt="" />
    <div class="equipped-weapon-panel__screen">
      <template v-if="weapon">
        <img class="equipped-weapon-panel__gun" :src="weapon.sprite" :alt="weapon.name" />
        <span
          v-if="weapon.amount !== undefined"
          class="equipped-weapon-panel__ammo"
          :style="{ fontPalette: roundsPalette(weapon.amountColor) }"
          :aria-label="weapon.fuel ? `${weapon.amount} fuel` : `${weapon.amount} rounds`"
          >{{ weapon.amount }}</span
        >
      </template>
    </div>
  </section>
</template>

<style scoped>
/* The artwork includes the connector, which overlaps the inventory's left edge. */
.equipped-weapon-panel {
  position: relative;
  width: calc(68 * var(--game-pixel));
  height: calc(38 * var(--game-pixel));
}

.equipped-weapon-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* Fills the artwork's transparent screen opening. */
.equipped-weapon-panel__screen {
  position: absolute;
  top: calc(4 * var(--game-pixel));
  left: calc(12 * var(--game-pixel));
  width: calc(40 * var(--game-pixel));
  height: calc(30 * var(--game-pixel));
  overflow: hidden;
  background: url('../assets/ui/item-slot.png') 0 0 / 100% 100%;
  image-rendering: pixelated;
}

.equipped-weapon-panel__gun {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.equipped-weapon-panel__ammo {
  position: absolute;
  /* Same digits as the inventory's weapon amounts: rows 20–26, from column 6. */
  top: calc(20 * var(--game-pixel));
  left: calc(6 * var(--game-pixel));
  font-family: 're1-digits';
  font-size: calc(8 * var(--game-pixel));
  line-height: 1;
}
</style>
