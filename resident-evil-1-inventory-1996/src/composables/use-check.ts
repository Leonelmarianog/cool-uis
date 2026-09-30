import { computed } from 'vue';
import type { Ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import type { Description } from '../elements/use-description';

/**
 * Every item shows the Beretta's description (from check-item-in-out.gif)
 * until real descriptions exist.
 */
const PLACEHOLDER_DESCRIPTION = 'Beretta M92FS. Automatic\nloaded with 9mm bullets.';

/** CHECK: the selected item's 3D model, its description, and its spin-out. */
export function useCheck(mode: Ref<InventoryMode>, description: Description) {
  /** The model stays shown while the description is typed and while it spins out. */
  const isModelShown = computed(
    () =>
      mode.value === InventoryMode.ViewingModel ||
      mode.value === InventoryMode.ReadingDescription ||
      mode.value === InventoryMode.ClosingModel,
  );
  const isDescribing = computed(() => mode.value === InventoryMode.ReadingDescription);
  const isClosing = computed(() => mode.value === InventoryMode.ClosingModel);

  /** Shows the model in place of the action menu. */
  function start() {
    mode.value = InventoryMode.ViewingModel;
  }

  /** Types the item's description and freezes the model. */
  function showDescription() {
    if (mode.value !== InventoryMode.ViewingModel) return;
    mode.value = InventoryMode.ReadingDescription;
    description.open(PLACEHOLDER_DESCRIPTION, true);
  }

  /** Removes the description and gives the model's controls back. */
  function hideDescription() {
    mode.value = InventoryMode.ViewingModel;
    description.close();
  }

  /** Spins the model out; the menu returns once it is gone. */
  function close() {
    mode.value = InventoryMode.ClosingModel;
  }

  /** Brings the action menu back once the model has spun out. */
  function finish() {
    mode.value = InventoryMode.ChoosingAction;
  }

  return { isModelShown, isDescribing, isClosing, start, showDescription, hideDescription, close, finish };
}
