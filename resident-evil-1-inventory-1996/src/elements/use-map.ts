import { computed } from 'vue';
import type { Direction } from '../types/direction';
import { MAP_FLOORS, MapFloor } from '../types/map-floor';
import { step } from './step';
import { useCursor } from './use-cursor';

/**
 * The map's floor cursor: the floor the selector shows. The floors form one
 * column, so ↑ and ↓ move it and stop at either end; the map has one area,
 * so ← and → do nothing.
 */
export function useMap() {
  /** Points at the shown floor in MAP_FLOORS. */
  const cursor = useCursor();

  /** The floor the selector shows and the floor map draws. */
  const floor = computed(() => MAP_FLOORS[cursor.index.value]);
  /** ↑ leads to another floor. */
  const hasFloorAbove = computed(() => cursor.index.value > 0);
  /** ↓ leads to another floor. */
  const hasFloorBelow = computed(() => cursor.index.value < MAP_FLOORS.length - 1);

  /** Shows 1F, as each time the map opens. */
  function open() {
    cursor.point(MAP_FLOORS.indexOf(MapFloor.First));
  }

  /** Moves one floor up or down; at the top or bottom floor it stays. */
  function move(direction: Direction) {
    cursor.point(step(cursor.index.value, direction, 1, MAP_FLOORS.length));
  }

  return { cursor, floor, hasFloorAbove, hasFloorBelow, open, move };
}

export type MapCursor = ReturnType<typeof useMap>;
