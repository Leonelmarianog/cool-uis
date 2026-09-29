import { ref } from 'vue';
import type { Ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';

// The item whose action menu is open. It is tracked by ID, so it stays
// attached to its item when items shift.
export function useItemSelection(mode: Ref<InventoryMode>, message: Ref<string | null>) {
  const selectedItemId = ref<string | null>(null);

  function select(itemId: string) {
    selectedItemId.value = itemId;
    mode.value = InventoryMode.ItemSelected;
  }

  // Closes the menu: after Escape, EQUIP, a used-up item or a combination.
  function release() {
    selectedItemId.value = null;
    message.value = null;
    mode.value = InventoryMode.Idle;
  }

  return { selectedItemId, select, release };
}
