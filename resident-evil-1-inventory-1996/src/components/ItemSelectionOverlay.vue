<template>
  <svg
    class="item-selection-overlay"
    viewBox="0 0 45 34"
    preserveAspectRatio="none"
    shape-rendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <!-- Separate filled paths preserve the reference's square ends and gaps. -->
    <g fill="currentColor">
      <!-- Outer upper-left bracket. -->
      <path d="M0 0H16V1H1V10H0Z" />
      <!-- Inset upper-left step, across the top, and short right return. -->
      <path d="M17 0H45V2H44V1H18V3H3V12H1V27H0V11H2V2H17Z" />
      <!-- Lower-left bracket, separated from both adjoining edges. -->
      <path d="M0 29H1V33H7V34H0Z" />
      <!-- Right edge turns inward before stepping down to the bottom edge. -->
      <path d="M44 4H45V32H37V34H9V33H36V31H44Z" />
      <!-- Detached lower-right underline. -->
      <path d="M38 33H45V34H38Z" />
    </g>
  </svg>
</template>

<style scoped>
.item-selection-overlay {
  position: absolute;
  z-index: 1;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  color: var(--item-selector-color, #ed0033);
  animation: item-selector-pulse var(--item-selector-duration, 1s) steps(1, end) infinite;
}

/* Hold each shade for half a cycle, then switch instantly.
   Only the SVG is darkened; its base color remains configurable. */
@keyframes item-selector-pulse {
  0%, 100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(var(--item-selector-dark-brightness, 0.35));
  }
}

</style>
