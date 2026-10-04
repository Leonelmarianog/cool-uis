import { describe, expect, test } from 'vitest';
import { RoundsColor } from '../../types/rounds-color';
import { roundsPalette } from '../rounds-colors';

describe('roundsPalette', () => {
  test('uses the red palette for red rounds', () => {
    expect(roundsPalette(RoundsColor.Red)).toBe('--red');
  });

  test('uses the orange palette for orange rounds', () => {
    expect(roundsPalette(RoundsColor.Orange)).toBe('--orange');
  });

  test("uses the font's own green palette for green rounds", () => {
    expect(roundsPalette(RoundsColor.Green)).toBe('normal');
  });

  test("uses the font's own green palette when no colour is given", () => {
    expect(roundsPalette()).toBe('normal');
  });
});
