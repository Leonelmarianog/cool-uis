import { describe, expect, test } from 'vitest';
import { ItemType } from '../../types/item';
import type { PlayerWeapon } from '../../types/player';
import { playerMapper } from '../player-mapper';

describe('toPlayerState', () => {
  describe('mapping the player state', () => {
    test('maps a player record to a player state', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'caution',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);

      expect(state).toEqual({
        characterId: 'character-id',
        healthStatus: 'caution',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: ItemType.Weapon, loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      });
    });

    test('maps a weapon record without loaded rounds to a player weapon without them', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon' }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);

      expect(state.inventory).toEqual([{ id: 'player-item-id', itemId: 'weapon-id', type: ItemType.Weapon }]);
    });

    test('keeps the inventory items in the order of the record', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [
          { id: 'first-player-item-id', itemId: 'consumable-id', type: 'consumable' },
          { id: 'second-player-item-id', itemId: 'ammunition-id', type: 'ammunition', amount: 15 },
          { id: 'third-player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 },
        ],
        equippedItemId: 'third-player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);

      expect(state.inventory.map(playerItem => playerItem.id)).toEqual([
        'first-player-item-id',
        'second-player-item-id',
        'third-player-item-id',
      ]);
    });

    test('returns a deep copy of the data', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);
      (state.inventory[0] as PlayerWeapon).loadedRounds = 5;

      expect(json.inventory[0].loadedRounds).toBe(10);
    });
  });

  describe('mapping inventory items', () => {
    test('maps a weapon to a player weapon', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);

      expect(state.inventory[0]).toEqual({
        id: 'player-item-id',
        itemId: 'weapon-id',
        type: ItemType.Weapon,
        loadedRounds: 10,
      });
    });

    test('maps ammunition to player ammunition', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'ammunition-id', type: 'ammunition', amount: 15 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);

      expect(state.inventory[0]).toEqual({
        id: 'player-item-id',
        itemId: 'ammunition-id',
        type: ItemType.Ammunition,
        amount: 15,
      });
    });

    test('maps a consumable to a player consumable', () => {
      const json = {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'consumable-id', type: 'consumable' }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      };

      const state = playerMapper.toPlayerState(json);

      expect(state.inventory[0]).toEqual({
        id: 'player-item-id',
        itemId: 'consumable-id',
        type: ItemType.Consumable,
      });
    });
  });
});
