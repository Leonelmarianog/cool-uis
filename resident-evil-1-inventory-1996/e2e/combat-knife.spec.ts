import { expect, test } from './fixtures';

test.describe('the combat knife in the item box', () => {
  test("the knife's box row and the box square show no number", async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'knife-1', itemId: 'combat-knife', type: 'weapon' }],
    });

    await inventoryPage.openItemBox();

    await expect(inventoryPage.bandRow(), 'the row names the knife with no number').toHaveAccessibleName(
      'Row 1: COMBAT KNIFE',
    );
    await expect(
      inventoryPage.page.locator('.item-box-square .item-amount'),
      'the box square shows no number',
    ).toHaveCount(0);
  });

  test('the knife taken from the box shows no number in its slot', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'knife-1', itemId: 'combat-knife', type: 'weapon' }],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(2);

    await inventoryPage.confirm();

    await expect(inventoryPage.slot(2), 'the slot names the knife with no number').toHaveAccessibleName(
      'Slot 2: COMBAT KNIFE',
    );
  });
});

test.describe('equipping the combat knife', () => {
  test('the equipped knife shows no number in the equipped weapon panel', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'knife-1', itemId: 'combat-knife', type: 'weapon' }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('EQUIP');

    await expect(
      inventoryPage.equippedWeaponPanel.getByRole('img', { name: 'COMBAT KNIFE' }),
      'the knife is equipped',
    ).toBeVisible();
    await expect(inventoryPage.equippedWeaponPanel.getByLabel(/rounds$/), 'the panel shows no number').toHaveCount(0);
  });

  test("equipping the Beretta after the knife shows the Beretta's rounds", async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'knife-1', itemId: 'combat-knife', type: 'weapon' },
        { id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 },
      ],
      equippedItemId: 'knife-1',
    });

    await inventoryPage.chooseSlot(2);
    await inventoryPage.chooseAction('EQUIP');

    await expect(inventoryPage.equippedWeaponPanel.getByLabel('15 rounds'), 'the panel shows 15').toBeVisible();
  });
});

test.describe('combining the combat knife', () => {
  test('choosing the knife, then COMBN, then a clip keeps waiting for a second item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'knife-1', itemId: 'combat-knife', type: 'weapon' },
        { id: 'clip-1', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.chooseSlot(2);

    await expect(
      inventoryPage.actionButton('COMBN'),
      'the menu stays inactive while a second item is chosen',
    ).toBeDisabled();
    await expect(inventoryPage.slot(1), 'the knife is unchanged').toHaveAccessibleName('Slot 1: COMBAT KNIFE');
    await expect(inventoryPage.slot(2), 'the clip is unchanged').toHaveAccessibleName('Slot 2: CLIP, 15');
    await expect(inventoryPage.descriptionPanel, 'the panel names the clip and shows no message').toHaveText('CLIP');
  });
});
