import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import charactersData from '../data/characters.json';
import initialPlayer from '../data/initial-player.json';
import itemsData from '../data/items.json';
import type { Character } from '../types/character';
import type { HealthStatus } from '../types/health';
import type { Item, Recovery } from '../types/item';
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

// Health statuses from worst to best. Healing moves a status up this list.
const healthOrder: HealthStatus[] = ['poison', 'danger', 'caution', 'fine-yellow', 'fine'];

// Without a poison cure, a poisoned status does not change.
function recover(status: HealthStatus, recovery: Recovery): HealthStatus {
  if (status === 'poison') {
    if (!recovery.curesPoison) return status;
    status = 'danger';
  }
  const index = Math.min(healthOrder.indexOf(status) + recovery.steps, healthOrder.length - 1);
  return healthOrder[index];
}

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
  const healthStatus = ref(state.healthStatus);
  // How many recovery items were used; the ECG plays its heal animation on each one.
  const recoveriesUsed = ref(0);
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

  // Uses up a recovery item, even when it has no effect. Returns false for items
  // that cannot be used this way; those stay in the inventory.
  function useItem(playerItemId: string): boolean {
    const index = inventory.value.findIndex(playerItem => playerItem.id === playerItemId);
    const playerItem = inventory.value[index];
    if (!playerItem) return false;

    const item = findItem(playerItem.itemId);
    if (item.type !== 'consumable' || !item.recovery) return false;

    healthStatus.value = recover(healthStatus.value, item.recovery);
    recoveriesUsed.value++;
    // The items after it move up to fill its slot.
    inventory.value.splice(index, 1);
    return true;
  }

  // Demo control for the ECG: each call shows the next worse status, then wraps to Fine.
  function cycleHealthStatus() {
    const index = healthOrder.indexOf(healthStatus.value);
    healthStatus.value = healthOrder[(index - 1 + healthOrder.length) % healthOrder.length];
  }

  return {
    characterId,
    healthStatus,
    recoveriesUsed,
    inventory,
    equippedItemId,
    itemBox,
    inventorySize,
    inventorySlots,
    equippedWeapon,
    toggleEquipped,
    useItem,
    cycleHealthStatus,
  };
});
