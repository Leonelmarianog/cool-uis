export interface Character {
  id: string;
  name: string;
  /** Image file name in `src/assets`. */
  portrait: string;
  /** Number of inventory slots. */
  inventorySize: number;
}
