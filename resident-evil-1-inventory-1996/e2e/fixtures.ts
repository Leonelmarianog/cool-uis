import { test as base } from '@playwright/test';
import type { PlayerState } from '../src/types/player';
import { InventoryPage } from './inventory-page';

type Fixtures = {
  // The parts of the player's starting state a test replaces; set with test.use().
  player: Partial<PlayerState>;
  // The inventory screen, already open with `player` loaded.
  inventoryPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  player: [{}, { option: true }],
  inventoryPage: async ({ page, player }, use) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.open(player);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
