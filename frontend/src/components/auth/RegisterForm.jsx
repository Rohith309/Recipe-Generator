import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import './Auth.css';

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      alert("Passwords don't match");
      return;
    }
    
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
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
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              id="password2"
              name="password2"
              type="password"
              required
              value={formData.password2}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}