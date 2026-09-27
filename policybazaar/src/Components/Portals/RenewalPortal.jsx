import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './Portals.css';
import { 
  FiUmbrella, 
  FiShield, 
  FiCheckCircle, 
  FiArrowRight, 
  FiRefreshCw, 
  FiPhoneCall, 
  FiAlertCircle, 
  FiClock, 
  FiPercent, 
  FiFileText 
} from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import { AiTwotoneInsurance } from 'react-icons/ai';
import adminStore from '../../services/adminStore';

export const RenewalPortal = () => {
  const { type } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Determine initial tab from route or query
  const getTabFromUrl = () => {
    const raw = type || searchParams.get('tab') || '';
    if (raw.includes('health')) return 'health';
    if (raw.includes('general') || raw.includes('motor') || raw.includes('car')) return 'general';
    return 'life';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  const [policyNumber, setPolicyNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedInsurer, setSelectedInsurer] = useState('ICICI Prudential Life');
  const [isLoading, setIsLoading] = useState(false);
  const [policyData, setPolicyData] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [type, searchParams]);

  const insurers = {
    life: ['ICICI Prudential Life', 'HDFC Life', 'Axis Max Life', 'Tata AIA Life', 'SBI Life', 'ABSL Life'],
    health: ['Star Health Insurance', 'Care Health Insurance', 'HDFC ERGO Health', 'Niva Bupa Health', 'ABSL Health'],
    general: ['SBI General Insurance', 'Tata AIG GIC', 'Bajaj GIC', 'ICICI Lombard GIC', 'Go Digit GIC', 'HDFC ERGO GIC']
  };

  const handleFetchPolicy = (e) => {
    if (e) e.preventDefault();
    if (!policyNumber && !mobileNumber) {
      alert('Please enter either your Policy Number or Registered Mobile Number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Generate realistic mock policy data based on selection
      setPolicyData({
        policyNumber: policyNumber || `POL-${Math.floor(1000000 + Math.random() * 9000000)}`,
        holderName: 'Satya Sharma',
        planName: activeTab === 'life' 
          ? `${selectedInsurer} iProtect Smart Term` 
          : activeTab === 'health' 
          ? `${selectedInsurer} Optima Secure Family` 
          : `${selectedInsurer} Comprehensive Asset Shield`,
        sumInsured: activeTab === 'life' ? '₹ 1 Crore' : activeTab === 'health' ? '₹ 25 Lakh' : '₹ 8.5 Lakh',
        expiryDate: '15 Oct 2026 (Expiring in 18 days)',
        currentPremium: activeTab === 'life' ? 12400 : activeTab === 'health' ? 14850 : 6200,
        ncbDiscount: activeTab === 'general' ? '45% No Claim Bonus' : '15% On-Time Loyalty Discount',
        finalRenewalPremium: activeTab === 'life' ? 10540 : activeTab === 'health' ? 12620 : 3410,
        status: 'Due for Renewal',
        claimStatus: 'Zero claims filed in previous year'
      });
    }, 600);
  };

  const handleUseDemo = () => {
    setPolicyNumber('SL-90823412');
    setMobileNumber('9876543210');
    setTimeout(() => {
      handleFetchPolicy();
    }, 100);
  };

  const handleProceedToPay = () => {
    if (!policyData) return;

    // Save renewal submission to admin store
    adminStore.saveRenewal({
      policyNumber: policyData.policyNumber,
      customerName: policyData.holderName || 'Satya Sharma',
      phone: mobileNumber || '9876543210',
      category: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Insurance Renewal`,
      insurer: selectedInsurer,
      planName: policyData.planName,
      sumInsured: policyData.sumInsured,
      originalPremium: policyData.currentPremium,
      ncbDiscount: policyData.ncbDiscount,
      finalPremium: policyData.finalRenewalPremium,
      status: 'Renewal Submitted'
    });

    // Route to checkout with policy details
    navigate('/checkout', {
      state: {
        isRenewal: true,
        policyNumber: policyData.policyNumber,
        planTitle: policyData.planName,
        insurer: selectedInsurer,
        premium: policyData.finalRenewalPremium,
        cover: policyData.sumInsured
      }
    });
  };

  const faqs = [
    {
      q: 'What is the grace period for renewing an expired insurance policy?',
      a: 'Most life and health insurance policies offer a 30-day grace period from the renewal due date during which you can pay your renewal premium without losing continuous coverage benefits or tax exemptions.'
    },
    {
      q: 'Will I lose my accumulated No Claim Bonus (NCB) if I renew online?',
      a: 'No! When renewing through SafeLife, your existing NCB (up to 50%) is automatically transferred and discounted on your renewal premium quote instantly.'
    },
    {
      q: 'Can I change my nominee or add family members during health renewal?',
      a: 'Yes, during the renewal process you can easily request endorsement additions such as adding a newborn child or spouse, or updating your designated nominee details.'
    }
  ];

  return (
    <div className="portal-page-container">
      {/* Hero Header */}
      <section className="portal-hero">
        <div className="portal-hero-content">
          <div className="portal-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Policy Renewal Portal</span>
          </div>
          <h1>Instant Online Policy Renewal</h1>
          <p>
            Renew your Life, Health, and General Insurance policies in under 2 minutes. 
            Enjoy zero paperwork, automatic No Claim Bonus (NCB) discounts, and continuous uninterrupted protection.
          </p>

          <div className="portal-hero-stats">
            <div className="hero-stat-badge">
              <FiCheckCircle size={16} /> 100% Paperless Process
            </div>
            <div className="hero-stat-badge">
              <FiPercent size={16} /> Up to 50% NCB Discount
            </div>
            <div className="hero-stat-badge">
              <FiClock size={16} /> Instant IRDAI Receipt
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="portal-main-wrapper">
        {/* Navigation Tabs */}
        <div className="portal-tabs-bar">
          <button 
            className={`portal-tab-btn ${activeTab === 'life' ? 'active' : ''}`}
            onClick={() => { setActiveTab('life'); setPolicyData(null); }}
          >
            <FiUmbrella size={18} /> Life Insurance Renewal
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'health' ? 'active' : ''}`}
            onClick={() => { setActiveTab('health'); setPolicyData(null); }}
          >
            <FaHeartbeat size={18} /> Health Insurance Renewal
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => { setActiveTab('general'); setPolicyData(null); }}
          >
            <AiTwotoneInsurance size={18} /> Motor & General Renewal
          </button>
        </div>

        {/* Policy Fetch Card */}
        <div className="portal-card">
          <div className="portal-card-header">
            <div className="portal-card-title">
              <div className="portal-icon-pill pill-blue">
                <FiRefreshCw size={20} />
              </div>
              <div>
                <h2>Fetch Policy Details</h2>
                <p>Enter your policy number or registered mobile number to calculate your renewal quote.</p>
              </div>
            </div>
            <button type="button" className="portal-btn-outline" onClick={handleUseDemo}>
              Try Demo Policy
            </button>
          </div>

          <form onSubmit={handleFetchPolicy}>
            <div className="portal-form-grid">
              <div className="portal-form-group">
                <label>Select Insurance Provider</label>
                <select 
                  value={selectedInsurer} 
                  onChange={(e) => setSelectedInsurer(e.target.value)}
                >
                  {(insurers[activeTab] || insurers.life).map((ins, i) => (
                    <option key={i} value={ins}>{ins}</option>
                  ))}
                </select>
              </div>

              <div className="portal-form-group">
                <label>Policy Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. SL-90823412" 
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                />
              </div>

              <div className="portal-form-group">
                <label>Registered Mobile Number</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="submit" className="portal-btn-primary" disabled={isLoading}>
                {isLoading ? <FiRefreshCw className="spin" size={18} /> : <FiArrowRight size={18} />}
                {isLoading ? 'Fetching Policy Details...' : 'Fetch Renewal Quote'}
              </button>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                *Official IRDAI partner quotes with instant verification
              </span>
            </div>
          </form>

          {/* Policy Data Result Card */}
          {policyData && (
            <div className="portal-result-box">
              <div className="portal-result-header">
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800' }}>
                    {policyData.planName}
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Policy No: <strong>{policyData.policyNumber}</strong> | Insured: <strong>{policyData.holderName}</strong>
                  </span>
                </div>
                <span className="status-badge-pending">
                  <FiAlertCircle size={14} /> {policyData.status}
                </span>
              </div>

              <div className="portal-meta-grid">
                <div className="meta-item">
                  <span>Coverage / Sum Insured</span>
                  <strong>{policyData.sumInsured}</strong>
                </div>
                <div className="meta-item">
                  <span>Policy Expiration</span>
                  <strong style={{ color: '#dc2626' }}>{policyData.expiryDate}</strong>
                </div>
                <div className="meta-item">
                  <span>Discount Applied</span>
                  <strong style={{ color: '#059669' }}>{policyData.ncbDiscount}</strong>
                </div>
                <div className="meta-item">
                  <span>Renewal Premium</span>
                  <strong style={{ fontSize: '18px', color: '#2563eb' }}>
                    ₹ {policyData.finalRenewalPremium.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button type="button" className="portal-btn-outline" onClick={() => setPolicyData(null)}>
                  Clear
                </button>
                <button type="button" className="portal-btn-primary portal-btn-green" onClick={handleProceedToPay}>
                  Proceed to Secure Renewal Payment <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="info-cards-grid">
          <div className="info-feature-box">
            <div className="portal-icon-pill pill-blue">
              <FiShield size={20} />
            </div>
            <div>
              <h4>Continuous Coverage Guarantee</h4>
              <p>Renew before expiry to avoid resets on pre-existing condition waiting periods or vehicle inspection.</p>
            </div>
          </div>

          <div className="info-feature-box">
            <div className="portal-icon-pill pill-green">
              <FiFileText size={20} />
            </div>
            <div>
              <h4>Instant 80D / 80C Tax Receipts</h4>
              <p>Download your official tax certificate instantly upon payment for annual income tax deduction filing.</p>
            </div>
          </div>

          <div className="info-feature-box">
            <div className="portal-icon-pill pill-purple">
              <FiPhoneCall size={20} />
            </div>
            <div>
              <h4>24x7 Priority Renewal Support</h4>
              <p>Have questions regarding policy upgrade or NCB transfer? Our certified specialists are available round the clock.</p>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="portal-card" style={{ marginTop: '28px' }}>
          <div className="portal-card-header">
            <div className="portal-card-title">
              <div className="portal-icon-pill pill-amber">
                <FiAlertCircle size={20} />
              </div>
              <div>
                <h2>Frequently Asked Questions</h2>
                <p>Everything you need to know about policy renewals on SafeLife</p>
              </div>
            </div>
          </div>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="faq-item" 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span>{faq.q}</span>
                  <span>{activeFaq === i ? '−' : '+'}</span>
                </div>
                {activeFaq === i && <div className="faq-a">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="contact-hub-card">
          <div className="contact-hub-left">
            <h3>Need Help with Your Renewal?</h3>
            <p>Call our dedicated renewal helpline toll-free: <strong>1800-208-8787</strong> (Mon-Sun, 8 AM - 10 PM)</p>
          </div>
          <div className="contact-hub-actions">
            <a href="tel:18002088787" className="portal-btn-primary">
              <FiPhoneCall size={16} /> Call Renewal Desk
            </a>
            <Link to="/support" className="portal-btn-outline" style={{ background: 'transparent', color: '#fff', borderColor: '#475569' }}>
              Visit Support Portal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
export default RenewalPortal;
