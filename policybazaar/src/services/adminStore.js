// SafeLife Centralized Admin Data Store with LocalStorage Persistence
const PROPOSALS_KEY = "safelife_admin_proposals";
const CLAIMS_KEY = "safelife_admin_claims";
const TICKETS_KEY = "safelife_admin_tickets";
const CALLBACKS_KEY = "safelife_admin_callbacks";
const RENEWALS_KEY = "safelife_admin_renewals";

// Initial seed data for a rich out-of-the-box admin experience
const defaultProposals = [
  {
    id: "APP-2026-9041",
    customerName: "Rahul Mehta",
    title: "Mr",
    gender: "Male",
    dob: "1991-05-14",
    age: 35,
    phone: "9820145890",
    email: "rahul.mehta@gmail.com",
    maritalStatus: "Married",
    occupation: "Salaried (IT Architect)",
    annualIncome: "₹15L - ₹25L",
    education: "Post Graduate",
    address: "Flat 802, Oberoi Sky Heights, Andheri West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400053",
    panNumber: "ABCPM9081K",
    aadhaarLast4: "4921",
    policyType: "Health Insurance",
    planName: "Star Health Comprehensive Family Optima",
    insurer: "Star Health Insurance",
    sumInsured: "₹ 25,00,000",
    premium: 16840,
    members: "Self (35 yrs), Spouse (32 yrs), Son (5 yrs)",
    membersList: [
      { relation: "Self", age: 35 },
      { relation: "Spouse", age: 32 },
      { relation: "Son", age: 5 }
    ],
    underwriting: {
      tobacco: "No",
      tobaccoFreq: "N/A",
      alcohol: "Social",
      alcoholFreq: "1-2 times/month",
      hazardousJob: "No",
      preExistingConditions: "None declared (Healthy)",
      hospitalizedPast4Years: "No",
      hospitalizedReason: "N/A",
      regularMedication: "No",
      medicationDetails: "N/A",
      familyHistory: "No hereditary heart or cancer conditions",
      previousRejection: "No prior proposals rejected",
      riskRating: "Preferred Clean Risk"
    },
    preExistingDiseases: "None declared",
    smokingAlcohol: "Non-smoker, Occasional Social Wine",
    nominee: {
      fullName: "Ankita Mehta",
      relationship: "Spouse",
      dob: "1994-08-20",
      age: 32,
      gender: "Female",
      share: "100%",
      hasAppointee: false,
      appointeeName: "N/A",
      appointeeRelation: "N/A"
    },
    riders: {
      criticalIllness: true,
      criticalCost: 499,
      hospitalCash: true,
      hospitalCashCost: 249,
      accidentalCover: true,
      accidentalCost: 350,
      riderTotal: 1098
    },
    pricing: {
      basePremium: 14850,
      riderTotal: 1098,
      gst: 2871,
      totalPayable: 18819
    },
    payment: {
      method: "UPI",
      paymentIdentifier: "rahul.mehta@okaxis",
      bank: "Axis Bank",
      status: "SUCCESS",
      transactionId: "TXN-88491024"
    },
    adminNote: "KYC verified automatically via Aadhaar OTP and PAN NSDL check. Underwriter cleared.",
    source: "Checkout Online Proposal",
    status: "Approved",
    createdAt: "2026-09-27T10:15:00.000Z"
  },
  {
    id: "APP-2026-9042",
    customerName: "Pooja Deshmukh",
    title: "Ms",
    gender: "Female",
    dob: "1993-11-28",
    age: 32,
    phone: "9819234511",
    email: "pooja.d@yahoo.com",
    maritalStatus: "Single",
    occupation: "Self Employed Professional",
    annualIncome: "₹10L - ₹15L",
    education: "Graduate",
    address: "C-12, Green Park Extension",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110016",
    panNumber: "BPKPD4412M",
    aadhaarLast4: "7103",
    policyType: "Life & Term Insurance",
    planName: "ICICI Prudential iProtect Smart Life Cover",
    insurer: "ICICI Prudential Life",
    sumInsured: "₹ 1.5 Crore",
    premium: 10540,
    members: "Self (Life Assured)",
    membersList: [{ relation: "Self", age: 32 }],
    underwriting: {
      tobacco: "No",
      tobaccoFreq: "N/A",
      alcohol: "No",
      alcoholFreq: "N/A",
      hazardousJob: "No",
      preExistingConditions: "Mild seasonal allergies (controlled)",
      hospitalizedPast4Years: "No",
      hospitalizedReason: "N/A",
      regularMedication: "No",
      medicationDetails: "N/A",
      familyHistory: "Father diagnosed with Type 2 Diabetes at age 58",
      previousRejection: "No",
      riskRating: "Standard Underwriting Risk"
    },
    preExistingDiseases: "No chronic conditions",
    smokingAlcohol: "Non-smoker",
    nominee: {
      fullName: "Sunita Deshmukh",
      relationship: "Mother",
      dob: "1968-04-12",
      age: 58,
      gender: "Female",
      share: "100%",
      hasAppointee: false,
      appointeeName: "N/A",
      appointeeRelation: "N/A"
    },
    riders: {
      criticalIllness: true,
      criticalCost: 499,
      hospitalCash: false,
      hospitalCashCost: 0,
      accidentalCover: true,
      accidentalCost: 350,
      riderTotal: 849
    },
    pricing: {
      basePremium: 8933,
      riderTotal: 849,
      gst: 1761,
      totalPayable: 11543
    },
    payment: {
      method: "NETBANKING",
      paymentIdentifier: "HDFC Bank NetBanking",
      bank: "HDFC Bank",
      status: "SUCCESS",
      transactionId: "TXN-99120482"
    },
    adminNote: "Medical tele-underwriting scheduled for family history verification.",
    source: "Checkout Online Proposal",
    status: "Under Review",
    createdAt: "2026-09-27T11:45:00.000Z"
  },
  {
    id: "APP-2026-9043",
    customerName: "Ananya Iyer",
    title: "Mrs",
    gender: "Female",
    dob: "1990-03-17",
    age: 36,
    phone: "9845123908",
    email: "ananya.iyer@outlook.com",
    maritalStatus: "Married",
    occupation: "Salaried (Senior Manager)",
    annualIncome: "₹25L - ₹35L",
    education: "Master of Business Administration",
    address: "Tower 4, 1102, Prestige Shantiniketan, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560048",
    panNumber: "AIYPR7823Q",
    aadhaarLast4: "9821",
    policyType: "Health Insurance",
    planName: "HDFC ERGO Optima Secure Family",
    insurer: "HDFC ERGO Health",
    sumInsured: "₹ 50,00,000",
    premium: 21450,
    members: "Self (36 yrs), Spouse (38 yrs)",
    membersList: [
      { relation: "Self", age: 36 },
      { relation: "Spouse", age: 38 }
    ],
    underwriting: {
      tobacco: "No",
      tobaccoFreq: "N/A",
      alcohol: "Social",
      alcoholFreq: "Occasional",
      hazardousJob: "No",
      preExistingConditions: "Hypothyroidism (Thyronorm 50mcg daily)",
      hospitalizedPast4Years: "No",
      hospitalizedReason: "N/A",
      regularMedication: "Yes",
      medicationDetails: "Thyronorm 50mcg - 1 tab daily morning",
      familyHistory: "No major illnesses",
      previousRejection: "No",
      riskRating: "Standard with Mild Loading"
    },
    preExistingDiseases: "Thyroid (Managed with regular prescription)",
    smokingAlcohol: "Non-smoker",
    nominee: {
      fullName: "Ganesh Iyer",
      relationship: "Spouse",
      dob: "1988-09-05",
      age: 38,
      gender: "Male",
      share: "100%",
      hasAppointee: false,
      appointeeName: "N/A",
      appointeeRelation: "N/A"
    },
    riders: {
      criticalIllness: true,
      criticalCost: 499,
      hospitalCash: true,
      hospitalCashCost: 249,
      accidentalCover: false,
      accidentalCost: 0,
      riderTotal: 748
    },
    pricing: {
      basePremium: 19850,
      riderTotal: 748,
      gst: 3708,
      totalPayable: 24306
    },
    payment: {
      method: "CREDIT_CARD",
      paymentIdentifier: "ICICI Coral Card •••• 4421",
      bank: "ICICI Bank",
      status: "SUCCESS",
      transactionId: "TXN-77291038"
    },
    adminNote: "Awaiting recent TSH thyroid lab report upload before final issuance.",
    source: "Checkout Online Proposal",
    status: "Pending Verification",
    createdAt: "2026-09-26T16:20:00.000Z"
  },
  {
    id: "APP-2026-9044",
    customerName: "Vikram Singhania",
    title: "Mr",
    gender: "Male",
    dob: "1987-10-09",
    age: 39,
    phone: "9830112233",
    email: "vikram.s@gmail.com",
    maritalStatus: "Married",
    occupation: "Business Owner / Industrialist",
    annualIncome: "₹35L - ₹50L",
    education: "Graduate",
    address: "14/2, Alipore Road, Near Zoo Gardens",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700027",
    panNumber: "VSING1029R",
    aadhaarLast4: "3318",
    policyType: "General Insurance",
    planName: "Tata AIG Comprehensive Vehicle Asset Shield",
    insurer: "Tata AIG GIC",
    sumInsured: "₹ 12,00,000",
    premium: 7850,
    members: "Self (Vehicle Owner)",
    membersList: [{ relation: "Self", age: 39 }],
    underwriting: {
      tobacco: "No",
      tobaccoFreq: "N/A",
      alcohol: "No",
      alcoholFreq: "N/A",
      hazardousJob: "No",
      preExistingConditions: "N/A",
      hospitalizedPast4Years: "No",
      hospitalizedReason: "N/A",
      regularMedication: "No",
      medicationDetails: "N/A",
      familyHistory: "N/A",
      previousRejection: "No",
      riskRating: "Low Risk Motor Profile"
    },
    preExistingDiseases: "N/A",
    smokingAlcohol: "N/A",
    nominee: {
      fullName: "Neha Singhania",
      relationship: "Spouse",
      dob: "1990-12-14",
      age: 36,
      gender: "Female",
      share: "100%",
      hasAppointee: false,
      appointeeName: "N/A",
      appointeeRelation: "N/A"
    },
    riders: {
      criticalIllness: false,
      criticalCost: 0,
      hospitalCash: false,
      hospitalCashCost: 0,
      accidentalCover: true,
      accidentalCost: 350,
      riderTotal: 350
    },
    pricing: {
      basePremium: 6850,
      riderTotal: 350,
      gst: 1296,
      totalPayable: 8496
    },
    payment: {
      method: "UPI",
      paymentIdentifier: "vikram@okhdfcbank",
      bank: "HDFC Bank",
      status: "SUCCESS",
      transactionId: "TXN-66102948"
    },
    adminNote: "Zero Depreciation cover and Engine Protect rider bound. Policy schedule delivered.",
    source: "Checkout Online Proposal",
    status: "Approved",
    createdAt: "2026-09-26T14:10:00.000Z"
  },
  {
    id: "APP-2026-9045",
    customerName: "Karthik Sundaram",
    title: "Mr",
    gender: "Male",
    dob: "1995-02-19",
    age: 31,
    phone: "9840192837",
    email: "karthik.s@gmail.com",
    maritalStatus: "Single",
    occupation: "Software Engineer",
    annualIncome: "₹10L - ₹15L",
    education: "B.Tech Computer Science",
    address: "Door 18, 3rd Cross, Besant Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600090",
    panNumber: "KSUNP9021L",
    aadhaarLast4: "1892",
    policyType: "Health Insurance",
    planName: "Care Supreme Health Shield",
    insurer: "Care Health Insurance",
    sumInsured: "₹ 10,00,000",
    premium: 9212,
    members: "Self (31 yrs)",
    membersList: [{ relation: "Self", age: 31 }],
    underwriting: {
      tobacco: "No",
      tobaccoFreq: "N/A",
      alcohol: "Social",
      alcoholFreq: "1 per month",
      hazardousJob: "No",
      preExistingConditions: "None declared (Healthy)",
      hospitalizedPast4Years: "No",
      hospitalizedReason: "N/A",
      regularMedication: "No",
      medicationDetails: "N/A",
      familyHistory: "No major illnesses",
      previousRejection: "No",
      riskRating: "Preferred Clean Risk"
    },
    preExistingDiseases: "None declared",
    smokingAlcohol: "Non-smoker",
    nominee: {
      fullName: "Sundaram R.",
      relationship: "Father",
      dob: "1963-07-15",
      age: 63,
      gender: "Male",
      share: "100%",
      hasAppointee: false,
      appointeeName: "N/A",
      appointeeRelation: "N/A"
    },
    riders: {
      criticalIllness: false,
      criticalCost: 0,
      hospitalCash: false,
      hospitalCashCost: 0,
      accidentalCover: false,
      accidentalCost: 0,
      riderTotal: 0
    },
    pricing: {
      basePremium: 7806,
      riderTotal: 0,
      gst: 1406,
      totalPayable: 9212
    },
    payment: {
      method: "UPI",
      paymentIdentifier: "karthik@ibl",
      bank: "IndusInd Bank",
      status: "SUCCESS",
      transactionId: "TXN-55291048"
    },
    adminNote: "Instant digital issuance confirmed. Policy card dispatched on WhatsApp.",
    source: "Checkout Online Proposal",
    status: "Policy Issued & Paid",
    createdAt: "2026-09-27T08:30:00.000Z"
  },
  {
    id: "APP-2026-9046",
    customerName: "Sneha Mukherjee",
    title: "Mrs",
    gender: "Female",
    dob: "1992-06-25",
    age: 34,
    phone: "9831094821",
    email: "sneha.m@gmail.com",
    maritalStatus: "Married",
    occupation: "Architect",
    annualIncome: "₹15L - ₹20L",
    education: "Bachelor of Architecture",
    address: "Block B, Flat 3A, Salt Lake Sector 1",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700064",
    panNumber: "SMUKH8812B",
    aadhaarLast4: "5109",
    policyType: "Health Insurance",
    planName: "Family Health Optima Comprehensive Shield",
    insurer: "Niva Bupa Health",
    sumInsured: "₹ 20,00,000",
    premium: 14200,
    members: "Self (34 yrs), Spouse (36 yrs), Daughter (4 yrs)",
    membersList: [
      { relation: "Self", age: 34 },
      { relation: "Spouse", age: 36 },
      { relation: "Daughter", age: 4 }
    ],
    underwriting: {
      tobacco: "No",
      tobaccoFreq: "N/A",
      alcohol: "No",
      alcoholFreq: "N/A",
      hazardousJob: "No",
      preExistingConditions: "Spouse has mild Hypertension (Amlodipine 5mg)",
      hospitalizedPast4Years: "No",
      hospitalizedReason: "N/A",
      regularMedication: "Yes",
      medicationDetails: "Amlodipine 5mg for spouse",
      familyHistory: "Maternal diabetes",
      previousRejection: "No",
      riskRating: "Sub-Standard Medical Underwriting"
    },
    preExistingDiseases: "Hypertension / High BP (Spouse)",
    smokingAlcohol: "Non-smoker",
    nominee: {
      fullName: "Dev Mukherjee",
      relationship: "Spouse",
      dob: "1990-01-18",
      age: 36,
      gender: "Male",
      share: "100%",
      hasAppointee: false,
      appointeeName: "N/A",
      appointeeRelation: "N/A"
    },
    riders: {
      criticalIllness: true,
      criticalCost: 499,
      hospitalCash: true,
      hospitalCashCost: 249,
      accidentalCover: true,
      accidentalCost: 350,
      riderTotal: 1098
    },
    pricing: {
      basePremium: 12800,
      riderTotal: 1098,
      gst: 2502,
      totalPayable: 16400
    },
    payment: {
      method: "PENDING_VERIFICATION",
      paymentIdentifier: "Direct Bank Transfer Verification",
      bank: "State Bank of India",
      status: "AWAITING_MEDICAL",
      transactionId: "TXN-AWAIT-901"
    },
    adminNote: "Medical questionnaire submitted. Awaiting underwriter review for hypertension loading approval.",
    source: "Health Insurance 4-Step Wizard",
    status: "Pending Approval",
    createdAt: "2026-09-27T12:05:00.000Z"
  }
];

