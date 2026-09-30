/** The answers a prompt offers, spelled as the game shows them. */
export const PromptChoice = {
  Yes: 'Yes',
  No: 'No',
} as const;

export type PromptChoice = (typeof PromptChoice)[keyof typeof PromptChoice];
