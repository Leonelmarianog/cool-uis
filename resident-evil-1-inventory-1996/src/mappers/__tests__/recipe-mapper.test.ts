import { describe, expect, test } from 'vitest';
import { recipeMapper } from '../recipe-mapper';

describe('toRecipe', () => {
  test('maps a recipe record to a recipe', () => {
    const json = {
      ingredients: ['first-item-id', 'second-item-id'],
      result: 'result-item-id',
    };

    const recipe = recipeMapper.toRecipe(json);

    expect(recipe).toEqual({
      ingredients: ['first-item-id', 'second-item-id'],
      result: 'result-item-id',
    });
  });

  test('returns a deep copy of the data', () => {
    const json = {
      ingredients: ['first-item-id', 'second-item-id'],
      result: 'result-item-id',
    };

    const recipe = recipeMapper.toRecipe(json);
    recipe.ingredients.push('third-item-id');

    expect(json.ingredients).toEqual(['first-item-id', 'second-item-id']);
  });
});
