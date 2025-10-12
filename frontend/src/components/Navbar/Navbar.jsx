import React, { useContext, useState } from 'react'
import "./Navbar.css"
import { Link, useNavigate,useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { useEffect } from 'react'
import {toast} from "react-toastify"
import { ImProfile } from "react-icons/im";

const Navbar = ({setShowLogin}) => {

  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { getTotalCartAmount, user, setUser, userData } = useContext(StoreContext);

  const location = useLocation();

  const navigate = useNavigate();

  const getActiveMenu = () => {
    const path = location.pathname;
    if(path === "/") return "home";
    if(path.startsWith("/about")) return "about";
    if (path.startsWith("/products")) return "products";
    if (path.startsWith("/contact")) return "contact";
    return "";
  }
  
  const logout = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, {
      withCredentials: true
    });

    if(response.data.success)
    {
      toast.success(response.data.message);
      setUser(null);
      navigate("/");
    }
    if(!response.data.success)
    {
      toast.error(response.data.error);
    }
  }

  const checkAuth = async () => {
    try {
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        withCredentials: true
      });

      if (response.data.authenticated) 
      {
        setUser(response.data.user);
      } 
      else 
      {
        setUser(null);
      }

    } catch (error) {
        console.log("Auth check failed:", error);
        setUser(null);
    }
  }

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate(`/products?search=${encodeURIComponent(value)}`);
  }

  const onSearchCancel = () => {
    setSearchTerm("");
    navigate(location.pathname);
    setSearchOpen(false);
  }

  useEffect(() => {
    checkAuth();
  }, [])

  return (
    <div className='navbar'>

      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
      </div>

      <Link to="/"><img src={assets.logo_navbar} alt="Logo" className='logo' /></Link>

      <ul className='navbar-menu'>
        <Link to="/" className={getActiveMenu() === "home" ? "active" : ""}>HOME</Link>
        <Link to="/about" className={getActiveMenu() === "about" ? "active" : ""}> ABOUT </Link>
        <Link to="/products" className={getActiveMenu() === "products" ? "active" : ""}> PRODUCTS </Link>
        <Link to="/contact" className={getActiveMenu() === "contact" ? "active" : ""}> CONTACT </Link>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" className='search-icon' onClick={() => setSearchOpen(!searchOpen)} />
        <div className="navbar-search-icon">
          <Link to="/cart"><img src={assets.basket_icon} alt="Basket" />
          {
            getTotalCartAmount() > 0
            ? <div className="dot"></div>
            : <></>
          }
          </Link>
        </div>
        {
          !user
          ?  <button className="desktop-signin" onClick={() => setShowLogin(true)}>Sign In</button>
          :  <div className='navbar-profile'>
                {
                  userData?.avatarUrl
                  ? userData?.avatarUrl.startsWith("http")
                    ?<img src={userData?.avatarUrl} alt={userData?.name} />
                    :<img src={`${import.meta.env.VITE_BACKEND_URL}/avatar/${userData?.avatarUrl}`} alt={userData?.name} />
                  : <img src={assets.profile_icon} alt="Profile" />
                }
                <ul className="nav-profile-dropdown">
                  <li onClick={() => navigate("/profile")}><ImProfile /><p>&nbsp;My Profile</p> </li>
                  <hr />
                  <li onClick={() => navigate("/myorders")}> <img className='icon' src={assets.bag_icon} alt="Bag" /><p>My Orders</p> </li>
                  <hr />
                  <li onClick={logout}> <img className='icon' src={assets.logout_icon} alt="Logout" /><p>Log out</p> </li>
                </ul>
             </div>
        }
      </div>

      <div className={`navbar-search-dropdown ${searchOpen ? "show" : ""}`}>
        <form className='search-form' onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder='Search for Products...' autoFocus onChange={onSearchChange} value={searchTerm} />
          <button type='button' className='cancel-btn' onClick={onSearchCancel}>Cancel</button>
        </form>
      </div>

      <ul className={`navbar-menu-mobile ${isOpen ? "show" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)} className={getActiveMenu() === "home" ? "active" : ""}>HOME</Link>
        <Link to="/about" onClick={() => setIsOpen(false)} className={getActiveMenu() === "about" ? "active" : ""}> ABOUT </Link>
        <Link to="/products" onClick={() => setIsOpen(false)} className={getActiveMenu() === "products" ? "active" : ""}> PRODUCTS </Link>
        <Link to="/contact" onClick={() => setIsOpen(false)} className={getActiveMenu() === "contact" ? "active" : ""}> CONTACT </Link>
        {
          !user 
          ? <button className="mobile-signin" onClick={() => { setIsOpen(false); setShowLogin(true); }}>Sign In</button>
          : <></>
        }
      </ul>
      
    </div>
  )
}

export default Navbar
