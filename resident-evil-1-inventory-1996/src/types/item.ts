import type { RoundsColor } from './rounds-color';

// The kinds of item, named so code never compares against bare strings.
export const ItemType = {
  Weapon: 'weapon',
  Ammunition: 'ammunition',
  Consumable: 'consumable',
  Key: 'key',
} as const;

export type ItemType = (typeof ItemType)[keyof typeof ItemType];

interface BaseItem {
  id: string;
  name: string;

  /** Image path under `src/assets/items/`, e.g. `"weapon/beretta.png"`. */
  sprite: string;

  /** CHECK's text, as the game shows it. A "\n" starts its second line. */
  description: string;
}

/** How a weapon shows one kind of loaded rounds. */
export interface LoadedRounds {
  /** CHECK's text while these rounds are loaded. */
  description: string;
  /** The round counter's colour. */
  color: RoundsColor;
}

export interface WeaponItem extends BaseItem {
  type: typeof ItemType.Weapon;

  /** Missing on weapons that use no ammunition, such as the combat knife. */
  weapon?: {
    /** Rounds the weapon holds when fully loaded. */
    capacity: number;
    /** IDs of the ammunition items this weapon loads. */
    ammunition: string[];
    /** Whether its rounds are fuel, shown as a percentage. The weapon then loads no ammunition. */
    fuel?: boolean;
    /** How it shows each kind of rounds, keyed by ammunition item ID. Missing on weapons that load one kind. */
    rounds?: Record<string, LoadedRounds>;
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

export type Item = WeaponItem | AmmunitionItem | ConsumableItem | KeyItem;
