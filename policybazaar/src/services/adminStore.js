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
    phone: "9820145890",
    email: "rahul.mehta@gmail.com",
    gender: "Male",
    policyType: "Health Insurance",
    planName: "Star Health Comprehensive Family Optima",
    insurer: "Star Health Insurance",
    sumInsured: "₹ 25,00,000",
    premium: 16840,
    pincode: "400051",
    city: "Mumbai",
    members: "Self, Spouse, 1 Child",
    preExistingDiseases: "None declared",
    smokingAlcohol: "Non-smoker",
    status: "Approved",
    createdAt: "2026-09-27T10:15:00.000Z"
  },
  {
    id: "APP-2026-9042",
    customerName: "Pooja Deshmukh",
    phone: "9819234511",
    email: "pooja.d@yahoo.com",
    gender: "Female",
    policyType: "Life & Term Insurance",
    planName: "ICICI Prudential iProtect Smart Life Cover",
    insurer: "ICICI Prudential Life",
    sumInsured: "₹ 1.5 Crore",
    premium: 10540,
    pincode: "110001",
    city: "New Delhi",
    members: "Self (Life Assured)",
    preExistingDiseases: "No chronic conditions",
    smokingAlcohol: "Non-smoker",
    status: "Under Review",
    createdAt: "2026-09-27T11:45:00.000Z"
  },
  {
    id: "APP-2026-9043",
    customerName: "Ananya Iyer",
    phone: "9845123908",
    email: "ananya.iyer@outlook.com",
    gender: "Female",
    policyType: "Health Insurance",
    planName: "HDFC ERGO Optima Secure Family",
    insurer: "HDFC ERGO Health",
    sumInsured: "₹ 50,00,000",
    premium: 21450,
    pincode: "560001",
    city: "Bengaluru",
    members: "Self, Spouse",
    preExistingDiseases: "Thyroid (Managed)",
    smokingAlcohol: "Non-smoker",
    status: "Pending Verification",
    createdAt: "2026-09-26T16:20:00.000Z"
  },
  {
    id: "APP-2026-9044",
    customerName: "Vikram Singhania",
    phone: "9830112233",
    email: "vikram.s@gmail.com",
    gender: "Male",
    policyType: "General Insurance",
    planName: "Tata AIG Comprehensive Vehicle Asset Shield",
    insurer: "Tata AIG GIC",
    sumInsured: "₹ 12,00,000",
    premium: 7850,
    pincode: "700016",
    city: "Kolkata",
    members: "Self",
    preExistingDiseases: "N/A",
    smokingAlcohol: "N/A",
    status: "Approved",
    createdAt: "2026-09-26T14:10:00.000Z"
  }
];

const defaultClaims = [
  {
    claimId: "CLM-2026-8841",
    patientName: "Krishnakumar S.",
    phone: "9876543210",
    policyNumber: "POL-SH-928172",
    insurer: "Star Health Insurance",
    claimType: "Cashless Hospitalization",
    hospitalName: "Apollo Speciality Hospitals, Chennai",
    admissionDate: "2026-09-24",
    estimatedAmount: "₹ 1,85,000",
    approvedAmount: "₹ 1,85,000",
    status: "Cashless Approved",
    surveyorNotes: "Pre-authorization approved in 22 mins. SafeLife on-ground advocate attended TPA desk.",
    createdAt: "2026-09-24T10:15:00.000Z"
  },
  {
    claimId: "CLM-2026-8842",
    patientName: "Amitabh Banerjee",
    phone: "9831098765",
    policyNumber: "POL-HDFC-882190",
    insurer: "HDFC ERGO Health",
    claimType: "Medical Reimbursement",
    hospitalName: "AMRI Hospital, Dhakuria, Kolkata",
    admissionDate: "2026-09-25",
    estimatedAmount: "₹ 92,000",
    approvedAmount: "Under Review",
    status: "Documents Under Verification",
    surveyorNotes: "Discharge summary received. Waiting for pharmacy breakdown bills.",
    createdAt: "2026-09-25T14:30:00.000Z"
  },
  {
    claimId: "CLM-2026-8843",
    patientName: "Sanjay Kulkarni",
    phone: "9822019283",
    policyNumber: "POL-TATA-330192",
    insurer: "Tata AIG GIC",
    claimType: "Motor Accidental Damage",
    hospitalName: "Sai Service Workshop, Pune",
    admissionDate: "2026-09-26",
    estimatedAmount: "₹ 48,500",
    approvedAmount: "₹ 45,000",
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
    category: "Policy Endorsement / Nominee Change",
    message: "I want to add my newborn child to my existing Family Health Optima plan.",
    priority: "High",
    status: "In Progress",
    assignedTo: "Advisor Pooja (Team Health)",
    createdAt: "2026-09-27T09:30:00.000Z"
  },
  {
    ticketId: "TKT-84913",
    customerName: "Devendra Rathore",
    phone: "9829038475",
    category: "Tax Deduction Certificate (80D / 80C)",
    message: "Please send the formal Form 16 80D tax paid receipt for financial year 2025-26.",
    priority: "Normal",
    status: "Resolved",
    assignedTo: "Automated Tax Desk",
    createdAt: "2026-09-26T18:10:00.000Z"
  },
  {
    ticketId: "TKT-84914",
    customerName: "Karthik Raja",
    phone: "9840192837",
    category: "Cashless Hospital Network Lookup",
    message: "Is MIOT International hospital in Chennai covered for zero-copay cashless treatment?",
    priority: "Normal",
    status: "Open",
    assignedTo: "Unassigned",
    createdAt: "2026-09-27T12:00:00.000Z"
  }
];

