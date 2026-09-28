import { expect, test } from './fixtures';

test.describe('COMBN reloading', () => {
  test.use({
    player: {
      inventory: [
        { id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    },
  });

  test('reloads a weapon when the weapon is chosen first', async ({ inventoryPage }) => {
    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.slot(1), 'the Beretta fills up to its 15 rounds').toHaveAccessibleName('Slot 1: BERETTA, 15');
    await expect(inventoryPage.slot(2), 'the clip gives up 5 rounds').toHaveAccessibleName('Slot 2: CLIP, 10');
  });

  test('reloads a weapon when its ammunition is chosen first', async ({ inventoryPage }) => {
    await inventoryPage.slot(2).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(1).click();

    await expect(inventoryPage.slot(1), 'the Beretta fills up to its 15 rounds').toHaveAccessibleName('Slot 1: BERETTA, 15');
    await expect(inventoryPage.slot(2), 'the clip gives up 5 rounds').toHaveAccessibleName('Slot 2: CLIP, 10');
  });
});

test.describe('COMBN stacking', () => {
  test.use({
    player: {
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 255 },
      ],
      equippedItemId: null,
    },
  });

  test('moves no rounds when a stack is full', async ({ inventoryPage }) => {
    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.actionMenu, 'the menu closes as after any combination').toBeHidden();
    await expect(inventoryPage.slot(1), 'the source keeps its rounds').toHaveAccessibleName('Slot 1: CLIP, 10');
    await expect(inventoryPage.slot(2), 'the full target keeps its rounds').toHaveAccessibleName('Slot 2: CLIP, 255');
  });
});