const defaultClaims = [
  {
    claimId: "CLM-2026-8841",
    patientName: "Krishnakumar S.",
    phone: "9876543210",
    email: "krishnakumar.s@gmail.com",
    policyNumber: "POL-SH-928172",
    insurer: "Star Health Insurance",
    relationship: "Self",
    claimType: "Cashless Hospitalization",
    hospitalName: "Apollo Speciality Hospitals, Chennai",
    treatingDoctor: "Dr. K. Ramaswamy (Cardiology)",
    diagnosis: "Acute Angina / Coronary Angiogram",
    admissionDate: "2026-09-24",
    estimatedAmount: "₹ 1,85,000",
    approvedAmount: "₹ 1,85,000",
    roomType: "Single Private Deluxe Room",
    status: "Cashless Approved",
    surveyorNotes: "Pre-authorization approved in 22 mins. SafeLife on-ground advocate attended TPA desk.",
    createdAt: "2026-09-24T10:15:00.000Z"
  },
  {
    claimId: "CLM-2026-8842",
    patientName: "Amitabh Banerjee",
    phone: "9831098765",
    email: "amitabh.b@gmail.com",
    policyNumber: "POL-HDFC-882190",
    insurer: "HDFC ERGO Health",
    relationship: "Self",
    claimType: "Medical Reimbursement",
    hospitalName: "AMRI Hospital, Dhakuria, Kolkata",
    treatingDoctor: "Dr. S. Sen (Orthopedics)",
    diagnosis: "Knee Arthroscopy & Ligament Repair",
    admissionDate: "2026-09-25",
    estimatedAmount: "₹ 92,000",
    approvedAmount: "Under Review",
    roomType: "Twin Sharing Room",
    status: "Documents Under Verification",
    surveyorNotes: "Discharge summary received. Waiting for pharmacy breakdown bills.",
    createdAt: "2026-09-25T14:30:00.000Z"
  },
  {
    claimId: "CLM-2026-8843",
    patientName: "Sanjay Kulkarni",
    phone: "9822019283",
    email: "sanjay.kulkarni@gmail.com",
    policyNumber: "POL-TATA-330192",
    insurer: "Tata AIG GIC",
    relationship: "Self",
    claimType: "Motor Accidental Damage",
    hospitalName: "Sai Service Authorized Body Workshop, Pune",
    treatingDoctor: "Surveyor Vinod Jadhav",
    diagnosis: "Front Bumper & Radiator Collision Impact",
    admissionDate: "2026-09-26",
    estimatedAmount: "₹ 48,500",
    approvedAmount: "₹ 45,000",
    roomType: "Automotive Bodyshop",
    status: "Surveyor Approved",
    surveyorNotes: "Front bumper and headlight assembly replacement approved under zero depreciation.",
    createdAt: "2026-09-26T09:45:00.000Z"
  }
];

