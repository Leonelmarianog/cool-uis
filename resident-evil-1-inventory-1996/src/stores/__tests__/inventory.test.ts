import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useInventoryStore } from '../inventory';
import { ITEM_BOX_SIZE, usePlayerStore } from '../player';
import { CursorArea } from '../../types/cursor-area';
import { Direction } from '../../types/direction';
import { InventoryMode } from '../../types/inventory-mode';
import { ItemType } from '../../types/item';
import { TopMenuOption } from '../../types/top-menu-option';

beforeEach(() => {
  vi.stubGlobal('window', {});
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** Opens the item box from slot 1: ↑ to the BOX button, then S. */
function openItemBox(inventory: ReturnType<typeof useInventoryStore>) {
  inventory.move(Direction.Up);
  inventory.choose();
}

describe('move', () => {
  test('moves the main cursor while browsing', () => {
    const inventory = useInventoryStore();

    inventory.move(Direction.Right);

    expect(inventory.mainCursor.gridIndex).toBe(1);
  });

  test('moves the main cursor to the top menu while browsing', () => {
    const inventory = useInventoryStore();

    inventory.move(Direction.Up);

    expect(inventory.mainCursor.area).toBe(CursorArea.TopMenu);
  });

  test('moves the option cursor while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();

    inventory.move(Direction.Down);

    expect(inventory.actionMenu.cursor.index).toBe(1);
  });

  test('keeps the main cursor on the selected item while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();

    inventory.move(Direction.Up);

    expect(inventory.mainCursor.gridIndex).toBe(0);
  });

  test('moves the target cursor while choosing a target', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 10 },
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.move(Direction.Right);

    expect(inventory.targetIndex).toBe(1);
  });

  test('keeps the target cursor in the grid when moving up from the first row', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.move(Direction.Up);

    expect(inventory.targetIndex).toBe(0);
  });

  test('moves the choice cursor while answering a prompt', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Right);
    inventory.choose();
    inventory.onPromptTyped();

    inventory.move(Direction.Right);

    expect(inventory.prompt.cursor.index).toBe(1);
  });

  test('does nothing while viewing the model', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.move(Direction.Down);

    expect(inventory.actionMenu.cursor.index).toBe(1);
  });

  test('does nothing while a description types', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.choose();

    inventory.move(Direction.Down);

    expect(inventory.actionMenu.cursor.index).toBe(0);
  });

  test('keeps the main cursor in the grid when moving up from slot 1', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);

    inventory.move(Direction.Up);

    expect(inventory.mainCursor.gridIndex).toBe(0);
  });

  test('moves the main cursor in the grid while the item box is open', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);

    inventory.move(Direction.Down);

    expect(inventory.mainCursor.gridIndex).toBe(2);
  });

  test('moves the band down one row', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.choose();

    inventory.move(Direction.Down);

    expect(inventory.itemBoxRowIndex).toBe(1);
  });

  test('keeps the main cursor on the chosen slot while scrolling the box', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.move(Direction.Right);
    inventory.choose();

    inventory.move(Direction.Left);

    expect(inventory.mainCursor.gridIndex).toBe(1);
  });
});

