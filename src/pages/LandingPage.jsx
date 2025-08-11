import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <h1>DiaSight</h1>
          </div>
          <nav className="landing-nav">
            <a href="#about">About DiaSight</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#contact">Contact US</a>
            <Link to="/login" className="login-btn">Login</Link>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h2>AI-Powered Diabetes Management Platform</h2>
              <p>Empowering healthcare professionals with intelligent tools for diabetes care and patient assessment.</p>
              <p className="specialization">Specialization of Doctors (all kinds for diabetes)</p>
              <Link to="/login" className="cta-button">Get Started</Link>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="container">
            <h3>About DiaSight</h3>
            <p>DiaSight is a comprehensive platform designed to assist healthcare professionals in managing diabetes patients through advanced AI-powered assessment tools and comprehensive patient tracking.</p>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works-section">
          <div className="container">
            <h3>How it Works</h3>
            <div className="features-grid">
              <div className="feature">
                <h4>Patient Assessment</h4>
                <p>Comprehensive questionnaires and medical history collection</p>
              </div>
              <div className="feature">
                <h4>AI Analysis</h4>
                <p>Advanced algorithms analyze patient data for insights</p>
              </div>
              <div className="feature">
                <h4>Doctor Matching</h4>
                <p>Connect patients with specialized diabetes doctors</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container">
            <h3>Contact US</h3>
            <p>Get in touch with our team for more information about DiaSight.</p>
            <div className="contact-info">
              <p>Email: support@diasight.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms & Conditions</a>
            </div>
            <p>&copy; 2025 DiaSight. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
