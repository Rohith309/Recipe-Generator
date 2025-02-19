import { Navigate, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import Home from '../components/Home';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import RecipeList from '../components/recipe/RecipeList';
import RecipeDetail from '../components/recipe/RecipeDetail';
import RecipeForm from '../components/recipe/RecipeForm';
import GenerateRecipe from '../components/recipe/GenerateRecipe';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '', element: <Home /> },
        { path: 'login', element: <LoginForm /> },
        { path: 'register', element: <RegisterForm /> },
        {
          path: 'recipes',
          element: <PrivateRoute><RecipeList /></PrivateRoute>
        },
        {
          path: 'recipes/:id',
          element: <PrivateRoute><RecipeDetail /></PrivateRoute>
        },
        {
          path: 'recipes/new',
          element: <PrivateRoute><RecipeForm /></PrivateRoute>
        },
        {
          path: 'recipes/edit/:id',
          element: <PrivateRoute><RecipeForm /></PrivateRoute>
        },
        {
          path: 'generate',
          element: <PrivateRoute><GenerateRecipe /></PrivateRoute>
        },
      ],
    },
  ]);
} 