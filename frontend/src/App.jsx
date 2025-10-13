import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import {Route, Routes} from "react-router-dom";
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import { Error } from './pages/Error/Error';
import MyOrders from './pages/MyOrders/MyOrders';
import Products from './pages/Products/Products';
import Profile from './pages/Profile/Profile';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import EditProfile from './pages/EditProfile/EditProfile';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Resetpassword from './pages/ResetPassword/ResetPassword';
import SetPassword from './pages/SetPassword/SetPassword';

const App = () => {

  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLogin]);

  return (
    <>
      <Navbar setShowLogin={setShowLogin} />
        {
          showLogin
          ? <LoginPopup setShowLogin={setShowLogin} />
          : <></>
        }
        <div className='app'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<Resetpassword />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      <Footer />
    </>
  )
}

export default App
