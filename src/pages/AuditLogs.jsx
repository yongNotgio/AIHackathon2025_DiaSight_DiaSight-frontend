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
    const filtered = auditLogs.filter(log => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search in basic fields
      const basicMatch = 
        log.doctorName.toLowerCase().includes(searchLower) ||
        log.riskClassification.toLowerCase().includes(searchLower) ||
        log.auditId.toLowerCase().includes(searchLower);
      
      // Search in lab data
      const labData = log.labData || log.allLabInputs || {};
      const labMatch = Object.values(labData).some(value => 
        value && value.toString().toLowerCase().includes(searchLower)
      );
      
      return basicMatch || labMatch;
    });
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

  // Function to get lab value safely
  const getLabValue = (allLabInputs, labData, key) => {
    const labInfo = labData && Object.keys(labData).length > 0 ? labData : allLabInputs;
    if (!labInfo || Object.keys(labInfo).length === 0) {
      return '-';
    }
    const value = labInfo[key];
    return value !== undefined && value !== null && value !== '' ? value : '-';
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
          <div className="data-table wide-table">
            <div className="table-header">
              <div className="table-cell">Date</div>
              <div className="table-cell">Doctor</div>
              <div className="table-cell">Age</div>
              <div className="table-cell">Sex</div>
              <div className="table-cell">SBP</div>
              <div className="table-cell">DBP</div>
              <div className="table-cell">HBP</div>
              <div className="table-cell">Duration</div>
              <div className="table-cell">HbA1c</div>
              <div className="table-cell">Cholesterol</div>
              <div className="table-cell">LDL</div>
              <div className="table-cell">HDL</div>
              <div className="table-cell">Triglycerides</div>
              <div className="table-cell">Urea</div>
              <div className="table-cell">BUN</div>
              <div className="table-cell">Uric</div>
              <div className="table-cell">eGFR</div>
              <div className="table-cell">UCR</div>
              <div className="table-cell">ALT</div>
              <div className="table-cell">AST</div>
              <div className="table-cell">Risk</div>
            </div>
            
            {filteredData.map((log) => (
              <div key={log.auditId} className="table-row">
                <div className="table-cell">{log.dateCreated}</div>
                <div className="table-cell font-medium">{log.doctorName}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'age')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'sex')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'sbp')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'dbp')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'hbp')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'duration')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'hba1c')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'cholesterol')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'ldl')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'hdl')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'triglycerides')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'urea')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'bun')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'uric')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'egfr')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'ucr')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'alt')}</div>
                <div className="table-cell">{getLabValue(log.allLabInputs, log.labData, 'ast')}</div>
                <div className="table-cell">
                  <span className={`status ${getRiskClass(log.riskClassification)}`}>
                    {log.riskClassification}
                  </span>
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
