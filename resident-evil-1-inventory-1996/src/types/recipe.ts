export interface Recipe {
  /** IDs of the two items to combine, in any order. */
  ingredients: string[];
  /** ID of the item the combination creates. */
  result: string;
}
