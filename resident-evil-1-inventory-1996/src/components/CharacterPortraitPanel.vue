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
  /* Reference housing: 280 × 172, including the connectors on the left. */
  --portrait-metal-light: #aaa799;
  --portrait-metal-mid: #929580;
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

  position: relative;
  width: 100%;
  aspect-ratio: 280 / 172;
  isolation: isolate;
}

.character-portrait-panel__tubes {
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
    #091009 0 20%,
    #39433b 20% 40%,
    #5a5849 40% 60%,
    #39433b 60% 80%,
    #091009 80% 100%
  );
}

.character-portrait-panel__tube--upper {
  height: calc(20 * var(--ui-pixel));
  background: linear-gradient(to bottom,
    #091009 0 10%,
    #39433b 10% 25%,
    #5a5849 25% 75%,
    #39433b 75% 90%,
    #091009 90% 100%
  );
}

.character-portrait-panel__tube--lower {
  height: calc(5 * var(--ui-pixel));
}

.character-portrait-panel__connector {
  position: absolute;
  inset: 0 auto 12% 0;
  width: 16%;
  background:
    repeating-linear-gradient(to bottom,
      #666b5d 0 var(--ui-pixel), #a7aa99 var(--ui-pixel) calc(2 * var(--ui-pixel)), #666b5d calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)), transparent calc(3 * var(--ui-pixel)) calc(7 * var(--ui-pixel)))
      bottom / 100% 47% no-repeat;
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
  width: 79.5%;
  height: 25.42%;
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

.character-portrait-panel__connector::before {
  position: absolute;
  /* Match the original rectangle's background position: 31% of the remaining 82%. */
  top: 25.42%;
  left: 0;
  width: 87.5%;
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

.character-portrait-panel::before {
  position: absolute;
  z-index: 1;
  bottom: 12%;
  /* Align the darker body edge to whole pixels before the housing. */
  left: calc(round(down, 14%, 1px) - var(--ui-pixel));
  width: var(--ui-pixel);
  /* Match the bars: 47% of the connector's 88% panel height. */
  height: 41.36%;
  content: '';
  background: repeating-linear-gradient(to bottom,
    transparent 0 var(--ui-pixel), #64665c var(--ui-pixel) calc(2 * var(--ui-pixel)), transparent calc(2 * var(--ui-pixel)) calc(7 * var(--ui-pixel)));
}

.character-portrait-panel__connector::after {
  position: absolute;
  bottom: 0;
  left: 20%;
  width: var(--ui-pixel);
  height: 47%;
  content: '';
  background: repeating-linear-gradient(to bottom,
    #3e4038 0 var(--ui-pixel), #64665c var(--ui-pixel) calc(2 * var(--ui-pixel)), #3e4038 calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)), transparent calc(3 * var(--ui-pixel)) calc(7 * var(--ui-pixel)));
}

.character-portrait-panel__housing {
  position: absolute;
  inset: 0 0 0 14%;
  background: linear-gradient(to top, #718b72, #949285, #afa194);
  box-shadow: inset var(--ui-pixel) 0 var(--portrait-gray);
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) 100%, 0 100%
  );
}

.character-portrait-panel__housing::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(4 * var(--ui-pixel));
  height: calc(4 * var(--ui-pixel));
  content: '';
  pointer-events: none;
  background:
    linear-gradient(rgb(14 24 13 / 30%), rgb(14 24 13 / 30%))
      bottom right / calc(2 * var(--ui-pixel)) calc(2 * var(--ui-pixel)) no-repeat,
    rgb(14 24 13 / 30%);
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
  right: 3.44%;
  width: calc(12.72% - var(--ui-pixel));
  height: 22.3696%;
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
  width: calc(2 * var(--ui-pixel));
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
  position: absolute;
  left: calc(100% + 2 * var(--ui-pixel));
  bottom: 0;
  width: calc(5 * var(--ui-pixel));
  height: calc(17 * var(--ui-pixel));
  padding: var(--ui-pixel);
  background: var(--portrait-edge);
}

.character-portrait-panel__control::before {
  display: block;
  height: 100%;
  content: '';
  background: linear-gradient(to bottom,
    #5b594a 0 var(--ui-pixel),
    #6a6964 var(--ui-pixel) calc(2 * var(--ui-pixel)),
    #7a8273 calc(2 * var(--ui-pixel)) calc(3 * var(--ui-pixel)),
    #93928d calc(3 * var(--ui-pixel)) calc(4 * var(--ui-pixel)),
    #83897b calc(4 * var(--ui-pixel)) calc(5 * var(--ui-pixel)),
    #b0a9a3 calc(5 * var(--ui-pixel)) calc(6 * var(--ui-pixel)),
    #859179 calc(6 * var(--ui-pixel)) calc(7 * var(--ui-pixel)),
    #bdb9ae calc(7 * var(--ui-pixel)) calc(8 * var(--ui-pixel)),
    #859179 calc(8 * var(--ui-pixel)) calc(9 * var(--ui-pixel)),
    #b0a9a3 calc(9 * var(--ui-pixel)) calc(10 * var(--ui-pixel)),
    #83897b calc(10 * var(--ui-pixel)) calc(11 * var(--ui-pixel)),
    #93928d calc(11 * var(--ui-pixel)) calc(12 * var(--ui-pixel)),
    #7a8273 calc(12 * var(--ui-pixel)) calc(13 * var(--ui-pixel)),
    #6a6964 calc(13 * var(--ui-pixel)) calc(14 * var(--ui-pixel)),
    #5b594a calc(14 * var(--ui-pixel)) 100%
  );
}

.character-portrait-panel__control::after {
  position: absolute;
  right: 25%;
  bottom: calc(100% + 2 * var(--ui-pixel));
  width: calc(2 * var(--ui-pixel));
  height: calc(5 * var(--ui-pixel));
  content: '';
  filter: drop-shadow(0 calc(-1 * var(--ui-pixel)) 0 var(--portrait-frame-gray));
  background:
    linear-gradient(#6d7461, #6d7461)
      bottom left / var(--ui-pixel) 50% no-repeat,
    linear-gradient(#6d7461, #6d7461)
      right / var(--ui-pixel) 100% no-repeat;
}
</style>
