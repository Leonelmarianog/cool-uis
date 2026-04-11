<template>
  <div class="viewport">
    <div class="letterboxing"></div>

    <div class="game-area">
      <div class="card-stack">
        <div
            v-for="(card, index) in cards"
            :key="card.id"
            class="card"
            :class="getCardClasses(index)"
        >
          {{ card.name }}
        </div>
      </div>

      <button @click="cycleCards" :disabled="isAnimating">Cycle</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Card {
  id: number;
  name: string;
}

const cards = ref<Card[]>([
  { id: 1, name: 'Jill' },
  { id: 2, name: 'Chris' },
]);

const isAnimating = ref(false);

function getCardClasses(index: number) {
  const classes = [];

  if (isAnimating.value) {
    classes.push(index === 0 ? 'swap-active-to-idle' : 'swap-idle-to-active');
  } else {
    classes.push(index === 0 ? 'active-card' : 'idle-card');
  }

  return classes;
}

function cycleCards() {
  if (isAnimating.value) return;

  isAnimating.value = true;

  setTimeout(() => {
    const first = cards.value[0];
    cards.value = [cards.value[1], first];
    isAnimating.value = false;
  }, 1000);
}
</script>

<style>
/* CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
}

p {
  margin: 0;
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

ul[class],
ol[class] {
  margin: 0;
  list-style: none;
}
</style>

<style scoped>
.viewport {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
}

.letterboxing {
  position: absolute;
  inset: 0;
  background-color: #000;
}

.game-area {
  --button-padding-x: 1.2em;
  --button-padding-y: 0.45em;
  --button-font-size: 0.5em;
  --button-border-width: 0.075em;
  --button-border-radius: 0.15em;
  --button-color-idle: #888;
  --button-color-hover: #fff;
}

/* Game area is centered and maintains 16:9 aspect ratio always, regardless of viewport size. */
.game-area {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  /* Calculate size that fits within viewport while maintaining 16:9 ratio. */
  /* min() ensures we don't exceed viewport in either dimension. */
  width: min(
      100vw,
      calc(100vh * 16 / 9)
  );
  height: min(
      100vh,
      calc(100vw * 9 / 16)
  );

  /* Scale font-size based on viewport - relative to 1920px base width (16:9) */
  --width-divisor: 30;
  --height-divisor: calc(var(--width-divisor) * 9 / 16);
  font-size: calc(min(100vw / var(--width-divisor), 100vh / var(--height-divisor)));

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5em;
  background: #fbd17a;
  border: 0.125em solid #ffac00;
}

.card-stack {
  --card-width: 10.5em;
  --card-height: 7.5em;
  --card-shadow:
      calc(var(--card-width) * 0.025) calc(var(--card-width) * 0.025)
      0 0.125em rgba(0, 0, 0, 0.1);

  --active-card-scale: 1;
  --active-card-brightness: 1;
  --active-card-z-index: 2;
  --active-card-position-x: 0;
  --active-card-position-y: 0;

  --idle-card-scale: 0.9;
  --idle-card-brightness: 0.85;
  --idle-card-z-index: 1;
  --idle-card-position-ratio-x: 0.2;
  --idle-card-position-ratio-y: 0.125;
  --idle-card-position-x: calc(var(--card-width) * var(--idle-card-position-ratio-x));
  --idle-card-position-y: calc(var(--card-height) * var(--idle-card-position-ratio-y));

  --card-swap-animation-ratio-x: 0.6;
  --card-swap-animation-ratio-y: 0.45;
  --card-swap-animation-peak-x: calc(var(--card-width) * var(--card-swap-animation-ratio-x));
  --card-swap-animation-peak-y: calc(var(--card-height) * var(--card-swap-animation-ratio-y));
  --card-swap-animation-duration: 1s;
  --card-swap-animation-timing: ease-in-out;
}

.card-stack {
  position: relative;
  width: calc(var(--card-width) * 1.2);
  height: calc(var(--card-height) * 1.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  position: absolute;
  width: var(--card-width);
  height: var(--card-height);
  border-radius: 0.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 0.9em;
  font-weight: bold;
  background: #ffffff;
  color: #000000;
  box-shadow: var(--card-shadow);
}

.active-card {
  transform: translate(var(--active-card-position-x), var(--active-card-position-y)) scale(var(--active-card-scale));
  filter: brightness(var(--active-card-brightness));
  z-index: var(--active-card-z-index);
}

.idle-card {
  transform: translate(var(--idle-card-position-x), var(--idle-card-position-y)) scale(var(--idle-card-scale));
  filter: brightness(var(--idle-card-brightness));
  z-index: var(--idle-card-z-index);
}

.swap-active-to-idle {
  animation: swap-active-to-idle var(--card-swap-animation-duration) var(--card-swap-animation-timing) forwards;
}

@keyframes swap-active-to-idle {
  0% {
    transform: translate(var(--active-card-position-x), var(--active-card-position-y)) scale(var(--active-card-scale));
    filter: brightness(var(--active-card-brightness));
    z-index: var(--active-card-z-index);
  }
  50% {
    transform: translate(calc(var(--card-swap-animation-peak-x) * -1), calc(var(--card-swap-animation-peak-y) * -1)) scale(var(--active-card-scale));
    filter: brightness(var(--active-card-brightness));
  }
  100% {
    transform: translate(var(--idle-card-position-x), var(--idle-card-position-y)) scale(var(--idle-card-scale));
    filter: brightness(var(--idle-card-brightness));
    z-index: var(--idle-card-z-index);
  }
}

.swap-idle-to-active {
  animation: swap-idle-to-active var(--card-swap-animation-duration) var(--card-swap-animation-timing) forwards;
}

@keyframes swap-idle-to-active {
  0% {
    transform: translate(var(--idle-card-position-x), var(--idle-card-position-y)) scale(var(--idle-card-scale));
    filter: brightness(var(--idle-card-brightness));
    z-index: var(--idle-card-z-index);
  }
  50% {
    transform: translate(calc(var(--idle-card-position-x) + var(--card-swap-animation-peak-x)), calc(var(--idle-card-position-y) + var(--card-swap-animation-peak-y))) scale(var(--active-card-scale));
    filter: brightness(var(--active-card-brightness));
  }
  100% {
    transform: translate(var(--active-card-position-x), var(--active-card-position-y)) scale(var(--active-card-scale));
    filter: brightness(var(--active-card-brightness));
    z-index: var(--active-card-z-index);
  }
}

button {
  padding: var(--button-padding-y) var(--button-padding-x);
  font-size: var(--button-font-size);
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.125em;
  background: transparent;
  color: var(--button-color-idle);
  border: var(--button-border-width) solid var(--button-color-idle);
  border-radius: var(--button-border-radius);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

button:hover:not(:disabled) {
  color: var(--button-color-hover);
  border-color: var(--button-color-hover);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
