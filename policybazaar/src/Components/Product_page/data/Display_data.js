import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Display_single_page as DisplaySinglePage } from './Display_single_page';
import './Display.css';
import { FiFilter, FiChevronRight, FiSearch, FiUmbrella, FiShield } from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import { AiTwotoneInsurance } from 'react-icons/ai';

export const Display_data = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "life";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [selectedInsurer, setSelectedInsurer] = useState("");
    const [selectedCover, setSelectedCover] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
    const [claimSort, setClaimSort] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [billingPeriod, setBillingPeriod] = useState("monthly"); // "monthly" | "yearly"

    // Redux plans for all 3 categories
    const lifePlans = useSelector((st) => st.Term_Life_Insurance) || [];
    const healthPlans = useSelector((st) => st.Health_Insurance) || [];
    const generalPlans = useSelector((st) => st.General_Insurance) || [];

    // Keep activeCategory synced if searchParams changes
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat && (cat === "life" || cat === "health" || cat === "general")) {
            setActiveCategory(cat);
        }
    }, [searchParams]);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setSearchParams({ category: cat });
        setSelectedInsurer("");
        setSelectedCover("");
        setSelectedAge("");
        setClaimSort("");
        setSearchQuery("");
    };

    // Determine current pool of plans
    let currentPool = [];
    if (activeCategory === "health") {
        currentPool = [...healthPlans];
    } else if (activeCategory === "general") {
        currentPool = [...generalPlans];
    } else {
        currentPool = [...lifePlans];
    }

    // Apply filtering
    let filteredPlans = [...currentPool];

    if (selectedInsurer) {
        filteredPlans = filteredPlans.filter(p => (p.insurer?.name || p.name) === selectedInsurer);
    }

    if (selectedCover && activeCategory === "life") {
        filteredPlans = filteredPlans.filter(p => p.life_cover === selectedCover);
    } else if (selectedCover && activeCategory === "health") {
        filteredPlans = filteredPlans.filter(p => p.cover === selectedCover);
    }

    if (selectedAge && activeCategory === "life") {
        filteredPlans = filteredPlans.filter(p => p.cover_till_age?.max_age === selectedAge);
    }

    if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        filteredPlans = filteredPlans.filter(p => {
            const name = (p.insurer?.name || p.name || "").toLowerCase();
            const tag = (p.tag || "").toLowerCase();
            return name.includes(q) || tag.includes(q);
        });
    }

    if (claimSort === "L") {
        filteredPlans.sort((a, b) => a.clim_settled - b.clim_settled);
    } else if (claimSort === "H") {
        filteredPlans.sort((a, b) => b.clim_settled - a.clim_settled);
    }

    // Adjust for monthly vs yearly billing
    if (billingPeriod === "yearly") {
        filteredPlans = filteredPlans.map(p => ({
            ...p,
            displayPremium: parseInt(p.premium) * 12,
            periodText: "/year"
        }));
    } else {
        filteredPlans = filteredPlans.map(p => ({
            ...p,
            displayPremium: p.premium,
            periodText: "/month"
        }));
    }

    const resetFilters = () => {
        setSelectedInsurer("");
        setSelectedCover("");
        setSelectedAge("");
        setClaimSort("");
        setSearchQuery("");
        setBillingPeriod("monthly");
    };

    // Category Metadata
    const categoryInfo = {
        life: {
            title: "Compare Life Insurance Plans",
            subtitle: "Compare official terms & CSR from our 6 authorized Life Insurance partners.",
            count: lifePlans.length,
            insurers: ["ICICI Prudential Life Insurance", "Axis Max Life", "ABSL Life", "HDFC Life", "TATA AIA Life", "SBI Life"]
        },
        health: {
            title: "Compare Health Insurance Plans",
            subtitle: "Compare 14,000+ cashless hospital networks and zero-copay benefits from our 5 authorized Health partners.",
            count: healthPlans.length,
            insurers: ["Star Health Insurance", "Care Health Insurance", "HDFC ERGO Health Insurance", "Niva Bupa Health Insurance", "ABSL Health Insurance"]
        },
        general: {
            title: "Compare General Insurance Plans",
            subtitle: "Compare asset shields, spot digital survey, and 98%+ claim settlement ratios from our 6 General partners.",
            count: generalPlans.length,
            insurers: ["SBI General Insurance", "TATA AIG GIC", "BAJAJ GIC", "ICICI Lombard GIC", "Go Digit GIC", "HDFC ERGO GIC"]
        }
    };

    const currentInfo = categoryInfo[activeCategory] || categoryInfo.life;

    return (
        <div className="plans-page-wrapper">
            {/* Header & Breadcrumb */}
            <div className={`plans-header-banner banner-${activeCategory}`}>
                <div className="plans-header-container">
                    <div className="plans-breadcrumbs">
                        <Link to="/">Home</Link> <FiChevronRight size={14} /> 
                        <span>Compare & Buy</span> <FiChevronRight size={14} /> 
                        <span className="breadcrumb-active">{currentInfo.title}</span>
                    </div>

                    <div className="banner-title-row">
                        <div>
                            <h1>{currentInfo.title}</h1>
                            <p>{currentInfo.subtitle}</p>
                        </div>

                        <div className="banner-badge-box">
                            <FiShield size={18} />
                            <span>100% Verified Quotes</span>
                        </div>
                    </div>

                    {/* Category Switcher Tabs in Banner */}
                    <div className="plans-category-switch-tabs">
                        <button 
                            className={`cat-tab ${activeCategory === 'life' ? 'active active-life' : ''}`}
                            onClick={() => handleCategoryChange('life')}
                        >
                            <FiUmbrella size={16} /> Life Insurance ({lifePlans.length})
                        </button>

                        <button 
                            className={`cat-tab ${activeCategory === 'health' ? 'active active-health' : ''}`}
                            onClick={() => handleCategoryChange('health')}
                        >
                            <FaHeartbeat size={16} /> Health Insurance ({healthPlans.length})
                        </button>

                        <button 
                            className={`cat-tab ${activeCategory === 'general' ? 'active active-general' : ''}`}
                            onClick={() => handleCategoryChange('general')}
                        >
                            <AiTwotoneInsurance size={16} /> General Insurance ({generalPlans.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Control Bar */}
            <div className="plans-filter-section">
                <div className="plans-filter-container">
                    <div className="filter-group">
                        <label><FiFilter size={14} /> Insurer</label>
                        <select 
                            value={selectedInsurer} 
                            onChange={(e) => setSelectedInsurer(e.target.value)}
                        >
                            <option value="">All {currentInfo.insurers.length} Insurers</option>
                            {currentInfo.insurers.map((ins, i) => (
                                <option key={i} value={ins}>{ins}</option>
                            ))}
                        </select>
                    </div>

                    {activeCategory === "life" && (
                        <>
                            <div className="filter-group">
                                <label>Life Cover</label>
                                <select 
                                    value={selectedCover} 
                                    onChange={(e) => setSelectedCover(e.target.value)}
                                >
                                    <option value="">All Covers</option>
                                    <option value="50">₹50 Lac</option>
                                    <option value="75">₹75 Lac</option>
                                    <option value="100">₹1 Crore</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Cover Till Age</label>
                                <select 
                                    value={selectedAge} 
                                    onChange={(e) => setSelectedAge(e.target.value)}
                                >
                                    <option value="">All Ages</option>
                                    <option value="65">Up to 65 Yrs</option>
                                    <option value="70">Up to 70 Yrs</option>
                                    <option value="75">Up to 75 Yrs</option>
                                    <option value="80">Up to 80 Yrs</option>
                                </select>
                            </div>
                        </>
                    )}

                    {activeCategory === "health" && (
                        <div className="filter-group">
                            <label>Sum Insured</label>
                            <select 
                                value={selectedCover} 
                                onChange={(e) => setSelectedCover(e.target.value)}
                            >
                                <option value="">All Sums</option>
                                <option value="10">₹10 Lac</option>
                                <option value="15">₹15 Lac</option>
                            </select>
                        </div>
                    )}

                    <div className="filter-group">
                        <label>Claim Settlement</label>
                        <select 
                            value={claimSort} 
                            onChange={(e) => setClaimSort(e.target.value)}
                        >
                            <option value="">Default Order</option>
                            <option value="H">Highest Ratio First</option>
                            <option value="L">Lowest Ratio First</option>
                        </select>
                    </div>

                    {/* Instant Insurer Search Filter */}
                    <div className="filter-group filter-search-group">
                        <label><FiSearch size={14} /> Search Insurer</label>
                        <input 
                            type="text"
                            placeholder="Type to filter..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-filter-search"
                        />
                    </div>

                    <div className="billing-toggle-group">
                        <button 
                            className={`toggle-btn ${billingPeriod === 'monthly' ? 'active' : ''}`}
                            onClick={() => setBillingPeriod('monthly')}
                        >
                            Monthly
                        </button>
                        <button 
                            className={`toggle-btn ${billingPeriod === 'yearly' ? 'active' : ''}`}
                            onClick={() => setBillingPeriod('yearly')}
                        >
                            Yearly (Save 5%)
                        </button>
                    </div>
                </div>
            </div>

            {/* Plans List */}
            <div className="plans-content-container">
                <div className="plans-meta-bar">
                    <span>Showing <strong>{filteredPlans.length}</strong> verified <strong>{activeCategory.toUpperCase()}</strong> insurance plans</span>
                    {(selectedInsurer || selectedCover || selectedAge || claimSort || searchQuery) && (
                        <button className="btn-clear-filters" onClick={resetFilters}>Clear All Filters</button>
                    )}
                </div>

                <div className="plans-grid">
                    {filteredPlans.map((plan, idx) => (
                        <DisplaySinglePage 
                            key={idx} 
                            er={plan} 
                            category={activeCategory}
                        />
                    ))}
                </div>

                {filteredPlans.length === 0 && (
                    <div className="no-plans-box">
                        <h3>No plans match your selected filters</h3>
                        <p>Try resetting the filters or selecting another insurer.</p>
                        <button onClick={resetFilters} className="btn-reset-filters">Reset Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};