describe('choose', () => {
  test('opens the action menu on an item while browsing', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingAction);
  });

  test('keeps browsing on an empty slot', () => {
    const player = usePlayerStore();
    player.inventory = [];
    const inventory = useInventoryStore();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test('starts choosing a target on COMBN', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingTarget);
  });

  test('starts opening the model on CHECK', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.OpeningModel);
  });

  test("types the checked item's description on S while viewing the model", () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.choose();

    expect(inventory.panelText).toBe('Clip for Beretta.');
  });

  test('does nothing while the model tumbles in', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.OpeningModel);
  });

  test('types the item description while viewing the model', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.TypingText);
  });

  test('types a description when USE has no effect', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();

    inventory.choose();

    expect(inventory.panelText).toBe("You can't use this alone.");
  });

  test('hurries a description while it types', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.choose();

    inventory.choose();

    expect(inventory.isTextHurried).toBe(true);
  });

  test('does not hurry the next description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.choose();
    inventory.choose();
    inventory.onDescriptionTyped();
    inventory.choose();

    inventory.choose();

    expect(inventory.isTextHurried).toBe(false);
  });

  test('goes back to the action menu from a complete description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.choose();
    inventory.onDescriptionTyped();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingAction);
  });

  test('keeps the action menu open under a description from USE', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();

    inventory.choose();

    expect(inventory.actionMenu.isOpen).toBe(true);
  });

  test('goes back to browsing after Yes mixes the herbs', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Right);
    inventory.choose();
    inventory.onPromptTyped();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test("keeps the main cursor on the first item's slot after mixing", () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'red-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'green-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.move(Direction.Right);
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Left);
    inventory.choose();
    inventory.onPromptTyped();

    inventory.choose();

    expect(inventory.mainCursor.index).toBe(1);
  });

  test('logs that the map screen is not built yet on MAP', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.move(Direction.Up);
    inventory.move(Direction.Up);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('MAP: the map screen is not built yet.');
  });

  test('logs that the files screen is not built yet on FILE', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.move(Direction.Up);
    inventory.move(Direction.Up);
    inventory.move(Direction.Right);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('FILE: the files screen is not built yet.');
  });

  test('logs that there is no game to go back to on EXIT', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.move(Direction.Up);
    inventory.move(Direction.Right);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('EXIT: there is no game to go back to yet.');
  });

  test('keeps browsing on a top menu button', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.move(Direction.Up);
    inventory.move(Direction.Up);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test('opens the item box on S on the BOX button', () => {
    const inventory = useInventoryStore();

    openItemBox(inventory);

    expect(inventory.mode).toBe(InventoryMode.ChoosingBoxSlot);
  });

  test('puts the main cursor on slot 1 when the item box opens', () => {
    const inventory = useInventoryStore();

    openItemBox(inventory);

    expect(inventory.mainCursor.gridIndex).toBe(0);
  });

  test('opens the box on row 1 again after it was closed', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.back();
    inventory.back();

    inventory.choose();

    expect(inventory.itemBoxRowIndex).toBe(0);
  });

  test('opens the box on row 1 again after an exchange', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.back();

    inventory.choose();

    expect(inventory.itemBoxRowIndex).toBe(0);
  });

  test('turns the box list on for an empty slot', () => {
    const player = usePlayerStore();
    player.inventory = [];
    const inventory = useInventoryStore();
    openItemBox(inventory);

    inventory.choose();

    expect(inventory.isItemBoxActive).toBe(true);
  });

  test('exchanges the chosen slot with the band row on S', () => {
    const player = usePlayerStore();
    player.inventory = [];
    player.itemBox[0] = { id: 'clip-9', itemId: 'clip', type: ItemType.Ammunition, amount: 9 };
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.choose();

    inventory.choose();

    expect(player.inventory[0]?.id).toBe('clip-9');
  });

  test('goes back to choosing a slot after an exchange', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.choose();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingBoxSlot);
  });

  test('keeps the cursor on the slot of a stored item', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 1 },
      { id: 'clip-2', itemId: 'clip', type: ItemType.Ammunition, amount: 2 },
    ];
    player.itemBox[0] = null;
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.move(Direction.Right);
    inventory.choose();

    inventory.choose();

    expect([inventory.mainCursor.gridIndex, inventory.itemUnderCursor]).toEqual([1, null]);
  });

  test('keeps the cursor on a far empty slot that takes a box item', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 1 }];
    player.itemBox[0] = { id: 'clip-9', itemId: 'clip', type: ItemType.Ammunition, amount: 9 };
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.choose();

    expect([inventory.mainCursor.gridIndex, player.inventory[1]?.id]).toEqual([4, 'clip-9']);
  });

  test('keeps the box list on when an empty slot meets an empty row', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 1 }];
    player.itemBox[0] = null;
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.move(Direction.Right);
    inventory.choose();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingBoxRow);
  });
});

