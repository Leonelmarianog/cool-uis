<script setup lang="ts">
import panel from '../assets/ui/equipped-weapon-panel.png';
import type { ItemView } from '../types/item-view';

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
          :aria-label="`${weapon.amount} rounds`"
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
  top: calc(17 * var(--game-pixel));
  left: calc(4.5 * var(--game-pixel));
  color: #29a229;
  font-family: 'VT323', monospace;
  font-size: calc(12.5 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  transform: scaleX(1.4);
  transform-origin: left;
  text-shadow: calc(var(--game-pixel) / 1.4) var(--game-pixel) #065909;
}
</style>
