import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import NewPatientAssessment from './pages/NewPatientAssessment';
import AuditLogs from './pages/AuditLogs';
import ProfileSettings from './pages/ProfileSettings';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={
            <>
              <Header />
              <Dashboard />
              <Footer />
            </>
          } />
          <Route path="/new-patient" element={
            <>
              <Header />
              <NewPatientAssessment />
              <Footer />
            </>
          } />
          <Route path="/audit-logs" element={
            <>
              <Header />
              <AuditLogs />
              <Footer />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Header />
              <ProfileSettings />
              <Footer />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
