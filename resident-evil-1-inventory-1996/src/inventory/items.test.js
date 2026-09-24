import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createItem, describeItem, getItemDefinition, herbRecipes, withItemAmount } from './items.js'

test('weapons accept zero and their capacity, and retain their identity when emptied', () => {
  const weapon = createItem('handgun', 'weapon-1', 15)
  assert.deepEqual(withItemAmount(weapon, 0), { id: 'weapon-1', typeId: 'handgun', amount: 0 })
  assert.equal(createItem('handgun', 'empty-weapon').amount, 0)
  assert.equal(weapon.amount, 15)
  for (const amount of [-1, 16, 1.5, NaN, Infinity, '10']) {
    assert.throws(() => withItemAmount(weapon, amount), RangeError)
  }
})

test('ammo instances have independent counts, a 255 limit, and disappear when depleted', () => {
  const first = createItem('clip', 'clip-1', 255)
  const second = createItem('clip', 'clip-2', 15)
  const updated = withItemAmount(second, 14)
  assert.equal(first.amount, 255)
  assert.equal(second.amount, 15)
  assert.equal(updated.amount, 14)
  assert.equal(updated.id, 'clip-2')
  assert.equal(withItemAmount(first, 0), null)
  assert.throws(() => createItem('clip', 'empty', 0), RangeError)
  assert.throws(() => createItem('clip', 'overflow', 256), RangeError)
})

test('single-use items and recipe results have no numeric amount', () => {
  for (const type of ['firstAidSpray', 'greenHerb', 'redHerb', 'greenGreenHerb', 'greenRedHerb']) {
    const item = createItem(type, type)
    assert.equal(Object.hasOwn(item, 'amount'), false)
    assert.equal(describeItem(item).amountLabel, '')
    assert.throws(() => createItem(type, type, 1), TypeError)
    assert.throws(() => withItemAmount(item, 1), TypeError)
  }
  assert.equal(herbRecipes.find(recipe => recipe.ingredients.includes('redHerb')).result, 'greenRedHerb')
  for (const recipe of herbRecipes) assert.equal(getItemDefinition(recipe.result).count, null)
})

test('definitions cannot drift between instances and unknown types are rejected', () => {
  assert.throws(() => { getItemDefinition('handgun').count.max = 999 }, TypeError)
  assert.throws(() => createItem('missing', 'id'), TypeError)
  assert.throws(() => createItem('toString', 'id'), TypeError)
  assert.throws(() => createItem('clip', ''), TypeError)
  assert.equal(describeItem(null), null)
})
