import type { Locator, Page } from '@playwright/test';
import type { PlayerState } from '../src/types/player';

// The inventory screen, as the tests see and use it.
export class InventoryPage {
  readonly page: Page;
  readonly actionMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actionMenu = page.getByRole('menu', { name: 'Item actions' });
  }

  // Opens the app with parts of the player's starting state replaced (see
  // startingState() in src/stores/player.ts).
  async open(player: Partial<PlayerState>) {
    await this.page.addInitScript(testPlayer => {
      window.__TEST_PLAYER__ = testPlayer;
    }, player);
    await this.page.goto('/');
  }

  // Slots are numbered from 1, as in their labels ("Slot 1: BERETTA, 15").
  slot(number: number): Locator {
    return this.page.getByLabel('Inventory slots').getByRole('listitem').nth(number - 1);
  }

  async chooseAction(action: string) {
    await this.actionMenu.getByRole('menuitem', { name: action }).click();
  }
}
