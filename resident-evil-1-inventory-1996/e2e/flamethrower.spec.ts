import { expect, test } from './fixtures';

test.describe('the flamethrower in the inventory', () => {
  test("the flamethrower's slot shows its fuel as a plain number", async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'flamethrower-1', itemId: 'flamethrower', type: 'weapon', loadedRounds: 100 }],
      equippedItemId: null,
    });

    await expect(inventoryPage.slot(1), 'the slot names the fuel').toHaveAccessibleName('Slot 1: FLAMETHROWER, 100');
    await expect(inventoryPage.slot(1).locator('.item-amount'), 'the slot shows 100').toHaveText('100');
  });
});

test.describe('the flamethrower in the item box', () => {
  test("the flamethrower's box row shows its fuel as a plain number", async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'flamethrower-1', itemId: 'flamethrower', type: 'weapon', loadedRounds: 100 }],
    });

    await inventoryPage.openItemBox();

    await expect(inventoryPage.bandRow(), 'the row names the fuel').toHaveAccessibleName('Row 1: FLAMETHROWER, 100');
  });
});

test.describe('equipping the flamethrower', () => {
  test('the equipped flamethrower shows its fuel in the equipped weapon panel', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'flamethrower-1', itemId: 'flamethrower', type: 'weapon', loadedRounds: 100 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('EQUIP');

    await expect(inventoryPage.equippedWeaponPanel.getByLabel('100 fuel'), 'the panel shows 100').toHaveText('100');
  });
});
