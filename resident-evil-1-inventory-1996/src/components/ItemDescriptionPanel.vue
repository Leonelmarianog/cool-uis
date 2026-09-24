<script setup>
defineProps({
  itemName: { type: String, default: 'F.-AID SPRAY' },
})
</script>

<template>
  <section class="item-description-panel" aria-label="Item description panel">
    <slot>
      <p class="item-description-panel__name">{{ itemName }}</p>
    </slot>
    <div class="item-description-panel__lower-frame" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.item-description-panel {
  /* Frame and text palette. The top border shares the gradient's light end. */
  --description-metal-light: #929a85;
  --description-metal: #73796a;
  --description-metal-mid: #686f60;
  --description-metal-dark: #535e50;
  --description-ink: #000;
  --description-text: #c1beb2;
  --description-text-outline: #434356;

  /* Frame geometry: the seam is a line over the metal, not a cutout. */
  --description-frame-height: calc(18 * var(--ui-pixel));
  --description-seam-depth: calc(10 * var(--ui-pixel));
  --description-seam-width: var(--ui-pixel);
  --description-seam-left: 36.666667%;

  /* Horizontal placement scales with panel width; outline stays one art pixel. */
  --description-name-left: 15%;
  --description-text-outline-width: var(--ui-pixel);

  /* Preserve the approved development size at every UI scale. */
  position: relative;
  width: calc(216 * var(--ui-pixel));
  height: calc(56 * var(--ui-pixel));
  border-top: calc(2 * var(--ui-pixel)) solid var(--description-metal-light);
  background: var(--description-ink);
}

.item-description-panel__name {
  margin: 0;
  padding: var(--ui-pixel) calc(4 * var(--ui-pixel)) 0 var(--description-name-left);
  color: var(--description-text);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: calc(14 * var(--ui-pixel));
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--ui-pixel);

  /* A stroke straddles the glyph edge. Paint the fill last to preserve the
     letter face and leave one art pixel of outline visible on the outside. */
  -webkit-text-stroke-width: calc(2 * var(--description-text-outline-width));
  -webkit-text-stroke-color: var(--description-text-outline);
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
  inset: 0 0 auto var(--description-seam-left);
  height: var(--description-seam-depth);
  border-left: var(--description-seam-width) solid var(--description-ink);
  border-bottom: var(--description-seam-width) solid var(--description-ink);
  content: '';
}
</style>
