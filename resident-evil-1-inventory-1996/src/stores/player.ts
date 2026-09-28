import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import charactersData from '../data/characters.json';
import initialPlayer from '../data/initial-player.json';
import itemsData from '../data/items.json';
import type { Character } from '../types/character';
import type { Item } from '../types/item';
import type { ItemView } from '../types/item-view';
import type { PlayerItem, PlayerState } from '../types/player';

// JSON imports are not type-checked, so the data is cast to its type.
const characters = charactersData as Character[];
const initialState = initialPlayer as PlayerState;
const items = itemsData as Item[];

// URLs of every item image, keyed by the path Vite imported it from.
// `?no-inline` keeps each image a separate file; Vite would otherwise embed
// small images in the JavaScript bundle.
const itemImages = import.meta.glob<string>('../assets/items/**/*.png', {
  eager: true,
  import: 'default',
  query: '?no-inline',
});

function findCharacter(id: string): Character {
  const character = characters.find(character => character.id === id);
  if (!character) throw new Error(`Unknown character "${id}"`);
  return character;
}

function findItem(id: string): Item {
  const item = items.find(item => item.id === id);
  if (!item) throw new Error(`Unknown item "${id}"`);
  return item;
}

function findItemImage(path: string): string {
  const url = itemImages[`../assets/items/${path}`];
  if (!url) throw new Error(`Unknown item image "${path}"`);
  return url;
}

function amountOf(playerItem: PlayerItem): number | undefined {
  if (playerItem.type === 'weapon') return playerItem.loadedRounds;
  if (playerItem.type === 'ammunition') return playerItem.amount;
  return undefined;
}

function toItemView(playerItem: PlayerItem): ItemView {
  const { name, type, sprite } = findItem(playerItem.itemId);
  return {
    id: playerItem.id,
    name,
    type,
    sprite: findItemImage(sprite),
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

  const inventorySize = computed(() => findCharacter(characterId.value).inventorySize);
  const inventorySlots = computed(() => inventory.value.map(toItemView));

  const equippedWeapon = computed(() => {
    const weapon = inventory.value.find(playerItem => playerItem.id === equippedItemId.value);
    return weapon ? toItemView(weapon) : null;
  });

  // Equips a weapon, replacing the equipped one. Choosing the equipped weapon again unequips it.
  function toggleEquipped(playerItemId: string) {
    const playerItem = inventory.value.find(playerItem => playerItem.id === playerItemId);
    if (playerItem?.type !== 'weapon') return;
    equippedItemId.value = equippedItemId.value === playerItemId ? null : playerItemId;
  }

  return {
    characterId,
    inventory,
    equippedItemId,
    itemBox,
    inventorySize,
    inventorySlots,
    equippedWeapon,
    toggleEquipped,
  };
});
