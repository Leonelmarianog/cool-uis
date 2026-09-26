// A player item is one copy of an item the player owns. Its definition
// (name, sprite, capacity, …) comes from the item with the same `itemId`.
interface BasePlayerItem {
  id: string;
  itemId: string;
}

export interface PlayerWeapon extends BasePlayerItem {
  type: 'weapon';
  /** From 0 to the weapon's capacity. */
  loadedRounds: number;
}

export interface PlayerAmmunition extends BasePlayerItem {
  type: 'ammunition';
  /** From 1 to the ammunition's max stack. */
  amount: number;
}

export interface PlayerConsumable extends BasePlayerItem {
  type: 'consumable';
}

export interface PlayerKeyItem extends BasePlayerItem {
  type: 'key';
}

export type PlayerItem =
  | PlayerWeapon
  | PlayerAmmunition
  | PlayerConsumable
  | PlayerKeyItem;

export interface PlayerState {
  characterId: string;

  /** Packed: items fill the first slots and empty slots follow the last item. */
  inventory: PlayerItem[];

  /** ID of a player weapon in the inventory, or `null` when unarmed. */
  equippedItemId: string | null;

  /** Fixed rows; `null` is an empty row ("No Item"). */
  itemBox: (PlayerItem | null)[];
}
