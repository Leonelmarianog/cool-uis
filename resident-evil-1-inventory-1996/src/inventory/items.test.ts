import { describe, expect, test } from 'vitest'
import { createItem, getDefinition, hasAmount, resolveItem } from './items'
import { itemCatalog } from './itemCatalog'

describe('createItem', () => {
  test('accepts a weapon from empty to fully loaded', () => {
    for (const amount of [0, 15]) {
      const item = { id: 'gun', type: 'handgun', amount }
      expect(createItem(itemCatalog, item)).toBe(item)
    }
  })

  test('rejects a weapon amount outside its capacity', () => {
    for (const amount of [-1, 16, 1.5]) {
      expect(() => createItem(itemCatalog, { id: 'gun', type: 'handgun', amount })).toThrow(RangeError)
    }
  })

  test('requires an amount on weapons and ammunition', () => {
    expect(() => createItem(itemCatalog, { id: 'gun', type: 'handgun' })).toThrow(RangeError)
    expect(() => createItem(itemCatalog, { id: 'clip', type: 'clip' })).toThrow(RangeError)
  })

  test('accepts an ammunition stack from 1 to its limit', () => {
    for (const amount of [1, 255]) {
      expect(createItem(itemCatalog, { id: 'clip', type: 'clip', amount }).amount).toBe(amount)
    }
  })

  test('rejects an empty or overfull ammunition stack', () => {
    for (const amount of [0, 256]) {
      expect(() => createItem(itemCatalog, { id: 'clip', type: 'clip', amount })).toThrow(RangeError)
    }
  })

  test('rejects an amount on an item without one', () => {
    expect(() => createItem(itemCatalog, { id: 'herb', type: 'greenHerb', amount: 1 })).toThrow(TypeError)
  })

  test('rejects an unknown item type', () => {
    expect(() => createItem(itemCatalog, { id: 'x', type: 'rocketLauncher' })).toThrow('Unknown item type')
  })
})

describe('hasAmount', () => {
  test('is true only for weapons and ammunition', () => {
    const counted = Object.entries(itemCatalog)
      .filter(([, definition]) => hasAmount(definition))
      .map(([type]) => type)
    expect(counted).toEqual(['handgun', 'clip'])
  })
})

describe('resolveItem', () => {
  test('pairs an item with its catalog definition', () => {
    const item = { id: 'herb', type: 'greenHerb' }
    expect(resolveItem(itemCatalog, item)).toEqual({ item, definition: getDefinition(itemCatalog, item) })
    expect(resolveItem(itemCatalog, item).definition.name).toBe('GREEN HERB')
  })
})
