<!--
  Red frame around the highlighted item action, recreated from design/ui-sprites.png.
  48 × 24 art pixels: the button's width, reaching 2 pixels above and below it.
  One viewBox unit is one art pixel; each path segment is one run of pixels.
-->
<template>
  <svg
    class="item-action-overlay"
    viewBox="0 0 48 24"
    preserveAspectRatio="none"
    shape-rendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="#d60021">
      <!-- Top edge, doubled, with a tab at each corner. -->
      <path d="M2 0H46V1H2Z M1 1H2V2H1Z M5 1H43V2H5Z M46 1H47V2H46Z M0 2H6V3H0Z M42 2H48V3H42Z" />
      <!-- Single-pixel sides. -->
      <path d="M0 3H1V21H0Z M47 3H48V21H47Z" />
      <!-- Bottom edge: a tab at each corner, then a doubled edge. -->
      <path d="M0 21H6V22H0Z M42 21H48V22H42Z M1 22H47V23H1Z M2 23H46V24H2Z" />
    </g>
    <g fill="#5a1010">
      <!-- Rounded top corners and the notches beside them. -->
      <path d="M1 0H2V1H1Z M46 0H47V1H46Z M0 1H1V2H0Z M2 1H5V2H2Z M43 1H46V2H43Z M47 1H48V2H47Z" />
      <!-- Ends of the corner tabs. -->
      <path d="M6 2H8V3H6Z M40 2H42V3H40Z M6 21H8V22H6Z M40 21H42V22H40Z" />
      <!-- Rounded bottom corners. -->
      <path d="M0 22H1V23H0Z M47 22H48V23H47Z M1 23H2V24H1Z M46 23H47V24H46Z" />
    </g>
  </svg>
</template>

<style scoped>
.item-action-overlay {
  position: absolute;
  top: calc(-2 * var(--ui-pixel));
  left: 0;
  width: 100%;
  height: calc(100% + 4 * var(--ui-pixel));
  pointer-events: none;
}
</style>
