import { describe, expect, test } from 'vitest';
import { ItemType } from '../../types/item';
import type { Item } from '../../types/item';
import type { PlayerItem } from '../../types/player';
import { RoundsColor } from '../../types/rounds-color';
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
        description: 'Item description.',
        amount: 10,
        amountColor: RoundsColor.Green,
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

    test('maps a player weapon with fuel to an item view marked as fuel', () => {
      const playerItem: PlayerItem = {
        id: 'player-item-id',
        itemId: 'weapon-id',
        type: ItemType.Weapon,
        loadedRounds: 100,
      };
      const item: Item = {
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon/flamethrower.png',
        description: 'Item description.',
        weapon: { capacity: 100, ammunition: [], fuel: true },
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view.fuel).toBe(true);
    });

    test('maps a player weapon with rounds to an item view not marked as fuel', () => {
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

      expect(view.fuel).toBeUndefined();
    });

    test('maps a player weapon with loaded rounds to the description of those rounds', () => {
      const playerItem: PlayerItem = {
        id: 'player-item-id',
        itemId: 'weapon-id',
        type: ItemType.Weapon,
        loadedRounds: 3,
        loadedAmmunitionId: 'second-ammunition-id',
      };
      const item: Item = {
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon/bazooka.png',
        description: 'Item description.',
        weapon: {
          capacity: 6,
          ammunition: ['first-ammunition-id', 'second-ammunition-id'],
          rounds: {
            'first-ammunition-id': { description: 'First description.', color: RoundsColor.Green },
            'second-ammunition-id': { description: 'Second description.', color: RoundsColor.Red },
          },
        },
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view.description).toBe('Second description.');
    });

    test('maps a player weapon with loaded rounds to the colour of those rounds', () => {
      const playerItem: PlayerItem = {
        id: 'player-item-id',
        itemId: 'weapon-id',
        type: ItemType.Weapon,
        loadedRounds: 0,
        loadedAmmunitionId: 'second-ammunition-id',
      };
      const item: Item = {
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon/bazooka.png',
        description: 'Item description.',
        weapon: {
          capacity: 6,
          ammunition: ['first-ammunition-id', 'second-ammunition-id'],
          rounds: {
            'first-ammunition-id': { description: 'First description.', color: RoundsColor.Green },
            'second-ammunition-id': { description: 'Second description.', color: RoundsColor.Orange },
          },
        },
      };

      const view = itemViewMapper.toItemView(playerItem, item);

      expect(view.amountColor).toBe(RoundsColor.Orange);
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
        description: 'Item description.',
        amount: 15,
        amountColor: RoundsColor.Green,
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
        description: 'Item description.',
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
