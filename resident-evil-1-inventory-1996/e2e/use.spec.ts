import { expect, test } from './fixtures';

test.describe('using recovery items', () => {
  test('using a green herb at Caution raises the health status one step, to Fine (yellow)', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      healthStatus: 'caution',
      inventory: [{ id: 'player-item-1', itemId: 'green-herb', type: 'consumable' }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');

    await expect(inventoryPage.healthScreen, 'the health status goes up one step').toHaveAccessibleName(
      /^Health: Fine, yellow\./,
    );
  });

  test('using a first aid spray while poisoned cures the poison and raises the health status to Fine', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      healthStatus: 'poison',
      inventory: [{ id: 'player-item-1', itemId: 'first-aid-spray', type: 'consumable' }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');

    await expect(inventoryPage.healthScreen, 'the poison is cured and the health status is full').toHaveAccessibleName(
      /^Health: Fine, green\./,
    );
  });

  test('using a green herb removes it and moves the next items up', async ({ inventoryPage }) => {
    await inventoryPage.open({
      healthStatus: 'caution',
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');

    await expect(inventoryPage.slot(1), 'the item after the green herb moves up').toHaveAccessibleName(
      'Slot 1: CLIP, 15',
    );
    await expect(inventoryPage.slot(2), 'the last slot is left empty').toHaveAccessibleName('Slot 2: empty');
  });

  test('using a green herb closes the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      healthStatus: 'caution',
      inventory: [{ id: 'player-item-1', itemId: 'green-herb', type: 'consumable' }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');

    await expect(inventoryPage.actionMenu, 'the menu closes and the item is released').toBeHidden();
  });
});

test.describe('using items that only work combined', () => {
  test('choosing a clip, then USE, shows "You can\'t use this alone." and keeps the clip', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');

    // The message shows in full for only about 420 ms, so check it more often than toContainText() does.
    await expect
      .poll(() => inventoryPage.descriptionPanel.textContent(), {
        message: 'the panel says the clip needs another item',
        intervals: [50],
      })
      .toContain("You can't use this alone.");
    await expect(inventoryPage.slot(1), 'the clip is kept').toHaveAccessibleName('Slot 1: CLIP, 15');
  });

  test('choosing a red herb, then USE, shows "You can\'t use this alone." and keeps the red herb', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'red-herb', type: 'consumable' }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');

    // The message shows in full for only about 420 ms, so check it more often than toContainText() does.
    await expect
      .poll(() => inventoryPage.descriptionPanel.textContent(), {
        message: 'the panel says the red herb needs another item',
        intervals: [50],
      })
      .toContain("You can't use this alone.");
    await expect(inventoryPage.slot(1), 'the red herb is kept').toHaveAccessibleName('Slot 1: RED HERB');
  });
});
