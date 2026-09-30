import { ItemAction } from '../types/item-action';
import { ItemType } from '../types/item';
import type { PlayerItem } from '../types/player';

/** The action menu's options for an item: weapons are equipped, other items are used; every item can be checked and combined. */
export function availableActions(item: PlayerItem): ItemAction[] {
  const firstAction = item.type === ItemType.Weapon ? ItemAction.Equip : ItemAction.Use;
  return [firstAction, ItemAction.Check, ItemAction.Combine];
}
