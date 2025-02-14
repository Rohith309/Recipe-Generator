import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import RecipeList from '../components/recipe/RecipeList';
import RecipeDetail from '../components/recipe/RecipeDetail';
import RecipeForm from '../components/recipe/RecipeForm';
import GenerateRecipe from '../components/recipe/GenerateRecipe';
import Home from '../pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (token) {
    return <Navigate to="/recipes" replace />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterForm />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="recipes" element={<RecipeList />} />
        <Route path="recipes/:id" element={<RecipeDetail />} />
        <Route path="recipes/new" element={<RecipeForm />} />
        <Route path="recipes/edit/:id" element={<RecipeForm />} />
        <Route path="generate" element={<GenerateRecipe />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 