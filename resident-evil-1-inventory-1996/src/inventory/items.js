// Definitions describe item types; instances contain their own identity/amount.
// Capacity evidence and deliberately deferred rules live in INVENTORY_ACTIONS.md.
export const itemDefinitions = {
  handgun: {
    name: 'HANDGUN', category: 'weapon', sprite: { column: 1, row: 0 },
    ammoType: 'handgun', count: { kind: 'loaded', max: 15, unit: 'rounds' },
  },
  clip: {
    name: 'CLIP', category: 'ammunition', sprite: { column: 1, row: 1 },
    ammoType: 'handgun', count: { kind: 'stack', max: 255, unit: 'rounds' },
  },
  firstAidSpray: {
    name: 'F.-AID SPRAY', category: 'healing', sprite: { column: 3, row: 10 },
    count: null, consumedOnUse: true,
  },
  greenHerb: {
    name: 'GREEN HERB', category: 'herb', sprite: { column: 0, row: 11 },
    count: null, consumedOnUse: true,
  },
  redHerb: {
    name: 'RED HERB', category: 'herb', sprite: { column: 1, row: 11 },
    count: null, consumedOnUse: false,
  },
  greenGreenHerb: {
    name: 'G+G HERB', category: 'healing', sprite: { column: 4, row: 11 },
    count: null, consumedOnUse: true,
  },
  greenRedHerb: {
    name: 'G+R HERB', category: 'healing', sprite: { column: 3, row: 11 },
    count: null, consumedOnUse: true,
  },
}

// Recipes create another item type, never a numeric stack of herbs.
// These are data for the later COMBN interaction, not enabled menu actions.
export const herbRecipes = [
  { ingredients: ['greenHerb', 'greenHerb'], result: 'greenGreenHerb' },
  { ingredients: ['greenHerb', 'redHerb'], result: 'greenRedHerb' },
]

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}
freeze(itemDefinitions)
freeze(herbRecipes)

export function getItemDefinition(typeId) {
  if (!Object.hasOwn(itemDefinitions, typeId)) throw new TypeError(`Unknown item type: ${typeId}`)
  return itemDefinitions[typeId]
}

export function createItem(typeId, id, amount) {
  const definition = getItemDefinition(typeId)
  if (typeof id !== 'string' || !id.trim()) throw new TypeError('An item needs a unique instance ID')
  const item = { id, typeId }
  if (!definition.count) {
    if (amount !== undefined) throw new TypeError(`${typeId} does not have an amount`)
    return Object.freeze(item)
  }
  const initialAmount = amount ?? (definition.count.kind === 'loaded' ? 0 : 1)
  const result = withItemAmount(item, initialAmount)
  if (!result) throw new RangeError('An empty stack cannot occupy a slot')
  return result
}

// Loaded weapons stay in inventory at zero. Exhausted stacks/limited-use items
// leave an empty slot. "uses" can be configured once a verified item needs it.
export function withItemAmount(item, amount) {
  const { count } = getItemDefinition(item.typeId)
  if (!count) throw new TypeError(`${item.typeId} does not have an amount`)
  if (!Number.isInteger(amount) || amount < 0 || amount > count.max) {
    throw new RangeError(`Amount must be an integer between 0 and ${count.max}`)
  }
  if (amount === 0 && count.kind !== 'loaded') return null
  return Object.freeze({ ...item, amount })
}

// One view shape feeds inventory and equipped panels. It does not copy state.
export function describeItem(item) {
  if (!item) return null
  const definition = getItemDefinition(item.typeId)
  return {
    ...item,
    ...definition,
    weapon: definition.category === 'weapon',
    amountLabel: definition.count ? `${item.amount} ${definition.count.unit}` : '',
  }
}
