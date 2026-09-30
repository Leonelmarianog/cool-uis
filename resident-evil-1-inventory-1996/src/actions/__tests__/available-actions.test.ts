import { describe, expect, test } from 'vitest';
import { ItemAction } from '../../types/item-action';
import { ItemType } from '../../types/item';
import { availableActions } from '../available-actions';

describe('availableActions', () => {
  test('offers EQUIP, CHECK and COMBN for a weapon', () => {
    const actions = availableActions({ id: 'weapon-1', itemId: 'weapon', type: ItemType.Weapon, loadedRounds: 0 });

    expect(actions).toEqual([ItemAction.Equip, ItemAction.Check, ItemAction.Combine]);
  });

  test('offers USE, CHECK and COMBN for any other item', () => {
    const actions = availableActions({ id: 'consumable-1', itemId: 'consumable', type: ItemType.Consumable });

    expect(actions).toEqual([ItemAction.Use, ItemAction.Check, ItemAction.Combine]);
  });
});
