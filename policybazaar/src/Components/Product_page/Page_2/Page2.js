import React, { useState } from 'react';
import "./Page2.css";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

export const Page2 = () => {
    const data = useSelector((st) => st.user_health_insurance) || {};
    const s = Object.keys(data);
    const navigate = useNavigate();

    // Check if at least one member is selected, otherwise default to self
    const selectedMembers = s.filter(k => data[k] === true);
    const membersToDisplay = selectedMembers.length > 0 ? selectedMembers : ['self'];

    const initialAges = {};
    membersToDisplay.forEach(m => {
        initialAges[m] = m === 'self' || m === 'spouse' ? 32 : m === 'father' || m === 'mother' ? 60 : 8;
    });

    const [ages, setAges] = useState(initialAges);

    const handleAgeChange = (member, val) => {
        setAges(prev => ({
            ...prev,
            [member]: parseInt(val) || val
        }));
    };

    const handleContinue = () => {
        try {
            sessionStorage.setItem("wizardAges", JSON.stringify(ages));
        } catch (e) {}
        navigate('/health/pincode');
    };

    return (
        <div className='wizard-step-container'>
            <div className="wizard-card">
                <div className="wizard-header">
                    <button className="btn-back" onClick={() => navigate('/health')}>
                        <FiArrowLeft size={16} /> Back
                    </button>
                    <span className="step-counter">Step 2 of 4</span>
                </div>

                <h2>How old are the family members?</h2>
                <p className="wizard-sub">Accurate ages help us get the best premium quotes from all 5 health insurers.</p>

                <div className='page2_display'>
                    {membersToDisplay.map((key) => (
                        <div key={key} className="age-field-group">
                            <label>{key === 'doughter' ? 'Daughter' : key.charAt(0).toUpperCase() + key.slice(1)}'s Age</label>
                            <input 
                                type="number" 
                                min='1' 
                                max='100' 
                                value={ages[key] || 32}
                                onChange={(e) => handleAgeChange(key, e.target.value)}
                                placeholder={`Enter age`} 
                            />
                        </div>
                    ))}
                </div>

                <div className="wizard-action-row">
                    <button className="btn-wizard-next" onClick={handleContinue}>
                        Continue <FiArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
