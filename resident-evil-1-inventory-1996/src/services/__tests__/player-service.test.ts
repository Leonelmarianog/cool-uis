import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ItemType } from '../../types/item';

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('startingState', () => {
  test('returns the starting state from the player record', async () => {
    vi.doMock('../../data/initial-player.json', () => ({
      default: {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      },
    }));
    vi.stubGlobal('window', {});
    const { playerService } = await import('../player-service');

    const state = playerService.startingState();

    expect(state).toEqual({
      characterId: 'character-id',
      healthStatus: 'fine',
      inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: ItemType.Weapon, loadedRounds: 10 }],
      equippedItemId: 'player-item-id',
      itemBox: [],
    });
  });

  test('replaces parts of the starting state with the test player on the dev server', async () => {
    vi.doMock('../../data/initial-player.json', () => ({
      default: {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      },
    }));
    vi.stubEnv('DEV', true);
    vi.stubGlobal('window', {
      __TEST_PLAYER__: {
        healthStatus: 'danger',
        equippedItemId: null,
      },
    });
    const { playerService } = await import('../player-service');

    const state = playerService.startingState();

    expect(state).toEqual({
      characterId: 'character-id',
      healthStatus: 'danger',
      inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: ItemType.Weapon, loadedRounds: 10 }],
      equippedItemId: null,
      itemBox: [],
    });
  });

  test('ignores the test player outside the dev server', async () => {
    vi.doMock('../../data/initial-player.json', () => ({
      default: {
        characterId: 'character-id',
        healthStatus: 'fine',
        inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: 'weapon', loadedRounds: 10 }],
        equippedItemId: 'player-item-id',
        itemBox: [],
      },
    }));
    vi.stubEnv('DEV', false);
    vi.stubGlobal('window', {
      __TEST_PLAYER__: {
        healthStatus: 'danger',
        equippedItemId: null,
      },
    });
    const { playerService } = await import('../player-service');

    const state = playerService.startingState();

    expect(state).toEqual({
      characterId: 'character-id',
      healthStatus: 'fine',
      inventory: [{ id: 'player-item-id', itemId: 'weapon-id', type: ItemType.Weapon, loadedRounds: 10 }],
      equippedItemId: 'player-item-id',
      itemBox: [],
    });
  });
});
