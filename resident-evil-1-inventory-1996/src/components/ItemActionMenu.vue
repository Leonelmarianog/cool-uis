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
  font-family: 'Teko', 'Arial Narrow', sans-serif;
  font-size: calc(23 * var(--ui-pixel));
  font-weight: 300;
  line-height: 0.8;
  letter-spacing: calc(0.5 * var(--ui-pixel));
  transform: translateY(calc(1.5 * var(--ui-pixel))) scaleX(0.85);
  /* Thin gray edge on both sides of each stroke, as in the game's lettering. */
  text-shadow:
    calc(0.5 * var(--ui-pixel)) 0 #7c7b82,
    calc(-0.5 * var(--ui-pixel)) 0 #7c7b82;
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
