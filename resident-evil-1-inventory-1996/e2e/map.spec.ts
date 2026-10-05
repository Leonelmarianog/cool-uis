import { expect, test } from './fixtures';

test.describe('opening the map', () => {
  test('choosing MAP shows the floor selector on Mansion 1F', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.openMap();

    await expect(inventoryPage.mapScreen, 'the selector names the Mansion').toContainText('Mansion');
    await expect(inventoryPage.mapFloor, 'the selector shows 1F').toHaveText('1F');
  });

  test('the menu panel lights the MAP button and dims the other buttons', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.openMap();

    await expect(inventoryPage.menuButton('MAP'), 'the MAP button is lit').toHaveClass(/menu-panel__button--pointed/);
    await expect(inventoryPage.menuButton('BOX'), 'BOX is dimmed').toHaveClass(/menu-panel__button--dimmed/);
  });

  test('1F shows only the arrow up', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });

    await inventoryPage.openMap();

    await expect(inventoryPage.floorArrow('above'), 'the arrow up shows').toBeVisible();
    await expect(inventoryPage.floorArrow('below'), 'the arrow down is hidden').toBeHidden();
  });
});

test.describe('choosing a floor', () => {
  test('pressing ↑ shows 2F', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();

    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.mapFloor, 'the selector shows 2F').toHaveText('2F');
  });

  test('pressing ↑ twice still shows 2F', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();

    await inventoryPage.press('ArrowUp', 2);

    await expect(inventoryPage.mapFloor, 'the selector stays on 2F').toHaveText('2F');
  });

  test('2F shows only the arrow down', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();

    await inventoryPage.press('ArrowUp');

    await expect(inventoryPage.floorArrow('below'), 'the arrow down shows').toBeVisible();
    await expect(inventoryPage.floorArrow('above'), 'the arrow up is hidden').toBeHidden();
  });
});

test.describe('the floor map', () => {
  test('pressing S shows the 1F floor map', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();

    await inventoryPage.confirm();

    await expect(inventoryPage.floorMap, 'the 1F map shows').toHaveAccessibleName('Mansion 1F map');
  });

  test('pressing S on 2F shows the 2F floor map', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();
    await inventoryPage.press('ArrowUp');

    await inventoryPage.confirm();

    await expect(inventoryPage.floorMap, 'the 2F map shows').toHaveAccessibleName('Mansion 2F map');
  });

  test('pressing A on the floor map goes back to the floor selector', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();
    await inventoryPage.confirm();
    await expect(inventoryPage.openedFloorMap, 'the floor map has grown in').toBeVisible();

    await inventoryPage.backOut();

    await expect(inventoryPage.floorMap, 'the floor map is gone').toBeHidden();
    await expect(inventoryPage.mapFloor, 'the selector shows 1F').toHaveText('1F');
  });
});

test.describe('closing the map', () => {
  test('pressing A in the floor selector returns to the inventory with MAP highlighted', async ({ inventoryPage }) => {
    await inventoryPage.open({
      inventory: [{ id: 'beretta-1', itemId: 'beretta', type: 'weapon', loadedRounds: 15 }],
    });
    await inventoryPage.openMap();

    await inventoryPage.backOut();

    await expect(inventoryPage.mapScreen, 'the map is gone').toBeHidden();
    await expect(inventoryPage.menuButton('MAP'), 'MAP is highlighted').toHaveClass(/menu-panel__button--pointed/);
    await expect(inventoryPage.menuButton('BOX'), 'BOX is no longer dimmed').not.toHaveClass(
      /menu-panel__button--dimmed/,
    );
  });
});
