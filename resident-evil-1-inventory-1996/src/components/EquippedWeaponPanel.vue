<script setup lang="ts">
import BlueSlotBackground from './BlueSlotBackground.vue'
import SpriteFrame from './SpriteFrame.vue'
import { itemSpriteSheet } from '../sprites/itemSpriteSheet.js'

// Each background row represents one art pixel of the screen's height.
const screenRows = 35
</script>

<template>
  <section class="equipped-weapon-panel" aria-label="Equipped weapon panel">
    <div class="equipped-weapon-panel__housing">
      <span class="equipped-weapon-panel__corner-shadow equipped-weapon-panel__corner-shadow--top" aria-hidden="true"></span>
      <span class="equipped-weapon-panel__corner-shadow equipped-weapon-panel__corner-shadow--bottom" aria-hidden="true"></span>
      <span class="equipped-weapon-panel__indicator" aria-hidden="true"></span>
      <span class="equipped-weapon-panel__connector-frame" aria-hidden="true"></span>
      <div class="equipped-weapon-panel__screen">
        <BlueSlotBackground :rows="screenRows" />
        <slot>
          <SpriteFrame class="equipped-weapon-panel__gun" :sheet="itemSpriteSheet" :column="1" :row="0" label="Handgun" />
          <span class="equipped-weapon-panel__ammo" aria-label="10 rounds">10</span>
        </slot>
      </div>
    </div>
    <div class="equipped-weapon-panel__connector" aria-hidden="true">
      <span
        v-for="side in ['top', 'bottom']"
        :key="side"
        class="equipped-weapon-panel__tubes"
        :class="`equipped-weapon-panel__tubes--${side}`"
      >
        <span class="equipped-weapon-panel__tube"></span>
        <span class="equipped-weapon-panel__tube"></span>
      </span>
    </div>
  </section>
</template>

<style scoped>
.equipped-weapon-panel {
  /* Housing and screen palette. */
  --weapon-metal: #596163;
  --weapon-nose-light: #848178;
  --weapon-nose-mid: #73787b;
  --weapon-nose-dark: #63686b;
  --weapon-edge: #747476;
  --weapon-cutaway-shadow: #50585a;
  --weapon-shadow: #20251f;
  --weapon-screen: var(--color-slot-blue);
  --weapon-ink: #000;
  --weapon-ammo: #009900;
  --weapon-ammo-shadow: #003800;

  /* Connector palette. */
  --weapon-connector: #4a4a42;
  --weapon-connector-bottom: #323931;
  --weapon-connector-left: #192019;
  --weapon-connector-frame-left: #394038;

  /* Shared geometry keeps the screen, connector, and recess aligned. */
  --housing-width: calc(68 * var(--ui-pixel));
  --nose-width: calc(13 * var(--ui-pixel));
  --screen-rows: v-bind(screenRows);
  --screen-block-inset: calc(4 * var(--ui-pixel));
  --screen-right-inset: calc(8 * var(--ui-pixel));
  --connector-reserved-width: calc(8 * var(--ui-pixel));
  --connector-width: calc(12 * var(--ui-pixel));
  --connector-height: calc(6 * var(--ui-pixel));
  --connector-screen-gap: var(--ui-pixel);
  --connector-right: calc(
    var(--connector-reserved-width) + var(--screen-right-inset) - var(--connector-width)
    - var(--ui-pixel) - var(--connector-screen-gap)
  );

  /* The housing is 68 × 43 art pixels; reserve space for its right mount. */
  position: relative;
  width: calc(var(--housing-width) + var(--connector-reserved-width));
  height: calc(var(--screen-rows) * var(--ui-pixel) + 2 * var(--screen-block-inset));
}