describe('back', () => {
  test('closes the action menu while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test('goes back to the action menu while choosing a target', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ChoosingAction);
  });

  test('does nothing while a description types', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.TypingText);
  });

  test('goes back to viewing the model from a complete item description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();
    inventory.choose();
    inventory.onDescriptionTyped();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ViewingModel);
  });

  test('goes back to choosing a target from a complete description from COMBN', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'red-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'blue-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Right);
    inventory.choose();
    inventory.onDescriptionTyped();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ChoosingTarget);
  });

  test('goes back to choosing a target from the prompt', () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Right);
    inventory.choose();
    inventory.onPromptTyped();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ChoosingTarget);
  });

  test('does nothing while the model tumbles in', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.OpeningModel);
  });

  test('spins the model out while viewing it', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ClosingModel);
  });

  test('does nothing while the model spins out', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();
    inventory.back();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ClosingModel);
  });

  test('does nothing while browsing', () => {
    const inventory = useInventoryStore();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test('closes the item box on A from the grid', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);

    inventory.back();

    expect(inventory.isItemBoxOpen).toBe(false);
  });

  test('puts the main cursor on the BOX button when the item box closes', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.move(Direction.Down);

    inventory.back();

    expect(inventory.mainCursor.topMenuIndex).toBe(2);
  });

  test('goes back to choosing a box slot on A from the box list', () => {
    const inventory = useInventoryStore();
    openItemBox(inventory);
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ChoosingBoxSlot);
  });
});

describe('onDescriptionTyped', () => {
  test('lets the player read the complete description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.choose();

    inventory.onDescriptionTyped();

    expect(inventory.mode).toBe(InventoryMode.ReadingDescription);
  });
});

describe('onPromptTyped', () => {
  test("lets the player answer the prompt's question", () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Right);
    inventory.choose();

    inventory.onPromptTyped();

    expect(inventory.mode).toBe(InventoryMode.AnsweringPrompt);
  });
});

describe('onItemPreviewEntered', () => {
  test('lets the player turn the model', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.onItemPreviewEntered();

    expect(inventory.mode).toBe(InventoryMode.ViewingModel);
  });
});

describe('onItemPreviewExited', () => {
  test('brings the action menu back after the model spun out', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();
    inventory.back();

    inventory.onItemPreviewExited();

    expect(inventory.mode).toBe(InventoryMode.ChoosingAction);
  });
});

describe('isModelFrozen', () => {
  test('freezes the model while the item description types', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.choose();

    expect(inventory.isModelFrozen).toBe(true);
  });

  test('lets the model turn while viewing it', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.choose();

    inventory.onItemPreviewEntered();

    expect(inventory.isModelFrozen).toBe(false);
  });
});

describe('isModelShown', () => {
  test('hides the model under a description from USE', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.choose();

    inventory.choose();

    expect(inventory.isModelShown).toBe(false);
  });
});

describe('targetIndex', () => {
  test("stays on the target while the prompt's question types", () => {
    const player = usePlayerStore();
    player.inventory = [
      { id: 'herb-1', itemId: 'green-herb', type: ItemType.Consumable },
      { id: 'herb-2', itemId: 'red-herb', type: ItemType.Consumable },
    ];
    const inventory = useInventoryStore();
    inventory.choose();
    inventory.move(Direction.Down);
    inventory.move(Direction.Down);
    inventory.choose();
    inventory.move(Direction.Right);

    inventory.choose();

    expect(inventory.targetIndex).toBe(1);
  });

  test('is no slot while browsing', () => {
    const inventory = useInventoryStore();

    expect(inventory.targetIndex).toBeNull();
  });
});

describe('itemUnderCursor', () => {
  test('is no item while the main cursor is on the top menu', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();

    inventory.move(Direction.Up);
    inventory.move(Direction.Up);

    expect(inventory.itemUnderCursor).toBeNull();
  });
});

describe('isCursorLocked', () => {
  test('locks the main cursor while the box list is on', () => {
    const player = usePlayerStore();
    player.inventory = [];
    const inventory = useInventoryStore();
    openItemBox(inventory);

    inventory.choose();

    expect(inventory.isCursorLocked).toBe(true);
  });
});

describe('itemBoxRows', () => {
  test('shows the last row above the band on row 1', () => {
    const player = usePlayerStore();
    player.itemBox[ITEM_BOX_SIZE - 1] = { id: 'clip-9', itemId: 'clip', type: ItemType.Ammunition, amount: 9 };
    const inventory = useInventoryStore();
    openItemBox(inventory);

    expect(inventory.itemBoxRows[0]?.id).toBe('clip-9');
  });
});

describe('openOption', () => {
  test('lights the BOX button while the item box is open', () => {
    const inventory = useInventoryStore();

    openItemBox(inventory);

    expect(inventory.openOption).toBe(TopMenuOption.ItemBox);
  });
});
