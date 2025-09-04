import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './DiabeticRetinopathy.css';

const DiabeticRetinopathy = () => {
  return (
    <div className="dr-page">
      <Header />
      <div className="dr-container">
        {/* Header Section */}
        <div className="dr-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Diabetic Retinopathy</h1>
              <p className="header-subtitle">Understanding the Leading Cause of Vision Loss in Diabetic Patients</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dr-content">
          {/* Overview Section */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-icon">👁️</div>
              <h2>What is Diabetic Retinopathy?</h2>
            </div>
            <p>
              Diabetic retinopathy is a diabetes complication that affects eyes. It's caused by damage to the blood vessels 
              of the light-sensitive tissue at the back of the eye (retina). At first, diabetic retinopathy might cause no 
              symptoms or only mild vision problems. But it can lead to blindness.
            </p>
            <p>
              The condition can develop in anyone who has type 1 or type 2 diabetes. The longer you have diabetes and the 
              less controlled your blood sugar is, the more likely you are to develop this eye complication.
            </p>
          </div>

          {/* Stages Section */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-icon">📊</div>
              <h2>Stages of Diabetic Retinopathy</h2>
            </div>
            <div className="stages-grid">
              <div className="stage-card mild">
                <h3>Mild Nonproliferative Retinopathy</h3>
                <p>
                  At this earliest stage, microaneurysms occur. These are small areas of balloon-like swelling 
                  in the retina's tiny blood vessels.
                </p>
              </div>
              <div className="stage-card moderate">
                <h3>Moderate Nonproliferative Retinopathy</h3>
                <p>
                  As the disease progresses, some blood vessels that nourish the retina are blocked, 
                  causing changes in the retina and possible swelling of the macula.
                </p>
              </div>
              <div className="stage-card severe">
                <h3>Severe Nonproliferative Retinopathy</h3>
                <p>
                  Many more blood vessels are blocked, depriving several areas of the retina of their blood supply. 
                  These areas signal the retina to grow new blood vessels.
                </p>
              </div>
              <div className="stage-card proliferative">
                <h3>Proliferative Diabetic Retinopathy</h3>
                <p>
                  This is the most advanced stage. New blood vessels grow in the retina, but they are abnormal 
                  and can leak blood, leading to severe vision loss.
                </p>
              </div>
            </div>
          </div>

          {/* Symptoms Section */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-icon">⚠️</div>
              <h2>Signs and Symptoms</h2>
            </div>
            <div className="symptoms-grid">
              <div className="symptom-item">
                <div className="symptom-icon">🔍</div>
                <h4>Blurred Vision</h4>
                <p>Gradual blurring or loss of central vision</p>
              </div>
              <div className="symptom-item">
                <div className="symptom-icon">🌙</div>
                <h4>Night Vision Problems</h4>
                <p>Difficulty seeing in low light conditions</p>
              </div>
              <div className="symptom-item">
                <div className="symptom-icon">🎯</div>
                <h4>Fluctuating Vision</h4>
                <p>Vision that changes from day to day</p>
              </div>
              <div className="symptom-item">
                <div className="symptom-icon">🌈</div>
                <h4>Color Perception</h4>
                <p>Difficulty distinguishing colors</p>
              </div>
              <div className="symptom-item">
                <div className="symptom-icon">✨</div>
                <h4>Floaters</h4>
                <p>Dark spots or strings floating in vision</p>
              </div>
              <div className="symptom-item">
                <div className="symptom-icon">❌</div>
                <h4>Vision Loss</h4>
                <p>Partial or complete loss of vision</p>
              </div>
            </div>
          </div>

          {/* Prevention Section */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-icon">🛡️</div>
              <h2>Prevention and Management</h2>
            </div>
            <div className="prevention-tips">
              <div className="tip-card">
                <h4>Blood Sugar Control</h4>
                <p>Maintain good blood sugar levels through diet, exercise, and medication as prescribed.</p>
              </div>
              <div className="tip-card">
                <h4>Regular Eye Exams</h4>
                <p>Schedule comprehensive dilated eye exams at least once a year or as recommended by your doctor.</p>
              </div>
              <div className="tip-card">
                <h4>Blood Pressure Management</h4>
                <p>Keep blood pressure under control to reduce the risk of retinal blood vessel damage.</p>
              </div>
              <div className="tip-card">
                <h4>Cholesterol Control</h4>
                <p>Maintain healthy cholesterol levels through diet and medication if necessary.</p>
              </div>
            </div>
          </div>

          {/* AI Detection Section */}
          <div className="content-section ai-section">
            <div className="section-header">
              <div className="section-icon">🤖</div>
              <h2>AI-Powered Early Detection</h2>
            </div>
            <p>
              Our DiaSight system uses advanced artificial intelligence to analyze retinal images and detect early signs 
              of diabetic retinopathy. This technology enables:
            </p>
            <ul className="ai-benefits">
              <li>Early detection before symptoms appear</li>
              <li>Accurate classification of disease severity</li>
              <li>Consistent and objective analysis</li>
              <li>Rapid results for timely intervention</li>
              <li>Improved access to screening in remote areas</li>
            </ul>
            <div className="cta-section">
              <Link to="/new-patient-assessment" className="cta-btn">
                Start AI Assessment →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiabeticRetinopathy;