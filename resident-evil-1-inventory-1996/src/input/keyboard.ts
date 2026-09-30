import { onMounted, onUnmounted } from 'vue';
import { useInventoryStore } from '../stores/inventory';

/** The key that steps back once, in lowercase. */
const BACK_KEY = 'escape';
/** The key that confirms, like the game's action button, in lowercase. */
const CHOOSE_KEY = 'k';

/**
 * Turns keyboard input into intents on the inventory store while the calling
 * component is mounted. The model viewer handles its rotate and zoom keys for now.
 */
export function useKeyboard() {
  const inventory = useInventoryStore();

  /** The intent each key sends, by the key's lowercase name. */
  const intents: Record<string, () => void> = {
    [BACK_KEY]: () => inventory.back(),
    [CHOOSE_KEY]: () => inventory.choose(),
  };

  /** Sends the key's intent. A held key sends it once, so holding K does not hurry and then close a description. */
  function onKeydown(event: KeyboardEvent) {
    if (event.repeat) return;
    intents[event.key.toLowerCase()]?.();
  }

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}
