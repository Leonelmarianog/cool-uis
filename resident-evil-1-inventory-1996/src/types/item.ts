// The kinds of item, named so code never compares against bare strings.
export const ItemType = {
  Weapon: 'weapon',
  Ammunition: 'ammunition',
  Consumable: 'consumable',
  Key: 'key',
} as const;

export type ItemType = (typeof ItemType)[keyof typeof ItemType];

export function isItemType(type: string): type is ItemType {
  return Object.values(ItemType).some(itemType => itemType === type);
}

interface BaseItem {
  id: string;
  name: string;

  /** Image path under `src/assets/items/`, e.g. `"weapon/beretta.png"`. */
  sprite: string;
}

export interface WeaponItem extends BaseItem {
  type: typeof ItemType.Weapon;

  weapon: {
    /** Rounds the weapon holds when fully loaded. */
    capacity: number;
    /** IDs of the ammunition items this weapon loads. */
    ammunition: string[];
  };
}

export interface AmmunitionItem extends BaseItem {
  type: typeof ItemType.Ammunition;

  ammunition: {
    /** Most rounds one inventory slot can hold. */
    maxStack: number;
  };
}

/** How a recovery item changes the health status when used. */
export interface Recovery {
  /** Statuses to move up, stopping at Fine (green). */
  steps: number;
  /** Whether it cures poison first, which sets the status to Danger. */
  curesPoison: boolean;
}

export interface ConsumableItem extends BaseItem {
  type: typeof ItemType.Consumable;
  /** Herbs that have no recipe together show "Mixing these does not seem to work." */
  herb?: boolean;
  /** Missing on items that cannot be used alone, such as the red herb. */
  recovery?: Recovery;
}

export interface KeyItem extends BaseItem {
  type: typeof ItemType.Key;
}

export type Item =
  | WeaponItem
  | AmmunitionItem
  | ConsumableItem
  | KeyItem;
