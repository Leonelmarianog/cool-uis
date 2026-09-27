<script setup lang="ts">
import frame from '../assets/ui/item-action-frame.png'

// `highlighted` is the index of the option under the red frame, or null for none.
const { options = [], highlighted = null } = defineProps<{ options?: string[]; highlighted?: number | null }>()
</script>

<template>
  <div class="item-action-menu" role="menu" aria-label="Item actions">
    <button v-for="(option, index) in options" :key="option" class="item-action-menu__option" type="button" role="menuitem">
      <span class="item-action-menu__label">{{ option }}</span>
      <img v-if="index === highlighted" class="item-action-menu__frame" :src="frame" alt="" />
    </button>
  </div>
</template>

<style scoped>
.item-action-menu {
  position: absolute;
  z-index: 1;
  /* Against the display's 4-pixel right edge strip, one pixel above its bottom strip. */
  right: calc(4 * var(--game-pixel));
  bottom: calc(5 * var(--game-pixel));
  display: grid;
  /* Twice the 2 pixels the red frame reaches above and below a button,
     so frames on neighboring options would meet exactly. */
  gap: calc(4 * var(--game-pixel));
}

.item-action-menu__option {
  position: relative;
  display: grid;
  place-items: center;
  width: calc(43 * var(--game-pixel));
  height: calc(20 * var(--game-pixel));
  padding: 0;
  border: 0;
  border-radius: 0;
  color: #e3e3e5;
  background: url('../assets/ui/item-action-button.png') 0 0 / 100% 100%;
  image-rendering: pixelated;
  cursor: pointer;
}

.item-action-menu__label {
  position: absolute;
  /* Capitals (0.63em tall, their top 0.11em below the line's top) fill rows 4–16. */
  top: calc(4 * var(--game-pixel) - 0.11em);
  right: 0;
  left: 0;
  font-family: 'Teko', 'Arial Narrow', sans-serif;
  font-size: calc(20.63 * var(--game-pixel));
  font-weight: 300;
  line-height: 1;
  text-align: center;
  /* The widest word (COMBN) matches the game's 34-pixel width. */
  transform: scaleX(0.92);
}

.item-action-menu__frame {
  position: absolute;
  top: calc(-2 * var(--game-pixel));
  left: 0;
  width: 100%;
  height: calc(100% + 4 * var(--game-pixel));
  image-rendering: pixelated;
  pointer-events: none;
}
</style>
