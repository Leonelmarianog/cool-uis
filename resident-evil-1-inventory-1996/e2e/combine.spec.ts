import { expect, test } from './fixtures';

test.describe('reloading weapons', () => {
  test('choosing the Beretta, then COMBN, then a clip loads rounds from the clip into the Beretta', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.slot(1), 'the Beretta fills up to its 15 rounds').toHaveAccessibleName('Slot 1: BERETTA, 15');
    await expect(inventoryPage.slot(2), 'the clip gives up 5 rounds').toHaveAccessibleName('Slot 2: CLIP, 10');
  });

  test('choosing a clip, then COMBN, then the Beretta loads rounds from the clip into the Beretta', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(2).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(1).click();

    await expect(inventoryPage.slot(1), 'the Beretta fills up to its 15 rounds').toHaveAccessibleName('Slot 1: BERETTA, 15');
    await expect(inventoryPage.slot(2), 'the clip gives up 5 rounds').toHaveAccessibleName('Slot 2: CLIP, 10');
  });

  test('loading the Beretta with a clip closes the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.actionMenu, 'the menu closes and the item is released').toBeHidden();
  });

  test('loading every round of a clip into the Beretta removes the clip and moves the next items up', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 3 },
        { id: 'player-item-3', itemId: 'green-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.slot(1), 'the Beretta takes all 3 rounds').toHaveAccessibleName('Slot 1: BERETTA, 13');
    await expect(inventoryPage.slot(2), 'the item after the clip moves up').toHaveAccessibleName('Slot 2: GREEN HERB');
    await expect(inventoryPage.slot(3), 'the last slot is left empty').toHaveAccessibleName('Slot 3: empty');
  });

  test('combining a full Beretta with a clip moves no rounds', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 15 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.actionMenu, 'the menu closes as after any combination').toBeHidden();
    await expect(inventoryPage.slot(1), 'the Beretta stays at 15 rounds').toHaveAccessibleName('Slot 1: BERETTA, 15');
    await expect(inventoryPage.slot(2), 'the clip keeps its rounds').toHaveAccessibleName('Slot 2: CLIP, 15');
  });
});

test.describe('stacking items', () => {
  test('combining two clips moves rounds into the first clip up to 255 and leaves the rest in the second clip', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 250 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.slot(1), 'the first clip fills up to 255 rounds').toHaveAccessibleName('Slot 1: CLIP, 255');
    await expect(inventoryPage.slot(2), 'the leftover stays in the second clip').toHaveAccessibleName('Slot 2: CLIP, 10');
  });

  test('combining two clips closes the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 250 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.actionMenu, 'the menu closes and the item is released').toBeHidden();
  });

  test('combining two clips whose rounds fit in the first clip removes the second clip and moves the next items up', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 20 },
        { id: 'player-item-3', itemId: 'green-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.slot(1), 'the first clip takes all 20 rounds').toHaveAccessibleName('Slot 1: CLIP, 30');
    await expect(inventoryPage.slot(2), 'the item after the second clip moves up').toHaveAccessibleName('Slot 2: GREEN HERB');
    await expect(inventoryPage.slot(3), 'the last slot is left empty').toHaveAccessibleName('Slot 3: empty');
  });

  test('choosing a full clip, then COMBN, then another clip moves no rounds', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 255 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(2).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(1).click();

    await expect(inventoryPage.actionMenu, 'the menu closes as after any combination').toBeHidden();
    await expect(inventoryPage.slot(1), 'the other clip keeps its rounds').toHaveAccessibleName('Slot 1: CLIP, 10');
    await expect(inventoryPage.slot(2), 'the full clip keeps its rounds').toHaveAccessibleName('Slot 2: CLIP, 255');
  });

  test('choosing a clip, then COMBN, then a full clip moves no rounds', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 10 },
        { id: 'player-item-2', itemId: 'clip', type: 'ammunition', amount: 255 },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.actionMenu, 'the menu closes as after any combination').toBeHidden();
    await expect(inventoryPage.slot(1), 'the clip keeps its rounds').toHaveAccessibleName('Slot 1: CLIP, 10');
    await expect(inventoryPage.slot(2), 'the full clip keeps its rounds').toHaveAccessibleName('Slot 2: CLIP, 255');
  });
});

