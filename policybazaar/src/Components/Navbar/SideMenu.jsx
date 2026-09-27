import React from "react";
import { Link } from "react-router-dom";
import { FiX, FiShield, FiHeart, FiPhoneCall, FiUser, FiHelpCircle, FiCheckCircle, FiFileText, FiAward, FiRefreshCw } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import safelifeLogo from "../../assets/images/safelife-logo.svg";

const SideMenu = ({ setdisplay }) => {
  const dispatch = useDispatch();
  const loginStore = useSelector((st) => st?.login);
  const sessionUser = JSON.parse(sessionStorage.getItem("loggedInUserInfo")) || { isAuth: false, name: "" };
  const isAuth = loginStore?.isAuth ?? sessionUser?.isAuth ?? false;
  const userName = loginStore?.userData?.name || sessionUser?.name || "";

  const handleClose = () => {
    setdisplay(false);
  };

  const handleLogout = () => {
    const user = { isAuth: false, name: "", phoneNumber: "" };
    sessionStorage.setItem("loggedInUserInfo", JSON.stringify(user));
    dispatch({ type: "LOGOUT" });
    handleClose();
  };

  return (
    <div className="safelife-mobile-drawer-overlay" onClick={handleClose}>
      <aside className="safelife-mobile-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <Link to="/" onClick={handleClose}>
            <img src={safelifeLogo} alt="SafeLife" style={{ height: "38px", objectFit: "contain" }} />
          </Link>
          <button className="drawer-close-btn" onClick={handleClose} aria-label="Close menu">
            <FiX size={24} />
          </button>
        </div>

        {/* User Account Strip */}
        <div className="drawer-user-box">
          {isAuth ? (
            <div className="drawer-user-info">
              <div className="drawer-avatar">
                <FiUser size={18} />
              </div>
              <div className="drawer-user-text">
                <span className="drawer-user-welcome">Welcome back,</span>
                <span className="drawer-user-name">{userName || "Customer"}</span>
              </div>
              <button className="drawer-btn-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="drawer-btn-login" onClick={handleClose}>
              <FiUser size={16} /> Sign In to SafeLife
            </Link>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="drawer-content-scroll">
          <div className="drawer-section-title">Insurance Products</div>
          <div className="drawer-links-group">
            <Link to="/plans?category=life" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box icon-life">
                <FiShield size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Life & Term Insurance</strong>
                <span>ICICI Pru, HDFC, Axis Max, SBI</span>
              </div>
            </Link>

            <Link to="/health" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box icon-health">
                <FiHeart size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Health Insurance</strong>
                <span>Star, Care, Niva Bupa, HDFC Ergo</span>
              </div>
            </Link>

            <Link to="/plans?category=general" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box icon-general">
                <FiAward size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>General Insurance</strong>
                <span>SBI, Tata AIG, Bajaj, Digit, ICICI</span>
              </div>
            </Link>

            <Link to="/plans" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box icon-compare">
                <FiFileText size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Compare All 17 Partner Plans</strong>
                <span>Instant quotes & benefits</span>
              </div>
            </Link>
          </div>

          <div className="drawer-section-title">Quick Actions & Services</div>
          <div className="drawer-links-group">
            <Link to="/renewal" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box icon-renew">
                <FiRefreshCw size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Renew Existing Policy</strong>
                <span>Instant NCB discount & zero paperwork</span>
              </div>
            </Link>

            <Link to="/claim" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box" style={{ background: '#ecfdf5', color: '#059669', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiCheckCircle size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Claims Assistance & Tracking</strong>
                <span>30-minute cashless hospital guarantee</span>
              </div>
            </Link>

            <Link to="/support" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box" style={{ background: '#f5f3ff', color: '#7c3aed', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiHelpCircle size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Customer Support & FAQs</strong>
                <span>Tax proofs, advisor verify & WhatsApp desk</span>
              </div>
            </Link>

            <Link to="/checkout" className="drawer-link-item" onClick={handleClose}>
              <div className="drawer-icon-box icon-buy">
                <FiCheckCircle size={16} />
              </div>
              <div className="drawer-link-text">
                <strong>Proposal & Buy Portal</strong>
                <span>Instant IRDAI Policy Issuance</span>
              </div>
            </Link>
          </div>

          {/* Support Strip */}
          <div className="drawer-support-card">
            <div className="drawer-support-title">
              <FiPhoneCall size={16} /> 24x7 Claims Helpline
            </div>
            <div className="drawer-support-phone">1800-258-5881</div>
            <div className="drawer-support-tag">30-Minute SafeLife Claim Support Guarantee</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SideMenu;