const defaultCallbacks = [
  {
    callbackId: "CB-7701",
    customerName: "Harish Patel",
    phone: "9825019283",
    topic: "Renewal Assistance",
    status: "Pending",
    createdAt: "2026-09-27T12:45:00.000Z"
  },
  {
    callbackId: "CB-7702",
    customerName: "Deepak Choudhary",
    phone: "9810293847",
    topic: "Filing a Cashless Hospital Claim",
    status: "Completed",
    createdAt: "2026-09-27T11:20:00.000Z"
  },
  {
    callbackId: "CB-7703",
    customerName: "Meenakshi Sundaram",
    phone: "9841029384",
    topic: "New Policy Recommendation",
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
      id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Submitted",
      createdAt: new Date().toISOString(),
      ...proposal,
    };
    const updated = [newEntry, ...list];
    setStorageList(PROPOSALS_KEY, updated);
    return newEntry;
  },
  updateProposalStatus: (id, status) => {
    const list = adminStore.getProposals();
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    setStorageList(PROPOSALS_KEY, updated);
    return updated;
  },

  // Claims
  getClaims: () => getStorageList(CLAIMS_KEY, defaultClaims),
  saveClaim: (claim) => {
    const list = adminStore.getClaims();
    const newClaim = {
      claimId: claim.claimId || `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Claim Lodged",
      createdAt: new Date().toISOString(),
      approvedAmount: "Under Review",
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
      priority: "Normal",
      createdAt: new Date().toISOString(),
      ...ticket,
    };
    const updated = [newTicket, ...list];
    setStorageList(TICKETS_KEY, updated);
    return newTicket;
  },
  updateTicketStatus: (ticketId, status) => {
    const list = adminStore.getTickets();
    const updated = list.map((t) => (t.ticketId === ticketId ? { ...t, status } : t));
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
    const updated = list.map((c) => (c.callbackId === callbackId ? { ...c, status } : c));
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

  // Summary Metrics
  getMetrics: () => {
    const proposals = adminStore.getProposals();
    const claims = adminStore.getClaims();
    const tickets = adminStore.getTickets();
    const callbacks = adminStore.getCallbacks();
    const renewals = adminStore.getRenewals();

    const totalPremiumVolume =
      proposals.reduce((sum, p) => sum + (Number(p.premium) || 0), 0) +
      renewals.reduce((sum, r) => sum + (Number(r.finalPremium) || 0), 0);

    const pendingClaims = claims.filter((c) => c.status !== "Cashless Approved" && c.status !== "Settled").length;
    const openTickets = tickets.filter((t) => t.status !== "Resolved").length;
    const pendingCallbacks = callbacks.filter((c) => c.status === "Pending").length;

    return {
      totalApplications: proposals.length,
      totalClaims: claims.length,
      pendingClaims,
      openTickets,
      pendingCallbacks,
      totalRenewals: renewals.length,
      totalPremiumVolume,
    };
  },
};

export default adminStore;
