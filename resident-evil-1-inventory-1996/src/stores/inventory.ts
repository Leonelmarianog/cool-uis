import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useCheck } from '../composables/use-check';
import { useCombine } from '../composables/use-combine';
import { useItemActions } from '../composables/use-item-actions';
import { useItemSelection } from '../composables/use-item-selection';
import { useCursor } from '../elements/use-cursor';
import { useDescription } from '../elements/use-description';
import { useMainCursor } from '../elements/use-main-cursor';
import { usePrompt } from '../elements/use-prompt';
import { CursorArea } from '../types/cursor-area';
import { InventoryMode } from '../types/inventory-mode';
import { ItemAction } from '../types/item-action';
import { ItemType } from '../types/item';
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
  const mainCursor = useMainCursor();
  /** Points at the second item for COMBN. */
  const targetCursor = useCursor();
  /** Points at an option of the action menu. */
  const optionCursor = useCursor();

  const description = useDescription();
  const prompt = usePrompt();
  const selection = useItemSelection(mode, description, prompt);
  const check = useCheck(mode, description);
  const combine = useCombine(mode, selection, description, prompt);
  const itemActions = useItemActions(selection, description);

  /** The target cursor's slot while it shows, or `null`. */
  const targetIndex = computed(() => (combine.isCombining.value ? targetCursor.index.value : null));
  /** The item whose name the description panel shows: the one under the target cursor while it shows. */
  const itemUnderCursor = computed(() => player.inventorySlots[targetIndex.value ?? mainCursor.index.value] ?? null);
  /** The text the description panel types in place of the item name: the prompt's question or the description. */
  const panelText = computed(() => prompt.question.value ?? description.text.value);
  const isSelecting = computed(() => mode.value !== InventoryMode.Browsing);
  /** The grid takes input while the player browses or picks a target. */
  const isGridActive = computed(
    () => mode.value === InventoryMode.Browsing || mode.value === InventoryMode.ChoosingTarget,
  );
  /** The action menu takes input only while the player picks an option. */
  const isActionMenuActive = computed(() => mode.value === InventoryMode.ChoosingAction);

  /** The action menu's options: weapons are equipped, every other item is used. */
  const menuOptions = computed<ItemAction[]>(() => {
    const item = selection.selectedItem.value;
    if (!item) return [];
    const firstAction = item.type === ItemType.Weapon ? ItemAction.Equip : ItemAction.Use;
    return [firstAction, ItemAction.Check, ItemAction.Combine];
  });

  /** What `point`, `choose` and `back` do in each mode. */
  const handlers: Record<InventoryMode, ModeHandlers> = {
    [InventoryMode.Browsing]: {
      point: index => mainCursor.point(CursorArea.Grid, index),
      choose: () => selectItemUnderCursor(),
    },
    [InventoryMode.ChoosingAction]: {
      point: index => optionCursor.point(index),
      choose: () => choosePointedOption(),
      back: () => selection.release(),
    },
    [InventoryMode.ChoosingTarget]: {
      point: index => targetCursor.point(index),
      choose: () => combineWithTarget(),
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
    const item = player.inventorySlots[mainCursor.index.value];
    if (!item) return;
    optionCursor.reset();
    selection.select(item.id);
  }

  /** Runs the option under the option cursor. */
  function choosePointedOption() {
    const option = menuOptions.value[optionCursor.index.value];
    if (option) optionHandlers[option]();
  }

  /** Starts picking a second item, with the target cursor on the selected item. */
  function startCombine() {
    targetCursor.point(mainCursor.index.value);
    combine.start();
  }

  /** Combines the selected item with the one under the target cursor. */
  function combineWithTarget() {
    combine.combineWith(targetCursor.index.value);
  }

  /** Answers the prompt with the choice under the choice cursor. */
  function answerPointedChoice() {
    const choice = prompt.pointedChoice.value;
    if (choice) combine.answer(choice);
  }

  return {
    mode,
    mainCursor,
    targetIndex,
    optionCursor,
    description,
    prompt,
    check,
    itemUnderCursor,
    panelText,
    isSelecting,
    isGridActive,
    isActionMenuActive,
    menuOptions,
    point,
    choose,
    back,
    onDescriptionTyped,
    onItemPreviewExited,
  };
});
