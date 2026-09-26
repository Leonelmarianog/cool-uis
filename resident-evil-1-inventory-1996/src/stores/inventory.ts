import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { usePlayerStore } from './player';

// The inventory's UI state, such as the cursor, as opposed to the player's data.
export const useInventoryStore = defineStore('inventory', () => {
  const player = usePlayerStore();

  // The cursor is a slot position, so it stays in place when items shift.
  const cursorSlot = ref(0);
  // The selected item is tracked by ID, so it stays attached to its item.
  const selectedItemId = ref<string | null>(null);

  const itemUnderCursor = computed(() => player.inventorySlots[cursorSlot.value] ?? null);
  const isSelecting = computed(() => selectedItemId.value !== null);

  function moveCursor(slot: number) {
    // While an item is selected, the cursor stays on it.
    if (isSelecting.value) return;
    cursorSlot.value = slot;
  }

  function selectItemAt(slot: number) {
    if (isSelecting.value) return;
    const item = player.inventorySlots[slot];
    if (!item) return;
    cursorSlot.value = slot;
    selectedItemId.value = item.id;
  }

  function backOut() {
    selectedItemId.value = null;
  }

  return { cursorSlot, selectedItemId, itemUnderCursor, isSelecting, moveCursor, selectItemAt, backOut };
});
