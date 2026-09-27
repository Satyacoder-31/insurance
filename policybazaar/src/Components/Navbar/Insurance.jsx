import { FiUmbrella } from 'react-icons/fi'
import { FaHeartbeat } from 'react-icons/fa'
import { AiTwotoneInsurance } from 'react-icons/ai'
import { Link } from "react-router-dom"
import Data from "./Data"

const Insurance = ({ onClose }) => {
    return (
        <div id="navbarinsuranceprod" className="safelife-dropdown-card safelife-dropdown-insurance">
            <div className="safelife-dropdown-col">
                <Link to="/plans?category=life" onClick={onClose} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="icontext icontext-life">
                        <div className="icon-wrapper icon-wrapper-life">
                            <FiUmbrella color="#2563eb" size="20" />
                        </div>
                        <div>
                            <h3>Life Insurance</h3>
                            <span className="col-sub">6 Authorized Insurers &rarr;</span>
                        </div>
                    </div>
                </Link>
                <ul className="dropdown-list">
                    {Data.LifeInsurance.map((ele, i) => (
                        <li key={i}>
                            <Link to={`/plans?category=life&insurer=${encodeURIComponent(ele.title)}`} onClick={onClose}>
                                <span className="item-dot item-dot-life"></span>
                                {ele.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="safelife-dropdown-col">
                <Link to="/plans?category=health" onClick={onClose} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="icontext icontext-health">
                        <div className="icon-wrapper icon-wrapper-health">
                            <FaHeartbeat color="#ef4444" size="20" />
                        </div>
                        <div>
                            <h3>Health Insurance</h3>
                            <span className="col-sub">5 Authorized Insurers &rarr;</span>
                        </div>
                    </div>
                </Link>
                <ul className="dropdown-list">
                    {Data.HealthInsurance.map((ele, i) => (
                        <li key={i}>
                            <Link to={`/plans?category=health&insurer=${encodeURIComponent(ele.title)}`} onClick={onClose}>
                                <span className="item-dot item-dot-health"></span>
                                {ele.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="safelife-dropdown-col">
                <Link to="/plans?category=general" onClick={onClose} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="icontext icontext-general">
                        <div className="icon-wrapper icon-wrapper-general">
                            <AiTwotoneInsurance color="#059669" size="20" />
                        </div>
                        <div>
                            <h3>General Insurance</h3>
                            <span className="col-sub">6 Authorized Insurers &rarr;</span>
                        </div>
                    </div>
                </Link>
                <ul className="dropdown-list">
                    {Data.GeneralInsurance.map((ele, i) => (
                        <li key={i}>
                            <Link to={`/plans?category=general&insurer=${encodeURIComponent(ele.title)}`} onClick={onClose}>
                                <span className="item-dot item-dot-general"></span>
                                {ele.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Insurance;