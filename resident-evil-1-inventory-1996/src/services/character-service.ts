import charactersJson from '../data/characters.json';
import { characterMapper } from '../mappers/character-mapper';
import type { Character } from '../types/character';

export const characterService = {
  find(id: string): Character {
    const json = charactersJson.find(json => json.id === id);
    if (!json) throw new Error(`Unknown character "${id}"`);
    return characterMapper.toCharacter(json);
  },
};
