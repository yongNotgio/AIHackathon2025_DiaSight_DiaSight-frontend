
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import medicalTeamImage from '../assets/images/medical-team.png';
import logo1 from '../assets/images/logo1.png';
import diasight from '../assets/images/diasight.png';
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
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="logo-section">
          <div className="logo">
            <img src={logo1} alt="DiaSight Logo" className="logo-icon" />
            <img src={diasight} alt="DiaSight" className="logo-text" />
          </div>
        </div>

        <div className="login-header">
          <h2>Login to Your DiaSight Account</h2>
          <p>Please enter your account details to sign in to our platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email or ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
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

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      <div className="medical-illustration">
        <img src={medicalTeamImage} alt="Medical team illustration" className="medical-img" />
      </div>
    </div>
  );
};

export default LoginPage;
