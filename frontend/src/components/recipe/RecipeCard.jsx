import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <div className="text-gray-600 mb-4">
          <p className="mb-1">
            <span className="font-medium">Servings:</span> {recipe.servings}
          </p>
          <p className="mb-1">
            <span className="font-medium">Cooking Time:</span> {recipe.cooking_time} minutes
          </p>
        </div>
        <div className="flex justify-between items-center">
          <Link 
            to={`/recipes/${recipe.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            View Details
          </Link>
          <span className="text-sm text-gray-500">
            Created by: {recipe.user.username}
          </span>
        </div>
      </div>
    </div>
  );
} 