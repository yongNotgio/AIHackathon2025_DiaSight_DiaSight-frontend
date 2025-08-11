import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DiaSight</h3>
            <p>AI-powered diabetes management platform for healthcare professionals.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/new-patient">New Patient</Link></li>
              <li><Link to="/audit-logs">Audit Logs</Link></li>
              <li><Link to="/profile">Profile Settings</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#about">About DiaSight</a></li>
              <li><a href="#how-it-works">How it Works</a></li>
              <li><a href="#contact">Contact US</a></li>
              <li><a href="#help">Help Center</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms & Conditions</a></li>
              <li><a href="#compliance">HIPAA Compliance</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 DiaSight. All rights reserved.</p>
            <div className="footer-social">
              <p>Follow us for updates and healthcare insights</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// This component is no longer used and can be deleted.
// export default Footer;
