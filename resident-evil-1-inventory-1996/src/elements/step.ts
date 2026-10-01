import { Direction } from '../types/direction';

/** How far each direction moves in reading order, by the number of columns. */
const OFFSETS: Record<Direction, (columns: number) => number> = {
  [Direction.Up]: columns => -columns,
  [Direction.Down]: columns => columns,
  [Direction.Left]: () => -1,
  [Direction.Right]: () => 1,
};

/** The directions that stay in the same row. */
const SIDEWAYS: Direction[] = [Direction.Left, Direction.Right];

/**
 * The position one step away in a grid filled in reading order, such as the
 * item slots. A step that would leave the grid, or leave the row while moving
 * sideways, stops: the position stays the same. A list is a grid with one
 * column (it moves up and down) or one row (it moves left and right).
 */
export function step(index: number, direction: Direction, columns: number, count: number): number {
  const next = index + OFFSETS[direction](columns);
  const leavesRow = SIDEWAYS.includes(direction) && Math.floor(next / columns) !== Math.floor(index / columns);
  return next < 0 || next >= count || leavesRow ? index : next;
}
