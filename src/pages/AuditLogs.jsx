import React, { useState, useEffect } from 'react';
import './AuditLogs.css';

const AuditLogs = () => {
  const [doctors] = useState([
    { id: 'DR001', name: 'Dr. Sarah Johnson', specialization: 'Endocrinologist', location: 'New York, NY', rating: 4.9, patients: 245 },
    { id: 'DR002', name: 'Dr. Michael Chen', specialization: 'Diabetologist', location: 'Los Angeles, CA', rating: 4.8, patients: 189 },
    { id: 'DR003', name: 'Dr. Emily Rodriguez', specialization: 'Internal Medicine', location: 'Chicago, IL', rating: 4.7, patients: 201 },
    { id: 'DR004', name: 'Dr. David Kumar', specialization: 'Endocrinologist', location: 'Houston, TX', rating: 4.9, patients: 167 },
    { id: 'DR005', name: 'Dr. Lisa Wang', specialization: 'Family Medicine', location: 'Phoenix, AZ', rating: 4.6, patients: 134 },
    { id: 'DR006', name: 'Dr. James Thompson', specialization: 'Diabetologist', location: 'Philadelphia, PA', rating: 4.8, patients: 198 },
  ]);

  const [patients] = useState([
    { id: 'P001', name: 'John Smith', age: 45, diabetesType: 'Type 2', lastVisit: '2025-01-10', status: 'Active', doctorAssigned: 'DR001' },
    { id: 'P002', name: 'Sarah Johnson', age: 38, diabetesType: 'Type 1', lastVisit: '2025-01-09', status: 'Pending Review', doctorAssigned: 'DR002' },
    { id: 'P003', name: 'Michael Davis', age: 52, diabetesType: 'Type 2', lastVisit: '2025-01-08', status: 'Completed', doctorAssigned: 'DR001' },
    { id: 'P004', name: 'Emily Wilson', age: 41, diabetesType: 'Type 1', lastVisit: '2025-01-07', status: 'Active', doctorAssigned: 'DR003' },
    { id: 'P005', name: 'Robert Brown', age: 48, diabetesType: 'Type 2', lastVisit: '2025-01-06', status: 'Pending Review', doctorAssigned: 'DR004' },
    { id: 'P006', name: 'Lisa Garcia', age: 35, diabetesType: 'Type 1', lastVisit: '2025-01-05', status: 'Active', doctorAssigned: 'DR002' },
    { id: 'P007', name: 'Daniel Martinez', age: 43, diabetesType: 'Type 2', lastVisit: '2025-01-04', status: 'Completed', doctorAssigned: 'DR005' },
    { id: 'P008', name: 'Jennifer Lee', age: 39, diabetesType: 'Type 1', lastVisit: '2025-01-03', status: 'Active', doctorAssigned: 'DR006' },
  ]);

  const [selectedView, setSelectedView] = useState('doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const data = selectedView === 'doctors' ? doctors : patients;
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (selectedView === 'doctors' && item.specialization.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (selectedView === 'patients' && item.diabetesType.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredData(filtered);
  }, [selectedView, searchTerm, doctors, patients]);

  const handleViewPatient = (patientId) => {
    alert(`Viewing details for patient: ${patientId}`);
  };

  const handleAssignDoctor = (patientId) => {
    alert(`Assigning doctor to patient: ${patientId}`);
  };

  const handleContactDoctor = (doctorId) => {
    alert(`Contacting doctor: ${doctorId}`);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending review': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unassigned';
  };

  return (
    <div className="audit-logs">
      <div className="audit-logs-container">
        <div className="audit-logs-header">
          <h1>Audit Logs</h1>
          <p>Complete list of all doctors specialized in diabetes and patient records sorted by Patient ID.</p>
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${selectedView === 'doctors' ? 'active' : ''}`}
            onClick={() => setSelectedView('doctors')}
          >
            Doctors List
          </button>
          <button
            className={`toggle-btn ${selectedView === 'patients' ? 'active' : ''}`}
            onClick={() => setSelectedView('patients')}
          >
            Patients List
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder={`Search ${selectedView}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="results-count">
            Showing {filteredData.length} {selectedView}
          </div>
        </div>

        {/* Doctors Table */}
        {selectedView === 'doctors' && (
          <div className="data-table-section">
            <h2>Diabetes Specialists</h2>
            <div className="data-table">
              <div className="table-header">
                <div className="table-cell">Doctor ID</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Specialization</div>
                <div className="table-cell">Location</div>
                <div className="table-cell">Rating</div>
                <div className="table-cell">Patients</div>
                <div className="table-cell">Actions</div>
              </div>
              
              {filteredData.map((doctor) => (
                <div key={doctor.id} className="table-row">
                  <div className="table-cell font-medium">{doctor.id}</div>
                  <div className="table-cell font-medium">{doctor.name}</div>
                  <div className="table-cell">{doctor.specialization}</div>
                  <div className="table-cell">{doctor.location}</div>
                  <div className="table-cell">
                    <div className="rating">
                      ⭐ {doctor.rating}
                    </div>
                  </div>
                  <div className="table-cell">{doctor.patients}</div>
                  <div className="table-cell">
                    <button
                      onClick={() => handleContactDoctor(doctor.id)}
                      className="action-btn contact-btn"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredData.length === 0 && (
              <div className="no-results">
                <p>No doctors found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Patients Table */}
        {selectedView === 'patients' && (
          <div className="data-table-section">
            <h2>Patient Records</h2>
            <div className="data-table">
              <div className="table-header">
                <div className="table-cell">Patient ID</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Age</div>
                <div className="table-cell">Diabetes Type</div>
                <div className="table-cell">Last Visit</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Assigned Doctor</div>
                <div className="table-cell">Actions</div>
              </div>
              
              {filteredData.map((patient) => (
                <div key={patient.id} className="table-row">
                  <div className="table-cell font-medium">{patient.id}</div>
                  <div className="table-cell font-medium">{patient.name}</div>
                  <div className="table-cell">{patient.age}</div>
                  <div className="table-cell">{patient.diabetesType}</div>
                  <div className="table-cell">{patient.lastVisit}</div>
                  <div className="table-cell">
                    <span className={`status ${getStatusClass(patient.status)}`}>
                      {patient.status}
                    </span>
                  </div>
                  <div className="table-cell doctor-name">
                    {getDoctorName(patient.doctorAssigned)}
                  </div>
                  <div className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewPatient(patient.id)}
                        className="action-btn view-btn"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleAssignDoctor(patient.id)}
                        className="action-btn assign-btn"
                        title="Assign Doctor"
                      >
                        👨‍⚕️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredData.length === 0 && (
              <div className="no-results">
                <p>No patients found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <h3>Total Doctors</h3>
            <p>{doctors.length} specialists</p>
          </div>
          <div className="stat-item">
            <h3>Total Patients</h3>
            <p>{patients.length} records</p>
          </div>
          <div className="stat-item">
            <h3>Active Cases</h3>
            <p>{patients.filter(p => p.status === 'Active').length} ongoing</p>
          </div>
          <div className="stat-item">
            <h3>Pending Reviews</h3>
            <p>{patients.filter(p => p.status === 'Pending Review').length} waiting</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
