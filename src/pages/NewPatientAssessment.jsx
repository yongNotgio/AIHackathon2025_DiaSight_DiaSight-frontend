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
    } else {
      alert('Patient assessment submitted successfully!');
      navigate('/dashboard');
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
            <div className="form-group"><label>HBP</label><input type="number" name="hbp" value={form.hbp} onChange={handleChange} /></div>
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
      </div>
    </div>
  );
};

export default NewPatientAssessment;

