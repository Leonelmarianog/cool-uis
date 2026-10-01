import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { availableActions } from '../actions/available-actions';
import { combine, mix } from '../actions/combine';
import { equip } from '../actions/equip';
import { use } from '../actions/use';
import { useActionMenu } from '../elements/use-action-menu';
import { useCursor } from '../elements/use-cursor';
import { useDescription } from '../elements/use-description';
import { step } from '../elements/step';
import { ITEM_GRID_COLUMNS, useMainCursor } from '../elements/use-main-cursor';
import { usePrompt } from '../elements/use-prompt';
import { itemViewMapper } from '../mappers/item-view-mapper';
import { itemService } from '../services/item-service';
import { CursorArea } from '../types/cursor-area';
import type { Direction } from '../types/direction';
import { InventoryMode } from '../types/inventory-mode';
import { ItemAction } from '../types/item-action';
import type { ItemView } from '../types/item-view';
import { OutcomeKind } from '../types/outcome';
import type { Outcome } from '../types/outcome';
import type { PlayerItem } from '../types/player';
import { PromptChoice } from '../types/prompt-choice';
import { TOP_MENU_OPTIONS, TopMenuOption } from '../types/top-menu-option';
import { usePlayerStore } from './player';

/**
 * Every item shows the Beretta's description (from check-item-in-out.gif)
 * until real descriptions exist.
 */
const PLACEHOLDER_DESCRIPTION = 'Beretta M92FS. Automatic\nloaded with 9mm bullets.';

/** Joins a player item with its catalog data for display. */
function toItemView(playerItem: PlayerItem): ItemView {
  return itemViewMapper.toItemView(playerItem, itemService.find(playerItem.itemId));
}

/** The modes in which a description or a prompt is open in the description panel. */
const TEXT_MODES: InventoryMode[] = [
  InventoryMode.TypingText,
  InventoryMode.ReadingDescription,
  InventoryMode.AnsweringPrompt,
];

/** The modes in which CHECK's model shows in place of the action menu. */
const MODEL_MODES: InventoryMode[] = [
  InventoryMode.OpeningModel,
  InventoryMode.ViewingModel,
  InventoryMode.ClosingModel,
];

