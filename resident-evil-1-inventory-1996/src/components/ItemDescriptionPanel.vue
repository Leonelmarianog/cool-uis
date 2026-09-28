<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import panel from '../assets/ui/item-description-panel.png'

// A message replaces the item name while it is typed out and held.
const { itemName = '', message = null } = defineProps<{ itemName?: string; message?: string | null }>();

const emit = defineEmits<{ 'message-end': [] }>();

// As in use-item-1.gif: one character every 4 frames at 60 fps, then the full
// message stays for about 420 ms before the item name returns.
const CHARACTER_MS = 4 * 1000 / 60;
const HOLD_MS = 420;

const typedLength = ref(0);
let timer: ReturnType<typeof setTimeout> | undefined;

function typeNextCharacter(text: string) {
  typedLength.value++;
  timer = typedLength.value < text.length
    ? setTimeout(() => typeNextCharacter(text), CHARACTER_MS)
    : setTimeout(() => emit('message-end'), HOLD_MS);
}

watch(() => message, text => {
  clearTimeout(timer);
  typedLength.value = 0;
  if (text) timer = setTimeout(() => typeNextCharacter(text), CHARACTER_MS);
});

onUnmounted(() => clearTimeout(timer));

const text = computed(() => (message === null ? itemName : message.slice(0, typedLength.value)));
</script>

<template>
  <section class="item-description-panel" aria-label="Item description panel">
    <img class="item-description-panel__artwork" :src="panel" alt="" />
    <p class="item-description-panel__name">{{ text }}</p>
  </section>
</template>

<style scoped>
.item-description-panel {
  position: relative;
  width: calc(320 * var(--game-pixel));
  height: calc(50 * var(--game-pixel));
}

.item-description-panel__artwork {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.item-description-panel__name {
  position: absolute;
  /* Capitals (0.58em tall, their top 0.14em below the line's top) fill rows 187–196. */
  top: calc(5 * var(--game-pixel) - 0.14em);
  left: calc(48 * var(--game-pixel));
  margin: 0;
  color: #c1beb2;
  font-family: 'Courier Prime', monospace;
  font-size: calc(17.24 * var(--game-pixel));
  font-weight: 400;
  line-height: 1;
  white-space: pre;
  /* Narrow each character to the game's 8-pixel cell. */
  transform: scaleX(0.774);
  transform-origin: left;

  /* A stroke straddles the glyph edge. Paint the fill last to preserve the
     letter face and leave one game pixel of outline visible on the outside. */
  -webkit-text-stroke: calc(2 * var(--game-pixel)) #303048;
  paint-order: stroke fill;
}
</style>
