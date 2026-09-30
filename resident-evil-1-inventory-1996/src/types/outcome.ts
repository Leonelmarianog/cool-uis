import type { PromptChoice } from './prompt-choice';

/** The kinds of result an action has. */
export const OutcomeKind = {
  /** The action finished; the action menu closes. */
  Done: 'done',
  /** A description to show, such as "You can't use this alone.". */
  Description: 'description',
  /** A question to ask before the action goes on. */
  Prompt: 'prompt',
  /** No effect, such as combining an item with an empty slot. */
  Nothing: 'nothing',
} as const;

export type OutcomeKind = (typeof OutcomeKind)[keyof typeof OutcomeKind];

/** What an action returns, so the inventory store can decide what comes next. */
export type Outcome =
  | { kind: typeof OutcomeKind.Done }
  | { kind: typeof OutcomeKind.Description; text: string }
  | { kind: typeof OutcomeKind.Prompt; question: string; choices: PromptChoice[] }
  | { kind: typeof OutcomeKind.Nothing };
