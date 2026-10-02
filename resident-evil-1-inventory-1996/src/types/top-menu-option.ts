/** The buttons of the top menu. */
export const TopMenuOption = {
  Map: 'MAP',
  File: 'FILE',
  /** Opens the item box. */
  ItemBox: 'BOX',
  Exit: 'EXIT',
} as const;

export type TopMenuOption = (typeof TopMenuOption)[keyof typeof TopMenuOption];

/** The top menu's buttons in reading order, so an index matches its place in the 2 × 2 menu. */
export const TOP_MENU_OPTIONS: TopMenuOption[] = [
  TopMenuOption.Map,
  TopMenuOption.File,
  TopMenuOption.ItemBox,
  TopMenuOption.Exit,
];
