import React, { useState } from 'react'
import "./ForgotPassword.css"
import { SiMinutemailer } from 'react-icons/si'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const resetPassword = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/forgot-password`, {email});
        if(response.data.success)
        {
            toast.success(response.data.message);
        }
        else
        {
            toast.error(response.data.error);
            if(response.data.redirect)
            {
                navigate(response.data.redirect);
            }
        }
        setIsLoading(false);
    }


    if (isLoading) {
        return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
        );
    }

  return (
    <div className='forgot-password'>
        <div className="container-header">
            <h1 className="section-common--heading">Forgot Password</h1>
            <p className='section-common-subheading'>Enter Your Email below and We’ll Send You a Link to Reset Your Password.</p>
        </div>

        <div className="change-password-form">
            <form method="post" onSubmit={resetPassword}>
              <div className="form-grp">
                <label htmlFor="email"></label>
                <div className="input-wrapper">
                  <SiMinutemailer />
                  <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" name="email" id="email" placeholder="Your Registered Email" autoComplete="false"/>
                </div>
              </div>

              <div className="form-grp form-button">
                <button type="submit" className="form-submit">Send Email</button>
              </div>
            </form>
        </div>

    </div>
  )
}

export default ForgotPassword