const defaultTickets = [
  {
    ticketId: "TKT-84912",
    customerName: "Sunita Kapoor",
    phone: "9811029384",
    email: "sunita.kapoor@gmail.com",
    policyNumber: "SL-2025-POL-771829",
    category: "Policy Endorsement / Nominee Change",
    priority: "High",
    message: "I want to add my newborn child to my existing Family Health Optima plan.",
    status: "In Progress",
    assignedTo: "Advisor Pooja (Team Health)",
    createdAt: "2026-09-27T09:30:00.000Z"
  },
  {
    ticketId: "TKT-84913",
    customerName: "Devendra Rathore",
    phone: "9829038475",
    email: "devendra.r@gmail.com",
    policyNumber: "POL-ICICI-441829",
    category: "Tax Deduction Certificate (80D / 80C)",
    priority: "Normal",
    message: "Please send the formal Form 16 80D tax paid receipt for financial year 2025-26.",
    status: "Resolved",
    assignedTo: "Automated Tax Desk",
    createdAt: "2026-09-26T18:10:00.000Z"
  },
  {
    ticketId: "TKT-84914",
    customerName: "Karthik Raja",
    phone: "9840192837",
    email: "karthik.raja@yahoo.com",
    policyNumber: "POL-STAR-901824",
    category: "Cashless Hospital Network Lookup",
    priority: "Normal",
    message: "Is MIOT International hospital in Chennai covered for zero-copay cashless treatment?",
    status: "Open",
    assignedTo: "Advisor Rahul (Customer Support)",
    createdAt: "2026-09-27T12:00:00.000Z"
  }
];

