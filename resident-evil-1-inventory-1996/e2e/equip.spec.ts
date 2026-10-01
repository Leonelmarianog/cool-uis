import { expect, test } from './fixtures';

test.describe('equipping weapons', () => {
  test('choosing an unequipped Beretta, then EQUIP, shows the Beretta in the equipped weapon panel', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('EQUIP');

    await expect(
      inventoryPage.equippedWeaponPanel.getByRole('img', { name: 'BERETTA' }),
      'the Beretta is equipped',
    ).toBeVisible();
  });

  test('choosing the equipped Beretta, then EQUIP, empties the equipped weapon panel', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: 'player-item-1',
    });
    await expect(
      inventoryPage.equippedWeaponPanel.getByRole('img', { name: 'BERETTA' }),
      'the Beretta is equipped before EQUIP',
    ).toBeVisible();

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('EQUIP');

    await expect(
      inventoryPage.equippedWeaponPanel.getByRole('img', { name: 'BERETTA' }),
      'the Beretta is unequipped',
    ).toBeHidden();
  });

  test('equipping the Beretta closes the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('EQUIP');

    await expect(inventoryPage.actionMenu, 'the menu closes and the item is released').toBeHidden();
  });
});
