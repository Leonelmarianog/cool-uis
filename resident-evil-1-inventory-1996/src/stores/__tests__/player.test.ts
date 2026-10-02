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

describe('inventory', () => {
  test('has the Beretta in slot 1', () => {
    const player = usePlayerStore();

    expect(player.inventory[0]).toEqual({
      id: 'player-item-1',
      itemId: 'beretta',
      type: ItemType.Weapon,
      loadedRounds: 15,
    });
  });

  test('has the combat knife in slot 2', () => {
    const player = usePlayerStore();

    expect(player.inventory[1]).toEqual({ id: 'player-item-2', itemId: 'combat-knife', type: ItemType.Weapon });
  });

  test('has nothing after slot 2', () => {
    const player = usePlayerStore();

    expect(player.inventory).toHaveLength(2);
  });
});

describe('equippedItemId', () => {
  test('starts with the Beretta equipped', () => {
    const player = usePlayerStore();

    expect(player.equippedItemId).toBe('player-item-1');
  });
});

describe('itemBox', () => {
  test('has 64 rows', () => {
    const player = usePlayerStore();

    expect(player.itemBox).toHaveLength(64);
  });

  test('has empty rows after the starting items', () => {
    const player = usePlayerStore();

    expect(player.itemBox[ITEM_BOX_SIZE - 1]).toBeNull();
  });

  test('has the shotgun in row 1', () => {
    const player = usePlayerStore();

    expect(player.itemBox[0]).toEqual({
      id: 'player-item-3',
      itemId: 'shotgun',
      type: ItemType.Weapon,
      loadedRounds: 5,
    });
  });

  test('has the closet key in row 56', () => {
    const player = usePlayerStore();

    expect(player.itemBox[55]).toEqual({ id: 'player-item-58', itemId: 'closet-key', type: ItemType.Key });
  });

  test('has an empty row 57', () => {
    const player = usePlayerStore();

    expect(player.itemBox[56]).toBeNull();
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

describe('reload', () => {
  test('refuses a weapon that uses no ammunition', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'knife-1', itemId: 'combat-knife', type: ItemType.Weapon },
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
    ];

    const reloaded = player.reload('knife-1', 'clip-1');

    expect([reloaded, player.inventory[1]]).toEqual([false, expect.objectContaining({ amount: 15 })]);
  });

  test('refuses ammunition combined into a weapon that uses no ammunition', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
      { id: 'knife-1', itemId: 'combat-knife', type: ItemType.Weapon },
    ];

    const reloaded = player.reload('clip-1', 'knife-1');

    expect([reloaded, player.inventory[0]]).toEqual([false, expect.objectContaining({ amount: 15 })]);
  });

  test('refuses a weapon that runs on fuel', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'flamethrower-1', itemId: 'flamethrower', type: ItemType.Weapon, loadedRounds: 100 },
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
    ];

    const reloaded = player.reload('flamethrower-1', 'clip-1');

    expect([reloaded, player.inventory[1]]).toEqual([false, expect.objectContaining({ amount: 15 })]);
  });

  test('refuses ammunition combined into a weapon that runs on fuel', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
      { id: 'flamethrower-1', itemId: 'flamethrower', type: ItemType.Weapon, loadedRounds: 100 },
    ];

    const reloaded = player.reload('clip-1', 'flamethrower-1');

    expect([reloaded, player.inventory[0]]).toEqual([false, expect.objectContaining({ amount: 15 })]);
  });

  test('loads magnum rounds into the Colt Python', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'colt-1', itemId: 'colt-python', type: ItemType.Weapon, loadedRounds: 2 },
      { id: 'magnum-1', itemId: 'magnum-rounds', type: ItemType.Ammunition, amount: 12 },
    ];

    player.reload('colt-1', 'magnum-1');

    expect(player.inventory).toEqual([
      expect.objectContaining({ loadedRounds: 6 }),
      expect.objectContaining({ amount: 8 }),
    ]);
  });

  test('refuses a clip combined with the rocket launcher', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'rocket-1', itemId: 'rocket-launcher', type: ItemType.Weapon, loadedRounds: 4 },
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
    ];

    const reloaded = player.reload('rocket-1', 'clip-1');

    expect([reloaded, player.inventory[1]]).toEqual([false, expect.objectContaining({ amount: 15 })]);
  });

  test('refuses a clip combined into the rocket launcher', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
      { id: 'rocket-1', itemId: 'rocket-launcher', type: ItemType.Weapon, loadedRounds: 4 },
    ];

    const reloaded = player.reload('clip-1', 'rocket-1');

    expect([reloaded, player.inventory[0]]).toEqual([false, expect.objectContaining({ amount: 15 })]);
  });
});
