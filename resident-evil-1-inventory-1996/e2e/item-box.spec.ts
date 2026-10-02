import { expect, test } from './fixtures';

test.describe('opening the item box', () => {
  test('opening the item box shows the list dimmed, with row 1 in the band', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'clip-9', itemId: 'clip', type: 'ammunition', amount: 9 }],
    });

    await inventoryPage.openItemBox();

    await expect(inventoryPage.bandRow(), 'row 1 is in the band').toHaveAccessibleName('Row 1: CLIP, 9');
    await expect(inventoryPage.itemBox, 'the list is dimmed').not.toHaveClass(/item-box-list--active/);
  });

  test('the menu panel lights the BOX button and dims the other buttons', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.openItemBox();

    await expect(inventoryPage.menuButton('BOX'), 'the BOX button is lit').toHaveClass(/menu-panel__button--pointed/);
    await expect(inventoryPage.menuButton('EXIT'), 'EXIT is dimmed').toHaveClass(/menu-panel__button--dimmed/);
  });
});

test.describe('choosing in the item box', () => {
  test('choosing a slot turns the list on', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openItemBox();

    await inventoryPage.chooseSlot(1);

    await expect(inventoryPage.itemBox, 'the list is bright').toHaveClass(/item-box-list--active/);
  });

  test('pressing ↑ on row 1 shows row 64 in the band', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);

    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.bandRow(), 'row 64 is in the band').toHaveAccessibleName('Row 64: empty');
  });

  test('the description panel keeps the chosen slot item name while the list is on', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'clip-9', itemId: 'clip', type: 'ammunition', amount: 9 }],
    });
    await inventoryPage.openItemBox();

    await inventoryPage.chooseSlot(1);

    await expect(inventoryPage.descriptionPanel, 'the panel names the chosen slot item').toContainText('BERETTA');
  });
});

test.describe('moving items', () => {
  test('taking a box item puts it after the last inventory item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'clip-9', itemId: 'clip', type: 'ammunition', amount: 9 }],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(6);

    await inventoryPage.confirm();

    await expect(inventoryPage.slot(2), 'the clip is in slot 2').toHaveAccessibleName('Slot 2: CLIP, 9');
  });

  test('storing an item moves the items after it up', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 },
        { id: 'clip-1', itemId: 'clip', type: 'ammunition', amount: 9 },
      ],
      equippedItemId: null,
      itemBox: [],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);

    await inventoryPage.confirm();

    await expect(inventoryPage.slot(1), 'the clip moved up to slot 1').toHaveAccessibleName('Slot 1: CLIP, 9');
  });

  test('an inventory item and a box item swap places', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'clip-1', itemId: 'clip', type: 'ammunition', amount: 9 }],
      itemBox: [{ id: 'serum-1', itemId: 'serum', type: 'consumable' }],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);

    await inventoryPage.confirm();

    await expect(inventoryPage.bandRow(), 'the clip is in row 1').toHaveAccessibleName('Row 1: CLIP, 9');
  });

  test('storing the equipped weapon empties the equipped weapon panel', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      equippedItemId: 'beretta-1',
      itemBox: [],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);

    await inventoryPage.confirm();

    await expect(
      inventoryPage.equippedWeaponPanel.getByRole('img', { name: 'BERETTA' }),
      'the Beretta is unequipped',
    ).toBeHidden();
  });
});

test.describe('choosing an empty row', () => {
  test('choosing an empty row for an empty slot keeps the list on', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(2);

    await inventoryPage.confirm();

    await expect(inventoryPage.itemBox, 'the list is still bright').toHaveClass(/item-box-list--active/);
  });
});

test.describe('backing out of the item box', () => {
  test('pressing A in the list goes back to the grid', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);

    await inventoryPage.backOut();

    await expect(inventoryPage.itemBox, 'the list is dimmed').not.toHaveClass(/item-box-list--active/);
  });

  test('pressing A in the grid closes the item box, with the BOX button pointed', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openItemBox();
    await expect(inventoryPage.itemBox, 'the item box is open').toBeVisible();

    await inventoryPage.backOut();

    await expect(inventoryPage.itemBox, 'the item box is closed').toBeHidden();
    await expect(inventoryPage.menuButton('BOX'), 'the BOX button is pointed').toHaveClass(
      /menu-panel__button--pointed/,
    );
  });
});

test.describe('drawing the item box list', () => {
  test('the yellow line stays above row 1 while the list scrolls', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);

    await inventoryPage.press('ArrowDown');

    await expect(inventoryPage.itemBoxRow(1), 'row 1 has the yellow line').toHaveClass(/item-box-list__row--first/);
  });

  test('the yellow line stays above row 1 after going back to the grid', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openItemBox();
    await inventoryPage.chooseSlot(1);
    await inventoryPage.press('ArrowDown');

    await inventoryPage.backOut();

    await expect(inventoryPage.bandRow(), 'row 2 has no yellow line').not.toHaveClass(/item-box-list__row--first/);
  });

  test('an empty row shows -Nothing- greyed out', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [],
    });

    await inventoryPage.openItemBox();

    await expect(inventoryPage.bandRow().locator('span'), 'the empty row is greyed out').toHaveClass(
      /item-box-list__name--empty/,
    );
  });

  test('the band stays inside the list frame for the longest item name', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
      itemBox: [{ id: 'key-1', itemId: 'control-room-key', type: 'key' }],
    });

    await inventoryPage.openItemBox();

    const list = await inventoryPage.itemBox.boundingBox();
    const band = await inventoryPage.bandRow().boundingBox();
    expect(band!.x + band!.width, 'the band ends inside the list').toBeLessThanOrEqual(list!.x + list!.width);
  });
});
