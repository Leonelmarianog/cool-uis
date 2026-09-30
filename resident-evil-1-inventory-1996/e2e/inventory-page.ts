import type { Locator, Page } from '@playwright/test';
import type { PlayerState } from '../src/types/player';

// The inventory screen, as the tests see and use it.
export class InventoryPage {
  readonly page: Page;
  readonly actionMenu: Locator;
  readonly descriptionPanel: Locator;
  // CHECK's 3D model, shown in place of the action menu.
  readonly itemModel: Locator;
  // CHECK's red arrows; they show only while the model can be turned.
  readonly rotateArrows: Locator;
  // Shows the equipped weapon's sprite, named after the weapon ("BERETTA").
  readonly equippedWeaponPanel: Locator;
  // Named after the health status, as in "Health: Caution. Click to cycle health status.".
  readonly healthScreen: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actionMenu = page.getByRole('menu', { name: 'Item actions' });
    this.descriptionPanel = page.getByRole('region', { name: 'Item description panel' });
    this.itemModel = page.getByLabel('Item model');
    this.rotateArrows = page.getByRole('button', { name: /^Rotate / });
    this.equippedWeaponPanel = page.getByRole('region', { name: 'Equipped weapon panel' });
    this.healthScreen = page.getByRole('button', { name: /^Health:/ });
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
    return this.page
      .getByLabel('Inventory slots')
      .getByRole('listitem')
      .nth(number - 1);
  }

  // Items that share a name, such as every "MIXED HERBS", differ only in their sprite.
  slotSprite(number: number): Locator {
    return this.slot(number).locator('img');
  }

  // Disabled while COMBN waits for a second item.
  actionButton(action: string): Locator {
    return this.actionMenu.getByRole('menuitem', { name: action });
  }

  // The red frame on an option of the action menu.
  optionFrame(action: string): Locator {
    return this.actionButton(action).locator('img');
  }

  async chooseAction(action: string) {
    await this.actionButton(action).click();
  }

  // Answers a question in the description panel, such as "Will you mix the herbs?".
  async answer(choice: string) {
    await this.descriptionPanel.getByRole('button', { name: choice }).click();
  }

  // K shows the checked item's description.
  async showDescription() {
    await this.page.keyboard.press('k');
  }

  async backOut() {
    await this.page.keyboard.press('Escape');
  }
}
