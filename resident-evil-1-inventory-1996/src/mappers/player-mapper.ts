import type initialPlayerJson from '../data/initial-player.json';
import type { HealthStatus } from '../types/health';
import { ItemType } from '../types/item';
import type {
  PlayerAmmunition,
  PlayerConsumable,
  PlayerItem,
  PlayerKeyItem,
  PlayerState,
  PlayerWeapon,
} from '../types/player';

type PlayerJson = typeof initialPlayerJson;
/** One inventory or box record; the JSON's inferred types differ between the two arrays. */
type PlayerItemJson = { id: string; itemId: string; type: string; loadedRounds?: number; amount?: number };

function toPlayerWeapon(json: PlayerItemJson): PlayerWeapon {
  return {
    id: json.id,
    itemId: json.itemId,
    type: ItemType.Weapon,
    loadedRounds: json.loadedRounds,
  };
}

function toPlayerAmmunition(json: PlayerItemJson): PlayerAmmunition {
  return {
    id: json.id,
    itemId: json.itemId,
    type: ItemType.Ammunition,
    amount: json.amount!,
  };
}

function toPlayerConsumable(json: PlayerItemJson): PlayerConsumable {
  return {
    id: json.id,
    itemId: json.itemId,
    type: ItemType.Consumable,
  };
}

function toPlayerKeyItem(json: PlayerItemJson): PlayerKeyItem {
  return {
    id: json.id,
    itemId: json.itemId,
    type: ItemType.Key,
  };
}

const mappersByType: Record<ItemType, (json: PlayerItemJson) => PlayerItem> = {
  [ItemType.Weapon]: toPlayerWeapon,
  [ItemType.Ammunition]: toPlayerAmmunition,
  [ItemType.Consumable]: toPlayerConsumable,
  [ItemType.Key]: toPlayerKeyItem,
};

function toPlayerItem(json: PlayerItemJson): PlayerItem {
  return mappersByType[json.type as ItemType](json);
}

export const playerMapper = {
  toPlayerState(json: PlayerJson): PlayerState {
    return {
      characterId: json.characterId,
      healthStatus: json.healthStatus as HealthStatus,
      inventory: json.inventory.map(toPlayerItem),
      equippedItemId: json.equippedItemId,
      itemBox: json.itemBox.map(itemJson => itemJson && toPlayerItem(itemJson)),
    };
  },
};
