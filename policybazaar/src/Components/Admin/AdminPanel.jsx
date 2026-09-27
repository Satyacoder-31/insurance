import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './AdminPanel.css';
import adminStore from '../../services/adminStore';
import safelifeLogo from '../../assets/images/safelife-logo.svg';
import {
  FiShield,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiPhoneCall,
  FiSearch,
  FiDownload,
  FiFilter,
  FiEye,
  FiX,
  FiRefreshCw,
  FiTrendingUp,
  FiDollarSign,
  FiAlertCircle,
  FiArrowLeft,
  FiUser,
  FiHelpCircle,
  FiCheck,
  FiAlertTriangle,
  FiHeart,
  FiUsers,
  FiCreditCard,
  FiSave,
  FiActivity
} from 'react-icons/fi';
import { RiHospitalLine, RiCustomerService2Line, RiTimeLine } from 'react-icons/ri';
import { FaHeartbeat } from 'react-icons/fa';

export const AdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'pending-forms';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  // Live state from adminStore
  const [proposals, setProposals] = useState([]);
  const [claims, setClaims] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [callbacks, setCallbacks] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [metrics, setMetrics] = useState({});

  // Modal details state
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'proposal' | 'claim' | 'ticket'
  const [editingNote, setEditingNote] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshData = () => {
    setProposals(adminStore.getProposals());
    setClaims(adminStore.getClaims());
    setTickets(adminStore.getTickets());
    setCallbacks(adminStore.getCallbacks());
    setRenewals(adminStore.getRenewals());
    setMetrics(adminStore.getMetrics());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setSearchQuery('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
  };

  // Status changers for proposals
  const handleProposalStatusChange = (id, newStatus) => {
    adminStore.updateProposalStatus(id, newStatus);
    refreshData();
    showToast(`Application #${id} status changed to "${newStatus}"`);
    if (activeModalItem && activeModalItem.id === id) {
      setActiveModalItem(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Save Underwriter Note
  const handleSaveProposalNote = (id) => {
    adminStore.updateProposalNote(id, editingNote);
    refreshData();
    showToast(`Underwriting note saved for Application #${id}`);
    if (activeModalItem && activeModalItem.id === id) {
      setActiveModalItem(prev => ({ ...prev, adminNote: editingNote }));
    }
  };

  const handleClaimStatusChange = (claimId, newStatus) => {
    adminStore.updateClaimStatus(claimId, newStatus);
    refreshData();
    showToast(`Claim #${claimId} status updated to "${newStatus}"`);
  };

  const handleTicketStatusChange = (ticketId, newStatus) => {
    adminStore.updateTicketStatus(ticketId, newStatus);
    refreshData();
    showToast(`Support Ticket #${ticketId} marked as "${newStatus}"`);
  };

  const handleCallbackStatusChange = (callbackId, newStatus) => {
    adminStore.updateCallbackStatus(callbackId, newStatus);
    refreshData();
    showToast(`Callback #${callbackId} marked as "${newStatus}"`);
  };

  // Open modal with item
  const openModal = (item, type) => {
    setActiveModalItem(item);
    setModalType(type);
    if (type === 'proposal') {
      setEditingNote(item.adminNote || '');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    let rows = [];
    let filename = `SafeLife-Admin-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'pending-forms' || activeTab === 'approved-forms' || activeTab === 'proposals') {
      rows.push(['App ID', 'Customer Name', 'Phone', 'Email', 'City', 'Policy Type', 'Insurer', 'Sum Insured', 'Premium', 'Status', 'Date']);
      const listToExport = activeTab === 'pending-forms' ? pendingProposals : activeTab === 'approved-forms' ? approvedProposals : filteredProposals;
      listToExport.forEach(p => {
        rows.push([p.id, p.customerName, p.phone, p.email || 'N/A', p.city || 'N/A', p.policyType, p.insurer, p.sumInsured, p.premium, p.status, p.createdAt]);
      });
    } else if (activeTab === 'claims') {
      rows.push(['Claim ID', 'Patient Name', 'Phone', 'Policy No', 'Insurer', 'Hospital', 'Est Amount', 'Approved Amount', 'Status', 'Date']);
      claims.forEach(c => {
        rows.push([c.claimId, c.patientName, c.phone, c.policyNumber, c.insurer, c.hospitalName, c.estimatedAmount, c.approvedAmount || 'Pending', c.status, c.createdAt]);
      });
    } else if (activeTab === 'support') {
      rows.push(['Ticket ID', 'Customer Name', 'Phone', 'Email', 'Category', 'Priority', 'Status', 'Date']);
      tickets.forEach(t => {
        rows.push([t.ticketId, t.customerName, t.phone, t.email || 'N/A', t.category, t.priority, t.status, t.createdAt]);
      });
    } else {
      rows.push(['Renewal ID', 'Policy No', 'Customer Name', 'Phone', 'Category', 'Insurer', 'Sum Insured', 'Final Premium', 'NCB Discount', 'Status']);
      renewals.forEach(r => {
        rows.push([r.renewalId, r.policyNumber, r.customerName, r.phone, r.category, r.insurer, r.sumInsured, r.finalPremium, r.ncbDiscount, r.status]);
      });
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper filters
  const matchesGlobalQuery = (item, q) => {
    if (!q) return true;
    const str = `${item.id || ''} ${item.customerName || item.patientName || ''} ${item.phone || ''} ${item.email || ''} ${item.policyNumber || ''} ${item.panNumber || ''} ${item.insurer || ''} ${item.city || ''} ${item.hospitalName || ''}`.toLowerCase();
    return str.includes(q.toLowerCase());
  };

  // Pending Proposals List
  const pendingProposals = proposals.filter(p => {
    const isPend = adminStore.isPending(p.status);
    const matchQ = matchesGlobalQuery(p, searchQuery);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchType = typeFilter === 'ALL' || (p.policyType || '').includes(typeFilter);
    return isPend && matchQ && matchStatus && matchType;
  });

  // Approved Proposals List
  const approvedProposals = proposals.filter(p => {
    const isAppr = adminStore.isApproved(p.status);
    const matchQ = matchesGlobalQuery(p, searchQuery);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchType = typeFilter === 'ALL' || (p.policyType || '').includes(typeFilter);
    return isAppr && matchQ && matchStatus && matchType;
  });

  // Master Proposals List
  const filteredProposals = proposals.filter(p => {
    const matchQ = matchesGlobalQuery(p, searchQuery);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchType = typeFilter === 'ALL' || (p.policyType || '').includes(typeFilter);
    return matchQ && matchStatus && matchType;
  });

  // Filtered Claims
  const filteredClaims = claims.filter(c => {
    const matchQ = matchesGlobalQuery(c, searchQuery);
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchQ && matchStatus;
  });

  // Filtered Tickets
  const filteredTickets = tickets.filter(t => {
    const matchQ = matchesGlobalQuery(t, searchQuery);
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchQ && matchStatus;
  });

  // Filtered Callbacks
  const filteredCallbacks = callbacks.filter(cb => {
    const matchQ = matchesGlobalQuery(cb, searchQuery);
    return matchQ;
  });

  // Filtered Renewals
  const filteredRenewals = renewals.filter(r => {
    return matchesGlobalQuery(r, searchQuery);
  });

  const pendingCount = proposals.filter(p => adminStore.isPending(p.status)).length;
  const approvedCount = proposals.filter(p => adminStore.isApproved(p.status)).length;

  return (
    <div className="admin-layout">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <FiCheckCircle size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <Link to="/">
            <img src={safelifeLogo} alt="SafeLife" className="admin-logo-img" />
          </Link>
          <span className="admin-badge-role">Operations Control Center</span>
          <div className="admin-live-pill">
            <span className="admin-live-dot"></span> Real-time Sync Active
          </div>
        </div>

        <div className="admin-top-actions">
          <button className="admin-btn-back" onClick={refreshData} title="Refresh Live Database">
            <FiRefreshCw size={14} /> Refresh Data
          </button>
          <Link to="/" className="admin-btn-back">
            <FiArrowLeft size={14} /> Back to Customer Site
          </Link>
        </div>
      </header>

      {/* Navigation Tabs - Explicit Sections for Pending & Approved Forms */}
      <nav className="admin-nav-strip">
        <button 
          className={`admin-tab-item tab-pending ${activeTab === 'pending-forms' ? 'active' : ''}`}
          onClick={() => handleTabChange('pending-forms')}
        >
          <FiClock size={17} />
          <span>Pending Insurance Forms</span>
          <span className="admin-tab-count badge-count-pending">{pendingCount}</span>
        </button>

        <button 
          className={`admin-tab-item tab-approved ${activeTab === 'approved-forms' ? 'active' : ''}`}
          onClick={() => handleTabChange('approved-forms')}
        >
          <FiCheckCircle size={17} />
          <span>Approved Insurance Forms</span>
          <span className="admin-tab-count badge-count-approved">{approvedCount}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'proposals' ? 'active' : ''}`}
          onClick={() => handleTabChange('proposals')}
        >
          <FiFileText size={17} />
          <span>All Proposals Ledger</span>
          <span className="admin-tab-count">{proposals.length}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => handleTabChange('claims')}
        >
          <FiShield size={17} />
          <span>Claims Desk</span>
          <span className="admin-tab-count">{claims.length}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => handleTabChange('support')}
        >
          <RiCustomerService2Line size={17} />
          <span>Support & Callbacks</span>
          <span className="admin-tab-count">{tickets.length + callbacks.length}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'renewals' ? 'active' : ''}`}
          onClick={() => handleTabChange('renewals')}
        >
          <FiRefreshCw size={17} />
          <span>Policy Renewals</span>
          <span className="admin-tab-count">{renewals.length}</span>
        </button>
      </nav>

      {/* Main Container */}
      <main className="admin-container">
        {/* Quick KPI Cards - Clickable for Simple Navigation */}
        <section className="admin-metrics-grid">
          <div className="metric-card metric-card-interactive" onClick={() => handleTabChange('pending-forms')}>
            <div className="metric-icon-box metric-amber">
              <FiClock />
            </div>
            <div className="metric-data">
              <h4>Pending Forms</h4>
              <strong style={{ color: '#fbbf24' }}>{pendingCount}</strong>
              <span className="metric-sub">Awaiting Review & Approval</span>
            </div>
          </div>

          <div className="metric-card metric-card-interactive" onClick={() => handleTabChange('approved-forms')}>
            <div className="metric-icon-box metric-green">
              <FiCheckCircle />
            </div>
            <div className="metric-data">
              <h4>Approved Policies</h4>
              <strong style={{ color: '#34d399' }}>{approvedCount}</strong>
              <span className="metric-sub">Verified & Active Policies</span>
            </div>
          </div>

          <div className="metric-card metric-card-interactive" onClick={() => handleTabChange('claims')}>
            <div className="metric-icon-box metric-blue">
              <FiShield />
            </div>
            <div className="metric-data">
              <h4>Active Claims</h4>
              <strong>{metrics.totalClaims || claims.length}</strong>
              <span className="metric-sub">{metrics.pendingClaims || 0} Under TPA Verification</span>
            </div>
          </div>

          <div className="metric-card metric-card-interactive" onClick={() => handleTabChange('support')}>
            <div className="metric-icon-box metric-purple">
              <RiCustomerService2Line />
            </div>
            <div className="metric-data">
              <h4>Support Tickets</h4>
              <strong>{metrics.openTickets || tickets.length}</strong>
              <span className="metric-sub">{callbacks.filter(c => c.status === 'Pending').length} Pending Callbacks</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-emerald">
              <FiTrendingUp />
            </div>
            <div className="metric-data">
              <h4>Gross Premium</h4>
              <strong style={{ fontSize: '20px', color: '#10b981' }}>
                ₹ {Number(metrics.totalPremiumVolume || 0).toLocaleString()}
              </strong>
              <span className="metric-sub">Direct Online Inflows</span>
            </div>
          </div>
        </section>

        {/* SECTION 1: PENDING INSURANCE FORMS */}
        {activeTab === 'pending-forms' && (
          <div>
            <div className="section-banner banner-pending">
              <div className="banner-text">
                <span className="banner-tag">Action Required</span>
                <h3>⏳ Pending Insurance Forms ({pendingProposals.length})</h3>
                <p>Applications submitted by customers awaiting underwriting validation, medical declaration review, or final approval.</p>
              </div>
              <div className="banner-stats">
                <span className="quick-tip-pill">⚡ Simple Operation: Use the 1-click [✓ Approve] or [✗ Reject] buttons below</span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search customer, phone, PAN, city, plan..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-filters">
                <select 
                  className="admin-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Policy Categories</option>
                  <option value="Health">Health Insurance</option>
                  <option value="Life">Life & Term Insurance</option>
                  <option value="General">General / Motor</option>
                </select>

                <select 
                  className="admin-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Pending Statuses</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Quote Generated">Quote Generated</option>
                </select>

                <button className="admin-btn-action admin-btn-secondary" onClick={handleExportCSV}>
                  <FiDownload size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Customer & Identity</th>
                    <th>Cover & Plan Opted</th>
                    <th>Insured Members & Dependents</th>
                    <th>Medical & Risk Disclosures</th>
                    <th>Premium</th>
                    <th>Live Status</th>
                    <th>1-Click Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProposals.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="admin-empty-state">
                        <FiCheckCircle size={32} color="#10b981" />
                        <p>All caught up! Zero pending insurance applications.</p>
                      </td>
                    </tr>
                  ) : (
                    pendingProposals.map((p, i) => (
                      <tr key={i} className="row-pending">
                        <td>
                          <span className="admin-id-pill pill-amber">{p.id}</span>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                            {new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '14px', color: '#f8fafc' }}>
                            {p.title ? `${p.title}. ` : ''}{p.customerName}
                          </strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.phone} • {p.gender || 'Not specified'} {p.age ? `(${p.age} yrs)` : ''}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {p.city ? `${p.city}` : ''} {p.panNumber ? `• PAN: ${p.panNumber}` : ''}
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#93c5fd' }}>{p.planName}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.insurer} ({p.policyType})
                          </div>
                          <div style={{ fontSize: '12px', color: '#a78bfa', fontWeight: '600' }}>
                            Cover: {p.sumInsured}
                          </div>
                        </td>
                        <td style={{ maxWidth: '200px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>
                            {p.members || 'Primary Applicant'}
                          </div>
                          {p.nominee && (
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                              Nominee: {p.nominee.fullName} ({p.nominee.relationship})
                            </div>
                          )}
                        </td>
                        <td style={{ maxWidth: '220px' }}>
                          <span className="risk-tag">
                            {p.preExistingDiseases || 'None declared'}
                          </span>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                            {p.smokingAlcohol || 'Standard profile'}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '15px', color: '#fbbf24' }}>
                            ₹ {Number(p.premium || 0).toLocaleString()}
                          </strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>/year</div>
                        </td>
                        <td>
                          <span className="badge-status badge-review">
                            <FiClock size={12} /> {p.status}
                          </span>
                        </td>
                        <td>
                          <div className="quick-action-cluster">
                            <button 
                              className="btn-quick-action btn-quick-approve" 
                              title="1-Click Approve Application"
                              onClick={() => handleProposalStatusChange(p.id, 'Approved')}
                            >
                              <FiCheck size={14} /> Approve
                            </button>
                            <button 
                              className="btn-quick-action btn-quick-review" 
                              title="Mark for Senior Medical Underwriter Review"
                              onClick={() => handleProposalStatusChange(p.id, 'Under Review')}
                            >
                              <FiClock size={13} /> Review
                            </button>
                            <button 
                              className="btn-quick-action btn-quick-reject" 
                              title="Reject Application"
                              onClick={() => handleProposalStatusChange(p.id, 'Rejected')}
                            >
                              <FiX size={13} />
                            </button>
                            <button 
                              className="btn-quick-action btn-quick-view" 
                              title="Open Full Detailed Policyholder Dossier"
                              onClick={() => openModal(p, 'proposal')}
                            >
                              <FiEye size={14} /> Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: APPROVED INSURANCE FORMS */}
        {activeTab === 'approved-forms' && (
          <div>
            <div className="section-banner banner-approved">
              <div className="banner-text">
                <span className="banner-tag" style={{ background: '#059669' }}>Active Policies</span>
                <h3>✅ Approved & Issued Insurance Policies ({approvedProposals.length})</h3>
                <p>Fully underwritten, approved, and active policies. Complete customer records with full policy dossiers.</p>
              </div>
              <div className="banner-stats">
                <span className="approved-stat-pill">
                  Total Volume: ₹ {approvedProposals.reduce((sum, p) => sum + (Number(p.premium) || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search policyholder, ID, PAN, insurer..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-filters">
                <select 
                  className="admin-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Health">Health Insurance</option>
                  <option value="Life">Life & Term Cover</option>
                  <option value="General">General / Motor</option>
                </select>

                <button className="admin-btn-action admin-btn-secondary" onClick={handleExportCSV}>
                  <FiDownload size={14} /> Export Approved CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Policy / App ID</th>
                    <th>Policyholder Name & Contact</th>
                    <th>Insurer & Plan Details</th>
                    <th>Sum Insured</th>
                    <th>Annual Premium Paid</th>
                    <th>Payment Audit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedProposals.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="admin-empty-state">
                        <FiAlertCircle size={32} color="#94a3b8" />
                        <p>No approved policies found matching criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    approvedProposals.map((p, i) => (
                      <tr key={i} className="row-approved">
                        <td>
                          <span className="admin-id-pill pill-green">{p.id}</span>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                            Issued: {new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '14px', color: '#f8fafc' }}>
                            {p.customerName}
                          </strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.phone} • {p.email || 'customer@example.com'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {p.city || 'N/A'} {p.panNumber ? `• PAN: ${p.panNumber}` : ''}
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#93c5fd' }}>{p.planName}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.insurer} ({p.policyType})
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '14px', color: '#f1f5f9' }}>{p.sumInsured}</strong>
                        </td>
                        <td>
                          <strong style={{ fontSize: '15px', color: '#34d399' }}>
                            ₹ {Number(p.premium || 0).toLocaleString()}
                          </strong>
                          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>Paid & Reconciled</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
                            {p.payment ? `${p.payment.method} (${p.payment.bank || 'Direct'})` : 'Online Payment'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'JetBrains Mono' }}>
                            {p.payment && p.payment.transactionId ? p.payment.transactionId : 'TXN-ONLINE'}
                          </div>
                        </td>
                        <td>
                          <span className="badge-status badge-approved">
                            <FiCheckCircle size={12} /> {p.status}
                          </span>
                        </td>
                        <td>
                          <div className="quick-action-cluster">
                            <button 
                              className="btn-quick-action btn-quick-view" 
                              onClick={() => openModal(p, 'proposal')}
                              title="Inspect Complete Policyholder Dossier"
                            >
                              <FiEye size={14} /> Full Dossier
                            </button>
                            <button 
                              className="btn-quick-action btn-quick-review" 
                              onClick={() => handleProposalStatusChange(p.id, 'Under Review')}
                              title="Re-open for Underwriting Audit"
                            >
                              ↩ Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: ALL PROPOSALS LEDGER */}
        {activeTab === 'proposals' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search all proposals by name, phone, PAN, ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-filters">
                <select 
                  className="admin-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Health">Health Insurance</option>
                  <option value="Life">Life & Term Insurance</option>
                  <option value="General">General Insurance</option>
                </select>

                <select 
                  className="admin-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Approved">Approved</option>
                  <option value="Policy Issued & Paid">Policy Issued & Paid</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button className="admin-btn-action admin-btn-secondary" onClick={handleExportCSV}>
                  <FiDownload size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Customer Name & Contact</th>
                    <th>Policy Opted</th>
                    <th>Cover & Premium</th>
                    <th>City / Pincode</th>
                    <th>Underwriting Declarations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProposals.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="admin-empty-state">
                        <FiAlertCircle size={28} />
                        <p>No insurance proposal forms matching the filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProposals.map((p, i) => (
                      <tr key={i}>
                        <td>
                          <span className={`admin-id-pill ${adminStore.isApproved(p.status) ? 'pill-green' : adminStore.isPending(p.status) ? 'pill-amber' : ''}`}>
                            {p.id}
                          </span>
                        </td>
                        <td>
                          <strong>{p.customerName}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.phone} • {p.gender || 'Not Specified'}
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: '#93c5fd' }}>{p.planName}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {p.insurer} ({p.policyType})
                          </div>
                        </td>
                        <td>
                          <strong>{p.sumInsured}</strong>
                          <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '700' }}>
                            ₹ {Number(p.premium || 0).toLocaleString()}/yr
                          </div>
                        </td>
                        <td>
                          {p.city || 'N/A'}
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{p.pincode}</div>
                        </td>
                        <td style={{ maxWidth: '200px' }}>
                          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                            {p.preExistingDiseases || 'None'}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="status-dropdown"
                            value={p.status}
                            onChange={(e) => handleProposalStatusChange(p.id, e.target.value)}
                          >
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Approved">Approved</option>
                            <option value="Policy Issued & Paid">Policy Issued & Paid</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="admin-btn-action admin-btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => openModal(p, 'proposal')}
                          >
                            <FiEye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 4: CLAIMS DESK */}
        {activeTab === 'claims' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search claim ID, patient, hospital, insurer..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-filters">
                <select 
                  className="admin-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Claim Statuses</option>
                  <option value="Claim Lodged">Claim Lodged</option>
                  <option value="Documents Under Verification">Under Verification</option>
                  <option value="Cashless Approved">Cashless Approved</option>
                  <option value="Surveyor Approved">Surveyor Approved</option>
                  <option value="Settled">Settled</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button className="admin-btn-action admin-btn-secondary" onClick={handleExportCSV}>
                  <FiDownload size={14} /> Export Claims CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Patient & Contact</th>
                    <th>Policy & Insurer</th>
                    <th>Hospital / Facility</th>
                    <th>Diagnosis / Reason</th>
                    <th>Est. Amount / Settled</th>
                    <th>Live Claim Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="admin-empty-state">
                        <FiAlertCircle size={28} />
                        <p>No claims matching the criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredClaims.map((c, i) => (
                      <tr key={i}>
                        <td>
                          <span className="admin-id-pill" style={{ color: '#34d399', borderColor: '#10b98140' }}>
                            {c.claimId}
                          </span>
                        </td>
                        <td>
                          <strong>{c.patientName}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            {c.phone} {c.relationship ? `(${c.relationship})` : ''}
                          </div>
                        </td>
                        <td>
                          <strong>{c.policyNumber}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.insurer}</div>
                        </td>
                        <td>
                          <strong>{c.hospitalName}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Adm: {c.admissionDate}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#93c5fd' }}>{c.diagnosis || c.claimType}</span>
                        </td>
                        <td>
                          <strong>{c.estimatedAmount}</strong>
                          <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '700' }}>
                            {c.approvedAmount || 'Pending'}
                          </div>
                        </td>
                        <td>
                          <select 
                            className="status-dropdown"
                            value={c.status}
                            onChange={(e) => handleClaimStatusChange(c.claimId, e.target.value)}
                          >
                            <option value="Claim Lodged">Claim Lodged</option>
                            <option value="Documents Under Verification">Under Verification</option>
                            <option value="Medical Review">Medical Review</option>
                            <option value="Cashless Approved">Cashless Approved</option>
                            <option value="Surveyor Approved">Surveyor Approved</option>
                            <option value="Settled">Settled</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="admin-btn-action admin-btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => openModal(c, 'claim')}
                          >
                            <FiEye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 5: SUPPORT & CALLBACKS */}
        {activeTab === 'support' && (
          <div>
            <div className="support-dual-grid">
              {/* Left Column: Tickets */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
                    Customer Support Tickets ({tickets.length})
                  </h3>
                  <button className="admin-btn-action admin-btn-secondary" style={{ padding: '6px 12px' }} onClick={handleExportCSV}>
                    <FiDownload size={13} /> Export Tickets
                  </button>
                </div>

                <div className="admin-table-wrapper" style={{ borderRadius: '14px', marginBottom: '28px' }}>
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Customer</th>
                        <th>Topic & Details</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((t, i) => (
                        <tr key={i}>
                          <td><span className="admin-id-pill" style={{ color: '#a78bfa' }}>{t.ticketId}</span></td>
                          <td>
                            <strong>{t.customerName}</strong>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{t.phone}</div>
                            {t.email && <div style={{ fontSize: '11px', color: '#64748b' }}>{t.email}</div>}
                          </td>
                          <td style={{ maxWidth: '220px' }}>
                            <strong style={{ color: '#93c5fd', fontSize: '12px' }}>{t.category}</strong>
                            <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>{t.message}</div>
                            {t.policyNumber && (
                              <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '2px' }}>
                                Ref Policy: {t.policyNumber}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={`badge-status ${t.priority === 'Critical' ? 'badge-rejected' : t.priority === 'High' ? 'badge-review' : 'badge-pending'}`}>
                              {t.priority || 'Normal'}
                            </span>
                          </td>
                          <td>
                            <select 
                              className="status-dropdown"
                              value={t.status}
                              onChange={(e) => handleTicketStatusChange(t.ticketId, e.target.value)}
                            >
                              <option value="Open">Open</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Callbacks */}
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
                  Scheduled Callbacks & Consultations ({callbacks.length})
                </h3>

                <div className="admin-table-wrapper" style={{ borderRadius: '14px' }}>
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Callback ID</th>
                        <th>Customer & Phone</th>
                        <th>Consultation Topic & Slot</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCallbacks.map((cb, i) => (
                        <tr key={i}>
                          <td><span className="admin-id-pill" style={{ color: '#fbbf24' }}>{cb.callbackId}</span></td>
                          <td>
                            <strong>{cb.customerName}</strong>
                            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: '600' }}>
                              <a href={`tel:${cb.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                📞 {cb.phone}
                              </a>
                            </div>
                            {cb.email && <div style={{ fontSize: '11px', color: '#64748b' }}>{cb.email}</div>}
                          </td>
                          <td>
                            <strong style={{ color: '#f1f5f9', fontSize: '12.5px' }}>{cb.topic}</strong>
                            {cb.timeSlot && (
                              <div style={{ fontSize: '11.5px', color: '#fbbf24', marginTop: '2px' }}>
                                ⏰ {cb.timeSlot}
                              </div>
                            )}
                            {cb.notes && (
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                Notes: {cb.notes}
                              </div>
                            )}
                          </td>
                          <td>
                            <span className={`badge-status ${cb.status === 'Completed' ? 'badge-approved' : 'badge-review'}`}>
                              {cb.status}
                            </span>
                          </td>
                          <td>
                            {cb.status === 'Pending' ? (
                              <button 
                                className="btn-quick-action btn-quick-approve"
                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                onClick={() => handleCallbackStatusChange(cb.callbackId, 'Completed')}
                              >
                                <FiCheck size={12} /> Mark Called
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#64748b' }}>Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: POLICY RENEWALS */}
        {activeTab === 'renewals' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search renewal ID, policy number, customer..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="toolbar-filters">
                <button className="admin-btn-action admin-btn-secondary" onClick={handleExportCSV}>
                  <FiDownload size={14} /> Export Renewals CSV
                </button>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Renewal ID</th>
                    <th>Policy Number</th>
                    <th>Customer Name & Contact</th>
                    <th>Category & Insurer</th>
                    <th>Sum Insured</th>
                    <th>Renewal Premium Paid</th>
                    <th>NCB Discount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRenewals.map((r, i) => (
                    <tr key={i}>
                      <td><span className="admin-id-pill" style={{ color: '#fbbf24' }}>{r.renewalId}</span></td>
                      <td><strong>{r.policyNumber}</strong></td>
                      <td>
                        <strong>{r.customerName}</strong>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.phone}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#93c5fd' }}>{r.category}</strong>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.insurer}</div>
                      </td>
                      <td>{r.sumInsured}</td>
                      <td>
                        <strong style={{ color: '#34d399', fontSize: '15px' }}>
                          ₹ {Number(r.finalPremium).toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '700' }}>
                          {r.ncbDiscount}
                        </span>
                      </td>
                      <td>
                        <span className="badge-status badge-approved">
                          <FiCheckCircle size={12} /> {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* COMPREHENSIVE POLICYHOLDER DOSSIER MODAL */}
      {activeModalItem && (
        <div className="admin-modal-overlay" onClick={() => setActiveModalItem(null)}>
          <div className="admin-modal-box dossier-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <span className="dossier-pill-type">
                  {modalType === 'proposal' ? activeModalItem.policyType || 'Insurance Application' : 'Claim Incident Dossier'}
                </span>
                <h3>
                  {modalType === 'proposal' ? `Application Dossier: ${activeModalItem.id}` : `Claim Dossier: ${activeModalItem.claimId}`}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {modalType === 'proposal' && (
                  <select 
                    className="status-dropdown"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                    value={activeModalItem.status}
                    onChange={(e) => handleProposalStatusChange(activeModalItem.id, e.target.value)}
                  >
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Policy Issued & Paid">Policy Issued & Paid</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}
                <button className="modal-close-btn" onClick={() => setActiveModalItem(null)}>
                  <FiX />
                </button>
              </div>
            </div>

            {modalType === 'proposal' && (
              <div className="dossier-content">
                {/* Section 1: Proposer & Identity Profile */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <FiUser size={16} color="#3b82f6" />
                    <h4>Applicant Demographic & Identity Profile (KYC)</h4>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Full Name</label>
                      <p>{activeModalItem.title ? `${activeModalItem.title}. ` : ''}{activeModalItem.customerName}</p>
                    </div>
                    <div className="detail-item">
                      <label>Gender & Age</label>
                      <p>{activeModalItem.gender || 'Not specified'} {activeModalItem.age ? `• ${activeModalItem.age} Years` : ''}</p>
                    </div>
                    <div className="detail-item">
                      <label>Date of Birth</label>
                      <p>{activeModalItem.dob || 'Not provided'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Contact Mobile</label>
                      <p>{activeModalItem.phone}</p>
                    </div>
                    <div className="detail-item">
                      <label>Email Address</label>
                      <p>{activeModalItem.email || 'Not provided'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Marital Status</label>
                      <p>{activeModalItem.maritalStatus || 'Married'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Occupation & Income</label>
                      <p>{activeModalItem.occupation || 'Salaried'} • {activeModalItem.annualIncome || 'Standard'}</p>
                    </div>
                    <div className="detail-item">
                      <label>PAN Card Number</label>
                      <p style={{ fontFamily: 'JetBrains Mono', color: '#93c5fd' }}>
                        {activeModalItem.panNumber || 'ABCDE1234F'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Aadhaar (Last 4)</label>
                      <p style={{ fontFamily: 'JetBrains Mono' }}>
                        •••• •••• {activeModalItem.aadhaarLast4 || '4921'}
                      </p>
                    </div>
                    <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                      <label>Full Residential Address</label>
                      <p>{activeModalItem.address || `${activeModalItem.city || 'Mumbai'}, ${activeModalItem.pincode || '400001'}`}</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Insured Members & Dependents */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <FiUsers size={16} color="#a78bfa" />
                    <h4>Insured Members & Covered Lives ({activeModalItem.membersList ? activeModalItem.membersList.length : 'Floater'})</h4>
                  </div>
                  
                  {activeModalItem.membersList && activeModalItem.membersList.length > 0 ? (
                    <div className="members-mini-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Relation</th>
                            <th>Age</th>
                            <th>Coverage Bracket</th>
                            <th>Underwriting Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeModalItem.membersList.map((m, idx) => (
                            <tr key={idx}>
                              <td><strong>{m.relation}</strong></td>
                              <td>{m.age} Years</td>
                              <td>{m.age >= 60 ? 'Senior Citizen Cover' : m.age < 18 ? 'Child Dependent Cover' : 'Adult Proposer Cover'}</td>
                              <td><span className="badge-status badge-approved">Eligible</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="detail-box-full" style={{ margin: 0 }}>
                      <p>{activeModalItem.members || 'Primary Proposer Self'}</p>
                    </div>
                  )}
                </div>

                {/* Section 3: Underwriting & Medical Disclosures */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <FiHeart size={16} color="#f43f5e" />
                    <h4>Underwriting, Medical History & Lifestyle Declarations</h4>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Pre-Existing Diseases</label>
                      <p style={{ color: activeModalItem.preExistingDiseases && activeModalItem.preExistingDiseases !== 'None' ? '#f87171' : '#34d399' }}>
                        {activeModalItem.preExistingDiseases || 'None declared'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Tobacco & Smoking Habits</label>
                      <p>{activeModalItem.underwriting ? `${activeModalItem.underwriting.tobacco} (${activeModalItem.underwriting.tobaccoFreq || 'N/A'})` : activeModalItem.smokingAlcohol || 'Non-smoker'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Alcohol Consumption</label>
                      <p>{activeModalItem.underwriting ? `${activeModalItem.underwriting.alcohol} (${activeModalItem.underwriting.alcoholFreq || 'N/A'})` : 'Non-consumer'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Hospitalization in Past 4 Years</label>
                      <p>{activeModalItem.underwriting ? activeModalItem.underwriting.hospitalizedPast4Years : 'No'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Regular Daily Medications</label>
                      <p>{activeModalItem.underwriting ? activeModalItem.underwriting.regularMedication : 'No'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Risk Underwriting Grade</label>
                      <p style={{ color: '#34d399', fontWeight: '800' }}>
                        {activeModalItem.underwriting ? activeModalItem.underwriting.riskRating : 'Standard Clean Profile'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Nominee & Appointee Information */}
                {activeModalItem.nominee && (
                  <div className="dossier-card">
                    <div className="dossier-card-title">
                      <FiUsers size={16} color="#fbbf24" />
                      <h4>Nominee & Appointee Information</h4>
                    </div>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Nominee Full Name</label>
                        <p>{activeModalItem.nominee.fullName}</p>
                      </div>
                      <div className="detail-item">
                        <label>Relationship with Insured</label>
                        <p>{activeModalItem.nominee.relationship}</p>
                      </div>
                      <div className="detail-item">
                        <label>Date of Birth & Age</label>
                        <p>{activeModalItem.nominee.dob} {activeModalItem.nominee.age ? `(${activeModalItem.nominee.age} yrs)` : ''}</p>
                      </div>
                      <div className="detail-item">
                        <label>Allocation Share</label>
                        <p style={{ color: '#34d399', fontWeight: '800' }}>{activeModalItem.nominee.share || '100%'}</p>
                      </div>
                      {activeModalItem.nominee.hasAppointee && (
                        <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                          <label>Minor Appointee Name & Relation</label>
                          <p>{activeModalItem.nominee.appointeeName} ({activeModalItem.nominee.appointeeRelation})</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section 5: Plan Architecture & Financials */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <FiCreditCard size={16} color="#10b981" />
                    <h4>Policy Architecture, Riders & Premium Breakdown</h4>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Insurer Partner</label>
                      <p>{activeModalItem.insurer}</p>
                    </div>
                    <div className="detail-item">
                      <label>Plan Name</label>
                      <p style={{ color: '#93c5fd' }}>{activeModalItem.planName}</p>
                    </div>
                    <div className="detail-item">
                      <label>Sum Insured / Cover</label>
                      <p style={{ color: '#f1f5f9', fontWeight: '800' }}>{activeModalItem.sumInsured}</p>
                    </div>
                    <div className="detail-item">
                      <label>Annual Premium Payable</label>
                      <p style={{ color: '#34d399', fontSize: '18px', fontWeight: '800' }}>
                        ₹ {Number(activeModalItem.premium || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {activeModalItem.riders && (
                    <div className="riders-summary-box">
                      <label>Selected Add-on Riders:</label>
                      <div className="riders-tags-row">
                        {activeModalItem.riders.criticalIllness && <span className="rider-pill">✓ Critical Illness Cover (₹499)</span>}
                        {activeModalItem.riders.hospitalCash && <span className="rider-pill">✓ Daily Hospital Cash (₹249)</span>}
                        {activeModalItem.riders.accidentalCover && <span className="rider-pill">✓ Personal Accident Shield (₹350)</span>}
                        {!activeModalItem.riders.criticalIllness && !activeModalItem.riders.hospitalCash && !activeModalItem.riders.accidentalCover && (
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Base Cover only</span>
                        )}
                      </div>
                    </div>
                  )}

                  {activeModalItem.payment && (
                    <div className="detail-box-full" style={{ margin: '14px 0 0' }}>
                      <label>Payment & Settlement Log</label>
                      <p>
                        Mode: <strong>{activeModalItem.payment.method}</strong> • Bank/UPI: {activeModalItem.payment.paymentIdentifier} • 
                        Txn ID: <code>{activeModalItem.payment.transactionId}</code> • Status: <span style={{ color: '#34d399', fontWeight: '700' }}>{activeModalItem.payment.status}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Section 6: Underwriter Operational Notes */}
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <FiActivity size={16} color="#fbbf24" />
                    <h4>Underwriter Internal Notes & Operational Controls</h4>
                  </div>
                  <div className="underwriter-notes-wrapper">
                    <textarea 
                      rows="3"
                      className="underwriter-textarea"
                      placeholder="Add an internal underwriter note or medical observation..."
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                    ></textarea>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      <button 
                        className="admin-btn-action" 
                        onClick={() => handleSaveProposalNote(activeModalItem.id)}
                      >
                        <FiSave size={14} /> Save Underwriting Note
                      </button>
                    </div>
                  </div>

                  <div className="dossier-meta-footer">
                    <span>Source: {activeModalItem.source || 'Online Portal'}</span>
                    <span>Submission Time: {new Date(activeModalItem.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'claim' && (
              <div className="dossier-content">
                <div className="dossier-card">
                  <div className="dossier-card-title">
                    <FiShield size={16} color="#10b981" />
                    <h4>Hospitalization & Claim Details</h4>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Claim ID</label>
                      <p style={{ color: '#34d399', fontFamily: 'JetBrains Mono' }}>{activeModalItem.claimId}</p>
                    </div>
                    <div className="detail-item">
                      <label>Patient / Claimant</label>
                      <p>{activeModalItem.patientName} {activeModalItem.relationship ? `(${activeModalItem.relationship})` : ''}</p>
                    </div>
                    <div className="detail-item">
                      <label>Policy Number</label>
                      <p>{activeModalItem.policyNumber}</p>
                    </div>
                    <div className="detail-item">
                      <label>Insurance Partner</label>
                      <p>{activeModalItem.insurer}</p>
                    </div>
                    <div className="detail-item">
                      <label>Claim Classification</label>
                      <p>{activeModalItem.claimType}</p>
                    </div>
                    <div className="detail-item">
                      <label>Hospital / Facility</label>
                      <p>{activeModalItem.hospitalName}</p>
                    </div>
                    <div className="detail-item">
                      <label>Attending Doctor</label>
                      <p>{activeModalItem.treatingDoctor || 'Dr. Designated Specialist'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Diagnosis / Reason</label>
                      <p style={{ color: '#93c5fd' }}>{activeModalItem.diagnosis || 'Hospitalization'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Date of Incident</label>
                      <p>{activeModalItem.admissionDate}</p>
                    </div>
                    <div className="detail-item">
                      <label>Estimated Amount</label>
                      <p>{activeModalItem.estimatedAmount}</p>
                    </div>
                    <div className="detail-item">
                      <label>Approved Amount</label>
                      <p style={{ color: '#34d399', fontWeight: '800' }}>
                        {activeModalItem.approvedAmount || activeModalItem.estimatedAmount}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Room Category</label>
                      <p>{activeModalItem.roomType || 'Private Room'}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-box-full">
                  <label>Surveyor & Cashless Advocate Notes</label>
                  <p>{activeModalItem.surveyorNotes || 'On-ground TPA coordination in progress. 30-minute SLA active.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
