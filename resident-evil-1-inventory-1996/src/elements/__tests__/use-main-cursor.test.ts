import { describe, expect, test } from 'vitest';
import { CursorArea } from '../../types/cursor-area';
import { useMainCursor } from '../use-main-cursor';

describe('point', () => {
  test('moves the main cursor to the given position in its area', () => {
    const cursor = useMainCursor();

    cursor.point(CursorArea.Grid, 2);

    expect(cursor.index.value).toBe(2);
  });

  test('moves the main cursor to the given area', () => {
    const cursor = useMainCursor();

    cursor.point(CursorArea.TopMenu, 1);

    expect(cursor.area.value).toBe(CursorArea.TopMenu);
  });
});

describe('gridIndex', () => {
  test("is the main cursor's slot while it is in the grid", () => {
    const cursor = useMainCursor();

    cursor.point(CursorArea.Grid, 2);

    expect(cursor.gridIndex.value).toBe(2);
  });

  test('is no slot while the main cursor is in another area', () => {
    const cursor = useMainCursor();

    cursor.point(CursorArea.TopMenu, 1);

    expect(cursor.gridIndex.value).toBeNull();
  });
});
