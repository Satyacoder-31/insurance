import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Page3.css";
import { FiArrowLeft, FiArrowRight, FiMapPin } from 'react-icons/fi';

export const Page3 = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("Mumbai");

  const popularCities = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Kolkata"];

  return (
    <div className='wizard-step-container'>
      <div className="wizard-card">
        <div className="wizard-header">
          <button className="btn-back" onClick={() => navigate('/health/age')}>
            <FiArrowLeft size={16} /> Back
          </button>
          <span className="step-counter">Step 3 of 4</span>
        </div>

        <h2>Where do you live?</h2>
        <p className="wizard-sub">Health insurance hospital networks & pricing vary according to your city zone.</p>

        <div className="city-input-field">
          <label><FiMapPin size={14} /> Enter City or PIN Code</label>
          <input 
            type="text" 
            placeholder="e.g. Mumbai or 400001" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
          />
        </div>

        <div className="popular-cities-section">
          <span className="cities-label">Popular Cities</span>
          <div className="cities-chips-grid">
            {popularCities.map((c) => (
              <button 
                key={c} 
                type="button"
                className={`city-chip ${city === c ? 'active' : ''}`}
                onClick={() => setCity(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="wizard-action-row" style={{ marginTop: "24px" }}>
          <button 
            className="btn-wizard-next" 
            onClick={() => {
              try {
                sessionStorage.setItem("wizardCity", city);
              } catch (e) {}
              navigate('/health/contact');
            }}
          >
            Continue <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
