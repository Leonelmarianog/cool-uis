<script setup lang="ts">
import panel from '../assets/ui/menu-panel.png'

defineEmits<{ map: []; file: []; exit: [] }>()
</script>

<template>
  <nav class="menu-panel" aria-label="Inventory menu">
    <img class="menu-panel__artwork" :src="panel" alt="" />
    <div class="menu-panel__grid">
      <button class="menu-panel__button" type="button" @click="$emit('map')">
        <span class="menu-panel__label">MAP</span>
      </button>
      <button class="menu-panel__button" type="button" @click="$emit('file')">
        <span class="menu-panel__label">FILE</span>
      </button>
      <!-- Does nothing yet; it will open the item box. -->
      <button class="menu-panel__button" type="button" aria-label="Empty">
        <span class="menu-panel__dash"></span>
      </button>
      <button class="menu-panel__button" type="button" @click="$emit('exit')">
        <span class="menu-panel__label">EXIT</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.menu-panel {
  position: relative;
  width: calc(104 * var(--game-pixel));
  height: calc(40 * var(--game-pixel));
}

.menu-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* Fills the artwork's transparent button openings. */
.menu-panel__grid {
  position: absolute;
  top: calc(4 * var(--game-pixel));
  left: calc(4 * var(--game-pixel));
  display: grid;
  grid-template-columns: repeat(2, calc(48 * var(--game-pixel)));
  grid-template-rows: repeat(2, calc(16 * var(--game-pixel)));
}

/* menu-button.png holds the normal state above the hover state. */
.menu-panel__button {
  position: relative;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  color: #000;
  background: url('../assets/ui/menu-button.png') 0 0 / 100% 200%;
  image-rendering: pixelated;
  cursor: pointer;
}

.menu-panel__label {
  position: absolute;
  /* Capitals (0.63em tall, their top 0.11em below the line's top) fill rows 2–13. */
  top: calc(2 * var(--game-pixel) - 0.11em);
  right: 0;
  left: 0;
  font-family: 'Teko', 'Arial Narrow', sans-serif;
  font-size: calc(19 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  text-align: center;
  /* Widen the condensed letters to the game's 2-pixel strokes and word widths. */
  transform: scaleX(1.22);
}

.menu-panel__dash {
  width: calc(24 * var(--game-pixel));
  height: calc(4 * var(--game-pixel));
  background: currentColor;
}

@media (hover: hover) {
  .menu-panel__button:hover {
    color: #c5242c;
    background-position: 0 100%;
  }
}

.menu-panel__button:focus-visible {
  z-index: 1;
  outline-offset: calc(-1 * var(--game-pixel));
}
</style>
