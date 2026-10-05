/** The floors the map shows, named as the selector's label writes them. */
export const MapFloor = {
  First: '1F',
  Second: '2F',
} as const;

export type MapFloor = (typeof MapFloor)[keyof typeof MapFloor];

/** The map's floors, top floor first, so ↑ moves to a lower index like in every other list. */
export const MAP_FLOORS: MapFloor[] = [MapFloor.Second, MapFloor.First];
