import React, { useState } from 'react'
import "./ResetPassword.css"
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Resetpassword = () => {

    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [data, setData] = useState({
        newPassword: "",
        confirmPassword: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {token} = useParams();

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const resetPassword = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password/${token}`, data);
        if(response.data.success)
        {
            toast.success(response.data.message);
            navigate("/profile");
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
    <div className='reset-password'>
        <div className="container-header">
            <h1 className="section-common--heading">Reset Your Password</h1>
            <p className='section-common-subheading'>Secure Your Account by Making it Stronger.</p>
        </div>

        <div className="change-password-form">
            <form method='post' onSubmit={resetPassword}>

                <div className="password-requirements">
                    <small>Password must:
                      <ul>
                        <li>Be at least 6 characters long</li>
                        <li>Contain a number</li>
                        <li>Include uppercase and lowercase letters</li>
                      </ul>
                    </small>
                </div>

                <div className="form-grp">
                    <label htmlFor="newPassword"></label>
                    <div className="input-wrapper">
                        <FaLock />
                        <input onChange={onChangeHandler} value={data.newPassword} type={showNew ? "text" : "password"} name='newPassword' id='newPassword' placeholder='Your New Passowrd' />
                        <button type='button' onClick={() => setShowNew(!showNew)} className='toggle-password'>{showNew ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                </div>

                <div className="form-grp">
                    <label htmlFor="confirmPassword"></label>
                    <div className="input-wrapper">
                        <FaLock />
                        <input onChange={onChangeHandler} value={data.confirmPassword} type={showConfirm ? "text" : "password"} name='confirmPassword' id='confirmPassword' placeholder='Confirm Your New Passowrd' />
                        <button type='button' onClick={() => setShowConfirm(!showConfirm)} className='toggle-password'>{showConfirm ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                </div>

                <div className="form-grp form-button">
                    <button type='submit' className='form-submit'>
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Resetpassword
