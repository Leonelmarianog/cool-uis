<script setup>
import portrait from '../assets/jill-valentine-portrait.png'
</script>

<template>
  <section class="character-portrait-panel" aria-label="Character portrait">
    <div class="character-portrait-panel__connector" aria-hidden="true">
      <span class="character-portrait-panel__connector-top">
        <span class="character-portrait-panel__connector-cap"></span>
      </span>
    </div>
    <div class="character-portrait-panel__housing">
      <div class="character-portrait-panel__frame">
        <img
          class="character-portrait-panel__image"
          :src="portrait"
          alt="Jill Valentine"
          width="136"
          height="137"
        />
        <span class="character-portrait-panel__frame-strip" aria-hidden="true">
          <span v-for="section in 3" :key="section" class="character-portrait-panel__frame-section"></span>
        </span>
        <div class="character-portrait-panel__control" aria-hidden="true"></div>
      </div>
    </div>
    <div class="character-portrait-panel__mount" aria-hidden="true">
      <span class="character-portrait-panel__connector-cap"></span>
    </div>
    <div class="character-portrait-panel__tubes" aria-hidden="true">
      <span class="character-portrait-panel__tube character-portrait-panel__tube--upper"></span>
      <span class="character-portrait-panel__tube character-portrait-panel__tube--lower"></span>
    </div>
  </section>
</template>

<style scoped>
.character-portrait-panel {
  --bar-border: #666b5d;
  --bar-body: #a7aa99;
  --bar-border-shade: #3e4038;
  --bar-body-shade: #64665c;

  /* Reference housing: 280 × 172, including the connectors on the left. */
  --portrait-metal-light: #aaa799;
  --portrait-metal-dark: #535a4d;
  --portrait-edge: #30372f;
  --portrait-connector-border-dark: #38423a;
  --portrait-gray: #747476;
  --portrait-connector-border-light: var(--portrait-gray);
  --portrait-connector-top-border: #0e180d;
  --portrait-connector-face: #38413c;
  --portrait-connector-cap: #201e1f;
  --portrait-connector-cap-border: #121a0f;
  --portrait-frame-gray: var(--portrait-gray);
  --portrait-frame-green: #666c5c;
  --portrait-frame-inset: #aaa799;

  /* Connector size is relative to the panel; face and bars are relative to the connector. */
  --connector-width: 0.16;
  --connector-height: 0.88;
  --connector-face-width: 0.795;
  --connector-face-height: 0.2542;
  --connector-bars-height: 0.47;
  --housing-left: 14%;
  --frame-strip-width: calc(2 * var(--ui-pixel));

  position: relative;
  width: 100%;
  aspect-ratio: 280 / 172;
  isolation: isolate;
}

.character-portrait-panel__tubes {
  --tube-dark: #091009;
  --tube-mid: #39433b;
  --tube-light: #5a5849;

  position: absolute;
  top: 50%;
  left: 100%;
  display: grid;
  gap: calc(8 * var(--ui-pixel));
  width: calc(2 * var(--ui-pixel));
  transform: translateY(-50%);
}

.character-portrait-panel__tube {
  background: linear-gradient(to bottom,
    var(--tube-dark) 0 20%,
    var(--tube-mid) 20% 40%,
    var(--tube-light) 40% 60%,
    var(--tube-mid) 60% 80%,
    var(--tube-dark) 80% 100%
  );
}

.character-portrait-panel__tube--upper {
  height: calc(20 * var(--ui-pixel));
  background: linear-gradient(to bottom,
    var(--tube-dark) 0 10%,
    var(--tube-mid) 10% 25%,
    var(--tube-light) 25% 75%,
    var(--tube-mid) 75% 90%,
    var(--tube-dark) 90% 100%
  );
}

.character-portrait-panel__tube--lower {
  height: calc(5 * var(--ui-pixel));
}

