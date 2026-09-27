import { Link } from "react-router-dom"
import "./Navbar.css"
import { FcCollapse, FcExpand } from 'react-icons/fc'
import Insurance from "./Insurance"
import Renew from "./Renew"
import Claim from "./Claim"
import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { HiOutlineMenu } from "react-icons/hi"
import Support from "./Support"
import SideMenu from "./SideMenu"
import safelifeLogo from "../../assets/images/safelife-logo.svg"

const Navbar = () => {
    const dispatch = useDispatch()
    const loginStore = useSelector((st) => st?.login)
    let sessionUser = JSON.parse(sessionStorage.getItem("loggedInUserInfo")) || { isAuth: false, name: "" }
    let isAuth = loginStore?.isAuth ?? sessionUser?.isAuth ?? false
    let userName = loginStore?.userData?.name || sessionUser?.name || ""

    const [activeMenu, setActiveMenu] = useState(null) // 'IP' | 'RP' | 'Cl' | 'Sup' | null
    const [display, setdisplay] = useState(false)
    const timeoutRef = useRef(null)
    const navRef = useRef(null)

    const handleMouseEnter = (menuKey) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setActiveMenu(menuKey)
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            setActiveMenu(null)
        }, 200)
    }

    const handleCancelLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    const handleToggle = (menuKey) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setActiveMenu(prev => prev === menuKey ? null : menuKey)
    }

    const closeAll = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        setActiveMenu(null)
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setActiveMenu(null)
            }
        }
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setActiveMenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <header className="safelife-navbar-header" ref={navRef} onMouseLeave={handleMouseLeave}>
            <div className="safelife-navbar-container">
                <div className="safelife-nav-brand">
                    <HiOutlineMenu 
                        onClick={() => setdisplay(true)} 
                        id="navmenu" 
                        size={28}
                        style={{ cursor: "pointer", marginRight: "12px", color: "#1e293b" }}
                        title="Open menu"
                    />
                    <Link to="/" onClick={closeAll}>
                        <img id="navlogo" alt="SafeLife" src={safelifeLogo} style={{ height: "46px", objectFit: "contain" }} />
                    </Link>
                </div>

                <nav className="safelife-nav-links">
                    <div 
                        className={`safelife-nav-item ${activeMenu === 'IP' ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter('IP')}
                        onClick={() => handleToggle('IP')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle('IP'); } }}
                    >
                        <span className="nav-title">Insurance Products</span>
                        {activeMenu === 'IP' ? <FcCollapse size="18" /> : <FcExpand size="18" />}
                    </div>

                    <div 
                        className={`safelife-nav-item ${activeMenu === 'RP' ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter('RP')}
                        onClick={() => handleToggle('RP')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle('RP'); } }}
                    >
                        <span className="nav-title">Renew Your Policy</span>
                        {activeMenu === 'RP' ? <FcCollapse size="18" /> : <FcExpand size="18" />}
                    </div>

                    <div 
                        className={`safelife-nav-item ${activeMenu === 'Cl' ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter('Cl')}
                        onClick={() => handleToggle('Cl')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle('Cl'); } }}
                    >
                        <span className="nav-title">Claim</span>
                        {activeMenu === 'Cl' ? <FcCollapse size="18" /> : <FcExpand size="18" />}
                    </div>

                    <div 
                        className={`safelife-nav-item ${activeMenu === 'Sup' ? 'active' : ''}`}
                        onMouseEnter={() => handleMouseEnter('Sup')}
                        onClick={() => handleToggle('Sup')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle('Sup'); } }}
                    >
                        <span className="nav-title">Support</span>
                        {activeMenu === 'Sup' ? <FcCollapse size="18" /> : <FcExpand size="18" />}
                    </div>
                </nav>

                <div className="safelife-nav-actions">
                    <Link 
                        to="/admin" 
                        className="safelife-btn-admin"
                        onClick={closeAll}
                        title="SafeLife Operations Admin Panel"
                    >
                        ⚙️ Admin
                    </Link>

                    <Link 
                        to="/login" 
                        className="safelife-btn-signin"
                        onClick={closeAll}
                    >
                        {isAuth ? (userName || "My Account") : "Sign In"}
                    </Link>

                    {isAuth && (
                        <button 
                            className="safelife-btn-signout"
                            onClick={() => {
                                const user = {
                                    isAuth: false,
                                    name: "",
                                    phoneNumber: "",
                                };
                                sessionStorage.setItem("loggedInUserInfo", JSON.stringify(user));
                                dispatch({ type: "LOGOUT" });
                                closeAll();
                            }}
                        >
                            Sign out
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown Container with Hover Keep-Alive */}
            {activeMenu && (
                <div 
                    className="safelife-dropdown-container"
                    onMouseEnter={handleCancelLeave}
                    onMouseLeave={handleMouseLeave}
                >
                    {activeMenu === 'IP' && <Insurance onClose={closeAll} />}
                    {activeMenu === 'RP' && <Renew onClose={closeAll} />}
                    {activeMenu === 'Cl' && <Claim onClose={closeAll} />}
                    {activeMenu === 'Sup' && <Support onClose={closeAll} />}
                </div>
            )}

            {display ? <SideMenu setdisplay={setdisplay} /> : null}
        </header>
    )
}

export default Navbar;