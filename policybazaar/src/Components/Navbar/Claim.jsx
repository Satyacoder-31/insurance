import { Link } from "react-router-dom"

import { RiFileTextLine, RiSearchLine, RiInformationLine, RiCheckboxCircleLine } from "react-icons/ri"

const Claim = ({ onClose }) => {
    return (
        <div id="navbarclaim" className="safelife-dropdown-card safelife-dropdown-small">
            <h4 className="dropdown-heading">Claims Assistance</h4>
            <div className="claim-item">
                <RiFileTextLine color="#2563eb" size="18" />
                <Link to="/claim/new-claim" onClick={onClose}>File a New Claim</Link>
            </div>
            <div className="claim-item">
                <RiCheckboxCircleLine color="#059669" size="18" />
                <Link to="/claim/already-filed-claim" onClick={onClose}>Already Filed with Insurer</Link>
            </div>
            <div className="claim-item">
                <RiInformationLine color="#f59e0b" size="18" />
                <Link to="/claim/filing-claim" onClick={onClose}>Know More About Claims</Link>
            </div>
            <div className="claim-item">
                <RiSearchLine color="#8b5cf6" size="18" />
                <Link to="/claim/track-exising-claim" onClick={onClose}>Track Existing Claim</Link>
            </div>
        </div>
    )
}
export default Claim