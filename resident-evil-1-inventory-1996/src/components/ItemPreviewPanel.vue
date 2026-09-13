<template>
  <section class="item-preview-panel" aria-label="Item preview">
    <div class="item-preview-panel__sidebar" aria-hidden="true"></div>
    <div class="item-preview-panel__display">
      <slot />
      <div class="item-preview-panel__right-edge" aria-hidden="true">
        <span class="item-preview-panel__right-strip item-preview-panel__right-strip--inner"></span>
        <span class="item-preview-panel__right-strip item-preview-panel__right-strip--highlight"></span>
        <span class="item-preview-panel__right-strip item-preview-panel__right-strip--dark"></span>
        <span class="item-preview-panel__right-strip item-preview-panel__right-strip--outer"></span>
      </div>
    </div>
    <span
      v-for="corner in ['top-left', 'top-right', 'bottom-left', 'bottom-right']"
      :key="corner"
      class="item-preview-panel__fastener"
      :class="`item-preview-panel__fastener--${corner}`"
      aria-hidden="true"
    ></span>
  </section>
</template>

<style scoped>
.item-preview-panel {
  /* Local dimensions follow the reference's 864 × 576 panel. */
  --rail-height: 6.25%;
  --rail-width: 2.083333%;
  --metal: linear-gradient(
    to bottom,
    #9da2a5 0%,
    #9da2a5 7%,
    #628172 12%,
    #628172 16%,
    #bdaa9c 23%,
    #bdaa9c 27%,
    #7caa85 45%,
    #7caa85 67%,
    #813560 81%,
    #813560 86%,
    #9da2a5 93%,
    #9da2a5 100%
  );

  position: relative;
  isolation: isolate;
  width: calc(216 * var(--ui-pixel));
  aspect-ratio: 3 / 2;
  background: var(--metal);
  /* Clip the backing too, so it cannot fill the rails' corner cutouts. */
  clip-path: polygon(
    var(--ui-pixel) 0, calc(100% - var(--ui-pixel)) 0,
    calc(100% - var(--ui-pixel)) var(--ui-pixel), 100% var(--ui-pixel),
    100% calc(100% - var(--ui-pixel)), calc(100% - var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) 100%, var(--ui-pixel) 100%,
    var(--ui-pixel) calc(100% - var(--ui-pixel)), 0 calc(100% - var(--ui-pixel)),
    0 var(--ui-pixel), var(--ui-pixel) var(--ui-pixel)
  );
}

