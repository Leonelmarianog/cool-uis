import type { Ref } from 'vue';
import type { Description } from '../elements/use-description';
import { usePlayerStore } from '../stores/player';
import { ItemType } from '../types/item';
import type { PlayerItem } from '../types/player';

/** USE and EQUIP on the selected item. */
export function useItemActions(selectedItem: Ref<PlayerItem | null>, release: () => void, description: Description) {
  const player = usePlayerStore();

  /** Equips the selected weapon, or unequips it if it is already equipped, and closes the action menu. */
  function equip() {
    const item = selectedItem.value;
    if (!item) return;
    player.toggleEquipped(item.id);
    release();
  }

  /**
   * Uses the selected item up and closes the action menu. Items that only work
   * combined, such as ammunition or the red herb, and key items, which only
   * work in the game world, stay and show why.
   */
  function use() {
    const item = selectedItem.value;
    if (!item) return;
    if (player.useItem(item.id)) {
      release();
    } else {
      description.open(item.type === ItemType.Key ? "You can't use it here." : "You can't use this alone.");
    }
  }

  return { equip, use };
}
