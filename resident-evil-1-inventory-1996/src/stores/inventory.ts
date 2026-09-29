import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import { useCheck } from '../composables/use-check';
import { useCombine } from '../composables/use-combine';
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

  const description = useDescriptionPanel();
  const selection = useItemSelection(mode, description);
  const check = useCheck(mode, description);
  const combine = useCombine(mode, selection, description);

  // The item whose name the description panel shows: the target while choosing one.
  const itemUnderCursor = computed(() => player.inventorySlots[combine.targetSlot.value ?? cursorSlot.value] ?? null);
  const isSelecting = computed(() => mode.value !== InventoryMode.Idle);
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
    if (combine.isPrompting.value) return;
    if (combine.isCombining.value) {
      combine.moveTarget(slot);
      return;
    }
    // While an item is selected, the cursor stays on it.
    if (isSelecting.value) return;
    cursorSlot.value = slot;
  }

  function selectItemAt(slot: number) {
    if (combine.isPrompting.value) return;
    if (combine.isCombining.value) {
      combine.combineWith(slot);
      return;
    }
    if (isSelecting.value) return;
    const item = player.inventorySlots[slot];
    if (!item) return;
    cursorSlot.value = slot;
    selection.select(item.id);
  }

  function backOut() {
    if (combine.isPrompting.value) {
      combine.cancelPrompt();
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
    if (combine.isCombining.value) {
      combine.stop();
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
      combine.start(cursorSlot.value);
    }
  }

  return {
    mode,
    cursorSlot,
    selection,
    description,
    check,
    combine,
    itemUnderCursor,
    isSelecting,
    selectedItem,
    itemActions,
    moveCursor,
    selectItemAt,
    backOut,
    chooseAction,
  };
});
