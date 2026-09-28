import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import charactersData from '../data/characters.json';
import initialPlayer from '../data/initial-player.json';
import itemsData from '../data/items.json';
import recipesData from '../data/recipes.json';
import type { Character } from '../types/character';
import type { HealthStatus } from '../types/health';
import type { Item, Recovery } from '../types/item';
import type { ItemView } from '../types/item-view';
import type { PlayerAmmunition, PlayerItem, PlayerState, PlayerWeapon } from '../types/player';
import type { Recipe } from '../types/recipe';

// JSON imports are not type-checked, so the data is cast to its type.
const characters = charactersData as Character[];
const initialState = initialPlayer as PlayerState;
const items = itemsData as Item[];
const recipes = recipesData as Recipe[];

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

// The ingredients match in either order.
function findRecipe(firstItemId: string, secondItemId: string): Recipe | undefined {
  return recipes.find(({ ingredients: [first, second] }) =>
    (first === firstItemId && second === secondItemId) || (first === secondItemId && second === firstItemId));
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

  // Reloads a weapon from its ammunition, with the two items in either order.
  // Returns false when they are not a weapon and ammunition it loads.
  function reload(sourceId: string, targetId: string): boolean {
    const source = inventory.value.find(playerItem => playerItem.id === sourceId);
    const target = inventory.value.find(playerItem => playerItem.id === targetId);
    if (source?.type === 'weapon' && target?.type === 'ammunition') return loadWeapon(source, target);
    if (source?.type === 'ammunition' && target?.type === 'weapon') return loadWeapon(target, source);
    return false;
  }

  // Moves rounds into the weapon up to its capacity. A full weapon still counts
  // as reloaded, with no rounds moved. A stack that reaches 0 is removed.
  function loadWeapon(weapon: PlayerWeapon, ammunition: PlayerAmmunition): boolean {
    const item = findItem(weapon.itemId);
    if (item.type !== 'weapon' || !item.weapon.ammunition.includes(ammunition.itemId)) return false;

    const rounds = Math.min(item.weapon.capacity - weapon.loadedRounds, ammunition.amount);
    weapon.loadedRounds += rounds;
    ammunition.amount -= rounds;
    if (ammunition.amount === 0) removeItem(ammunition.id);
    return true;
  }

  // Moves rounds from the target stack into the source stack of the same
  // ammunition, up to its max stack; any leftover stays in the target. When
  // either stack is full, it still counts as stacked, with no rounds moved.
  // Returns false for any other pair.
  function stack(sourceId: string, targetId: string): boolean {
    const source = inventory.value.find(playerItem => playerItem.id === sourceId);
    const target = inventory.value.find(playerItem => playerItem.id === targetId);
    if (source?.type !== 'ammunition' || target?.type !== 'ammunition') return false;
    if (source.id === target.id || source.itemId !== target.itemId) return false;

    const item = findItem(source.itemId);
    if (item.type !== 'ammunition') return false;

    const { maxStack } = item.ammunition;
    // Otherwise a full target would move almost all its rounds and look like a swap.
    if (source.amount === maxStack || target.amount === maxStack) return true;

    const rounds = Math.min(maxStack - source.amount, target.amount);
    source.amount += rounds;
    target.amount -= rounds;
    if (target.amount === 0) removeItem(target.id);
    return true;
  }

  // Puts the recipe's result in the source's slot and removes the target.
  // Returns false when the two items have no recipe.
  function mix(sourceId: string, targetId: string): boolean {
    const source = inventory.value.find(playerItem => playerItem.id === sourceId);
    const target = inventory.value.find(playerItem => playerItem.id === targetId);
    if (!source || !target || source.id === target.id) return false;

    const recipe = findRecipe(source.itemId, target.itemId);
    if (!recipe) return false;

    const result = findItem(recipe.result);
    // Recipes only make items without an amount, such as mixed herbs.
    if (result.type !== 'consumable' && result.type !== 'key') return false;

    const index = inventory.value.findIndex(playerItem => playerItem.id === source.id);
    // The result keeps the source's ID, as it takes the source's place.
    inventory.value[index] = { id: source.id, itemId: result.id, type: result.type };
    removeItem(target.id);
    return true;
  }

  function isHerb(playerItemId: string): boolean {
    const playerItem = inventory.value.find(playerItem => playerItem.id === playerItemId);
    if (!playerItem) return false;
    const item = findItem(playerItem.itemId);
    return item.type === 'consumable' && item.herb === true;
  }

  // The items after it move up to fill its slot.
  function removeItem(playerItemId: string) {
    const index = inventory.value.findIndex(playerItem => playerItem.id === playerItemId);
    inventory.value.splice(index, 1);
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
    reload,
    stack,
    mix,
    isHerb,
    cycleHealthStatus,
  };
});
