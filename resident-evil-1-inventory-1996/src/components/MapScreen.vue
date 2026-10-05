<script setup lang="ts">
import aerial from '../assets/map/aerial.png';
import mansion from '../assets/map/mansion.png';
import arrowUpGrey from '../assets/map/arrow-up-grey.png';
import arrowUpGreen from '../assets/map/arrow-up-green.png';
import arrowDownGrey from '../assets/map/arrow-down-grey.png';
import arrowDownGreen from '../assets/map/arrow-down-green.png';
import floor1f from '../assets/map/floor-1f.png';
import floor2f from '../assets/map/floor-2f.png';
import { FloorMapState } from '../types/floor-map-state';
import { MapFloor } from '../types/map-floor';

const {
  floor,
  hasFloorAbove = false,
  hasFloorBelow = false,
  floorMapState = FloorMapState.Hidden,
} = defineProps<{
  /** The floor the selector shows and the floor map draws. */
  floor: MapFloor;
  /** ▲ shows: ↑ leads to another floor. */
  hasFloorAbove?: boolean;
  /** ▼ shows: ↓ leads to another floor. */
  hasFloorBelow?: boolean;
  /** Whether the floor map is hidden, growing in, shown or shrinking out. */
  floorMapState?: FloorMapState;
}>();

/** `opened` is emitted once the floor map has grown in and its rooms are bright; `closed` once it is gone and the selector can brighten. */
const emit = defineEmits<{ opened: []; closed: [] }>();

/** The only area the map has. */
const AREA_NAME = 'Mansion';

/** Each floor's map sprite and its size in game pixels. */
const FLOOR_SPRITES: Record<MapFloor, { src: string; width: number; height: number }> = {
  [MapFloor.First]: { src: floor1f, width: 159, height: 94 },
  [MapFloor.Second]: { src: floor2f, width: 154, height: 76 },
};

/** The rooms finished brightening: the floor map has opened. */
function onRoomsAnimationEnd() {
  if (floorMapState === FloorMapState.Opening) emit('opened');
}

/** The floor map finished shrinking out and the dimmed selector held: the map has closed. */
function onFloorMapAnimationEnd() {
  if (floorMapState === FloorMapState.Closing) emit('closed');
}
</script>

<template>
  <section class="map-screen" aria-label="Map">
    <div
      class="map-screen__selector"
      :class="{ 'map-screen__selector--dimmed': floorMapState !== FloorMapState.Hidden }"
    >
      <div class="map-screen__aerial">
        <img class="map-screen__aerial-view" :src="aerial" alt="" />
        <img class="map-screen__area" :src="mansion" alt="" />
      </div>
      <p class="map-screen__label">
        <span class="map-screen__area-name">{{ AREA_NAME }}</span>
        <!-- The key restarts the arrows' grey-to-green change on each floor. -->
        <span :key="floor" class="map-screen__floor"
          >{{ floor
          }}<span
            v-if="hasFloorAbove"
            class="map-screen__arrow map-screen__arrow--up"
            role="img"
            aria-label="Floor above"
            ><img class="map-screen__arrow-sprite" :src="arrowUpGrey" alt="" /><img
              class="map-screen__arrow-sprite map-screen__arrow-sprite--green"
              :src="arrowUpGreen"
              alt="" /></span
          ><span
            v-if="hasFloorBelow"
            class="map-screen__arrow map-screen__arrow--down"
            role="img"
            aria-label="Floor below"
            ><img class="map-screen__arrow-sprite" :src="arrowDownGrey" alt="" /><img
              class="map-screen__arrow-sprite map-screen__arrow-sprite--green"
              :src="arrowDownGreen"
              alt="" /></span
        ></span>
      </p>
    </div>
    <div
      v-if="floorMapState !== FloorMapState.Hidden"
      class="map-screen__floor-map"
      :class="`map-screen__floor-map--${floorMapState}`"
      @animationend.self="onFloorMapAnimationEnd"
    >
      <img
        class="map-screen__rooms"
        :src="FLOOR_SPRITES[floor].src"
        :alt="`${AREA_NAME} ${floor} map`"
        :style="{
          width: `calc(${FLOOR_SPRITES[floor].width} * var(--game-pixel))`,
          height: `calc(${FLOOR_SPRITES[floor].height} * var(--game-pixel))`,
        }"
        @animationend.self="onRoomsAnimationEnd"
      />
    </div>
  </section>
</template>

<style scoped>
/* Fills the item preview panel's display (165 × 112 game pixels). Timings
   measured from map-usage.gif. */
.map-screen {
  /** Opening: the selector dims, the floor map grows in with dark rooms, they stay dark, then brighten. */
  --map-dim-duration: 0.07s;
  --map-grow-duration: 0.21s;
  --map-dark-rooms-duration: 0.14s;
  --map-brighten-duration: 0.07s;
  /** Closing: the rooms darken, the floor map squashes out, then the dimmed selector holds. */
  --map-darken-duration: 0.035s;
  --map-squash-duration: 0.105s;
  --map-hold-duration: 0.21s;
  /** How long the floor arrows stay grey after the selector opens or the floor changes. */
  --map-arrow-grey-duration: 0.28s;

  position: absolute;
  inset: 0;
  overflow: hidden;
  background: #000000;
}

