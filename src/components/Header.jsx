import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo1 from '../assets/images/logo1.png';
import diasight from '../assets/images/diasight.png';
import './Header.css';

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [doctorSpecialization, setDoctorSpecialization] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch doctor info from localStorage
    const doc = localStorage.getItem('currentDoctor');
    if (doc) {
      const doctorData = JSON.parse(doc);
      setDoctorName(`Dr. ${doctorData.first_name} ${doctorData.last_name}`);
      setDoctorSpecialization(doctorData.specialization || 'General Practitioner');
    }
  }, []);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentDoctor');
    navigate('/', { replace: true });
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/dashboard" className="logo">
            <img src={logo1} alt="DiaSight Logo" className="logo-icon" />
            <img src={diasight} alt="DiaSight" className="logo-text" />
          </Link>
        </div>

        <nav className="header-nav">
          <div className="nav-links">
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
              <span className="profile-name">{doctorName || 'Dr. User'}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <strong>{doctorName || 'Dr. User'}</strong>
                    <span>{doctorSpecialization}</span>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile-settings" className="dropdown-item">
                    <span className="icon">👤</span>
                    Edit Profile
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
