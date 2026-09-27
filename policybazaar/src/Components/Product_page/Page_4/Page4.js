import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Page4.css";
import { FiArrowLeft, FiArrowRight, FiLock } from 'react-icons/fi';
import adminStore from '../../../services/adminStore';

export const Page4 = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("male");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const handleFinish = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Retrieve all details filled across previous wizard steps
    let membersData = {};
    let agesData = {};
    let cityData = 'Mumbai';

    try {
      const storedMembers = sessionStorage.getItem('wizardMembers');
      if (storedMembers) membersData = JSON.parse(storedMembers);
      const storedAges = sessionStorage.getItem('wizardAges');
      if (storedAges) agesData = JSON.parse(storedAges);
      const storedCity = sessionStorage.getItem('wizardCity');
      if (storedCity) cityData = storedCity;
    } catch (err) {
      console.error('Error reading wizard session details', err);
    }

    // Format member list with accurate ages
    const activeMembers = Object.keys(membersData).filter(k => membersData[k]);
    const membersToSave = activeMembers.length > 0 ? activeMembers : ['self'];
    const formattedMemberList = membersToSave.map(m => {
      const label = m === 'doughter' ? 'Daughter' : m.charAt(0).toUpperCase() + m.slice(1);
      const age = agesData[m] || (m === 'self' || m === 'spouse' ? 32 : m === 'father' || m === 'mother' ? 60 : 8);
      return { relation: label, age };
    });

    const membersSummary = formattedMemberList.map(m => `${m.relation} (${m.age} yrs)`).join(', ');

    if (name.trim() || number.trim()) {
      adminStore.saveProposal({
        customerName: name.trim() || 'Health Applicant',
        gender: gender === 'male' ? 'Male' : 'Female',
        phone: number.trim() || '9876543210',
        email: `${(name.trim() || 'customer').toLowerCase().replace(/\s+/g, '.')}@example.com`,
        city: cityData,
        pincode: /^\d{6}$/.test(cityData) ? cityData : '400001',
        policyType: 'Health Insurance',
        planName: 'Family Health Optima Comprehensive Shield',
        insurer: 'Care / Star / HDFC ERGO Network',
        sumInsured: '₹ 25,00,000',
        premium: 14850,
        members: membersSummary || 'Self (32 yrs)',
        membersList: formattedMemberList,
        preExistingDiseases: 'Standard Multi-Member Declaration',
        smokingAlcohol: 'Non-smoker',
        source: 'Health Insurance 4-Step Wizard',
        status: 'Pending Approval'
      });
    }
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
