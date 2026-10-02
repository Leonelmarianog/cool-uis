import { describe, expect, test } from 'vitest';
import { ItemType } from '../../types/item';
import type { Item } from '../../types/item';
import type { PlayerItem } from '../../types/player';
import { itemViewMapper } from '../item-view-mapper';

describe('toItemView', () => {
  describe('mapping weapons', () => {
    test('maps a player weapon and its item to an item view', () => {
      const playerItem: PlayerItem = {
        id: 'player-item-id',
        itemId: 'weapon-id',
        type: ItemType.Weapon,
        loadedRounds: 10,
      };
      const item: Item = {
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon/beretta.png',
        description: 'Item description.',
        weapon: { capacity: 15, ammunition: ['ammunition-id'] },
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view).toEqual({
        id: 'player-item-id',
        name: 'WEAPON NAME',
        type: ItemType.Weapon,
        sprite: expect.stringContaining('weapon/beretta.png'),
        amount: 10,
      });
    });

    test('maps a player weapon without rounds to an item view without an amount', () => {
      const playerItem: PlayerItem = { id: 'player-item-id', itemId: 'weapon-id', type: ItemType.Weapon };
      const item: Item = {
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon/combat-knife.png',
        description: 'Item description.',
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view.amount).toBeUndefined();
    });
  });

  describe('mapping ammunition', () => {
    test('maps player ammunition and its item to an item view', () => {
      const playerItem: PlayerItem = {
        id: 'player-item-id',
        itemId: 'ammunition-id',
        type: ItemType.Ammunition,
        amount: 15,
      };
      const item: Item = {
        id: 'ammunition-id',
        type: ItemType.Ammunition,
        name: 'AMMUNITION NAME',
        sprite: 'ammo/clip.png',
        description: 'Item description.',
        ammunition: { maxStack: 255 },
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view).toEqual({
        id: 'player-item-id',
        name: 'AMMUNITION NAME',
        type: ItemType.Ammunition,
        sprite: expect.stringContaining('ammo/clip.png'),
        amount: 15,
      });
    });
  });

  describe('mapping consumables', () => {
    test('maps a player consumable and its item to an item view', () => {
      const playerItem: PlayerItem = { id: 'player-item-id', itemId: 'consumable-id', type: ItemType.Consumable };
      const item: Item = {
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'recovery-items/green-herb.png',
        description: 'Item description.',
        herb: true,
        recovery: { steps: 1, curesPoison: false },
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view).toEqual({
        id: 'player-item-id',
        name: 'CONSUMABLE NAME',
        type: ItemType.Consumable,
        sprite: expect.stringContaining('recovery-items/green-herb.png'),
        amount: undefined,
      });
    });
  });

  describe('resolving images', () => {
    test('throws when the image file does not exist', () => {
      const playerItem: PlayerItem = { id: 'player-item-id', itemId: 'consumable-id', type: ItemType.Consumable };
      const item: Item = {
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'missing.png',
        description: 'Item description.',
      };

      expect(() => itemViewMapper.toItemView(playerItem, item)).toThrow('Unknown item image "missing.png"');
    });
  });
});
