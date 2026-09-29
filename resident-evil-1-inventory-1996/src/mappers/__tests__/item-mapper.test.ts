import { describe, expect, test } from 'vitest';
import { ItemType } from '../../types/item';
import { itemMapper } from '../item-mapper';

describe('toItem', () => {
  describe('mapping weapons', () => {
    test('maps a weapon record to a weapon item with its weapon data', () => {
      const json = {
        id: 'weapon-id',
        type: 'weapon',
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        weapon: { capacity: 10, ammunition: ['ammunition-id'] },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        weapon: { capacity: 10, ammunition: ['ammunition-id'] },
      });
    });

    test('returns a deep copy of the data', () => {
      const json = {
        id: 'weapon-id',
        type: 'weapon',
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        weapon: { capacity: 10, ammunition: ['ammunition-id'] },
      };

      const item = itemMapper.toItem(json);
      if (item.type === ItemType.Weapon) item.weapon.ammunition.push('other-ammunition-id');

      expect(json.weapon.ammunition).toEqual(['ammunition-id']);
    });
  });

  describe('mapping ammunition', () => {
    test('maps an ammunition record to an ammunition item with its ammunition data', () => {
      const json = {
        id: 'ammunition-id',
        type: 'ammunition',
        name: 'AMMUNITION NAME',
        sprite: 'ammunition.png',
        ammunition: { maxStack: 100 },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'ammunition-id',
        type: ItemType.Ammunition,
        name: 'AMMUNITION NAME',
        sprite: 'ammunition.png',
        ammunition: { maxStack: 100 },
      });
    });

    test('returns a deep copy of the data', () => {
      const json = {
        id: 'ammunition-id',
        type: 'ammunition',
        name: 'AMMUNITION NAME',
        sprite: 'ammunition.png',
        ammunition: { maxStack: 100 },
      };

      const item = itemMapper.toItem(json);
      if (item.type === ItemType.Ammunition) item.ammunition.maxStack = 50;

      expect(json.ammunition.maxStack).toBe(100);
    });
  });

  describe('mapping consumables', () => {
    test('maps a consumable record to a consumable item', () => {
      const json = {
        id: 'consumable-id',
        type: 'consumable',
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        herb: true,
        recovery: { steps: 1, curesPoison: false },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        herb: true,
        recovery: { steps: 1, curesPoison: false },
      });
    });

    test('leaves recovery undefined when the record has none', () => {
      const json = {
        id: 'consumable-id',
        type: 'consumable',
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        herb: true,
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        herb: true,
        recovery: undefined,
      });
    });

    test('leaves the herb flag undefined when the record has none', () => {
      const json = {
        id: 'consumable-id',
        type: 'consumable',
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        recovery: { steps: 1, curesPoison: false },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        herb: undefined,
        recovery: { steps: 1, curesPoison: false },
      });
    });

    test('returns a deep copy of the data', () => {
      const json = {
        id: 'consumable-id',
        type: 'consumable',
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        herb: true,
        recovery: { steps: 1, curesPoison: false },
      };

      const item = itemMapper.toItem(json);
      if (item.type === ItemType.Consumable && item.recovery) item.recovery.steps = 3;

      expect(json.recovery.steps).toBe(1);
    });
  });
});
