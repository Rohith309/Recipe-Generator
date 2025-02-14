import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecipeById, deleteRecipe } from '../../features/recipe/recipeSlice';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRecipe, loading, error } = useSelector((state) => state.recipe);

  useEffect(() => {
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipe(id));
      navigate('/recipes');
    }
  };

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

  if (!currentRecipe) {
    return (
      <div className="text-center p-4">
        Recipe not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6">{currentRecipe.title}</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="font-medium">Servings:</span> {currentRecipe.servings}
        </div>
        <div>
          <span className="font-medium">Cooking Time:</span> {currentRecipe.cooking_time} minutes
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <div className="bg-gray-50 p-4 rounded">
          <pre className="whitespace-pre-wrap">{currentRecipe.ingredients}</pre>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <div className="bg-gray-50 p-4 rounded">
          <pre className="whitespace-pre-wrap">{currentRecipe.instructions}</pre>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate(`/recipes/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Recipe
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Recipe
        </button>
      </div>
    </div>
  );
} 