import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ITEM_BOX_SIZE, usePlayerStore } from '../player';
import { ItemType } from '../../types/item';

beforeEach(() => {
  vi.stubGlobal('window', {});
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('itemBox', () => {
  test('has 48 rows', () => {
    const player = usePlayerStore();

    expect(player.itemBox).toHaveLength(ITEM_BOX_SIZE);
  });

  test('has empty rows after the starting items', () => {
    const player = usePlayerStore();

    expect(player.itemBox[ITEM_BOX_SIZE - 1]).toBeNull();
  });
});

describe('exchangeWithBox', () => {
  test('swaps an inventory item and a box item', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'item-a', itemId: 'a', type: ItemType.Consumable }];
    player.itemBox[0] = { id: 'item-b', itemId: 'b', type: ItemType.Consumable };

    player.exchangeWithBox(0, 0);

    expect([player.inventory[0].id, player.itemBox[0]?.id]).toEqual(['item-b', 'item-a']);
  });

  test('puts a box item taken into an empty slot after the last inventory item', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'item-a', itemId: 'a', type: ItemType.Consumable }];
    player.itemBox[0] = { id: 'item-b', itemId: 'b', type: ItemType.Consumable };

    player.exchangeWithBox(5, 0);

    expect(player.inventory.map(item => item.id)).toEqual(['item-a', 'item-b']);
  });

  test('empties the row of a box item taken into the inventory', () => {
    const player = usePlayerStore();
    player.inventory = [];
    player.itemBox[0] = { id: 'item-b', itemId: 'b', type: ItemType.Consumable };

    player.exchangeWithBox(0, 0);

    expect(player.itemBox[0]).toBeNull();
  });

  test('moves an item stored in an empty row into that row', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'item-a', itemId: 'a', type: ItemType.Consumable }];
    player.itemBox[3] = null;

    player.exchangeWithBox(0, 3);

    expect(player.itemBox[3]).toMatchObject({ id: 'item-a' });
  });

  test('moves the inventory items after a stored item up one slot', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'item-a', itemId: 'a', type: ItemType.Consumable },
      { id: 'item-b', itemId: 'b', type: ItemType.Consumable },
    ];
    player.itemBox[3] = null;

    player.exchangeWithBox(0, 3);

    expect(player.inventory.map(item => item.id)).toEqual(['item-b']);
  });

  test('changes nothing for an empty slot and an empty row', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'item-a', itemId: 'a', type: ItemType.Consumable }];
    player.itemBox[3] = null;

    player.exchangeWithBox(4, 3);

    expect([player.inventory.map(item => item.id), player.itemBox[3]]).toEqual([['item-a'], null]);
  });

  test('unequips the equipped weapon when it is stored', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'weapon-1', itemId: 'weapon', type: ItemType.Weapon, loadedRounds: 1 }];
    player.equippedItemId = 'weapon-1';
    player.itemBox[3] = null;

    player.exchangeWithBox(0, 3);

    expect(player.equippedItemId).toBeNull();
  });

  test('unequips the equipped weapon when it is swapped out', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'weapon-1', itemId: 'weapon', type: ItemType.Weapon, loadedRounds: 1 }];
    player.equippedItemId = 'weapon-1';
    player.itemBox[0] = { id: 'item-b', itemId: 'b', type: ItemType.Consumable };

    player.exchangeWithBox(0, 0);

    expect(player.equippedItemId).toBeNull();
  });

  test('does not equip a weapon taken from the box', () => {
    const player = usePlayerStore();
    player.inventory = [];
    player.equippedItemId = null;
    player.itemBox[0] = { id: 'weapon-2', itemId: 'weapon', type: ItemType.Weapon, loadedRounds: 1 };

    player.exchangeWithBox(0, 0);

    expect(player.equippedItemId).toBeNull();
  });

  test('a stored equipped weapon taken back is not equipped', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'weapon-1', itemId: 'weapon', type: ItemType.Weapon, loadedRounds: 1 }];
    player.equippedItemId = 'weapon-1';
    player.itemBox[3] = null;
    player.exchangeWithBox(0, 3);

    player.exchangeWithBox(0, 3);

    expect(player.equippedItemId).toBeNull();
  });
});
