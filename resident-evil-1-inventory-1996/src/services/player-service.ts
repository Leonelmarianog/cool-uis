import initialPlayerJson from '../data/initial-player.json';
import { playerMapper } from '../mappers/player-mapper';
import type { PlayerState } from '../types/player';

export const playerService = {
  startingState(): PlayerState {
    const state = playerMapper.toPlayerState(initialPlayerJson);
    // On the dev server, end-to-end tests can replace parts of it (see e2e/fixtures.ts).
    const testState = import.meta.env.DEV ? window.__TEST_PLAYER__ : undefined;
    return { ...state, ...testState };
  },
};
