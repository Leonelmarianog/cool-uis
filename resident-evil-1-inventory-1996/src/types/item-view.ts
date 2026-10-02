import type { Item } from './item';

/** A player item joined with its catalog data, ready for a component to render. */
export interface ItemView {
  /** The player item's ID. */
  id: string;
  name: string;
  type: Item['type'];
  /** URL of the item's image. */
  sprite: string;
  /** Loaded rounds for weapons, stack size for ammunition; other items have none. */
  amount?: number;
  /** Shown after the amount: "%" for a weapon's fuel; rounds and stacks have none. */
  amountSuffix?: '%';
}
