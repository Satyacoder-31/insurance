import React from 'react';
import { useDispatch } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import { Userdetails } from './Action';
import "./Rightside.css";
import { FiShield, FiArrowRight } from "react-icons/fi";
import adminStore from '../../../services/adminStore';

export const RightSide = () => {
    const [data, setData] = React.useState({
        name: "",
        gender: "male",
        date: "",
        number: ""
    });

    let navigate = useNavigate();
    let dispatch = useDispatch();

    function HandleSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();
        
        if (data.name.trim() || data.number.trim()) {
            adminStore.saveProposal({
                customerName: data.name.trim() || 'Term Applicant',
                gender: data.gender === 'male' ? 'Male' : 'Female',
                dob: data.date || '1995-01-01',
                phone: data.number.trim() || '9876543210',
                email: `${(data.name.trim() || 'applicant').toLowerCase().replace(/\s+/g, '.')}@example.com`,
                city: 'Mumbai',
                pincode: '400001',
                policyType: 'Life & Term Insurance',
                planName: '₹1 Crore Pure Term Protection Shield',
                insurer: 'ICICI / HDFC / Tata AIA Multi-Partner',
                sumInsured: '₹ 1,00,00,000',
                premium: 6840,
                members: 'Self (Life Assured)',
                preExistingDiseases: 'Clean Medical Declaration',
                smokingAlcohol: 'Non-smoker',
                source: 'Term Life Insurance Application Form',
                status: 'Pending Approval'
            });
        }

        Userdetails(data, dispatch);
        navigate('/plans');
    }

    function HandleData(e) {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <div className='rightside-container'>
            <div className="rightside-card">
                <div className="rightside-header">
                    <span className="quote-badge">Special Online Rate</span>
                    <h2>₹1 Crore Life Cover from ₹490/month*</h2>
                    <p className="quote-discount-tag">⚡ Get up to 10% instant digital discount on authorized plans</p>
                </div>

                <form onSubmit={HandleSubmit} className="quote-form">
                    <div className="gender-selector">
                        <label className={`gender-btn ${data.gender === 'male' ? 'active' : ''}`}>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="male" 
                                checked={data.gender === 'male'} 
                                onChange={HandleData} 
                            />
                            <span>👨 Male</span>
                        </label>

                        <label className={`gender-btn ${data.gender === 'female' ? 'active' : ''}`}>
                            <input 
                                type="radio" 
                                name="gender" 
                                value="female" 
                                checked={data.gender === 'female'} 
                                onChange={HandleData} 
                            />
                            <span>👩 Female</span>
                        </label>
                    </div>

                    <div className="form-input-field">
                        <label>Your Full Name</label>
                        <input 
                            name="name" 
                            type="text" 
                            placeholder='e.g. Ramesh Kumar' 
                            value={data.name} 
                            onChange={HandleData} 
                            required 
                        />
                    </div>

                    <div className="form-input-field">
                        <label>Date of Birth</label>
                        <input 
                            name="date" 
                            type='date' 
                            value={data.date} 
                            onChange={HandleData} 
                            required 
                        />
                    </div>

                    <div className="form-input-field">
                        <label>Mobile Number (10 Digits)</label>
                        <input 
                            name="number" 
                            type='tel' 
                            maxLength={10} 
                            placeholder='e.g. 9876543210' 
                            value={data.number} 
                            onChange={HandleData} 
                            required 
                        />
                    </div>

                    <button type="submit" className='btn-view-quotes'>
                        View Free Quotes <FiArrowRight size={18} />
                    </button>

                    <Link to="/plans?category=general" className="btn-view-general-direct">
                        ⚡ Or Compare All 6 General Insurance Plans Directly →
                    </Link>
                </form>

                <div className="quote-trust-footer">
                    <div className="trust-item">
                        <FiShield color="#059669" size={16} />
                        <span>Certified SafeLife insurance advisors only</span>
                    </div>
                    <p className="disclaimer-text">
                        By continuing, you agree to SafeLife's Privacy Policy, Terms of Use, and partner terms.
                    </p>
                </div>
            </div>
        </div>
    );
};
