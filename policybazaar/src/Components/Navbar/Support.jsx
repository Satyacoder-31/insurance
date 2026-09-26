import { Link } from "react-router-dom"
import {CgNotes} from "react-icons/cg"
import {RiQuestionnaireLine} from "react-icons/ri"
import { FiPhoneCall } from "react-icons/fi"
import {BsFillPersonFill, BsWhatsapp} from "react-icons/bs"
import { FaStore, FaRegMoneyBillAlt } from "react-icons/fa"
import {SlCallIn} from "react-icons/sl"
import {SlEarphonesAlt} from "react-icons/sl"
const Support = ({ onClose }) => {
    return (
        <div id="navsupport" className="safelife-dropdown-card safelife-dropdown-support">
            <div className="support-section">
                <span className="support-badge">My Account</span>
                <div id="navmyaccount">
                    <div className="icontext">
                        <CgNotes size="18" color="#10b981"/>
                        <Link to="/support/account/policies" onClick={onClose}>Policies</Link>
                    </div>
                    <div className="icontext">
                        <RiQuestionnaireLine size="18" color="#6366f1"/>
                        <Link to="/support/account/get-help" onClick={onClose}>Get Help</Link>
                    </div>
                    <div className="icontext">
                        <FiPhoneCall size="18" color="#0284c7" />
                        <Link to="/support/account/communication-preferences" onClick={onClose}>Preferences</Link>
                    </div>
                    <div className="icontext">
                        <BsFillPersonFill size="18" color="#2563eb" />
                        <Link to="/support/account/advisor" onClick={onClose}>Verify Advisor</Link>
                    </div>
                </div>
            </div>

            <div className="support-section" style={{ marginTop: "14px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                <span className="support-badge support-badge-contact">Contact SafeLife</span>
                <div id="navcontact">
                    <div>
                        <BsWhatsapp size="20" color="#22c55e" className="contreacticons"/><br/>
                        <Link to="/support/contact/whatsapp" onClick={onClose}>WhatsApp</Link>
                    </div>
                    <div>
                        <FaStore size="20" color="#f97316" className="contreacticons" /><br/>
                        <Link to="/support/contact/whatsapp" onClick={onClose}>Nearest Hub</Link>
                    </div>
                    <div>
                        <SlCallIn size="20" color="#2563eb" className="contreacticons"/><br/>
                        <Link to="/support/contact/whatsapp" onClick={onClose}>Callback</Link>
                    </div>
                </div>
                <div id="navinfodetails">
                    <div className="icontext">
                        <SlEarphonesAlt size="16" color="#22c55e" />
                        <p>Support: 1800-208-8787</p>
                    </div>
                    <div className="icontext">
                        <FaRegMoneyBillAlt size="16" color="#f97316" />
                        <p>Claims: 1800-258-5881</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Support