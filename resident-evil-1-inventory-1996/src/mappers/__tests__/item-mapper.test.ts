import { describe, expect, test } from 'vitest';
import { ItemType } from '../../types/item';
import type { AmmunitionItem, ConsumableItem, WeaponItem } from '../../types/item';
import { itemMapper } from '../item-mapper';

describe('toItem', () => {
  describe('mapping weapons', () => {
    test('maps a weapon record to a weapon item with its weapon data', () => {
      const json = {
        id: 'weapon-id',
        type: 'weapon',
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        description: 'Item description.',
        weapon: { capacity: 10, ammunition: ['ammunition-id'] },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        description: 'Item description.',
        weapon: { capacity: 10, ammunition: ['ammunition-id'] },
      });
    });

    test('returns a deep copy of the data', () => {
      const json = {
        id: 'weapon-id',
        type: 'weapon',
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        description: 'Item description.',
        weapon: { capacity: 10, ammunition: ['ammunition-id'] },
      };

      const item = itemMapper.toItem(json);
      (item as WeaponItem).weapon!.ammunition.push('other-ammunition-id');

      expect(json.weapon.ammunition).toEqual(['ammunition-id']);
    });

    test('maps a weapon record without weapon data to a weapon item without it', () => {
      const json = {
        id: 'weapon-id',
        type: 'weapon',
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        description: 'Item description.',
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'weapon-id',
        type: ItemType.Weapon,
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        description: 'Item description.',
      });
    });

    test('maps a weapon record with fuel to a weapon item with fuel', () => {
      const json = {
        id: 'weapon-id',
        type: 'weapon',
        name: 'WEAPON NAME',
        sprite: 'weapon.png',
        description: 'Item description.',
        weapon: { capacity: 100, ammunition: [], fuel: true },
      };

      const item = itemMapper.toItem(json);

      expect((item as WeaponItem).weapon).toEqual({ capacity: 100, ammunition: [], fuel: true });
    });
  });

  describe('mapping ammunition', () => {
    test('maps an ammunition record to an ammunition item with its ammunition data', () => {
      const json = {
        id: 'ammunition-id',
        type: 'ammunition',
        name: 'AMMUNITION NAME',
        sprite: 'ammunition.png',
        description: 'Item description.',
        ammunition: { maxStack: 100 },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'ammunition-id',
        type: ItemType.Ammunition,
        name: 'AMMUNITION NAME',
        sprite: 'ammunition.png',
        description: 'Item description.',
        ammunition: { maxStack: 100 },
      });
    });

    test('returns a deep copy of the data', () => {
      const json = {
        id: 'ammunition-id',
        type: 'ammunition',
        name: 'AMMUNITION NAME',
        sprite: 'ammunition.png',
        description: 'Item description.',
        ammunition: { maxStack: 100 },
      };

      const item = itemMapper.toItem(json);
      (item as AmmunitionItem).ammunition.maxStack = 50;

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
        description: 'Item description.',
        herb: true,
        recovery: { steps: 1, curesPoison: false },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        description: 'Item description.',
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
        description: 'Item description.',
        herb: true,
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        description: 'Item description.',
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
        description: 'Item description.',
        recovery: { steps: 1, curesPoison: false },
      };

      const item = itemMapper.toItem(json);

      expect(item).toEqual({
        id: 'consumable-id',
        type: ItemType.Consumable,
        name: 'CONSUMABLE NAME',
        sprite: 'consumable.png',
        description: 'Item description.',
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
        description: 'Item description.',
        herb: true,
        recovery: { steps: 1, curesPoison: false },
      };

      const item = itemMapper.toItem(json);
      (item as ConsumableItem).recovery!.steps = 3;

      expect(json.recovery.steps).toBe(1);
    });
  });
});
