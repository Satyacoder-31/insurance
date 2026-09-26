import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import "./Home.css";

import Pri1 from "../../assets/images/Pri1.png";
import Pri2 from "../../assets/images/Pri2.png";
import Pri3 from "../../assets/images/Pri3.png";
import Pri4 from "../../assets/images/Pri4.png";
import Pri5 from "../../assets/images/Pri5.png";
import part from "../../assets/images/Party1.png";
import sear1 from "../../assets/images/sear1.png";
import sear2 from "../../assets/images/sear2.png";
import sear3 from "../../assets/images/sear3.png";
import bigp from "../../assets/images/bigp.png";
import Ap1 from "../../assets/images/Ap1.png";
import Ap2 from "../../assets/images/Ap2.png";
import invest1 from "../../assets/images/invest1.png";
import invest2 from "../../assets/images/invest2.png";

import { FiUmbrella, FiSearch, FiCheckCircle, FiShield, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { FaHeartbeat } from "react-icons/fa";
import { AiTwotoneInsurance, AiFillThunderbolt } from "react-icons/ai";

const DEALT_PRODUCTS = {
  life: {
    category: "Life Insurance",
    icon: <FiUmbrella size={22} color="#2563eb" />,
    themeClass: "theme-life",
    badgeColor: "#eff6ff",
    textColor: "#1d4ed8",
    route: "/plans?category=life",
    items: [
      { id: "l1", name: "ICICI Prudential Life Insurance", sub: "Terminal Illness & Critical Illness Cover", highlight: "98.9% Settlement", tag: "Top Rated", cover: "₹1 Cr Cover", price: "From ₹490/mo", features: ["100% payout on terminal illness", "Waiver of premium on disability", "Tax benefit u/s 80C"] },
      { id: "l2", name: "Axis Max Life", sub: "Comprehensive Term & Life Protection", highlight: "96.5% Settlement", tag: "Popular", cover: "₹1 Cr Cover", price: "From ₹465/mo", features: ["Increasing cover option", "Special non-smoker rates", "Critical illness rider"] },
      { id: "l3", name: "ABSL Life", sub: "Aditya Birla Sun Life Insurance Plans", highlight: "97.4% Settlement", tag: "Flexible", cover: "₹75 Lac Cover", price: "From ₹420/mo", features: ["Flexible tenure up to 85 yrs", "Accidental death benefit", "Return of premium available"] },
      { id: "l4", name: "HDFC Life", sub: "Instant Digital Quotes & High Claim Ratio", highlight: "97.9% Settlement", tag: "Top Pick", cover: "₹1 Cr Cover", price: "From ₹520/mo", features: ["Life Long Cover up to 99 Yrs", "Instant paperless approval", "3D Life Shield cover"] },
      { id: "l5", name: "TATA AIA Life", sub: "Waiver of Premium & Accidental Cover", highlight: "99.0% Settlement", tag: "Highest CSR", cover: "₹1 Cr Cover", price: "From ₹499/mo", features: ["Industry-highest claim ratio", "Vitality health rewards", "Zero cost surrender value"] },
      { id: "l6", name: "SBI Life", sub: "Government-backed Trust & Nationwide Network", highlight: "97.1% Settlement", tag: "Trusted", cover: "₹1 Cr Cover", price: "From ₹440/mo", features: ["Trusted nationwide brand", "Joint life option for spouse", "Simple claims process"] }
    ]
  },
  health: {
    category: "Health Insurance",
    icon: <FaHeartbeat size={22} color="#ef4444" />,
    themeClass: "theme-health",
    badgeColor: "#fef2f2",
    textColor: "#b91c1c",
    route: "/plans?category=health",
    items: [
      { id: "h1", name: "STAR HEALTH INSURANCE", sub: "Specialist Health & Daycare Procedures", highlight: "14,000+ Hospitals", tag: "Market Leader", cover: "₹10-50 Lac Cover", price: "From ₹599/mo", features: ["Zero copayment across network", "Modern treatments covered", "Pre & post hospitalisation"] },
      { id: "h2", name: "CARE HEALTH INSURANCE", sub: "Annual Health Checkup & Unlimited Recharge", highlight: "11,000+ Hospitals", tag: "Zero Deductible", cover: "₹10 Lac - 1 Cr", price: "From ₹649/mo", features: ["Automatic sum insured reload", "Annual health check-up", "No claim bonus up to 150%"] },
      { id: "h3", name: "HDFC ERGO HEALTH INSURANCE", sub: "Zero Copay & Emergency Worldwide Coverage", highlight: "12,000+ Hospitals", tag: "Fast Approvals", cover: "₹10-25 Lac Cover", price: "From ₹720/mo", features: ["Instant cashless in 20 mins", "Worldwide emergency cover", "Restore benefit included"] },
      { id: "h4", name: "NIVA BUPA HEALTH INSURANCE", sub: "30-min Cashless Claim Guarantee", highlight: "10,000+ Hospitals", tag: "Instant Card", cover: "₹10-30 Lac Cover", price: "From ₹580/mo", features: ["30-minute claim processing", "OPD & pharmacy coverage", "Lock the clock age discount"] },
      { id: "h5", name: "ABSL HEALTH INSURANCE", sub: "Aditya Birla Health with HealthReturns™", highlight: "10,500+ Hospitals", tag: "Health Rewards", cover: "₹10-25 Lac Cover", price: "From ₹610/mo", features: ["Earn up to 30% premium back", "Chronic illness management", "Home treatment coverage"] }
    ]
  },
  general: {
    category: "General Insurance Co. Ltd",
    icon: <AiTwotoneInsurance size={22} color="#059669" />,
    themeClass: "theme-general",
    badgeColor: "#ecfdf5",
    textColor: "#047857",
    route: "/plans?category=general",
    items: [
      { id: "g1", name: "SBI GENERAL INSURANCE", sub: "Complete Enterprise & Property Shield", highlight: "Pan-India Network", tag: "Reliable", cover: "Total Asset Cover", price: "Tailored Quote", features: ["Nationwide claims presence", "Comprehensive liability options", "Flexible commercial riders"] },
      { id: "g2", name: "TATA AIG GIC", sub: "End-to-End Asset & Liability Protection", highlight: "96.8% Claim Ratio", tag: "Excellence", cover: "Comprehensive Cover", price: "Instant Quote", features: ["24x7 roadside & asset assist", "Digital paperless survey", "Quick cashless network"] },
      { id: "g3", name: "BAJAJ GIC", sub: "Digital Onboarding & Instant Claim Support", highlight: "98.1% Claim Ratio", tag: "Speedy Claims", cover: "Multi-Risk Cover", price: "Digital Quote", features: ["Motor OTS spot settlement", "Personal accident add-ons", "Instant digital policy renewal"] },
      { id: "g4", name: "ICICI LOMBARD GIC", sub: "Premier Corporate & General Insurance", highlight: "24x7 Assist", tag: "Industry Leader", cover: "High-Value Shield", price: "Instant Quote", features: ["IL Take Care app integration", "Cashless garage & asset ties", "Dedicated relationship manager"] },
      { id: "g5", name: "GO DIGIT GIC", sub: "Smartphone-enabled 100% Paperless Claims", highlight: "Digital First", tag: "Simple & Swift", cover: "Custom Risk Cover", price: "From ₹399/mo", features: ["Smartphone audio/video claims", "Zero physical paperwork", "Transparent claims policy"] },
      { id: "g6", name: "HDFC ERGO GIC", sub: "Comprehensive General & Commercial Risk Cover", highlight: "97.3% Settlement", tag: "Award Winning", cover: "All-Round Shield", price: "Custom Quote", features: ["AI-backed instant claims", "Zero depreciation add-ons", "End-to-end commercial protection"] }
    ]
  }
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Aggregate all 17 items with category meta
  const allDealtProducts = useMemo(() => {
    return [
      ...DEALT_PRODUCTS.life.items.map(item => ({ ...item, categoryKey: 'life', categoryName: 'Life Insurance', route: DEALT_PRODUCTS.life.route })),
      ...DEALT_PRODUCTS.health.items.map(item => ({ ...item, categoryKey: 'health', categoryName: 'Health Insurance', route: DEALT_PRODUCTS.health.route })),
      ...DEALT_PRODUCTS.general.items.map(item => ({ ...item, categoryKey: 'general', categoryName: 'General Insurance Co. Ltd', route: DEALT_PRODUCTS.general.route })),
    ];
  }, []);

  // Filter based on active tab and search query
  const filteredProducts = useMemo(() => {
    let list = allDealtProducts;
    if (activeTab !== "all") {
      list = list.filter(item => item.categoryKey === activeTab);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.sub.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allDealtProducts, activeTab, searchQuery]);

  return (
    <div className="safelife-home-page">
      {/* Hero Section */}
      <section className="safelife-hero-section">
        <div className="safelife-hero-container">
          <div className="safelife-hero-content">
            <div className="safelife-badge-pill">
              <FiShield className="badge-icon" /> 17 AUTHORIZED PARTNER INSURERS
            </div>
            
            <h1 className="safelife-hero-title">
              Let's find you <br />
              the <span className="hero-gradient-text">Best Insurance with SafeLife</span>
            </h1>

            <p className="safelife-hero-desc">
              Compare transparent quotes across Life, Health, and General Insurance from India's 17 top authorized insurance providers. No agent bias, 100% digital issuance, and 30-minute claim assistance.
            </p>

            {/* Quick Hero Features */}
            <div className="safelife-hero-chips">
              <div className="hero-chip">
                <AiFillThunderbolt color="#f59e0b" size={18} />
                <span>30-min Instant Cashless</span>
              </div>
              <div className="hero-chip">
                <FiCheckCircle color="#10b981" size={18} />
                <span>IRDAI Regulated Partners</span>
              </div>
              <div className="hero-chip">
                <FiTrendingUp color="#3b82f6" size={18} />
                <span>Up to 10% Online Savings</span>
              </div>
            </div>

            {/* Interactive Search Bar in Hero */}
            <div className="safelife-hero-search">
              <FiSearch className="search-icon" size={20} />
              <input 
                type="text"
                placeholder="Search any of our 17 insurers (e.g. HDFC, ICICI, Star, TATA, SBI, Care, Digit...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery("")}>✕</button>
              )}
            </div>
          </div>

          {/* Hero Highlight Card */}
          <div className="safelife-hero-card-col">
            <div className="safelife-hero-cta-card">
              <div className="card-top-tag">SafeLife Guarantee</div>
              <h3>Authorized Partner Network</h3>
              <p>
                Get direct access to certified advisors and official premiums for all 17 leading insurance companies.
              </p>
              
              <div className="cta-card-stats">
                <div>
                  <h4>17</h4>
                  <span>Partner Insurers</span>
                </div>
                <div>
                  <h4>98.5%</h4>
                  <span>Avg Settlement</span>
                </div>
                <div>
                  <h4>₹0</h4>
                  <span>Consultation Fee</span>
                </div>
              </div>

              <Link to="/plans" className="cta-primary-btn">
                Compare All Quotes Now <FiArrowRight style={{ marginLeft: "8px" }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Trust Metrics Bar */}
      <section className="safelife-stats-strip">
        <div className="safelife-stats-grid">
          <div className="stat-item">
            <span className="stat-number">9+ Million</span>
            <span className="stat-label">Happy Customers Insured</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">17 Insurers</span>
            <span className="stat-label">Life, Health & General Partners</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">₹500+ Cr</span>
            <span className="stat-label">Claims Settled Till Date</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">IRDAI Certified & Regulated</span>
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
      <section className="safelife-products-section">
        <div className="safelife-section-header">
          <div>
            <div className="section-pill">EXCLUSIVE PORTFOLIO</div>
            <h2 className="section-title">Insurance Products We Deal</h2>
            <p className="section-subtitle">
              We exclusively partner with India's top 17 insurers to provide you the highest claim ratios, widest hospital networks, and best value premiums.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="safelife-category-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Products <span className="tab-count">17</span>
            </button>
            <button 
              className={`tab-btn tab-life ${activeTab === 'life' ? 'active' : ''}`}
              onClick={() => setActiveTab('life')}
            >
              <FiUmbrella size={15} /> Life Insurance <span className="tab-count">6</span>
            </button>
            <button 
              className={`tab-btn tab-health ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
            >
              <FaHeartbeat size={15} /> Health Insurance <span className="tab-count">5</span>
            </button>
            <button 
              className={`tab-btn tab-general ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <AiTwotoneInsurance size={15} /> General Insurance <span className="tab-count">6</span>
            </button>
          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery.trim() !== "" && (
          <div className="search-status-bar">
            <span>Showing {filteredProducts.length} matching insurers for "<strong>{searchQuery}</strong>"</span>
            <button onClick={() => setSearchQuery("")}>Clear filter</button>
          </div>
        )}

        {/* Products Grid */}
        <div className="safelife-product-grid">
          {filteredProducts.map((item) => (
            <div key={item.id} className={`safelife-product-card card-${item.categoryKey}`}>
              <div className="card-top-row">
                <span className={`category-badge badge-${item.categoryKey}`}>
                  {item.categoryName}
                </span>
                <span className="card-tag">{item.tag}</span>
              </div>

              <div className="card-header-main">
                <div className={`partner-monogram monogram-${item.categoryKey}`}>
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="partner-name">{item.name}</h3>
                  <div className="highlight-pill">
                    <FiShield size={13} /> {item.highlight}
                  </div>
                </div>
              </div>

              <p className="card-sub-desc">{item.sub}</p>

              <div className="card-coverage-strip">
                <div>
                  <span className="cov-label">Estimated Cover</span>
                  <span className="cov-value">{item.cover}</span>
                </div>
                <div className="text-right">
                  <span className="cov-label">Starting Price</span>
                  <span className="cov-price">{item.price}</span>
                </div>
              </div>

              <ul className="card-feature-list">
                {item.features.map((feat, idx) => (
                  <li key={idx}>
                    <FiCheckCircle size={14} className="feat-check" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="card-footer-actions">
                <Link to={item.route} className={`btn-card-action btn-${item.categoryKey}`}>
                  Compare & Buy <FiArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products-found">
            <h3>No insurers match your query "{searchQuery}"</h3>
            <p>Try searching for ICICI, HDFC, SBI, Star, Care, TATA, Axis Max, or Digit.</p>
            <button onClick={() => setSearchQuery("")} className="btn-reset-search">Reset Search</button>
          </div>
        )}
      </section>

      {/* Featured Highlights Carousel */}
      <section className="safelife-carousel-section">
        <div className="carousel-section-container">
          <div className="text-center mb-8">
            <div className="section-pill">SPECIAL OFFERINGS</div>
            <h2 className="section-title">Featured Insurance Highlights</h2>
            <p className="section-subtitle">
              Exclusive benefits, instant discounts, and priority claim processing from our 17 partner providers.
            </p>
          </div>
          <Carousel />
        </div>
      </section>

      {/* Why Choose SafeLife - Modern Responsive 4 Pillars */}
      <section className="safelife-why-section">
        <div className="why-section-container">
          <div className="why-header">
            <div className="section-pill">THE SAFELIFE PROMISE</div>
            <h2>What makes SafeLife the best place to buy insurance?</h2>
            <p>
              We eliminated the headaches of traditional insurance: zero aggressive cold calls, verified quotes from our 17 partners, and dedicated claim advocates.
            </p>
          </div>

          <div className="why-cards-grid">
            <div className="why-card pillar-blue">
              <div className="why-icon-box">
                <img src={part} alt="Over 9 Million" />
              </div>
              <h3 className="why-card-metric">9+ Million</h3>
              <h4>Customers Trust Us</h4>
              <p>Trusted across India for transparent quotes, reliable advisory, and complete peace of mind.</p>
            </div>

            <div className="why-card pillar-cyan">
              <div className="why-icon-box">
                <img src={sear1} alt="17 Top Insurers" />
              </div>
              <h3 className="why-card-metric">17 Partner Insurers</h3>
              <h4>Authorized Network</h4>
              <p>Official tie-ups with India's top Life, Health, and General insurance brands for direct quotes.</p>
            </div>

            <div className="why-card pillar-green">
              <div className="why-icon-box">
                <img src={sear2} alt="Best Price Guaranteed" />
              </div>
              <h3 className="why-card-metric">Best Price</h3>
              <h4>Guaranteed Online Rates</h4>
              <p>Zero agent markups. Compare discounts and transparent coverage side-by-side in real time.</p>
            </div>

            <div className="why-card pillar-amber">
              <div className="why-icon-box">
                <img src={sear3} alt="Claims Support" />
              </div>
              <h3 className="why-card-metric">30-Min Support</h3>
              <h4>Dedicated Claim Assist</h4>
              <p>Our claims specialists stay by your side until your hospital or asset claim is fully settled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SafeLife Advantage Grid */}
      <section className="safelife-advantage-section">
        <div className="advantage-container">
          <div className="text-center mb-8">
            <div className="section-pill">OUR COMMITMENT</div>
            <h2 className="section-title">The SafeLife Advantage</h2>
            <p className="section-subtitle">
              Built from the ground up to give you transparency, security, and effortless claims.
            </p>
          </div>

          <div className="advantage-grid">
            <div className="advantage-card">
              <div className="adv-img-box"><img src={Pri1} alt="Best Price" /></div>
              <h4>Best Prices</h4>
              <p>Direct online quotes with guaranteed lowest premium rates and special digital discounts.</p>
            </div>

            <div className="advantage-card">
              <div className="adv-img-box"><img src={Pri2} alt="Unbiased Advice" /></div>
              <h4>Unbiased Advice</h4>
              <p>Certified experts who recommend policies tailored purely to your family's financial needs.</p>
            </div>

            <div className="advantage-card">
              <div className="adv-img-box"><img src={Pri3} alt="100% Reliable" /></div>
              <h4>100% Reliable</h4>
              <p>Regulated by IRDAI and fully compliant with all consumer financial protection standards.</p>
            </div>

            <div className="advantage-card">
              <div className="adv-img-box"><img src={Pri4} alt="Claims Support" /></div>
              <h4>Claims Support</h4>
              <p>Stress-free claim settlement assistance with dedicated hospital and insurer liaisons.</p>
            </div>

            <div className="advantage-card">
              <div className="adv-img-box"><img src={Pri5} alt="Happy to Help" /></div>
              <h4>Happy to Help</h4>
              <p>24x7 customer helpline, WhatsApp support, and rapid callback services 365 days a year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Download */}
      <section className="safelife-app-section">
        <div className="app-section-container">
          <div className="app-text-content">
            <div className="section-pill">SAFELIFE ON MOBILE</div>
            <h2>Get the SafeLife Mobile App</h2>
            <p className="app-sub">
              Access your policies, book health checkups, track renewal dates, and file cashless claims with a single tap.
            </p>

            <div className="app-checklist">
              <div className="app-check-item">
                <FiCheckCircle color="#10b981" size={18} />
                <span>Store and share all 17 partner policies digitally</span>
              </div>
              <div className="app-check-item">
                <FiCheckCircle color="#10b981" size={18} />
                <span>30-minute cashless claim tracking with real-time updates</span>
              </div>
              <div className="app-check-item">
                <FiCheckCircle color="#10b981" size={18} />
                <span>Instant policy document download in PDF format</span>
              </div>
              <div className="app-check-item">
                <FiCheckCircle color="#10b981" size={18} />
                <span>Automated renewal reminders to never lapse your safety</span>
              </div>
            </div>

            <div className="app-download-badges">
              <img src={Ap2} alt="Get it on Google Play" className="store-badge" />
              <img src={Ap1} alt="Download on Apple Store" className="store-badge" />
            </div>
          </div>

          <div className="app-image-content">
            <img src={bigp} alt="SafeLife mobile app preview" className="app-mockup-img" />
          </div>
        </div>
      </section>

      {/* Official 17 Partner Directory */}
      <section className="safelife-directory-section">
        <div className="directory-container">
          <div className="text-center mb-8">
            <div className="section-pill">DIRECT AUTHORIZATION</div>
            <h2 className="section-title">Official 17 Insurance Partners</h2>
            <p className="section-subtitle">
              Verify our direct partnerships across Life, Health, and General Insurance.
            </p>
          </div>

          <div className="directory-grid">
            {/* Life Category */}
            <div className="directory-card dir-card-life">
              <div className="dir-header">
                <div className="icon-wrapper icon-wrapper-life"><FiUmbrella color="#2563eb" size={20} /></div>
                <div>
                  <h3>Life Insurance</h3>
                  <span className="dir-count">6 Authorized Providers</span>
                </div>
              </div>
              <ul className="dir-list">
                {DEALT_PRODUCTS.life.items.map((ins) => (
                  <li key={ins.id}>
                    <Link to="/plans?category=life">
                      <span className="dir-partner-name">{ins.name}</span>
                      <span className="dir-badge dir-badge-life">{ins.highlight}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Health Category */}
            <div className="directory-card dir-card-health">
              <div className="dir-header">
                <div className="icon-wrapper icon-wrapper-health"><FaHeartbeat color="#ef4444" size={20} /></div>
                <div>
                  <h3>Health Insurance</h3>
                  <span className="dir-count">5 Authorized Providers</span>
                </div>
              </div>
              <ul className="dir-list">
                {DEALT_PRODUCTS.health.items.map((ins) => (
                  <li key={ins.id}>
                    <Link to="/plans?category=health">
                      <span className="dir-partner-name">{ins.name}</span>
                      <span className="dir-badge dir-badge-health">{ins.highlight}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* General Category */}
            <div className="directory-card dir-card-general">
              <div className="dir-header">
                <div className="icon-wrapper icon-wrapper-general"><AiTwotoneInsurance color="#059669" size={20} /></div>
                <div>
                  <h3>General Insurance Co. Ltd</h3>
                  <span className="dir-count">6 Authorized Providers</span>
                </div>
              </div>
              <ul className="dir-list">
                {DEALT_PRODUCTS.general.items.map((ins) => (
                  <li key={ins.id}>
                    <Link to="/plans?category=general">
                      <span className="dir-partner-name">{ins.name}</span>
                      <span className="dir-badge dir-badge-general">{ins.highlight}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Investors & Trust */}
      <section className="safelife-investors-section">
        <div className="investors-container">
          <h3 className="investors-title">Backed by Leading Financial Institutions</h3>
          <div className="investors-logos">
            <div className="inv-logo-card"><img src={invest1} alt="Partner Investor" /></div>
            <div className="inv-logo-card"><img src={invest2} alt="Partner Investor" /></div>
            <div className="inv-logo-card"><img src={invest1} alt="Partner Investor" /></div>
            <div className="inv-logo-card"><img src={invest2} alt="Partner Investor" /></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
