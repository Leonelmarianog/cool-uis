<script setup lang="ts">
import ItemActionOverlay from './ItemActionOverlay.vue'

// `highlighted` is the index of the option under the red frame, or null for none.
const { options = [], highlighted = null } = defineProps<{ options?: string[]; highlighted?: number | null }>()
</script>

<template>
  <div class="item-action-menu" role="menu" aria-label="Item actions">
    <button v-for="(option, index) in options" :key="option" class="item-action-menu__option" type="button" role="menuitem">
      <span class="item-action-menu__label">{{ option }}</span>
      <ItemActionOverlay v-if="index === highlighted" />
    </button>
  </div>
</template>

<style scoped>
.item-action-menu {
  --option-edge: #5263ad;
  --option-blue: #08008c;
  --option-navy: #080052;
  --option-text: #e3e3e5;
  --option-text-edge: #7c7b82;

  position: absolute;
  z-index: 1;
  /* Against the display's 4-pixel right edge strip. */
  right: calc(4 * var(--ui-pixel));
  bottom: calc(7 * var(--ui-pixel));
  display: grid;
  /* Twice the 2 pixels the red frame reaches above and below a button,
     so frames on neighboring options would meet exactly. */
  gap: calc(4 * var(--ui-pixel));
}

/* 48 × 20 art pixels, recreated from design/ui-sprites.png. Layers are
   (x, y, width, height) runs; the first layers are drawn on top. Shapes of one
   color overlap instead of only touching, so rounding a fractional --ui-pixel
   can never open a gap between them. Right-side runs are placed from the right. */
.item-action-menu__option {
  --wedge: linear-gradient(var(--option-blue) 0 0);
  --edge: linear-gradient(var(--option-edge) 0 0);

  position: relative;
  display: grid;
  place-items: center;
  width: calc(48 * var(--ui-pixel));
  height: calc(20 * var(--ui-pixel));
  padding: 0;
  border: 0;
  border-radius: 0;
  color: var(--option-text);
  background:
    /* Blue corner pixels, over the outline. */
    var(--wedge) left top / var(--ui-pixel) var(--ui-pixel),
    var(--wedge) right top / var(--ui-pixel) var(--ui-pixel),
    var(--wedge) left bottom / var(--ui-pixel) var(--ui-pixel),
    var(--wedge) right bottom / var(--ui-pixel) var(--ui-pixel),

    /* Light blue outline. */
    var(--edge) left top / 100% var(--ui-pixel),
    var(--edge) left bottom / 100% var(--ui-pixel),
    var(--edge) left top / var(--ui-pixel) 100%,
    var(--edge) right top / var(--ui-pixel) 100%,

    /* Left wedge: a stepped triangle pointing inward. Every step starts at the
       outline, so each wider step covers the narrower ones. */
    var(--wedge) calc(1 * var(--ui-pixel)) calc(1 * var(--ui-pixel)) / calc(2 * var(--ui-pixel)) var(--ui-pixel),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(1 * var(--ui-pixel)) / var(--ui-pixel) calc(18 * var(--ui-pixel)),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(3 * var(--ui-pixel)) / calc(2 * var(--ui-pixel)) calc(14 * var(--ui-pixel)),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(18 * var(--ui-pixel)) / calc(2 * var(--ui-pixel)) var(--ui-pixel),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(4 * var(--ui-pixel)) / calc(3 * var(--ui-pixel)) calc(12 * var(--ui-pixel)),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(5 * var(--ui-pixel)) / calc(4 * var(--ui-pixel)) calc(10 * var(--ui-pixel)),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(6 * var(--ui-pixel)) / calc(5 * var(--ui-pixel)) calc(8 * var(--ui-pixel)),
    var(--wedge) calc(1 * var(--ui-pixel)) calc(7 * var(--ui-pixel)) / calc(6 * var(--ui-pixel)) calc(6 * var(--ui-pixel)),

    /* Right wedge: the mirror image, measured from the right. */
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(1 * var(--ui-pixel)) / calc(2 * var(--ui-pixel)) var(--ui-pixel),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(1 * var(--ui-pixel)) / var(--ui-pixel) calc(18 * var(--ui-pixel)),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(3 * var(--ui-pixel)) / calc(2 * var(--ui-pixel)) calc(14 * var(--ui-pixel)),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(18 * var(--ui-pixel)) / calc(2 * var(--ui-pixel)) var(--ui-pixel),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(4 * var(--ui-pixel)) / calc(3 * var(--ui-pixel)) calc(12 * var(--ui-pixel)),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(5 * var(--ui-pixel)) / calc(4 * var(--ui-pixel)) calc(10 * var(--ui-pixel)),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(6 * var(--ui-pixel)) / calc(5 * var(--ui-pixel)) calc(8 * var(--ui-pixel)),
    var(--wedge) right calc(1 * var(--ui-pixel)) top calc(7 * var(--ui-pixel)) / calc(6 * var(--ui-pixel)) calc(6 * var(--ui-pixel)),

    /* Navy everywhere else. */
    var(--option-navy);
  background-repeat: no-repeat;
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
    calc(0.5 * var(--ui-pixel)) 0 var(--option-text-edge),
    calc(-0.5 * var(--ui-pixel)) 0 var(--option-text-edge);
}
</style>
