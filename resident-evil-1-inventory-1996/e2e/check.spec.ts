import { expect, test } from './fixtures';

test.describe('checking items', () => {
  test('choosing the Beretta, then CHECK, shows its 3D model in place of the action menu', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');

    await expect(inventoryPage.itemModel, 'the 3D model shows').toBeVisible();
    await expect(inventoryPage.actionMenu, 'the menu is hidden behind the model').toBeHidden();
  });

  test('choosing the Beretta, then CHECK, shows the rotate arrows once the model has tumbled in', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');

    await expect(inventoryPage.rotateArrows, 'the four arrows show').toHaveCount(4);
  });

  test('pressing S while checking the Beretta shows its description', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before S').toHaveCount(4);
    await inventoryPage.showDescription();

    await expect(inventoryPage.descriptionPanel, 'the description is typed out').toContainText(
      'loaded with 9mm bullets.',
    );
  });

  test('pressing S while checking the Beretta hides the rotate arrows', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before S').toHaveCount(4);
    await inventoryPage.showDescription();

    await expect(inventoryPage.rotateArrows, 'the model can no longer be turned').toHaveCount(0);
  });

  test("pressing A while the Beretta's description is shown removes the description and shows the rotate arrows again", async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before S').toHaveCount(4);
    await inventoryPage.showDescription();
    await expect(inventoryPage.descriptionPanel, 'the description shows before A').toContainText(
      'loaded with 9mm bullets.',
    );
    await inventoryPage.backOut();

    await expect(inventoryPage.descriptionPanel, 'the description is removed').not.toContainText(
      'loaded with 9mm bullets.',
    );
    await expect(inventoryPage.rotateArrows, 'the model can be turned again').toHaveCount(4);
  });

  test("pressing S once the Beretta's description is typed removes it and shows the rotate arrows again", async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before S').toHaveCount(4);
    await inventoryPage.showDescription();
    await expect(inventoryPage.descriptionPanel, 'the description is typed out before S').toContainText(
      'loaded with 9mm bullets.',
    );
    await inventoryPage.confirm();

    await expect(inventoryPage.rotateArrows, 'the model can be turned again').toHaveCount(4);
  });

  test('pressing S while the Beretta tumbles in shows no description', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await inventoryPage.showDescription();

    await expect(inventoryPage.rotateArrows, 'the model tumbles in and can be turned').toHaveCount(4);
    await expect(inventoryPage.descriptionPanel, 'no description is typed').not.toContainText('M92FS');
  });

  test('pressing A while checking the Beretta brings back the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 }],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before A').toHaveCount(4);
    await inventoryPage.backOut();

    await expect(inventoryPage.itemModel, 'the model tumbles out').toBeHidden();
    await expect(inventoryPage.actionMenu, 'the menu comes back').toBeVisible();
  });
});
