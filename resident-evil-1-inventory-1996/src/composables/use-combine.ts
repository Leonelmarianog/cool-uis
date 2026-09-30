import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { InventoryMode } from '../types/inventory-mode';
import type { Description } from '../elements/use-description';
import type { Prompt } from '../elements/use-prompt';
import { PromptChoice } from '../types/prompt-choice';
import type { ItemSelection } from './use-item-selection';

/** COMBN: picking a second item with the target cursor, and the question some combinations ask first. */
export function useCombine(
  mode: Ref<InventoryMode>,
  selection: ItemSelection,
  description: Description,
  prompt: Prompt,
) {
  const player = usePlayerStore();

  /** The item chosen as the target while the question waits for Yes or No. */
  const promptTargetId = ref<string | null>(null);

  /** The target cursor stays on the target while the question is asked. */
  const isCombining = computed(
    () => mode.value === InventoryMode.ChoosingTarget || mode.value === InventoryMode.AnsweringPrompt,
  );

  /** Starts picking a second item. */
  function start() {
    mode.value = InventoryMode.ChoosingTarget;
  }

  /**
   * Combines the selected item with the one in the given slot. Items that do
   * not combine, such as the selected item itself or an empty slot, do nothing;
   * herbs that do not mix show a description.
   */
  function combineWith(slot: number) {
    const sourceId = selection.selectedItemId.value;
    const target = player.inventorySlots[slot];
    if (!sourceId || !target || target.id === sourceId) return;

    if (player.reload(sourceId, target.id) || player.stack(sourceId, target.id)) {
      finish();
    } else if (player.isHerb(sourceId) && player.isHerb(target.id)) {
      if (player.canMix(sourceId, target.id)) {
        promptTargetId.value = target.id;
        description.close();
        prompt.open('Will you mix the herbs?', [PromptChoice.Yes, PromptChoice.No]);
        mode.value = InventoryMode.AnsweringPrompt;
      } else {
        description.open('Mixing these does not seem to work.');
      }
    }
  }

  /** Yes mixes the herbs; No goes back to picking a second item. */
  function answer(choice: PromptChoice) {
    const sourceId = selection.selectedItemId.value;
    if (!sourceId || !promptTargetId.value) return;
    if (choice === PromptChoice.Yes) {
      player.mix(sourceId, promptTargetId.value);
      finish();
    } else {
      cancelPrompt();
    }
  }

  /** Removes the question and goes back to picking a second item. */
  function cancelPrompt() {
    promptTargetId.value = null;
    prompt.close();
    mode.value = InventoryMode.ChoosingTarget;
  }

  /** Goes back to the action menu. */
  function stop() {
    mode.value = InventoryMode.ChoosingAction;
  }

  /** Closes the action menu after a combination. */
  function finish() {
    promptTargetId.value = null;
    selection.release();
  }

  return { isCombining, start, combineWith, answer, cancelPrompt, stop };
}
