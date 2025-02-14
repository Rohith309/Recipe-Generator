import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Recipe Generator
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/recipes" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  My Recipes
                </Link>
                <Link 
                  to="/generate" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Generate Recipe
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 