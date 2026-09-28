import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { usePlayerStore } from './player';

// The inventory's UI state, such as the cursor, as opposed to the player's data.
// Every item shows the Beretta's description (from check-item-in-out.gif)
// until real descriptions exist.
const PLACEHOLDER_DESCRIPTION = 'Beretta M92FS. Automatic\nloaded with 9mm bullets.';

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
  // While "Will you mix the herbs?" waits for Yes or No, the herb chosen as the target.
  const mixTargetId = ref<string | null>(null);
  // While CHECK shows the selected item's 3D model in place of the menu.
  const isChecking = ref(false);
  // While CHECK types the item's description; the model is frozen until Escape.
  const isDescribing = ref(false);

  // The item whose name the description panel shows: the target while choosing one.
  const itemUnderCursor = computed(() => player.inventorySlots[targetSlot.value ?? cursorSlot.value] ?? null);
  const isSelecting = computed(() => selectedItemId.value !== null);
  const isChoosingTarget = computed(() => targetSlot.value !== null);
  const isConfirmingMix = computed(() => mixTargetId.value !== null);
  const selectedItem = computed(() => player.inventorySlots.find(item => item.id === selectedItemId.value) ?? null);

  // Weapons are equipped; every other item is used.
  const itemActions = computed(() => {
    if (!selectedItem.value) return [];
    const firstAction = selectedItem.value.type === 'weapon' ? 'EQUIP' : 'USE';
    return [firstAction, 'CHECK', 'COMBN'];
  });

  // The choices the description panel offers under the message.
  const messageChoices = computed(() => (isConfirmingMix.value ? ['Yes', 'No'] : []));

  function moveCursor(slot: number) {
    // While Yes or No is asked, the target cursor stays on the target.
    if (isConfirmingMix.value) return;
    if (isChoosingTarget.value) {
      targetSlot.value = slot;
      return;
    }
    // While an item is selected, the cursor stays on it.
    if (isSelecting.value) return;
    cursorSlot.value = slot;
  }

  function selectItemAt(slot: number) {
    if (isConfirmingMix.value) return;
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
    // Escape answers No to "Will you mix the herbs?".
    if (isConfirmingMix.value) {
      cancelMix();
      return;
    }
    // Escape removes CHECK's description and gives the model's controls back.
    if (isDescribing.value) {
      isDescribing.value = false;
      message.value = null;
      return;
    }
    // From CHECK, back out to the menu only.
    if (isChecking.value) {
      isChecking.value = false;
      return;
    }
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

    if (action === 'CHECK') {
      isChecking.value = true;
      return;
    }

    if (action === 'COMBN') {
      // The target cursor starts on the selected item.
      targetSlot.value = cursorSlot.value;
    }
  }

  function showDescription() {
    if (!isChecking.value) return;
    isDescribing.value = true;
    message.value = PLACEHOLDER_DESCRIPTION;
  }

  // Items that do not combine, such as the source itself or an empty slot, do
  // nothing and the target cursor stays; herbs that do not mix show a message.
  function combineWith(slot: number) {
    const target = player.inventorySlots[slot];
    if (!selectedItem.value || !target) return;
    const sourceId = selectedItem.value.id;
    if (target.id === sourceId) return;

    if (player.reload(sourceId, target.id) || player.stack(sourceId, target.id)) {
      finishCombination();
    } else if (player.isHerb(sourceId) && player.isHerb(target.id)) {
      if (player.canMix(sourceId, target.id)) {
        mixTargetId.value = target.id;
        message.value = 'Will you mix the herbs?';
      } else {
        message.value = 'Mixing these does not seem to work.';
      }
    }
  }

  // Yes mixes the herbs; No goes back to choosing a target.
  function answerMix(choice: string) {
    if (!selectedItem.value || !mixTargetId.value) return;
    if (choice === 'Yes') {
      player.mix(selectedItem.value.id, mixTargetId.value);
      finishCombination();
    } else {
      cancelMix();
    }
  }

  function cancelMix() {
    mixTargetId.value = null;
    message.value = null;
  }

  // The game closes the menu and releases the item after a combination.
  function finishCombination() {
    mixTargetId.value = null;
    targetSlot.value = null;
    backOut();
  }

  return {
    cursorSlot,
    selectedItemId,
    targetSlot,
    message,
    mixTargetId,
    isChecking,
    isDescribing,
    itemUnderCursor,
    isSelecting,
    isChoosingTarget,
    isConfirmingMix,
    selectedItem,
    itemActions,
    messageChoices,
    moveCursor,
    selectItemAt,
    backOut,
    clearMessage,
    chooseAction,
    answerMix,
    showDescription,
  };
});
