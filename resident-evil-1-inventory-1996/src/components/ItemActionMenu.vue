<script setup lang="ts">
import frame from '../assets/ui/item-action-frame.png';

const {
  options = [],
  optionIndex = 0,
  inactive = false,
} = defineProps<{
  options?: string[];
  /** The option under the option cursor (the red frame). */
  optionIndex?: number;
  /** Disables the menu while another element has input, such as the target cursor. */
  inactive?: boolean;
}>();

const emit = defineEmits<{ point: [index: number]; choose: [] }>();

/** Clicking an option points at it, then chooses it. */
function onClick(index: number) {
  emit('point', index);
  emit('choose');
}
</script>

<template>
  <div class="item-action-menu" role="menu" aria-label="Item actions">
    <button
      v-for="(option, index) in options"
      :key="option"
      class="item-action-menu__option"
      type="button"
      role="menuitem"
      :disabled="inactive"
      @mouseenter="inactive || emit('point', index)"
      @click="onClick(index)"
    >
      <span class="item-action-menu__label">{{ option }}</span>
      <img v-if="index === optionIndex" class="item-action-menu__frame" :src="frame" alt="" />
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

/* Opening and closing, applied by the <Transition> around the menu in App.vue.
   The game grows the red frame's 43 × 24 area (starting 2 pixels above the
   button) from its top-left corner in 8 steps, one per frame at 60 fps: 1/8
   of its width and 3 pixels of height per step. Each button shows the part
   inside that area. The frame itself appears only once the menu is open. */
@property --step {
  syntax: '<integer>';
  inherits: true;
  initial-value: 0;
}

@keyframes grow {
  from {
    --step: 0;
  }
  to {
    --step: 7;
  }
}

.item-action-menu--opening .item-action-menu__option,
.item-action-menu--closing .item-action-menu__option {
  clip-path: inset(
    0 calc((43 - round(43 * var(--step) / 8)) * var(--game-pixel))
      calc(max(0, 22 - 3 * var(--step)) * var(--game-pixel)) 0
  );
}

/* Steps 1 to 7; step 8 is the open menu without the animation. The menu
   itself is animated, so the <Transition> waits for it before removing it. */
.item-action-menu--opening {
  animation: grow calc(7s / 60) steps(7, jump-start);
}

.item-action-menu--closing {
  animation: grow calc(7s / 60) steps(7, jump-start) reverse;
}

.item-action-menu--opening .item-action-menu__frame,
.item-action-menu--closing .item-action-menu__frame {
  visibility: hidden;
}
</style>
