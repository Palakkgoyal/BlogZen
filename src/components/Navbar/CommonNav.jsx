import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LoginBox from './LoginBox'
import { logo_transparent, B_logo } from "../../assets"
import { useAuth0 } from "@auth0/auth0-react";

// ---------- REACT ICONS ---------- //
import { CiSearch } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";
import { BiSolidUserCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";

const CommonNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openLoginBox, setOpenLoginBox] = useState(false)

    const { isAuthenticated } = useAuth0();

    function publishBlog() {

    }

    function handleProfile() {
        isAuthenticated ? navigate("/profile") : setOpenLoginBox(prev => !prev)
    }
    return (
        <nav className="nav_container">
            <div className="nav_sub_container">
                <FiMenu className="nav_icon menu_icon" />
                <img src={logo_transparent} alt="BlogZen Logo" className="nav_logo" />
                <img src={B_logo} alt="BlogZen Logo" className="nav_logo_small" />
            </div>
            <ul className="nav_sub_container nav_center_part">
                <li onClick={() => navigate("/")}>
                    My Feed
                </li>
                <li>
                    Bookmarks
                </li>
            </ul>
            <ul className="nav_sub_container nav_right_part">
                <li className="nav_icon">
                    <CiSearch />
                </li>
                {location.pathname === "/draft" ? (
                    <li className="nav_write_btn">
                        <span
                            className="nav_write_btn_text"
                            onClick={publishBlog}
                        >
                            Publish
                        </span>
                    </li>
                ) : (
                    <li className="nav_write_btn">
                        <BsPencil />
                        <span
                            className="nav_write_btn_text"
                            onClick={() => navigate("/draft")}
                        >
                            Write
                        </span>
                    </li>)}
                <li className="nav_icon profile_icon">
                    <BiSolidUserCircle onClick={handleProfile} />
                    {openLoginBox && !isAuthenticated && <LoginBox setOpenLoginBox={setOpenLoginBox} />}
                </li>
            </ul>
        </nav>
    )
}

export default CommonNav
