import { expect, test } from './fixtures';

test.describe('descriptions', () => {
  test("pressing K while the Beretta's description is typed shows the rest of it sooner", async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before K').toHaveCount(4);
    await inventoryPage.showDescription();
    await inventoryPage.confirm();

    await expect(
      inventoryPage.descriptionPanel,
      'the description is typed out in under a second instead of about three',
    ).toContainText('loaded with 9mm bullets.', { timeout: 2000 });
  });

  test('pressing Escape while "You can\'t use this alone." is typed keeps the action menu open', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');
    await inventoryPage.backOut();

    await expect(inventoryPage.descriptionPanel, 'the description is still typed out').toContainText(
      "You can't use this alone.",
    );
    await expect(inventoryPage.actionMenu, 'the menu stays open').toBeVisible();
  });

  test('"You can\'t use this alone." stays once it is typed', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');
    await expect(inventoryPage.descriptionPanel, 'the description is typed out').toContainText(
      "You can't use this alone.",
    );
    await inventoryPage.page.waitForTimeout(1000);

    await expect(inventoryPage.descriptionPanel, 'the description waits for K or Escape').toContainText(
      "You can't use this alone.",
    );
  });

  test('pressing K once "You can\'t use this alone." is typed removes it', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');
    await expect(inventoryPage.descriptionPanel, 'the description is typed out before K').toContainText(
      "You can't use this alone.",
    );
    await inventoryPage.confirm();

    await expect(inventoryPage.descriptionPanel, 'the description is removed').not.toContainText(
      "You can't use this alone.",
    );
  });

  test('pressing Escape once "You can\'t use this alone." is typed removes it', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');
    await expect(inventoryPage.descriptionPanel, 'the description is typed out before Escape').toContainText(
      "You can't use this alone.",
    );
    await inventoryPage.backOut();

    await expect(inventoryPage.descriptionPanel, 'the description is removed').not.toContainText(
      "You can't use this alone.",
    );
  });

  test('closing "You can\'t use this alone." gives the action menu its input back', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 }],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('USE');
    await expect(inventoryPage.descriptionPanel, 'the description is typed out before K').toContainText(
      "You can't use this alone.",
    );
    await inventoryPage.confirm();
    await inventoryPage.chooseAction('CHECK');

    await expect(inventoryPage.itemModel, 'the menu takes the click on CHECK').toBeVisible();
  });

  test('closing "Mixing these does not seem to work." goes back to choosing a second item', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'red-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'blue-herb', type: 'consumable' },
        { id: 'player-item-3', itemId: 'green-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await expect(inventoryPage.descriptionPanel, 'the description is typed out before K').toContainText(
      'Mixing these does not seem to work.',
    );
    await inventoryPage.confirm();
    await inventoryPage.slot(3).click();

    await expect(inventoryPage.descriptionPanel, 'the green herb is taken as the second item').toContainText(
      'Will you mix the herbs?',
    );
  });
});
