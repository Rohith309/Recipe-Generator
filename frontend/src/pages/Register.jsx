import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: ''
  });
  const { isLoading, error } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      return;
    }
    const result = await dispatch(register(formData));
    if (!result.error) {
      navigate('/login');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="features-section">
      <div className="features-header">
        <h2>Create Account</h2>
        <p>Get started with RecipeAI</p>
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
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-primary">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        {error && <p className="error">{error}</p>}
        <p>
          Already have an account? <Link to="/login" className="btn-text">Sign in</Link>
        </p>
      </form>
    </div>
  );
} 