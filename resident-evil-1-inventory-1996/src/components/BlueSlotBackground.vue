<script setup>
defineProps({ rows: { type: Number, default: 35 } })
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
/* Shared with the equipped screen: one row per art pixel, with square steps. */
.blue-slot-background {
  --slot-blue-light: #0c0054;
  --slot-blue: #080044;
  --slot-blue-dark: #050034;

  position: absolute;
  z-index: -1;
  inset: 0;
  display: grid;
  grid-template-rows: repeat(var(--slot-rows), 1fr);
  pointer-events: none;
}

.blue-slot-background__row {
  --light-stop: calc((24 - var(--row-index)) * var(--ui-pixel));
  --dark-stop: calc((48 - var(--row-index)) * var(--ui-pixel));

  background: linear-gradient(
    to right,
    var(--slot-blue-light) 0 var(--light-stop),
    var(--slot-blue) var(--light-stop) var(--dark-stop),
    var(--slot-blue-dark) var(--dark-stop) 100%
  );
}
</style>
