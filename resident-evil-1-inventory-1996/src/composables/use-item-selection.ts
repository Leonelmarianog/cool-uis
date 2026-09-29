import { ref } from 'vue';
import type { Ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import type { DescriptionPanel } from './use-description-panel';

/**
 * The item whose action menu is open. It is tracked by ID, so it stays
 * attached to its item when items shift.
 */
export function useItemSelection(mode: Ref<InventoryMode>, description: DescriptionPanel) {
  const selectedItemId = ref<string | null>(null);

  /** Opens the action menu for the item. */
  function select(itemId: string) {
    selectedItemId.value = itemId;
    mode.value = InventoryMode.ItemSelected;
  }

  /** Closes the action menu and releases the item. */
  function release() {
    selectedItemId.value = null;
    description.clear();
    mode.value = InventoryMode.Idle;
  }

  return { selectedItemId, select, release };
}
