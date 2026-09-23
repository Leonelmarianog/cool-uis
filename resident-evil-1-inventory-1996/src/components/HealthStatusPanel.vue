<script setup>
import { ref, computed, useId } from 'vue'
import ecgLabel from '../assets/ecg-label.svg'

const ecgId = useId()
const gridLineCount = 10
const gridTopInset = 2.1
const gridLineSpacing = (35 - 2 * gridTopInset) / (gridLineCount - 1)
const gridLines = Array.from({ length: gridLineCount }, (_, index) => gridTopInset + index * gridLineSpacing)
const waveformBaseline = gridLines[gridLines.length - 5]

// Coordinates follow the screen's 54 × 35 art-pixel canvas.
const states = [
  { name: 'Fine', accessibleName: 'Fine, green', color: '#00b900', labelColor: '#009900', points: '0,18 16,18 20,21 24,3 29,21 32,12 36,18 54,18' },
  { name: 'Fine', accessibleName: 'Fine, yellow', color: '#b8b600', labelColor: '#009900', points: '0,18 18,18 20,20 24,7 29,20 32,13 35,18 54,18' },
  { name: 'Caution', accessibleName: 'Caution', color: '#d88a00', labelColor: '#e59b00', points: '0,18 19,18 21,19 24,10 28,19 30,15 32,18 54,18' },
  { name: 'Danger!', accessibleName: 'Danger', color: '#bc0018', labelColor: '#e50030', points: '0,18 19,18 21,19 23,14 26,19 28,16 30,18 54,18' },
]
const stateIndex = ref(0)
const state = computed(() => states[stateIndex.value])
// Rasterize the straight segments on the art-pixel grid, rather than letting
// the browser rasterize diagonal strokes at the much finer screen resolution.
const waveformPixels = computed(() => {
  const points = state.value.points.split(' ').map(point => point.split(',').map(Number))
  const pixels = new Set()
  for (let i = 1; i < points.length; i++) {
    const [startX, startY] = points[i - 1]
    const [endX, endY] = points[i]
    const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY))
    for (let step = 0; step <= steps; step++) {
      const x = Math.round(startX + (endX - startX) * step / steps)
      const y = Math.round(startY + (endY - startY) * step / steps)
      pixels.add(`${x},${y}`)
    }
  }
  return [...pixels].map(pixel => {
    const [x, y] = pixel.split(',').map(Number)
    // Center the one-pixel trace on the fifth grid line from the bottom.
    return `M${x},${y - 18 + waveformBaseline - 0.5}h1v1h-1z`
  }).join(' ')
})
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
        :style="{ '--ecg-color': state.color, '--ecg-label-color': state.labelColor }"
        @click="cycleState"
      >
        <svg class="health-status-panel__grid" viewBox="0 0 54 35" preserveAspectRatio="none" aria-hidden="true">
          <path v-for="y in gridLines" :key="y" :d="`M 0 ${y} H 54`" />
        </svg>
        <span :key="stateIndex" class="health-status-panel__animation" aria-hidden="true">
          <svg class="health-status-panel__trace" viewBox="0 0 54 35" preserveAspectRatio="none">
            <defs>
              <linearGradient :id="`${ecgId}-fade`">
                <stop offset="0" stop-color="black" />
                <stop offset="66.6667%" stop-color="black" />
                <stop offset="100%" stop-color="white" />
              </linearGradient>
              <mask :id="`${ecgId}-mask`" maskUnits="userSpaceOnUse" x="0" y="0" width="54" height="35" style="mask-type: luminance">
                <rect width="54" height="35" fill="white" stroke="none" />
                <rect class="health-status-panel__erase" width="162" height="35" :fill="`url(#${ecgId}-fade)`" stroke="none" />
              </mask>
            </defs>
            <path :d="waveformPixels" fill="var(--ecg-color)" stroke="none" :mask="`url(#${ecgId}-mask)`" />
          </svg>
          <span class="health-status-panel__status-box">
            <span class="health-status-panel__status" :class="{ 'health-status-panel__status--blinking': stateIndex > 1 }">{{ state.name }}</span>
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

.health-status-panel__grid {
  fill: none;
  stroke: #003321;
  stroke-width: 0.65;
}

.health-status-panel__trace {
  fill: none;
  stroke: var(--ecg-color);
  stroke-width: 1;
  stroke-linejoin: miter;
  shape-rendering: crispEdges;
  /* Reveal across the screen, then dim from left to right like phosphor. */
  animation: ecg-sweep 1500ms linear infinite;
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

.health-status-panel__erase {
  animation: ecg-erase 1500ms linear infinite;
}

@keyframes ecg-sweep {
  0% { clip-path: inset(0 100% 0 0); }
  55%, 100% { clip-path: inset(0 0 0 0); }
}

/* The gradient's leading white edge preserves the trace ahead of the eraser;
   its black tail removes it, with a fading band between the two. */
@keyframes ecg-erase {
  0%, 45% { transform: translateX(-162px); }
  100% { transform: translateX(0); }
}

@keyframes ecg-status-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
