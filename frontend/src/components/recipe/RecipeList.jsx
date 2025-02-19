import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecipes } from '../../features/recipe/recipeSlice';
import RecipeCard from './RecipeCard';

export default function RecipeList() {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state) => state.recipe);
  
  // Remove the ingredients filtering for now
  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
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

  if (recipes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-navy">My Recipes</h2>
          <div className="space-x-4">
            <Link
              to="/generate"
              className="inline-flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-light transition-colors"
            >
              <span className="mr-2">✨</span>
              Generate Recipe
            </Link>
            <Link
              to="/recipes/new"
              className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:opacity-90 transition-colors"
            >
              <span className="mr-2">+</span>
              Create Recipe
            </Link>
          </div>
        </div>

        <div className="text-center py-12 bg-cream rounded-lg">
          <h3 className="text-2xl font-semibold text-navy mb-4">No Recipes Yet!</h3>
          <p className="text-gray-600 mb-6">Get started by generating a recipe or creating your own</p>
          <div className="space-x-4">
            <Link
              to="/generate"
              className="inline-flex items-center px-6 py-3 bg-orange text-white rounded-md hover:bg-orange-light transition-colors"
            >
              Generate Recipe
            </Link>
            <Link
              to="/recipes/new"
              className="inline-flex items-center px-6 py-3 bg-navy text-white rounded-md hover:opacity-90 transition-colors"
            >
              Create Recipe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-navy">My Recipes</h2>
        <div className="space-x-4">
          <Link
            to="/generate"
            className="inline-flex items-center px-4 py-2 bg-orange text-white rounded-md hover:bg-orange-light transition-colors"
          >
            <span className="mr-2">✨</span>
            Generate Recipe
          </Link>
          <Link
            to="/recipes/new"
            className="inline-flex items-center px-4 py-2 bg-navy text-white rounded-md hover:opacity-90 transition-colors"
          >
            <span className="mr-2">+</span>
            Create Recipe
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
} 