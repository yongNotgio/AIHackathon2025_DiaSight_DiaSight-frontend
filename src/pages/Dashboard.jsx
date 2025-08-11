
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    totalPatients: 245,
    newAssessments: 12,
    pendingReviews: 8,
    completedToday: 15
  });

  const [recentPatients] = useState([
    { id: 'P001', name: 'John Smith', age: 45, lastVisit: '2025-01-10', status: 'Active' },
    { id: 'P002', name: 'Sarah Johnson', age: 38, lastVisit: '2025-01-09', status: 'Pending Review' },
    { id: 'P003', name: 'Michael Davis', age: 52, lastVisit: '2025-01-08', status: 'Completed' },
    { id: 'P004', name: 'Emily Wilson', age: 41, lastVisit: '2025-01-07', status: 'Active' },
    { id: 'P005', name: 'Robert Brown', age: 48, lastVisit: '2025-01-06', status: 'Pending Review' }
  ]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending review': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  const [doctorName, setDoctorName] = useState('');
  useEffect(() => {
    const doc = localStorage.getItem('currentDoctor');
    if (doc) {
      const d = JSON.parse(doc);
      setDoctorName(`${d.first_name} ${d.last_name}`);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentDoctor');
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back{doctorName ? `, Dr. ${doctorName}` : ''}. Here's your patient overview for today.</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalPatients}</h3>
              <p>Total Patients</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{stats.newAssessments}</h3>
              <p>New Assessments</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pendingReviews}</h3>
              <p>Pending Reviews</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completedToday}</h3>
              <p>Completed Today</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/new-assessment" className="action-btn primary">
              <div className="btn-icon">➕</div>
              <div className="btn-content">
                <h3>New Patient Assessment</h3>
                <p>Start a new patient evaluation</p>
              </div>
            </Link>
            
            <Link to="/audit-logs" className="action-btn secondary">
              <div className="btn-icon">📊</div>
              <div className="btn-content">
                <h3>Audit Logs</h3>
                <p>View all patient records and activities</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="recent-patients">
          <div className="section-header">
            <h2>Recent Patients</h2>
            <Link to="/audit-logs" className="view-all-link">View All</Link>
          </div>
          
          <div className="patients-table">
            <div className="table-header">
              <div className="table-cell">Patient ID</div>
              <div className="table-cell">Name</div>
              <div className="table-cell">Age</div>
              <div className="table-cell">Last Visit</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {recentPatients.map((patient) => (
              <div key={patient.id} className="table-row">
                <div className="table-cell">{patient.id}</div>
                <div className="table-cell font-medium">{patient.name}</div>
                <div className="table-cell">{patient.age}</div>
                <div className="table-cell">{patient.lastVisit}</div>
                <div className="table-cell">
                  <span className={`status ${getStatusClass(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="table-cell">
                  <button className="action-icon-btn" title="View Details">👁️</button>
                  <button className="action-icon-btn" title="Edit">✏️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
