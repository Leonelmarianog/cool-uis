import type { Sprite } from '../sprites/spriteSheet'

// Game-agnostic item types. Each game supplies its own catalog of definitions.

interface BaseDefinition {
  name: string
  sprite: Sprite
}

export interface WeaponDefinition extends BaseDefinition {
  kind: 'weapon'
  /** Matches the `ammo` of the ammunition this weapon loads. */
  ammo: string
  /** Rounds the weapon holds when fully loaded. */
  capacity: number
}

export interface AmmunitionDefinition extends BaseDefinition {
  kind: 'ammunition'
  ammo: string
  /** Most rounds one inventory slot can hold. */
  maxStack: number
}

export interface ConsumableDefinition extends BaseDefinition {
  kind: 'consumable'
}

export type ItemDefinition = WeaponDefinition | AmmunitionDefinition | ConsumableDefinition

/** Definitions keyed by item type, e.g. `{ handgun: { … }, clip: { … } }`. */
export type ItemCatalog = Readonly<Record<string, ItemDefinition>>

/** One copy of an item in the inventory. */
export interface Item {
  /** Unique per copy, so two clips can be told apart. */
  readonly id: string
  /** Key into the catalog. */
  readonly type: string
  /** Loaded rounds or stack size. Only weapons and ammunition have one. */
  readonly amount?: number
}

/** An item together with its definition, ready to display. */
export interface ResolvedItem {
  item: Item
  definition: ItemDefinition
}
