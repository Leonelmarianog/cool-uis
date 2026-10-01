import { expect, test } from './fixtures';

test.describe('keyboard', () => {
  test('pressing → moves the red frame to slot 2', async ({ inventoryPage }) => {
    await inventoryPage.open({ inventory: [] });

    await inventoryPage.press('ArrowRight');

    await expect(inventoryPage.slotFrame(2), 'the red frame is on slot 2').toBeVisible();
  });

  test('pressing ↓ moves the red frame to slot 3', async ({ inventoryPage }) => {
    await inventoryPage.open({ inventory: [] });

    await inventoryPage.press('ArrowDown');

    await expect(inventoryPage.slotFrame(3), 'the red frame is on slot 3').toBeVisible();
  });

  test('pressing ← on slot 1 keeps the red frame on slot 1', async ({ inventoryPage }) => {
    await inventoryPage.open({ inventory: [] });

    await inventoryPage.press('ArrowLeft');

    await expect(inventoryPage.slotFrame(1), 'the red frame stays on slot 1').toBeVisible();
  });

  test('pressing ↓ on the last row keeps the red frame there', async ({ inventoryPage }) => {
    await inventoryPage.open({ inventory: [] });

    await inventoryPage.pointAt(7);
    await inventoryPage.press('ArrowDown');

    await expect(inventoryPage.slotFrame(7), 'the red frame stays on slot 7').toBeVisible();
  });

  test('a held ↓ moves the red frame one row only', async ({ inventoryPage }) => {
    await inventoryPage.open({ inventory: [] });

    await inventoryPage.press('ArrowDown');
    await inventoryPage.page.evaluate(() =>
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', repeat: true })),
    );

    await expect(inventoryPage.slotFrame(3), 'the red frame stays on slot 3').toBeVisible();
  });

  test('pressing Ctrl+→ keeps the red frame on slot 1', async ({ inventoryPage }) => {
    await inventoryPage.open({ inventory: [] });

    await inventoryPage.press('Control+ArrowRight');

    await expect(inventoryPage.slotFrame(1), 'the red frame stays on slot 1').toBeVisible();
  });

  test('pressing D shows the next worse health status', async ({ inventoryPage }) => {
    await inventoryPage.open({ healthStatus: 'caution', inventory: [] });

    await inventoryPage.cycleHealth();

    await expect(inventoryPage.healthScreen, 'the health status goes to Danger').toHaveAccessibleName(
      /^Health: Danger\./,
    );
  });

  test('pressing ↑ while choosing a second item keeps the target cursor in the grid', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'clip-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.press('ArrowUp');

    await expect(
      inventoryPage.slot(1).locator('.inventory-grid__target'),
      'the target cursor stays on slot 1',
    ).toHaveCount(4);
  });
});
