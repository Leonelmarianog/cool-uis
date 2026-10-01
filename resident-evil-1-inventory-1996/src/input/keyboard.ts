import { onMounted, onUnmounted } from 'vue';
import { useInventoryStore } from '../stores/inventory';
import { usePlayerStore } from '../stores/player';
import { Direction } from '../types/direction';

/** The key that steps back once, in lowercase. */
const BACK_KEY = 'a';
/** The key that confirms, like the game's action button, in lowercase. */
const CHOOSE_KEY = 's';
/** The key that shows the next health status, a demo control, in lowercase. */
const CYCLE_HEALTH_KEY = 'd';
/** The direction each arrow key moves a cursor, by the key's lowercase name. */
const ARROW_KEYS: Record<string, Direction> = {
  arrowup: Direction.Up,
  arrowdown: Direction.Down,
  arrowleft: Direction.Left,
  arrowright: Direction.Right,
};

/**
 * Turns keyboard input into intents on the inventory store while the calling
 * component is mounted. The model viewer handles its rotate and zoom keys.
 */
export function useKeyboard() {
  const inventory = useInventoryStore();
  const player = usePlayerStore();

  /** The intent each key sends, by the key's lowercase name. */
  const intents: Record<string, () => void> = {
    [BACK_KEY]: () => inventory.back(),
    [CHOOSE_KEY]: () => inventory.choose(),
    [CYCLE_HEALTH_KEY]: () => player.cycleHealthStatus(),
    ...Object.fromEntries(Object.entries(ARROW_KEYS).map(([key, direction]) => [key, () => inventory.move(direction)])),
  };

  /**
   * Sends the key's intent. A held key sends it once, so holding S does not
   * hurry and then close a description. Keys with Ctrl, Alt or Meta are left
   * to the browser, and the page never scrolls on an arrow key.
   */
  function onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const intent = intents[event.key.toLowerCase()];
    if (!intent) return;
    event.preventDefault();
    if (!event.repeat) intent();
  }

  onMounted(() => window.addEventListener('keydown', onKeydown));
  onUnmounted(() => window.removeEventListener('keydown', onKeydown));
}
