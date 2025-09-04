import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuditLogs.css';
import { fetchAuditLogs } from '../queries/auditLabsQuery';
import Header from '../components/Header';

const AuditLogs = () => {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState('all'); // Changed from searchTerm
  const [filteredData, setFilteredData] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Fetch audit logs on component mount
  useEffect(() => {
    const loadAuditLogs = async () => {
      setLoading(true);
      
      // Get current doctor from localStorage
      const currentDoctorData = localStorage.getItem('currentDoctor');
      if (!currentDoctorData) {
        setError('No doctor logged in');
        setLoading(false);
        return;
      }
      
      const currentDoctor = JSON.parse(currentDoctorData);
      const currentDoctorId = currentDoctor.id;
      
      const { data, error } = await fetchAuditLogs();
      
      if (error) {
        setError(error);
      } else {
        // Filter audit logs to only show entries for the current doctor
        const doctorLogs = data.filter(log => 
          log.doctorId === currentDoctorId || 
          log.doctor_id === currentDoctorId
        );
        setAuditLogs(doctorLogs);
      }
      setLoading(false);
    };

    loadAuditLogs();
  }, []);

  // Filter audit logs based on risk classification
  useEffect(() => {
    let filtered = auditLogs;
    
    if (filterValue !== 'all') {
      filtered = auditLogs.filter(log => {
        const riskClass = (log.riskClassification || '').toLowerCase().trim();
        return riskClass === filterValue.toLowerCase();
      });
    }
    
    setFilteredData(filtered);
    
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [filterValue, auditLogs]);

  const handleViewDetails = (labId) => {
    alert(`Viewing lab details for: ${labId}`);
  };

  const getRiskClass = (riskClassification) => {
    switch (riskClassification.toLowerCase()) {
      case 'no dr': return 'status-no-dr';
      case 'mild dr': return 'status-mild-dr';
      case 'severe dr': return 'status-severe-dr';
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

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="audit-logs">
        <Header />
        <div className="audit-logs-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading audit logs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="audit-logs">
        <Header />
        <div className="audit-logs-container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>Error loading audit logs: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="audit-logs">
      <Header />
      <div className="audit-logs-container">
        {/* Header Section */}
        <div className="audit-logs-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Audit Logs</h1>
              <p>Complete audit trail of your lab entries showing patient data and risk classifications.</p>
            </div>
            <div className="header-actions">
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-bar">
            <label htmlFor="risk-filter" className="filter-label">
              Filter by Risk Classification:
            </label>
            <select
              id="risk-filter"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Risk Classifications</option>
              <option value="no dr">No DR</option>
              <option value="mild dr">Mild DR</option>
              <option value="severe dr">Severe DR</option>
            </select>
            <span className="filter-icon">🔽</span>
          </div>
          <div className="results-count">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} audit entries
            {filterValue !== 'all' && (
              <span className="filter-indicator">
                (filtered by {filterValue.toUpperCase()})
              </span>
            )}
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="data-table-section">
          <div className="table-header-section">
            <h2>Lab Entry Audit Trail</h2>
          </div>
          <div className="data-table-wrapper">
            <div className="data-table">
              <div className="table-header">
                <div className="table-cell">Date</div>
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
              
              {currentData.map((log) => (
                <div key={log.auditId} className="table-row">
                  <div className="table-cell">{log.dateCreated}</div>
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
          </div>
          
          {filteredData.length === 0 && !loading && (
            <div className="no-results">
              <div className="no-results-icon">📋</div>
              <p>
                {filterValue === 'all' 
                  ? 'No audit logs found.' 
                  : `No audit logs found for ${filterValue.toUpperCase()} risk classification.`
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredData.length > 0 && totalPages > 1 && (
            <div className="pagination-section">
              <div className="pagination-info">
                Page {currentPage} of {totalPages}
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn prev-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                
                <div className="pagination-numbers">
                  {getPageNumbers().map((pageNumber, index) => (
                    <button
                      key={index}
                      className={`pagination-number ${
                        pageNumber === currentPage ? 'active' : ''
                      } ${pageNumber === '...' ? 'dots' : ''}`}
                      onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                      disabled={pageNumber === '...'}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-btn next-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{auditLogs.length}</h3>
              <p>Total Entries</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon no-dr">✅</div>
            <div className="stat-content">
              <h3>{auditLogs.filter(log => (log.riskClassification || '').toLowerCase().trim() === 'no dr').length}</h3>
              <p>No DR Cases</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon mild-dr">⚠️</div>
            <div className="stat-content">
              <h3>{auditLogs.filter(log => (log.riskClassification || '').toLowerCase().trim() === 'mild dr').length}</h3>
              <p>Mild DR Cases</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon severe-dr">🚨</div>
            <div className="stat-content">
              <h3>{auditLogs.filter(log => (log.riskClassification || '').toLowerCase().trim() === 'severe dr').length}</h3>
              <p>Severe DR Cases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;