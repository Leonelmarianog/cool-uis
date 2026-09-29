import recipesJson from '../data/recipes.json';
import { recipeMapper } from '../mappers/recipe-mapper';
import type { Recipe } from '../types/recipe';

export const recipeService = {
  findByIngredients(firstItemId: string, secondItemId: string): Recipe | undefined {
    const json = recipesJson.find(
      ({ ingredients: [first, second] }) =>
        (first === firstItemId && second === secondItemId) || (first === secondItemId && second === firstItemId),
    );
    return json && recipeMapper.toRecipe(json);
  },
};