.character-portrait-panel__connector {
  position: absolute;
  inset: 0 auto calc(100% - var(--connector-height) * 100%) 0;
  width: calc(var(--connector-width) * 100%);
  background:
    repeating-linear-gradient(to bottom,
      var(--bar-border) 0 var(--ui-pixel),
      var(--bar-body) var(--ui-pixel) calc(2 * var(--ui-pixel)),
      var(--bar-border) calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
      transparent calc(3 * var(--ui-pixel)) calc(7 * var(--ui-pixel))
    ) bottom / 100% calc(var(--connector-bars-height) * 100%) no-repeat;
  /* Include the outlined cap above the connector. */
  clip-path: polygon(
    8% calc(-3 * var(--ui-pixel)), 100% calc(-3 * var(--ui-pixel)),
    100% 100%, 20% 100%, 20% 45%, 0 45%, 0 25%, 8% 25%
  );
}

.character-portrait-panel__connector-top,
.character-portrait-panel__mount {
  position: absolute;
  top: 0;
  box-shadow: inset 0 var(--ui-pixel) var(--portrait-connector-face);
  border-right: var(--ui-pixel) solid var(--portrait-connector-top-border);
  border-bottom: var(--ui-pixel) solid var(--portrait-connector-top-border);
  background: var(--portrait-metal-dark);
}

.character-portrait-panel__connector-top {
  left: 8%;
  width: calc(var(--connector-face-width) * 100%);
  height: calc(var(--connector-face-height) * 100%);
}

.character-portrait-panel__connector-cap {
  position: absolute;
  bottom: 100%;
  left: 50%;
  /* The inner line spans the same five art pixels as the eyes. */
  width: calc(7 * var(--ui-pixel));
  height: calc(2 * var(--ui-pixel));
  transform: translateX(-50%);
  border: var(--ui-pixel) solid var(--portrait-connector-cap-border);
  border-bottom: 0;
  background: var(--portrait-connector-cap);
}

.character-portrait-panel__mount .character-portrait-panel__connector-cap {
  width: calc(6 * var(--ui-pixel));
}

/* Eyes and centered mouth, shared by both face rectangles. */
.character-portrait-panel__connector-top::before,
.character-portrait-panel__mount::before {
  position: absolute;
  top: var(--ui-pixel);
  left: 50%;
  width: calc(5 * var(--ui-pixel));
  height: calc(6 * var(--ui-pixel));
  transform: translateX(-50%);
  content: '';
  background:
    linear-gradient(var(--portrait-connector-face), var(--portrait-connector-face))
      top left / var(--ui-pixel) calc(4 * var(--ui-pixel)) no-repeat,
    linear-gradient(var(--portrait-connector-face), var(--portrait-connector-face))
      top right / var(--ui-pixel) calc(4 * var(--ui-pixel)) no-repeat,
    linear-gradient(var(--portrait-connector-face), var(--portrait-connector-face))
      bottom center / calc(3 * var(--ui-pixel)) var(--ui-pixel) no-repeat;
}

/* One cheek pixel at each bottom inner corner. */
.character-portrait-panel__connector-top::after,
.character-portrait-panel__mount::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: var(--ui-pixel);
  content: '';
  background:
    linear-gradient(var(--portrait-connector-face), var(--portrait-connector-face))
      left / var(--ui-pixel) 100% no-repeat,
    linear-gradient(var(--portrait-connector-face), var(--portrait-connector-face))
      right / var(--ui-pixel) 100% no-repeat;
}

/* Light connector rectangle, including its empty bottom-left corner. */
.character-portrait-panel__connector::before {
  position: absolute;
  /* Match the original rectangle's background position: 31% of the remaining 82%. */
  top: calc(var(--connector-face-height) * 100%);
  left: 0;
  width: calc(var(--housing-left) / var(--connector-width));
  height: 18%;
  content: '';
  background:
    linear-gradient(var(--portrait-connector-border-dark), var(--portrait-connector-border-dark))
      right / var(--ui-pixel) 100% no-repeat,
    linear-gradient(var(--portrait-connector-border-light), var(--portrait-connector-border-light))
      top left / calc(100% - var(--ui-pixel)) var(--ui-pixel) no-repeat,
    linear-gradient(var(--portrait-connector-border-dark), var(--portrait-connector-border-dark))
      bottom right / calc(100% - var(--ui-pixel)) var(--ui-pixel) no-repeat,
    linear-gradient(var(--portrait-connector-border-light), var(--portrait-connector-border-light))
      left 0 bottom var(--ui-pixel) / var(--ui-pixel) var(--ui-pixel) no-repeat,
    linear-gradient(var(--portrait-metal-light), var(--portrait-metal-light))
      top left / 100% calc(100% - var(--ui-pixel)) no-repeat;
}

