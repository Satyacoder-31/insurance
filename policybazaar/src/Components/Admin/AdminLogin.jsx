import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './AdminLogin.css';
import adminStore, { defaultAdminAccounts } from '../../services/adminStore';
import safelifeLogo from '../../assets/images/safelife-logo.svg';
import {
  FiShield,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiUserCheck,
  FiUserPlus,
  FiKey,
  FiActivity,
  FiCheck
} from 'react-icons/fi';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to admin panel
  useEffect(() => {
    const currentAdmin = adminStore.getActiveAdmin();
    if (currentAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register New Admin Modal State
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Medical Underwriter',
    department: 'Underwriting Desk'
  });
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Available predefined individual accounts
  const [adminAccounts, setAdminAccounts] = useState([]);

  useEffect(() => {
    setAdminAccounts(adminStore.getAdminAccounts());
  }, []);

  // Quick fill individual credentials
  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage('');
  };

  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const verified = adminStore.authenticateAdmin(email, password);

      if (verified) {
        adminStore.setActiveAdmin(verified, rememberMe);
        setSuccessMessage(`Access Granted. Welcome, ${verified.name} (${verified.role})`);
        setIsLoading(false);
        setTimeout(() => {
          navigate('/admin');
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid administrator credentials. Please check your email and password or use the credential selector below.');
      }
    }, 600);
  };

  const handleRegisterNewAdmin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) {
      alert('Please fill all administrator fields.');
      return;
    }

    const created = adminStore.createAdminAccount({
      name: newAdmin.name.trim(),
      email: newAdmin.email.trim(),
      password: newAdmin.password,
      role: newAdmin.role,
      department: newAdmin.department
    });

    setAdminAccounts(adminStore.getAdminAccounts());
    setRegisterSuccess(`New administrator account created for ${created.name}! Credentials ready.`);
    
    // Auto fill form with new credentials
    setEmail(created.email);
    setPassword(created.password);

    setTimeout(() => {
      setShowRegisterModal(false);
      setRegisterSuccess('');
    }, 1500);
  };

  return (
    <div className="admin-login-wrapper">
      {/* Background Ambient Glow */}
      <div className="admin-login-glow-1"></div>
      <div className="admin-login-glow-2"></div>

      {/* Top Header Bar */}
      <div className="admin-login-topbar">
        <div className="admin-login-brand">
          <Link to="/">
            <img src={safelifeLogo} alt="SafeLife" className="admin-login-logo" />
          </Link>
          <span className="admin-login-badge">Staff Security Gateway</span>
        </div>

        <Link to="/" className="admin-return-link">
          <FiArrowLeft size={14} /> Back to Customer Site
        </Link>
      </div>

      {/* Main Container */}
      <div className="admin-login-container">
        {/* Left Side: Security Assurance & Role Details */}
        <div className="admin-login-hero">
          <div className="security-shield-badge">
            <FiShield size={20} color="#3b82f6" />
            <span>Authorized Operations Gateway</span>
          </div>

          <h1>Executive Control & Policy Administration</h1>
          <p>
            Secure, audited authentication for SafeLife Medical Underwriters, Claims Settlement Officers, 
            and Operations Executives.
          </p>

          <div className="security-features-list">
            <div className="security-feature-item">
              <div className="feature-icon-box">
                <FiCheckCircle color="#34d399" size={16} />
              </div>
              <div>
                <strong>Role-Based Underwriting Authority</strong>
                <span>Individual credentials with granular permissions for approvals and policy issuance.</span>
              </div>
            </div>

            <div className="security-feature-item">
              <div className="feature-icon-box">
                <FiLock color="#60a5fa" size={16} />
              </div>
              <div>
                <strong>256-Bit Encrypted Session</strong>
                <span>All underwriter notes, KYC checks, and customer medical dossiers are cryptographically protected.</span>
              </div>
            </div>

            <div className="security-feature-item">
              <div className="feature-icon-box">
                <FiActivity color="#fbbf24" size={16} />
              </div>
              <div>
                <strong>Real-time Telemetry & Audit Trail</strong>
                <span>Every approval, status transition, and note is stamped with the acting administrator's staff ID.</span>
              </div>
            </div>
          </div>

          {/* Quick Pre-Configured Individual Credentials Preview */}
          <div className="individual-credentials-box">
            <div className="credentials-box-header">
              <FiKey size={14} color="#fbbf24" />
              <span>Available Individual Staff Credentials:</span>
            </div>
            <div className="credentials-chips-grid">
              {adminAccounts.map((acc, i) => (
                <div 
                  key={i} 
                  className={`credential-chip ${email === acc.email ? 'active' : ''}`}
                  onClick={() => handleQuickFill(acc)}
                  title={`Click to fill credentials for ${acc.name}`}
                >
                  <span className="chip-avatar">{acc.avatar || '👤'}</span>
                  <div className="chip-text">
                    <strong>{acc.name}</strong>
                    <span>{acc.role}</span>
                  </div>
                  <span className="chip-action-hint">Use</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="admin-login-card-box">
          <div className="login-card-header">
            <div className="login-icon-avatar">
              <FiLock size={24} color="#3b82f6" />
            </div>
            <h2>Sign in to Operations Console</h2>
            <p>Enter your individual administrator credentials to access pending forms, claims, and policy issuance.</p>
          </div>

          {errorMessage && (
            <div className="admin-login-alert alert-error">
              <FiAlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="admin-login-alert alert-success">
              <FiCheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group-field">
              <label>Administrator Email / Staff ID</label>
              <div className="input-with-icon">
                <FiMail size={16} className="field-icon" />
                <input 
                  type="email" 
                  placeholder="e.g. underwriter@safelife.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group-field">
              <div className="label-row">
                <label>Security Password</label>
                <span className="hint-label">Individual Credential</span>
              </div>
              <div className="input-with-icon">
                <FiLock size={16} className="field-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter individual password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-options-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this workstation</span>
              </label>

              <button 
                type="button" 
                className="btn-link-action"
                onClick={() => setShowRegisterModal(true)}
              >
                + Register New Admin
              </button>
            </div>

            <button 
              type="submit" 
              className="btn-admin-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Verifying Security Clearance...</span>
              ) : (
                <>
                  <span>Access Admin Operations Console</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint Reference */}
          <div className="credentials-reference-footer">
            <div className="ref-title">Quick Test Credentials (Pre-Configured):</div>
            <div className="ref-grid">
              <div onClick={() => handleQuickFill(adminAccounts[0] || defaultAdminAccounts[0])}>
                <span>Underwriter:</span> <code>underwriter@safelife.com</code> / <code>Underwrite#2026</code>
              </div>
              <div onClick={() => handleQuickFill(adminAccounts[1] || defaultAdminAccounts[1])}>
                <span>Super Admin:</span> <code>admin@safelife.com</code> / <code>Admin@2026</code>
              </div>
              <div onClick={() => handleQuickFill(adminAccounts[2] || defaultAdminAccounts[2])}>
                <span>Claims Officer:</span> <code>claims@safelife.com</code> / <code>Claims#2026</code>
              </div>
              <div onClick={() => handleQuickFill(adminAccounts[3] || defaultAdminAccounts[3])}>
                <span>Support Lead:</span> <code>support@safelife.com</code> / <code>Support#2026</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register New Admin Staff Modal */}
      {showRegisterModal && (
        <div className="admin-modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="register-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="register-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiUserPlus size={20} color="#3b82f6" />
                <h3>Provision New Administrator Account</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowRegisterModal(false)}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
              Create an individual administrator profile with dedicated credentials and designated operational authority.
            </p>

            {registerSuccess && (
              <div className="admin-login-alert alert-success" style={{ marginBottom: '16px' }}>
                <FiCheckCircle size={18} />
                <span>{registerSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterNewAdmin} className="register-form">
              <div className="form-group-field">
                <label>Staff Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Rajesh Khanna" 
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-field">
                <label>Official Staff Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. rajesh.khanna@safelife.com" 
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-field">
                <label>Security Password</label>
                <input 
                  type="text" 
                  placeholder="e.g. SafeLifePass#2026" 
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-dual">
                <div className="form-group-field">
                  <label>Designated Role</label>
                  <select 
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                  >
                    <option value="Senior Medical Underwriter">Senior Medical Underwriter</option>
                    <option value="Executive Super Admin">Executive Super Admin</option>
                    <option value="Chief Claims Officer">Chief Claims Officer</option>
                    <option value="Customer Support Lead">Customer Support Lead</option>
                    <option value="Compliance & Fraud Auditor">Compliance & Fraud Auditor</option>
                  </select>
                </div>

                <div className="form-group-field">
                  <label>Department</label>
                  <select 
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({ ...newAdmin, department: e.target.value })}
                  >
                    <option value="Underwriting Desk">Underwriting Desk</option>
                    <option value="Executive Operations">Executive Operations</option>
                    <option value="TPA & Claims Desk">TPA & Claims Desk</option>
                    <option value="Customer Experience">Customer Experience</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="admin-btn-back"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-admin-login-submit"
                  style={{ width: 'auto', padding: '10px 20px' }}
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
