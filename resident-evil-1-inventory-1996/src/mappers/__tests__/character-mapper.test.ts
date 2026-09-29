import { describe, expect, test } from 'vitest';
import { characterMapper } from '../character-mapper';

describe('toCharacter', () => {
  test('maps a character record to a character', () => {
    const json = {
      id: 'character-id',
      name: 'Character Name',
      portrait: 'portrait.png',
      inventorySize: 6,
    };

    const character = characterMapper.toCharacter(json);

    expect(character).toEqual({
      id: 'character-id',
      name: 'Character Name',
      portrait: 'portrait.png',
      inventorySize: 6,
    });
  });

  test('returns a deep copy of the data', () => {
    const json = {
      id: 'character-id',
      name: 'Character Name',
      portrait: 'portrait.png',
      inventorySize: 6,
    };

    const character = characterMapper.toCharacter(json);
    character.inventorySize = 8;

    expect(json.inventorySize).toBe(6);
  });
});
