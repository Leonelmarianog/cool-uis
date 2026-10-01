import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useInventoryStore } from '../inventory';
import { usePlayerStore } from '../player';
import { CursorArea } from '../../types/cursor-area';
import { Direction } from '../../types/direction';
import { InventoryMode } from '../../types/inventory-mode';
import { ItemType } from '../../types/item';

beforeEach(() => {
  vi.stubGlobal('window', {});
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('point', () => {
  test('moves the main cursor while browsing', () => {
    const inventory = useInventoryStore();

    inventory.point(1);

    expect(inventory.mainCursor.index).toBe(1);
  });

  test('moves the option cursor while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();

    inventory.point(2);

    expect(inventory.actionMenu.cursor.index).toBe(2);
  });

  test('keeps the main cursor while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();

    inventory.point(2);

    expect(inventory.mainCursor.index).toBe(0);
  });

  test('moves the main cursor to the top menu while browsing', () => {
    const inventory = useInventoryStore();

    inventory.point(1, CursorArea.TopMenu);

    expect(inventory.mainCursor.area).toBe(CursorArea.TopMenu);
  });

  test('keeps the main cursor on the grid while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0, CursorArea.Grid);
    inventory.choose();

    inventory.point(1, CursorArea.TopMenu);

    expect(inventory.mainCursor.area).toBe(CursorArea.Grid);
  });
});

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
});

describe('choose', () => {
  test('opens the action menu on an item while browsing', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingAction);
  });

  test('keeps browsing on an empty slot', () => {
    const player = usePlayerStore();
    player.inventory = [];
    const inventory = useInventoryStore();
    inventory.point(0);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test('starts choosing a target on COMBN', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(2);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.ChoosingTarget);
  });

  test('starts opening the model on CHECK', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.OpeningModel);
  });

  test('does nothing while the model tumbles in', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
    inventory.choose();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.OpeningModel);
  });

  test('types the item description while viewing the model', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.TypingText);
  });

  test('types a description when USE has no effect', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();

    inventory.choose();

    expect(inventory.panelText).toBe("You can't use this alone.");
  });

  test('hurries a description while it types', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.choose();

    inventory.choose();

    expect(inventory.isTextHurried).toBe(true);
  });

  test('does not hurry the next description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
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
    inventory.point(0);
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
    inventory.point(0);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(2);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(1);
    inventory.choose();
    inventory.point(2);
    inventory.choose();
    inventory.point(0);
    inventory.choose();
    inventory.onPromptTyped();

    inventory.choose();

    expect(inventory.mainCursor.index).toBe(1);
  });

  test('logs that the map screen is not built yet on MAP', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.point(0, CursorArea.TopMenu);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('MAP: the map screen is not built yet.');
  });

  test('logs that the files screen is not built yet on FILE', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.point(1, CursorArea.TopMenu);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('FILE: the files screen is not built yet.');
  });

  test('logs that the item box is not built yet on the dash button', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.point(2, CursorArea.TopMenu);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('ITEM BOX: the item box is not built yet.');
  });

  test('logs that there is no game to go back to on EXIT', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.point(3, CursorArea.TopMenu);

    inventory.choose();

    expect(info).toHaveBeenCalledWith('EXIT: there is no game to go back to yet.');
  });

  test('keeps browsing on a top menu button', () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const inventory = useInventoryStore();
    inventory.point(0, CursorArea.TopMenu);

    inventory.choose();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });
});

describe('back', () => {
  test('closes the action menu while choosing an action', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.Browsing);
  });

  test('goes back to the action menu while choosing a target', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(2);
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ChoosingAction);
  });

  test('does nothing while a description types', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.TypingText);
  });

  test('goes back to viewing the model from a complete item description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(2);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(2);
    inventory.choose();
    inventory.point(1);
    inventory.choose();
    inventory.onPromptTyped();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ChoosingTarget);
  });

  test('does nothing while the model tumbles in', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
    inventory.choose();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.OpeningModel);
  });

  test('spins the model out while viewing it', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.back();

    expect(inventory.mode).toBe(InventoryMode.ClosingModel);
  });

  test('does nothing while the model spins out', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
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
});

describe('onDescriptionTyped', () => {
  test('lets the player read the complete description', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'clip-1', itemId: 'clip', type: ItemType.Ammunition, amount: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(2);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
    inventory.choose();
    inventory.onItemPreviewEntered();

    inventory.choose();

    expect(inventory.isModelFrozen).toBe(true);
  });

  test('lets the model turn while viewing it', () => {
    const player = usePlayerStore();
    player.inventory = [{ id: 'beretta-1', itemId: 'beretta', type: ItemType.Weapon, loadedRounds: 15 }];
    const inventory = useInventoryStore();
    inventory.point(0);
    inventory.choose();
    inventory.point(1);
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
    inventory.point(0);
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
    inventory.point(0);
    inventory.choose();
    inventory.point(2);
    inventory.choose();
    inventory.point(1);

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

    inventory.point(0, CursorArea.TopMenu);

    expect(inventory.itemUnderCursor).toBeNull();
  });
});
