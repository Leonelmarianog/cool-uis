<template>
  <div class="container">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Card {
  id: number;
  name: string;
}

// Cards array - order represents visual stacking
// index 0 = top position, index 1 = bottom position
const cards = ref<Card[]>([
  { id: 1, name: 'Jill' },
  { id: 2, name: 'Chris' },
]);

const isAnimating = ref(false);

function getCardClasses(index: number) {
  const classes = [];

  // Position-based animation or static class
  if (isAnimating.value) {
    classes.push(index === 0 ? 'animating-from-top' : 'animating-from-bottom');
  } else {
    classes.push(index === 0 ? 'position-top' : 'position-bottom');
  }

  return classes;
}

function cycleCards() {
  if (isAnimating.value) return;

  isAnimating.value = true;

  // Animation runs for 1s, then we swap the array
  setTimeout(() => {
    // Swap: move first card to end, second to front
    const first = cards.value[0];
    cards.value = [cards.value[1], first];
    isAnimating.value = false;
  }, 1000);
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #666666;
  gap: 60px;
}

.card-stack {
  position: relative;
  width: 520px;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  position: absolute;
  width: 280px;
  height: 200px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.card {
  background: #ffffff;
  color: #000000;
}

/* Static positions */
.position-top {
  transform: translate(0, 0) scale(1);
  opacity: 1;
  z-index: 2;
  box-shadow:
    12px 12px 0 2px rgba(0, 0, 0, 0.5);
}

.position-bottom {
  transform: translate(54px, 25px) scale(0.9);
  opacity: 0.6;
  z-index: 1;
  box-shadow: 6px 6px 0 2px rgba(0, 0, 0, 0.35);
}

/* Animations for card starting at TOP */
/* Path: (0,0) → (-160px, -100px) → (54px, 25px) */
/* Scale: 1 → 1 → 0.9, Opacity: 1 → 1 → 0.6 */
/* Shadow animates from large to small */
/* z-index changes at 50% */
.animating-from-top {
  animation: cycle-from-top 1s ease-in-out forwards;
}

@keyframes cycle-from-top {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
    z-index: 2;
    box-shadow: 12px 12px 0 2px rgba(0, 0, 0, 0.5);
  }
  50% {
    transform: translate(-160px, -100px) scale(1);
    opacity: 1;
    z-index: 1;
    box-shadow: 12px 12px 0 2px rgba(0, 0, 0, 0.5);
  }
  100% {
    transform: translate(54px, 25px) scale(0.9);
    opacity: 0.6;
    z-index: 1;
    box-shadow: 6px 6px 0 2px rgba(0, 0, 0, 0.35);
  }
}

/* Animations for card starting at BOTTOM */
/* Path: (54px, 25px) → (214px, 125px) → (0, 0) */
/* Scale: 0.9 → 1 → 1, Opacity: 0.6 → 1 → 1 */
/* Shadow animates from small to large */
/* z-index changes at 50% */
.animating-from-bottom {
  animation: cycle-from-bottom 1s ease-in-out forwards;
}

@keyframes cycle-from-bottom {
  0% {
    transform: translate(54px, 25px) scale(0.9);
    opacity: 0.6;
    z-index: 1;
    box-shadow: 6px 6px 0 2px rgba(0, 0, 0, 0.35);
  }
  50% {
    transform: translate(214px, 125px) scale(1);
    opacity: 1;
    z-index: 2;
    box-shadow: 12px 12px 0 2px rgba(0, 0, 0, 0.5);
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
    z-index: 2;
    box-shadow: 12px 12px 0 2px rgba(0, 0, 0, 0.5);
  }
}

button {
  padding: 12px 32px;
  font-size: 16px;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: transparent;
  color: #888;
  border: 2px solid #888;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover:not(:disabled) {
  color: #fff;
  border-color: #fff;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
