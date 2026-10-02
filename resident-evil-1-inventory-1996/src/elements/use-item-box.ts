import { Direction } from '../types/direction';
import { useCursor } from './use-cursor';

/** How many rows ↑ and ↓ move the band; ← and → do not move it. */
const ROW_OFFSETS: Partial<Record<Direction, number>> = {
  [Direction.Up]: -1,
  [Direction.Down]: 1,
};

/**
 * The item box list's row cursor: the row in the band. Unlike every other
 * cursor, it wraps: the list is a loop, so ↑ on the first row goes to the last
 * row and ↓ on the last row goes to the first.
 */
export function useItemBox(rowCount: number) {
  /** Points at the row in the band. */
  const cursor = useCursor();

  /** Puts the first row in the band, as each time the box opens. */
  function open() {
    cursor.reset();
  }

  /** Moves the band one row up or down, wrapping at either end. */
  function move(direction: Direction) {
    const offset = ROW_OFFSETS[direction];
    if (offset === undefined) return;
    cursor.point((cursor.index.value + offset + rowCount) % rowCount);
  }

  return { cursor, open, move };
}

export type ItemBox = ReturnType<typeof useItemBox>;
