import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCheck } from '../composables/use-check';
import { useCombine } from '../composables/use-combine';
import { useDescriptionPanel } from '../composables/use-description-panel';
import { useItemActions } from '../composables/use-item-actions';
import { useItemSelection } from '../composables/use-item-selection';
import { useCursor } from '../elements/use-cursor';
import { useMainCursor } from '../elements/use-main-cursor';
import { CursorArea } from '../types/cursor-area';
import { InventoryMode } from '../types/inventory-mode';
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
  const mainCursor = useMainCursor();
  /** Points at the second item for COMBN. */
  const targetCursor = useCursor();

  const description = useDescriptionPanel();
  const selection = useItemSelection(mode, description);
  const check = useCheck(mode, description);
  const combine = useCombine(mode, selection, description);
  const itemActions = useItemActions(selection, description);

  /** The target cursor's slot while it shows, or `null`. */
  const targetIndex = computed(() => (combine.isCombining.value ? targetCursor.index.value : null));
  /** The item whose name the description panel shows: the one under the target cursor while it shows. */
  const itemUnderCursor = computed(() => player.inventorySlots[targetIndex.value ?? mainCursor.index.value] ?? null);
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
        mainCursor.point(CursorArea.Grid, slot);
        break;
      case InventoryMode.ChoosingTarget:
        targetCursor.point(slot);
        break;
    }
  }

  /** A slot was clicked. */
  function selectItemAt(slot: number) {
    switch (mode.value) {
      case InventoryMode.Browsing: {
        const item = player.inventorySlots[slot];
        if (!item) return;
        mainCursor.point(CursorArea.Grid, slot);
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
        targetCursor.point(mainCursor.index.value);
        combine.start();
        break;
    }
  }

  return {
    mode,
    mainCursor,
    targetIndex,
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