const defaultCallbacks = [
  {
    callbackId: "CB-7701",
    customerName: "Harish Patel",
    phone: "9825019283",
    email: "harish.patel@gmail.com",
    topic: "Renewal Payment Assistance",
    timeSlot: "Immediate (Next 5 mins)",
    notes: "Needs help applying 15% NCB discount on motor renewal.",
    status: "Pending",
    createdAt: "2026-09-27T12:45:00.000Z"
  },
  {
    callbackId: "CB-7702",
    customerName: "Deepak Choudhary",
    phone: "9810293847",
    email: "deepak.c@outlook.com",
    topic: "Filing a Cashless Hospital Claim",
    timeSlot: "Morning (9 AM - 12 PM)",
    notes: "Emergency hospitalization planned for father next week at Max Healthcare.",
    status: "Completed",
    createdAt: "2026-09-27T11:20:00.000Z"
  },
  {
    callbackId: "CB-7703",
    customerName: "Meenakshi Sundaram",
    phone: "9841029384",
    email: "meenakshi.s@gmail.com",
    topic: "New Policy Recommendation",
    timeSlot: "Afternoon (12 PM - 4 PM)",
    notes: "Comparing 1 Crore term life plans between ICICI and HDFC Life.",
    status: "Pending",
    createdAt: "2026-09-27T13:10:00.000Z"
  }
];

