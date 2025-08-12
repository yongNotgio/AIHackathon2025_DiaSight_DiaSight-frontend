import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLabs: 0,
    todaysLabs: 0
  });

  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [doctorName, setDoctorName] = useState('');

  // Fetch lab statistics from Supabase filtered by current doctor
  const fetchLabStats = async () => {
    try {
      // Get current doctor info from localStorage
      const doc = localStorage.getItem('currentDoctor');
      if (!doc) {
        console.error('No current doctor found in localStorage');
        setLoading(false);
        return;
      }
      
      const doctor = JSON.parse(doc);
      const doctorId = doctor.id;

      // Get total labs count for this doctor
      const { count: totalCount, error: totalError } = await supabase
        .from('labs')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', doctorId);

      if (totalError) {
        console.error('Error fetching total labs:', totalError);
        return;
      }

      // Get today's labs count for this doctor - this resets every day at midnight
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const { count: todayCount, error: todayError } = await supabase
        .from('labs')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', doctorId)
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

  // Fetch monthly assessment data for the current doctor
  const fetchMonthlyData = async (doctorId) => {
    try {
      const currentYear = new Date().getFullYear();
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const monthlyStats = [];

      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = new Date(currentYear, month + 1, 0, 23, 59, 59);

        const { count, error } = await supabase
          .from('labs')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', doctorId)
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        if (error) {
          console.error(`Error fetching data for ${months[month]}:`, error);
          monthlyStats.push(0);
        } else {
          monthlyStats.push(count || 0);
        }
      }

      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error('Error in fetchMonthlyData:', error);
      setMonthlyData(Array(12).fill(0));
    }
  };

  // Fetch risk classification data for the current doctor
  const fetchRiskData = async (doctorId) => {
    try {
      const { data, error } = await supabase
        .from('risk_classification')
        .select(`
          risk_class,
          labs!inner(created_by)
        `)
        .eq('labs.created_by', doctorId)
        .not('risk_class', 'is', null);

      if (error) {
        console.error('Error fetching risk classification data:', error);
        setRiskData([0, 0, 0]);
        return;
      }

      // Count risk classifications
      const riskCounts = { 'No DR': 0, 'Mild DR': 0, 'Severe DR': 0 };
      
      data.forEach(item => {
        const riskClass = item.risk_class;
        if (riskClass && riskCounts.hasOwnProperty(riskClass)) {
          riskCounts[riskClass]++;
        }
      });

      setRiskData([riskCounts['No DR'], riskCounts['Mild DR'], riskCounts['Severe DR']]);
    } catch (error) {
      console.error('Error in fetchRiskData:', error);
      setRiskData([0, 0, 0]);
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
  
  useEffect(() => {
    // Fetch doctor name from localStorage
    const doc = localStorage.getItem('currentDoctor');
    if (doc) {
      const d = JSON.parse(doc);
      setDoctorName(`${d.first_name} ${d.last_name}`);
      
      // Fetch monthly data for this doctor
      fetchMonthlyData(d.id);
      
      // Fetch risk classification data for this doctor
      fetchRiskData(d.id);
    }

    // Fetch lab statistics
    fetchLabStats();
  }, []);

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Dashboard</h1>
              <p>Welcome back{doctorName ? `, Dr. ${doctorName}` : ''}. Here's your lab overview for today.</p>
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
            <div className="stat-icon">🏥</div>
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

        {/* Charts Section */}
        <div className="charts-section">
          <div className="section-header">
            <h2>Analytics Dashboard - {new Date().getFullYear()}</h2>
          </div>
          <div className="charts-container">
            {/* Monthly Assessments Bar Chart */}
            <div className="chart-item">
              <h3>Monthly Assessments</h3>
              <div className="chart-wrapper">
                <Bar
                  data={{
                    labels: [
                      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ],
                    datasets: [
                      {
                        label: 'New Assessments',
                        data: monthlyData,
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: `Assessments by ${doctorName || 'Current Doctor'}`,
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                        title: {
                          display: true,
                          text: 'Number of Assessments'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Months'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Risk Classification Pie Chart */}
            <div className="chart-item">
              <h3>Risk Classification Distribution</h3>
              <div className="chart-wrapper">
                <Pie
                  data={{
                    labels: ['No DR', 'Mild DR', 'Severe DR'],
                    datasets: [
                      {
                        label: 'Risk Classifications',
                        data: riskData,
                        backgroundColor: [
                          'rgba(75, 192, 192, 0.8)',   // No DR - Green
                          'rgba(255, 206, 86, 0.8)',   // Mild DR - Yellow
                          'rgba(255, 99, 132, 0.8)',   // Severe DR - Red
                        ],
                        borderColor: [
                          'rgba(75, 192, 192, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 2,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: `Risk Analysis by ${doctorName || 'Current Doctor'}`,
                        font: {
                          size: 14,
                          weight: 'bold'
                        }
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
