import { usePlayerStore } from '../stores/player';
import { ItemType } from '../types/item';
import type { Description } from '../elements/use-description';
import type { ItemSelection } from './use-item-selection';

/** USE and EQUIP on the selected item. */
export function useItemActions(selection: ItemSelection, description: Description) {
  const player = usePlayerStore();

  /** Equips the selected weapon, or unequips it if it is already equipped, and closes the action menu. */
  function equip() {
    const item = selection.selectedItem.value;
    if (!item) return;
    player.toggleEquipped(item.id);
    selection.release();
  }

  /**
   * Uses the selected item up and closes the action menu. Items that only work
   * combined, such as ammunition or the red herb, and key items, which only
   * work in the game world, stay and show why.
   */
  function use() {
    const item = selection.selectedItem.value;
    if (!item) return;
    if (player.useItem(item.id)) {
      selection.release();
    } else {
      description.open(item.type === ItemType.Key ? "You can't use it here." : "You can't use this alone.");
    }
  }

  return { equip, use };
}
