import React, { useContext, useEffect, useState } from 'react'
import "./LoginPopup.css"
import { assets } from '../../assets/assets';
import { FaEnvelope, FaGithub, FaGoogle, FaUser } from 'react-icons/fa';
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios"
import {toast} from "react-toastify"
import { useNavigate, NavLink } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const LoginPopup = ({setShowLogin}) => {

    const [currState, setCurrState] = useState("login");
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem("rememberedEmail"));
    const [data, setData] = useState({
      name: "",
      email: "",
      password: ""
    })

    const { user, setUser } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      setData(data => ({...data, [name]:value}));
    }

    const onSubmitHandler = async (e) => {
      e.preventDefault();

      let urlEndPoint = "";
      if(currState === "signup")
      {
        urlEndPoint = "/api/user/register";
      }
      else if(currState === "login")
      {
        urlEndPoint = "/api/user/login";
      }

      try {

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${urlEndPoint}`, data, {
          withCredentials: true
        });

        if(response.data.redirect)
        {
          setShowLogin(false);
          toast.success("You are Already Logged In");
          navigate("/");
        }
        if(response.data.success)
        {
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", data.email);
            localStorage.setItem("rememberedPassword", data.password);
          } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
          }

          setShowLogin(false);
          setUser(response.data.user);
          toast.success(response.data.message);
          navigate("/");
        }
        if(!response.data.success)
        {
          if(response.data.error?.toLowerCase().includes("blocked")) {
              toast.error("Your account has been blocked. Contact support.");
              setUser(null);
              setShowLogin(false);
              return;
          }
          toast.error(response.data.error);
        }

      } catch (error) {
        toast.error(error || "Something went wrong");
      }
    }

    const goToGoogleAuth = () => {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/user/google`;
    }

    const goToGithubAuth = () => {
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/github`;
    }

    useEffect(() => {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail && savedPassword) {
        setData({
          email: savedEmail,
          password: savedPassword,
          name: ""
        });
        setRememberMe(true);
      }
    }, [])

  return (
    <div className='login-popup'>
      <form className="login-popup-container" onSubmit={onSubmitHandler}>
        <div className="left-side-image">
          <img src={assets.login} alt="Login" />
        </div>

        <div className="right-side-form">
          <div className="login-popup-title">
              <h2>{currState === "signup" ? "Sign Up" : "Login"}</h2>
              <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Cross" />
          </div>
          <div className='auth'>
              <button className='github-btn' type='button' onClick={goToGithubAuth}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="#181717">
                  <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.21 11.43c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.54-1.36-1.33-1.72-1.33-1.72-1.09-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.4 1.24-3.25-.13-.3-.54-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.77.85 1.24 1.93 1.24 3.25 0 4.63-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22v3.29c0 .32.21.69.82.58A12 12 0 0024 12C24 5.37 18.63 0 12 0z"/>
                </svg>
                &nbsp;&nbsp;Login via Github
              </button>
              <button className='google-btn' type='button' onClick={goToGoogleAuth}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="20" height="20">
                  <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.7-50.4H272.1v95.3h147.4c-6.4 34.4-25.5 63.5-54.5 83.1l88 68.3c51.3-47.4 80.5-117.3 80.5-196.3z"/>
                  <path fill="#34A853" d="M272.1 544.3c73.5 0 135.2-24.4 180.2-66.2l-88-68.3c-24.4 16.4-55.5 26-92.1 26-70.8 0-130.8-47.9-152.3-112.1H27.7v70.4c45.1 89.5 137.7 150.2 244.4 150.2z"/>
                  <path fill="#FBBC05" d="M119.8 323.7c-10.9-32.4-10.9-67.4 0-99.8V153.5H27.7c-38.3 75.8-38.3 165.5 0 241.3l92.1-71.1z"/>
                  <path fill="#EA4335" d="M272.1 107.6c38.8-.6 76.2 13.8 104.7 40.4l78.1-78.1C407.4 24.2 345.7-.1 272.1 0 165.4 0 72.8 60.7 27.7 150.2l92.1 70.4c21.5-64.2 81.5-112.1 152.3-112.1z"/>
                </svg>
                &nbsp;&nbsp;Login via Google
              </button>
          </div>
          <div className='divider'>
            <hr />
            <p>Or Sign In With</p>
            <hr />
          </div>
          <div className="login-popup-inputs">
              {
                  currState === "login"
                  ? <></>
                  : <div className='input-grp'><FaUser /><input onChange={onChangeHandler} value={data.name} id='name' name='name' type="text" placeholder='Your Name'/></div>
              }
              <div className='input-grp'><FaEnvelope /><input onChange={onChangeHandler} value={data.email} id='email' name='email' type="email" placeholder='Your Email'/></div>
              <div className='input-grp'><RiLockPasswordFill /><input onChange={onChangeHandler} value={data.password} id='password' name='password' type="password" placeholder='Your Password'/></div>
          </div>
          <div className="login-popup-condition">
            {
              currState === "login"
              ? <><div className='remember'>
                  <input type="checkbox" onChange={(e) => setRememberMe(e.target.checked)} checked={rememberMe}/><p>Remember Me</p>
                </div>
                <div className="forgot">
                  <NavLink onClick={() => setShowLogin(false)} to="/forgot-password">Forgot Password?</NavLink>
                </div></>
              : <><div className='conditions'>
                  <input type="checkbox" required/><p> I agree to SHARP MART’s <span>Privacy Policy</span> and <span>Terms & Conditions</span></p>
                </div></>
            }
          </div>
          <button type='submit'>{currState === "signup" ? "Create Account" : "Login"}</button>
          {
              currState === "login"
              ? <p className='login-popup-bottom'>Create a New Account? <span onClick={() => setCurrState("signup")}>Register</span></p>
              : <p className='login-popup-bottom'>Already have an Account? <span onClick={() => setCurrState("login")}>Login Here</span></p>
          }
        </div>       
      </form>
    </div>
  )
}

export default LoginPopup
