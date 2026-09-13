<script setup>
defineProps({
  itemName: { type: String, default: 'F.-AID SPRAY' },
})
</script>

<template>
  <section class="item-description-panel" aria-label="Item description panel">
    <p class="item-description-panel__name">{{ itemName }}</p>
    <div class="item-description-panel__lower-frame" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.item-description-panel {
  --description-metal-light: #929a85;
  --description-metal: #73796a;
  --description-metal-mid: #686f60;
  --description-metal-dark: #535e50;
  --description-ink: #000;
  --description-text: #c1beb2;
  --description-text-outline: #434356;
  --description-text-outline-width: var(--ui-pixel);
  --description-frame-height: calc(18 * var(--ui-pixel));
  --description-notch-depth: calc(10 * var(--ui-pixel));
  --description-notch-left: 36.666667%;

  position: relative;
  width: calc(360 * var(--ui-pixel));
  max-width: 100%;
  height: calc(56 * var(--ui-pixel));
  border-top: calc(2 * var(--ui-pixel)) solid var(--description-metal-light);
  background: var(--description-ink);
}

.item-description-panel__name {
  margin: 0;
  padding: var(--ui-pixel) calc(4 * var(--ui-pixel)) 0 15%;
  color: var(--description-text);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: calc(14 * var(--ui-pixel));
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--ui-pixel);
  /* A stroke straddles the glyph edge. Paint the fill last to preserve the
     letter face and leave one art pixel of outline visible on the outside. */
  -webkit-text-stroke: calc(2 * var(--description-text-outline-width)) var(--description-text-outline);
  paint-order: stroke fill;
}

.item-description-panel__lower-frame {
  position: absolute;
  inset: auto 0 0;
  height: var(--description-frame-height);
  background: linear-gradient(
    to bottom,
    var(--description-metal-light),
    var(--description-metal),
    var(--description-metal-mid),
    var(--description-metal-dark)
  );
}

/* The black seam drops into the frame, then continues to the right edge. */
.item-description-panel__lower-frame::after {
  position: absolute;
  inset: 0 0 auto var(--description-notch-left);
  height: var(--description-notch-depth);
  border-left: var(--ui-pixel) solid var(--description-ink);
  border-bottom: var(--ui-pixel) solid var(--description-ink);
  content: '';
}
</style>