/* Right-end shading on the three connector bars. */
.character-portrait-panel::before {
  position: absolute;
  z-index: 1;
  bottom: calc(100% - var(--connector-height) * 100%);
  /* Align the darker body edge to whole pixels before the housing. */
  left: calc(round(down, var(--housing-left), 1px) - var(--ui-pixel));
  width: var(--ui-pixel);
  /* Match the bars: 47% of the connector's 88% panel height. */
  height: calc(var(--connector-height) * var(--connector-bars-height) * 100%);
  content: '';
  background: repeating-linear-gradient(to bottom,
    transparent 0 var(--ui-pixel),
    var(--bar-body-shade) var(--ui-pixel) calc(2 * var(--ui-pixel)),
    transparent calc(2 * var(--ui-pixel)) calc(7 * var(--ui-pixel))
  );
}

/* Left-end shading shares the bars' repeating color boundaries. */
.character-portrait-panel__connector::after {
  position: absolute;
  bottom: 0;
  left: 20%;
  width: var(--ui-pixel);
  height: calc(var(--connector-bars-height) * 100%);
  content: '';
  background: repeating-linear-gradient(to bottom,
    var(--bar-border-shade) 0 var(--ui-pixel),
    var(--bar-body-shade) var(--ui-pixel) calc(2 * var(--ui-pixel)),
    var(--bar-border-shade) calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    transparent calc(3 * var(--ui-pixel)) calc(7 * var(--ui-pixel))
  );
}

.character-portrait-panel__housing {
  position: absolute;
  inset: 0 0 0 var(--housing-left);
  background: linear-gradient(to top, #718b72, #949285, #afa194);
  box-shadow: inset var(--ui-pixel) 0 var(--portrait-gray);
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) 100%, 0 100%
  );
}

