import { useState } from 'react';
import api from '../utils/axios';

export default function TestConnection() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const testBackend = async () => {
    try {
      setStatus('Testing connection...');
      setError('');

      // Test registration
      const registerResponse = await api.post('/api/register/', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123',
        password2: 'testpass123'
      });
      console.log('Registration response:', registerResponse.data);

      // Test login
      const loginResponse = await api.post('/api/token/', {
        username: 'testuser',
        password: 'testpass123'
      });
      console.log('Login response:', loginResponse.data);

      // Set token
      const token = loginResponse.data.access;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Test recipe creation
      const recipeResponse = await api.post('/api/recipes/', {
        title: 'Test Recipe',
        ingredients: 'Test ingredients',
        instructions: 'Test instructions',
        cooking_time: 30,
        servings: 4
      });
      console.log('Recipe creation response:', recipeResponse.data);

      setStatus('All tests passed successfully!');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || err.message);
      setStatus('Tests failed');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={testBackend}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Backend Connection
      </button>
      {status && (
        <p className="mt-4 text-gray-700">{status}</p>
      )}
      {error && (
        <p className="mt-4 text-red-500">{error}</p>
      )}
    </div>
  );
} 