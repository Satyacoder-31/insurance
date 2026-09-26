import hdfc from "../Components/Product_page/data/HDFC_Life_logo.webp"
import icici from "../Components/Product_page/data/ICICI_logo.webp"
import max from "../Components/Product_page/data/MAX_logo.png"
import tata from "../Components/Product_page/data/TATA_AIA_logo (1).png"
import bajaj from "../Components/Product_page/Images/BAJAJ_logo.webp"
import kotak from "../Components/Product_page/Images/kotak_logo.webp"

const savedUser = JSON.parse(sessionStorage.getItem("loggedInUserInfo")) || {
  isAuth: false,
  name: "",
  phoneNumber: "",
};

let data = {
  login: savedUser,
  user_details: {},
  user_health_insurance: {
    self: true,
    spouse: false,
    son: false,
    doughter: true,
    father: true,
    mother: false
  },
  Term_Life_Insurance: [
    {
      insurer: { image: icici, name: "ICICI Prudential Life Insurance" },
      life_cover: "100",
      cover_till_age: { max_age: "75", max_limit: "99", cover_term: "35" },
      premium: "849",
      clim_settled: 98.9,
      offers: ["Waiver of Premium Cover", "100% payout on Terminal Illness", "Accidental Death Benefit", "Cover against 34 critical illnesses"]
    },
    {
      insurer: { image: max, name: "Axis Max Life" },
      life_cover: "100",
      cover_till_age: { max_age: "70", max_limit: "99", cover_term: "30" },
      premium: "799",
      clim_settled: 96.5,
      offers: ["Comprehensive Life Protection", "Increasing Cover Option", "Critical Illness Add-on", "Tax Savings under 80C"]
    },
    {
      insurer: { image: kotak, name: "ABSL Life" },
      life_cover: "75",
      cover_till_age: { max_age: "65", max_limit: "99", cover_term: "25" },
      premium: "689",
      clim_settled: 97.4,
      offers: ["Flexible Payment Options", "Waiver of Premium", "Terminal Illness Benefit", "Disability Shield"]
    },
    {
      insurer: { image: hdfc, name: "HDFC Life" },
      life_cover: "100",
      cover_till_age: { max_age: "80", max_limit: "99", cover_term: "40" },
      premium: "899",
      clim_settled: 97.9,
      offers: ["Instant Online Policy", "Life Long Cover up to 99 Yrs", "Terminal Illness Payout", "3D Life Shield"]
    },
    {
      insurer: { image: tata, name: "TATA AIA Life" },
      life_cover: "100",
      cover_till_age: { max_age: "75", max_limit: "99", cover_term: "35" },
      premium: "820",
      clim_settled: 99.0,
      offers: ["Highest Claim Settlement Ratio", "Accidental Death Shield", "Waiver of Premium", "Zero Cost Surrender"]
    },
    {
      insurer: { image: bajaj, name: "SBI Life" },
      life_cover: "100",
      cover_till_age: { max_age: "70", max_limit: "99", cover_term: "30" },
      premium: "765",
      clim_settled: 97.1,
      offers: ["Government Trust & Stability", "Dual Cover Option", "Comprehensive Critical Illness", "Tax Exemption"]
    }
  ],
  Health_Insurance: [
    { 
      name: "Star Health Insurance", 
      hospitals: "14,000+ Cashless", 
      cover: "10", 
      coverDisplay: "₹10 Lac", 
      premium: "599", 
      clim_settled: 99.0, 
      tag: "Market Leader",
      offers: ["Zero copayment at network hospitals", "Modern robotic treatments covered", "Pre & post hospitalisation included", "No medical test required up to 50 yrs"]
    },
    { 
      name: "Care Health Insurance", 
      hospitals: "11,000+ Cashless", 
      cover: "15", 
      coverDisplay: "₹15 Lac", 
      premium: "649", 
      clim_settled: 95.2, 
      tag: "Zero Deductible",
      offers: ["Unlimited automatic sum recharge", "Annual health check-up for all members", "No claim bonus up to 150%", "All daycare surgeries covered"]
    },
    { 
      name: "HDFC ERGO Health Insurance", 
      hospitals: "12,000+ Cashless", 
      cover: "10", 
      coverDisplay: "₹10 Lac", 
      premium: "720", 
      clim_settled: 97.3, 
      tag: "Fast Approvals",
      offers: ["20-minute cashless approvals", "Zero room-rent sub-limits", "Worldwide emergency coverage", "Pre-existing diseases covered after 3 yrs"]
    },
    { 
      name: "Niva Bupa Health Insurance", 
      hospitals: "10,000+ Cashless", 
      cover: "10", 
      coverDisplay: "₹10 Lac", 
      premium: "580", 
      clim_settled: 96.4, 
      tag: "Instant Card",
      offers: ["30-minute cashless claim processing", "Pharmacy & OPD consultations covered", "Lock the clock age discount", "Maternity cover options"]
    },
    { 
      name: "ABSL Health Insurance", 
      hospitals: "10,500+ Cashless", 
      cover: "10", 
      coverDisplay: "₹10 Lac", 
      premium: "610", 
      clim_settled: 97.4, 
      tag: "Health Rewards",
      offers: ["HealthReturns™: earn up to 30% back", "Chronic illness management support", "Home healthcare coverage", "Mental wellness support"]
    }
  ],
  General_Insurance: [
    { 
      name: "SBI General Insurance", 
      claimRatio: "95.2%", 
      clim_settled: 95.2, 
      tag: "Pan-India Network", 
      premium: "450", 
      cover: "Complete Asset Shield", 
      offers: ["Pan-India network of 22,000+ branches", "Commercial liability & property cover", "Digital claim filing & settlement", "24x7 customer support"]
    },
    { 
      name: "TATA AIG GIC", 
      claimRatio: "96.8%", 
      clim_settled: 96.8, 
      tag: "Excellence in Claims", 
      premium: "499", 
      cover: "End-to-End Asset Protection", 
      offers: ["24x7 roadside & asset assistance", "Digital video survey in 1 hour", "Instant cashless garage network", "Zero depreciation cover"]
    },
    { 
      name: "BAJAJ GIC", 
      claimRatio: "98.1%", 
      clim_settled: 98.1, 
      tag: "Speedy Digital Claims", 
      premium: "520", 
      cover: "Enterprise & Motor Risk Shield", 
      offers: ["Motor OTS spot settlement in 20 mins", "Personal accident add-on benefits", "Instant digital policy renewal", "Key replacement cover"]
    },
    { 
      name: "ICICI Lombard GIC", 
      claimRatio: "97.5%", 
      clim_settled: 97.5, 
      tag: "Industry Leader", 
      premium: "560", 
      cover: "Premier Corporate & General", 
      offers: ["IL TakeCare app integration", "Cashless garage & asset ties", "Dedicated claims relationship manager", "Engine protection rider"]
    },
    { 
      name: "Go Digit GIC", 
      claimRatio: "96.4%", 
      clim_settled: 96.4, 
      tag: "Smartphone First", 
      premium: "399", 
      cover: "100% Paperless Digital Cover", 
      offers: ["Smartphone audio/video claims", "Zero inspection for renewals", "Transparent claim philosophy", "Fast 24-hr reimbursement"]
    },
    { 
      name: "HDFC ERGO GIC", 
      claimRatio: "97.3%", 
      clim_settled: 97.3, 
      tag: "Trusted Cover", 
      premium: "540", 
      cover: "Comprehensive Commercial Cover", 
      offers: ["AI-backed instant claim survey", "Zero depreciation add-on options", "End-to-end commercial risk shield", "Overnight repair guarantee"]
    }
  ]
};

export const Reducer = (storedata = data, action) => {
  switch (action.type) {
    case "user":
      return { ...storedata, user_details: action.payload };
    case "health":
      return { ...storedata, user_health_insurance: action.payload };
    case "LOGIN":
      return {
        ...storedata,
        login: {
          isAuth: action.payload?.isAuth ?? true,
          name: action.payload?.name || "",
          phoneNumber: action.payload?.phoneNumber || "",
        },
      };
    case "LOGOUT":
      return {
        ...storedata,
        login: {
          isAuth: false,
          name: "",
          phoneNumber: "",
        },
      };
    default:
      return storedata;
  }
};
