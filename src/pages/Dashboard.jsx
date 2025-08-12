import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLabs: 0,
    todaysLabs: 0
  });

  const [loading, setLoading] = useState(true);

  // Fetch lab statistics from Supabase
  const fetchLabStats = async () => {
    try {
      // Get total labs count
      const { count: totalCount, error: totalError } = await supabase
        .from('labs')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        console.error('Error fetching total labs:', totalError);
        return;
      }

      // Get today's labs count - this resets every day at midnight
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const { count: todayCount, error: todayError } = await supabase
        .from('labs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString())
        .lt('created_at', todayEnd.toISOString());

      if (todayError) {
        console.error('Error fetching today\'s labs:', todayError);
        return;
      }

      // Update stats with real data
      setStats({
        totalLabs: totalCount || 0,
        todaysLabs: todayCount || 0
      });

    } catch (error) {
      console.error('Error in fetchLabStats:', error);
    } finally {
      setLoading(false);
    }
  };


  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending review': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  const [doctorName, setDoctorName] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentDoctor');
    navigate('/', { replace: true });
  };
  
  useEffect(() => {
    // Fetch doctor name from localStorage
    const doc = localStorage.getItem('currentDoctor');
    if (doc) {
      const d = JSON.parse(doc);
      setDoctorName(`${d.first_name} ${d.last_name}`);
    }

    // Fetch lab statistics
    fetchLabStats();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Dashboard</h1>
              <p>Welcome back{doctorName ? `, Dr. ${doctorName}` : ''}. Here's your lab overview for today.</p>
            </div>
            <div className="header-right">
              <button onClick={handleLogout} className="logout-btn">
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🧪</div>
            <div className="stat-content">
              <h3>{stats.totalLabs}</h3>
              <p>Total Labs</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">�</div>
            <div className="stat-content">
              <h3>{stats.todaysLabs}</h3>
              <p>Today's Labs</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/new-patient-assessment" className="action-btn primary">
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
      </div>
    </div>
  );
};

export default Dashboard;
