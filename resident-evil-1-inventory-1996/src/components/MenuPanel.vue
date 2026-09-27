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
  --menu-ink: #050704;
  --menu-label-shadow: #424340;

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
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 0;
  color: var(--menu-ink);
  background: url('../assets/ui/menu-button.png') 0 0 / 100% 200%;
  image-rendering: pixelated;
  cursor: pointer;
}

.menu-panel__label {
  display: block;
  font-family: 'Teko', 'Arial Narrow', sans-serif;
  font-size: calc(20 * var(--ui-pixel));
  font-weight: 400;
  line-height: 0.8;
  letter-spacing: calc(0.25 * var(--ui-pixel));
  transform: translateY(calc(1 * var(--ui-pixel))) scaleX(1.15);
  text-shadow: calc(0.5 * var(--ui-pixel)) 0 var(--menu-label-shadow);
}

.menu-panel__dash {
  width: calc(24 * var(--game-pixel));
  height: calc(4 * var(--game-pixel));
  background: currentColor;
}

@media (hover: hover) {
  .menu-panel__button:hover {
    --menu-label-shadow: #747476;

    color: #c5242c;
    background-position: 0 100%;
  }
}

.menu-panel__button:focus-visible {
  z-index: 1;
  outline-offset: calc(-1 * var(--game-pixel));
}
</style>
