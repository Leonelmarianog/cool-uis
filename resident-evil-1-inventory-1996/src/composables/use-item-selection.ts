import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { InventoryMode } from '../types/inventory-mode';
import type { Description } from '../elements/use-description';
import type { Prompt } from '../elements/use-prompt';

/**
 * The item whose action menu is open. It is tracked by ID, so it stays
 * attached to its item when items shift.
 */
export function useItemSelection(mode: Ref<InventoryMode>, description: Description, prompt: Prompt) {
  const player = usePlayerStore();

  const selectedItemId = ref<string | null>(null);
  const selectedItem = computed(() => player.inventorySlots.find(item => item.id === selectedItemId.value) ?? null);

  /** Opens the action menu for the item. */
  function select(itemId: string) {
    selectedItemId.value = itemId;
    mode.value = InventoryMode.ChoosingAction;
  }

  /** Closes the action menu, any description and prompt, and releases the item. */
  function release() {
    selectedItemId.value = null;
    description.close();
    prompt.close();
    mode.value = InventoryMode.Browsing;
  }

  return { selectedItemId, selectedItem, select, release };
}

export type ItemSelection = ReturnType<typeof useItemSelection>;
