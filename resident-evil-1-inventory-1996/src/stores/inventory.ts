import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import { useCheck } from '../composables/use-check';
import { useCombine } from '../composables/use-combine';
import { useDescriptionPanel } from '../composables/use-description-panel';
import { useItemActions } from '../composables/use-item-actions';
import { useItemSelection } from '../composables/use-item-selection';
import { ItemAction } from '../types/item-action';
import { ItemType } from '../types/item';
import { usePlayerStore } from './player';

/**
 * The inventory screen's UI state, as opposed to the player's data. It routes
 * every event to the feature the current mode belongs to.
 */
export const useInventoryStore = defineStore('inventory', () => {
  const player = usePlayerStore();

  const mode = ref<InventoryMode>(InventoryMode.Browsing);
  /** The selection frame's slot. It is a position, so it stays in place when items shift. */
  const cursorSlot = ref(0);

  const description = useDescriptionPanel();
  const selection = useItemSelection(mode, description);
  const check = useCheck(mode, description);
  const combine = useCombine(mode, selection, description);
  const itemActions = useItemActions(selection, description);

  /** The item whose name the description panel shows: the one under the green arrows while combining. */
  const itemUnderCursor = computed(() => player.inventorySlots[combine.targetSlot.value ?? cursorSlot.value] ?? null);
  const isSelecting = computed(() => mode.value !== InventoryMode.Browsing);

  /** The action menu's options: weapons are equipped, every other item is used. */
  const menuOptions = computed<ItemAction[]>(() => {
    const item = selection.selectedItem.value;
    if (!item) return [];
    const firstAction = item.type === ItemType.Weapon ? ItemAction.Equip : ItemAction.Use;
    return [firstAction, ItemAction.Check, ItemAction.Combine];
  });

  /** The mouse moved over a slot. */
  function moveCursor(slot: number) {
    switch (mode.value) {
      case InventoryMode.Browsing:
        cursorSlot.value = slot;
        break;
      case InventoryMode.ChoosingTarget:
        combine.moveTarget(slot);
        break;
    }
  }

  /** A slot was clicked. */
  function selectItemAt(slot: number) {
    switch (mode.value) {
      case InventoryMode.Browsing: {
        const item = player.inventorySlots[slot];
        if (!item) return;
        cursorSlot.value = slot;
        selection.select(item.id);
        break;
      }
      case InventoryMode.ChoosingTarget:
        combine.combineWith(slot);
        break;
    }
  }

  /** Escape was pressed: steps back once. */
  function backOut() {
    switch (mode.value) {
      case InventoryMode.AnsweringPrompt:
        combine.cancelPrompt();
        break;
      case InventoryMode.ChoosingTarget:
        combine.stop();
        break;
      case InventoryMode.ReadingDescription:
        check.hideDescription();
        break;
      case InventoryMode.ViewingModel:
        check.close();
        break;
      case InventoryMode.ChoosingAction:
        selection.release();
        break;
    }
  }

  /** An option of the action menu was clicked. */
  function chooseAction(action: string) {
    switch (action) {
      case ItemAction.Equip:
        itemActions.equip();
        break;
      case ItemAction.Use:
        itemActions.use();
        break;
      case ItemAction.Check:
        check.start();
        break;
      case ItemAction.Combine:
        combine.start(cursorSlot.value);
        break;
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
    menuOptions,
    moveCursor,
    selectItemAt,
    backOut,
    chooseAction,
  };
});