.map-screen__selector--dimmed {
  filter: brightness(0.35);
}

.map-screen__aerial {
  position: absolute;
  top: calc(11 * var(--game-pixel));
  left: calc(3 * var(--game-pixel));
  width: calc(160 * var(--game-pixel));
  height: calc(66 * var(--game-pixel));
}

.map-screen__aerial-view,
.map-screen__area,
.map-screen__arrow-sprite,
.map-screen__rooms {
  display: block;
  image-rendering: pixelated;
}

.map-screen__aerial-view {
  width: 100%;
  height: 100%;
  /* The areas that are not chosen are darker than the chosen one. */
  filter: brightness(0.75);
}

/* The Mansion at full brightness, exactly over its place in the aerial view. */
.map-screen__area {
  position: absolute;
  top: 0;
  left: calc(89 * var(--game-pixel));
  width: calc(50 * var(--game-pixel));
  height: calc(61 * var(--game-pixel));
}

.map-screen__label {
  position: absolute;
  top: calc(88 * var(--game-pixel));
  left: 0;
  width: 100%;
  margin: 0;
  font-family: 're1-text';
  font-size: calc(14 * var(--game-pixel));
  line-height: calc(14 * var(--game-pixel));
  white-space: pre;
}

.map-screen__area-name {
  position: absolute;
  left: calc(40 * var(--game-pixel));
}

.map-screen__floor {
  position: absolute;
  left: calc(112 * var(--game-pixel));
}

/* ▲ just above the floor and ▼ just below it, over its first character. */
.map-screen__arrow {
  position: absolute;
  left: calc(5 * var(--game-pixel));
  width: calc(5 * var(--game-pixel));
  height: calc(3 * var(--game-pixel));
}

/* The font's cell has empty rows above the letters; the GIF's ▲ sits 3 game pixels higher. */
.map-screen__arrow--up {
  bottom: calc(100% + 3 * var(--game-pixel));
}

.map-screen__arrow--down {
  top: 100%;
}

.map-screen__arrow-sprite {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* The arrows show grey first, then turn green and stay green. */
.map-screen__arrow-sprite--green {
  animation: map-arrow-turn-green var(--map-arrow-grey-duration) steps(1, end) both;
}

/* A slightly see-through dark-blue layer with a dark line every 8 game pixels;
   the dimmed selector shows faintly through it. */
.map-screen__floor-map {
  --map-grid-line: #030608;

  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    repeating-linear-gradient(
      to right,
      var(--map-grid-line) 0 var(--game-pixel),
      transparent var(--game-pixel) calc(8 * var(--game-pixel))
    ),
    repeating-linear-gradient(
      to bottom,
      var(--map-grid-line) 0 var(--game-pixel),
      transparent var(--game-pixel) calc(8 * var(--game-pixel))
    ),
    rgb(0 0 40 / 85%);
}

.map-screen__floor-map--opening {
  animation: map-grow calc(var(--map-dim-duration) + var(--map-grow-duration)) linear both;
}

.map-screen__floor-map--opening .map-screen__rooms {
  animation: map-rooms-brighten var(--map-brighten-duration) linear
    calc(var(--map-dim-duration) + var(--map-grow-duration) + var(--map-dark-rooms-duration)) both;
}

.map-screen__floor-map--closing {
  animation: map-squash calc(var(--map-darken-duration) + var(--map-squash-duration) + var(--map-hold-duration)) linear
    both;
}

.map-screen__floor-map--closing .map-screen__rooms {
  animation: map-rooms-darken var(--map-darken-duration) linear both;
}

@keyframes map-arrow-turn-green {
  from {
    visibility: hidden;
  }
  to {
    visibility: visible;
  }
}

/* Waits while the selector dims (25%), then grows from a line at its centre
   to about half height (50%), overshoots (75%) and settles (0.07 s + 0.21 s). */
@keyframes map-grow {
  0% {
    opacity: 0;
    transform: scale(1, 0.02);
  }
  25% {
    opacity: 0;
    transform: scale(1, 0.02);
  }
  25.1% {
    opacity: 1;
    transform: scale(1, 0.02);
  }
  50% {
    transform: scale(1, 0.45);
  }
  75% {
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes map-rooms-brighten {
  from {
    filter: brightness(0.4);
  }
  to {
    filter: brightness(1);
  }
}

@keyframes map-rooms-darken {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(0.4);
  }
}

/* Holds while the rooms darken (10%), squashes to a strip (20%) and a line
   (40%), then stays gone while the dimmed selector holds
   (0.035 s + 0.105 s + 0.21 s). */
@keyframes map-squash {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  10% {
    transform: scale(1);
  }
  20% {
    transform: scale(1, 0.15);
  }
  40% {
    opacity: 1;
    transform: scale(1, 0.02);
  }
  40.1% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: scale(1, 0.02);
  }
}
</style>
