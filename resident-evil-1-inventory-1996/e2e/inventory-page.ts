import type { Locator, Page } from '@playwright/test';
import type { PlayerState } from '../src/types/player';

/** The item grid's columns. */
const GRID_COLUMNS = 2;

/** How to reach each top menu button from the grid: the slot in its column, then how many times to press ↑. */
const MENU_BUTTON_PATHS: Record<string, { slot: number; ups: number }> = {
  MAP: { slot: 1, ups: 2 },
  FILE: { slot: 2, ups: 2 },
  'Item box': { slot: 1, ups: 1 },
  EXIT: { slot: 2, ups: 1 },
};

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
  // Named after the health status, as in "Health: Caution.".
  readonly healthScreen: Locator;
  // The item box list; it shows three rows, the middle one in the band.
  readonly itemBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actionMenu = page.getByRole('menu', { name: 'Item actions' });
    this.descriptionPanel = page.getByRole('region', { name: 'Item description panel' });
    this.itemModel = page.getByLabel('Item model');
    this.rotateArrows = page.getByRole('img', { name: /^Rotate / });
    this.equippedWeaponPanel = page.getByRole('region', { name: 'Equipped weapon panel' });
    this.healthScreen = page.getByRole('img', { name: /^Health:/ });
    this.itemBox = page.getByRole('list', { name: 'Item box' });
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

  // The red frame on a slot of the grid.
  slotFrame(number: number): Locator {
    return this.slot(number).locator('.inventory-grid__selection');
  }

  /** One of CHECK's red arrows: up, down, left or right. */
  rotateArrow(direction: string): Locator {
    return this.page.getByRole('img', { name: `Rotate ${direction}` });
  }

  // A button of the top menu: MAP, FILE, EXIT, or the dash button ("Item box").
  menuButton(name: string): Locator {
    return this.page.getByRole('navigation', { name: 'Inventory menu' }).getByRole('button', { name });
  }

  // Disabled while COMBN waits for a second item.
  actionButton(action: string): Locator {
    return this.actionMenu.getByRole('menuitem', { name: action });
  }

  // The red frame on an option of the action menu.
  optionFrame(action: string): Locator {
    return this.actionButton(action).locator('img');
  }

  /** Presses a key the given number of times. */
  async press(key: string, times = 1) {
    for (let count = 0; count < times; count++) await this.page.keyboard.press(key);
  }

  /**
   * Moves the grid cursor with input to the slot with the arrow keys: the
   * target cursor while COMBN shows it, otherwise the main cursor.
   */
  async pointAt(number: number) {
    const from = await this.page
      .getByLabel('Inventory slots')
      .getByRole('listitem')
      .evaluateAll(cells => {
        const target = cells.findIndex(cell => cell.querySelector('.inventory-grid__target'));
        return target === -1 ? cells.findIndex(cell => cell.querySelector('.inventory-grid__selection')) : target;
      });
    if (from === -1) throw new Error('No cursor is in the grid.');
    const to = number - 1;
    const rows = Math.floor(to / GRID_COLUMNS) - Math.floor(from / GRID_COLUMNS);
    const columns = (to % GRID_COLUMNS) - (from % GRID_COLUMNS);
    await this.press(rows > 0 ? 'ArrowDown' : 'ArrowUp', Math.abs(rows));
    await this.press(columns > 0 ? 'ArrowRight' : 'ArrowLeft', Math.abs(columns));
  }

  /** Moves to the slot and presses S: it selects the item, or takes it as COMBN's second item. */
  async chooseSlot(number: number) {
    await this.pointAt(number);
    await this.confirm();
  }

  /** Moves the main cursor from the grid up to a top menu button: MAP, FILE, EXIT or "Item box". */
  async pointAtMenuButton(name: string) {
    const path = MENU_BUTTON_PATHS[name];
    await this.pointAt(path.slot);
    await this.press('ArrowUp', path.ups);
  }

  /** Opens the item box: ↑ from slot 1 to the dash button, then S. */
  async openItemBox() {
    await this.pointAtMenuButton('Item box');
    await this.confirm();
  }

  /** A visible row of the item box, numbered from 1, as in its label ("Row 5: SHOTGUN, 5"). */
  itemBoxRow(number: number): Locator {
    return this.itemBox.getByRole('listitem', { name: new RegExp(`^Row ${number}:`) });
  }

  /** The row in the band. */
  bandRow(): Locator {
    return this.itemBox.locator('[aria-current="true"]');
  }

  /** Moves the red frame to the action with ↑ / ↓, then presses S. */
  async chooseAction(action: string) {
    const options = this.actionMenu.getByRole('menuitem');
    const names = (await options.allTextContents()).map(name => name.trim());
    const framed = await options.evaluateAll(items => items.findIndex(item => item.querySelector('img')));
    const steps = names.indexOf(action) - framed;
    await this.press(steps > 0 ? 'ArrowDown' : 'ArrowUp', Math.abs(steps));
    await this.confirm();
  }

  /**
   * Answers a question in the description panel, such as "Will you mix the
   * herbs?". It waits for the choices: S before them only hurries the question.
   * The arrow starts on the first choice.
   */
  async answer(choice: string) {
    await this.descriptionPanel.getByRole('button', { name: choice }).waitFor();
    const choices = (await this.descriptionPanel.getByRole('button').allTextContents()).map(name => name.trim());
    await this.press('ArrowRight', choices.indexOf(choice));
    await this.confirm();
  }

  /** S shows the checked item's description. */
  async showDescription() {
    await this.page.keyboard.press('s');
  }

  /** S, the game's action button: it hurries typing and closes a complete description. */
  async confirm() {
    await this.page.keyboard.press('s');
  }

  /** A steps back once. */
  async backOut() {
    await this.page.keyboard.press('a');
  }

  /** D shows the next health status. */
  async cycleHealth() {
    await this.page.keyboard.press('d');
  }
}
