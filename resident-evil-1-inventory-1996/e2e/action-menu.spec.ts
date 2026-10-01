import { expect, test } from './fixtures';

test.describe('Action menu', () => {
  test('pressing ↓ moves the red frame to CHECK', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.press('ArrowDown');

    await expect(inventoryPage.optionFrame('CHECK'), 'the red frame is on CHECK').toBeVisible();
  });

  test('pressing ↑ on EQUIP keeps the red frame on EQUIP', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.optionFrame('EQUIP'), 'the red frame stays on EQUIP').toBeVisible();
  });

  test('pressing → while the action menu is open keeps the red frame on the selected item', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 },
        { id: 'clip-1', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.press('ArrowRight');

    await expect(inventoryPage.slotFrame(1), 'the red frame stays on the Beretta').toBeVisible();
    await expect(inventoryPage.slotFrame(2), 'the red frame does not move to the clip').toHaveCount(0);
  });
});
