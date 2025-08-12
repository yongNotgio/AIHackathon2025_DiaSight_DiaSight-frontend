import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import './NewPatientAssessment.css';

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
  const navigate = useNavigate();
  const [form, setForm] = useState(initialLabState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    // Get doctor id from localStorage
    const doctor = JSON.parse(localStorage.getItem('currentDoctor'));
    // Cast all number fields to numbers, leave empty as null
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : isNaN(Number(v)) ? v : Number(v)])
    );
    payload.created_by = doctor?.id || null;
    payload.lab_id = uuidv4();
    const { error: supaError } = await supabase.from('labs').insert([payload]);
    setLoading(false);
    if (supaError) {
      setError(supaError.message || 'Failed to submit assessment.');
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
      hb1ac: Number(form.hba1c), // <-- fix key for backend
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
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modelInput)
      });
      if (!response.ok) throw new Error('Model API error');
      const result = await response.json();
      setModelResult(result);
    } catch (err) {
      setError('Failed to get prediction from model.');
    }
  };

  return (
    <div className="new-patient-assessment">
      <Header />
      <div className="assessment-container">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <a
            className="back-btn"
            onClick={() => navigate('/dashboard')}
            style={{ marginRight: 16 }}
          >
            ←
          </a>
          <h2 style={{ margin: 0 }}>New Patient Assessment (Labs)</h2>
        </div>
        <form className="assessment-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Age *</label>
              <input type="number" name="age" value={form.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Sex *</label>
              <select name="sex" value={form.sex} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>
            <div className="form-group"><label>SBP</label><input type="number" name="sbp" value={form.sbp} onChange={handleChange} /></div>
            <div className="form-group"><label>DBP</label><input type="number" name="dbp" value={form.dbp} onChange={handleChange} /></div>
            <div className="form-group">
              <label>HBP *</label>
              <select name="hbp" value={form.hbp} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="1">No</option>
                <option value="2">Yes</option>
              </select>
              <div style={{ fontSize: '0.9em', color: '#555', marginTop: 2 }}>
              </div>
            </div>
            <div className="form-group"><label>Duration</label><input type="number" name="duration" value={form.duration} onChange={handleChange} /></div>
            <div className="form-group"><label>HbA1c</label><input type="number" name="hba1c" value={form.hba1c} onChange={handleChange} /></div>
            <div className="form-group"><label>LDL</label><input type="number" name="ldl" value={form.ldl} onChange={handleChange} /></div>
            <div className="form-group"><label>HDL</label><input type="number" name="hdl" value={form.hdl} onChange={handleChange} /></div>
            <div className="form-group"><label>Cholesterol</label><input type="number" name="cholesterol" value={form.cholesterol} onChange={handleChange} /></div>
            <div className="form-group"><label>Urea</label><input type="number" name="urea" value={form.urea} onChange={handleChange} /></div>
            <div className="form-group"><label>BUN</label><input type="number" name="bun" value={form.bun} onChange={handleChange} /></div>
            <div className="form-group"><label>Uric</label><input type="number" name="uric" value={form.uric} onChange={handleChange} /></div>
            <div className="form-group"><label>eGFR</label><input type="number" name="egfr" value={form.egfr} onChange={handleChange} /></div>
            <div className="form-group"><label>Triglycerides</label><input type="number" name="triglycerides" value={form.triglycerides} onChange={handleChange} /></div>
            <div className="form-group"><label>UCR</label><input type="number" name="ucr" value={form.ucr} onChange={handleChange} /></div>
            <div className="form-group"><label>ALT</label><input type="number" name="alt" value={form.alt} onChange={handleChange} /></div>
            <div className="form-group"><label>AST</label><input type="number" name="ast" value={form.ast} onChange={handleChange} /></div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Submitting...' : 'Submit Assessment'}</button>
        </form>
        {modelResult && (
          <div className="model-result" style={{marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: 8}}>
            <h3>Model Prediction Result</h3>
            <div><b>Prediction:</b> {modelResult.prediction}</div>
            <div><b>Class Names:</b> {modelResult.class_names ? modelResult.class_names.join(', ') : ''}</div>
            <div><b>Probabilities:</b> {modelResult.probabilities ? JSON.stringify(modelResult.probabilities) : ''}</div>
            <div><b>Confidence:</b> {modelResult.confidence}</div>
            <div><b>Risk Score:</b> {modelResult.risk_score}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPatientAssessment;

