import "./Navbar.css"
import { logo_transparent, B_logo } from "../../assets"
import { useEffect, useRef } from "react"
import { CiSearch } from "react-icons/ci";
import { BsPencil } from "react-icons/bs";
import { BiSolidUserCircle } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const navRef = useRef(null)
  useScroll(navRef)

  return (
    <div className="nav_main_container glass" ref={navRef}>
      <nav className="nav_container">
        <div className="nav_sub_container">
          <FiMenu className="nav_icon menu_icon" />
          <img src={logo_transparent} alt="BlogZen Logo" className="nav_logo" />
          <img src={B_logo} alt="BlogZen Logo" className="nav_logo_small" />
        </div>
        <ul className="nav_sub_container nav_center_part">
          <li>
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
          <li className="nav_write_btn">
            <BsPencil />
            <span className="nav_write_btn_text">
              Write
            </span>
          </li>
          <li className="nav_icon profile_icon">
            <BiSolidUserCircle />
            <LoginBox />
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar

function LoginBox() {
  return (
    <div className="login_box">
      <BiSolidUserCircle />
      <p>
        Sign up / log in into your BlogZen Account
      </p>
      <p>
        Takes only a few seconds
      </p>
      <button>
        SignUp / LogIn
      </button>
    </div>
  )
}

function useScroll(navRef) {
  const lastScrollTop = useRef(0);
  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    navRef.current.style.top = scrollTop > lastScrollTop.current ? "-80px" : "0px";
    lastScrollTop.current = scrollTop
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
}
