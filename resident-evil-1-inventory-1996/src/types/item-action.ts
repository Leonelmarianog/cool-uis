// The options of the item action menu, spelled as the game shows them.
export const ItemAction = {
  Equip: 'EQUIP',
  Use: 'USE',
  Check: 'CHECK',
  Combine: 'COMBN',
} as const;

export type ItemAction = (typeof ItemAction)[keyof typeof ItemAction];
