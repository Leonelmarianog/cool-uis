import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import { useCheck } from '../composables/use-check';
import { useDescriptionPanel } from '../composables/use-description-panel';
import { useItemSelection } from '../composables/use-item-selection';
import { ItemAction } from '../types/item-action';
import { ItemType } from '../types/item';
import { usePlayerStore } from './player';

// The inventory's UI state, such as the cursor, as opposed to the player's data.

export const useInventoryStore = defineStore('inventory', () => {
  const player = usePlayerStore();

  const mode = ref<InventoryMode>(InventoryMode.Idle);
  // The cursor is a slot position, so it stays in place when items shift.
  const cursorSlot = ref(0);
  // While COMBN waits for a second item, the slot under the green target cursor.
  const targetSlot = ref<number | null>(null);
  // While "Will you mix the herbs?" waits for Yes or No, the herb chosen as the target.
  const mixTargetId = ref<string | null>(null);

  const description = useDescriptionPanel();
  const selection = useItemSelection(mode, description);
  const check = useCheck(mode, description);

  // The item whose name the description panel shows: the target while choosing one.
  const itemUnderCursor = computed(() => player.inventorySlots[targetSlot.value ?? cursorSlot.value] ?? null);
  const isSelecting = computed(() => mode.value !== InventoryMode.Idle);
  /** The green arrows stay on the target while Yes or No is asked. */
  const isChoosingTarget = computed(
    () => mode.value === InventoryMode.Combining || mode.value === InventoryMode.CombinePrompt,
  );
  const isConfirmingMix = computed(() => mode.value === InventoryMode.CombinePrompt);
  const selectedItem = computed(
    () => player.inventorySlots.find(item => item.id === selection.selectedItemId.value) ?? null,
  );

  // Weapons are equipped; every other item is used.
  const itemActions = computed<ItemAction[]>(() => {
    if (!selectedItem.value) return [];
    const firstAction = selectedItem.value.type === ItemType.Weapon ? ItemAction.Equip : ItemAction.Use;
    return [firstAction, ItemAction.Check, ItemAction.Combine];
  });

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
    selection.select(item.id);
  }

  function backOut() {
    // Escape answers No to "Will you mix the herbs?".
    if (isConfirmingMix.value) {
      cancelMix();
      return;
    }
    if (check.isDescribing.value) {
      check.hideDescription();
      return;
    }
    if (check.isModelShown.value) {
      check.close();
      return;
    }
    // From choosing a target, back out to the menu only.
    if (isChoosingTarget.value) {
      targetSlot.value = null;
      mode.value = InventoryMode.ItemSelected;
      return;
    }
    selection.release();
  }

  function chooseAction(action: string) {
    if (!selectedItem.value) return;

    if (action === ItemAction.Equip) {
      player.toggleEquipped(selectedItem.value.id);
      // The game closes the menu and releases the item right after equipping.
      selection.release();
      return;
    }

    if (action === ItemAction.Use) {
      if (player.useItem(selectedItem.value.id)) {
        // The game closes the menu once the item is used up.
        selection.release();
      } else {
        // Key items only work in the game world; ammunition and the red herb only work combined.
        description.show(
          selectedItem.value.type === ItemType.Key ? "You can't use it here." : "You can't use this alone.",
        );
      }
      return;
    }

    if (action === ItemAction.Check) {
      check.start();
      return;
    }

    if (action === ItemAction.Combine) {
      // The target cursor starts on the selected item.
      targetSlot.value = cursorSlot.value;
      mode.value = InventoryMode.Combining;
    }
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
        description.ask('Will you mix the herbs?', ['Yes', 'No']);
        mode.value = InventoryMode.CombinePrompt;
      } else {
        description.show('Mixing these does not seem to work.');
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
    description.clear();
    mode.value = InventoryMode.Combining;
  }

  // The game closes the menu and releases the item after a combination.
  function finishCombination() {
    mixTargetId.value = null;
    targetSlot.value = null;
    selection.release();
  }

  return {
    mode,
    cursorSlot,
    selection,
    targetSlot,
    description,
    check,
    mixTargetId,
    itemUnderCursor,
    isSelecting,
    isChoosingTarget,
    isConfirmingMix,
    selectedItem,
    itemActions,
    moveCursor,
    selectItemAt,
    backOut,
    chooseAction,
    answerMix,
  };
});