test.describe('mixing herbs', () => {
  test('choosing a green herb, then COMBN, then a red herb asks "Will you mix the herbs?"', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'red-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.descriptionPanel, 'the panel asks before mixing').toContainText('Will you mix the herbs?');
  });

  test('answering Yes to "Will you mix the herbs?" puts the mixed herbs in the green herb\'s slot and removes the red herb', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'red-herb', type: 'consumable' },
        { id: 'player-item-3', itemId: 'first-aid-spray', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await inventoryPage.answer('Yes');

    await expect(inventoryPage.slot(1), 'the mixed herbs take the green herb\'s slot').toHaveAccessibleName('Slot 1: MIXED HERBS');
    await expect(inventoryPage.slotSprite(1), 'the mixed herbs are the green and red mix').toHaveAttribute('src', /mixed-herbs-g-r\.png/);
    await expect(inventoryPage.slot(2), 'the item after the red herb moves up').toHaveAccessibleName('Slot 2: F.-AID SPRAY');
    await expect(inventoryPage.slot(3), 'the last slot is left empty').toHaveAccessibleName('Slot 3: empty');
  });

  test('answering Yes to "Will you mix the herbs?" closes the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'red-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await inventoryPage.answer('Yes');

    await expect(inventoryPage.actionMenu, 'the menu closes and the item is released').toBeHidden();
  });

  test('answering No to "Will you mix the herbs?" goes back to choosing a second item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'red-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await inventoryPage.answer('No');

    await expect(inventoryPage.descriptionPanel.getByRole('button'), 'the Yes and No choices go away').toHaveCount(0);
    await expect(inventoryPage.actionButton('COMBN'), 'the menu stays inactive while a second item is chosen').toBeDisabled();
    await expect(inventoryPage.slot(1), 'the green herb is unchanged').toHaveAccessibleName('Slot 1: GREEN HERB');
    await expect(inventoryPage.slot(2), 'the red herb is unchanged').toHaveAccessibleName('Slot 2: RED HERB');
  });

  test('pressing Escape while "Will you mix the herbs?" is asked goes back to choosing a second item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'red-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await expect(inventoryPage.descriptionPanel.getByRole('button', { name: 'Yes' }), 'the question is asked before Escape').toBeVisible();
    await inventoryPage.backOut();

    await expect(inventoryPage.descriptionPanel.getByRole('button'), 'the Yes and No choices go away').toHaveCount(0);
    await expect(inventoryPage.actionButton('COMBN'), 'the menu stays inactive while a second item is chosen').toBeDisabled();
    await expect(inventoryPage.slot(1), 'the green herb is unchanged').toHaveAccessibleName('Slot 1: GREEN HERB');
    await expect(inventoryPage.slot(2), 'the red herb is unchanged').toHaveAccessibleName('Slot 2: RED HERB');
  });

  test('choosing a red herb, then COMBN, then a blue herb shows "Mixing these does not seem to work."', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'red-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'blue-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    // The message shows in full for only about 420 ms, so check it more often than toContainText() does.
    await expect.poll(() => inventoryPage.descriptionPanel.textContent(), {
      message: 'the panel says the herbs do not mix',
      intervals: [50],
    }).toContain('Mixing these does not seem to work.');
  });

  test('mixing a green herb with a red herb, then the mixed herbs with a blue herb, makes the green, red and blue mix', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'green-herb', type: 'consumable' },
        { id: 'player-item-2', itemId: 'red-herb', type: 'consumable' },
        { id: 'player-item-3', itemId: 'blue-herb', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await inventoryPage.answer('Yes');
    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();
    await inventoryPage.answer('Yes');

    await expect(inventoryPage.slotSprite(1), 'the mixed herbs are the green, red and blue mix').toHaveAttribute('src', /mixed-herbs-g-r-b\.png/);
    await expect(inventoryPage.slot(2), 'the blue herb is removed').toHaveAccessibleName('Slot 2: empty');
  });
});

test.describe('choosing items that do not combine', () => {
  test('choosing a clip, then COMBN, then the same clip keeps waiting for a second item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 },
        { id: 'player-item-2', itemId: 'first-aid-spray', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(1).click();

    await expect(inventoryPage.actionButton('COMBN'), 'the menu stays inactive while a second item is chosen').toBeDisabled();
    await expect(inventoryPage.slot(1), 'the clip is unchanged').toHaveAccessibleName('Slot 1: CLIP, 15');
  });

  test('choosing a clip, then COMBN, then a first aid spray keeps waiting for a second item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 },
        { id: 'player-item-2', itemId: 'first-aid-spray', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(2).click();

    await expect(inventoryPage.actionButton('COMBN'), 'the menu stays inactive while a second item is chosen').toBeDisabled();
    await expect(inventoryPage.slot(1), 'the clip is unchanged').toHaveAccessibleName('Slot 1: CLIP, 15');
    await expect(inventoryPage.slot(2), 'the first aid spray is unchanged').toHaveAccessibleName('Slot 2: F.-AID SPRAY');
  });

  test('choosing a clip, then COMBN, then an empty slot keeps waiting for a second item', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 },
        { id: 'player-item-2', itemId: 'first-aid-spray', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.slot(3).click();

    await expect(inventoryPage.actionButton('COMBN'), 'the menu stays inactive while a second item is chosen').toBeDisabled();
    await expect(inventoryPage.slot(1), 'the clip is unchanged').toHaveAccessibleName('Slot 1: CLIP, 15');
  });

  test('pressing Escape while COMBN waits for a second item goes back to the action menu', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [
        { id: 'player-item-1', itemId: 'clip', type: 'ammunition', amount: 15 },
        { id: 'player-item-2', itemId: 'first-aid-spray', type: 'consumable' },
      ],
      equippedItemId: null,
    });

    await inventoryPage.slot(1).click();
    await inventoryPage.chooseAction('COMBN');
    await inventoryPage.backOut();

    await expect(inventoryPage.actionMenu, 'the menu stays open').toBeVisible();
    await expect(inventoryPage.actionButton('COMBN'), 'the menu can be used again').toBeEnabled();
  });
});
