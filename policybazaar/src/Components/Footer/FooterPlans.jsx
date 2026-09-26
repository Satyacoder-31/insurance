import { BsUmbrella } from "react-icons/bs"
import { FaHeartbeat } from 'react-icons/fa'
import { AiTwotoneInsurance } from "react-icons/ai"
import FooterData from "./Data"
import { Link } from "react-router-dom"

const FooterPlans = () => {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "30px" }}>
            <div style={{ flex: "1", minWidth: "220px" }}>
                <div className="icontextfooter">
                    <BsUmbrella size="24" color="#60a5fa"/>
                    <h4>Life Insurance</h4>
                </div>
                <ul style={{ listStyleType: "none", paddingLeft: "0", marginTop: "12px" }}>
                    {FooterData["Life Insurance"].map((ele, idx) => (
                        <li key={idx} style={{ margin: "8px 0" }}>
                            <Link to="/plans" style={{ color: "#cbd5e1", textDecoration: "none" }}>{ele}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: "1", minWidth: "220px" }}>
                <div className="icontextfooter">
                    <FaHeartbeat size="24" color="#f87171"/>
                    <h4>Health Insurance</h4>
                </div>
                <ul style={{ listStyleType: "none", paddingLeft: "0", marginTop: "12px" }}>
                    {FooterData["Health Insurance"].map((ele, idx) => (
                        <li key={idx} style={{ margin: "8px 0" }}>
                            <Link to="/health" style={{ color: "#cbd5e1", textDecoration: "none" }}>{ele}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ flex: "1", minWidth: "220px" }}>
                <div className="icontextfooter">
                    <AiTwotoneInsurance size="24" color="#34d399"/>
                    <h4>General Insurance Co. Ltd</h4>
                </div>
                <ul style={{ listStyleType: "none", paddingLeft: "0", marginTop: "12px" }}>
                    {FooterData["General Insurance Co. Ltd"].map((ele, idx) => (
                        <li key={idx} style={{ margin: "8px 0" }}>
                            <Link to="/term" style={{ color: "#cbd5e1", textDecoration: "none" }}>{ele}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FooterPlans;