interface BaseItem {
  id: string;
  name: string;

  /** One cell of a sprite sheet, addressed by zero-based grid position. */
  sprite: {
    sheetId: string;
    column: number;
    row: number;
  };
}

export interface WeaponItem extends BaseItem {
  type: 'weapon';

  weapon: {
    /** Rounds the weapon holds when fully loaded. */
    capacity: number;
    /** IDs of the ammunition items this weapon loads. */
    ammunition: string[];
  };
}

export interface AmmunitionItem extends BaseItem {
  type: 'ammunition';

  ammunition: {
    /** Most rounds one inventory slot can hold. */
    maxStack: number;
  };
}

export interface ConsumableItem extends BaseItem {
  type: 'consumable';
}

export interface KeyItem extends BaseItem {
  type: 'key';
}

export type Item =
  | WeaponItem
  | AmmunitionItem
  | ConsumableItem
  | KeyItem;
