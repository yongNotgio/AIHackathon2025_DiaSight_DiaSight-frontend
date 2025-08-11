import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
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
    
    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <Link to="/" className="back-to-home">← Back to Home</Link>
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-links">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="login-info">
            <p>Welcome to DiaSight - Your AI-powered diabetes management platform</p>
            <p>Please login to access your dashboard and patient management tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
