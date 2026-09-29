import type itemsJson from '../data/items.json';
import { isItemType, ItemType } from '../types/item';
import type { AmmunitionItem, ConsumableItem, Item, KeyItem, WeaponItem } from '../types/item';

type ItemJson = (typeof itemsJson)[number];

function toWeaponItem(json: ItemJson): WeaponItem {
  if (!json.weapon) throw new Error(`Weapon "${json.id}" has no weapon data`);
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    type: ItemType.Weapon,
    weapon: { capacity: json.weapon.capacity, ammunition: [...json.weapon.ammunition] },
  };
}

function toAmmunitionItem(json: ItemJson): AmmunitionItem {
  if (!json.ammunition) throw new Error(`Ammunition "${json.id}" has no ammunition data`);
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    type: ItemType.Ammunition,
    ammunition: { maxStack: json.ammunition.maxStack },
  };
}

function toConsumableItem(json: ItemJson): ConsumableItem {
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
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
    if (!isItemType(json.type)) throw new Error(`Item "${json.id}" has an unknown type "${json.type}"`);
    return mappersByType[json.type](json);
  },
};
