<script setup lang="ts">
const { rows = 35 } = defineProps<{ rows?: number }>()
</script>

<template>
  <div class="blue-slot-background" :style="{ '--slot-rows': rows }" aria-hidden="true">
    <span
      v-for="row in rows"
      :key="row"
      class="blue-slot-background__row"
      :style="{ '--row-index': row - 1 }"
    ></span>
  </div>
</template>

<style scoped>
/* Hosts supply position: relative and isolation: isolate for the negative layer.
   Set their height to rows × --ui-pixel to keep each step one art pixel tall. */
.blue-slot-background {
  --slot-band-width: calc(24 * var(--ui-pixel));

  position: absolute;
  z-index: -1;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(var(--slot-rows), 1fr);
  pointer-events: none;
}

.blue-slot-background__row {
  /* Shift both transitions left one art pixel per row, keeping them parallel. */
  --slot-row-offset: calc(var(--row-index) * var(--ui-pixel));
  --light-stop: calc(var(--slot-band-width) - var(--slot-row-offset));
  --dark-stop: calc(2 * var(--slot-band-width) - var(--slot-row-offset));

  background: linear-gradient(
    to right,
    var(--color-slot-blue-light) 0 var(--light-stop),
    var(--color-slot-blue) var(--light-stop) var(--dark-stop),
    var(--color-slot-blue-dark) var(--dark-stop) 100%
  );
}
</style>
