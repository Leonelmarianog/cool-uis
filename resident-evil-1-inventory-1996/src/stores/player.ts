import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { characterService } from '../services/character-service';
import { itemService } from '../services/item-service';
import { playerService } from '../services/player-service';
import { recipeService } from '../services/recipe-service';
import { HealthStatus } from '../types/health';
import { ItemType } from '../types/item';
import type { Recovery } from '../types/item';
import type { PlayerAmmunition, PlayerItem, PlayerWeapon } from '../types/player';

/** Rows in the item box, the same for every character. */
export const ITEM_BOX_SIZE = 48;

/** Health statuses from worst to best. Healing moves a status up this list. */
const healthOrder: HealthStatus[] = [
  HealthStatus.Poison,
  HealthStatus.Danger,
  HealthStatus.Caution,
  HealthStatus.FineYellow,
  HealthStatus.Fine,
];

/** The status after a recovery item. Without a poison cure, a poisoned status does not change. */
function recover(status: HealthStatus, recovery: Recovery): HealthStatus {
  if (status === HealthStatus.Poison) {
    if (!recovery.curesPoison) return status;
    status = HealthStatus.Danger;
  }
  const index = Math.min(healthOrder.indexOf(status) + recovery.steps, healthOrder.length - 1);
  return healthOrder[index];
}

/**
 * The player's data and the game rules that change it: health, the inventory,
 * the equipped weapon and the item box. Its functions take player item IDs,
 * not items, because the store owns the items and a caller's copy may be stale;
 * `exchangeWithBox` takes positions, because an empty slot or row has no ID.
 */
