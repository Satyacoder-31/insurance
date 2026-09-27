import { Link } from "react-router-dom"
import { FiUmbrella } from "react-icons/fi"
import { FaHeartbeat } from "react-icons/fa"
import { AiTwotoneInsurance } from "react-icons/ai"

const Renew = ({ onClose }) => {
    return (
        <div id="navbarrenew" className="safelife-dropdown-card safelife-dropdown-small">
            <h4 className="dropdown-heading">
                <Link to="/renewal" onClick={onClose} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Renew Your Policy &rarr;
                </Link>
            </h4>
            <div className="renew-item">
                <div className="icon-wrapper icon-wrapper-life">
                    <FiUmbrella color="#2563eb" size="18"/>
                </div>
                <Link to="/renewal/life-renewal" onClick={onClose}>Life Renewal</Link>
            </div>
            <div className="renew-item">
                <div className="icon-wrapper icon-wrapper-health">
                    <FaHeartbeat color="#ef4444" size="18"/>
                </div>
                <Link to="/renewal/health-renewal" onClick={onClose}>Health Renewal</Link>
            </div>
            <div className="renew-item">
                <div className="icon-wrapper icon-wrapper-general">
                    <AiTwotoneInsurance color="#059669" size="18"/>
                </div>
                <Link to="/renewal/general-renewal" onClick={onClose}>General Renewal</Link>
            </div>
        </div>
    )
}

export default Renew;