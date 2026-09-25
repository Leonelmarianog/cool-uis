import type {
  AmmunitionDefinition,
  Item,
  ItemCatalog,
  ItemDefinition,
  ResolvedItem,
  WeaponDefinition,
} from './types'

type CountedDefinition = WeaponDefinition | AmmunitionDefinition

export function getDefinition(catalog: ItemCatalog, item: Item): ItemDefinition {
  const definition = catalog[item.type]
  if (!definition) throw new Error(`Unknown item type: ${item.type}`)
  return definition
}

export function resolveItem(catalog: ItemCatalog, item: Item): ResolvedItem {
  return { item, definition: getDefinition(catalog, item) }
}

/** Weapons and ammunition show a number; other items do not. */
export function hasAmount(definition: ItemDefinition): definition is CountedDefinition {
  return definition.kind === 'weapon' || definition.kind === 'ammunition'
}

export function maxAmount(definition: CountedDefinition): number {
  return definition.kind === 'weapon' ? definition.capacity : definition.maxStack
}

/**
 * Check an item against its definition and return it unchanged.
 * An empty weapon keeps its slot; an empty ammunition stack cannot exist.
 */
export function createItem(catalog: ItemCatalog, item: Item): Item {
  const definition = getDefinition(catalog, item)
  if (!hasAmount(definition)) {
    if (item.amount !== undefined) throw new TypeError(`${definition.name} has no amount`)
    return item
  }

  const min = definition.kind === 'weapon' ? 0 : 1
  const max = maxAmount(definition)
  const { amount } = item
  if (amount === undefined || !Number.isInteger(amount) || amount < min || amount > max) {
    throw new RangeError(`${definition.name} amount must be a whole number from ${min} to ${max}`)
  }
  return item
}