export const usePlayerStore = defineStore('player', () => {
  const state = playerService.startingState();

  const characterId = ref(state.characterId);
  const healthStatus = ref(state.healthStatus);
  /** How many recovery items were used; the ECG plays its heal animation on each one. */
  const recoveriesUsed = ref(0);
  /** Packed: items fill the first slots and empty slots follow the last item. */
  const inventory = ref<PlayerItem[]>(state.inventory);
  /** The ID of the equipped weapon in the inventory, or `null` when unarmed. */
  const equippedItemId = ref<string | null>(state.equippedItemId);
  /** Fixed rows: the starting rows, then empty ones up to ITEM_BOX_SIZE. `null` is an empty row. Unlike the inventory, the box keeps gaps. */
  const itemBox = ref<(PlayerItem | null)[]>(
    Array.from({ length: ITEM_BOX_SIZE }, (_, index) => state.itemBox[index] ?? null),
  );

  /** The number of inventory slots, set by the character. */
  const inventorySize = computed(() => characterService.find(characterId.value).inventorySize);

  /** Finds the player item with the given ID in the inventory. */
  function findPlayerItem(playerItemId: string): PlayerItem | undefined {
    return inventory.value.find(playerItem => playerItem.id === playerItemId);
  }

  /** Equips a weapon, replacing the equipped one. Choosing the equipped weapon again unequips it. */
  function toggleEquipped(playerItemId: string) {
    const playerItem = findPlayerItem(playerItemId);
    if (playerItem?.type !== ItemType.Weapon) return;
    equippedItemId.value = equippedItemId.value === playerItemId ? null : playerItemId;
  }

  /**
   * Uses up a recovery item, even when it has no effect. Returns false for items
   * that cannot be used this way; those stay in the inventory.
   */
  function consume(playerItemId: string): boolean {
    const playerItem = findPlayerItem(playerItemId);
    if (!playerItem) return false;

    const item = itemService.find(playerItem.itemId);
    if (item.type !== ItemType.Consumable || !item.recovery) return false;

    healthStatus.value = recover(healthStatus.value, item.recovery);
    recoveriesUsed.value++;
    removeItem(playerItem.id);
    return true;
  }

  /**
   * Reloads a weapon from its ammunition, with the two items in either order.
   * Returns false when they are not a weapon and ammunition it loads.
   */
  function reload(sourceId: string, targetId: string): boolean {
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (source?.type === ItemType.Weapon && target?.type === ItemType.Ammunition) return loadWeapon(source, target);
    if (source?.type === ItemType.Ammunition && target?.type === ItemType.Weapon) return loadWeapon(target, source);
    return false;
  }

  /**
   * Moves rounds into the weapon up to its capacity. A full weapon still counts
   * as reloaded, with no rounds moved. A stack that reaches 0 is removed.
   */
  function loadWeapon(weapon: PlayerWeapon, ammunition: PlayerAmmunition): boolean {
    const item = itemService.find(weapon.itemId);
    if (item.type !== ItemType.Weapon || !item.weapon.ammunition.includes(ammunition.itemId)) return false;

    const rounds = Math.min(item.weapon.capacity - weapon.loadedRounds, ammunition.amount);
    weapon.loadedRounds += rounds;
    ammunition.amount -= rounds;
    if (ammunition.amount === 0) removeItem(ammunition.id);
    return true;
  }

  /**
   * Moves rounds from the target stack into the source stack of the same
   * ammunition, up to its max stack; any leftover stays in the target. When
   * either stack is full, it still counts as stacked, with no rounds moved, so
   * a full target does not look like a swap. Returns false for any other pair.
   */
  function stack(sourceId: string, targetId: string): boolean {
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (source?.type !== ItemType.Ammunition || target?.type !== ItemType.Ammunition) return false;
    if (source.id === target.id || source.itemId !== target.itemId) return false;

    const item = itemService.find(source.itemId);
    if (item.type !== ItemType.Ammunition) return false;

    const { maxStack } = item.ammunition;
    if (source.amount === maxStack || target.amount === maxStack) return true;

    const rounds = Math.min(maxStack - source.amount, target.amount);
    source.amount += rounds;
    target.amount -= rounds;
    if (target.amount === 0) removeItem(target.id);
    return true;
  }

  /**
   * Puts the recipe's result in the source's slot, with the source's ID, and
   * removes the target. Recipes only make items without an amount, such as
   * mixed herbs. Returns false when the two items have no recipe.
   */
  function mix(sourceId: string, targetId: string): boolean {
    const source = findPlayerItem(sourceId);
    const target = findPlayerItem(targetId);
    if (!source || !target || source.id === target.id) return false;

    const recipe = recipeService.findByIngredients(source.itemId, target.itemId);
    if (!recipe) return false;

    const result = itemService.find(recipe.result);
    if (result.type !== ItemType.Consumable && result.type !== ItemType.Key) return false;

    const index = inventory.value.findIndex(playerItem => playerItem.id === source.id);
    inventory.value[index] = { id: source.id, itemId: result.id, type: result.type };
    removeItem(target.id);
    return true;
  }

  /**
   * Exchanges an inventory slot with an item box row (item-box.gif). Two items
   * swap; a box item taken into an empty slot goes after the last item; an item
   * stored in an empty row leaves the inventory, and the items after it move up;
   * two empty places change nothing. A weapon that leaves the inventory is
   * unequipped; one that comes in is not equipped. It takes positions, not IDs,
   * because an empty slot or row has no ID.
   */
  function exchangeWithBox(slotIndex: number, rowIndex: number) {
    const slotItem = inventory.value[slotIndex] ?? null;
    const rowItem = itemBox.value[rowIndex];
    if (slotItem && rowItem) inventory.value[slotIndex] = rowItem;
    else if (rowItem) inventory.value.push(rowItem);
    else if (slotItem) removeItem(slotItem.id);
    itemBox.value[rowIndex] = slotItem;
    if (slotItem && slotItem.id === equippedItemId.value) equippedItemId.value = null;
  }

  /** Removes the item; the items after it move up to fill its slot. */
  function removeItem(playerItemId: string) {
    const index = inventory.value.findIndex(playerItem => playerItem.id === playerItemId);
    inventory.value.splice(index, 1);
  }

  /** Demo control for the ECG: each call shows the next worse status, then wraps to Fine. */
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
    toggleEquipped,
    consume,
    reload,
    stack,
    mix,
    exchangeWithBox,
    cycleHealthStatus,
  };
});
