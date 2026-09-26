<script setup lang="ts">
import { ref, computed } from 'vue'
import ecgLabel from '../assets/ecg-label.svg'
import ecgGrid from '../assets/ecg/grid.svg'
import ecgState0 from '../assets/ecg/fine.svg'
import ecgState1 from '../assets/ecg/fine-yellow.svg'
import ecgState2 from '../assets/ecg/caution.svg'
import ecgState3 from '../assets/ecg/danger.svg'
import ecgPoison from '../assets/ecg/poison.svg'

const states = [
  { name: 'Fine', accessibleName: 'Fine, green', labelColor: '#009900', image: ecgState0, blinking: false },
  { name: 'Fine', accessibleName: 'Fine, yellow', labelColor: '#009900', image: ecgState1, blinking: false },
  { name: 'Caution', accessibleName: 'Caution', labelColor: '#e59b00', image: ecgState2, blinking: true },
  { name: 'Danger!', accessibleName: 'Danger', labelColor: '#e50030', image: ecgState3, blinking: true },
  { name: 'Poison!', accessibleName: 'Poison', labelColor: '#c78bea', image: ecgPoison, blinking: true },
]
const stateIndex = ref(0)
const state = computed(() => states[stateIndex.value])
function cycleState() {
  stateIndex.value = (stateIndex.value + 1) % states.length
}
</script>

<template>
  <section class="health-status-panel" aria-label="Health status panel">
    <div class="health-status-panel__housing">
      <img class="health-status-panel__label" :src="ecgLabel" alt="ECG" width="36" height="148" />
      <button
        class="health-status-panel__screen"
        type="button"
        :aria-label="`Health: ${state.accessibleName}. Click to cycle health status.`"
        :style="{ '--ecg-label-color': state.labelColor }"
        @click="cycleState"
      >
        <img class="health-status-panel__grid" :src="ecgGrid" alt="" />
        <span :key="stateIndex" class="health-status-panel__animation" aria-hidden="true">
          <img class="health-status-panel__trace" :src="state.image" alt="" />
          <span class="health-status-panel__status-box">
            <span class="health-status-panel__status" :class="{ 'health-status-panel__status--blinking': state.blinking }">{{ state.name }}</span>
          </span>
        </span>
      </button>
    </div>
    <div class="health-status-panel__top-mount" aria-hidden="true">
      <span class="health-status-panel__reflection-mark"></span>
    </div>
  </section>
</template>

<style scoped>
.health-status-panel {
  --health-housing-background: linear-gradient(to top, #718b72, #949285, #afa194);
  --health-mount-background: #20211c;
  --health-mount-border: #0e180d;
  --health-reflection: #535a4d;
  --health-shadow: rgb(14 24 13 / 30%);
  --health-detail-shadow: rgb(0 0 0 / 30%);

  /* Keep the screen gap tied to the mount's bottom edge. */
  --mount-top: calc(-2 * var(--ui-pixel));
  --mount-height: calc(5 * var(--ui-pixel));
  --mount-side-inset: calc(10 * var(--ui-pixel));
  --screen-gap: var(--ui-pixel);

  /* Reference housing: 72 × 43 art pixels. */
  position: relative;
  width: calc(72 * var(--ui-pixel));
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
  position: absolute;
  right: 0;
  width: calc(8 * var(--ui-pixel));
  height: calc(7 * var(--ui-pixel));
  pointer-events: none;
  content: '';
  background:
    linear-gradient(var(--health-shadow), var(--health-shadow))
      left calc(2 * var(--ui-pixel)) top var(--ui-pixel) /
      calc(5 * var(--ui-pixel)) calc(4 * var(--ui-pixel)) no-repeat,
    var(--health-shadow);
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

.health-status-panel__top-mount {
  position: absolute;
  top: var(--mount-top);
  left: var(--mount-side-inset);
  right: var(--mount-side-inset);
  height: var(--mount-height);
  border: var(--ui-pixel) solid var(--health-mount-border);
  background: var(--health-mount-background);
}

/* A short dark band overlays the lower reflection, inside the border. */
.health-status-panel__reflection-mark {
  --mark-width: calc(15 * var(--ui-pixel));

  position: absolute;
  z-index: 1;
  bottom: 0;
  left: calc(50% - var(--mark-width) / 2);
  width: var(--mark-width);
  height: var(--ui-pixel);
  background: var(--health-detail-shadow);
}

/* Darken the fourth inner pixel on either side, including the reflection. */
.health-status-panel__top-mount::before {
  position: absolute;
  z-index: 1;
  inset: 0;
  background:
    linear-gradient(var(--health-detail-shadow), var(--health-detail-shadow))
      left calc(3 * var(--ui-pixel)) top / var(--ui-pixel) 100% no-repeat,
    linear-gradient(var(--health-detail-shadow), var(--health-detail-shadow))
      right calc(3 * var(--ui-pixel)) top / var(--ui-pixel) 100% no-repeat;
  content: '';
}

/* Two art-pixel bands form a stepped reflection above the bottom border. */
.health-status-panel__top-mount::after {
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
  /* Half an art pixel keeps the lettering shadow close to the strokes. */
  filter: drop-shadow(
    calc(0.5 * var(--ui-pixel)) calc(0.5 * var(--ui-pixel)) 0 var(--health-shadow)
  );
}

.health-status-panel__screen {
  position: absolute;
  top: calc(var(--mount-top) + var(--mount-height) + var(--screen-gap));
  right: calc(5 * var(--ui-pixel));
  bottom: calc(4 * var(--ui-pixel));
  left: calc(13 * var(--ui-pixel));
  padding: 0;
  border: 0;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  background: #000;
  appearance: none;
}

.health-status-panel__screen:focus-visible {
  outline-offset: calc(-1 * var(--ui-pixel));
}

.health-status-panel__grid,
.health-status-panel__trace,
.health-status-panel__animation {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.health-status-panel__status-box {
  --status-box-width: calc(100% * 2 / 3);

  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  width: var(--status-box-width);
  padding-left: calc(2 * var(--ui-pixel));
  background: #000;
}

.health-status-panel__status {
  display: block;
  color: var(--ecg-label-color);
  font-family: 'VT323', monospace;
  font-size: calc(10 * var(--ui-pixel));
  font-weight: 400;
  line-height: 1;
  text-align: left;
}

.health-status-panel__status--blinking {
  animation: ecg-status-blink 750ms steps(1, end) infinite;
}

@keyframes ecg-status-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
