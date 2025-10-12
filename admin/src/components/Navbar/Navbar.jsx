import React from 'react'
import "./Navbar.css"
import { assets } from '../../assets/assets'
import {useNavigate} from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div className='navbar'>
    <img onClick={() => navigate("/")} className='logo' src={assets.logo_navbar} alt="Admin_Logo" />
    <img className='profile' src={assets.about_logo} alt="Profile Image" />
    </div>
  )
}

export default Navbar
