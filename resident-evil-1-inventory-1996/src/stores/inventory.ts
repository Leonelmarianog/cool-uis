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
  // While COMBN waits for a second item, the slot under the green target cursor.
  const targetSlot = ref<number | null>(null);
  // A message typed into the description panel in place of the item name.
  const message = ref<string | null>(null);

  // The item whose name the description panel shows: the target while choosing one.
  const itemUnderCursor = computed(() => player.inventorySlots[targetSlot.value ?? cursorSlot.value] ?? null);
  const isSelecting = computed(() => selectedItemId.value !== null);
  const isChoosingTarget = computed(() => targetSlot.value !== null);
  const selectedItem = computed(() => player.inventorySlots.find(item => item.id === selectedItemId.value) ?? null);

  // Weapons are equipped; every other item is used.
  const itemActions = computed(() => {
    if (!selectedItem.value) return [];
    const firstAction = selectedItem.value.type === 'weapon' ? 'EQUIP' : 'USE';
    return [firstAction, 'CHECK', 'COMBN'];
  });

  function moveCursor(slot: number) {
    if (isChoosingTarget.value) {
      targetSlot.value = slot;
      return;
    }
    // While an item is selected, the cursor stays on it.
    if (isSelecting.value) return;
    cursorSlot.value = slot;
  }

  function selectItemAt(slot: number) {
    if (isChoosingTarget.value) {
      combineWith(slot);
      return;
    }
    if (isSelecting.value) return;
    const item = player.inventorySlots[slot];
    if (!item) return;
    cursorSlot.value = slot;
    selectedItemId.value = item.id;
  }

  function backOut() {
    // From choosing a target, back out to the menu only.
    if (isChoosingTarget.value) {
      targetSlot.value = null;
      return;
    }
    selectedItemId.value = null;
    message.value = null;
  }

  function clearMessage() {
    message.value = null;
  }

  function chooseAction(action: string) {
    if (!selectedItem.value) return;

    if (action === 'EQUIP') {
      player.toggleEquipped(selectedItem.value.id);
      // The game closes the menu and releases the item right after equipping.
      backOut();
      return;
    }

    if (action === 'USE') {
      if (player.useItem(selectedItem.value.id)) {
        // The game closes the menu once the item is used up.
        backOut();
      } else {
        // Key items only work in the game world; ammunition and the red herb only work combined.
        message.value = selectedItem.value.type === 'key' ? "You can't use it here." : "You can't use this alone.";
      }
      return;
    }

    if (action === 'COMBN') {
      // The target cursor starts on the selected item.
      targetSlot.value = cursorSlot.value;
      return;
    }

    // Placeholder until the other actions are implemented.
    console.log(`${action}: ${selectedItem.value.name}`);
  }

  // Items that do not combine, such as the source itself or an empty slot, do
  // nothing and the target cursor stays; herbs that do not mix show a message.
  function combineWith(slot: number) {
    const target = player.inventorySlots[slot];
    if (!selectedItem.value || !target) return;
    const sourceId = selectedItem.value.id;
    if (target.id === sourceId) return;

    const combined = player.reload(sourceId, target.id)
      || player.stack(sourceId, target.id)
      || player.mix(sourceId, target.id);
    if (combined) {
      // The game closes the menu and releases the item after a combination.
      targetSlot.value = null;
      backOut();
    } else if (player.isHerb(sourceId) && player.isHerb(target.id)) {
      message.value = 'Mixing these does not seem to work.';
    }
  }

  return {
    cursorSlot,
    selectedItemId,
    targetSlot,
    message,
    itemUnderCursor,
    isSelecting,
    isChoosingTarget,
    selectedItem,
    itemActions,
    moveCursor,
    selectItemAt,
    backOut,
    clearMessage,
    chooseAction,
  };
});
