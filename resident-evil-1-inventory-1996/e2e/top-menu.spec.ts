import { expect, test } from './fixtures';

test.describe('top menu', () => {
  test('hovering MAP removes the red frame from the grid', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.menuButton('MAP').hover();

    await expect(inventoryPage.slotFrame(1), 'the grid has no red frame').toHaveCount(0);
  });

  test('hovering MAP highlights it', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.menuButton('MAP').hover();

    await expect(inventoryPage.menuButton('MAP'), 'MAP is highlighted').toHaveClass(/menu-panel__button--pointed/);
  });

  test('hovering MAP shows no item name', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.menuButton('MAP').hover();

    await expect(inventoryPage.descriptionPanel, 'the description panel is empty').not.toContainText('BERETTA');
  });

  test('hovering a slot after MAP moves the red frame back to the grid', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.menuButton('MAP').hover();
    await inventoryPage.slot(1).hover();

    await expect(inventoryPage.slotFrame(1), 'the red frame is back on the slot').toBeVisible();
    await expect(inventoryPage.menuButton('MAP'), 'MAP is no longer highlighted').not.toHaveClass(
      /menu-panel__button--pointed/,
    );
  });

  test('clicking MAP logs that the map screen is not built yet', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    const message = inventoryPage.page.waitForEvent('console', event => event.text().startsWith('MAP'));

    await inventoryPage.menuButton('MAP').click();

    expect((await message).text(), 'the console says the map is not built').toBe(
      'MAP: the map screen is not built yet.',
    );
  });

  test('clicking the dash button logs that the item box is not built yet', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    const message = inventoryPage.page.waitForEvent('console', event => event.text().startsWith('ITEM BOX'));

    await inventoryPage.menuButton('Item box').click();

    expect((await message).text(), 'the console says the item box is not built').toBe(
      'ITEM BOX: the item box is not built yet.',
    );
  });

  test('hovering MAP while the action menu is open keeps the red frame on the selected item', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.menuButton('MAP').hover();

    await expect(inventoryPage.slotFrame(1), 'the red frame stays on the Beretta').toBeVisible();
  });
});
