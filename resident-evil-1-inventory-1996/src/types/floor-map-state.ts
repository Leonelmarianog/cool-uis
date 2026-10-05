/** What the floor map is doing over the map's floor selector. */
export const FloorMapState = {
  /** Not shown; the selector takes input. */
  Hidden: 'hidden',
  /** Growing in over the dimmed selector. */
  Opening: 'opening',
  /** Shown over the dimmed selector. */
  Shown: 'shown',
  /** Shrinking out; the selector brightens once it is gone. */
  Closing: 'closing',
} as const;

export type FloorMapState = (typeof FloorMapState)[keyof typeof FloorMapState];
