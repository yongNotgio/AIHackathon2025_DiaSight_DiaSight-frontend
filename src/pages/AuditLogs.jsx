import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditLogs.css';
import { fetchAuditLogs } from '../queries/auditLabsQuery';

const AuditLogs = () => {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch audit logs on component mount
  useEffect(() => {
    const loadAuditLogs = async () => {
      setLoading(true);
      const { data, error } = await fetchAuditLogs();
      
      if (error) {
        setError(error);
      } else {
        setAuditLogs(data);
      }
      setLoading(false);
    };

    loadAuditLogs();
  }, []);

  // Filter audit logs based on search term
  useEffect(() => {
    const filtered = auditLogs.filter(log =>
      log.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.labId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.riskClassification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.auditId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, auditLogs]);

  const handleViewDetails = (labId) => {
    alert(`Viewing lab details for: ${labId}`);
  };

  const getRiskClass = (riskClassification) => {
    switch (riskClassification.toLowerCase()) {
      case 'low risk': return 'status-active';
      case 'moderate risk': return 'status-pending';
      case 'high risk': return 'status-completed';
      default: return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="audit-logs">
        <div className="audit-logs-container">
          <div className="loading">Loading audit logs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-logs">
        <div className="audit-logs-container">
          <div className="error">Error loading audit logs: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-logs">
      <div className="audit-logs-container">
        <div className="audit-logs-header">
          <button 
            className="back-button"
            onClick={() => navigate('/dashboard')}
            title="Back to Dashboard"
          >
            ← Back to Dashboard
          </button>
          <h1>Audit Logs</h1>
          <p>Complete audit trail of all lab entries showing doctor details, lab data, and risk classifications.</p>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="results-count">
            Showing {filteredData.length} audit entries
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="data-table-section">
          <h2>Lab Entry Audit Trail</h2>
          <div className="data-table">
            <div className="table-header">
              <div className="table-cell">Audit ID</div>
              <div className="table-cell">Date Created</div>
              <div className="table-cell">Doctor</div>
              <div className="table-cell">Lab ID</div>
              <div className="table-cell">Risk Classification</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {filteredData.map((log) => (
              <div key={log.auditId} className="table-row">
                <div className="table-cell font-medium">{log.auditId}</div>
                <div className="table-cell">{log.dateCreated}</div>
                <div className="table-cell font-medium">{log.doctorName}</div>
                <div className="table-cell">{log.labId}</div>
                <div className="table-cell">
                  <span className={`status ${getRiskClass(log.riskClassification)}`}>
                    {log.riskClassification}
                  </span>
                </div>
                <div className="table-cell">
                  <button
                    onClick={() => handleViewDetails(log.labId)}
                    className="action-btn view-btn"
                    title="View Lab Details"
                  >
                    �️
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredData.length === 0 && !loading && (
            <div className="no-results">
              <p>No audit logs found matching your search.</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <h3>Total Entries</h3>
            <p>{auditLogs.length} logs</p>
          </div>
          <div className="stat-item">
            <h3>Low Risk</h3>
            <p>{auditLogs.filter(log => log.riskClassification.toLowerCase().includes('low')).length} cases</p>
          </div>
          <div className="stat-item">
            <h3>Moderate Risk</h3>
            <p>{auditLogs.filter(log => log.riskClassification.toLowerCase().includes('moderate')).length} cases</p>
          </div>
          <div className="stat-item">
            <h3>High Risk</h3>
            <p>{auditLogs.filter(log => log.riskClassification.toLowerCase().includes('high')).length} cases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
