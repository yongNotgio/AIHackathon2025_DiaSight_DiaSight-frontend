import React, { useState } from 'react';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Dr. John',
    lastName: 'Smith',
    email: 'john.smith@diasight.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Endocrinologist',
    license: 'MD12345678',
    hospital: 'City General Hospital',
    experience: '15 years',
    bio: 'Experienced endocrinologist specializing in diabetes management and treatment.'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    newPatients: true,
    appointmentReminders: true,
    systemUpdates: false,
    weeklyReports: true
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Notification preferences updated!');
    }, 1000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // Handle logout logic
      window.location.href = '/login';
    }
  };

  return (
    <div className="profile-settings">
      <div className="profile-settings-container">
        <div className="profile-settings-header">
          <h1>Profile & Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="settings-layout">
          {/* Sidebar Navigation */}
          <div className="settings-sidebar">
            <div className="profile-summary">
              <div className="profile-avatar-large">
                <span>DS</span>
              </div>
              <h3>{profileData.firstName} {profileData.lastName}</h3>
              <p>{profileData.specialization}</p>
            </div>
            
            <nav className="settings-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <span className="nav-icon">👤</span>
                Edit Profile
              </button>
              <button
                className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
              >
                <span className="nav-icon">🔒</span>
                Change Password
              </button>
              <button
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <span className="nav-icon">🔔</span>
                Notifications Preferences
              </button>
              <div className="nav-divider"></div>
              <button
                className="nav-item logout-item"
                onClick={handleLogout}
              >
                <span className="nav-icon">🚪</span>
                Log Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="settings-content">
            {/* Edit Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-panel">
                <div className="panel-header">
                  <h2>Edit Profile</h2>
                  <p>Update your professional information and contact details</p>
                </div>
                
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="specialization">Specialization</label>
                      <select
                        id="specialization"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleProfileChange}
                        required
                      >
                        <option value="">Select Specialization</option>
                        <option value="Endocrinologist">Endocrinologist</option>
                        <option value="Diabetologist">Diabetologist</option>
                        <option value="Internal Medicine">Internal Medicine</option>
                        <option value="Family Medicine">Family Medicine</option>
                        <option value="General Practice">General Practice</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="license">Medical License</label>
                      <input
                        type="text"
                        id="license"
                        name="license"
                        value={profileData.license}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="hospital">Hospital/Clinic</label>
                      <input
                        type="text"
                        id="hospital"
                        name="hospital"
                        value={profileData.hospital}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="experience">Years of Experience</label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={profileData.experience}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label htmlFor="bio">Professional Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows="4"
                        placeholder="Brief description of your expertise and experience"
                      />
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password Tab */}
            {activeTab === 'password' && (
              <div className="settings-panel">
                <div className="panel-header">
                  <h2>Change Password</h2>
                  <p>Update your account password for security</p>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="password-requirements">
                    <h4>Password Requirements:</h4>
                    <ul>
                      <li>At least 8 characters long</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Include at least one number</li>
                      <li>Include at least one special character</li>
                    </ul>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Preferences Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-panel">
                <div className="panel-header">
                  <h2>Notification Preferences</h2>
                  <p>Choose how you want to receive notifications and alerts</p>
                </div>
                
                <form onSubmit={handleNotificationSubmit} className="notifications-form">
                  <div className="notification-section">
                    <h3>Communication Preferences</h3>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Email Alerts</h4>
                        <p>Receive important notifications via email</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailAlerts}
                          onChange={() => handleNotificationChange('emailAlerts')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>SMS Alerts</h4>
                        <p>Receive urgent alerts via text message</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.smsAlerts}
                          onChange={() => handleNotificationChange('smsAlerts')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="notification-section">
                    <h3>Patient & Appointment Notifications</h3>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>New Patient Assignments</h4>
                        <p>Get notified when new patients are assigned to you</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.newPatients}
                          onChange={() => handleNotificationChange('newPatients')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Appointment Reminders</h4>
                        <p>Receive reminders for upcoming appointments</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.appointmentReminders}
                          onChange={() => handleNotificationChange('appointmentReminders')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="notification-section">
                    <h3>System & Reports</h3>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>System Updates</h4>
                        <p>Notifications about platform updates and maintenance</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.systemUpdates}
                          onChange={() => handleNotificationChange('systemUpdates')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="notification-item">
                      <div className="notification-info">
                        <h4>Weekly Reports</h4>
                        <p>Receive weekly summary of your patient activities</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReports}
                          onChange={() => handleNotificationChange('weeklyReports')}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
