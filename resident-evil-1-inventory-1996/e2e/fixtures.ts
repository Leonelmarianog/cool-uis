import { test as base } from '@playwright/test';
import { InventoryPage } from './inventory-page';

type Fixtures = {
  // The inventory screen; each test opens it with its own player state.
  inventoryPage: InventoryPage;
};

export const test = base.extend<Fixtures>({
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
