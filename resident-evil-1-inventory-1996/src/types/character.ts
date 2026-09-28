export interface Character {
  id: string;
  name: string;
  /** Image file name in `src/assets/characters/`, e.g. `"jill.png"`. */
  portrait: string;
  /** Number of inventory slots. */
  inventorySize: number;
}
