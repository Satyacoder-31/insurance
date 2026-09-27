import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import './Portals.css';
import { 
  RiFileTextLine, 
  RiCheckboxCircleLine, 
  RiInformationLine, 
  RiSearchLine,
  RiHospitalLine,
  RiTimeLine,
  RiShieldCheckLine
} from 'react-icons/ri';
import { 
  FiCheckCircle, 
  FiPhoneCall, 
  FiUploadCloud, 
  FiArrowRight, 
  FiAlertCircle, 
  FiDownload 
} from 'react-icons/fi';
import adminStore from '../../services/adminStore';

export const ClaimPortal = () => {
  const { action } = useParams();
  const [searchParams] = useSearchParams();

  const getTabFromUrl = () => {
    const raw = action || searchParams.get('tab') || '';
    if (raw.includes('already') || raw.includes('insurer')) return 'already-filed';
    if (raw.includes('filing') || raw.includes('know') || raw.includes('guide')) return 'guide';
    if (raw.includes('track')) return 'track';
    return 'new-claim';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  
  // Track claim state
  const [trackQuery, setTrackQuery] = useState('CLM-2026-8841');
  const [trackedClaim, setTrackedClaim] = useState({
    claimId: 'CLM-2026-8841',
    patientName: 'Krishnakumar S.',
    hospitalName: 'Apollo Speciality Hospitals, Chennai',
    insurer: 'Star Health Insurance',
    estimatedAmount: '₹ 1,85,000',
    settledAmount: '₹ 1,85,000 (Cashless Pre-Auth Approved)',
    currentStep: 3,
    steps: [
      { title: 'Claim Lodged', date: '24 Sep 2026, 10:15 AM', done: true },
      { title: 'Documents Verified', date: '24 Sep 2026, 11:30 AM', done: true },
      { title: '30-Min On-Ground Support', date: '24 Sep 2026, 12:00 PM', done: true },
      { title: 'Cashless Approval Dispatched', date: '24 Sep 2026, 01:10 PM', done: true }
    ]
  });

  // New claim form state
  const [claimType, setClaimType] = useState('Cashless Hospitalization');
  const [formData, setFormData] = useState({
    policyNumber: '',
    patientName: '',
    hospitalName: '',
    admissionDate: '',
    estimatedAmount: '',
    contactNumber: ''
  });
  const [newClaimSubmitted, setNewClaimSubmitted] = useState(null);

  // Already filed state
  const [insurerRef, setInsurerRef] = useState('');
  const [alreadyFiledSuccess, setAlreadyFiledSuccess] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [action, searchParams]);

  const handleNewClaimSubmit = (e) => {
    e.preventDefault();
    const generatedId = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewClaimSubmitted({
      claimId: generatedId,
      type: claimType,
      patient: formData.patientName || 'Policyholder',
      hospital: formData.hospitalName || 'Network Healthcare Provider',
      contact: formData.contactNumber || '9876543210'
    });

    // Save claim into admin store
    adminStore.saveClaim({
      claimId: generatedId,
      claimType: claimType,
      policyNumber: formData.policyNumber || 'POL-SH-928172',
      patientName: formData.patientName || 'Policyholder',
      hospitalName: formData.hospitalName || 'Network Healthcare Provider',
      admissionDate: formData.admissionDate || new Date().toISOString().split('T')[0],
      phone: formData.contactNumber || '9876543210',
      estimatedAmount: formData.estimatedAmount || '₹ 1,50,000',
      status: 'Claim Lodged',
      surveyorNotes: '30-minute cashless advocate assigned.'
    });
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackQuery) return;
    setTrackedClaim({
      claimId: trackQuery,
      patientName: 'Satya Sharma',
      hospitalName: 'Fortis Memorial Healthcare',
      insurer: 'HDFC ERGO Health',
      estimatedAmount: '₹ 1,20,000',
      settledAmount: 'Under Final Surveyor Review (Estimated clearance: 2 hours)',
      currentStep: 2,
      steps: [
        { title: 'Claim Lodged', date: 'Yesterday, 02:40 PM', done: true },
        { title: 'Documents Verified', date: 'Yesterday, 04:15 PM', done: true },
        { title: 'Medical Review & TPA Query', date: 'Today, 10:00 AM', done: false },
        { title: 'Final Settlement Dispatched', date: 'Expected Today', done: false }
      ]
    });
  };

  const handleAlreadyFiledSubmit = (e) => {
    e.preventDefault();
    if (!insurerRef) return;
    setAlreadyFiledSuccess(true);

    adminStore.saveClaim({
      claimId: insurerRef,
      claimType: 'Insurer Direct Escalation',
      policyNumber: 'Existing Partner Policy',
      patientName: 'Policyholder',
      hospitalName: 'Network Center',
      admissionDate: new Date().toISOString().split('T')[0],
      phone: '9876543210',
      status: 'Escalated by SafeLife Advocate',
      surveyorNotes: 'Nodal officer notified for expedite review.'
    });
  };

  return (
    <div className="portal-page-container">
      {/* Hero Header */}
      <section className="portal-hero hero-claim">
        <div className="portal-hero-content">
          <div className="portal-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Claims Assistance Portal</span>
          </div>
          <h1>SafeLife 24x7 Claims Assistance</h1>
          <p>
            Experience India's smoothest cashless claim assistance. Our dedicated on-ground claim managers 
            arrive at your hospital within 30 minutes to manage paperwork and fast-track approvals.
          </p>

          <div className="portal-hero-stats">
            <div className="hero-stat-badge">
              <RiHospitalLine size={16} /> 14,000+ Cashless Hospitals
            </div>
            <div className="hero-stat-badge">
              <RiTimeLine size={16} /> 30-Minute On-Ground Guarantee
            </div>
            <div className="hero-stat-badge">
              <RiShieldCheckLine size={16} /> 99.2% Claim Settlement Ratio
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="portal-main-wrapper">
        {/* Navigation Tabs */}
        <div className="portal-tabs-bar">
          <button 
            className={`portal-tab-btn ${activeTab === 'new-claim' ? 'active tab-claim' : ''}`}
            onClick={() => setActiveTab('new-claim')}
          >
            <RiFileTextLine size={18} /> File a New Claim
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'already-filed' ? 'active tab-claim' : ''}`}
            onClick={() => setActiveTab('already-filed')}
          >
            <RiCheckboxCircleLine size={18} /> Already Filed with Insurer
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'track' ? 'active tab-claim' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <RiSearchLine size={18} /> Track Existing Claim
          </button>
          <button 
            className={`portal-tab-btn ${activeTab === 'guide' ? 'active tab-claim' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            <RiInformationLine size={18} /> Know More About Claims
          </button>
        </div>

        {/* Tab 1: File a New Claim */}
        {activeTab === 'new-claim' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-green">
                  <RiFileTextLine size={20} />
                </div>
                <div>
                  <h2>Submit a New Claim Intimation</h2>
                  <p>Intimate your hospitalization or vehicle incident for 30-minute cashless clearance assistance.</p>
                </div>
              </div>
            </div>

            {newClaimSubmitted ? (
              <div className="portal-result-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
                <div className="portal-result-header">
                  <div>
                    <span className="status-badge-active">
                      <FiCheckCircle size={14} /> Claim Intimation Registered Successfully
                    </span>
                    <h3 style={{ margin: '8px 0 4px', fontSize: '20px', color: '#065f46' }}>
                      Claim Reference ID: {newClaimSubmitted.claimId}
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#047857' }}>
                      A dedicated SafeLife Claim Specialist has been assigned to your case and is contacting {newClaimSubmitted.contact}.
                    </p>
                  </div>
                </div>

                <div className="portal-meta-grid" style={{ marginTop: '16px' }}>
                  <div className="meta-item">
                    <span>Patient / Claimant</span>
                    <strong>{newClaimSubmitted.patient}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Facility / Hospital</span>
                    <strong>{newClaimSubmitted.hospital}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Claim Classification</span>
                    <strong>{newClaimSubmitted.type}</strong>
                  </div>
                  <div className="meta-item">
                    <span>On-Ground SLA</span>
                    <strong style={{ color: '#059669' }}>Within 30 Minutes</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    className="portal-btn-outline"
                    onClick={() => { setNewClaimSubmitted(null); setFormData({ policyNumber: '', patientName: '', hospitalName: '', admissionDate: '', estimatedAmount: '', contactNumber: '' }); }}
                  >
                    File Another Claim
                  </button>
                  <button 
                    type="button" 
                    className="portal-btn-primary portal-btn-green"
                    onClick={() => { setTrackQuery(newClaimSubmitted.claimId); setActiveTab('track'); }}
                  >
                    Track This Claim <FiArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewClaimSubmit}>
                <div className="portal-form-grid">
                  <div className="portal-form-group">
                    <label>Claim Category</label>
                    <select value={claimType} onChange={(e) => setClaimType(e.target.value)}>
                      <option value="Cashless Hospitalization">Cashless Hospitalization (Health)</option>
                      <option value="Hospital Reimbursement">Medical Reimbursement (Health)</option>
                      <option value="Accidental Damage">Motor & Vehicle Damage (General)</option>
                      <option value="Life Term Insurance Claim">Life & Term Insurance Claim</option>
                    </select>
                  </div>

                  <div className="portal-form-group">
                    <label>Policy Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SL-90823412" 
                      required
                      value={formData.policyNumber}
                      onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                    />
                  </div>

                  <div className="portal-form-group">
                    <label>Patient / Insured Name</label>
                    <input 
                      type="text" 
                      placeholder="Full Name as on Policy" 
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    />
                  </div>

                  <div className="portal-form-group">
                    <label>Hospital or Network Center</label>
                    <input 
                      type="text" 
                      placeholder="Hospital Name & City" 
                      required
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    />
                  </div>

                  <div className="portal-form-group">
                    <label>Date of Admission / Incident</label>
                    <input 
                      type="date" 
                      required
                      value={formData.admissionDate}
                      onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    />
                  </div>

                  <div className="portal-form-group">
                    <label>Mobile Number for Updates</label>
                    <input 
                      type="tel" 
                      placeholder="10-digit Mobile Number" 
                      required
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="submit" className="portal-btn-primary portal-btn-green">
                    Submit Claim Request <FiArrowRight size={18} />
                  </button>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Emergency Helpline: <strong>1800-258-5881</strong> (24x7 Instant Toll-Free)
                  </span>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Already Filed with Insurer */}
        {activeTab === 'already-filed' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-purple">
                  <RiCheckboxCircleLine size={20} />
                </div>
                <div>
                  <h2>Already Filed Directly with Insurer?</h2>
                  <p>Escalate your existing insurer claim through SafeLife's Priority Relationship Desk.</p>
                </div>
              </div>
            </div>

            {alreadyFiledSuccess ? (
              <div className="portal-result-box">
                <div className="portal-result-header">
                  <span className="status-badge-active">
                    <FiCheckCircle size={14} /> Escalation Ticket Created
                  </span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>
                  SafeLife Advocate Assigned for Claim #{insurerRef}
                </h3>
                <p style={{ margin: '0 0 16px', color: '#475569', fontSize: '14px' }}>
                  We have taken up your claim directly with the insurance provider's nodal officer. 
                  You will receive an update via WhatsApp and SMS within 2 hours.
                </p>
                <button type="button" className="portal-btn-outline" onClick={() => { setAlreadyFiledSuccess(false); setInsurerRef(''); }}>
                  Submit Another Reference
                </button>
              </div>
            ) : (
              <form onSubmit={handleAlreadyFiledSubmit}>
                <div className="portal-form-grid">
                  <div className="portal-form-group">
                    <label>Insurer Claim / Pre-Auth Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. STAR-CLM-99120" 
                      required
                      value={insurerRef}
                      onChange={(e) => setInsurerRef(e.target.value)}
                    />
                  </div>
                  <div className="portal-form-group">
                    <label>Insurance Provider</label>
                    <select>
                      <option>Star Health Insurance</option>
                      <option>Care Health Insurance</option>
                      <option>HDFC ERGO Health</option>
                      <option>ICICI Prudential Life</option>
                      <option>Tata AIG General</option>
                      <option>Other Authorized Partner</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="portal-btn-primary portal-btn-purple">
                  Assign SafeLife Claim Advocate <FiArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Track Existing Claim */}
        {activeTab === 'track' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-blue">
                  <RiSearchLine size={20} />
                </div>
                <div>
                  <h2>Live Claim Status Tracker</h2>
                  <p>Track your claim review, surveyor inspection, and cashless payment disbursement in real-time.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleTrackSubmit} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', maxWidth: '520px', flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter Claim ID (e.g. CLM-2026-8841)"
                  style={{
                    flex: '1',
                    padding: '12px 16px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '10px',
                    fontSize: '14.5px'
                  }}
                />
                <button type="submit" className="portal-btn-primary">
                  Track Status
                </button>
              </div>
            </form>

            {trackedClaim && (
              <div className="portal-result-box">
                <div className="portal-result-header">
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800' }}>
                      Claim ID: {trackedClaim.claimId}
                    </h3>
                    <span style={{ fontSize: '13.5px', color: '#64748b' }}>
                      Patient: <strong>{trackedClaim.patientName}</strong> | Hospital: <strong>{trackedClaim.hospitalName}</strong>
                    </span>
                  </div>
                  <span className="status-badge-active">
                    <FiCheckCircle size={14} /> In Active Processing
                  </span>
                </div>

                {/* Stepper Progress */}
                <div className="stepper-container">
                  {trackedClaim.steps.map((st, i) => (
                    <div 
                      key={i} 
                      className={`stepper-step ${st.done ? 'completed' : i === trackedClaim.currentStep ? 'active' : ''}`}
                    >
                      <div className="stepper-icon-circle">
                        {st.done ? <FiCheckCircle size={20} /> : i + 1}
                      </div>
                      <div className="stepper-title">{st.title}</div>
                      <div className="stepper-date">{st.date}</div>
                    </div>
                  ))}
                </div>

                <div className="portal-meta-grid" style={{ marginTop: '24px' }}>
                  <div className="meta-item">
                    <span>Approved Claim Amount</span>
                    <strong style={{ color: '#059669', fontSize: '16px' }}>{trackedClaim.settledAmount}</strong>
                  </div>
                  <div className="meta-item">
                    <span>Insurer Partner</span>
                    <strong>{trackedClaim.insurer}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Know More About Claims */}
        {activeTab === 'guide' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <div className="portal-card-title">
                <div className="portal-icon-pill pill-amber">
                  <RiInformationLine size={20} />
                </div>
                <div>
                  <h2>Understanding the Claims Process</h2>
                  <p>Step-by-step guidance on Cashless vs. Reimbursement claims.</p>
                </div>
              </div>
            </div>

            <div className="info-cards-grid">
              <div className="info-feature-box">
                <div className="portal-icon-pill pill-green">
                  <RiHospitalLine size={20} />
                </div>
                <div>
                  <h4>1. Cashless Hospitalization</h4>
                  <p>Show your SafeLife Health Card at the hospital TPA desk 48 hours prior to planned admission, or within 24 hours of emergency admission. Zero hospital bill out-of-pocket!</p>
                </div>
              </div>

              <div className="info-feature-box">
                <div className="portal-icon-pill pill-blue">
                  <RiFileTextLine size={20} />
                </div>
                <div>
                  <h4>2. Reimbursement Claims</h4>
                  <p>If treated at a non-network hospital, pay bills upfront and submit original bills, discharge summary, and pharmacy receipts within 30 days for direct bank reimbursement.</p>
                </div>
              </div>

              <div className="info-feature-box">
                <div className="portal-icon-pill pill-purple">
                  <RiTimeLine size={20} />
                </div>
                <div>
                  <h4>3. 30-Minute On-Ground Support</h4>
                  <p>SafeLife claim advocates arrive physically at premier network hospitals across 60+ major Indian cities to liaise with TPA authorities on your behalf.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Help Banner */}
        <div className="contact-hub-card" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)' }}>
          <div className="contact-hub-left">
            <h3>24x7 SafeLife Claims Emergency Helpline</h3>
            <p>Immediate 30-minute cashless assistance: <strong>1800-258-5881</strong> (Toll Free)</p>
          </div>
          <div className="contact-hub-actions">
            <a href="tel:18002585881" className="portal-btn-primary portal-btn-green">
              <FiPhoneCall size={16} /> Call Emergency Claims Desk
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
export default ClaimPortal;
