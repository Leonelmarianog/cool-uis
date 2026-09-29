/** The step of the interaction the inventory screen is in; always exactly one. */
export const InventoryMode = {
  /** No item is selected; the selection frame follows the mouse. */
  Idle: 'idle',
  /** The action menu is open for the selected item. */
  ItemSelected: 'item-selected',
  /** After COMBN, the green arrows pick a second item. */
  Combining: 'combining',
  /** A question such as "Will you mix the herbs?" waits for Yes or No. */
  CombinePrompt: 'combine-prompt',
  /** CHECK shows the selected item's 3D model, which can be turned. */
  ModelView: 'model-view',
  /** CHECK types the item's description; the model is frozen. */
  ModelDescription: 'model-description',
  /** CHECK's model spins out before the menu returns. */
  ModelClosing: 'model-closing',
} as const;

export type InventoryMode = (typeof InventoryMode)[keyof typeof InventoryMode];
