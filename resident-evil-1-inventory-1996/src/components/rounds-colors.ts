import { RoundsColor } from '../types/rounds-color';

/** The digit font palette of each colour of rounds; green is the font's own. */
const roundsPalettes: Record<RoundsColor, string> = {
  [RoundsColor.Green]: 'normal',
  [RoundsColor.Red]: '--red',
  [RoundsColor.Orange]: '--orange',
};

/** The font palette that colours a round counter; green when no colour is given. */
export function roundsPalette(color: RoundsColor = RoundsColor.Green): string {
  return roundsPalettes[color];
}
