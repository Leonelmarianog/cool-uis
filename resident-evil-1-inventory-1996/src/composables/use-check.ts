import { computed } from 'vue';
import type { Ref } from 'vue';
import { InventoryMode } from '../types/inventory-mode';
import type { DescriptionPanel } from './use-description-panel';

/**
 * Every item shows the Beretta's description (from check-item-in-out.gif)
 * until real descriptions exist.
 */
const PLACEHOLDER_DESCRIPTION = 'Beretta M92FS. Automatic\nloaded with 9mm bullets.';

/** CHECK: the selected item's 3D model, its description, and its spin-out. */
export function useCheck(mode: Ref<InventoryMode>, description: DescriptionPanel) {
  /** The model stays shown while the description is typed and while it spins out. */
  const isModelShown = computed(
    () =>
      mode.value === InventoryMode.ModelView ||
      mode.value === InventoryMode.ModelDescription ||
      mode.value === InventoryMode.ModelClosing,
  );
  const isDescribing = computed(() => mode.value === InventoryMode.ModelDescription);
  const isClosing = computed(() => mode.value === InventoryMode.ModelClosing);

  /** Shows the model in place of the action menu. */
  function start() {
    mode.value = InventoryMode.ModelView;
  }

  /** Types the item's description and freezes the model. */
  function showDescription() {
    if (mode.value !== InventoryMode.ModelView) return;
    mode.value = InventoryMode.ModelDescription;
    description.describe(PLACEHOLDER_DESCRIPTION);
  }

  /** Removes the description and gives the model's controls back. */
  function hideDescription() {
    mode.value = InventoryMode.ModelView;
    description.clear();
  }

  /** Spins the model out; the menu returns once it is gone. */
  function close() {
    mode.value = InventoryMode.ModelClosing;
  }

  /** Brings the action menu back once the model has spun out. */
  function finish() {
    mode.value = InventoryMode.ItemSelected;
  }

  return { isModelShown, isDescribing, isClosing, start, showDescription, hideDescription, close, finish };
}
