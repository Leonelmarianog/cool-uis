import { ref } from 'vue';

/** Marks one position in a list, such as a slot of the grid or an option of the action menu. */
export function useCursor() {
  const index = ref(0);

  /** Moves the cursor to the given position. */
  function point(position: number) {
    index.value = position;
  }

  /** Moves the cursor back to the first position. */
  function reset() {
    index.value = 0;
  }

  return { index, point, reset };
}

export type Cursor = ReturnType<typeof useCursor>;