.character-portrait-panel__housing::after {
  --corner-shadow: rgb(14 24 13 / 30%);

  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(4 * var(--ui-pixel));
  height: calc(4 * var(--ui-pixel));
  content: '';
  pointer-events: none;
  background:
    linear-gradient(var(--corner-shadow), var(--corner-shadow))
      bottom right / calc(2 * var(--ui-pixel)) calc(2 * var(--ui-pixel)) no-repeat,
    var(--corner-shadow);
  /* Follow the cut, then extend two art pixels along the right and bottom edges. */
  clip-path: polygon(
    100% 0,
    100% calc(3 * var(--ui-pixel)),
    calc(3 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(3 * var(--ui-pixel)) 100%,
    0 100%,
    0 calc(3 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    calc(2 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(3 * var(--ui-pixel)) calc(2 * var(--ui-pixel)),
    calc(3 * var(--ui-pixel)) 0
  );
}

.character-portrait-panel__mount {
  /* Match the connector rectangle's panel-relative dimensions, minus one art pixel. */
  right: calc((100% - var(--housing-left)) * 0.04);
  width: calc(var(--connector-width) * var(--connector-face-width) * 100% - var(--ui-pixel));
  height: calc(var(--connector-height) * var(--connector-face-height) * 100%);
  border-left: var(--ui-pixel) solid var(--portrait-connector-top-border);
  box-shadow:
    inset 0 var(--ui-pixel) var(--portrait-connector-face),
    0 var(--ui-pixel) var(--portrait-frame-gray);
}

.character-portrait-panel__mount::before {
  left: var(--ui-pixel);
  width: calc(100% - 2 * var(--ui-pixel));
  transform: none;
  background-size:
    var(--ui-pixel) calc(4 * var(--ui-pixel)),
    var(--ui-pixel) calc(4 * var(--ui-pixel)),
    calc(100% - 2 * var(--ui-pixel)) var(--ui-pixel);
}

.character-portrait-panel__frame {
  position: absolute;
  inset: 8.14% auto auto 7.5%;
  width: calc(63.75% - 2 * var(--ui-pixel));
  aspect-ratio: 1;
  padding: var(--ui-pixel);
  background: var(--portrait-frame-gray);
}

.character-portrait-panel__frame-strip {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: var(--ui-pixel);
  width: var(--frame-strip-width);
  padding: var(--ui-pixel) var(--ui-pixel) var(--ui-pixel) 0;
  background: var(--portrait-frame-green);
}

.character-portrait-panel__frame-section {
  background: var(--portrait-frame-inset);
}

.character-portrait-panel__image {
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.character-portrait-panel__control {
  --control-tone-1: #5b594a;
  --control-tone-2: #6a6964;
  --control-tone-3: #7a8273;
  --control-tone-4: #93928d;
  --control-tone-5: #83897b;
  --control-tone-6: #b0a9a3;
  --control-tone-7: #859179;
  --control-tone-8: #bdb9ae;
  --control-tab: #6d7461;

  position: absolute;
  left: calc(100% + var(--frame-strip-width));
  bottom: 0;
  width: calc(5 * var(--ui-pixel));
  height: calc(17 * var(--ui-pixel));
  padding: var(--ui-pixel);
  background: var(--portrait-edge);
}

/* Fifteen hard-edged bands, mirrored around the central highlight. */
.character-portrait-panel__control::before {
  display: block;
  height: 100%;
  content: '';
  background: linear-gradient(to bottom,
    var(--control-tone-1) 0 var(--ui-pixel),
    var(--control-tone-2) var(--ui-pixel) calc(2 * var(--ui-pixel)),
    var(--control-tone-3) calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    var(--control-tone-4) calc(3 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    var(--control-tone-5) calc(4 * var(--ui-pixel)) calc(5 * var(--ui-pixel)),
    var(--control-tone-6) calc(5 * var(--ui-pixel)) calc(6 * var(--ui-pixel)),
    var(--control-tone-7) calc(6 * var(--ui-pixel)) calc(7 * var(--ui-pixel)),
    var(--control-tone-8) calc(7 * var(--ui-pixel)) calc(8 * var(--ui-pixel)),
    var(--control-tone-7) calc(8 * var(--ui-pixel)) calc(9 * var(--ui-pixel)),
    var(--control-tone-6) calc(9 * var(--ui-pixel)) calc(10 * var(--ui-pixel)),
    var(--control-tone-5) calc(10 * var(--ui-pixel)) calc(11 * var(--ui-pixel)),
    var(--control-tone-4) calc(11 * var(--ui-pixel)) calc(12 * var(--ui-pixel)),
    var(--control-tone-3) calc(12 * var(--ui-pixel)) calc(13 * var(--ui-pixel)),
    var(--control-tone-2) calc(13 * var(--ui-pixel)) calc(14 * var(--ui-pixel)),
    var(--control-tone-1) calc(14 * var(--ui-pixel)) 100%
  );
}

/* Stepped tab above the control and its upward shadow. */
.character-portrait-panel__control::after {
  position: absolute;
  right: 25%;
  bottom: calc(100% + 2 * var(--ui-pixel));
  width: calc(2 * var(--ui-pixel));
  height: calc(5 * var(--ui-pixel));
  content: '';
  filter: drop-shadow(0 calc(-1 * var(--ui-pixel)) 0 var(--portrait-frame-gray));
  background:
    linear-gradient(var(--control-tab), var(--control-tab))
      bottom left / var(--ui-pixel) 50% no-repeat,
    linear-gradient(var(--control-tab), var(--control-tab))
      right / var(--ui-pixel) 100% no-repeat;
}
</style>