const defaultRenewals = [
  {
    renewalId: "REN-4491",
    policyNumber: "POL-7829104",
    customerName: "Satya Sharma",
    phone: "9876543210",
    email: "satya.sharma@gmail.com",
    category: "Health Insurance Renewal",
    insurer: "Star Health Insurance",
    planName: "Star Health Optima Secure Family",
    sumInsured: "₹ 25 Lakh",
    originalPremium: 14850,
    ncbDiscount: "15% On-Time Loyalty Discount",
    finalPremium: 12620,
    status: "Renewed & Active",
    paymentDate: "2026-09-27"
  },
  {
    renewalId: "REN-4492",
    policyNumber: "POL-ICICI-441829",
    customerName: "Sanjay Verma",
    phone: "9820194857",
    email: "sanjay.verma@gmail.com",
    category: "Life Insurance Renewal",
    insurer: "ICICI Prudential Life",
    planName: "iProtect Smart Term",
    sumInsured: "₹ 1 Crore",
    originalPremium: 12400,
    ncbDiscount: "15% Loyalty Discount",
    finalPremium: 10540,
    status: "Renewed & Active",
    paymentDate: "2026-09-26"
  }
];

// Helper to get array from localStorage with fallback
const getStorageList = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
};

const setStorageList = (key, list) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
};

