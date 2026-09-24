import { createItem, getItemDefinition, herbRecipes, withItemAmount } from './items.js'

const messages = {
  empty: 'Select two items.',
  sameItem: 'Select a different item.',
  invalidItem: 'This item is not valid.',
  incompatible: "These items can't be combined.",
  weaponFull: 'This weapon is fully loaded.',
  stacksFull: 'There is no room to merge these stacks.',
}

function reject(reason) {
  return { ok: false, reason, message: messages[reason] }
}

function validItem(item) {
  try {
    const definition = getItemDefinition(item.typeId)
    if (definition.count && !Number.isInteger(item.amount)) return false
    createItem(item.typeId, item.id, item.amount)
    return true
  } catch {
    return false
  }
}

/**
 * Evaluate a pair without mutating it. Successful results contain replacements
 * in the same order as the arguments; null means the item was consumed.
 * Re-evaluate when confirming a selection rather than caching a preview result.
 */
export function evaluateCombination(first, second) {
  if (!first || !second) return reject('empty')
  if (!validItem(first) || !validItem(second)) return reject('invalidItem')
  if (first.id === second.id) return reject('sameItem')
  const definitions = [getItemDefinition(first.typeId), getItemDefinition(second.typeId)]
  const pair = [first, second]

  const weaponIndex = definitions.findIndex(definition => definition.category === 'weapon')
  if (weaponIndex !== -1) {
    const ammoIndex = 1 - weaponIndex
    const weaponDefinition = definitions[weaponIndex]
    const ammoDefinition = definitions[ammoIndex]
    if (weaponDefinition.count?.kind !== 'loaded'
      || ammoDefinition.category !== 'ammunition'
      || ammoDefinition.count?.kind !== 'stack'
      || !weaponDefinition.ammoType
      || weaponDefinition.ammoType !== ammoDefinition.ammoType) {
      return reject('incompatible')
    }
    const weapon = pair[weaponIndex]
    const ammunition = pair[ammoIndex]
    const moved = Math.min(weaponDefinition.count.max - weapon.amount, ammunition.amount)
    if (!moved) return reject('weaponFull')
    const items = [...pair]
    items[weaponIndex] = withItemAmount(weapon, weapon.amount + moved)
    items[ammoIndex] = withItemAmount(ammunition, ammunition.amount - moved)
    return { ok: true, kind: 'reload', moved, items }
  }

  if (first.typeId === second.typeId
    && definitions[0].category === 'ammunition'
    && definitions[0].count?.kind === 'stack') {
    const maximum = definitions[0].count.max
    if (first.amount === maximum && second.amount === maximum) return reject('stacksFull')
    // Consolidate into the larger stack, independent of selection order. Equal
    // stacks use stable instance IDs as a tie-breaker. Overflow stays in its slot.
    const receiverIndex = first.amount > second.amount
      || (first.amount === second.amount && first.id < second.id) ? 0 : 1
    const donorIndex = 1 - receiverIndex
    const receiver = pair[receiverIndex]
    const donor = pair[donorIndex]
    if (receiver.amount === maximum) return reject('stacksFull')
    const moved = Math.min(maximum - receiver.amount, donor.amount)
    const items = [...pair]
    items[receiverIndex] = withItemAmount(receiver, receiver.amount + moved)
    items[donorIndex] = withItemAmount(donor, donor.amount - moved)
    return { ok: true, kind: 'stack', moved, items }
  }

  const recipe = herbRecipes.find(({ ingredients: [a, b] }) => (
    (first.typeId === a && second.typeId === b) || (first.typeId === b && second.typeId === a)
  ))
  if (recipe) {
    // Transform the first-selected instance in place and free the other slot.
    // Reusing its identity avoids generating IDs during hover/preview evaluation.
    return { ok: true, kind: 'recipe', items: [createItem(recipe.result, first.id), null] }
  }
  return reject('incompatible')
}

/** Apply against current inventory values atomically; retain slot positions. */
export function combineInventoryItems(slots, firstId, secondId) {
  const ids = slots.filter(Boolean).map(item => item.id)
  if (new Set(ids).size !== ids.length) return reject('invalidItem')
  const firstIndex = slots.findIndex(item => item && item.id === firstId)
  const secondIndex = slots.findIndex(item => item && item.id === secondId)
  const result = evaluateCombination(slots[firstIndex], slots[secondIndex])
  if (!result.ok) return result
  const nextSlots = [...slots]
  nextSlots[firstIndex] = result.items[0]
  nextSlots[secondIndex] = result.items[1]
  return { ...result, slots: nextSlots }
}
