import type { SpriteSheet } from './sprite-sheet';

/** One picture on a sprite sheet, addressed by zero-based grid position. */
export interface SpriteView {
  sheet: SpriteSheet;
  column: number;
  row: number;
}

/** A player item joined with its catalog data, ready for a component to render. */
export interface ItemView {
  /** The player item's ID. */
  id: string;
  name: string;
  sprite: SpriteView;
  /** Loaded rounds for weapons, stack size for ammunition; other items have none. */
  amount?: number;
}
