import React from 'react';
import Health_insu from "../Images/leftHeroImage.webp";
import { FiCheckCircle, FiShield } from 'react-icons/fi';

export const Family_left = () => {
  return (
    <div className='family-leftside'>
      <div className="family-left-badge">
        <FiShield size={14} /> SafeLife Health Assurance
      </div>

      <h2 className="family-left-title">Why buy Health Cover from SafeLife?</h2>
      
      <div className="family-benefits-list">
        <div className="family-benefit-item">
          <FiCheckCircle color="#ef4444" size={18} />
          <div>
            <h4>30-Minute Cashless Claim Support</h4>
            <p>Dedicated on-ground assistance at 14,000+ network hospitals.</p>
          </div>
        </div>

        <div className="family-benefit-item">
          <FiCheckCircle color="#ef4444" size={18} />
          <div>
            <h4>Zero Copayment Guarantee</h4>
            <p>100% claim payout with no hidden out-of-pocket charges.</p>
          </div>
        </div>

        <div className="family-benefit-item">
          <FiCheckCircle color="#ef4444" size={18} />
          <div>
            <h4>Instant Paperless Issuance</h4>
            <p>No prior medical tests required for members up to 50 years.</p>
          </div>
        </div>

        <div className="family-benefit-item">
          <FiCheckCircle color="#ef4444" size={18} />
          <div>
            <h4>Tax Savings up to ₹75,000</h4>
            <p>Claim maximum tax deductions under Section 80D every year.</p>
          </div>
        </div>
      </div>

      <img className='family-leftside-img' src={Health_insu} alt="Health insurance plan" />
    </div>
  );
};
