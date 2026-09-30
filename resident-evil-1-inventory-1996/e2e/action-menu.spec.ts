import { expect, test } from './fixtures';

test.describe('Action menu', () => {
  test('hovering another slot while the action menu is open keeps the red frame on the first option', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 },
        { id: 'clip-1', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.slot(2).hover();

    await expect(inventoryPage.optionFrame('EQUIP'), 'the red frame stays on EQUIP').toBeVisible();
    await expect(inventoryPage.optionFrame('COMBN'), 'the red frame does not move to COMBN').toHaveCount(0);
  });
});
