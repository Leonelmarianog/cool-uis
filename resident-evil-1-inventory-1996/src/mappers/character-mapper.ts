import type charactersJson from '../data/characters.json';
import type { Character } from '../types/character';

type CharacterJson = (typeof charactersJson)[number];

export const characterMapper = {
  toCharacter(json: CharacterJson): Character {
    return {
      id: json.id,
      name: json.name,
      portrait: json.portrait,
      inventorySize: json.inventorySize,
    };
  },
};
