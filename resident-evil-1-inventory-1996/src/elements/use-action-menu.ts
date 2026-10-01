import { computed, ref } from 'vue';
import type { Direction } from '../types/direction';
import type { ItemAction } from '../types/item-action';
import { step } from './step';
import { useCursor } from './use-cursor';

/** The options for the selected item, and the option cursor. */
export function useActionMenu() {
  /** The options, or none while the menu is closed. */
  const options = ref<ItemAction[]>([]);
  /** Points at an option. */
  const cursor = useCursor();

  const isOpen = computed(() => options.value.length > 0);
  /** The option under the option cursor, or `null` while the menu is closed. */
  const pointedOption = computed(() => options.value[cursor.index.value] ?? null);

  /** Shows the options; the option cursor starts on the first one. */
  function open(menuOptions: ItemAction[]) {
    options.value = menuOptions;
    cursor.reset();
  }

  /** Removes the options. */
  function close() {
    options.value = [];
  }

  /** Moves the option cursor one option up or down; the options form one column. At either end it stays. */
  function move(direction: Direction) {
    cursor.point(step(cursor.index.value, direction, 1, options.value.length));
  }

  return { options, cursor, isOpen, pointedOption, open, close, move };
}

export type ActionMenu = ReturnType<typeof useActionMenu>;
