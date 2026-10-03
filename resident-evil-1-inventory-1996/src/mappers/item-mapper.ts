import type itemsJson from '../data/items.json';
import { ItemType } from '../types/item';
import type { AmmunitionItem, ConsumableItem, Item, KeyItem, LoadedRounds, WeaponItem } from '../types/item';
import type { RoundsColor } from '../types/rounds-color';

type ItemJson = (typeof itemsJson)[number];
type RoundsJson = { ammunition: string; description: string; color: string }[];

/** Keys the JSON's list of loaded rounds by ammunition item ID. */
function toRounds(json: RoundsJson): Record<string, LoadedRounds> {
  return Object.fromEntries(
    json.map(rounds => [rounds.ammunition, { description: rounds.description, color: rounds.color as RoundsColor }]),
  );
}

function toWeaponItem(json: ItemJson): WeaponItem {
  return {
    id: json.id,
    name: json.name,
    sprite: json.sprite,
    description: json.description,
    type: ItemType.Weapon,
    weapon: json.weapon && {
      capacity: json.weapon.capacity,
      ammunition: [...json.weapon.ammunition],
      fuel: json.weapon.fuel,
      rounds: json.weapon.rounds && toRounds(json.weapon.rounds),
    },
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
