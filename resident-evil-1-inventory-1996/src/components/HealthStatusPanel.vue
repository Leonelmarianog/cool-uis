<script setup lang="ts">
import { ref, computed } from 'vue'
import panel from '../assets/ui/health-status-panel.png'
import traceFine from '../assets/ui/ecg-trace-fine.svg'
import traceFineYellow from '../assets/ui/ecg-trace-fine-yellow.svg'
import traceCaution from '../assets/ui/ecg-trace-caution.svg'
import traceDanger from '../assets/ui/ecg-trace-danger.svg'
import tracePoison from '../assets/ui/ecg-trace-poison.svg'

const states = [
  { name: 'Fine', accessibleName: 'Fine, green', labelColor: '#009900', image: traceFine, blinking: false },
  { name: 'Fine', accessibleName: 'Fine, yellow', labelColor: '#009900', image: traceFineYellow, blinking: false },
  { name: 'Caution', accessibleName: 'Caution', labelColor: '#e59b00', image: traceCaution, blinking: true },
  { name: 'Danger!', accessibleName: 'Danger', labelColor: '#e50030', image: traceDanger, blinking: true },
  { name: 'Poison!', accessibleName: 'Poison', labelColor: '#c78bea', image: tracePoison, blinking: true },
]
const stateIndex = ref(0)
const state = computed(() => states[stateIndex.value])
function cycleState() {
  stateIndex.value = (stateIndex.value + 1) % states.length
}
</script>

<template>
  <section class="health-status-panel" aria-label="Health status panel">
    <img class="health-status-panel__artwork" :src="panel" alt="" />
    <button
      class="health-status-panel__screen"
      type="button"
      :aria-label="`Health: ${state.accessibleName}. Click to cycle health status.`"
      :style="{ '--ecg-label-color': state.labelColor }"
      @click="cycleState"
    >
      <span :key="stateIndex" class="health-status-panel__animation" aria-hidden="true">
        <img class="health-status-panel__trace" :src="state.image" alt="" />
        <span class="health-status-panel__status" :class="{ 'health-status-panel__status--blinking': state.blinking }">{{ state.name }}</span>
      </span>
    </button>
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
  top: calc(6 * var(--game-pixel));
  left: calc(12 * var(--game-pixel));
  width: calc(48 * var(--game-pixel));
  height: calc(30 * var(--game-pixel));
  padding: 0;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  background: none;
  appearance: none;
}

.health-status-panel__screen:focus-visible {
  outline-offset: calc(-1 * var(--game-pixel));
}

.health-status-panel__animation,
.health-status-panel__trace {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.health-status-panel__status {
  position: absolute;
  bottom: 0;
  left: calc(18 * var(--game-pixel));
  color: var(--ecg-label-color);
  font-family: 'VT323', monospace;
  font-size: calc(10 * var(--ui-pixel));
  font-weight: 400;
  line-height: 1;
}

.health-status-panel__status--blinking {
  animation: ecg-status-blink 750ms steps(1, end) infinite;
}

@keyframes ecg-status-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
