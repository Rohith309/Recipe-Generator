import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateRecipe, createRecipe } from '../../features/recipe/recipeSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GenerateRecipe() {
  const dispatch = useDispatch();
  const { loading, generatedRecipe, error } = useSelector((state) => state.recipe);
  const { token } = useSelector((state) => state.auth);
  console.log("Current Token:", token); // Log the token to check its value
  const [ingredients, setIngredients] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setShowError(false);
    
    if (!ingredients.trim()) {
      setShowError(true);
      return;
    }
    
    try {
      const response = await axios.post('/api/generate/', { ingredients }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(generateRecipe(response.data));
    } catch (err) {
      console.error('Generation failed:', err.response ? err.response.data : err.message);
    }
  };

  const handleSave = async () => {
    if (generatedRecipe) {
      try {
        await dispatch(createRecipe({
          title: generatedRecipe.title,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          cooking_time: parseInt(generatedRecipe.cooking_time),
          servings: parseInt(generatedRecipe.servings)
        })).unwrap();
        
        // Navigate to recipes list after saving
        navigate('/recipes');
      } catch (err) {
        console.error('Save failed:', err);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Generate Recipe</h2>

      <form onSubmit={handleGenerate} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Your Ingredients
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            rows="4"
            placeholder="Enter ingredients separated by commas (e.g., chicken, rice, tomatoes, onions)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {showError && (
            <p className="mt-2 text-sm text-red-600">
              Please enter some ingredients
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : 'Generate Recipe'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error.detail || error.message || 'An error occurred while generating the recipe.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {generatedRecipe && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">{generatedRecipe.title}</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="font-medium">Servings:</span> {generatedRecipe.servings}
            </div>
            <div>
              <span className="font-medium">Cooking Time:</span> {generatedRecipe.cooking_time} minutes
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Ingredients:</h4>
            <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
              {generatedRecipe.ingredients}
            </pre>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Instructions:</h4>
            <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
              {generatedRecipe.instructions}
            </pre>
          </div>

          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save Recipe
          </button>
        </div>
      )}
    </div>
  );
} 