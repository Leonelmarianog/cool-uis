<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import panel from '../assets/ui/item-description-panel.png';
import choiceArrow from '../assets/ui/choice-arrow.svg';

const {
  itemName = '',
  text = null,
  choices = [],
  choiceIndex = 0,
  keepText = false,
} = defineProps<{
  itemName?: string;
  /** Replaces the item name while it is open: a description, or a prompt's question. A "\n" starts its second line. */
  text?: string | null;
  /** The prompt's choices; they show once the question is typed out. */
  choices?: string[];
  /** The choice under the choice cursor (the arrow). */
  choiceIndex?: number;
  /** Keeps the text after it is typed out, such as CHECK's item description. */
  keepText?: boolean;
}>();

const emit = defineEmits<{ 'description-typed': []; point: [index: number]; choose: [] }>();

/** As in use-item-1.gif: one character every 4 frames at 60 fps. */
const CHARACTER_MS = (4 * 1000) / 60;
/** How long a text that goes away by itself stays in full before the item name returns. */
const HOLD_MS = 420;
// The first choice starts at column 214; each next one follows two spaces
// after the one before, in 8-pixel characters.
const FIRST_CHOICE_COLUMN = 214;
const CHARACTER_WIDTH = 8;

const typedLength = ref(0);
const areChoicesShown = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

function typeNextCharacter(fullText: string) {
  typedLength.value++;
  if (typedLength.value < fullText.length) {
    timer = setTimeout(() => typeNextCharacter(fullText), CHARACTER_MS);
  } else if (choices.length > 0) {
    areChoicesShown.value = true;
  } else if (!keepText) {
    timer = setTimeout(() => emit('description-typed'), HOLD_MS);
  }
}

watch(
  () => text,
  newText => {
    clearTimeout(timer);
    typedLength.value = 0;
    areChoicesShown.value = false;
    if (newText) timer = setTimeout(() => typeNextCharacter(newText), CHARACTER_MS);
  },
);

onUnmounted(() => clearTimeout(timer));

const shownText = computed(() => (text === null ? itemName : text.slice(0, typedLength.value)));
const lines = computed(() => shownText.value.split('\n'));

const choiceColumns = computed(() => {
  let column = FIRST_CHOICE_COLUMN;
  return choices.map(choice => {
    const choiceColumn = column;
    column += (choice.length + 2) * CHARACTER_WIDTH;
    return choiceColumn;
  });
});

/** Clicking a choice points at it, then chooses it. */
function onChoiceClick(index: number) {
  emit('point', index);
  emit('choose');
}
</script>

<template>
  <section class="item-description-panel" aria-label="Item description panel">
    <img class="item-description-panel__artwork" :src="panel" alt="" />
    <p
      v-for="(line, index) in lines"
      :key="index"
      class="item-description-panel__text item-description-panel__line"
      :style="{ '--line': index }"
    >
      {{ line }}
    </p>
    <template v-if="areChoicesShown">
      <img
        class="item-description-panel__choice-arrow"
        :src="choiceArrow"
        :style="{ '--choice-column': choiceColumns[choiceIndex] }"
        alt=""
      />
      <button
        v-for="(choice, index) in choices"
        :key="choice"
        class="item-description-panel__text item-description-panel__choice"
        :style="{ '--choice-column': choiceColumns[index] }"
        type="button"
        @mouseenter="emit('point', index)"
        @click="onChoiceClick(index)"
      >
        {{ choice }}
      </button>
    </template>
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

.item-description-panel__text {
  position: absolute;
  margin: 0;
  padding: 0;
  border: 0;
  color: #c1beb2;
  background: none;
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

.item-description-panel__line {
  /* On the first line, capitals (0.58em tall, their top 0.14em below the
     line's top) fill rows 187–196. Each next line is 16 rows lower. */
  top: calc((5 + 16 * var(--line)) * var(--game-pixel) - 0.14em);
  left: calc(48 * var(--game-pixel));
}

/* The second line, 16 rows below the first. */
.item-description-panel__choice {
  top: calc(21 * var(--game-pixel) - 0.14em);
  left: calc(var(--choice-column) * var(--game-pixel));
  cursor: pointer;
}

/* Rows 3–7 of the choice's capitals, in the column before them; the image adds
   one pixel of outline on each side. Blinks on and off about every 870 ms. */
.item-description-panel__choice-arrow {
  position: absolute;
  top: calc(23 * var(--game-pixel));
  left: calc((var(--choice-column) - 7) * var(--game-pixel));
  width: calc(5 * var(--game-pixel));
  height: calc(7 * var(--game-pixel));
  image-rendering: pixelated;
  animation: choice-arrow-blink 1.74s steps(1, end) infinite;
}

@keyframes choice-arrow-blink {
  50% {
    visibility: hidden;
  }
}
</style>
