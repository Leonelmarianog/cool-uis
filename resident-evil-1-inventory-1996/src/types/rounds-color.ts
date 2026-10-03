/** The colours a weapon's round counter takes, by the rounds it holds. */
export const RoundsColor = {
  Green: 'green',
  Red: 'red',
  Orange: 'orange',
} as const;

export type RoundsColor = (typeof RoundsColor)[keyof typeof RoundsColor];
