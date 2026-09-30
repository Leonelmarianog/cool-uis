import { usePlayerStore } from '../stores/player';
import { OutcomeKind } from '../types/outcome';
import type { Outcome } from '../types/outcome';
import type { PlayerItem } from '../types/player';
import { PromptChoice } from '../types/prompt-choice';

/**
 * COMBN: reloads a weapon, stacks ammunition, or asks before herbs are mixed.
 * The item itself, an empty slot and items that do not combine have no effect;
 * herbs that do not mix show why.
 */
export function combine(source: PlayerItem, target: PlayerItem | null): Outcome {
  const player = usePlayerStore();
  if (!target || target.id === source.id) return { kind: OutcomeKind.Nothing };
  if (player.reload(source.id, target.id) || player.stack(source.id, target.id)) return { kind: OutcomeKind.Done };
  if (!player.isHerb(source.id) || !player.isHerb(target.id)) return { kind: OutcomeKind.Nothing };
  if (!player.canMix(source.id, target.id)) {
    return { kind: OutcomeKind.Description, text: 'Mixing these does not seem to work.' };
  }
  return {
    kind: OutcomeKind.Prompt,
    question: 'Will you mix the herbs?',
    choices: [PromptChoice.Yes, PromptChoice.No],
  };
}

/** Mixes the herbs after Yes: the result takes the source's slot and the target goes away. */
export function mix(source: PlayerItem, target: PlayerItem): Outcome {
  usePlayerStore().mix(source.id, target.id);
  return { kind: OutcomeKind.Done };
}
