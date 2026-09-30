import { describe, expect, test } from 'vitest';
import { useCursor } from '../use-cursor';

describe('point', () => {
  test('moves the cursor to the given position', () => {
    const cursor = useCursor();

    cursor.point(3);

    expect(cursor.index.value).toBe(3);
  });
});

describe('reset', () => {
  test('moves the cursor back to the first position', () => {
    const cursor = useCursor();
    cursor.point(3);

    cursor.reset();

    expect(cursor.index.value).toBe(0);
  });
});
