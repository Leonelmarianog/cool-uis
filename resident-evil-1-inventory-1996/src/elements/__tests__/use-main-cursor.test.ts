import { describe, expect, test } from 'vitest';
import { CursorArea } from '../../types/cursor-area';
import { Direction } from '../../types/direction';
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

describe('topMenuIndex', () => {
  test("is the main cursor's button while it is in the top menu", () => {
    const cursor = useMainCursor();

    cursor.point(CursorArea.TopMenu, 3);

    expect(cursor.topMenuIndex.value).toBe(3);
  });

  test('is no button while the main cursor is in the grid', () => {
    const cursor = useMainCursor();

    cursor.point(CursorArea.Grid, 1);

    expect(cursor.topMenuIndex.value).toBeNull();
  });
});

describe('move', () => {
  test('moves the main cursor to the next slot', () => {
    const cursor = useMainCursor();

    cursor.move(Direction.Right, 8);

    expect(cursor.gridIndex.value).toBe(1);
  });

  test('moves the main cursor from the first slot to the dash button', () => {
    const cursor = useMainCursor();

    cursor.move(Direction.Up, 8);

    expect(cursor.topMenuIndex.value).toBe(2);
  });

  test('moves the main cursor from the second slot to EXIT', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.Grid, 1);

    cursor.move(Direction.Up, 8);

    expect(cursor.topMenuIndex.value).toBe(3);
  });

  test('moves the main cursor from the dash button to the first slot', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.TopMenu, 2);

    cursor.move(Direction.Down, 8);

    expect(cursor.gridIndex.value).toBe(0);
  });

  test('moves the main cursor from EXIT to the second slot', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.TopMenu, 3);

    cursor.move(Direction.Down, 8);

    expect(cursor.gridIndex.value).toBe(1);
  });

  test('moves the main cursor from the dash button up to MAP', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.TopMenu, 2);

    cursor.move(Direction.Up, 8);

    expect(cursor.topMenuIndex.value).toBe(0);
  });

  test('moves the main cursor from MAP down to the dash button', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.TopMenu, 0);

    cursor.move(Direction.Down, 8);

    expect(cursor.topMenuIndex.value).toBe(2);
  });

  test('moves the main cursor from MAP to FILE', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.TopMenu, 0);

    cursor.move(Direction.Right, 8);

    expect(cursor.topMenuIndex.value).toBe(1);
  });

  test('keeps the main cursor on MAP when moving up', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.TopMenu, 0);

    cursor.move(Direction.Up, 8);

    expect(cursor.topMenuIndex.value).toBe(0);
  });

  test('keeps the main cursor on the last slot when moving down', () => {
    const cursor = useMainCursor();
    cursor.point(CursorArea.Grid, 7);

    cursor.move(Direction.Down, 8);

    expect(cursor.gridIndex.value).toBe(7);
  });
});
