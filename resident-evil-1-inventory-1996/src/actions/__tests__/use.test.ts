import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { usePlayerStore } from '../../stores/player';
import { ItemType } from '../../types/item';
import { OutcomeKind } from '../../types/outcome';
import { use } from '../use';

beforeEach(() => {
  vi.stubGlobal('window', {});
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('use', () => {
  test('finishes the action for a recovery item', () => {
    const player = usePlayerStore();
    const herb = { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable } as const;
    player.inventory = [herb];

    const outcome = use(herb);

    expect(outcome).toEqual({ kind: OutcomeKind.Done });
  });

  test('shows "You can\'t use this alone." for ammunition', () => {
    const player = usePlayerStore();
    const clip = { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 } as const;
    player.inventory = [clip];

    const outcome = use(clip);

    expect(outcome).toEqual({ kind: OutcomeKind.Description, text: "You can't use this alone." });
  });
});
