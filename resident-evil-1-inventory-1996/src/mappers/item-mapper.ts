import type itemsJson from '../data/items.json';
import { ItemType } from '../types/item';
import type { AmmunitionItem, ConsumableItem, Item, KeyItem, WeaponItem } from '../types/item';

type ItemJson = (typeof itemsJson)[number];

function toWeaponItem(json: ItemJson): WeaponItem {
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    description: json.description,
    type: ItemType.Weapon,
    weapon: json.weapon && { capacity: json.weapon.capacity, ammunition: [...json.weapon.ammunition] },
  };
}

function toAmmunitionItem(json: ItemJson): AmmunitionItem {
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    description: json.description,
    type: ItemType.Ammunition,
    ammunition: { maxStack: json.ammunition!.maxStack },
  };
}

function toConsumableItem(json: ItemJson): ConsumableItem {
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    description: json.description,
    type: ItemType.Consumable,
    herb: json.herb,
    recovery: json.recovery && { steps: json.recovery.steps, curesPoison: json.recovery.curesPoison },
  };
}

function toKeyItem(json: ItemJson): KeyItem {
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    description: json.description,
    type: ItemType.Key,
  };
}

const mappersByType: Record<ItemType, (json: ItemJson) => Item> = {
  [ItemType.Weapon]: toWeaponItem,
  [ItemType.Ammunition]: toAmmunitionItem,
  [ItemType.Consumable]: toConsumableItem,
  [ItemType.Key]: toKeyItem,
};

export const itemMapper = {
  toItem(json: ItemJson): Item {
    return mappersByType[json.type as ItemType](json);
  },
};
