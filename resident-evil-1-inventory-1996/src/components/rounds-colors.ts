import { RoundsColor } from '../types/rounds-color';

/** Text and shadow colours of a round counter, by the colour of its rounds. */
const roundsColors: Record<RoundsColor, { text: string; shadow: string }> = {
  [RoundsColor.Green]: { text: '#29a229', shadow: '#065909' },
  [RoundsColor.Red]: { text: '#c42929', shadow: '#5f0606' },
  [RoundsColor.Yellow]: { text: '#c4c429', shadow: '#5f5f06' },
};

/** CSS custom properties that colour a round counter; green when no colour is given. */
export function roundsColorStyle(color: RoundsColor = RoundsColor.Green): Record<string, string> {
  const { text, shadow } = roundsColors[color];
  return { '--rounds-color': text, '--rounds-shadow': shadow };
}
