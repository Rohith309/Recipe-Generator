import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-cream hover:border-orange-light transition-colors">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-navy mb-3">{recipe.title}</h3>
        <div className="text-gray-600 mb-4 space-y-2">
          <p className="flex items-center">
            <span className="mr-2">👥</span>
            <span className="font-medium">Servings:</span> {recipe.servings}
          </p>
          <p className="flex items-center">
            <span className="mr-2">⏰</span>
            <span className="font-medium">Cooking Time:</span> {recipe.cooking_time} minutes
          </p>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-cream">
          <Link 
            to={`/recipes/${recipe.id}`}
            className="text-orange hover:text-orange-light font-medium"
          >
            View Details →
          </Link>
          <span className="text-sm text-gray-500">
            by {recipe.user.username}
          </span>
        </div>
      </div>
    </div>
  );
} 