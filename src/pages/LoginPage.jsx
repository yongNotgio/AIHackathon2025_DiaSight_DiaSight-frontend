
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Query Supabase doctors table for matching email and password
    const { data, error: supaError } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', formData.email)
      .eq('password', formData.password)
      .single();
    setLoading(false);
    if (supaError || !data) {
      setError('Invalid email or password');
    } else {
      localStorage.setItem('currentDoctor', JSON.stringify(data));
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h1>DiaSight</h1>
            <h2>Login / Authentication</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-info">
            <p>Welcome to DiaSight - Your AI-powered diabetes management platform</p>
            <p>Please login to access your dashboard and patient management tools.</p>
            <p style={{fontSize: '0.9em', color: '#888'}}>Demo: dr.john@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
