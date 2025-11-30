import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NewPatientAssessment from './pages/NewPatientAssessment';
import AuditLogs from './pages/AuditLogs';
import DiabeticRetinopathy from './pages/DiabeticRetinopathy';

function PrivateRoute({ children }) {
  const doctor = localStorage.getItem('currentDoctor');
  const location = useLocation();
  if (!doctor) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [doctor, setDoctor] = useState(localStorage.getItem('currentDoctor'));

  useEffect(() => {
    const onStorage = () => {
      setDoctor(localStorage.getItem('currentDoctor'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Listen for logout from Dashboard
  useEffect(() => {
    const origRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
      origRemoveItem.apply(this, arguments);
      if (key === 'currentDoctor') {
        setDoctor(null);
      }
    };
    return () => {
      localStorage.removeItem = origRemoveItem;
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={doctor ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/diabetic-retinopathy" element={<DiabeticRetinopathy />} />
          <Route path="/new-patient-assessment" element={
            <PrivateRoute>
              <NewPatientAssessment />
            </PrivateRoute>
          } />
          <Route path="/audit-logs" element={
            <PrivateRoute>
              <AuditLogs />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
