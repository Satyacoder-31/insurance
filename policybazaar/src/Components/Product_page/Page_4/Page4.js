import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Page4.css";
import { FiArrowLeft, FiArrowRight, FiLock } from 'react-icons/fi';

export const Page4 = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const handleFinish = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    navigate('/plans?category=health');
  };

  return (
    <div className='wizard-step-container'>
      <div className="wizard-card">
        <div className="wizard-header">
          <button className="btn-back" onClick={() => navigate('/health/pincode')}>
            <FiArrowLeft size={16} /> Back
          </button>
          <span className="step-counter">Step 4 of 4</span>
        </div>

        <h2>Tell us about yourself</h2>
        <p className="wizard-sub">We'll show you instant plans from Star, Care, HDFC ERGO, Niva Bupa & ABSL Health.</p>

        <form onSubmit={handleFinish}>
          <div className="gender-toggle-row">
            <button 
              type="button" 
              className={`gender-option-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => setGender('male')}
            >
              <span>🙋🏻‍♂️ Male</span>
            </button>
            <button 
              type="button" 
              className={`gender-option-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => setGender('female')}
            >
              <span>🙋🏽‍♀️ Female</span>
            </button>
          </div>

          <div className="contact-field-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Priya Sharma" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="contact-field-group">
            <label>Mobile Number (10 Digits)</label>
            <input 
              type="tel" 
              maxLength={10} 
              placeholder="e.g. 9876543210" 
              value={number} 
              onChange={(e) => setNumber(e.target.value)} 
              required 
            />
          </div>

          <div className="security-reassurance-box">
            <FiLock size={14} color="#059669" />
            <span>100% spam-free guarantee. Your data is encrypted and secure with SafeLife.</span>
          </div>

          <button type="submit" className="btn-wizard-next" style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}>
            View Health Insurance Plans <FiArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
