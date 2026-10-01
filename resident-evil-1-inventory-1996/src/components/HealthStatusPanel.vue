<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import panel from '../assets/ui/health-status-panel.png';
import traceFine from '../assets/ui/ecg-trace-fine.svg';
import traceFineYellow from '../assets/ui/ecg-trace-fine-yellow.svg';
import traceCaution from '../assets/ui/ecg-trace-caution.svg';
import traceDanger from '../assets/ui/ecg-trace-danger.svg';
import tracePoison from '../assets/ui/ecg-trace-poison.svg';
import heal from '../assets/ui/ecg-heal.svg';
import { HealthStatus } from '../types/health';

// `recoveriesUsed` counts used recovery items; each change plays the heal animation.
const { status, recoveriesUsed = 0 } = defineProps<{ status: HealthStatus; recoveriesUsed?: number }>();

const states: Record<
  HealthStatus,
  { name: string; accessibleName: string; labelColor: string; image: string; blinking: boolean }
> = {
  [HealthStatus.Fine]: {
    name: 'Fine',
    accessibleName: 'Fine, green',
    labelColor: '#29a229',
    image: traceFine,
    blinking: false,
  },
  [HealthStatus.FineYellow]: {
    name: 'Fine',
    accessibleName: 'Fine, yellow',
    labelColor: '#29a229',
    image: traceFineYellow,
    blinking: false,
  },
  [HealthStatus.Caution]: {
    name: 'Caution',
    accessibleName: 'Caution',
    labelColor: '#e59b00',
    image: traceCaution,
    blinking: true,
  },
  [HealthStatus.Danger]: {
    name: 'Danger!',
    accessibleName: 'Danger',
    labelColor: '#e50030',
    image: traceDanger,
    blinking: true,
  },
  [HealthStatus.Poison]: {
    name: 'Poison!',
    accessibleName: 'Poison',
    labelColor: '#c78bea',
    image: tracePoison,
    blinking: true,
  },
};
const state = computed(() => states[status]);

// The heal sequence from use-item-2.gif: the green band rises (23 frames at 60 fps)
// and the screen stays empty for about 4 more frames; then the new label shows alone,
// then the trace starts. `normal` shows the label and trace.
const BAND_MS = ((23 + 4) * 1000) / 60;
const LABEL_MS = 270;
const phase = ref<'band' | 'label' | 'normal'>('normal');
let timers: ReturnType<typeof setTimeout>[] = [];

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

watch(
  () => recoveriesUsed,
  () => {
    clearTimers();
    phase.value = 'band';
    timers = [
      setTimeout(() => (phase.value = 'label'), BAND_MS),
      setTimeout(() => (phase.value = 'normal'), BAND_MS + LABEL_MS),
    ];
  },
);

onUnmounted(clearTimers);
</script>

<template>
  <section class="health-status-panel" aria-label="Health status panel">
    <img class="health-status-panel__artwork" :src="panel" alt="" />
    <div
      class="health-status-panel__screen"
      role="img"
      :aria-label="`Health: ${state.accessibleName}.`"
      :style="{ '--ecg-label-color': state.labelColor }"
    >
      <img v-if="phase === 'band'" class="health-status-panel__heal" :src="heal" alt="" />
      <span v-else :key="status" class="health-status-panel__animation" aria-hidden="true">
        <img v-if="phase === 'normal'" class="health-status-panel__trace" :src="state.image" alt="" />
        <span
          class="health-status-panel__status"
          :class="{ 'health-status-panel__status--blinking': state.blinking }"
          >{{ state.name }}</span
        >
      </span>
    </div>
  </section>
</template>

<style scoped>
.health-status-panel {
  position: relative;
  width: calc(64 * var(--game-pixel));
  height: calc(40 * var(--game-pixel));
}

.health-status-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

/* Covers the artwork's ECG screen; the grid and status box are part of the artwork. */
.health-status-panel__screen {
  position: absolute;
  overflow: hidden;
  top: calc(6 * var(--game-pixel));
  left: calc(12 * var(--game-pixel));
  width: calc(48 * var(--game-pixel));
  height: calc(30 * var(--game-pixel));
}

.health-status-panel__animation,
.health-status-panel__trace {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* The band starts below the screen and rises 2 rows per frame until it is above it.
   Its light adds to the screen's, so the grid lines still show through it. */
.health-status-panel__heal {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: calc(16 * var(--game-pixel));
  image-rendering: pixelated;
  mix-blend-mode: plus-lighter;
  animation: health-status-heal calc(23s / 60) steps(23, jump-start) forwards;
}

@keyframes health-status-heal {
  to {
    transform: translateY(calc(-46 * var(--game-pixel)));
  }
}

.health-status-panel__status {
  position: absolute;
  /* Capitals (0.56em tall, their top 0.24em below the line's top) fill rows 22–27. */
  top: calc(22 * var(--game-pixel) - 0.24em);
  left: calc(18 * var(--game-pixel) - 0.06em);
  color: var(--ecg-label-color);
  font-family: 'VT323', monospace;
  font-size: calc(10.71 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  /* Narrow the letters to the game's width ("Fine" is 14 pixels wide). */
  transform: scaleX(0.87);
  transform-origin: left;
}

.health-status-panel__status--blinking {
  animation: ecg-status-blink 750ms steps(1, end) infinite;
}

@keyframes ecg-status-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
