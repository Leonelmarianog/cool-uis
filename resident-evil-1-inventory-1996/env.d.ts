/// <reference types="vite/client" />

interface Window {
  /** A starting player state set by end-to-end tests before the app loads; only the dev server reads it. */
  __TEST_PLAYER__?: Partial<import('./src/types/player').PlayerState>;
}
