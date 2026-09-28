<script setup lang="ts">
import panel from '../assets/ui/character-portrait-panel.png'
import portrait from '../assets/characters/jill.png'
</script>

<template>
  <section class="character-portrait-panel" aria-label="Character portrait">
    <img class="character-portrait-panel__artwork" :src="panel" alt="" />
    <img
      class="character-portrait-panel__portrait"
      :src="portrait"
      alt="Jill Valentine"
      width="30"
      height="30"
    />
  </section>
</template>

<style scoped>
.character-portrait-panel {
  position: relative;
  width: calc(64 * var(--game-pixel));
  height: calc(40 * var(--game-pixel));
}

.character-portrait-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.character-portrait-panel__portrait {
  position: absolute;
  top: calc(6 * var(--game-pixel));
  left: calc(14 * var(--game-pixel));
  width: calc(30 * var(--game-pixel));
  height: calc(30 * var(--game-pixel));
  image-rendering: pixelated;
}
</style>
