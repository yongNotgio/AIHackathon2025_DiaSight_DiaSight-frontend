import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Handle logout logic here
    window.location.href = '/login';
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            <h1>DiaSight</h1>
          </Link>
        </div>

        <nav className="header-nav">
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/new-patient" className="nav-link">New Patient</Link>
            <Link to="/audit-logs" className="nav-link">Audit Logs</Link>
          </div>
        </nav>

        <div className="header-right">
          <div className="profile-section">
            <button 
              className="profile-button"
              onClick={toggleProfileMenu}
              aria-label="Profile menu"
            >
              <div className="profile-avatar">
                <span>DR</span>
              </div>
              <span className="profile-name">Dr. Smith</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <strong>Dr. Smith</strong>
                    <span>smith@diasight.com</span>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <span className="icon">👤</span>
                    Edit Profile
                  </Link>
                  <Link to="/profile" className="dropdown-item">
                    <span className="icon">🔒</span>
                    Change Password
                  </Link>
                  <Link to="/profile" className="dropdown-item">
                    <span className="icon">🔔</span>
                    Notifications Preferences
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <span className="icon">🚪</span>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
