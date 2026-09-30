import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { availableActions } from '../actions/available-actions';
import { useCheck } from '../composables/use-check';
import { useCombine } from '../composables/use-combine';
import { useItemActions } from '../composables/use-item-actions';
import { useActionMenu } from '../elements/use-action-menu';
import { useCursor } from '../elements/use-cursor';
import { useDescription } from '../elements/use-description';
import { useMainCursor } from '../elements/use-main-cursor';
import { usePrompt } from '../elements/use-prompt';
import { CursorArea } from '../types/cursor-area';
import { InventoryMode } from '../types/inventory-mode';
import { ItemAction } from '../types/item-action';
import type { PlayerItem } from '../types/player';
import { usePlayerStore } from './player';

/** What each intent does in one mode. A missing handler means the intent does nothing in that mode. */
type ModeHandlers = {
  point?: (index: number) => void;
  choose?: () => void;
  back?: () => void;
};

/**
 * The inventory screen's UI state, as opposed to the player's data. It routes
 * every intent to the element with input in the current mode.
 */
export const useInventoryStore = defineStore('inventory', () => {
  const player = usePlayerStore();

  const mode = ref<InventoryMode>(InventoryMode.Browsing);
  /** The item whose action menu is open. */
  const selectedItem = ref<PlayerItem | null>(null);

  const mainCursor = useMainCursor();
  /** Points at the second item for COMBN. */
  const targetCursor = useCursor();
  const actionMenu = useActionMenu();
  const description = useDescription();
  const prompt = usePrompt();

  const check = useCheck(mode, description);
  const combine = useCombine(mode, selectedItem, releaseItem, description, prompt);
  const itemActions = useItemActions(selectedItem, releaseItem, description);

  /** The target cursor's slot while it shows, or `null`. */
  const targetIndex = computed(() => (combine.isCombining.value ? targetCursor.index.value : null));
  /** The item whose name the description panel shows: the one under the target cursor while it shows. */
  const itemUnderCursor = computed(() => player.inventorySlots[targetIndex.value ?? mainCursor.index.value] ?? null);
  /** The text the description panel types in place of the item name: the prompt's question or the description. */
  const panelText = computed(() => prompt.question.value ?? description.text.value);
  const hasSelectedItem = computed(() => selectedItem.value !== null);
  /** The grid takes input while the player browses or picks a target. */
  const isGridActive = computed(
    () => mode.value === InventoryMode.Browsing || mode.value === InventoryMode.ChoosingTarget,
  );
  /** The action menu takes input only while the player picks an option. */
  const isActionMenuActive = computed(() => mode.value === InventoryMode.ChoosingAction);

  /** What `point`, `choose` and `back` do in each mode. */
  const handlers: Record<InventoryMode, ModeHandlers> = {
    [InventoryMode.Browsing]: {
      point: index => mainCursor.point(CursorArea.Grid, index),
      choose: () => selectItemUnderCursor(),
    },
    [InventoryMode.ChoosingAction]: {
      point: index => actionMenu.cursor.point(index),
      choose: () => choosePointedOption(),
      back: () => releaseItem(),
    },
    [InventoryMode.ChoosingTarget]: {
      point: index => targetCursor.point(index),
      choose: () => combine.combineWith(targetCursor.index.value),
      back: () => combine.stop(),
    },
    [InventoryMode.AnsweringPrompt]: {
      point: index => prompt.cursor.point(index),
      choose: () => answerPointedChoice(),
      back: () => combine.cancelPrompt(),
    },
    [InventoryMode.ViewingModel]: {
      choose: () => check.showDescription(),
      back: () => check.close(),
    },
    [InventoryMode.ReadingDescription]: {
      back: () => check.hideDescription(),
    },
    [InventoryMode.ClosingModel]: {},
  };

  /** What each option of the action menu does to the selected item. */
  const optionHandlers: Record<ItemAction, () => void> = {
    [ItemAction.Equip]: () => itemActions.equip(),
    [ItemAction.Use]: () => itemActions.use(),
    [ItemAction.Check]: () => check.start(),
    [ItemAction.Combine]: () => startCombine(),
  };

  /** Moves the cursor of the element with input to the given index. */
  function point(index: number) {
    handlers[mode.value].point?.(index);
  }

  /** Confirms the position of the cursor of the element with input. */
  function choose() {
    handlers[mode.value].choose?.();
  }

  /** Steps back once. */
  function back() {
    handlers[mode.value].back?.();
  }

  /** The description panel finished showing a description that goes away by itself; the item name returns. */
  function onDescriptionTyped() {
    description.close();
  }

  /** The model spun out of the item preview panel; the action menu returns. */
  function onItemPreviewExited() {
    check.finish();
  }

  /** Opens the action menu for the item under the main cursor; an empty slot does nothing. */
  function selectItemUnderCursor() {
    const item = player.inventory[mainCursor.index.value];
    if (!item) return;
    selectedItem.value = item;
    actionMenu.open(availableActions(item));
    mode.value = InventoryMode.ChoosingAction;
  }

  /** Closes the action menu, any description and prompt, and goes back to browsing. */
  function releaseItem() {
    selectedItem.value = null;
    actionMenu.close();
    description.close();
    prompt.close();
    mode.value = InventoryMode.Browsing;
  }

  /** Runs the option under the option cursor. */
  function choosePointedOption() {
    const option = actionMenu.pointedOption.value;
    if (option) optionHandlers[option]();
  }

  /** Starts picking a second item, with the target cursor on the selected item. */
  function startCombine() {
    targetCursor.point(mainCursor.index.value);
    combine.start();
  }

  /** Answers the prompt with the choice under the choice cursor. */
  function answerPointedChoice() {
    const choice = prompt.pointedChoice.value;
    if (choice) combine.answer(choice);
  }

  return {
    mode,
    selectedItem,
    mainCursor,
    targetIndex,
    actionMenu,
    description,
    prompt,
    check,
    itemUnderCursor,
    panelText,
    hasSelectedItem,
    isGridActive,
    isActionMenuActive,
    point,
    choose,
    back,
    onDescriptionTyped,
    onItemPreviewExited,
  };
});