/** What each intent does in one mode. A missing handler means the intent does nothing in that mode. */
type ModeHandlers = {
  move?: (direction: Direction) => void;
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
  /** The mode to go back to when the open description or prompt closes. */
  const returnMode = ref<InventoryMode>(InventoryMode.Browsing);
  /** The item whose action menu is open. */
  const selectedItem = ref<PlayerItem | null>(null);
  /** S was pressed while the open text types, so the rest of it types faster. */
  const isTextHurried = ref(false);

  const mainCursor = useMainCursor();
  /** Points at the second item for COMBN. */
  const targetCursor = useCursor();
  const actionMenu = useActionMenu();
  const description = useDescription();
  const prompt = usePrompt();

  /** The grid's items, in slot order. */
  const items = computed(() => player.inventory.map(toItemView));
  /** The equipped weapon, or `null` when the player is unarmed. */
  const equippedWeapon = computed(() => {
    const weapon = player.inventory.find(playerItem => playerItem.id === player.equippedItemId);
    return weapon ? toItemView(weapon) : null;
  });

  /** Whether a description or a prompt is open in the description panel. */
  const isTextOpen = computed(() => TEXT_MODES.includes(mode.value));
  /** The mode under the open description or prompt, or the current mode while none is open. */
  const modeBelowText = computed(() => (isTextOpen.value ? returnMode.value : mode.value));

  /** The target cursor's slot while the player picks a target, and while a description or prompt from COMBN is open; otherwise `null`. */
  const targetIndex = computed(() =>
    modeBelowText.value === InventoryMode.ChoosingTarget ? targetCursor.index.value : null,
  );
  /** The item whose name the description panel shows: the one under the target cursor while it shows. */
  const itemUnderCursor = computed(() => {
    const index = targetIndex.value ?? mainCursor.gridIndex.value;
    return index === null ? null : (items.value[index] ?? null);
  });
  /** The text the description panel types in place of the item name: the prompt's question or the description. */
  const panelText = computed(() => prompt.question.value ?? description.text.value);
  const hasSelectedItem = computed(() => selectedItem.value !== null);
  /** The action menu takes input only while the player picks an option; it stays open under a description from USE. */
  const isActionMenuActive = computed(() => mode.value === InventoryMode.ChoosingAction);
  /** The model shows in place of the action menu from the moment it tumbles in until it has spun out. */
  const isModelShown = computed(() => MODEL_MODES.includes(modeBelowText.value));
  /** The model stays still while its item description is open. */
  const isModelFrozen = computed(() => isTextOpen.value && modeBelowText.value === InventoryMode.ViewingModel);
  const isModelClosing = computed(() => mode.value === InventoryMode.ClosingModel);

  /** What `move`, `choose` and `back` do in each mode. */
  const handlers: Record<InventoryMode, ModeHandlers> = {
    [InventoryMode.Browsing]: {
      move: direction => mainCursor.move(direction, player.inventorySize),
      choose: () => areaHandlers[mainCursor.area.value](),
    },
    [InventoryMode.ChoosingAction]: {
      move: direction => actionMenu.move(direction),
      choose: () => choosePointedOption(),
      back: () => releaseItem(),
    },
    [InventoryMode.ChoosingTarget]: {
      move: direction => moveTargetCursor(direction),
      choose: () => combineWithTarget(),
      back: () => setMode(InventoryMode.ChoosingAction),
    },
    [InventoryMode.TypingText]: {
      choose: () => hurryText(),
    },
    [InventoryMode.ReadingDescription]: {
      choose: () => closeDescription(),
      back: () => closeDescription(),
    },
    [InventoryMode.AnsweringPrompt]: {
      move: direction => prompt.move(direction),
      choose: () => answerPointedChoice(),
      back: () => closePrompt(),
    },
    [InventoryMode.OpeningModel]: {},
    [InventoryMode.ViewingModel]: {
      choose: () => openDescription(PLACEHOLDER_DESCRIPTION),
      back: () => setMode(InventoryMode.ClosingModel),
    },
    [InventoryMode.ClosingModel]: {},
  };

  /** What each option of the action menu does to the selected item. CHECK and COMBN start a sequence of modes. */
  const optionHandlers: Record<ItemAction, (item: PlayerItem) => void> = {
    [ItemAction.Equip]: item => applyOutcome(equip(item)),
    [ItemAction.Use]: item => applyOutcome(use(item)),
    [ItemAction.Check]: () => setMode(InventoryMode.OpeningModel),
    [ItemAction.Combine]: () => startCombine(),
  };

  /** What `choose` does while browsing, by the main cursor's area. */
  const areaHandlers: Record<CursorArea, () => void> = {
    [CursorArea.Grid]: () => selectItemUnderCursor(),
    [CursorArea.TopMenu]: () => chooseTopMenuOption(),
  };

  /** What each top menu button does. The screens they open are not built yet, so each one logs. */
  const topMenuHandlers: Record<TopMenuOption, () => void> = {
    [TopMenuOption.Map]: () => console.info('MAP: the map screen is not built yet.'),
    [TopMenuOption.File]: () => console.info('FILE: the files screen is not built yet.'),
    [TopMenuOption.ItemBox]: () => console.info('ITEM BOX: the item box is not built yet.'),
    [TopMenuOption.Exit]: () => console.info('EXIT: there is no game to go back to yet.'),
  };

  /** What comes after each kind of outcome. */
  const outcomeHandlers: OutcomeHandlers = {
    [OutcomeKind.Done]: () => releaseItem(),
    [OutcomeKind.Description]: outcome => openDescription(outcome.text),
    [OutcomeKind.Prompt]: outcome => openPrompt(outcome.question, outcome.choices),
    [OutcomeKind.Nothing]: () => {},
  };

  /** Moves the cursor of the element with input one step. */
  function move(direction: Direction) {
    handlers[mode.value].move?.(direction);
  }

  /** Confirms the position of the cursor of the element with input. */
  function choose() {
    handlers[mode.value].choose?.();
  }

  /** Steps back once. */
  function back() {
    handlers[mode.value].back?.();
  }

  /** The description panel finished typing a description; S or A can close it now. */
  function onDescriptionTyped() {
    mode.value = InventoryMode.ReadingDescription;
  }

  /** The description panel finished typing a prompt's question; its choices can be answered now. */
  function onPromptTyped() {
    mode.value = InventoryMode.AnsweringPrompt;
  }

  /** The model tumbled into the item preview panel; it can be turned now. */
  function onItemPreviewEntered() {
    mode.value = InventoryMode.ViewingModel;
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

  /** Runs the top menu button under the main cursor. */
  function chooseTopMenuOption() {
    const option = TOP_MENU_OPTIONS[mainCursor.index.value];
    if (option) topMenuHandlers[option]();
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

  /** Moves the target cursor one slot; it stays in the grid. */
  function moveTargetCursor(direction: Direction) {
    targetCursor.point(step(targetCursor.index.value, direction, ITEM_GRID_COLUMNS, player.inventorySize));
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

  /** Types the rest of the open text faster. */
  function hurryText() {
    isTextHurried.value = true;
  }

  /** Types a description; the current mode becomes the return mode. */
  function openDescription(text: string) {
    returnMode.value = mode.value;
    isTextHurried.value = false;
    description.open(text);
    mode.value = InventoryMode.TypingText;
  }

  /** Removes the description and goes back to the return mode. */
  function closeDescription() {
    description.close();
    mode.value = returnMode.value;
  }

  /** Types a prompt's question; the current mode becomes the return mode. */
  function openPrompt(question: string, choices: PromptChoice[]) {
    returnMode.value = mode.value;
    isTextHurried.value = false;
    prompt.open(question, choices);
    mode.value = InventoryMode.TypingText;
  }

  /** Removes the prompt and goes back to the return mode. */
  function closePrompt() {
    prompt.close();
    mode.value = returnMode.value;
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
    returnMode,
    selectedItem,
    mainCursor,
    targetIndex,
    actionMenu,
    description,
    prompt,
    items,
    equippedWeapon,
    itemUnderCursor,
    panelText,
    isTextHurried,
    hasSelectedItem,
    isActionMenuActive,
    isModelShown,
    isModelFrozen,
    isModelClosing,
    move,
    choose,
    back,
    onDescriptionTyped,
    onPromptTyped,
    onItemPreviewEntered,
    onItemPreviewExited,
  };
});
