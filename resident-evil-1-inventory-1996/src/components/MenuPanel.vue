<script setup>
defineEmits(['map', 'file', 'exit'])
</script>

<template>
  <nav class="menu-panel" aria-label="Inventory menu">
    <div class="menu-panel__grid">
      <button class="menu-panel__button" type="button" @click="$emit('map')">
        <span class="menu-panel__label">MAP</span>
      </button>
      <button class="menu-panel__button" type="button" @click="$emit('file')">
        <span class="menu-panel__label">FILE</span>
      </button>
      <div class="menu-panel__button menu-panel__button--blank" aria-hidden="true">
        <span class="menu-panel__dash"></span>
      </div>
      <button class="menu-panel__button" type="button" @click="$emit('exit')">
        <span class="menu-panel__label">EXIT</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.menu-panel {
  --menu-ink: #050704;
  --menu-rim-light: #b6b8a5;
  --menu-rim-mid: #999d8d;
  --menu-rim-dark: #72796c;
  --menu-metal-light: #a7a6a8;
  --menu-metal-mid: #929193;
  --menu-metal-dark: #68686a;
  --menu-highlight: #c5242c;
  --menu-metal-center: #858486;
  --menu-label-shadow: #424340;

  --menu-panel-padding: calc(5 * var(--ui-pixel));
  --menu-grid-overhang: var(--ui-pixel);

  /* Shared by the panel and buttons: remove one square art pixel per corner. */
  --menu-corner-cutaway: polygon(
    var(--ui-pixel) 0,
    calc(100% - var(--ui-pixel)) 0,
    calc(100% - var(--ui-pixel)) var(--ui-pixel),
    100% var(--ui-pixel),
    100% calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    calc(100% - var(--ui-pixel)) 100%,
    var(--ui-pixel) 100%,
    var(--ui-pixel) calc(100% - var(--ui-pixel)),
    0 calc(100% - var(--ui-pixel)),
    0 var(--ui-pixel),
    var(--ui-pixel) var(--ui-pixel)
  );

  position: relative;
  width: calc(117 * var(--ui-pixel));
  height: calc(45 * var(--ui-pixel));
  padding: var(--menu-panel-padding);
  clip-path: var(--menu-corner-cutaway);
  background: linear-gradient(to bottom,
    var(--menu-rim-dark),
    var(--menu-rim-light) 15%,
    var(--menu-rim-mid) 38%,
    var(--menu-rim-dark) 60%,
    var(--menu-rim-light) 85%,
    var(--menu-rim-dark));
}

/* Solid black inset ring between the metallic outer frame and buttons. */
.menu-panel::before {
  content: '';
  position: absolute;
  inset: calc(2 * var(--ui-pixel));
  border: var(--ui-pixel) solid #000;
  pointer-events: none;
}

.menu-panel__grid {
  /* Both seam backings leave the outer and central corner cutaways open. */
  --menu-seam-stops:
    transparent var(--ui-pixel),
    var(--menu-ink) var(--ui-pixel) calc(50% - var(--ui-pixel)),
    transparent calc(50% - var(--ui-pixel)) calc(50% + var(--ui-pixel)),
    var(--menu-ink) calc(50% + var(--ui-pixel)) calc(100% - var(--ui-pixel)),
    transparent calc(100% - var(--ui-pixel));

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  /* Extend equally on all sides to include the buttons' outer black borders. */
  width: calc(100% + 2 * var(--menu-grid-overhang));
  height: calc(100% + 2 * var(--menu-grid-overhang));
  margin: calc(-1 * var(--menu-grid-overhang));
  /* Back shared edges against fractional zoom seams. */
  background:
    linear-gradient(to right, var(--menu-seam-stops))
      center / 100% var(--ui-pixel) no-repeat,
    linear-gradient(to bottom, var(--menu-seam-stops))
      center / var(--ui-pixel) 100% no-repeat;
}

.menu-panel__button {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  padding: 0;
  border: solid var(--menu-ink);
  border-width: var(--ui-pixel) calc(2 * var(--ui-pixel));
  border-radius: 0;
  color: var(--menu-ink);
  clip-path: var(--menu-corner-cutaway);
  background:
    linear-gradient(to bottom,
      var(--menu-metal-dark) 0 var(--ui-pixel),
      var(--menu-metal-mid) var(--ui-pixel) 12%,
      var(--menu-metal-light) 27%,
      var(--menu-metal-mid) 43%,
      var(--menu-metal-center) 52%,
      var(--menu-metal-light) 73%,
      var(--menu-metal-mid) 87%,
      var(--menu-metal-dark) 100%);
  background-origin: padding-box;
  background-clip: padding-box;
  box-shadow: inset 0 calc(-1 * var(--ui-pixel)) 0 #494b47;
  cursor: pointer;
}

.menu-panel__label {
  display: block;
  font-family: 'Teko', 'Arial Narrow', sans-serif;
  font-size: calc(20 * var(--ui-pixel));
  font-weight: 400;
  line-height: 0.8;
  letter-spacing: calc(0.25 * var(--ui-pixel));
  transform: translateY(calc(1 * var(--ui-pixel))) scaleX(1.15);
  text-shadow: calc(0.5 * var(--ui-pixel)) 0 var(--menu-label-shadow);
}

.menu-panel__button--blank {
  cursor: default;
}

@media (hover: hover) {
  .menu-panel__button:not(.menu-panel__button--blank):hover {
    --menu-metal-dark: #929294;
    --menu-metal-mid: #b6b6b8;
    --menu-metal-light: #d3d3d5;
    --menu-metal-center: #aaa9ac;
    --menu-label-shadow: #747476;

    color: var(--menu-highlight);
    border-color: var(--menu-highlight);
  }
}

.menu-panel__dash {
  width: calc(26 * var(--ui-pixel));
  height: calc(4 * var(--ui-pixel));
  background: var(--menu-ink);
  box-shadow: var(--ui-pixel) 0 #454643;
}

.menu-panel__button:focus-visible {
  z-index: 1;
  outline-offset: calc(-1 * var(--ui-pixel));
}
</style>
