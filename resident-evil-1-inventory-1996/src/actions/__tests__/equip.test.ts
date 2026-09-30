import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { usePlayerStore } from '../../stores/player';
import { ItemType } from '../../types/item';
import { OutcomeKind } from '../../types/outcome';
import { equip } from '../equip';

beforeEach(() => {
  vi.stubGlobal('window', {});
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('equip', () => {
  test('equips the weapon', () => {
    const player = usePlayerStore();
    const beretta = { id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 } as const;
    player.inventory = [beretta];
    player.equippedItemId = null;

    equip(beretta);

    expect(player.equippedItemId).toBe('beretta-1');
  });

  test('unequips the equipped weapon', () => {
    const player = usePlayerStore();
    const beretta = { id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 } as const;
    player.inventory = [beretta];
    player.equippedItemId = 'beretta-1';

    equip(beretta);

    expect(player.equippedItemId).toBeNull();
  });

  test('finishes the action', () => {
    const player = usePlayerStore();
    const beretta = { id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 } as const;
    player.inventory = [beretta];

    const outcome = equip(beretta);

    expect(outcome).toEqual({ kind: OutcomeKind.Done });
  });
});
