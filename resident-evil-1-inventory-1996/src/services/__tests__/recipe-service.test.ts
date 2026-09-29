import { beforeEach, describe, expect, test, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('findByIngredients', () => {
  test('finds the recipe with the given ingredients', async () => {
    vi.doMock('../../data/recipes.json', () => ({
      default: [
        { ingredients: ['first-item-id', 'second-item-id'], result: 'first-result-id' },
        { ingredients: ['first-item-id', 'third-item-id'], result: 'second-result-id' },
      ],
    }));
    const { recipeService } = await import('../recipe-service');

    const recipe = recipeService.findByIngredients('first-item-id', 'third-item-id');

    expect(recipe).toEqual({
      ingredients: ['first-item-id', 'third-item-id'],
      result: 'second-result-id',
    });
  });

  test('finds the recipe when the ingredients are given in the other order', async () => {
    vi.doMock('../../data/recipes.json', () => ({
      default: [
        { ingredients: ['first-item-id', 'second-item-id'], result: 'result-item-id' },
      ],
    }));
    const { recipeService } = await import('../recipe-service');

    const recipe = recipeService.findByIngredients('second-item-id', 'first-item-id');

    expect(recipe).toEqual({
      ingredients: ['first-item-id', 'second-item-id'],
      result: 'result-item-id',
    });
  });

  test('returns undefined when no recipe has the given ingredients', async () => {
    vi.doMock('../../data/recipes.json', () => ({
      default: [
        { ingredients: ['first-item-id', 'second-item-id'], result: 'result-item-id' },
      ],
    }));
    const { recipeService } = await import('../recipe-service');

    const recipe = recipeService.findByIngredients('first-item-id', 'third-item-id');

    expect(recipe).toBeUndefined();
  });
});
