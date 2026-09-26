import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Health_action } from './Health_action';
import "./Right.css";
import { FiCheck, FiArrowRight, FiShield } from 'react-icons/fi';

export const Family_right = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [details, setDetails] = useState({
        self: true,
        spouse: false,
        son: false,
        doughter: false,
        father: false,
        mother: false
    });

    const toggleMember = (member) => {
        setDetails(prev => ({
            ...prev,
            [member]: !prev[member]
        }));
    };

    const handleContinue = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        Health_action(details, dispatch);
        navigate('/health/age');
    };

    return (
        <div className='family-right-container'>
            <div className="family-form-card">
                <div className="family-header-box">
                    <span className="family-form-tag">Authorized Health Network</span>
                    <h2>Find Top Health Insurance Plans</h2>
                    <p className="family-discount-text">Get up to 25% direct digital discount across 5 partner insurers</p>
                </div>

                <div className="members-select-section">
                    <label className="section-label">Who would you like to insure?</label>
                    <div className="members-grid">
                        <div 
                            className={`member-card ${details.self ? 'active' : ''}`}
                            onClick={() => toggleMember('self')}
                        >
                            <div className="member-avatar">🙋🏻‍♂️</div>
                            <span className="member-name">Self</span>
                            {details.self && <div className="member-check-icon"><FiCheck size={14} /></div>}
                        </div>

                        <div 
                            className={`member-card ${details.spouse ? 'active' : ''}`}
                            onClick={() => toggleMember('spouse')}
                        >
                            <div className="member-avatar">👩🏻</div>
                            <span className="member-name">Spouse</span>
                            {details.spouse && <div className="member-check-icon"><FiCheck size={14} /></div>}
                        </div>

                        <div 
                            className={`member-card ${details.son ? 'active' : ''}`}
                            onClick={() => toggleMember('son')}
                        >
                            <div className="member-avatar">👦🏻</div>
                            <span className="member-name">Son</span>
                            {details.son && <div className="member-check-icon"><FiCheck size={14} /></div>}
                        </div>

                        <div 
                            className={`member-card ${details.doughter ? 'active' : ''}`}
                            onClick={() => toggleMember('doughter')}
                        >
                            <div className="member-avatar">👧🏻</div>
                            <span className="member-name">Daughter</span>
                            {details.doughter && <div className="member-check-icon"><FiCheck size={14} /></div>}
                        </div>

                        <div 
                            className={`member-card ${details.father ? 'active' : ''}`}
                            onClick={() => toggleMember('father')}
                        >
                            <div className="member-avatar">👨🏻‍🦳</div>
                            <span className="member-name">Father</span>
                            {details.father && <div className="member-check-icon"><FiCheck size={14} /></div>}
                        </div>

                        <div 
                            className={`member-card ${details.mother ? 'active' : ''}`}
                            onClick={() => toggleMember('mother')}
                        >
                            <div className="member-avatar">👵🏻</div>
                            <span className="member-name">Mother</span>
                            {details.mother && <div className="member-check-icon"><FiCheck size={14} /></div>}
                        </div>
                    </div>
                </div>

                <div className="family-actions-box">
                    <button className='btn-family-continue' onClick={handleContinue}>
                        Continue with Selected Members <FiArrowRight size={16} />
                    </button>

                    <Link to="/plans?category=health" className="btn-family-direct-view">
                        ⚡ Or Compare All 5 Health Plans Directly →
                    </Link>

                    <p className="privacy-consent-note">
                        <FiShield size={12} style={{ display: "inline", marginRight: "4px" }} />
                        By clicking, you agree to SafeLife Privacy Policy, Terms of Use, and IRDAI regulations.
                    </p>
                </div>
            </div>
        </div>
    );
};