.item-preview-panel::before,
.item-preview-panel::after {
  position: absolute;
  z-index: 2;
  right: 0;
  left: 0;
  height: var(--rail-height);
  content: '';
  clip-path: polygon(
    var(--ui-pixel) 0, calc(100% - var(--ui-pixel)) 0,
    calc(100% - var(--ui-pixel)) var(--ui-pixel), 100% var(--ui-pixel),
    100% 100%, 0 100%, 0 var(--ui-pixel), var(--ui-pixel) var(--ui-pixel)
  );
  background: linear-gradient(to bottom, #718b72, #afa194);
}

.item-preview-panel::before {
  top: 0;
}

.item-preview-panel::after {
  bottom: 0;
  transform: scaleY(-1);
}

.item-preview-panel__sidebar {
  position: absolute;
  inset: 6.944444% auto 6.944444% var(--rail-width);
  width: 8.333333%;
  background: var(--color-preview-sidebar);
  /* Earlier inset shadows cover later ones, giving the vertical edges square corners. */
  box-shadow:
    inset var(--ui-pixel) 0 #263629,
    inset calc(-1 * var(--ui-pixel)) 0 #263629,
    inset 0 var(--ui-pixel) #7e9e73,
    inset 0 calc(-1 * var(--ui-pixel)) #7e9e73;
}

.item-preview-panel__display {
  --display-strip-height: var(--ui-pixel);
  --right-edge-pixel: var(--ui-pixel);
  --right-edge-black: #111114;
  --right-edge-dark: #39383e;
  --right-edge-mid: #68676d;
  --right-edge-light: #807f87;

  /* Four reflective strips, ordered from the outer edge toward the display. */
  --display-strip-1: linear-gradient(
    to right,
    #5a5a58, #5a5a58, #5a5a58, #a9aaaf, #5a5a58, #5a5a58
  );
  --display-strip-2: linear-gradient(
    to right,
    #a9aaaf, #5a5a58, #5a5a58, #a9aaaf, #5a5a58, #a9aaaf
  );
  --display-strip-3: var(--display-strip-2);
  --display-strip-4: linear-gradient(#292929, #292929);

  position: absolute;
  inset: var(--rail-height) 2.430556% var(--rail-height) 11.805556%;
  overflow: hidden;
  padding-block: calc(4 * var(--display-strip-height));
  padding-right: calc(4 * var(--right-edge-pixel));
  background: var(--color-preview-background);
  /* With no horizontal borders, this line has uninterrupted square corners. */
  border-left: var(--ui-pixel) solid #27262c;
}

.item-preview-panel__display::before,
.item-preview-panel__display::after {
  position: absolute;
  right: 0;
  left: 0;
  height: calc(4 * var(--display-strip-height));
  content: '';
  pointer-events: none;
  background-image:
    var(--display-strip-1),
    var(--display-strip-2),
    var(--display-strip-3),
    var(--display-strip-4);
  background-size: 100% var(--display-strip-height);
  background-position:
    0 0,
    0 var(--display-strip-height),
    0 calc(2 * var(--display-strip-height)),
    0 calc(3 * var(--display-strip-height));
  background-repeat: no-repeat;
}

.item-preview-panel__display::before {
  top: 0;
}

.item-preview-panel__display::after {
  bottom: 0;
  transform: scaleY(-1);
}

.item-preview-panel__right-edge {
  position: absolute;
  z-index: 1;
  inset: 0 0 0 auto;
  display: flex;
  width: calc(4 * var(--right-edge-pixel));
  pointer-events: none;
}

.item-preview-panel__right-strip {
  flex: 1;
  /* Count upward from the bottom: dark dividers at pixels 1, 17, 33… */
  background: repeating-linear-gradient(
    to top,
    var(--right-edge-black) 0 var(--right-edge-pixel),
    var(--right-edge-dark) var(--right-edge-pixel) calc(2 * var(--right-edge-pixel))
  );
}

.item-preview-panel__right-strip--highlight {
  background:
    repeating-linear-gradient(
      to top,
      var(--right-edge-black) 0 var(--right-edge-pixel),
      var(--right-edge-light) var(--right-edge-pixel) calc(2 * var(--right-edge-pixel)),
      transparent calc(2 * var(--right-edge-pixel)) calc(15 * var(--right-edge-pixel)),
      var(--right-edge-light) calc(15 * var(--right-edge-pixel)) calc(16 * var(--right-edge-pixel))
    ),
    repeating-linear-gradient(
      to top,
      var(--right-edge-dark) 0 var(--right-edge-pixel),
      var(--right-edge-mid) var(--right-edge-pixel) calc(2 * var(--right-edge-pixel))
    );
}

.item-preview-panel__right-strip--outer {
  background: repeating-linear-gradient(
    to top,
    var(--right-edge-black) 0 var(--right-edge-pixel),
    var(--right-edge-light) var(--right-edge-pixel) calc(16 * var(--right-edge-pixel))
  );
}

/* The top segment has no closing black divider, even when the panel resizes. */
.item-preview-panel__right-edge::after {
  position: absolute;
  inset: 0 0 auto;
  height: var(--right-edge-pixel);
  content: '';
  background: linear-gradient(
    to right,
    var(--right-edge-dark) 0 25%,
    var(--right-edge-light) 25% 50%,
    var(--right-edge-dark) 50% 75%,
    var(--right-edge-light) 75% 100%
  );
}

.item-preview-panel__fastener {
  position: absolute;
  z-index: 3;
  width: calc(6 * var(--ui-pixel));
  aspect-ratio: 1;
  /* Six-by-six pixel circle; each cardinal edge is two pixels long. */
  background: #000;
  clip-path: polygon(
    33.333333% 0, 66.666667% 0,
    66.666667% 16.666667%, 83.333333% 16.666667%,
    83.333333% 33.333333%, 100% 33.333333%,
    100% 66.666667%, 83.333333% 66.666667%,
    83.333333% 83.333333%, 66.666667% 83.333333%,
    66.666667% 100%, 33.333333% 100%,
    33.333333% 83.333333%, 16.666667% 83.333333%,
    16.666667% 66.666667%, 0 66.666667%,
    0 33.333333%, 16.666667% 33.333333%,
    16.666667% 16.666667%, 33.333333% 16.666667%
  );
}

.item-preview-panel__fastener::before {
  position: absolute;
  inset: 16.666667%;
  content: '';
  /* Dark gray interior with a solid black 2×2 center. */
  background: linear-gradient(#000, #000) center / 50% 50% no-repeat #494941;
  clip-path: polygon(
    25% 0, 75% 0, 75% 25%, 100% 25%,
    100% 75%, 75% 75%, 75% 100%, 25% 100%,
    25% 75%, 0 75%, 0 25%, 25% 25%
  );
}

.item-preview-panel__fastener--top-left {
  top: 0.694444%;
  left: 0.347222%;
}
.item-preview-panel__fastener--top-right {
  top: 0.694444%;
  right: 0.347222%;
}
.item-preview-panel__fastener--bottom-left {
  bottom: 0.694444%;
  left: 0.347222%;
}
.item-preview-panel__fastener--bottom-right {
  bottom: 0.694444%;
  right: 0.347222%;
}
</style>
