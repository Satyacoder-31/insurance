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
  FiHelpCircle
} from 'react-icons/fi';
import { RiHospitalLine, RiCustomerService2Line } from 'react-icons/ri';
import { FaHeartbeat } from 'react-icons/fa';

export const AdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'proposals';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

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

  // Status changers
  const handleProposalStatusChange = (id, newStatus) => {
    adminStore.updateProposalStatus(id, newStatus);
    refreshData();
  };

  const handleClaimStatusChange = (claimId, newStatus) => {
    adminStore.updateClaimStatus(claimId, newStatus);
    refreshData();
  };

  const handleTicketStatusChange = (ticketId, newStatus) => {
    adminStore.updateTicketStatus(ticketId, newStatus);
    refreshData();
  };

  const handleCallbackStatusChange = (callbackId, newStatus) => {
    adminStore.updateCallbackStatus(callbackId, newStatus);
    refreshData();
  };

  // CSV Export
  const handleExportCSV = () => {
    let rows = [];
    let filename = `SafeLife-Admin-${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'proposals') {
      rows.push(['Application ID', 'Customer Name', 'Phone', 'Policy Type', 'Insurer', 'Sum Insured', 'Premium', 'Status', 'Date']);
      proposals.forEach(p => {
        rows.push([p.id, p.customerName, p.phone, p.policyType, p.insurer, p.sumInsured, p.premium, p.status, p.createdAt]);
      });
    } else if (activeTab === 'claims') {
      rows.push(['Claim ID', 'Patient Name', 'Phone', 'Policy No', 'Insurer', 'Hospital', 'Amount', 'Status', 'Date']);
      claims.forEach(c => {
        rows.push([c.claimId, c.patientName, c.phone, c.policyNumber, c.insurer, c.hospitalName, c.estimatedAmount, c.status, c.createdAt]);
      });
    } else if (activeTab === 'support') {
      rows.push(['Ticket ID', 'Customer Name', 'Phone', 'Category', 'Priority', 'Status', 'Date']);
      tickets.forEach(t => {
        rows.push([t.ticketId, t.customerName, t.phone, t.category, t.priority, t.status, t.createdAt]);
      });
    } else {
      rows.push(['Renewal ID', 'Policy No', 'Customer Name', 'Category', 'Insurer', 'Premium Paid', 'NCB Discount', 'Status']);
      renewals.forEach(r => {
        rows.push([r.renewalId, r.policyNumber, r.customerName, r.category, r.insurer, r.finalPremium, r.ncbDiscount, r.status]);
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

  // Filtered Proposals
  const filteredProposals = proposals.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchQuery = (p.customerName || '').toLowerCase().includes(q) ||
                       (p.phone || '').includes(q) ||
                       (p.id || '').toLowerCase().includes(q) ||
                       (p.insurer || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchType = typeFilter === 'ALL' || (p.policyType || '').includes(typeFilter);
    return matchQuery && matchStatus && matchType;
  });

  // Filtered Claims
  const filteredClaims = claims.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQuery = (c.patientName || '').toLowerCase().includes(q) ||
                       (c.claimId || '').toLowerCase().includes(q) ||
                       (c.phone || '').includes(q) ||
                       (c.hospitalName || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Filtered Tickets
  const filteredTickets = tickets.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchQuery = (t.customerName || '').toLowerCase().includes(q) ||
                       (t.ticketId || '').toLowerCase().includes(q) ||
                       (t.category || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Filtered Renewals
  const filteredRenewals = renewals.filter(r => {
    const q = searchQuery.toLowerCase();
    return (r.customerName || '').toLowerCase().includes(q) ||
           (r.policyNumber || '').toLowerCase().includes(q) ||
           (r.renewalId || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-layout">
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

      {/* Navigation Tabs */}
      <nav className="admin-nav-strip">
        <button 
          className={`admin-tab-item ${activeTab === 'proposals' ? 'active' : ''}`}
          onClick={() => handleTabChange('proposals')}
        >
          <FiFileText size={18} />
          <span>Insurance Proposals & Forms</span>
          <span className="admin-tab-count">{proposals.length}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => handleTabChange('claims')}
        >
          <FiShield size={18} />
          <span>Claims Desk</span>
          <span className="admin-tab-count">{claims.length}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => handleTabChange('support')}
        >
          <RiCustomerService2Line size={18} />
          <span>Support & Callbacks</span>
          <span className="admin-tab-count">{tickets.length + callbacks.length}</span>
        </button>

        <button 
          className={`admin-tab-item ${activeTab === 'renewals' ? 'active' : ''}`}
          onClick={() => handleTabChange('renewals')}
        >
          <FiRefreshCw size={18} />
          <span>Policy Renewals</span>
          <span className="admin-tab-count">{renewals.length}</span>
        </button>
      </nav>

      {/* Main Container */}
      <main className="admin-container">
        {/* Top Metrics Cards */}
        <section className="admin-metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box metric-blue">
              <FiFileText />
            </div>
            <div className="metric-data">
              <h4>Total Proposals</h4>
              <strong>{metrics.totalApplications || proposals.length}</strong>
              <span className="metric-sub">Forms Submitted by Users</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-green">
              <FiShield />
            </div>
            <div className="metric-data">
              <h4>Active Claims</h4>
              <strong>{metrics.totalClaims || claims.length}</strong>
              <span className="metric-sub">{metrics.pendingClaims || 0} Pending Verification</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-purple">
              <RiCustomerService2Line />
            </div>
            <div className="metric-data">
              <h4>Support Queue</h4>
              <strong>{(metrics.openTickets || 0) + (metrics.pendingCallbacks || 0)}</strong>
              <span className="metric-sub">{metrics.pendingCallbacks || 0} Callbacks Requested</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box metric-amber">
              <FiDollarSign />
            </div>
            <div className="metric-data">
              <h4>Total Volume</h4>
              <strong>₹ {((metrics.totalPremiumVolume || 65000) / 1000).toFixed(1)}k</strong>
              <span className="metric-sub">Across All Policies & Renewals</span>
            </div>
          </div>
        </section>

        {/* TAB 1: INSURANCE PROPOSALS / FORMS */}
        {activeTab === 'proposals' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search customer, phone, policy ID..." 
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
                  <option value="Submitted">Submitted</option>
                  <option value="Quote Generated">Quote Generated</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Policy Issued & Paid">Policy Issued & Paid</option>
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
                          <span className="admin-id-pill">{p.id}</span>
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
                            <option value="Submitted">Submitted</option>
                            <option value="Quote Generated">Quote Generated</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Policy Issued & Paid">Policy Issued & Paid</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td>
                          <button 
                            className="admin-btn-action admin-btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => { setActiveModalItem(p); setModalType('proposal'); }}
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

        {/* TAB 2: CLAIMS DESK */}
        {activeTab === 'claims' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search claim ID, patient, hospital..." 
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
                  <option value="Escalated by SafeLife Advocate">Escalated</option>
                  <option value="Settled">Settled</option>
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
                    <th>Claim Type</th>
                    <th>Est. Amount / Settled</th>
                    <th>Live Claim Status</th>
                    <th>Surveyor / TPA Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="admin-empty-state">
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
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.phone}</div>
                        </td>
                        <td>
                          <strong>{c.policyNumber}</strong>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.insurer}</div>
                        </td>
                        <td>
                          {c.hospitalName}
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Adm: {c.admissionDate}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#93c5fd' }}>{c.claimType}</span>
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
                            <option value="Escalated by SafeLife Advocate">Escalated</option>
                            <option value="Settled">Settled</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td style={{ maxWidth: '180px', fontSize: '12px', color: '#94a3b8' }}>
                          {c.surveyorNotes || 'Assigned to on-ground claim advocate.'}
                        </td>
                        <td>
                          <button 
                            className="admin-btn-action admin-btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => { setActiveModalItem(c); setModalType('claim'); }}
                          >
                            <FiEye size={14} />
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

        {/* TAB 3: SUPPORT & CALLBACKS */}
        {activeTab === 'support' && (
          <div>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
              Customer Service Tickets ({tickets.length})
            </h3>
            <div className="admin-table-wrapper" style={{ marginBottom: '32px', borderRadius: '14px' }}>
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Inquiry Category</th>
                    <th>Message Details</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t, i) => (
                    <tr key={i}>
                      <td><span className="admin-id-pill" style={{ color: '#c084fc' }}>{t.ticketId}</span></td>
                      <td><strong>{t.customerName}</strong></td>
                      <td>{t.phone}</td>
                      <td><strong style={{ color: '#93c5fd' }}>{t.category}</strong></td>
                      <td style={{ maxWidth: '280px', fontSize: '13px', color: '#cbd5e1' }}>{t.message}</td>
                      <td>
                        <span className={`badge-status ${t.priority === 'High' ? 'badge-rejected' : 'badge-pending'}`}>
                          {t.priority}
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
                        </select>
                      </td>
                      <td>
                        <button 
                          className="admin-btn-action" 
                          style={{ padding: '6px 12px', fontSize: '12px', background: '#059669' }}
                          onClick={() => handleTicketStatusChange(t.ticketId, 'Resolved')}
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Callbacks Section */}
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
              Instant 5-Minute Callback Requests ({callbacks.length})
            </h3>
            <div className="admin-table-wrapper" style={{ borderRadius: '14px' }}>
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Callback ID</th>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Consultation Topic</th>
                    <th>Requested At</th>
                    <th>Call Status</th>
                    <th>Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {callbacks.map((cb, i) => (
                    <tr key={i}>
                      <td><span className="admin-id-pill">{cb.callbackId}</span></td>
                      <td><strong>{cb.customerName}</strong></td>
                      <td>
                        <a href={`tel:${cb.phone}`} style={{ color: '#60a5fa', fontWeight: '700' }}>
                          <FiPhoneCall size={12} style={{ marginRight: '4px' }} /> {cb.phone}
                        </a>
                      </td>
                      <td>{cb.topic}</td>
                      <td style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(cb.createdAt).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge-status ${cb.status === 'Completed' ? 'badge-approved' : 'badge-review'}`}>
                          {cb.status}
                        </span>
                      </td>
                      <td>
                        {cb.status === 'Pending' ? (
                          <button 
                            className="admin-btn-action" 
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            onClick={() => handleCallbackStatusChange(cb.callbackId, 'Completed')}
                          >
                            Mark Called
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#34d399' }}>✓ Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: POLICY RENEWALS */}
        {activeTab === 'renewals' && (
          <div>
            <div className="admin-toolbar">
              <div className="toolbar-search">
                <FiSearch size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search renewal ID, policy number..." 
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

      {/* Detail Modal */}
      {activeModalItem && (
        <div className="admin-modal-overlay" onClick={() => setActiveModalItem(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === 'proposal' ? `Proposal Details: ${activeModalItem.id}` : `Claim Details: ${activeModalItem.claimId}`}
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModalItem(null)}>
                <FiX />
              </button>
            </div>

            {modalType === 'proposal' && (
              <div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Customer Name</label>
                    <p>{activeModalItem.customerName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Mobile Number</label>
                    <p>{activeModalItem.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email Address</label>
                    <p>{activeModalItem.email || 'Not Provided'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Policy Type</label>
                    <p>{activeModalItem.policyType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Insurer</label>
                    <p>{activeModalItem.insurer}</p>
                  </div>
                  <div className="detail-item">
                    <label>Sum Insured</label>
                    <p>{activeModalItem.sumInsured}</p>
                  </div>
                  <div className="detail-item">
                    <label>Annual Premium</label>
                    <p>₹ {Number(activeModalItem.premium || 0).toLocaleString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <p style={{ color: '#34d399' }}>{activeModalItem.status}</p>
                  </div>
                </div>

                <div className="detail-box-full">
                  <label>Insured Members & Dependents</label>
                  <p>{activeModalItem.members || 'Primary Policyholder'}</p>
                </div>

                <div className="detail-box-full">
                  <label>Medical Declarations & Pre-Existing Conditions</label>
                  <p>{activeModalItem.preExistingDiseases || 'None declared during underwriting.'}</p>
                </div>

                <div className="detail-box-full">
                  <label>Lifestyle & Habits</label>
                  <p>{activeModalItem.smokingAlcohol || 'Standard Risk Profile'}</p>
                </div>
              </div>
            )}

            {modalType === 'claim' && (
              <div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Claim ID</label>
                    <p>{activeModalItem.claimId}</p>
                  </div>
                  <div className="detail-item">
                    <label>Patient / Claimant</label>
                    <p>{activeModalItem.patientName}</p>
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
                    <label>Hospital / Garage</label>
                    <p>{activeModalItem.hospitalName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date of Incident</label>
                    <p>{activeModalItem.admissionDate}</p>
                  </div>
                  <div className="detail-item">
                    <label>Approved Amount</label>
                    <p style={{ color: '#34d399' }}>{activeModalItem.approvedAmount || activeModalItem.estimatedAmount}</p>
                  </div>
                </div>

                <div className="detail-box-full">
                  <label>Surveyor & Cashless Advocate Notes</label>
                  <p>{activeModalItem.surveyorNotes || 'On-ground TPA coordination in progress.'}</p>
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
