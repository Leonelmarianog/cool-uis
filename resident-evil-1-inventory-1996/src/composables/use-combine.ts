import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import { usePlayerStore } from '../stores/player';
import { InventoryMode } from '../types/inventory-mode';
import type { DescriptionPanel } from './use-description-panel';
import type { ItemSelection } from './use-item-selection';

/** COMBN: picking a second item with the green arrows, and the question some combinations ask first. */
export function useCombine(mode: Ref<InventoryMode>, selection: ItemSelection, description: DescriptionPanel) {
  const player = usePlayerStore();

  /** The slot under the green arrows. */
  const targetSlot = ref<number | null>(null);
  /** The item chosen as the target while the question waits for Yes or No. */
  const promptTargetId = ref<string | null>(null);

  /** The green arrows stay on the target while the question is asked. */
  const isCombining = computed(
    () => mode.value === InventoryMode.Combining || mode.value === InventoryMode.CombinePrompt,
  );
  const isPrompting = computed(() => mode.value === InventoryMode.CombinePrompt);

  /** Shows the green arrows on the given slot. */
  function start(slot: number) {
    targetSlot.value = slot;
    mode.value = InventoryMode.Combining;
  }

  /** Moves the green arrows to the given slot. */
  function moveTarget(slot: number) {
    targetSlot.value = slot;
  }

  /**
   * Combines the selected item with the one in the given slot. Items that do
   * not combine, such as the selected item itself or an empty slot, do nothing;
   * herbs that do not mix show a message.
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
        description.ask('Will you mix the herbs?', ['Yes', 'No']);
        mode.value = InventoryMode.CombinePrompt;
      } else {
        description.show('Mixing these does not seem to work.');
      }
    }
  }

  /** Yes mixes the herbs; No goes back to picking a second item. */
  function answer(choice: string) {
    const sourceId = selection.selectedItemId.value;
    if (!sourceId || !promptTargetId.value) return;
    if (choice === 'Yes') {
      player.mix(sourceId, promptTargetId.value);
      finish();
    } else {
      cancelPrompt();
    }
  }

  /** Removes the question and goes back to picking a second item. */
  function cancelPrompt() {
    promptTargetId.value = null;
    description.clear();
    mode.value = InventoryMode.Combining;
  }

  /** Removes the green arrows and goes back to the action menu. */
  function stop() {
    targetSlot.value = null;
    mode.value = InventoryMode.ItemSelected;
  }

  /** Removes the green arrows and closes the action menu after a combination. */
  function finish() {
    targetSlot.value = null;
    promptTargetId.value = null;
    selection.release();
  }

  return { targetSlot, isCombining, isPrompting, start, moveTarget, combineWith, answer, cancelPrompt, stop };
}
