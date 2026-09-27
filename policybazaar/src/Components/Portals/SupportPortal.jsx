import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Portals.css';
import { 
  FiFileText, 
  FiHelpCircle, 
  FiSettings, 
  FiUserCheck, 
  FiPhoneCall, 
  FiDownload, 
  FiCheckCircle, 
  FiArrowRight, 
  FiMapPin, 
  FiClock, 
  FiShield, 
  FiSend 
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import { RiCustomerService2Line } from 'react-icons/ri';
import adminStore from '../../services/adminStore';

export const SupportPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTabFromPath = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes('policies')) return 'policies';
    if (path.includes('help') || path.includes('faq')) return 'help';
    if (path.includes('preference') || path.includes('communication')) return 'preferences';
    if (path.includes('advisor')) return 'advisor';
    if (path.includes('whatsapp') || path.includes('contact') || path.includes('hub') || path.includes('callback')) return 'contact';
    return 'policies';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  // Support Ticket Form State
  const [ticketData, setTicketData] = useState({ name: '', phone: '', category: 'Policy Query', message: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(null);

  // Callback Form State
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', topic: 'Renewal Assistance' });
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // Advisor Verification State
  const [advisorId, setAdvisorId] = useState('ADV-8832');
  const [advisorResult, setAdvisorResult] = useState({
    name: 'Rohit Verma',
    id: 'ADV-8832',
    irdaiLicense: 'IRDAI/AGN/2021/88329',
    experience: '6 Years',
    specialization: 'Life & Health Advisory',
    status: 'Verified & Active'
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    whatsapp: true,
    sms: true,
    email: true,
    promotions: false
  });
  const [prefSaved, setPrefSaved] = useState(false);

  // Active FAQ
  const [activeFaq, setActiveFaq] = useState(null);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const generatedId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketSubmitted(generatedId);

    // Save ticket into admin store
    adminStore.saveTicket({
      ticketId: generatedId,
      customerName: ticketData.name || 'Valued Customer',
      phone: ticketData.phone || '9876543210',
      category: ticketData.category || 'General Support',
      message: ticketData.message || 'Customer inquiry submitted',
      status: 'Open',
      priority: 'Normal'
    });
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    setCallbackSubmitted(true);

    // Save callback request into admin store
    adminStore.saveCallback({
      customerName: callbackData.name || 'Valued Customer',
      phone: callbackData.phone || '9876543210',
      topic: callbackData.topic || 'General Consultation',
      status: 'Pending'
    });
  };

  const handleVerifyAdvisor = (e) => {
    e.preventDefault();
    if (!advisorId) return;
    setAdvisorResult({
      name: 'Pooja Deshmukh',
      id: advisorId,
      irdaiLicense: 'IRDAI/AGN/2022/94412',
      experience: '5 Years',
      specialization: 'Family Health & Term Plans',
      status: 'Verified & Active'
    });
  };

  const savePreferences = () => {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const hubs = [
    { city: 'Mumbai', address: 'B-Wing, Trade Centre, BKC, Bandra East, Mumbai - 400051', phone: '+91 22 6123 4500' },
    { city: 'Delhi NCR', address: 'Plot 44, Sector 32, Institutional Area, Gurugram - 122001', phone: '+91 124 456 7800' },
    { city: 'Bengaluru', address: 'Prestige Meridian, MG Road, Bengaluru - 560001', phone: '+91 80 4321 9800' },
    { city: 'Hyderabad', address: 'HITEC City, Madhapur, Hyderabad - 500081', phone: '+91 40 6789 1200' },
    { city: 'Chennai', address: 'Anna Salai, Teynampet, Chennai - 600018', phone: '+91 44 2435 6700' }
  ];

  return (
    <div className="portal-page-container">
      {/* Hero Header */}
      <section className="portal-hero hero-support">
        <div className="portal-hero-content">
          <div className="portal-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Customer Support Portal</span>
          </div>
          <h1>SafeLife Help & Support Center</h1>
          <p>
            Manage your active policies, download tax certificates, verify certified IRDAI advisors, 
            or connect with our customer advocacy team via WhatsApp, Callback, or phone.
          </p>

          <div className="portal-hero-stats">
            <div className="hero-stat-badge">
              <RiCustomerService2Line size={16} /> 24x7 Customer Care
            </div>
            <div className="hero-stat-badge">
              <BsWhatsapp size={16} /> Instant WhatsApp Desk
            </div>
            <div className="hero-stat-badge">
              <FiClock size={16} /> 5-Minute Callback SLA
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="portal-main-wrapper">
        {/* Navigation Tabs */}
        <div className="portal-tabs-bar">
          <button 
            className={`portal-tab-btn ${activeTab === 'policies' ? 'active tab-support' : ''}`}
            onClick={() => { setActiveTab('policies'); navigate('/support/account/policies'); }}
          >
            <FiFileText size={18} /> My Policies
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'help' ? 'active tab-support' : ''}`}
            onClick={() => { setActiveTab('help'); navigate('/support/account/get-help'); }}
          >
            <FiHelpCircle size={18} /> Get Help & FAQs
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'preferences' ? 'active tab-support' : ''}`}
            onClick={() => { setActiveTab('preferences'); navigate('/support/account/communication-preferences'); }}
          >
            <FiSettings size={18} /> Preferences
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'advisor' ? 'active tab-support' : ''}`}
            onClick={() => { setActiveTab('advisor'); navigate('/support/account/advisor'); }}
          >
            <FiUserCheck size={18} /> Verify Advisor
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'contact' ? 'active tab-support' : ''}`}
            onClick={() => { setActiveTab('contact'); navigate('/support/contact/whatsapp'); }}
          >
            <FiPhoneCall size={18} /> Contact SafeLife
          </button>
        </div>

        {/* Tab 1: My Policies */}
        {activeTab === 'policies' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-purple">
                  <FiFileText size={20} />
                </div>
                <div>
                  <h2>Active Policy Portfolio</h2>
                  <p>View, download policy documents, and check renewal dates for your active coverages.</p>
                </div>
              </div>
              <Link to="/plans" className="portal-btn-primary portal-btn-purple">
                Explore More Plans <FiArrowRight size={16} />
              </Link>
            </div>

            {/* Sample Active Policies */}
            <div className="portal-result-box" style={{ marginBottom: '16px' }}>
              <div className="portal-result-header">
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800' }}>
                    Star Health Comprehensive Family Optima
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Policy No: <strong>POL-SH-928172</strong> | Insured: <strong>Self & Spouse (2 Adults)</strong>
                  </span>
                </div>
                <span className="status-badge-active">
                  <FiCheckCircle size={14} /> Active & In Force
                </span>
              </div>

              <div className="portal-meta-grid">
                <div className="meta-item">
                  <span>Sum Insured Cover</span>
                  <strong>₹ 25,00,000</strong>
                </div>
                <div className="meta-item">
                  <span>Annual Premium Paid</span>
                  <strong>₹ 16,840</strong>
                </div>
                <div className="meta-item">
                  <span>Policy Expiration</span>
                  <strong>24 Dec 2026</strong>
                </div>
                <div className="meta-item">
                  <span>Cumulative Bonus</span>
                  <strong style={{ color: '#059669' }}>+ ₹ 5,00,000 (20%)</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="portal-btn-outline" 
                  onClick={() => alert('Downloading official IRDAI policy bond PDF...')}
                >
                  <FiDownload size={16} /> Download Policy PDF
                </button>
                <Link to="/claim/new-claim" className="portal-btn-outline">
                  Initiate Claim
                </Link>
                <Link to="/renewal/health-renewal" className="portal-btn-primary portal-btn-purple">
                  Renew Policy
                </Link>
              </div>
            </div>

            <div className="portal-result-box">
              <div className="portal-result-header">
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800' }}>
                    ICICI Prudential iProtect Smart Life Cover
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Policy No: <strong>POL-ICICI-441829</strong> | Life Assured: <strong>Satya Sharma</strong>
                  </span>
                </div>
                <span className="status-badge-active">
                  <FiCheckCircle size={14} /> Active & In Force
                </span>
              </div>

              <div className="portal-meta-grid">
                <div className="meta-item">
                  <span>Life Sum Assured</span>
                  <strong>₹ 1.5 Crore</strong>
                </div>
                <div className="meta-item">
                  <span>Coverage Term</span>
                  <strong>Till Age 75</strong>
                </div>
                <div className="meta-item">
                  <span>Next Premium Due</span>
                  <strong>12 Nov 2026</strong>
                </div>
                <div className="meta-item">
                  <span>Tax Benefits</span>
                  <strong style={{ color: '#059669' }}>Eligible u/s 80C</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="portal-btn-outline"
                  onClick={() => alert('Downloading 80C premium paid tax certificate...')}
                >
                  <FiDownload size={16} /> 80C Tax Certificate
                </button>
                <Link to="/renewal/life-renewal" className="portal-btn-primary portal-btn-purple">
                  Manage Renewal
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Get Help & FAQs */}
        {activeTab === 'help' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-blue">
                  <FiHelpCircle size={20} />
                </div>
                <div>
                  <h2>Raise a Ticket or Browse Help Topics</h2>
                  <p>Submit an inquiry or resolve queries regarding policy changes, endorsements, and tax proofs.</p>
                </div>
              </div>
            </div>

            {ticketSubmitted ? (
              <div className="portal-result-box" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
                <span className="status-badge-active">
                  <FiCheckCircle size={14} /> Support Ticket Created
                </span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '18px' }}>
                  Ticket Reference: {ticketSubmitted}
                </h3>
                <p style={{ margin: '0 0 16px', color: '#475569' }}>
                  Our senior relationship manager has received your inquiry and will revert within 4 business hours.
                </p>
                <button type="button" className="portal-btn-outline" onClick={() => setTicketSubmitted(null)}>
                  Raise Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} style={{ marginBottom: '32px' }}>
                <div className="portal-form-grid">
                  <div className="portal-form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Satya Sharma" 
                      required 
                      value={ticketData.name}
                      onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                    />
                  </div>
                  <div className="portal-form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      placeholder="10-digit mobile number" 
                      required
                      value={ticketData.phone}
                      onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                    />
                  </div>
                  <div className="portal-form-group">
                    <label>Inquiry Topic</label>
                    <select 
                      value={ticketData.category}
                      onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                    >
                      <option>Policy Endorsement / Nominee Change</option>
                      <option>Tax Deduction Certificate (80D / 80C)</option>
                      <option>Payment Receipt & Invoice</option>
                      <option>Cashless Hospital Network Lookup</option>
                      <option>Policy Cancellation / Freelook Request</option>
                    </select>
                  </div>
                </div>

                <div className="portal-form-group" style={{ marginBottom: '20px' }}>
                  <label>Describe your query</label>
                  <textarea 
                    rows="3" 
                    placeholder="Provide details about your policy or query..."
                    value={ticketData.message}
                    onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="portal-btn-primary portal-btn-purple">
                  <FiSend size={16} /> Submit Support Request
                </button>
              </form>
            )}

            {/* Quick FAQs */}
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '24px 0 16px' }}>Frequently Asked Help Topics</h3>
            <div className="faq-list">
              {[
                { q: 'How do I download my 80D medical insurance tax deduction receipt?', a: 'You can download your official 80D tax certificate anytime from the "My Policies" tab above or through the link sent to your registered email.' },
                { q: 'What is the Free-Look period for newly purchased policies?', a: 'As per IRDAI guidelines, all life and health policies bought online come with a 30-day Free-Look period during which you can review terms and request a 100% refund with zero penalties.' },
                { q: 'How can I change the registered nominee on my life insurance policy?', a: 'Simply submit a service ticket above with nominee name, relation, and date of birth, along with a self-attested Aadhaar copy of the nominee.' }
              ].map((faq, i) => (
                <div key={i} className="faq-item" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  <div className="faq-q">
                    <span>{faq.q}</span>
                    <span>{activeFaq === i ? '−' : '+'}</span>
                  </div>
                  {activeFaq === i && <div className="faq-a">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Communication Preferences */}
        {activeTab === 'preferences' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-green">
                  <FiSettings size={20} />
                </div>
                <div>
                  <h2>Manage Communication Preferences</h2>
                  <p>Choose how and when you receive policy renewals, claim progress, and statements.</p>
                </div>
              </div>
            </div>

            {prefSaved && (
              <div style={{ background: '#ecfdf5', color: '#047857', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', fontWeight: '600' }}>
                <FiCheckCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Preferences successfully saved to your SafeLife profile!
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>WhatsApp Instant Alerts</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Receive policy PDF bonds, renewal reminders, and claim tracker updates directly on WhatsApp.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.whatsapp} 
                  onChange={(e) => setPreferences({ ...preferences, whatsapp: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>SMS Critical Notifications</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Payment confirmations, OTPs, and expiry alert SMS.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.sms} 
                  onChange={(e) => setPreferences({ ...preferences, sms: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Email Reports & Certificates</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Annual 80D/80C tax deduction certificates and detailed coverage terms.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.email} 
                  onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Special Discounts & Promotional Offers</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Occasional updates on zero-cost riders and exclusive partner discounts.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={preferences.promotions} 
                  onChange={(e) => setPreferences({ ...preferences, promotions: e.target.checked })}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </label>

              <button 
                type="button" 
                className="portal-btn-primary portal-btn-purple"
                style={{ width: 'fit-content', marginTop: '10px' }}
                onClick={savePreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Verify Advisor */}
        {activeTab === 'advisor' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-purple">
                  <FiUserCheck size={20} />
                </div>
                <div>
                  <h2>IRDAI Advisor Verification Portal</h2>
                  <p>Verify whether the person assisting you is an authorized, licensed SafeLife representative.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleVerifyAdvisor} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', maxWidth: '520px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  value={advisorId}
                  onChange={(e) => setAdvisorId(e.target.value)}
                  placeholder="Enter Advisor ID (e.g. ADV-8832) or Mobile Number"
                  style={{
                    flex: '1',
                    padding: '12px 16px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '14.5px'
                  }}
                />
                <button type="submit" className="portal-btn-primary portal-btn-purple">
                  Verify Credentials
                </button>
              </div>
            </form>

            {advisorResult && (
              <div className="portal-result-box" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                <div className="portal-result-header">
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800' }}>
                      {advisorResult.name}
                    </h3>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      SafeLife Employee ID: <strong>{advisorResult.id}</strong>
                    </span>
                  </div>
                  <span className="status-badge-active" style={{ background: '#f3e8ff', color: '#7e22ce' }}>
                    <FiShield size={14} /> Official IRDAI Authorized
                  </span>
                </div>

                <div className="portal-meta-grid" style={{ marginTop: '16px' }}>
                  <div className="meta-item">
                    <span>IRDAI Registration #</span>
                    <strong>{advisorResult.irdaiLicense}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Advisory Domain</span>
                    <strong>{advisorResult.specialization}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Experience with SafeLife</span>
                    <strong>{advisorResult.experience}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Verification Status</span>
                    <strong style={{ color: '#059669' }}>{advisorResult.status}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Contact SafeLife */}
        {activeTab === 'contact' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-green">
                  <FiPhoneCall size={20} />
                </div>
                <div>
                  <h2>Contact SafeLife Support Team</h2>
                  <p>Choose how you would like to connect with our dedicated customer advisory team.</p>
                </div>
              </div>
            </div>

            <div className="info-cards-grid" style={{ marginBottom: '32px' }}>
              <div className="info-feature-box">
                <div className="portal-icon-pill pill-green">
                  <BsWhatsapp size={20} color="#22c55e" />
                </div>
                <div>
                  <h4>WhatsApp Instant Chat</h4>
                  <p>Chat with a live SafeLife insurance expert for quotes, renewal payment links, or claims.</p>
                  <a 
                    href="https://api.whatsapp.com/send?phone=919876543210&text=Hi%20SafeLife%2C%20I%20need%20assistance%20with%20insurance" 
                    target="_blank" 
                    rel="noreferrer"
                    className="portal-btn-primary portal-btn-green"
                    style={{ marginTop: '12px', fontSize: '13.5px', padding: '8px 16px' }}
                  >
                    Launch WhatsApp Chat
                  </a>
                </div>
              </div>

              <div className="info-feature-box">
                <div className="portal-icon-pill pill-blue">
                  <FiPhoneCall size={20} color="#2563eb" />
                </div>
                <div>
                  <h4>Toll-Free Customer Care</h4>
                  <p>General Policy Support: <strong>1800-208-8787</strong><br/>Emergency Claims: <strong>1800-258-5881</strong></p>
                  <a 
                    href="tel:18002088787"
                    className="portal-btn-primary"
                    style={{ marginTop: '12px', fontSize: '13.5px', padding: '8px 16px' }}
                  >
                    Call Toll Free Now
                  </a>
                </div>
              </div>
            </div>

            {/* Instant 5-Minute Callback Form */}
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800' }}>Request an Instant 5-Minute Callback</h3>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b' }}>Our specialist will call you right back on your phone.</p>

              {callbackSubmitted ? (
                <div className="portal-result-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                  <span className="status-badge-active">
                    <FiCheckCircle size={14} /> Callback Queued
                  </span>
                  <p style={{ margin: '8px 0 0', fontWeight: '700', color: '#047857' }}>
                    Calling {callbackData.phone} in approximately 3-5 minutes!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit}>
                  <div className="portal-form-grid">
                    <div className="portal-form-group">
                      <label>Your Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Satya" 
                        required
                        value={callbackData.name}
                        onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                      />
                    </div>
                    <div className="portal-form-group">
                      <label>Your Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="10-digit mobile number" 
                        required
                        value={callbackData.phone}
                        onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                      />
                    </div>
                    <div className="portal-form-group">
                      <label>Topic for Discussion</label>
                      <select 
                        value={callbackData.topic}
                        onChange={(e) => setCallbackData({ ...callbackData, topic: e.target.value })}
                      >
                        <option>Renewal Payment Assistance</option>
                        <option>Filing a Cashless Hospital Claim</option>
                        <option>New Policy Recommendation</option>
                        <option>Policy Endorsement & Nominee</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="portal-btn-primary portal-btn-purple">
                    Request Immediate Callback <FiArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Nearest Branch Hubs */}
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '24px 0 16px' }}>SafeLife Regional Customer Hubs</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {hubs.map((hub, i) => (
                <div key={i} className="meta-item" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FiMapPin size={18} color="#2563eb" />
                    <strong style={{ fontSize: '16px' }}>{hub.city} Customer Hub</strong>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>{hub.address}</p>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Phone: {hub.phone}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default SupportPortal;
