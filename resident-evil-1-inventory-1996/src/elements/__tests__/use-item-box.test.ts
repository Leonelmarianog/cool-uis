import { describe, expect, test } from 'vitest';
import { Direction } from '../../types/direction';
import { useItemBox } from '../use-item-box';

describe('open', () => {
  test('puts row 1 in the band', () => {
    const itemBox = useItemBox(5);
    itemBox.cursor.point(3);

    itemBox.open();

    expect(itemBox.cursor.index.value).toBe(0);
  });
});

describe('move', () => {
  test('moves the band down one row', () => {
    const itemBox = useItemBox(5);

    itemBox.move(Direction.Down);

    expect(itemBox.cursor.index.value).toBe(1);
  });

  test('moves the band up one row', () => {
    const itemBox = useItemBox(5);
    itemBox.cursor.point(3);

    itemBox.move(Direction.Up);

    expect(itemBox.cursor.index.value).toBe(2);
  });

  test('moves the band from the first row up to the last row', () => {
    const itemBox = useItemBox(5);

    itemBox.move(Direction.Up);

    expect(itemBox.cursor.index.value).toBe(4);
  });

  test('moves the band from the last row down to the first row', () => {
    const itemBox = useItemBox(5);
    itemBox.cursor.point(4);

    itemBox.move(Direction.Down);

    expect(itemBox.cursor.index.value).toBe(0);
  });

  test('keeps the band on its row on the left arrow', () => {
    const itemBox = useItemBox(5);
    itemBox.cursor.point(2);

    itemBox.move(Direction.Left);

    expect(itemBox.cursor.index.value).toBe(2);
  });

  test('keeps the band on its row on the right arrow', () => {
    const itemBox = useItemBox(5);
    itemBox.cursor.point(2);

    itemBox.move(Direction.Right);

    expect(itemBox.cursor.index.value).toBe(2);
  });
});
