import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import initialPlayer from '../data/initial-player.json';
import itemsData from '../data/items.json';
import spriteSheetsData from '../data/sprite-sheets.json';
import type { Item } from '../types/item';
import type { ItemView } from '../types/item-view';
import type { PlayerItem, PlayerState } from '../types/player';
import type { SpriteSheet } from '../types/sprite-sheet';

// JSON imports are not type-checked, so the data is cast to its type.
const initialState = initialPlayer as PlayerState;
const items = itemsData as Item[];
const spriteSheets = spriteSheetsData as SpriteSheet[];

function findItem(id: string): Item {
  const item = items.find(item => item.id === id);
  if (!item) throw new Error(`Unknown item "${id}"`);
  return item;
}

function findSpriteSheet(id: string): SpriteSheet {
  const sheet = spriteSheets.find(sheet => sheet.id === id);
  if (!sheet) throw new Error(`Unknown sprite sheet "${id}"`);
  return sheet;
}

function amountOf(playerItem: PlayerItem): number | undefined {
  if (playerItem.type === 'weapon') return playerItem.loadedRounds;
  if (playerItem.type === 'ammunition') return playerItem.amount;
  return undefined;
}

function toItemView(playerItem: PlayerItem): ItemView {
  const { name, sprite } = findItem(playerItem.itemId);
  return {
    id: playerItem.id,
    name,
    sprite: { sheet: findSpriteSheet(sprite.sheetId), column: sprite.column, row: sprite.row },
    amount: amountOf(playerItem),
  };
}

export const usePlayerStore = defineStore('player', () => {
  // A deep copy, so changes to the store never alter the imported data.
  const state = structuredClone(initialState);

  const characterId = ref(state.characterId);
  const inventory = ref<PlayerItem[]>(state.inventory);
  const equippedItemId = ref<string | null>(state.equippedItemId);
  const itemBox = ref<(PlayerItem | null)[]>(state.itemBox);

  const inventorySlots = computed(() => inventory.value.map(toItemView));

  const equippedWeapon = computed(() => {
    const weapon = inventory.value.find(playerItem => playerItem.id === equippedItemId.value);
    return weapon ? toItemView(weapon) : null;
  });

  return { characterId, inventory, equippedItemId, itemBox, inventorySlots, equippedWeapon };
});
