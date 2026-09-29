import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import { ItemType } from '../types/item';
import { usePlayerStore } from './player';

// The inventory's UI state, such as the cursor, as opposed to the player's data.
// Every item shows the Beretta's description (from check-item-in-out.gif)
// until real descriptions exist.
const PLACEHOLDER_DESCRIPTION = 'Beretta M92FS. Automatic\nloaded with 9mm bullets.';

export const useInventoryStore = defineStore('inventory', () => {
  const player = usePlayerStore();

  const mode = ref<InventoryMode>(InventoryMode.Idle);
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

  // The item whose name the description panel shows: the target while choosing one.
  const itemUnderCursor = computed(() => player.inventorySlots[targetSlot.value ?? cursorSlot.value] ?? null);
  const isSelecting = computed(() => mode.value !== InventoryMode.Idle);
  // The green arrows stay on the target while Yes or No is asked.
  const isChoosingTarget = computed(
    () => mode.value === InventoryMode.Combining || mode.value === InventoryMode.CombinePrompt,
  );
  const isConfirmingMix = computed(() => mode.value === InventoryMode.CombinePrompt);
  // The 3D model stays shown while the description is typed and while it spins out.
  const isChecking = computed(
    () =>
      mode.value === InventoryMode.ModelView ||
      mode.value === InventoryMode.ModelDescription ||
      mode.value === InventoryMode.ModelClosing,
  );
  const isDescribing = computed(() => mode.value === InventoryMode.ModelDescription);
  const isLeavingCheck = computed(() => mode.value === InventoryMode.ModelClosing);
  const selectedItem = computed(() => player.inventorySlots.find(item => item.id === selectedItemId.value) ?? null);

  // Weapons are equipped; every other item is used.
  const itemActions = computed(() => {
    if (!selectedItem.value) return [];
    const firstAction = selectedItem.value.type === ItemType.Weapon ? 'EQUIP' : 'USE';
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
    mode.value = InventoryMode.ItemSelected;
  }

  function backOut() {
    // Escape answers No to "Will you mix the herbs?".
    if (isConfirmingMix.value) {
      cancelMix();
      return;
    }
    // Escape removes CHECK's description and gives the model's controls back.
    if (isDescribing.value) {
      mode.value = InventoryMode.ModelView;
      message.value = null;
      return;
    }
    // From CHECK, back out to the menu only, once the model has spun out.
    if (isChecking.value) {
      mode.value = InventoryMode.ModelClosing;
      return;
    }
    // From choosing a target, back out to the menu only.
    if (isChoosingTarget.value) {
      targetSlot.value = null;
      mode.value = InventoryMode.ItemSelected;
      return;
    }
    selectedItemId.value = null;
    message.value = null;
    mode.value = InventoryMode.Idle;
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
        message.value =
          selectedItem.value.type === ItemType.Key ? "You can't use it here." : "You can't use this alone.";
      }
      return;
    }

    if (action === 'CHECK') {
      mode.value = InventoryMode.ModelView;
      return;
    }

    if (action === 'COMBN') {
      // The target cursor starts on the selected item.
      targetSlot.value = cursorSlot.value;
      mode.value = InventoryMode.Combining;
    }
  }

  // Called once CHECK's model has spun out.
  function finishCheck() {
    mode.value = InventoryMode.ItemSelected;
  }

  function showDescription() {
    if (mode.value !== InventoryMode.ModelView) return;
    mode.value = InventoryMode.ModelDescription;
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
        mode.value = InventoryMode.CombinePrompt;
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
    mode.value = InventoryMode.Combining;
  }

  // The game closes the menu and releases the item after a combination.
  function finishCombination() {
    mixTargetId.value = null;
    targetSlot.value = null;
    mode.value = InventoryMode.ItemSelected;
    backOut();
  }

  return {
    mode,
    cursorSlot,
    selectedItemId,
    targetSlot,
    message,
    mixTargetId,
    isChecking,
    isLeavingCheck,
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
    finishCheck,
  };
});
