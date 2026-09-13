<script setup>
import ecgLabel from '../assets/ecg-label.svg'
</script>

<template>
  <section class="health-status-panel" aria-label="Health status panel">
    <div class="health-status-panel__housing">
      <img class="health-status-panel__label" :src="ecgLabel" alt="ECG" width="36" height="148" />
      <div class="health-status-panel__screen" aria-hidden="true"></div>
    </div>
    <div class="health-status-panel__top-recess" aria-hidden="true">
      <span class="health-status-panel__border-mark"></span>
    </div>
  </section>
</template>

<style scoped>
.health-status-panel {
  --health-housing-background: linear-gradient(to top, #718b72, #949285, #afa194);
  --health-recess-mid: #20211C;
  --health-mount-border: #0e180d;
  --health-reflection: #535a4d;

  /* Reference housing: 72 × 43 art pixels. */
  position: relative;
  width: calc(72 * var(--ui-pixel));
  max-width: 100%;
  height: calc(43 * var(--ui-pixel));
}

.health-status-panel__housing {
  position: absolute;
  inset: 0;
  background: var(--health-housing-background);
  /* Mirrored pixel steps cut away the top-right and bottom-right corners. */
  clip-path: polygon(
    0 0,
    calc(100% - 5 * var(--ui-pixel)) 0,
    calc(100% - 5 * var(--ui-pixel)) var(--ui-pixel),
    calc(100% - 3 * var(--ui-pixel)) var(--ui-pixel),
    calc(100% - 3 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    100% calc(4 * var(--ui-pixel)),
    100% calc(100% - 4 * var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(100% - 4 * var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(100% - 2 * var(--ui-pixel)),
    calc(100% - 3 * var(--ui-pixel)) calc(100% - 2 * var(--ui-pixel)),
    calc(100% - 3 * var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(100% - 5 * var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(100% - 5 * var(--ui-pixel)) 100%,
    0 100%
  );
}

/* Match the portrait's translucent outer shadow and doubled darker center. */
.health-status-panel__housing::before,
.health-status-panel__housing::after {
  --corner-shadow: rgb(14 24 13 / 30%);

  position: absolute;
  right: 0;
  width: calc(8 * var(--ui-pixel));
  height: calc(7 * var(--ui-pixel));
  pointer-events: none;
  content: '';
  background:
    linear-gradient(var(--corner-shadow), var(--corner-shadow))
      left calc(2 * var(--ui-pixel)) top var(--ui-pixel) /
      calc(5 * var(--ui-pixel)) calc(4 * var(--ui-pixel)) no-repeat,
    var(--corner-shadow);
  /* A one-pixel ribbon follows the steps and extends along adjoining edges. */
  clip-path: polygon(
    0 0,
    calc(3 * var(--ui-pixel)) 0,
    calc(3 * var(--ui-pixel)) var(--ui-pixel),
    calc(5 * var(--ui-pixel)) var(--ui-pixel),
    calc(5 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(7 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(7 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    100% calc(4 * var(--ui-pixel)),
    100% 100%,
    calc(7 * var(--ui-pixel)) 100%,
    calc(7 * var(--ui-pixel)) calc(5 * var(--ui-pixel)),
    calc(6 * var(--ui-pixel)) calc(5 * var(--ui-pixel)),
    calc(6 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(4 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(4 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) var(--ui-pixel),
    0 var(--ui-pixel)
  );
}

.health-status-panel__housing::before {
  top: 0;
}

.health-status-panel__housing::after {
  bottom: 0;
  transform: scaleY(-1);
}

.health-status-panel__top-recess {
  position: absolute;
  top: calc(-2 * var(--ui-pixel));
  left: calc(10 * var(--ui-pixel));
  right: calc(10 * var(--ui-pixel));
  height: calc(5 * var(--ui-pixel));
  border-top: var(--ui-pixel) solid var(--health-mount-border);
  border-left: var(--ui-pixel) solid var(--health-mount-border);
  border-right: var(--ui-pixel) solid var(--health-mount-border);
  border-bottom: var(--ui-pixel) solid var(--health-mount-border);
  background: var(--health-recess-mid);
}

.health-status-panel__border-mark {
  position: absolute;
  z-index: 1;
  bottom: 0;
  left: calc(50% - 7.5 * var(--ui-pixel));
  width: calc(15 * var(--ui-pixel));
  height: var(--ui-pixel);
  background: rgb(0 0 0 / 30%);
}

/* Darken the fourth inner pixel on either side, including the reflection. */
.health-status-panel__top-recess::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  background:
    linear-gradient(rgb(0 0 0 / 30%), rgb(0 0 0 / 30%))
      left calc(3 * var(--ui-pixel)) top / var(--ui-pixel) 100% no-repeat,
    linear-gradient(rgb(0 0 0 / 30%), rgb(0 0 0 / 30%))
      right calc(3 * var(--ui-pixel)) top / var(--ui-pixel) 100% no-repeat;
  content: '';
}

/* Two art-pixel bands form a stepped reflection above the bottom border. */
.health-status-panel__top-recess::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: calc(2 * var(--ui-pixel));
  background:
    linear-gradient(var(--health-reflection), var(--health-reflection))
      bottom center / calc(100% - 2 * var(--ui-pixel)) var(--ui-pixel) no-repeat,
    linear-gradient(var(--health-reflection), var(--health-reflection))
      top center / calc(100% - 4 * var(--ui-pixel)) var(--ui-pixel) no-repeat;
  content: '';
}

.health-status-panel__label {
  position: absolute;
  top: calc(5 * var(--ui-pixel));
  left: calc(2 * var(--ui-pixel));
  width: calc(9 * var(--ui-pixel));
  height: calc(37 * var(--ui-pixel));
  image-rendering: pixelated;
  filter: drop-shadow(calc(0.5 * var(--ui-pixel)) calc(0.5 * var(--ui-pixel)) 0 rgb(14 24 13 / 30%));
}

.health-status-panel__screen {
  position: absolute;
  top: calc(4 * var(--ui-pixel));
  right: calc(5 * var(--ui-pixel));
  bottom: calc(4 * var(--ui-pixel));
  left: calc(13 * var(--ui-pixel));
  background: #000;
}
</style>
