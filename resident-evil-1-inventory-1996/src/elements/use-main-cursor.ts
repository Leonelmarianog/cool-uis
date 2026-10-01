import { computed, ref } from 'vue';
import { CursorArea } from '../types/cursor-area';
import { Direction } from '../types/direction';
import { TOP_MENU_OPTIONS } from '../types/top-menu-option';
import { step } from './step';
import { useCursor } from './use-cursor';

/** The item grid's columns. */
export const ITEM_GRID_COLUMNS = 2;
/** The top menu's columns. */
const TOP_MENU_COLUMNS = 2;
/** The first button of the top menu's bottom row, the row next to the grid. */
const TOP_MENU_BOTTOM_ROW = TOP_MENU_OPTIONS.length - TOP_MENU_COLUMNS;

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

  /** Up from the grid's top row goes to the top menu button in the same column (top-menu.gif). */
  function moveInGrid(direction: Direction, slotCount: number) {
    const index = cursor.index.value;
    if (direction === Direction.Up && index < ITEM_GRID_COLUMNS) {
      point(CursorArea.TopMenu, TOP_MENU_BOTTOM_ROW + index);
    } else {
      cursor.point(step(index, direction, ITEM_GRID_COLUMNS, slotCount));
    }
  }

  /** Down from the top menu's bottom row goes to the slot in the same column. */
  function moveInTopMenu(direction: Direction) {
    const index = cursor.index.value;
    if (direction === Direction.Down && index >= TOP_MENU_BOTTOM_ROW) {
      point(CursorArea.Grid, index - TOP_MENU_BOTTOM_ROW);
    } else {
      cursor.point(step(index, direction, TOP_MENU_COLUMNS, TOP_MENU_OPTIONS.length));
    }
  }

  /** How the cursor moves in each area. */
  const areaMoves: Record<CursorArea, (direction: Direction, slotCount: number) => void> = {
    [CursorArea.Grid]: moveInGrid,
    [CursorArea.TopMenu]: moveInTopMenu,
  };

  /** Moves the cursor one step; `slotCount` is the number of slots in the grid. At an edge it stays. */
  function move(direction: Direction, slotCount: number) {
    areaMoves[area.value](direction, slotCount);
  }

  return { area, index: cursor.index, gridIndex, topMenuIndex, point, move };
}
