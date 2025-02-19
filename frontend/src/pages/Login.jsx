import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { isLoading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="features-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to RecipeAI</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          {error && <p className="error">{error}</p>}
          <p>
            Don't have an account? <Link to="/register" className="btn-text">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
} 