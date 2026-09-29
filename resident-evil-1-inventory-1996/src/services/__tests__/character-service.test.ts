import { beforeEach, describe, expect, test, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('find', () => {
  test('finds the character with the given ID', async () => {
    vi.doMock('../../data/characters.json', () => ({
      default: [
        { id: 'first-character-id', name: 'First Character', portrait: 'first-character.png', inventorySize: 6 },
        { id: 'second-character-id', name: 'Second Character', portrait: 'second-character.png', inventorySize: 8 },
      ],
    }));
    const { characterService } = await import('../character-service');

    const character = characterService.find('second-character-id');

    expect(character).toEqual({
      id: 'second-character-id',
      name: 'Second Character',
      portrait: 'second-character.png',
      inventorySize: 8,
    });
  });

  test('throws when no character has the given ID', async () => {
    vi.doMock('../../data/characters.json', () => ({
      default: [{ id: 'character-id', name: 'Character Name', portrait: 'portrait.png', inventorySize: 6 }],
    }));
    const { characterService } = await import('../character-service');

    expect(() => characterService.find('missing-character-id')).toThrow('Unknown character "missing-character-id"');
  });
});
