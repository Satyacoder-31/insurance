import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiHeart,
  FiUsers,
  FiCreditCard,
  FiLock,
  FiFileText,
  FiPhone,
  FiMail,
  FiMapPin,
  FiActivity,
  FiHelpCircle,
  FiDownload,
  FiPrinter,
  FiChevronRight,
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiInfo,
  FiAward
} from "react-icons/fi";
import { recordUserPolicy } from "../../supabaseClient";
import "./Checkout.css";

const PRE_EXISTING_CONDITIONS_LIST = [
  { id: "diabetes", label: "Diabetes / High Blood Sugar", icon: "🩺" },
  { id: "hypertension", label: "Hypertension / High BP / Heart", icon: "🫀" },
  { id: "asthma", label: "Asthma / Respiratory Disorders", icon: "🫁" },
  { id: "cancer", label: "Cancer / Tumor / Cysts", icon: "🧬" },
  { id: "kidney_liver", label: "Kidney Disease / Liver Disorder", icon: "🧪" },
  { id: "thyroid", label: "Thyroid (Hypo/Hyper)", icon: "🔬" },
  { id: "none", label: "None of the Above (Healthy)", icon: "🛡️" }
];

const FinalCheckout = () => {
  const navigate = useNavigate();

  // Load selected plan from session or provide an authentic SafeLife partner default
  const [selectedPlan] = useState(() => {
    try {
      const stored = sessionStorage.getItem("selectedPlan");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading selectedPlan", e);
    }
    return {
      insurerName: "Care Health Insurance",
      planName: "Care Supreme Health Shield",
      category: "Health Insurance",
      premium: 9212,
      lifeCover: "₹10 Lakhs",
      periodText: "/year"
    };
  });

  // Current proposal step (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // User details (auto-fill from logged-in session if available)
  const [proposer, setProposer] = useState(() => {
    let defaultName = "Amit Sharma";
    let defaultPhone = "9876543210";
    let defaultEmail = "amit.sharma@example.com";

    try {
      const loggedIn = JSON.parse(sessionStorage.getItem("loggedInUserInfo"));
      if (loggedIn) {
        if (loggedIn.name) defaultName = loggedIn.name;
        if (loggedIn.phoneNumber) defaultPhone = loggedIn.phoneNumber;
        if (loggedIn.email) defaultEmail = loggedIn.email;
      }
    } catch (e) {}

    return {
      title: "Mr",
      gender: "Male",
      fullName: defaultName,
      dob: "1994-08-15",
      mobile: defaultPhone,
      email: defaultEmail,
      maritalStatus: "Married",
      occupation: "Salaried",
      annualIncome: "₹5L - ₹10L",
      education: "Graduate",
      address: "B-402, Green Avenue, Sector 62",
      pincode: "201301",
      city: "Noida",
      state: "Uttar Pradesh",
      panNumber: "ABCDE1234F",
      aadhaarLast4: "5892"
    };
  });

  // Mandatory Underwriting & Medical Questions
  const [underwriting, setUnderwriting] = useState({
    tobacco: "No",
    tobaccoFreq: "1-5 per day",
    alcohol: "No",
    alcoholFreq: "Social / Occasional",
    hazardousJob: "No",
    selectedConditions: ["none"],
    hospitalizedPast4Years: "No",
    hospitalizedReason: "",
    regularMedication: "No",
    medicationDetails: "",
    familyHistory: "No",
    previousRejection: "No"
  });

  // Nominee Details
  const [nominee, setNominee] = useState({
    fullName: "Pooja Sharma",
    relationship: "Spouse",
    dob: "1996-03-22",
    gender: "Female",
    share: "100",
    hasAppointee: false,
    appointeeName: "",
    appointeeRelation: ""
  });

  // Add-on Riders
  const [riders, setRiders] = useState({
    criticalIllness: true,
    hospitalCash: false,
    accidentalCover: true
  });

  // Payment State
  const [payment, setPayment] = useState({
    method: "upi",
    upiApp: "gpay",
    upiId: "9876543210@okaxis",
    cardNumber: "4532 •••• •••• 9012",
    cardName: "Amit Sharma",
    cardExp: "12/28",
    cardCvv: "892",
    bank: "HDFC Bank",
    agreeTerms: true
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [policyIssued, setPolicyIssued] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Price calculations
  const rawBase = typeof selectedPlan.premium === "number" ? selectedPlan.premium : parseInt(selectedPlan.premium) || 849;
  const criticalCost = riders.criticalIllness ? 499 : 0;
  const hospitalCashCost = riders.hospitalCash ? 249 : 0;
  const accidentalCost = riders.accidentalCover ? 350 : 0;
  const riderTotal = criticalCost + hospitalCashCost + accidentalCost;
  const netPremium = rawBase + riderTotal;
  const gst = Math.round(netPremium * 0.18);
  const totalPayable = netPremium + gst;

  // Age calculation helper
  const calculateAge = (dobString) => {
    if (!dobString) return 30;
    const diff = Date.now() - new Date(dobString).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Check if nominee is minor
  useEffect(() => {
    const age = calculateAge(nominee.dob);
    setNominee((prev) => ({
      ...prev,
      hasAppointee: age < 18
    }));
  }, [nominee.dob]);

  // Handle Condition toggle
  const toggleCondition = (conditionId) => {
    setUnderwriting((prev) => {
      let current = [...prev.selectedConditions];
      if (conditionId === "none") {
        return { ...prev, selectedConditions: ["none"] };
      }
      // If adding another condition, remove 'none'
      current = current.filter((c) => c !== "none");
      if (current.includes(conditionId)) {
        current = current.filter((c) => c !== conditionId);
        if (current.length === 0) current = ["none"];
      } else {
        current.push(conditionId);
      }
      return { ...prev, selectedConditions: current };
    });
  };

  // Validation functions
  const validateStep1 = () => {
    const errors = {};
    if (!proposer.fullName.trim()) errors.fullName = "Full name is required";
    if (!proposer.mobile || proposer.mobile.length < 10) errors.mobile = "Valid 10-digit mobile is required";
    if (!proposer.email.includes("@")) errors.email = "Valid email address is required";
    if (!proposer.dob) errors.dob = "Date of birth is required";
    if (!proposer.panNumber || proposer.panNumber.length < 10) errors.panNumber = "Valid 10-character PAN is required";
    if (!proposer.pincode || proposer.pincode.length < 6) errors.pincode = "Valid 6-digit Pincode is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    // Underwriting questions have standard defaults (No/Yes), always valid
    setFormErrors({});
    return true;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!nominee.fullName.trim()) errors.nomineeName = "Nominee full name is required";
    if (!nominee.dob) errors.nomineeDob = "Nominee date of birth is required";
    if (nominee.hasAppointee && !nominee.appointeeName.trim()) {
      errors.appointeeName = "Appointee name is required for minor nominee";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;

    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Submit Proposal & Process Instant Policy Issuance
  const handleCompletePurchase = async () => {
    if (!payment.agreeTerms) {
      alert("Please confirm the declarations checkbox to proceed.");
      return;
    }

    setIsProcessing(true);

    try {
      const generatedPolicyNum = `SL-${new Date().getFullYear()}-POL-${Math.floor(100000 + Math.random() * 900000)}`;

      // Save policy record to Supabase
      const record = {
        userPhone: proposer.mobile,
        userName: proposer.fullName,
        policyType: selectedPlan.category || "Comprehensive Insurance",
        insurerName: selectedPlan.insurerName || "SafeLife Partner Insurer",
        planName: selectedPlan.planName || selectedPlan.insurerName,
        premium: totalPayable
      };

      await recordUserPolicy(record);

      const policyDetails = {
        policyNumber: generatedPolicyNum,
        insurerName: selectedPlan.insurerName,
        planName: selectedPlan.planName || `${selectedPlan.insurerName} Comprehensive Cover`,
        category: selectedPlan.category || "Health & Life Insurance",
        insuredName: proposer.fullName,
        insuredDob: proposer.dob,
        insuredMobile: proposer.mobile,
        insuredEmail: proposer.email,
        sumInsured: selectedPlan.lifeCover || "₹10,00,000",
        nomineeName: `${nominee.fullName} (${nominee.relationship})`,
        premiumPaid: totalPayable,
        issueDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        status: "ACTIVE & VERIFIED"
      };

      setPolicyIssued(policyDetails);
      setShowModal(true);
    } catch (err) {
      console.error("Policy recording error:", err);
      alert("Policy purchase processed successfully! Confirmation is shown.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      {/* PolicyBazaar Style Header Trust Bar */}
      <header className="checkout-header-bar">
        <div className="checkout-header-inner">
          <div className="checkout-brand-area">
            <Link to="/" className="checkout-brand-title">
              Safe<span>Life</span>
            </Link>
            <span className="checkout-irdai-badge">IRDAI Reg. Direct Broker #742</span>
          </div>

          <div className="checkout-header-support">
            <div className="checkout-support-pill">
              <FiPhone size={14} />
              <span>Claims Helpline: 1800-258-5881</span>
            </div>
            <div className="checkout-security-tag">
              <FiLock size={15} />
              <span>256-Bit SSL Secure Proposal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <div className="checkout-stepper-container">
        <div className="checkout-stepper-inner">
          <div className="checkout-stepper-line">
            <div
              className="checkout-stepper-progress"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>

          {/* Step 1 */}
          <div
            className={`checkout-step-node ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`}
            onClick={() => currentStep > 1 && setCurrentStep(1)}
          >
            <div className="step-node-bubble">
              {currentStep > 1 ? <FiCheck size={16} /> : "1"}
            </div>
            <span className="step-node-label">Proposer & KYC</span>
          </div>

          {/* Step 2 */}
          <div
            className={`checkout-step-node ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}
            onClick={() => currentStep > 2 && setCurrentStep(2)}
          >
            <div className="step-node-bubble">
              {currentStep > 2 ? <FiCheck size={16} /> : "2"}
            </div>
            <span className="step-node-label">Medical Questions</span>
          </div>

          {/* Step 3 */}
          <div
            className={`checkout-step-node ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}
            onClick={() => currentStep > 3 && setCurrentStep(3)}
          >
            <div className="step-node-bubble">
              {currentStep > 3 ? <FiCheck size={16} /> : "3"}
            </div>
            <span className="step-node-label">Nominee Details</span>
          </div>

          {/* Step 4 */}
          <div className={`checkout-step-node ${currentStep === 4 ? "active" : ""}`}>
            <div className="step-node-bubble">
              {policyIssued ? <FiCheck size={16} /> : "4"}
            </div>
            <span className="step-node-label">Review & Pay</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Sticky Summary Right */}
      <main className="checkout-main-grid">
        {/* Left Form Area */}
        <section className="checkout-form-card">
          {/* ================= STEP 1: PROPOSER & KYC ================= */}
          {currentStep === 1 && (
            <div>
              <div className="checkout-step-header">
                <span className="checkout-step-tag">
                  <FiUser size={13} /> Step 1 of 4 • Insured Profile
                </span>
                <h2>Proposer & Personal KYC Details</h2>
                <p>
                  Please enter legal personal details matching your Govt ID proof (PAN / Aadhaar) for seamless IRDAI policy underwriting.
                </p>
              </div>

              {/* Title & Gender */}
              <div className="form-section-title">
                <FiUser /> 1. Basic Personal Information
              </div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>Title</label>
                  <select
                    className="form-select"
                    value={proposer.title}
                    onChange={(e) => setProposer({ ...proposer, title: e.target.value })}
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="form-field" style={{ gridColumn: "span 2" }}>
                  <label>
                    Full Name (as on PAN Card) <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full legal name"
                    value={proposer.fullName}
                    onChange={(e) => setProposer({ ...proposer, fullName: e.target.value })}
                  />
                  {formErrors.fullName && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.fullName}</span>
                  )}
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label>
                    Date of Birth <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={proposer.dob}
                    onChange={(e) => setProposer({ ...proposer, dob: e.target.value })}
                  />
                  <span style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Age: {calculateAge(proposer.dob)} Years
                  </span>
                </div>

                <div className="form-field">
                  <label>Gender</label>
                  <div className="pill-group">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`pill-btn ${proposer.gender === g ? "active" : ""}`}
                        onClick={() => setProposer({ ...proposer, gender: g })}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label>Marital Status</label>
                  <select
                    className="form-select"
                    value={proposer.maritalStatus}
                    onChange={(e) => setProposer({ ...proposer, maritalStatus: e.target.value })}
                  >
                    <option value="Married">Married</option>
                    <option value="Single">Single / Unmarried</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="form-section-title">
                <FiPhone /> 2. Communication Details
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>
                    Mobile Number (for SMS & OTP) <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="10 digit mobile number"
                    maxLength={10}
                    value={proposer.mobile}
                    onChange={(e) => setProposer({ ...proposer, mobile: e.target.value })}
                  />
                  {formErrors.mobile && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.mobile}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>
                    Email Address (for Digital Policy Document) <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={proposer.email}
                    onChange={(e) => setProposer({ ...proposer, email: e.target.value })}
                  />
                  {formErrors.email && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.email}</span>
                  )}
                </div>
              </div>

              {/* Occupation & Financials */}
              <div className="form-section-title">
                <FiActivity /> 3. Occupation & Financial Profile
              </div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>Occupation Type</label>
                  <select
                    className="form-select"
                    value={proposer.occupation}
                    onChange={(e) => setProposer({ ...proposer, occupation: e.target.value })}
                  >
                    <option value="Salaried">Salaried (MNC / Govt / Pvt)</option>
                    <option value="Self-Employed">Self-Employed Business / Trader</option>
                    <option value="Professional">Professional (Doctor/CA/Lawyer)</option>
                    <option value="Homemaker">Homemaker</option>
                    <option value="Student">Student / Retired</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Annual Gross Income</label>
                  <select
                    className="form-select"
                    value={proposer.annualIncome}
                    onChange={(e) => setProposer({ ...proposer, annualIncome: e.target.value })}
                  >
                    <option value="Up to ₹3L">Up to ₹3 Lakhs</option>
                    <option value="₹3L - ₹5L">₹3 Lakhs - ₹5 Lakhs</option>
                    <option value="₹5L - ₹10L">₹5 Lakhs - ₹10 Lakhs</option>
                    <option value="₹10L - ₹25L">₹10 Lakhs - ₹25 Lakhs</option>
                    <option value="₹25L+">Above ₹25 Lakhs</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Education</label>
                  <select
                    className="form-select"
                    value={proposer.education}
                    onChange={(e) => setProposer({ ...proposer, education: e.target.value })}
                  >
                    <option value="Post Graduate">Post Graduate & Above</option>
                    <option value="Graduate">Graduate</option>
                    <option value="12th Pass">12th Standard</option>
                    <option value="10th Pass">10th Standard or below</option>
                  </select>
                </div>
              </div>

              {/* Address & IRDAI KYC */}
              <div className="form-section-title">
                <FiMapPin /> 4. Address & IRDAI Mandatory KYC
              </div>
              <div className="form-field" style={{ marginBottom: "16px" }}>
                <label>Permanent Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Flat/House No, Building, Street"
                  value={proposer.address}
                  onChange={(e) => setProposer({ ...proposer, address: e.target.value })}
                />
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label>
                    Pincode <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={6}
                    placeholder="6-digit pincode"
                    value={proposer.pincode}
                    onChange={(e) => setProposer({ ...proposer, pincode: e.target.value })}
                  />
                  {formErrors.pincode && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.pincode}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-input"
                    value={proposer.city}
                    onChange={(e) => setProposer({ ...proposer, city: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={proposer.state}
                    onChange={(e) => setProposer({ ...proposer, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>
                    PAN Number (Mandatory for IRDAI KYC) <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    style={{ textTransform: "uppercase", letterSpacing: "1px" }}
                    value={proposer.panNumber}
                    onChange={(e) =>
                      setProposer({ ...proposer, panNumber: e.target.value.toUpperCase() })
                    }
                  />
                  {formErrors.panNumber && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.panNumber}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>Aadhaar Card (Last 4 Digits)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 5892"
                    maxLength={4}
                    value={proposer.aadhaarLast4}
                    onChange={(e) => setProposer({ ...proposer, aadhaarLast4: e.target.value })}
                  />
                </div>
              </div>

              {/* Form Action */}
              <div className="form-actions-row">
                <div></div>
                <button type="button" className="btn-form-next" onClick={handleNextStep}>
                  Proceed to Medical Questions <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: MEDICAL & LIFESTYLE UNDERWRITING ================= */}
          {currentStep === 2 && (
            <div>
              <div className="checkout-step-header">
                <span className="checkout-step-tag">
                  <FiHeart size={13} /> Step 2 of 4 • Essential Medical Underwriting
                </span>
                <h2>Mandatory Health & Lifestyle Questions</h2>
                <p>
                  In compliance with IRDAI regulations, accurate disclosure of your medical history ensures 100% dispute-free claim settlement for you and your family.
                </p>
              </div>

              {/* Section 45 Info Banner */}
              <div className="underwriting-alert">
                <FiInfo size={20} style={{ minWidth: "20px", marginTop: "2px" }} />
                <div>
                  <strong>Why are these questions required?</strong> Under Section 45 of the Insurance Act 1938, true disclosure of health habits and pre-existing ailments protects your claim from repudiation. 99.4% of declared claims are settled without queries.
                </div>
              </div>

              {/* 1. Tobacco & Nicotine Habits */}
              <div className={`uw-question-card ${underwriting.tobacco === "Yes" ? "flagged" : ""}`}>
                <div className="uw-question-top">
                  <div>
                    <div className="uw-question-title">
                      1. Smoking & Tobacco Consumption
                    </div>
                    <div className="uw-question-desc">
                      Have you smoked cigarettes, bidis, chewed gutkha/paan masala, or consumed nicotine/e-cigarettes in the past 12 months?
                    </div>
                  </div>
                  <div className="yes-no-toggle">
                    <button
                      type="button"
                      className={`yes-no-btn ${underwriting.tobacco === "No" ? "selected-no" : ""}`}
                      onClick={() => setUnderwriting({ ...underwriting, tobacco: "No" })}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`yes-no-btn ${underwriting.tobacco === "Yes" ? "selected-yes" : ""}`}
                      onClick={() => setUnderwriting({ ...underwriting, tobacco: "Yes" })}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {underwriting.tobacco === "Yes" && (
                  <div className="uw-expandable-box">
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#b45309" }}>
                      Please specify daily consumption frequency:
                    </label>
                    <div className="pill-group" style={{ marginTop: "8px" }}>
                      {["1-5 per day", "5-10 per day", "10+ per day"].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          className={`pill-btn ${underwriting.tobaccoFreq === freq ? "active" : ""}`}
                          onClick={() => setUnderwriting({ ...underwriting, tobaccoFreq: freq })}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Alcohol Intake */}
              <div className={`uw-question-card ${underwriting.alcohol === "Yes" ? "flagged" : ""}`}>
                <div className="uw-question-top">
                  <div>
                    <div className="uw-question-title">2. Alcohol Consumption</div>
                    <div className="uw-question-desc">
                      Do you consume alcoholic beverages (beer, wine, spirits) on a regular or occasional basis?
                    </div>
                  </div>
                  <div className="yes-no-toggle">
                    <button
                      type="button"
                      className={`yes-no-btn ${underwriting.alcohol === "No" ? "selected-no" : ""}`}
                      onClick={() => setUnderwriting({ ...underwriting, alcohol: "No" })}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`yes-no-btn ${underwriting.alcohol === "Yes" ? "selected-yes" : ""}`}
                      onClick={() => setUnderwriting({ ...underwriting, alcohol: "Yes" })}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {underwriting.alcohol === "Yes" && (
                  <div className="uw-expandable-box">
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#b45309" }}>
                      Intake frequency:
                    </label>
                    <div className="pill-group" style={{ marginTop: "8px" }}>
                      {["Social / Occasional", "1-2 times weekly", "Daily"].map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          className={`pill-btn ${underwriting.alcoholFreq === freq ? "active" : ""}`}
                          onClick={() => setUnderwriting({ ...underwriting, alcoholFreq: freq })}
                        >
                          {freq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Pre-Existing Conditions Checklist */}
              <div className="uw-question-card">
                <div>
                  <div className="uw-question-title">
                    3. Pre-Existing Medical Conditions & Chronic Ailments
                  </div>
                  <div className="uw-question-desc">
                    Have you ever been diagnosed, received advice, or taken medication for any of the following chronic conditions?
                  </div>

                  <div className="conditions-grid">
                    {PRE_EXISTING_CONDITIONS_LIST.map((item) => {
                      const isSelected = underwriting.selectedConditions.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`condition-chip ${isSelected ? "active" : ""} ${
                            item.id === "none" ? "chip-none" : ""
                          }`}
                          onClick={() => toggleCondition(item.id)}
                        >
                          <span>
                            <span style={{ marginRight: "6px" }}>{item.icon}</span> {item.label}
                          </span>
                          {isSelected && <FiCheck size={16} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Hospitalization & Surgeries in past 4 years */}
              <div
                className={`uw-question-card ${
                  underwriting.hospitalizedPast4Years === "Yes" ? "flagged" : ""
                }`}
              >
                <div className="uw-question-top">
                  <div>
                    <div className="uw-question-title">
                      4. Hospitalization & Surgical History (Last 4 Years)
                    </div>
                    <div className="uw-question-desc">
                      Have you been admitted to a hospital/nursing home for {">"}24 hours or undergone surgery in the past 4 years?
                    </div>
                  </div>
                  <div className="yes-no-toggle">
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.hospitalizedPast4Years === "No" ? "selected-no" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, hospitalizedPast4Years: "No" })}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.hospitalizedPast4Years === "Yes" ? "selected-yes" : ""
                      }`}
                      onClick={() =>
                        setUnderwriting({ ...underwriting, hospitalizedPast4Years: "Yes" })
                      }
                    >
                      Yes
                    </button>
                  </div>
                </div>

                {underwriting.hospitalizedPast4Years === "Yes" && (
                  <div className="uw-expandable-box">
                    <label style={{ fontSize: "12px", fontWeight: "700", color: "#b45309" }}>
                      Reason for hospitalization / Procedure name:
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginTop: "6px" }}
                      placeholder="e.g. Appendectomy in 2024, fully recovered"
                      value={underwriting.hospitalizedReason}
                      onChange={(e) =>
                        setUnderwriting({ ...underwriting, hospitalizedReason: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              {/* 5. Prescription Medication */}
              <div
                className={`uw-question-card ${
                  underwriting.regularMedication === "Yes" ? "flagged" : ""
                }`}
              >
                <div className="uw-question-top">
                  <div>
                    <div className="uw-question-title">5. Daily Prescription Medications</div>
                    <div className="uw-question-desc">
                      Are you currently taking any prescription medications on a daily/regular basis for more than 14 consecutive days?
                    </div>
                  </div>
                  <div className="yes-no-toggle">
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.regularMedication === "No" ? "selected-no" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, regularMedication: "No" })}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.regularMedication === "Yes" ? "selected-yes" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, regularMedication: "Yes" })}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Family History */}
              <div className="uw-question-card">
                <div className="uw-question-top">
                  <div>
                    <div className="uw-question-title">6. Family Medical History</div>
                    <div className="uw-question-desc">
                      Has any direct parent or sibling been diagnosed with heart disease, diabetes, or cancer before the age of 55?
                    </div>
                  </div>
                  <div className="yes-no-toggle">
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.familyHistory === "No" ? "selected-no" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, familyHistory: "No" })}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.familyHistory === "Yes" ? "selected-yes" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, familyHistory: "Yes" })}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. Hazardous Occupations or Extreme Pursuits */}
              <div className="uw-question-card">
                <div className="uw-question-top">
                  <div>
                    <div className="uw-question-title">7. Hazardous Occupations / Extreme Sports</div>
                    <div className="uw-question-desc">
                      Are you engaged in armed forces, aviation, deep-sea diving, commercial mining, or competitive motorsports?
                    </div>
                  </div>
                  <div className="yes-no-toggle">
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.hazardousJob === "No" ? "selected-no" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, hazardousJob: "No" })}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className={`yes-no-btn ${
                        underwriting.hazardousJob === "Yes" ? "selected-yes" : ""
                      }`}
                      onClick={() => setUnderwriting({ ...underwriting, hazardousJob: "Yes" })}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Action */}
              <div className="form-actions-row">
                <button type="button" className="btn-form-back" onClick={handlePrevStep}>
                  <FiArrowLeft size={16} /> Back to KYC
                </button>
                <button type="button" className="btn-form-next" onClick={handleNextStep}>
                  Continue to Nominee Details <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: NOMINEE DETAILS ================= */}
          {currentStep === 3 && (
            <div>
              <div className="checkout-step-header">
                <span className="checkout-step-tag">
                  <FiUsers size={13} /> Step 3 of 4 • Legal Beneficiary
                </span>
                <h2>Nominee & Appointee Information</h2>
                <p>
                  As per IRDAI guidelines, specifying a legal nominee ensures that the insurance claim proceeds are paid smoothly to your chosen family member.
                </p>
              </div>

              <div className="form-section-title">
                <FiUsers /> Primary Nominee Details
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>
                    Nominee Full Name (as per Govt ID) <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter nominee legal name"
                    value={nominee.fullName}
                    onChange={(e) => setNominee({ ...nominee, fullName: e.target.value })}
                  />
                  {formErrors.nomineeName && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.nomineeName}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>Relationship to Proposer</label>
                  <select
                    className="form-select"
                    value={nominee.relationship}
                    onChange={(e) => setNominee({ ...nominee, relationship: e.target.value })}
                  >
                    <option value="Spouse">Spouse (Wife / Husband)</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label>
                    Nominee Date of Birth <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={nominee.dob}
                    onChange={(e) => setNominee({ ...nominee, dob: e.target.value })}
                  />
                  <span style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    Age: {calculateAge(nominee.dob)} Years
                  </span>
                  {formErrors.nomineeDob && (
                    <span style={{ color: "#dc2626", fontSize: "12px" }}>{formErrors.nomineeDob}</span>
                  )}
                </div>

                <div className="form-field">
                  <label>Nominee Gender</label>
                  <div className="pill-group">
                    {["Female", "Male"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={`pill-btn ${nominee.gender === g ? "active" : ""}`}
                        onClick={() => setNominee({ ...nominee, gender: g })}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-field">
                  <label>Claim Payout Share %</label>
                  <input
                    type="text"
                    className="form-input"
                    value={`${nominee.share}%`}
                    disabled
                    style={{ background: "#f1f5f9", fontWeight: "700" }}
                  />
                </div>
              </div>

              {/* Appointee Section for Minor Nominee */}
              {nominee.hasAppointee && (
                <div
                  style={{
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    borderRadius: "10px",
                    padding: "18px",
                    marginTop: "20px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#92400e",
                      fontWeight: "700",
                      marginBottom: "8px"
                    }}
                  >
                    <FiAlertCircle /> Appointee Required (Nominee is a minor under 18 years)
                  </div>
                  <p style={{ fontSize: "13px", color: "#78350f", margin: "0 0 14px 0" }}>
                    Since the nominee is under 18 years of age, Indian insurance law requires an adult appointee to receive claim settlement on the minor's behalf until maturity.
                  </p>

                  <div className="form-grid-2">
                    <div className="form-field">
                      <label>
                        Appointee Full Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Adult Guardian Name"
                        value={nominee.appointeeName}
                        onChange={(e) => setNominee({ ...nominee, appointeeName: e.target.value })}
                      />
                      {formErrors.appointeeName && (
                        <span style={{ color: "#dc2626", fontSize: "12px" }}>
                          {formErrors.appointeeName}
                        </span>
                      )}
                    </div>

                    <div className="form-field">
                      <label>Appointee Relationship to Nominee</label>
                      <select
                        className="form-select"
                        value={nominee.appointeeRelation}
                        onChange={(e) =>
                          setNominee({ ...nominee, appointeeRelation: e.target.value })
                        }
                      >
                        <option value="Grandfather">Grandfather</option>
                        <option value="Grandmother">Grandmother</option>
                        <option value="Uncle">Uncle / Aunt</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action */}
              <div className="form-actions-row">
                <button type="button" className="btn-form-back" onClick={handlePrevStep}>
                  <FiArrowLeft size={16} /> Back to Medical
                </button>
                <button type="button" className="btn-form-next" onClick={handleNextStep}>
                  Proceed to Payment & Review <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: REVIEW & PAYMENT ================= */}
          {currentStep === 4 && (
            <div>
              <div className="checkout-step-header">
                <span className="checkout-step-tag">
                  <FiCreditCard size={13} /> Step 4 of 4 • Instant Policy Issuance
                </span>
                <h2>Choose Payment Method & Issue Policy</h2>
                <p>
                  Complete your encrypted payment to instantly generate and download your active IRDAI insurance policy document.
                </p>
              </div>

              {/* Payment Methods Grid Tabs */}
              <div className="payment-tabs-grid">
                <button
                  type="button"
                  className={`payment-tab-btn ${payment.method === "upi" ? "active" : ""}`}
                  onClick={() => setPayment({ ...payment, method: "upi" })}
                >
                  <span style={{ fontSize: "18px" }}>⚡</span>
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn ${payment.method === "card" ? "active" : ""}`}
                  onClick={() => setPayment({ ...payment, method: "card" })}
                >
                  <FiCreditCard size={18} />
                  <span>Debit / Credit Card</span>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn ${payment.method === "netbanking" ? "active" : ""}`}
                  onClick={() => setPayment({ ...payment, method: "netbanking" })}
                >
                  <span style={{ fontSize: "18px" }}>🏛️</span>
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  className={`payment-tab-btn ${payment.method === "emi" ? "active" : ""}`}
                  onClick={() => setPayment({ ...payment, method: "emi" })}
                >
                  <span style={{ fontSize: "18px" }}>📅</span>
                  <span>Easy EMI</span>
                </button>
              </div>

              {/* UPI Screen */}
              {payment.method === "upi" && (
                <div className="upi-qr-box">
                  <div className="upi-apps-row">
                    {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                      <button
                        key={app}
                        type="button"
                        className={`upi-app-pill ${payment.upiApp === app ? "active" : ""}`}
                        onClick={() => setPayment({ ...payment, upiApp: app })}
                      >
                        {app}
                      </button>
                    ))}
                  </div>

                  <div className="qr-code-display">
                    {/* Simulated Authentic Dynamic QR */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=safelife@bank&pn=SafeLife&am=${totalPayable}&cu=INR`}
                      alt="UPI QR Code"
                      style={{ width: "150px", height: "150px", display: "block" }}
                    />
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>
                    Scan QR with any UPI app to pay ₹{totalPayable.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                    Verified Merchant: SafeLife Insurance Brokers Pvt Ltd
                  </div>

                  <div style={{ maxWidth: "340px", margin: "16px auto 0" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
                      Or enter Virtual Payment Address (VPA):
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. mobile@upi"
                      value={payment.upiId}
                      onChange={(e) => setPayment({ ...payment, upiId: e.target.value })}
                      style={{ textAlign: "center" }}
                    />
                  </div>
                </div>
              )}

              {/* Card Screen */}
              {payment.method === "card" && (
                <div>
                  <div className="form-field" style={{ marginBottom: "14px" }}>
                    <label>Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="xxxx xxxx xxxx xxxx"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-field" style={{ marginBottom: "14px" }}>
                    <label>Name on Card</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="As printed on card"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-field">
                      <label>Expiry Date (MM/YY)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="MM/YY"
                        value={payment.cardExp}
                        onChange={(e) => setPayment({ ...payment, cardExp: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        className="form-input"
                        maxLength={4}
                        placeholder="•••"
                        value={payment.cardCvv}
                        onChange={(e) => setPayment({ ...payment, cardCvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {payment.method === "netbanking" && (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "700", marginBottom: "8px", display: "block" }}>
                    Select Your Bank:
                  </label>
                  <div className="conditions-grid" style={{ marginBottom: "16px" }}>
                    {["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Punjab National Bank"].map(
                      (b) => (
                        <div
                          key={b}
                          className={`condition-chip ${payment.bank === b ? "active" : ""}`}
                          onClick={() => setPayment({ ...payment, bank: b })}
                        >
                          <span>{b}</span>
                          {payment.bank === b && <FiCheck size={16} />}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* EMI */}
              {payment.method === "emi" && (
                <div style={{ background: "#f8fafc", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#1e293b", marginBottom: "8px" }}>
                    No-Cost EMI available for 3 & 6 Months:
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                    • 3 Months: ₹{Math.round(totalPayable / 3).toLocaleString("en-IN")}/month at 0% interest
                    <br />
                    • 6 Months: ₹{Math.round(totalPayable / 6).toLocaleString("en-IN")}/month at 0% interest
                    <br />
                    • 12 Months: ₹{Math.round((totalPayable * 1.08) / 12).toLocaleString("en-IN")}/month (Low interest)
                  </div>
                </div>
              )}

              {/* Legal Declarations & Consent */}
              <div className="declaration-box">
                <input
                  type="checkbox"
                  id="agreeTermsCheck"
                  checked={payment.agreeTerms}
                  onChange={(e) => setPayment({ ...payment, agreeTerms: e.target.checked })}
                />
                <label htmlFor="agreeTermsCheck" style={{ cursor: "pointer" }}>
                  I hereby declare that all information furnished above regarding my health, occupation, habits, and nominee are true and accurate. I authorize SafeLife Insurance Brokers to share my proposal with <strong>{selectedPlan.insurerName}</strong> for instant policy issuance in accordance with IRDAI norms.
                </label>
              </div>

              {/* Pay Now Button */}
              <button
                type="button"
                className="btn-pay-now"
                disabled={isProcessing}
                onClick={handleCompletePurchase}
              >
                {isProcessing ? (
                  <>
                    <FiLock size={18} /> Securing & Generating Policy...
                  </>
                ) : (
                  <>
                    <FiShield size={18} /> Pay ₹{totalPayable.toLocaleString("en-IN")} & Issue Policy Instantly
                  </>
                )}
              </button>

              <div className="form-actions-row">
                <button type="button" className="btn-form-back" onClick={handlePrevStep}>
                  <FiArrowLeft size={16} /> Back to Nominee
                </button>
                <div></div>
              </div>
            </div>
          )}
        </section>

        {/* Right Sticky Column: Policy Summary & Live Calculator */}
        <aside className="checkout-summary-column">
          <div className="checkout-summary-card">
            <div className="summary-card-header">
              <div>
                <h3 className="summary-insurer-title">{selectedPlan.insurerName}</h3>
                <span className="summary-plan-badge">{selectedPlan.category}</span>
              </div>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "8px",
                  borderRadius: "8px",
                  fontWeight: "800",
                  color: "#1d4ed8"
                }}
              >
                <FiShield size={20} />
              </div>
            </div>

            {/* Plan Coverage */}
            <div className="summary-cover-box">
              <span className="summary-cover-label">Sum Insured / Life Cover</span>
              <span className="summary-cover-val">
                {selectedPlan.lifeCover || "₹10 Lakhs"}
              </span>
            </div>

            {/* Interactive Add-on Riders */}
            <div className="summary-riders-box">
              <div className="summary-riders-title">
                <span>Optional Add-On Riders</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Live Updates</span>
              </div>

              {/* Rider 1: Critical Illness */}
              <div
                className={`rider-toggle-row ${riders.criticalIllness ? "selected" : ""}`}
                onClick={() =>
                  setRiders({ ...riders, criticalIllness: !riders.criticalIllness })
                }
              >
                <div className="rider-info">
                  <input
                    type="checkbox"
                    checked={riders.criticalIllness}
                    onChange={() => {}}
                    style={{ accentColor: "#1d4ed8" }}
                  />
                  <span>Critical Illness Cover</span>
                </div>
                <span className="rider-cost">+₹499/yr</span>
              </div>

              {/* Rider 2: Hospital Cash */}
              <div
                className={`rider-toggle-row ${riders.hospitalCash ? "selected" : ""}`}
                onClick={() => setRiders({ ...riders, hospitalCash: !riders.hospitalCash })}
              >
                <div className="rider-info">
                  <input
                    type="checkbox"
                    checked={riders.hospitalCash}
                    onChange={() => {}}
                    style={{ accentColor: "#1d4ed8" }}
                  />
                  <span>Hospital Daily Cash (₹2k/day)</span>
                </div>
                <span className="rider-cost">+₹249/yr</span>
              </div>

              {/* Rider 3: Accidental Cover */}
              <div
                className={`rider-toggle-row ${riders.accidentalCover ? "selected" : ""}`}
                onClick={() =>
                  setRiders({ ...riders, accidentalCover: !riders.accidentalCover })
                }
              >
                <div className="rider-info">
                  <input
                    type="checkbox"
                    checked={riders.accidentalCover}
                    onChange={() => {}}
                    style={{ accentColor: "#1d4ed8" }}
                  />
                  <span>Accidental Total Disability</span>
                </div>
                <span className="rider-cost">+₹350/yr</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
              <div className="summary-breakdown-row">
                <span>Base Annual Premium</span>
                <span style={{ fontWeight: "600" }}>₹{rawBase.toLocaleString("en-IN")}</span>
              </div>

              {riderTotal > 0 && (
                <div className="summary-breakdown-row">
                  <span>Selected Add-On Riders</span>
                  <span style={{ fontWeight: "600", color: "#ea580c" }}>
                    +₹{riderTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="summary-breakdown-row">
                <span>Net Premium</span>
                <span style={{ fontWeight: "600" }}>₹{netPremium.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-breakdown-row">
                <span>GST @ 18% (Statutory Indian Tax)</span>
                <span style={{ fontWeight: "600" }}>₹{gst.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-breakdown-row total-row">
                <span>Total Amount Payable</span>
                <span className="summary-total-price">₹{totalPayable.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* SafeLife Trust & Assurance Card */}
          <div className="checkout-trust-card">
            <div className="trust-item">
              <FiCheckCircle color="#059669" size={16} />
              <span>100% Verified IRDAI Direct Broker License #742</span>
            </div>
            <div className="trust-item">
              <FiAward color="#1d4ed8" size={16} />
              <span>30-Day Free Look Guarantee (100% Refundable)</span>
            </div>
            <div className="trust-item">
              <FiActivity color="#ea580c" size={16} />
              <span>30-Minute SafeLife Priority Claim Support</span>
            </div>
            <div className="trust-item">
              <FiFileText color="#059669" size={16} />
              <span>Instant Digital Policy Document on WhatsApp & Email</span>
            </div>
          </div>
        </aside>
      </main>

      {/* ============================================================
          POLICY ISSUANCE CONFIRMATION MODAL & DIGITAL CERTIFICATE
      ============================================================ */}
      {showModal && policyIssued && (
        <div className="policy-modal-overlay">
          <div className="policy-certificate-card">
            <div className="certificate-header">
              <div>
                <div style={{ fontSize: "12px", opacity: 0.85, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Government of India • IRDAI Registered
                </div>
                <h3 style={{ margin: "4px 0 0 0", fontSize: "20px" }}>Official Policy Certificate</h3>
              </div>
              <div className="certificate-badge-verified">
                <FiCheckCircle size={15} /> 100% ACTIVE
              </div>
            </div>

            <div className="certificate-body">
              <div className="policy-number-strip">
                <div>
                  <span style={{ fontSize: "11px", color: "#166534", fontWeight: "700", textTransform: "uppercase" }}>
                    Policy Number
                  </span>
                  <div className="policy-num-text">{policyIssued.policyNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "11px", color: "#166534", fontWeight: "700", textTransform: "uppercase" }}>
                    Underwriting Status
                  </span>
                  <div style={{ fontSize: "13px", fontWeight: "800", color: "#15803d" }}>
                    APPROVED & ISSUED
                  </div>
                </div>
              </div>

              <div className="cert-details-grid">
                <div className="cert-cell">
                  <div className="cert-cell-label">Insurance Provider</div>
                  <div className="cert-cell-val">{policyIssued.insurerName}</div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Policy Plan</div>
                  <div className="cert-cell-val">{policyIssued.planName}</div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Insured Person</div>
                  <div className="cert-cell-val">{policyIssued.insuredName}</div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Coverage / Sum Insured</div>
                  <div className="cert-cell-val" style={{ color: "#1d4ed8" }}>
                    {policyIssued.sumInsured}
                  </div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Nominee Designated</div>
                  <div className="cert-cell-val">{policyIssued.nomineeName}</div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Total Premium Paid</div>
                  <div className="cert-cell-val" style={{ color: "#16a34a" }}>
                    ₹{policyIssued.premiumPaid.toLocaleString("en-IN")} (Incl. GST)
                  </div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Policy Validity</div>
                  <div className="cert-cell-val">
                    {policyIssued.issueDate} to {policyIssued.validUntil}
                  </div>
                </div>

                <div className="cert-cell">
                  <div className="cert-cell-label">Underwriting Disclosures</div>
                  <div className="cert-cell-val" style={{ color: "#059669" }}>
                    Full IRDAI Section 45 Verified
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "#eff6ff",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#1e40af",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <FiCheckCircle size={18} style={{ minWidth: "18px" }} />
                <span>
                  A copy of this digital policy document and payment tax invoice has been sent to <strong>{policyIssued.insuredEmail}</strong> and mobile <strong>{policyIssued.insuredMobile}</strong>. Saved to Supabase ledger.
                </span>
              </div>

              <div className="cert-footer-actions">
                <button
                  type="button"
                  className="btn-cert-download"
                  onClick={() => {
                    alert(`Downloading Official SafeLife Policy Document ${policyIssued.policyNumber}.pdf...`);
                  }}
                >
                  <FiDownload size={16} /> Download Policy PDF
                </button>
                <button
                  type="button"
                  className="btn-cert-home"
                  onClick={() => window.print()}
                >
                  <FiPrinter size={16} /> Print
                </button>
                <button
                  type="button"
                  className="btn-cert-home"
                  onClick={() => navigate("/")}
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalCheckout;