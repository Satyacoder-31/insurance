import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiArrowRight } from 'react-icons/fi';
import { FaHospitalAlt } from 'react-icons/fa';

export const Display_single_page = ({ er, category = 'life' }) => {
  const navigate = useNavigate();

  const insurerName = er.insurer?.name || er.name || "Authorized Insurer";
  const categoryTitle = category === 'health' 
    ? "Health Insurance" 
    : category === 'general' 
      ? "General Insurance Co. Ltd" 
      : "Life Insurance";

  const handleSelectPlan = () => {
    // Store selected plan in session for checkout
    const planDetails = {
      insurerName: insurerName,
      lifeCover: er.coverDisplay || (er.life_cover ? (er.life_cover === "100" ? "₹1.00 Crore" : `₹${er.life_cover} Lac`) : er.cover),
      premium: er.displayPremium || er.premium,
      periodText: er.periodText || "/month",
      category: categoryTitle
    };
    sessionStorage.setItem("selectedPlan", JSON.stringify(planDetails));
    navigate("/checkout");
  };

  const coverDisplay = er.life_cover === "100" 
    ? "₹1.00 Crore" 
    : er.life_cover 
      ? `₹${er.life_cover} Lac` 
      : (er.coverDisplay || er.cover || "Comprehensive Cover");

  return (
    <div className={`plan-card plan-card-${category}`}>
      <div className="plan-card-left">
        <div className="plan-logo-box">
          {er.insurer?.image ? (
            <img src={er.insurer.image} alt={insurerName} className="insurer-logo-img" />
          ) : (
            <div className={`plan-monogram-box monogram-${category}`}>
              {insurerName.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="plan-insurer-title">{insurerName}</h3>
            <div className="plan-tag-row">
              <span className="partner-verified-badge"><FiShield size={12} /> Authorized Partner</span>
              {er.tag && <span className="partner-custom-tag">{er.tag}</span>}
            </div>
          </div>
        </div>

        {/* Dynamic Metrics per Category */}
        <div className="plan-metrics-grid">
          {category === 'life' && (
            <>
              <div className="metric-box">
                <span className="metric-title">Life Cover</span>
                <span className="metric-value metric-cover">{coverDisplay}</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Cover Till Age</span>
                <span className="metric-value">{er.cover_till_age?.max_age || 75} Yrs</span>
                <span className="metric-sub">Max: {er.cover_till_age?.max_limit || 99} Yrs</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Claim Settled</span>
                <span className="metric-value metric-csr">{er.clim_settled}%</span>
                <span className="metric-sub">IRDAI Certified</span>
              </div>
            </>
          )}

          {category === 'health' && (
            <>
              <div className="metric-box">
                <span className="metric-title">Cashless Network</span>
                <span className="metric-value metric-csr">
                  <FaHospitalAlt size={13} style={{ marginRight: "4px" }} />
                  {er.hospitals}
                </span>
                <span className="metric-sub">Direct Hospital Network</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Sum Insured</span>
                <span className="metric-value metric-cover">{coverDisplay}</span>
                <span className="metric-sub">Restoration Available</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Settlement Ratio</span>
                <span className="metric-value metric-csr">{er.clim_settled}%</span>
                <span className="metric-sub">Fast 30-min approval</span>
              </div>
            </>
          )}

          {category === 'general' && (
            <>
              <div className="metric-box">
                <span className="metric-title">Asset Coverage</span>
                <span className="metric-value metric-cover">{coverDisplay}</span>
                <span className="metric-sub">Zero Depreciation Add-on</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Partner Feature</span>
                <span className="metric-value">{er.tag || "Digital First"}</span>
                <span className="metric-sub">Paperless survey</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Claim Ratio</span>
                <span className="metric-value metric-csr">{er.claimRatio || `${er.clim_settled}%`}</span>
                <span className="metric-sub">Spot settlement</span>
              </div>
            </>
          )}
        </div>

        {/* Feature / Offer Bullets */}
        {er.offers && er.offers.length > 0 && (
          <div className="plan-offers-strip">
            {er.offers.map((offer, idx) => (
              <span key={idx} className="offer-chip">
                <FiCheckCircle size={12} /> {offer}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right Pricing & Action Column */}
      <div className="plan-card-right">
        <div className="plan-price-box">
          <span className="price-label">Starting Premium</span>
          <div className="price-amount">
            ₹{er.displayPremium || er.premium}
            <span className="price-period">{er.periodText || "/month"}</span>
          </div>
          <span className="price-tax-note">+ applicable taxes</span>
        </div>

        <button className={`btn-select-plan btn-select-${category}`} onClick={handleSelectPlan}>
          Proceed to Buy <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
