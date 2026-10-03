import { itemService } from '../services/item-service';
import { recipeService } from '../services/recipe-service';
import { usePlayerStore } from '../stores/player';
import { ItemType } from '../types/item';
import { OutcomeKind } from '../types/outcome';
import type { Outcome } from '../types/outcome';
import type { PlayerItem } from '../types/player';
import { PromptChoice } from '../types/prompt-choice';

/** Whether the item is a herb, which can be mixed. */
function isHerb(playerItem: PlayerItem): boolean {
  const item = itemService.find(playerItem.itemId);
  return item.type === ItemType.Consumable && item.herb === true;
}

/** Whether the two items have a recipe. */
function hasRecipe(source: PlayerItem, target: PlayerItem): boolean {
  return recipeService.findByIngredients(source.itemId, target.itemId) !== undefined;
}

/**
 * COMBN: reloads a weapon, stacks ammunition, asks before herbs are mixed, or
 * mixes other items with a recipe, such as the V-JOLT chemicals, at once. The
 * item itself, an empty slot and items that do not combine have no effect;
 * herbs that do not mix show why.
 */
export function combine(source: PlayerItem, target: PlayerItem | null): Outcome {
  const player = usePlayerStore();
  if (!target || target.id === source.id) return { kind: OutcomeKind.Nothing };
  if (player.reload(source.id, target.id) || player.stack(source.id, target.id)) return { kind: OutcomeKind.Done };
  if (!isHerb(source) || !isHerb(target)) {
    return player.mix(source.id, target.id) ? { kind: OutcomeKind.Done } : { kind: OutcomeKind.Nothing };
  }
  if (!hasRecipe(source, target)) {
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
