<script setup lang="ts">
import panel from '../assets/ui/equipped-weapon-panel.png'
import SpriteFrame from './SpriteFrame.vue'
import type { ItemView } from '../types/item-view'

// null leaves the screen empty.
const { weapon = null } = defineProps<{ weapon?: ItemView | null }>()
</script>

<template>
  <section class="equipped-weapon-panel" aria-label="Equipped weapon panel">
    <img class="equipped-weapon-panel__artwork" :src="panel" alt="" />
    <div class="equipped-weapon-panel__screen">
      <template v-if="weapon">
        <SpriteFrame class="equipped-weapon-panel__gun" :sprite="weapon.sprite" :label="weapon.name" />
        <span class="equipped-weapon-panel__ammo" :aria-label="`${weapon.amount} rounds`">{{ weapon.amount }}</span>
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
}

.equipped-weapon-panel__ammo {
  position: absolute;
  left: calc(4.5 * var(--ui-pixel));
  bottom: calc(2.25 * var(--ui-pixel));
  color: #009900;
  font-family: 'VT323', monospace;
  font-size: calc(14 * var(--ui-pixel));
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--ui-pixel);
  /* Match the reference's wider digits without increasing their height. */
  transform: scaleX(1.4);
  transform-origin: left bottom;
  /* The horizontal scale also stretches this right-only shadow. */
  text-shadow: var(--ui-pixel) 0 0 #003800;
}
</style>
