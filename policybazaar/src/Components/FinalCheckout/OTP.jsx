import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recordUserPolicy } from "../../supabaseClient";
import "./Checkout.css";

const OTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ValidateData = async () => {
    if (otp === "1234" || otp === "0000") {
      setLoading(true);
      const user = JSON.parse(sessionStorage.getItem("loggedInUserInfo")) || {
        name: "Valued Customer",
        phoneNumber: "9876543210",
      };

      // Record purchased policy into Supabase
      await recordUserPolicy({
        userPhone: user.phoneNumber || "9876543210",
        userName: user.name || "Customer",
        policyType: "Health & Life Insurance",
        insurerName: "SafeLife Partner Insurer",
        planName: "Comprehensive Protection Plan",
        premium: 9212,
      });

      setLoading(false);
      alert("Payment Successful! Your policy has been saved in Supabase. Redirecting to home page...");
      navigate("/");
    } else {
      alert("Invalid OTP. For demo purposes, enter 1234.");
    }
  };

  return (
    <div id="otpparent">
      <h3 style={{ marginBottom: "10px", color: "#1e293b" }}>OTP Verification</h3>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "15px" }}>
        An OTP has been sent to your registered mobile number (Demo code: <strong>1234</strong>)
      </p>
      <input
        id="otpinput"
        type="number"
        placeholder="Enter 4-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{
          padding: "10px 15px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
          fontSize: "16px",
          width: "200px",
          textAlign: "center",
          letterSpacing: "4px",
        }}
      />
      <br />
      <button
        onClick={ValidateData}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 28px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {loading ? "Saving to Supabase..." : "VERIFY & PAY"}
      </button>
    </div>
  );
};

export default OTP;