.equipped-weapon-panel__housing {
  position: absolute;
  inset: 0 var(--connector-reserved-width) 0 0;
  background: var(--weapon-metal);
  /* Mirrored square steps form the narrow nose at the left of the housing. */
  clip-path: polygon(
    var(--nose-width) 0, 100% 0,
    100% 100%, var(--nose-width) 100%,
    var(--nose-width) calc(100% - var(--ui-pixel)),
    calc(9 * var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(9 * var(--ui-pixel)) calc(100% - 2 * var(--ui-pixel)),
    calc(5 * var(--ui-pixel)) calc(100% - 2 * var(--ui-pixel)),
    calc(5 * var(--ui-pixel)) calc(100% - 3 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(100% - 3 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(100% - 4 * var(--ui-pixel)),
    0 calc(100% - 4 * var(--ui-pixel)),
    0 calc(4 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(5 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(5 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(9 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(9 * var(--ui-pixel)) var(--ui-pixel),
    var(--nose-width) var(--ui-pixel)
  );
}

/* The reflection ends halfway across the 13-art-pixel left curvature. */
.equipped-weapon-panel__housing::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: calc(var(--nose-width) / 2);
  background: linear-gradient(
    to right,
    var(--weapon-nose-light),
    var(--weapon-nose-mid),
    var(--weapon-nose-dark),
    var(--weapon-metal)
  );
  content: '';
}

/* A single-color, one-art-pixel ribbon follows each cutaway and adjoining edge. */
.equipped-weapon-panel__corner-shadow {
  position: absolute;
  left: 0;
  width: calc(var(--nose-width) + 3 * var(--ui-pixel));
  height: calc(7 * var(--ui-pixel));
  background: var(--weapon-cutaway-shadow);
  pointer-events: none;
  clip-path: polygon(
    100% 0, var(--nose-width) 0,
    var(--nose-width) var(--ui-pixel),
    calc(9 * var(--ui-pixel)) var(--ui-pixel),
    calc(9 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(5 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(5 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    0 calc(4 * var(--ui-pixel)), 0 100%, var(--ui-pixel) 100%,
    var(--ui-pixel) calc(5 * var(--ui-pixel)),
    calc(3 * var(--ui-pixel)) calc(5 * var(--ui-pixel)),
    calc(3 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    calc(6 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    calc(6 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(10 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(10 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(var(--nose-width) + var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(var(--nose-width) + var(--ui-pixel)) var(--ui-pixel), 100% var(--ui-pixel)
  );
}

.equipped-weapon-panel__corner-shadow--top {
  top: 0;
}

.equipped-weapon-panel__corner-shadow--bottom {
  bottom: 0;
  transform: scaleY(-1);
}

.equipped-weapon-panel__indicator {
  position: absolute;
  top: calc(14 * var(--ui-pixel));
  left: calc(5 * var(--ui-pixel));
  width: calc(4 * var(--ui-pixel));
  height: calc(16 * var(--ui-pixel));
}

.equipped-weapon-panel__indicator::before {
  position: absolute;
  inset: 0;
  content: '';
  background: var(--weapon-ink);
  clip-path: polygon(
    0 0, 25% 0, 25% 12.5%, 50% 12.5%,
    50% 25%, 75% 25%, 75% 37.5%, 100% 37.5%,
    100% 62.5%, 75% 62.5%, 75% 75%, 50% 75%,
    50% 87.5%, 25% 87.5%, 25% 100%, 0 100%
  );
}

.equipped-weapon-panel__indicator::after {
  position: absolute;
  top: calc(50% - 0.5 * var(--ui-pixel));
  left: 100%;
  width: var(--ui-pixel);
  height: var(--ui-pixel);
  background: var(--weapon-ink);
  content: '';
}

.equipped-weapon-panel__screen {
  position: absolute;
  isolation: isolate;
  inset: var(--screen-block-inset) var(--screen-right-inset)
    var(--screen-block-inset) var(--nose-width);
  overflow: hidden;
  background: var(--weapon-screen);
  box-shadow:
    calc(-1 * var(--ui-pixel)) 0 var(--weapon-shadow),
    0 calc(-1 * var(--ui-pixel)) var(--weapon-shadow),
    var(--ui-pixel) 0 var(--weapon-edge),
    0 var(--ui-pixel) var(--weapon-edge);
}

/* Center the 40 × 30 sprite frame in the 47 × 35 screen. */
.equipped-weapon-panel__gun {
  position: absolute;
  top: calc(2.5 * var(--ui-pixel));
  left: calc(3.5 * var(--ui-pixel));
}

.equipped-weapon-panel__ammo {
  position: absolute;
  left: calc(4.5 * var(--ui-pixel));
  bottom: calc(2.25 * var(--ui-pixel));
  color: var(--weapon-ammo);
  font-family: 'VT323', monospace;
  font-size: calc(14 * var(--ui-pixel));
  font-weight: 400;
  line-height: 1;
  letter-spacing: var(--ui-pixel);
  /* Match the reference's wider digits without increasing their height. */
  transform: scaleX(1.4);
  transform-origin: left bottom;
  /* The horizontal scale also stretches this right-only shadow. */
  text-shadow: var(--ui-pixel) 0 0 var(--weapon-ammo-shadow);
}

/* This open-right frame ends at the housing edge, around the tubes and black rim. */
.equipped-weapon-panel__connector-frame {
  position: absolute;
  top: 50%;
  right: 0;
  width: calc(
    var(--connector-width) + var(--connector-right) - var(--connector-reserved-width) + var(--ui-pixel)
  );
  height: calc(var(--connector-height) + 4 * var(--ui-pixel));
  transform: translateY(-50%);
  pointer-events: none;
  /* First shadow wins at overlaps: top covers left; left covers bottom. */
  box-shadow:
    inset 0 var(--ui-pixel) var(--weapon-shadow),
    inset var(--ui-pixel) 0 var(--weapon-connector-frame-left),
    inset 0 calc(-1 * var(--ui-pixel)) var(--weapon-edge);
}

.equipped-weapon-panel__connector {
  --tube-dark: var(--color-panel-tube-dark);
  --tube-mid: var(--color-panel-tube-mid);
  --tube-light: var(--color-panel-tube-light);
  --tube-height: var(--ui-pixel);
  --tube-side-inset: calc(2 * var(--ui-pixel));

  position: absolute;
  top: 50%;
  /* Leave one art pixel between the left edge and the screen's outer border. */
  right: var(--connector-right);
  width: var(--connector-width);
  height: var(--connector-height);
  transform: translateY(-50%);
  background: var(--weapon-connector);
  border-top: var(--ui-pixel) solid var(--weapon-metal);
  border-bottom: var(--ui-pixel) solid var(--weapon-connector-bottom);
  /* Keep the black rim on the top, bottom, and right, with square right corners. */
  box-shadow:
    0 calc(-1 * var(--ui-pixel)) var(--weapon-ink),
    0 var(--ui-pixel) var(--weapon-ink),
    var(--ui-pixel) 0 var(--weapon-ink),
    var(--ui-pixel) calc(-1 * var(--ui-pixel)) var(--weapon-ink),
    var(--ui-pixel) var(--ui-pixel) var(--weapon-ink);
}

.equipped-weapon-panel__tubes {
  position: absolute;
  left: var(--tube-side-inset);
  right: var(--tube-side-inset);
  display: flex;
  justify-content: space-between;
  height: var(--tube-height);
}

/* Offset past the border so each pair attaches to the rectangle's outer edge. */
.equipped-weapon-panel__tubes--top {
  bottom: calc(100% + var(--ui-pixel));
}

.equipped-weapon-panel__tubes--bottom {
  top: calc(100% + var(--ui-pixel));
}

.equipped-weapon-panel__tube {
  width: calc(3 * var(--ui-pixel));
  height: 100%;
  /* Portrait tube palette, rotated across the horizontal attachment edge. */
  background: linear-gradient(
    to right,
    var(--tube-dark) 0 calc(0.5 * var(--ui-pixel)),
    var(--tube-mid) calc(0.5 * var(--ui-pixel)) var(--ui-pixel),
    var(--tube-light) var(--ui-pixel) calc(2 * var(--ui-pixel)),
    var(--tube-mid) calc(2 * var(--ui-pixel)) calc(2.5 * var(--ui-pixel)),
    var(--tube-dark) calc(2.5 * var(--ui-pixel)) 100%
  );
}

/* Both end strips cover the horizontal borders with square corners. */
.equipped-weapon-panel__connector::before,
.equipped-weapon-panel__connector::after {
  position: absolute;
  top: calc(-1 * var(--ui-pixel));
  bottom: calc(-1 * var(--ui-pixel));
  width: var(--ui-pixel);
  content: '';
}

.equipped-weapon-panel__connector::before {
  left: 0;
  background: var(--weapon-connector-left);
}

/* Tint the existing top, body, and bottom colors together. */
.equipped-weapon-panel__connector::after {
  right: 0;
  background: rgb(0 0 0 / 30%);
}
</style>
