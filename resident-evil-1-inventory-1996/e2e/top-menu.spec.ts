import { expect, test } from './fixtures';

test.describe('top menu', () => {
  test('the item box button reads BOX', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await expect(inventoryPage.menuButton('BOX'), 'the button reads BOX').toHaveText('BOX');
  });

  test('pressing ↑ on slot 1 highlights the BOX button', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.menuButton('BOX'), 'the BOX button is highlighted').toHaveClass(
      /menu-panel__button--pointed/,
    );
  });

  test('pressing ↑ on slot 2 highlights EXIT', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.pointAt(2);
    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.menuButton('EXIT'), 'EXIT is highlighted').toHaveClass(/menu-panel__button--pointed/);
  });

  test('moving to MAP removes the red frame from the grid', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.pointAtMenuButton('MAP');

    await expect(inventoryPage.slotFrame(1), 'the grid has no red frame').toHaveCount(0);
  });

  test('moving to MAP highlights it', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.pointAtMenuButton('MAP');

    await expect(inventoryPage.menuButton('MAP'), 'MAP is highlighted').toHaveClass(/menu-panel__button--pointed/);
  });

  test('moving to MAP shows no item name', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.pointAtMenuButton('MAP');

    await expect(inventoryPage.descriptionPanel, 'the description panel is empty').not.toContainText('BERETTA');
  });

  test('pressing ↓ on the BOX button moves the red frame back to slot 1', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.pointAtMenuButton('BOX');
    await inventoryPage.press('ArrowDown');

    await expect(inventoryPage.slotFrame(1), 'the red frame is back on the slot').toBeVisible();
  });

  test('pressing ↑ on MAP keeps MAP highlighted', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.pointAtMenuButton('MAP');
    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.menuButton('MAP'), 'MAP stays highlighted').toHaveClass(/menu-panel__button--pointed/);
  });

  test('pressing ↑ while the action menu is open keeps the red frame on the selected item', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.slotFrame(1), 'the red frame stays on the Beretta').toBeVisible();
  });
});
