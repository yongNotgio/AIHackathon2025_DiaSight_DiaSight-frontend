import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import './NewPatientAssessment.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const initialLabState = {
  age: '',
  sex: '',
  sbp: '',
  dbp: '',
  hbp: '',
  duration: '',
  hba1c: '',
  ldl: '',
  hdl: '',
  cholesterol: '',
  urea: '',
  bun: '',
  uric: '',
  egfr: '',
  triglycerides: '',
  ucr: '',
  alt: '',
  ast: ''
};

const NewPatientAssessment = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [form, setForm] = useState(initialLabState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelResult, setModelResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { number: 1, title: 'Demographics', description: 'Basic patient information' },
    { number: 2, title: 'Vital Signs', description: 'Blood pressure data' },
    { number: 3, title: 'Lab Results', description: 'Glycemic & lipid profile' },
    { number: 4, title: 'Kidney Function', description: 'Renal function tests' },
    { number: 5, title: 'Liver Function', description: 'Metabolic markers' }
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Mark step 5 as completed when submitting
    setIsSubmitted(true);
    
    // Get doctor id from localStorage
    const doctor = JSON.parse(localStorage.getItem('currentDoctor'));
    
    // Cast all number fields to numbers, leave empty as null
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : isNaN(Number(v)) ? v : Number(v)])
    );
    payload.created_by = doctor?.id || null;
    payload.lab_id = uuidv4();
    const labId = payload.lab_id;
    
    const { error: supaError } = await supabase.from('labs').insert([payload]);
    if (supaError) {
      setLoading(false);
      setError(supaError.message || 'Failed to submit assessment.');
      setIsSubmitted(false); // Reset if error
      return;
    }
    
    // Prepare JSON for ML model
    const modelInput = {
      age: Number(form.age),
      sex: Number(form.sex),
      sbp: Number(form.sbp),
      dbp: Number(form.dbp),
      hbp: Number(form.hbp),
      duration: Number(form.duration),
      hb1ac: Number(form.hba1c),
      ldl: Number(form.ldl),
      hdl: Number(form.hdl),
      chol: Number(form.cholesterol),
      urea: Number(form.urea),
      bun: Number(form.bun),
      uric: Number(form.uric),
      egfr: Number(form.egfr),
      trig: Number(form.triglycerides),
      ucr: Number(form.ucr),
      alt: Number(form.alt),
      ast: Number(form.ast)
    };
    
    try {
      const response = await fetch('https://diasight-deployment-1.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelInput)
      });
      if (!response.ok) throw new Error('Model API error');
      const result = await response.json();
      setModelResult(result);
      
      // Insert risk_classification row and get its id
      const { data: rcData, error: rcError } = await supabase.from('risk_classification').insert([
        {
          lab_id: labId,
          risk_class: result.prediction
        }
      ]).select('id').single();
      if (rcError) throw rcError;
      
      // Insert audit_logs entry
      const { error: auditError } = await supabase.from('audit_logs').insert([
        {
          lab_id: labId,
          risk_classification_id: rcData.id,
          risk_class: result.prediction,
          action: 'assessment_completed',
          doctor_id: doctor?.id || null,
          created_at: new Date().toISOString()
        }
      ]);
      
      if (auditError) {
        console.error('Audit log insertion failed:', auditError);
      }
      
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction from model.');
      setIsSubmitted(false); // Reset if error
    }
    setLoading(false);
  };

  // Handle submit button click for step 5
  const handleSubmitClick = async () => {
    if (step === 5) {
      const mockEvent = { preventDefault: () => {} };
      await handleSubmit(mockEvent);
    }
  };

  const handleNewAssessment = () => {
    // Reset all states
    setStep(1);
    setForm(initialLabState);
    setModelResult(null);
    setIsSubmitted(false);
    setError('');
    setLoading(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3>Demographics</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select name="sex" value={form.sex} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration of diabetes</label>
                <input type="number" name="duration" value={form.duration} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Vital Signs & Blood Pressure</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Systolic Blood Pressure</label>
                <input type="number" name="sbp" value={form.sbp} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Diastolic Blood Pressure</label>
                <input type="number" name="dbp" value={form.dbp} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>High Blood Pressure</label>
                <select name="hbp" value={form.hbp} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">No</option>
                  <option value="2">Yes</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Glycemic Control & Lipid Profile</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>HbA1c</label>
                <input type="number" name="hba1c" value={form.hba1c} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Low Density Lipoprotein</label>
                <input type="number" name="ldl" value={form.ldl} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>High Density Lipoprotein</label>
                <input type="number" name="hdl" value={form.hdl} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Cholesterol</label>
                <input type="number" name="cholesterol" value={form.cholesterol} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Triglycerides</label>
                <input type="number" name="triglycerides" value={form.triglycerides} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Renal (Kidney) Function</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Serum Urea</label>
                <input type="number" name="urea" value={form.urea} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Blood Urea Nitrogen</label>
                <input type="number" name="bun" value={form.bun} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Estimated Glomerular Filtration Rate</label>
                <input type="number" name="egfr" value={form.egfr} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Urinary Creatinine</label>
                <input type="number" name="ucr" value={form.ucr} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Metabolic Markers & Liver Function</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Uric Acid</label>
                <input type="number" name="uric" value={form.uric} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Alanine Aminotransferase</label>
                <input type="number" name="alt" value={form.alt} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Aspartate Aminotransferase</label>
                <input type="number" name="ast" value={form.ast} onChange={handleChange} />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="assessment-page">
       <Link to="/dashboard" className="back-btn1">
                  ← Back to Dashboard
                </Link>
      <Header />
      <div className="assessment-container">
        {/* Header */}
        <div className="assessment-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-top">
                <h1>New Patient Assessment</h1>
              </div>
              <p className="header-subtitle">Lab Results & Diabetic Retinopathy Prediction</p>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="step-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${isSubmitted ? '100%' : ((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          <div className="steps">
            {steps.map((stepItem) => (
              <div 
                key={stepItem.number}
                className={`step ${step >= stepItem.number ? 'active' : ''} ${step > stepItem.number || (step === 5 && isSubmitted) ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  {step > stepItem.number || (step === 5 && isSubmitted) ? '✓' : stepItem.number}
                </div>
                <div className="step-info">
                  <div className="step-title">{stepItem.title}</div>
                  <div className="step-description">{stepItem.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content - Show until results are available */}
        {!modelResult && (
          <div className="assessment-form">
            <div className="form-card">
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
                
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="form-navigation">
                  {step > 1 && !isSubmitted && (
                    <button 
                      type="button" 
                      onClick={() => setStep(step - 1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                  )}
                  
                  {step < 5 ? (
                    <button 
                      type="button" 
                      onClick={() => setStep(step + 1)}
                      className="btn-primary"
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSubmitClick}
                      disabled={loading || isSubmitted}
                      className="btn-primary submit-btn"
                    >
                      {loading ? 'Submitting...' : isSubmitted ? 'Submitted ✓' : 'Submit Assessment'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Model Result - Only show after submission and results are available */}
        {modelResult && isSubmitted && (
          <div className="model-result-card">
            <div className="result-header">
              <div className="result-icon">🎯</div>
              <h3>AI Prediction Results</h3>
            </div>
            
            <div className="result-content">
              {modelResult.probabilities ? (
                <div className="chart-wrapper">
                  <Bar
                    data={{
                      labels: Object.keys(modelResult.probabilities),
                      datasets: [
                        {
                          label: 'Probability',
                          data: Object.values(modelResult.probabilities),
                          backgroundColor: Object.keys(modelResult.probabilities).map((k) => {
                            if (k === 'No DR') return 'rgba(75, 192, 75, 0.7)'; // green
                            if (k === 'Mild DR') return 'rgba(255, 205, 86, 0.7)'; // yellow
                            if (k === 'Severe DR') return 'rgba(255, 99, 132, 0.7)'; // red
                            return 'rgba(201, 203, 207, 0.5)'; // default gray
                          }),
                          borderColor: Object.keys(modelResult.probabilities).map((k) => {
                            if (k === modelResult.prediction) return 'rgba(54, 162, 235, 1)';
                            if (k === 'No DR') return 'rgba(75, 192, 75, 1)';
                            if (k === 'Mild DR') return 'rgba(255, 205, 86, 1)';
                            if (k === 'Severe DR') return 'rgba(255, 99, 132, 1)';
                            return 'rgba(201, 203, 207, 1)';
                          }),
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
                        legend: { display: false },
                        title: {
                          display: true,
                          text: 'Prediction Probabilities'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `Probability: ${(context.raw * 100).toFixed(2)}%`;
                            }
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 1,
                          ticks: {
                            callback: function(value) {
                              return (value * 100) + '%';
                            }
                          }
                        }
                      }
                    }}
                    height={200}
                  />
                </div>
              ) : (
                <div className="no-data">No probability data available.</div>
              )}
              
              <div className="result-metrics">
                <div className="metric-card">
                  <div className="metric-label">Confidence</div>
                  <div className="metric-value">{modelResult.confidence}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Risk Score</div>
                  <div className="metric-value">{modelResult.risk_score}</div>
                </div>
                <div className="metric-card">
                  <div className="metric-label">Prediction</div>
                  <div className="metric-value prediction">{modelResult.prediction}</div>
                </div>
              </div>
            </div>

            {/* New Assessment Button */}
            <div className="result-actions">
              <button 
                onClick={handleNewAssessment}
                className="btn-primary new-assessment-btn"
              >
                Submit New Assessment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPatientAssessment;