import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";

import "../Home/Home.css";

import po2 from "../../assets/images/po2.webp";
import po1 from "../../assets/images/po1.webp";
import virs from "../../assets/images/virs.png";
import hert from "../../assets/images/hert.png";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const Carosuel = () => {
  return (
    <div className="App" style={{ marginRight: "30px" }}>
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={false}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3500}
        keyBoardControl={false}
        customTransition="all .5s"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile", "desktop"]}
        itemClass="carousel-item-padding-40-px"
        style={{ marginTop: "3%" }}
      >
        {/* Slide 1: Health Insurance */}
        <Link to="/health" style={{ textDecoration: "none" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "190px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              padding: "24px",
              color: "white",
              overflow: "hidden",
              boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <img src={hert} alt="heart" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.9 }}>
                Health Insurance
              </span>
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1.3", margin: "0 0 8px 0", color: "#ffffff" }}>
              Star Health, Care, HDFC ERGO, Niva Bupa & ABSL
            </h3>
            <p style={{ fontSize: "13px", opacity: 0.85, margin: 0 }}>
              Cashless hospital network across India with instant quotes.
            </p>
            <span style={{ display: "inline-block", marginTop: "14px", fontSize: "12px", fontWeight: "700", background: "rgba(255,255,255,0.25)", padding: "4px 12px", borderRadius: "20px" }}>
              Explore Health Plans →
            </span>
          </div>
        </Link>

        {/* Slide 2: Life Insurance */}
        <Link to="/plans" style={{ textDecoration: "none" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "190px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              padding: "24px",
              color: "white",
              overflow: "hidden",
              boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <img src={hert} alt="heart" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.9 }}>
                Life Insurance
              </span>
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1.3", margin: "0 0 8px 0", color: "#ffffff" }}>
              ICICI Pru, Axis Max, ABSL, HDFC, TATA AIA, SBI
            </h3>
            <p style={{ fontSize: "13px", opacity: 0.85, margin: 0 }}>
              Up to ₹1 Cr term cover with high claim settlement ratios.
            </p>
            <span style={{ display: "inline-block", marginTop: "14px", fontSize: "12px", fontWeight: "700", background: "rgba(255,255,255,0.25)", padding: "4px 12px", borderRadius: "20px" }}>
              Compare Life Quotes →
            </span>
          </div>
        </Link>

        {/* Slide 3: General Insurance */}
        <Link to="/term" style={{ textDecoration: "none" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "190px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              padding: "24px",
              color: "white",
              overflow: "hidden",
              boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)",
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <img src={hert} alt="heart" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.9 }}>
                General Insurance Co. Ltd
              </span>
            </div>
            <h3 style={{ fontSize: "19px", fontWeight: "700", lineHeight: "1.3", margin: "0 0 8px 0", color: "#ffffff" }}>
              SBI, TATA AIG, BAJAJ, ICICI Lombard, Go Digit, HDFC ERGO
            </h3>
            <p style={{ fontSize: "13px", opacity: 0.85, margin: 0 }}>
              Premier general insurance coverage and hassle-free claim support.
            </p>
            <span style={{ display: "inline-block", marginTop: "14px", fontSize: "12px", fontWeight: "700", background: "rgba(255,255,255,0.25)", padding: "4px 12px", borderRadius: "20px" }}>
              Get General Quotes →
            </span>
          </div>
        </Link>

        {/* Slide 4: Ask SafeLife */}
        <Link to="/login" style={{ textDecoration: "none" }}>
          <div
            style={{
              position: "relative",
              width: "360px",
              height: "190px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
              padding: "24px",
              color: "white",
              overflow: "hidden",
              boxShadow: "0 10px 25px -5px rgba(234, 88, 12, 0.4)",
              margin: "0 auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <img src={hert} alt="heart" style={{ width: "20px", height: "20px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.9 }}>
                Ask SafeLife
              </span>
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", lineHeight: "1.3", margin: "0 0 8px 0", color: "#ffffff" }}>
              Got Questions on our 17 Partner Insurers?
            </h3>
            <p style={{ fontSize: "13px", opacity: 0.85, margin: 0 }}>
              Speak with a certified SafeLife insurance specialist today.
            </p>
            <span style={{ display: "inline-block", marginTop: "14px", fontSize: "12px", fontWeight: "700", background: "rgba(255,255,255,0.25)", padding: "4px 12px", borderRadius: "20px" }}>
              Talk to Advisor →
            </span>
          </div>
        </Link>
      </Carousel>
    </div>
  );
};

export default Carosuel;
