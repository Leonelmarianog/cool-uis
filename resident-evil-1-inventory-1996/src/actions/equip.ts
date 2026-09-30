import { usePlayerStore } from '../stores/player';
import { OutcomeKind } from '../types/outcome';
import type { Outcome } from '../types/outcome';
import type { PlayerItem } from '../types/player';

/** EQUIP: equips the weapon, or unequips it if it is already equipped. */
export function equip(item: PlayerItem): Outcome {
  usePlayerStore().toggleEquipped(item.id);
  return { kind: OutcomeKind.Done };
}
