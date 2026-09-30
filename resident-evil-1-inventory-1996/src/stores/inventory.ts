import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { availableActions } from '../actions/available-actions';
import { combine, mix } from '../actions/combine';
import { equip } from '../actions/equip';
import { use } from '../actions/use';
import { useActionMenu } from '../elements/use-action-menu';
import { useCursor } from '../elements/use-cursor';
import { useDescription } from '../elements/use-description';
import { useMainCursor } from '../elements/use-main-cursor';
import { usePrompt } from '../elements/use-prompt';
import { CursorArea } from '../types/cursor-area';
import { InventoryMode } from '../types/inventory-mode';
import { ItemAction } from '../types/item-action';
import { OutcomeKind } from '../types/outcome';
import type { Outcome } from '../types/outcome';
import type { PlayerItem } from '../types/player';
import { PromptChoice } from '../types/prompt-choice';
import { usePlayerStore } from './player';

/**
 * Every item shows the Beretta's description (from check-item-in-out.gif)
 * until real descriptions exist.
 */
const PLACEHOLDER_DESCRIPTION = 'Beretta M92FS. Automatic\nloaded with 9mm bullets.';

/** What each intent does in one mode. A missing handler means the intent does nothing in that mode. */
type ModeHandlers = {
  point?: (index: number) => void;
  choose?: () => void;
  back?: () => void;
};

/** What comes after each kind of outcome; each handler gets the outcome of its own kind. */
type OutcomeHandlers = { [Kind in OutcomeKind]: (outcome: Extract<Outcome, { kind: Kind }>) => void };

/**
 * The inventory screen's UI state, as opposed to the player's data. It is the
 * only code that changes the mode, and it routes every intent to the element
 * with input in the current mode.
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

  /** The target cursor stays on the target while the prompt is asked. */
  const isTargetShown = computed(
    () => mode.value === InventoryMode.ChoosingTarget || mode.value === InventoryMode.AnsweringPrompt,
  );
  /** The target cursor's slot while it shows, or `null`. */
  const targetIndex = computed(() => (isTargetShown.value ? targetCursor.index.value : null));
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
  /** The model shows in place of the action menu while it is viewed, described and spun out. */
  const isModelShown = computed(
    () =>
      mode.value === InventoryMode.ViewingModel ||
      mode.value === InventoryMode.ReadingDescription ||
      mode.value === InventoryMode.ClosingModel,
  );
  /** The model stays still while its item description is read. */
  const isModelFrozen = computed(() => mode.value === InventoryMode.ReadingDescription);
  const isModelClosing = computed(() => mode.value === InventoryMode.ClosingModel);

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
      choose: () => combineWithTarget(),
      back: () => setMode(InventoryMode.ChoosingAction),
    },
    [InventoryMode.AnsweringPrompt]: {
      point: index => prompt.cursor.point(index),
      choose: () => answerPointedChoice(),
      back: () => closePrompt(),
    },
    [InventoryMode.ViewingModel]: {
      choose: () => showItemDescription(),
      back: () => setMode(InventoryMode.ClosingModel),
    },
    [InventoryMode.ReadingDescription]: {
      back: () => hideItemDescription(),
    },
    [InventoryMode.ClosingModel]: {},
  };

  /** What each option of the action menu does to the selected item. CHECK and COMBN start a sequence of modes. */
  const optionHandlers: Record<ItemAction, (item: PlayerItem) => void> = {
    [ItemAction.Equip]: item => applyOutcome(equip(item)),
    [ItemAction.Use]: item => applyOutcome(use(item)),
    [ItemAction.Check]: () => setMode(InventoryMode.ViewingModel),
    [ItemAction.Combine]: () => startCombine(),
  };

  /** What comes after each kind of outcome. */
  const outcomeHandlers: OutcomeHandlers = {
    [OutcomeKind.Done]: () => releaseItem(),
    [OutcomeKind.Description]: outcome => description.open(outcome.text),
    [OutcomeKind.Prompt]: outcome => openPrompt(outcome.question, outcome.choices),
    [OutcomeKind.Nothing]: () => {},
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
    mode.value = InventoryMode.ChoosingAction;
  }

  /** Changes the mode; for handlers that do nothing else. */
  function setMode(nextMode: InventoryMode) {
    mode.value = nextMode;
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

  /** Runs the option under the option cursor on the selected item. */
  function choosePointedOption() {
    const item = selectedItem.value;
    const option = actionMenu.pointedOption.value;
    if (item && option) optionHandlers[option](item);
  }

  /** Starts picking a second item, with the target cursor on the selected item. */
  function startCombine() {
    targetCursor.point(mainCursor.index.value);
    mode.value = InventoryMode.ChoosingTarget;
  }

  /** Combines the selected item with the one under the target cursor. */
  function combineWithTarget() {
    const source = selectedItem.value;
    if (source) applyOutcome(combine(source, player.inventory[targetCursor.index.value] ?? null));
  }

  /** Answers the prompt with the choice under the choice cursor. */
  function answerPointedChoice() {
    const choice = prompt.pointedChoice.value;
    if (choice) answer(choice);
  }

  /** Yes mixes the herbs; No goes back to picking a second item. */
  function answer(choice: PromptChoice) {
    const source = selectedItem.value;
    const target = player.inventory[targetCursor.index.value];
    if (choice === PromptChoice.Yes && source && target) {
      applyOutcome(mix(source, target));
    } else {
      closePrompt();
    }
  }

  /** Types the item description and freezes the model. */
  function showItemDescription() {
    description.open(PLACEHOLDER_DESCRIPTION, true);
    mode.value = InventoryMode.ReadingDescription;
  }

  /** Removes the item description and gives the model's controls back. */
  function hideItemDescription() {
    description.close();
    mode.value = InventoryMode.ViewingModel;
  }

  /** Asks the question in place of any description. */
  function openPrompt(question: string, choices: PromptChoice[]) {
    description.close();
    prompt.open(question, choices);
    mode.value = InventoryMode.AnsweringPrompt;
  }

  /** Removes the prompt and goes back to picking a second item. */
  function closePrompt() {
    prompt.close();
    mode.value = InventoryMode.ChoosingTarget;
  }

  /**
   * Decides what comes after an action. TypeScript cannot tie the handler's
   * kind to the outcome's kind, so the handler is widened to take any outcome.
   */
  function applyOutcome(outcome: Outcome) {
    const handler = outcomeHandlers[outcome.kind] as (outcome: Outcome) => void;
    handler(outcome);
  }

  return {
    mode,
    selectedItem,
    mainCursor,
    targetIndex,
    actionMenu,
    description,
    prompt,
    itemUnderCursor,
    panelText,
    hasSelectedItem,
    isGridActive,
    isActionMenuActive,
    isModelShown,
    isModelFrozen,
    isModelClosing,
    point,
    choose,
    back,
    onDescriptionTyped,
    onItemPreviewExited,
  };
});
