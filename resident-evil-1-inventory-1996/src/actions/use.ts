import { usePlayerStore } from '../stores/player';
import { ItemType } from '../types/item';
import { OutcomeKind } from '../types/outcome';
import type { Outcome } from '../types/outcome';
import type { PlayerItem } from '../types/player';

/**
 * USE: uses the item up. Items that only work combined, such as ammunition or
 * the red herb, and key items, which only work in the game world, stay and
 * show why.
 */
export function use(item: PlayerItem): Outcome {
  if (usePlayerStore().useItem(item.id)) return { kind: OutcomeKind.Done };
  const text = item.type === ItemType.Key ? "You can't use it here." : "You can't use this alone.";
  return { kind: OutcomeKind.Description, text };
}
