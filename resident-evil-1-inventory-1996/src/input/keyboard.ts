import { onMounted, onUnmounted } from 'vue';
import { useInventoryStore } from '../stores/inventory';

/** The key that steps back once. */
const BACK_KEY = 'Escape';

/**
 * Turns keyboard input into intents on the inventory store while the calling
 * component is mounted. The model viewer handles its own keys for now.
 */
export function useKeyboard() {
  const inventory = useInventoryStore();

  /** Sends `back()` for the back key. */
  function onKeydown(event: KeyboardEvent) {
    if (event.key === BACK_KEY) inventory.back();
  }

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}
