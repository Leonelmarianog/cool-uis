import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createItem } from './items.js'
import { combineInventoryItems, evaluateCombination } from './combinations.js'

const gun = amount => createItem('handgun', 'gun', amount)
const clip = (amount, id = 'clip') => createItem('clip', id, amount)
const herb = (type, id = type) => createItem(type, id)

test('reference reload transfers one round in either selection order', () => {
  const weapon = gun(14)
  const ammunition = clip(15)
  for (const pair of [[weapon, ammunition], [ammunition, weapon]]) {
    const result = evaluateCombination(...pair)
    assert.equal(result.ok, true)
    assert.equal(result.kind, 'reload')
    assert.equal(result.moved, 1)
    assert.equal(result.items.find(item => item.id === 'gun').amount, 15)
    assert.equal(result.items.find(item => item.id === 'clip').amount, 14)
    assert.deepEqual(result.items.map(item => item.id), pair.map(item => item.id))
  }
  assert.equal(weapon.amount, 14)
  assert.equal(ammunition.amount, 15)
})

test('reload conserves rounds across every supported handgun/clip amount', () => {
  for (let loaded = 0; loaded <= 15; loaded++) {
    for (let reserve = 1; reserve <= 255; reserve++) {
      const result = evaluateCombination(gun(loaded), clip(reserve))
      if (loaded === 15) {
        assert.equal(result.reason, 'weaponFull')
        continue
      }
      const [weapon, ammunition] = result.items
      assert.equal(weapon.amount, Math.min(15, loaded + reserve))
      assert.equal(weapon.amount + (ammunition?.amount ?? 0), loaded + reserve)
      assert.equal(ammunition === null, reserve <= 15 - loaded)
    }
  }
})

test('stack merging is order-independent, handles overflow and preserves total rounds', () => {
  for (const [a, b] of [[14, 15], [29, 15], [250, 15], [1, 1], [200, 200], [255, 10], [255, 255]]) {
    const first = clip(a, 'first')
    const second = clip(b, 'second')
    const forward = evaluateCombination(first, second)
    const reverse = evaluateCombination(second, first)
    assert.equal(forward.ok, reverse.ok)
    if (a === 255 || b === 255) {
      assert.equal(forward.reason, 'stacksFull')
      continue
    }
    assert.equal(forward.kind, 'stack')
    assert.deepEqual(forward.items, [...reverse.items].reverse())
    const remaining = forward.items.filter(Boolean)
    assert.equal(remaining.reduce((sum, item) => sum + item.amount, 0), a + b)
    assert.equal(Math.max(...remaining.map(item => item.amount)), Math.min(255, a + b))
    assert(remaining.every(item => item.amount > 0 && item.amount <= 255))
    assert.equal(first.amount, a)
    assert.equal(second.amount, b)
  }
})

test('G+G and G+R recipes create uncounted results and consume both ingredients', () => {
  for (const [a, b, expected] of [
    ['greenHerb', 'greenHerb', 'greenGreenHerb'],
    ['greenHerb', 'redHerb', 'greenRedHerb'],
    ['redHerb', 'greenHerb', 'greenRedHerb'],
  ]) {
    const first = herb(a, 'first')
    const second = herb(b, 'second')
    const result = evaluateCombination(first, second)
    assert.equal(result.kind, 'recipe')
    assert.deepEqual(result.items, [{ id: 'first', typeId: expected }, null])
    assert.equal(first.typeId, a)
    assert.equal(second.typeId, b)
  }
})

test('unsupported recipes, invalid items, empty slots and self-selection are rejected', () => {
  for (const pair of [
    [gun(0), herb('redHerb')],
    [clip(10), herb('greenHerb')],
    [herb('redHerb', 'a'), herb('redHerb', 'b')],
    [herb('firstAidSpray', 'a'), herb('firstAidSpray', 'b')],
    [herb('greenRedHerb'), herb('greenHerb')],
    [gun(0), createItem('handgun', 'other-gun', 10)],
  ]) {
    for (const args of [pair, [...pair].reverse()]) {
      assert.equal(evaluateCombination(...args).reason, 'incompatible')
    }
  }
  assert.equal(evaluateCombination(gun(0), gun(1)).reason, 'sameItem')
  assert.equal(evaluateCombination(null, clip(1)).reason, 'empty')
  for (const invalid of [
    { id: 'bad', typeId: 'unknown' },
    { id: 'bad', typeId: 'clip', amount: 0 },
    { id: 'bad', typeId: 'clip', amount: 256 },
    { id: 'bad', typeId: 'handgun' },
  ]) assert.equal(evaluateCombination(gun(0), invalid).reason, 'invalidItem')
})

test('inventory application is atomic, preserves equipped identity and unrelated slots', () => {
  const unrelated = herb('firstAidSpray')
  const slots = Object.freeze([gun(10), unrelated, clip(3), null])
  const result = combineInventoryItems(slots, 'clip', 'gun')
  assert.equal(result.ok, true)
  assert.deepEqual(result.slots[0], { id: 'gun', typeId: 'handgun', amount: 13 })
  assert.equal(result.slots[1], unrelated)
  assert.equal(result.slots[2], null)
  assert.equal(result.slots.length, slots.length)
  assert.equal(slots[0].amount, 10)
  assert.equal(slots[2].amount, 3)
  assert.equal(combineInventoryItems(result.slots, 'clip', 'gun').reason, 'empty')
  assert.equal(combineInventoryItems(slots, 'gun', 'gun').reason, 'sameItem')
  assert.equal(combineInventoryItems([clip(1), clip(2)], 'clip', 'clip').reason, 'invalidItem')
})

test('confirmation uses latest amounts instead of an earlier preview', () => {
  const preview = evaluateCombination(gun(14), clip(10))
  assert.equal(preview.ok, true)
  const current = Object.freeze([gun(15), clip(10)])
  const result = combineInventoryItems(current, 'gun', 'clip')
  assert.equal(result.reason, 'weaponFull')
  assert.equal(Object.hasOwn(result, 'slots'), false)
  assert.equal(current[1].amount, 10)
})
