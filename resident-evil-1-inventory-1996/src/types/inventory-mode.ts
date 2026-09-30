/** A step in the inventory screen's flow, named after what the player is doing; exactly one is active. */
export const InventoryMode = {
  /** Moving the main cursor over the grid. */
  Browsing: 'browsing',
  /** Picking an option in the selected item's action menu. */
  ChoosingAction: 'choosing-action',
  /** Picking the second item for COMBN with the target cursor. */
  ChoosingTarget: 'choosing-target',
  /** Waiting while a description or a prompt's question types; K hurries it. */
  TypingText: 'typing-text',
  /** Reading a complete description; K or Escape closes it. */
  ReadingDescription: 'reading-description',
  /** Answering a question, such as "Will you mix the herbs?". */
  AnsweringPrompt: 'answering-prompt',
  /** Waiting while the selected item's 3D model tumbles in; no input. */
  OpeningModel: 'opening-model',
  /** Turning and zooming the selected item's 3D model (CHECK). */
  ViewingModel: 'viewing-model',
  /** Waiting while the model spins out; no input. */
  ClosingModel: 'closing-model',
} as const;

export type InventoryMode = (typeof InventoryMode)[keyof typeof InventoryMode];
