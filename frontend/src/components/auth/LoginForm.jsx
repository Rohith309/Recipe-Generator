import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import './Auth.css';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    const checkFilesExist = async () => {
      try {
        await import('../../features/auth/authSlice');
        await import('../../features/recipe/recipeSlice');
      } catch (error) {
        console.error('Required files are missing:', error);
      }
    };

    checkFilesExist();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate('/recipes');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign in</h1>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}