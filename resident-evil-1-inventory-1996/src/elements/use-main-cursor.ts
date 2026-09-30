import { computed, ref } from 'vue';
import { CursorArea } from '../types/cursor-area';
import { useCursor } from './use-cursor';

/**
 * The inventory screen's one cursor. Its position is an area and an index in
 * that area, and it shows only in its current area.
 */
export function useMainCursor() {
  const area = ref<CursorArea>(CursorArea.Grid);
  const cursor = useCursor();

  /** The cursor's slot, or `null` while the cursor is in another area. */
  const gridIndex = computed(() => (area.value === CursorArea.Grid ? cursor.index.value : null));
  /** The cursor's button, or `null` while the cursor is in another area. */
  const topMenuIndex = computed(() => (area.value === CursorArea.TopMenu ? cursor.index.value : null));

  /** Moves the cursor to the given index of the given area. */
  function point(nextArea: CursorArea, index: number) {
    area.value = nextArea;
    cursor.point(index);
  }

  return { area, index: cursor.index, gridIndex, topMenuIndex, point };
}
