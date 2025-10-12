import React, { useContext, useEffect, useState } from 'react'
import "./ChangePassword.css"
import { FaEye, FaEyeSlash, FaLock, FaUnlock } from 'react-icons/fa'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangePassword = () => {

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const {user} = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const changePassword = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/change-password`, data, {
            withCredentials: true,
        });
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

    useEffect(() => {
        async function load() {
            if(user === undefined) return;
            if(!user)
            {
                return navigate("/")
            }
        }
        load();
    }, [user])

    if (isLoading) {
        return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
        );
    }

  return (
    <div className='change-password'>
        <div className="container-header">
            <h1 className="section-common--heading">Change Your Password</h1>
            <p className='section-common-subheading'>Secure Your Account by Making it Stronger.</p>
        </div>

        <div className="change-password-form">
            <form onSubmit={changePassword}>
                <div className="form-grp">
                    <label htmlFor="currentPassword"></label>
                    <div className="input-wrapper">
                        <FaUnlock />
                        <input onChange={onChangeHandler} value={data.currentPassword} type={showCurrent ? "text" : "password"} name='currentPassword' id='currentPassword' placeholder='Your Current Passowrd' />
                        <button type='button' onClick={() => setShowCurrent(!showCurrent)} className='toggle-password'>{showCurrent ? <FaEyeSlash /> : <FaEye />}</button>
                    </div>
                </div>

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

export default ChangePassword
