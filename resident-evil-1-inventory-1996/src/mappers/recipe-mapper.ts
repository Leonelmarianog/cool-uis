import type recipesJson from '../data/recipes.json';
import type { Recipe } from '../types/recipe';

type RecipeJson = (typeof recipesJson)[number];

export const recipeMapper = {
  toRecipe(json: RecipeJson): Recipe {
    return {
      ingredients: [...json.ingredients],
      result: json.result,
    };
  },
};
