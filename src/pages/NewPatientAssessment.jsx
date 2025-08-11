import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPatientAssessment.css';

const NewPatientAssessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [assessmentData, setAssessmentData] = useState({
    diabetesType: '',
    diagnosisDate: '',
    currentMedications: '',
    bloodSugarLevels: '',
    hba1c: '',
    symptoms: [],
    lifestyle: '',
    familyHistory: ''
  });

  const [medicalFiles, setMedicalFiles] = useState([]);

  const handlePatientInfoChange = (e) => {
    setPatientInfo({
      ...patientInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleAssessmentChange = (e) => {
    setAssessmentData({
      ...assessmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleSymptomsChange = (symptom) => {
    const updatedSymptoms = assessmentData.symptoms.includes(symptom)
      ? assessmentData.symptoms.filter(s => s !== symptom)
      : [...assessmentData.symptoms, symptom];
    
    setAssessmentData({
      ...assessmentData,
      symptoms: updatedSymptoms
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedicalFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setMedicalFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      alert('Patient assessment submitted successfully!');
      navigate('/dashboard');
    }, 2000);
  };

  const symptoms = [
    'Frequent urination',
    'Excessive thirst',
    'Unexplained weight loss',
    'Fatigue',
    'Blurred vision',
    'Slow-healing sores',
    'Frequent infections',
    'Numbness in hands/feet'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Patient Information Form</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={patientInfo.firstName}
                  onChange={handlePatientInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={patientInfo.lastName}
                  onChange={handlePatientInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={patientInfo.age}
                  onChange={handlePatientInfoChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={patientInfo.gender}
                  onChange={handlePatientInfoChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={patientInfo.email}
                  onChange={handlePatientInfoChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={patientInfo.phone}
                  onChange={handlePatientInfoChange}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={patientInfo.address}
                  onChange={handlePatientInfoChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact Name</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={patientInfo.emergencyContact}
                  onChange={handlePatientInfoChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={patientInfo.emergencyPhone}
                  onChange={handlePatientInfoChange}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Assessment Questions</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="diabetesType">Type of Diabetes</label>
                <select
                  id="diabetesType"
                  name="diabetesType"
                  value={assessmentData.diabetesType}
                  onChange={handleAssessmentChange}
                >
                  <option value="">Select Type</option>
                  <option value="type1">Type 1</option>
                  <option value="type2">Type 2</option>
                  <option value="gestational">Gestational</option>
                  <option value="prediabetes">Pre-diabetes</option>
                  <option value="unknown">Unknown/Suspected</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="diagnosisDate">Date of Diagnosis</label>
                <input
                  type="date"
                  id="diagnosisDate"
                  name="diagnosisDate"
                  value={assessmentData.diagnosisDate}
                  onChange={handleAssessmentChange}
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="currentMedications">Current Medications</label>
                <textarea
                  id="currentMedications"
                  name="currentMedications"
                  value={assessmentData.currentMedications}
                  onChange={handleAssessmentChange}
                  rows="3"
                  placeholder="List all current medications and dosages"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bloodSugarLevels">Recent Blood Sugar Levels</label>
                <input
                  type="text"
                  id="bloodSugarLevels"
                  name="bloodSugarLevels"
                  value={assessmentData.bloodSugarLevels}
                  onChange={handleAssessmentChange}
                  placeholder="e.g., 150 mg/dL"
                />
              </div>
              <div className="form-group">
                <label htmlFor="hba1c">HbA1c Level</label>
                <input
                  type="text"
                  id="hba1c"
                  name="hba1c"
                  value={assessmentData.hba1c}
                  onChange={handleAssessmentChange}
                  placeholder="e.g., 7.5%"
                />
              </div>
              <div className="form-group full-width">
                <label>Current Symptoms (Check all that apply)</label>
                <div className="symptoms-grid">
                  {symptoms.map((symptom) => (
                    <label key={symptom} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={assessmentData.symptoms.includes(symptom)}
                        onChange={() => handleSymptomsChange(symptom)}
                      />
                      {symptom}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="familyHistory">Family History of Diabetes</label>
                <textarea
                  id="familyHistory"
                  name="familyHistory"
                  value={assessmentData.familyHistory}
                  onChange={handleAssessmentChange}
                  rows="3"
                  placeholder="Describe family history of diabetes"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Upload Medical Images/Files</h3>
            <p>Upload any relevant medical documents, test results, or images for manual input analysis.</p>
            
            <div className="file-upload-section">
              <div className="file-upload-area">
                <input
                  type="file"
                  id="medicalFiles"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="file-input"
                />
                <label htmlFor="medicalFiles" className="file-upload-label">
                  <div className="upload-icon">📁</div>
                  <p>Click to upload files or drag and drop</p>
                  <p className="upload-hint">Supports PDF, Images, and Documents</p>
                </label>
              </div>
              
              {medicalFiles.length > 0 && (
                <div className="uploaded-files">
                  <h4>Uploaded Files:</h4>
                  {medicalFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="remove-file-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lifestyle">Lifestyle & Manual Inputs</label>
              <textarea
                id="lifestyle"
                name="lifestyle"
                value={assessmentData.lifestyle}
                onChange={handleAssessmentChange}
                rows="5"
                placeholder="Please provide additional information about:
- Diet and eating habits
- Exercise routine
- Sleep patterns
- Stress levels
- Any other relevant lifestyle factors"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Review & Submit</h3>
            <p>Please review all the information before submitting the assessment.</p>
            
            <div className="review-section">
              <div className="review-group">
                <h4>Patient Information</h4>
                <div className="review-item">
                  <strong>Name:</strong> {patientInfo.firstName} {patientInfo.lastName}
                </div>
                <div className="review-item">
                  <strong>Age:</strong> {patientInfo.age}
                </div>
                <div className="review-item">
                  <strong>Gender:</strong> {patientInfo.gender}
                </div>
                <div className="review-item">
                  <strong>Email:</strong> {patientInfo.email}
                </div>
                <div className="review-item">
                  <strong>Phone:</strong> {patientInfo.phone}
                </div>
              </div>
              
              <div className="review-group">
                <h4>Assessment Information</h4>
                <div className="review-item">
                  <strong>Diabetes Type:</strong> {assessmentData.diabetesType}
                </div>
                <div className="review-item">
                  <strong>Diagnosis Date:</strong> {assessmentData.diagnosisDate}
                </div>
                <div className="review-item">
                  <strong>HbA1c Level:</strong> {assessmentData.hba1c}
                </div>
                <div className="review-item">
                  <strong>Symptoms:</strong> {assessmentData.symptoms.join(', ')}
                </div>
              </div>
              
              <div className="review-group">
                <h4>Uploaded Files</h4>
                <div className="review-item">
                  <strong>Files:</strong> {medicalFiles.length} file(s) uploaded
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="new-patient-assessment">
      <div className="assessment-container">
        <div className="assessment-header">
          <h1>New Patient Assessment</h1>
          <div className="progress-bar">
            <div className="progress-steps">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`progress-step ${step <= currentStep ? 'active' : ''}`}
                >
                  <div className="step-number">{step}</div>
                  <div className="step-label">
                    {step === 1 && 'Patient Info'}
                    {step === 2 && 'Assessment'}
                    {step === 3 && 'Upload Files'}
                    {step === 4 && 'Review'}
                  </div>
                </div>
              ))}
            </div>
            <div className="progress-line">
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="assessment-form">
          {renderStepContent()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary"
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPatientAssessment;
