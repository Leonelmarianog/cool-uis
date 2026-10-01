import { describe, expect, test } from 'vitest';
import { Direction } from '../../types/direction';
import { step } from '../step';

describe('step', () => {
  test('moves right to the next position in the row', () => {
    expect(step(0, Direction.Right, 2, 8)).toBe(1);
  });

  test('moves left to the previous position in the row', () => {
    expect(step(1, Direction.Left, 2, 8)).toBe(0);
  });

  test('moves down to the same column in the next row', () => {
    expect(step(1, Direction.Down, 2, 8)).toBe(3);
  });

  test('moves up to the same column in the previous row', () => {
    expect(step(3, Direction.Up, 2, 8)).toBe(1);
  });

  test('stays at the left edge', () => {
    expect(step(2, Direction.Left, 2, 8)).toBe(2);
  });

  test('stays at the right edge', () => {
    expect(step(1, Direction.Right, 2, 8)).toBe(1);
  });

  test('stays in the top row', () => {
    expect(step(1, Direction.Up, 2, 8)).toBe(1);
  });

  test('stays in the bottom row', () => {
    expect(step(6, Direction.Down, 2, 8)).toBe(6);
  });

  test('stays above a missing position of a short last row', () => {
    expect(step(3, Direction.Down, 2, 5)).toBe(3);
  });

  test('stays before a missing position of a short last row', () => {
    expect(step(4, Direction.Right, 2, 5)).toBe(4);
  });
});
