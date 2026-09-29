import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { itemViewMapper } from '../mappers/item-view-mapper';
import { characterService } from '../services/character-service';
import { itemService } from '../services/item-service';
import { playerService } from '../services/player-service';
import { recipeService } from '../services/recipe-service';
import type { HealthStatus } from '../types/health';
import { ItemType } from '../types/item';
import type { Recovery } from '../types/item';
import type { ItemView } from '../types/item-view';
import type { PlayerAmmunition, PlayerItem, PlayerWeapon } from '../types/player';

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

function toItemView(playerItem: PlayerItem): ItemView {
  return itemViewMapper.toItemView(playerItem, itemService.find(playerItem.itemId));
}

export const usePlayerStore = defineStore('player', () => {
  const state = playerService.startingState();

  const characterId = ref(state.characterId);
  const healthStatus = ref(state.healthStatus);
  // How many recovery items were used; the ECG plays its heal animation on each one.
  const recoveriesUsed = ref(0);
  const inventory = ref<PlayerItem[]>(state.inventory);
  const equippedItemId = ref<string | null>(state.equippedItemId);
  const itemBox = ref<(PlayerItem | null)[]>(state.itemBox);

  const inventorySize = computed(() => characterService.find(characterId.value).inventorySize);
  const inventorySlots = computed(() => inventory.value.map(toItemView));

  const equippedWeapon = computed(() => {
    const weapon = inventory.value.find(playerItem => playerItem.id === equippedItemId.value);
    return weapon ? toItemView(weapon) : null;
  });

  function findPlayerItem(playerItemId: string): PlayerItem | undefined {
    return inventory.value.find(playerItem => playerItem.id === playerItemId);
  }

  // Equips a weapon, replacing the equipped one. Choosing the equipped weapon again unequips it.
  function toggleEquipped(playerItemId: string) {
    const playerItem = findPlayerItem(playerItemId);
    if (playerItem?.type !== ItemType.Weapon) return;
    equippedItemId.value = equippedItemId.value === playerItemId ? null : playerItemId;
  }

  // Uses up a recovery item, even when it has no effect. Returns false for items
  // that cannot be used this way; those stay in the inventory.
  function useItem(playerItemId: string): boolean {
    const playerItem = findPlayerItem(playerItemId);
    if (!playerItem) return false;

    const item = itemService.find(playerItem.itemId);
    if (item.type !== ItemType.Consumable || !item.recovery) return false;

    healthStatus.value = recover(healthStatus.value, item.recovery);
    recoveriesUsed.value++;
    removeItem(playerItem.id);
    return true;
  }

  // Reloads a weapon from its ammunition, with the two items in either order.
  // Returns false when they are not a weapon and ammunition it loads.
  function reload(sourceId: string, targetId: string): boolean {
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (source?.type === ItemType.Weapon && target?.type === ItemType.Ammunition) return loadWeapon(source, target);
    if (source?.type === ItemType.Ammunition && target?.type === ItemType.Weapon) return loadWeapon(target, source);
    return false;
  }

  // Moves rounds into the weapon up to its capacity. A full weapon still counts
  // as reloaded, with no rounds moved. A stack that reaches 0 is removed.
  function loadWeapon(weapon: PlayerWeapon, ammunition: PlayerAmmunition): boolean {
    const item = itemService.find(weapon.itemId);
    if (item.type !== ItemType.Weapon || !item.weapon.ammunition.includes(ammunition.itemId)) return false;

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
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (source?.type !== ItemType.Ammunition || target?.type !== ItemType.Ammunition) return false;
    if (source.id === target.id || source.itemId !== target.itemId) return false;

    const item = itemService.find(source.itemId);
    if (item.type !== ItemType.Ammunition) return false;

    const { maxStack } = item.ammunition;
    // Otherwise a full target would move almost all its rounds and look like a swap.
    if (source.amount === maxStack || target.amount === maxStack) return true;

    const rounds = Math.min(maxStack - source.amount, target.amount);
    source.amount += rounds;
    target.amount -= rounds;
    if (target.amount === 0) removeItem(target.id);
    return true;
  }

  function canMix(sourceId: string, targetId: string): boolean {
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (!source || !target) return false;
    return recipeService.findByIngredients(source.itemId, target.itemId) !== undefined;
  }

  // Puts the recipe's result in the source's slot and removes the target.
  // Returns false when the two items have no recipe.
  function mix(sourceId: string, targetId: string): boolean {
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (!source || !target || source.id === target.id) return false;

    const recipe = recipeService.findByIngredients(source.itemId, target.itemId);
    if (!recipe) return false;

    const result = itemService.find(recipe.result);
    // Recipes only make items without an amount, such as mixed herbs.
    if (result.type !== ItemType.Consumable && result.type !== ItemType.Key) return false;

    const index = inventory.value.findIndex(playerItem => playerItem.id === source.id);
    // The result keeps the source's ID, as it takes the source's place.
    inventory.value[index] = { id: source.id, itemId: result.id, type: result.type };
    removeItem(target.id);
    return true;
  }

  function isHerb(playerItemId: string): boolean {
    const playerItem = findPlayerItem(playerItemId);
    if (!playerItem) return false;
    const item = itemService.find(playerItem.itemId);
    return item.type === ItemType.Consumable && item.herb === true;
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
    canMix,
    mix,
    isHerb,
    cycleHealthStatus,
  };
});