export const adminStore = {
  // Proposals & Insurance Forms
  getProposals: () => getStorageList(PROPOSALS_KEY, defaultProposals),
  
  saveProposal: (proposal) => {
    const list = adminStore.getProposals();
    const newEntry = {
      id: proposal.id || `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: proposal.status || "Pending Approval",
      createdAt: new Date().toISOString(),
      adminNote: proposal.adminNote || "Form submitted by customer. Ready for underwriting verification.",
      ...proposal,
    };
    const updated = [newEntry, ...list];
    setStorageList(PROPOSALS_KEY, updated);
    return newEntry;
  },

  updateProposalStatus: (id, status) => {
    const list = adminStore.getProposals();
    const updated = list.map((item) => 
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    );
    setStorageList(PROPOSALS_KEY, updated);
    return updated;
  },

  updateProposalNote: (id, adminNote) => {
    const list = adminStore.getProposals();
    const updated = list.map((item) => 
      item.id === id ? { ...item, adminNote, updatedAt: new Date().toISOString() } : item
    );
    setStorageList(PROPOSALS_KEY, updated);
    return updated;
  },

  deleteProposal: (id) => {
    const list = adminStore.getProposals();
    const updated = list.filter((item) => item.id !== id);
    setStorageList(PROPOSALS_KEY, updated);
    return updated;
  },

  // Claims
  getClaims: () => getStorageList(CLAIMS_KEY, defaultClaims),

  saveClaim: (claim) => {
    const list = adminStore.getClaims();
    const newClaim = {
      claimId: claim.claimId || `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: claim.status || "Claim Lodged",
      createdAt: new Date().toISOString(),
      approvedAmount: claim.approvedAmount || "Under Review",
      ...claim,
    };
    const updated = [newClaim, ...list];
    setStorageList(CLAIMS_KEY, updated);
    return newClaim;
  },

  updateClaimStatus: (claimId, status, notes = "") => {
    const list = adminStore.getClaims();
    const updated = list.map((c) =>
      c.claimId === claimId
        ? {
            ...c,
            status,
            surveyorNotes: notes || c.surveyorNotes,
            updatedAt: new Date().toISOString(),
          }
        : c
    );
    setStorageList(CLAIMS_KEY, updated);
    return updated;
  },

  // Support Tickets
  getTickets: () => getStorageList(TICKETS_KEY, defaultTickets),

  saveTicket: (ticket) => {
    const list = adminStore.getTickets();
    const newTicket = {
      ticketId: ticket.ticketId || `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Open",
      priority: ticket.priority || "Normal",
      createdAt: new Date().toISOString(),
      ...ticket,
    };
    const updated = [newTicket, ...list];
    setStorageList(TICKETS_KEY, updated);
    return newTicket;
  },

  updateTicketStatus: (ticketId, status) => {
    const list = adminStore.getTickets();
    const updated = list.map((t) => (t.ticketId === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    setStorageList(TICKETS_KEY, updated);
    return updated;
  },

  // Callbacks
  getCallbacks: () => getStorageList(CALLBACKS_KEY, defaultCallbacks),

  saveCallback: (cb) => {
    const list = adminStore.getCallbacks();
    const newCb = {
      callbackId: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...cb,
    };
    const updated = [newCb, ...list];
    setStorageList(CALLBACKS_KEY, updated);
    return newCb;
  },

  updateCallbackStatus: (callbackId, status) => {
    const list = adminStore.getCallbacks();
    const updated = list.map((c) => (c.callbackId === callbackId ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    setStorageList(CALLBACKS_KEY, updated);
    return updated;
  },

  // Renewals
  getRenewals: () => getStorageList(RENEWALS_KEY, defaultRenewals),

  saveRenewal: (renewal) => {
    const list = adminStore.getRenewals();
    const newRen = {
      renewalId: `REN-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Renewed & Active",
      paymentDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      ...renewal,
    };
    const updated = [newRen, ...list];
    setStorageList(RENEWALS_KEY, updated);
    return newRen;
  },

  // Helper status checkers
  isPending: (status) => {
    const s = (status || "").toLowerCase();
    return s.includes("pending") || s.includes("review") || s.includes("submitted") || s.includes("quote");
  },

  isApproved: (status) => {
    const s = (status || "").toLowerCase();
    return s.includes("approved") || s.includes("issued") || s.includes("active") || s.includes("settled");
  },

  // Summary Metrics
  getMetrics: () => {
    const proposals = adminStore.getProposals();
    const claims = adminStore.getClaims();
    const tickets = adminStore.getTickets();
    const callbacks = adminStore.getCallbacks();
    const renewals = adminStore.getRenewals();

    const pendingProposals = proposals.filter((p) => adminStore.isPending(p.status)).length;
    const approvedProposals = proposals.filter((p) => adminStore.isApproved(p.status)).length;

    const totalPremiumVolume =
      proposals.reduce((sum, p) => sum + (Number(p.premium) || 0), 0) +
      renewals.reduce((sum, r) => sum + (Number(r.finalPremium) || 0), 0);

    const pendingClaims = claims.filter((c) => c.status !== "Cashless Approved" && c.status !== "Settled").length;
    const approvedClaims = claims.filter((c) => c.status === "Cashless Approved" || c.status === "Settled").length;
    const openTickets = tickets.filter((t) => t.status !== "Resolved").length;
    const pendingCallbacks = callbacks.filter((c) => c.status === "Pending").length;

    return {
      totalApplications: proposals.length,
      pendingProposals,
      approvedProposals,
      totalClaims: claims.length,
      pendingClaims,
      approvedClaims,
      openTickets,
      pendingCallbacks,
      totalRenewals: renewals.length,
      totalPremiumVolume,
    };
  },
};

export default adminStore;
