import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../../features/recipe/recipeSlice';
import RecipeCard from './RecipeCard';

export default function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipe);
  const { ingredients } = useSelector((state) => state.user); // Assuming you have a user slice with ingredients

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  // Filter recipes based on the current ingredients
  const filteredRecipes = recipes.filter(recipe =>
    recipe.ingredients.split(',').some(ingredient => ingredients.includes(ingredient.trim()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        Not enough ingredients to show recipes.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">My Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
} 