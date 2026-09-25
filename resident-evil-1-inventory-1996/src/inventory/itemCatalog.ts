import { itemSpriteSheet } from '../sprites/itemSpriteSheet'
import type { Sprite } from '../sprites/spriteSheet'
import type { ItemCatalog } from './types'

const sprite = (column: number, row: number): Sprite => ({ sheet: itemSpriteSheet, column, row })

// Handgun capacity 15 comes from design/animations/combine-item-1.gif;
// the 255 stack limit was supplied by the project owner.
export const itemCatalog = {
  handgun: { kind: 'weapon', name: 'HANDGUN', sprite: sprite(1, 0), ammo: 'handgun', capacity: 15 },
  clip: { kind: 'ammunition', name: 'CLIP', sprite: sprite(1, 1), ammo: 'handgun', maxStack: 255 },
  firstAidSpray: { kind: 'consumable', name: 'F.-AID SPRAY', sprite: sprite(3, 10) },
  greenHerb: { kind: 'consumable', name: 'GREEN HERB', sprite: sprite(0, 11) },
  redHerb: { kind: 'consumable', name: 'RED HERB', sprite: sprite(1, 11) },
  greenGreenHerb: { kind: 'consumable', name: 'G+G HERB', sprite: sprite(4, 11) },
  greenRedHerb: { kind: 'consumable', name: 'G+R HERB', sprite: sprite(3, 11) },
} satisfies ItemCatalog
