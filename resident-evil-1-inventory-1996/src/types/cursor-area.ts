/** The parts of the inventory screen the main cursor moves between. */
export const CursorArea = {
  /** The item slots. */
  Grid: 'grid',
  /** The buttons above the grid. */
  TopMenu: 'top-menu',
} as const;

export type CursorArea = (typeof CursorArea)[keyof typeof CursorArea];
