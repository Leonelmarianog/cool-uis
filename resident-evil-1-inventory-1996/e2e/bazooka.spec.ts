import { expect, test } from './fixtures';

test.describe('swapping the bazooka rounds', () => {
  test('choosing the bazooka, then COMBN, then flame rounds puts the explosive rounds in their slot', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 4, loadedAmmunitionId: 'explosive-rounds' },
        { id: 'flame-1', itemId: 'flame-rounds', type: 'ammunition', amount: 5 },
        { id: 'herb-1', itemId: 'green-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.chooseSlot(2);

    await expect(inventoryPage.slot(1), 'the bazooka holds the flame rounds').toHaveAccessibleName(
      'Slot 1: BAZOOKA, 5',
    );
    await expect(inventoryPage.slot(2), 'the explosive rounds take their slot').toHaveAccessibleName(
      'Slot 2: EXPLOSIVE ROUNDS, 4',
    );
    await expect(inventoryPage.slot(3), 'the herb stays').toHaveAccessibleName('Slot 3: GREEN HERB');
  });

  test('swapping with flame rounds left over puts the explosive rounds after the last item', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 4, loadedAmmunitionId: 'explosive-rounds' },
        { id: 'flame-1', itemId: 'flame-rounds', type: 'ammunition', amount: 10 },
        { id: 'herb-1', itemId: 'green-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.chooseSlot(2);

    await expect(inventoryPage.slot(2), 'the leftover flame rounds stay').toHaveAccessibleName(
      'Slot 2: FLAME ROUNDS, 4',
    );
    await expect(inventoryPage.slot(4), 'the explosive rounds go last').toHaveAccessibleName(
      'Slot 4: EXPLOSIVE ROUNDS, 4',
    );
  });

  test('swapping in a full inventory with flame rounds left over keeps waiting for a second item', async ({
    inventoryPage,
  }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 4, loadedAmmunitionId: 'explosive-rounds' },
        { id: 'flame-1', itemId: 'flame-rounds', type: 'ammunition', amount: 10 },
        ...['1', '2', '3', '4', '5', '6'].map(
          n => ({ id: `herb-${n}`, itemId: 'green-herb', type: 'consumable' }) as const,
        ),
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
    await expect(inventoryPage.slot(2), 'the flame rounds are unchanged').toHaveAccessibleName(
      'Slot 2: FLAME ROUNDS, 10',
    );
  });
});

test.describe('the bazooka counter colour', () => {
  test('the counter of a bazooka with explosive rounds is green', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 6, loadedAmmunitionId: 'explosive-rounds' },
      ],
      equippedItemId: null,
    });

    await expect(inventoryPage.slot(1).locator('.item-amount'), 'the counter is green').toHaveCSS(
      'font-palette',
      'normal',
    );
  });

  test('loading flame rounds turns the counter red', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 4, loadedAmmunitionId: 'explosive-rounds' },
        { id: 'flame-1', itemId: 'flame-rounds', type: 'ammunition', amount: 5 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.chooseSlot(2);

    await expect(inventoryPage.slot(1).locator('.item-amount'), 'the counter is red').toHaveCSS(
      'font-palette',
      '--red',
    );
  });

  test('the equipped weapon panel shows acid rounds in orange', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 3, loadedAmmunitionId: 'acid-rounds' },
      ],
      equippedItemId: 'bazooka-1',
    });

    await expect(inventoryPage.equippedWeaponPanel.getByLabel('3 rounds'), 'the panel counter is orange').toHaveCSS(
      'font-palette',
      '--orange',
    );
  });

  test('the item box square shows flame rounds in red', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 6, loadedAmmunitionId: 'flame-rounds' },
      ],
    });

    await inventoryPage.openItemBox();

    await expect(
      inventoryPage.page.locator('.item-box-square .item-amount'),
      'the box square counter is red',
    ).toHaveCSS('font-palette', '--red');
  });

  test('the counter of flame rounds is green', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'flame-1', itemId: 'flame-rounds', type: 'ammunition', amount: 12 }],
      equippedItemId: null,
    });

    await expect(inventoryPage.slot(1).locator('.item-amount'), 'stack counters stay green').toHaveCSS(
      'font-palette',
      'normal',
    );
  });
});

test.describe('checking the bazooka', () => {
  test('pressing S while checking a bazooka with flame rounds shows "F.Rounds Loaded"', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'bazooka-1', itemId: 'bazooka', type: 'weapon', loadedRounds: 6, loadedAmmunitionId: 'flame-rounds' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.chooseSlot(1);
    await inventoryPage.chooseAction('CHECK');
    await expect(inventoryPage.rotateArrows, 'the model has tumbled in before S').toHaveCount(4);
    await inventoryPage.showDescription();

    await expect(inventoryPage.descriptionPanel, 'the description is typed out').toContainText('F.Rounds Loaded');
  });
});
