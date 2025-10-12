import React from 'react'
import "./Profile.css"
import { useState } from 'react'
import axios from 'axios';
import {Navigate, useNavigate} from "react-router-dom"
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { MdEmail } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { FaCheckCircle, FaEdit, FaKey, FaPowerOff } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { SiMinutemailer } from "react-icons/si";
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

const Profile = () => {

    const [isLoading, setIsLoading] = useState(false);
    const {user, setUser, userData, fetchUserData} = useContext(StoreContext);

    const navigate = useNavigate();

    const logoutHandler = async () => {
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

    useEffect(() => {
        async function load() {
            if(user === undefined) return;
            if(user || !userData)
            {
                setIsLoading(true);
                await fetchUserData();
                setIsLoading(false);
            }
        }
        load();
    }, [user])

    if(user === null && userData === null)
    {
        return <Navigate to="/" replace />
    }

    if (isLoading) {
        return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
        );
    }

  return (
    <div className='profile'>
        <div className="container-header">
            {
                userData
                ?   <><h1 className="section-common--heading">My Profile</h1>
                    <p className='section-common-subheading'>Manage your account and personal details here.</p></>
                :   <></>
            }
        </div>
        {
            !userData
            ?   <h1 className="section-common--heading">Please Login First</h1>
            :   (
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    <div className="avatar-placeholder">
                                        {
                                        userData?.avatarUrl
                                        ?   !userData?.avatarUrl.startsWith("http")
                                            ?<img src={`${import.meta.env.VITE_BACKEND_URL}/avatar/${userData?.avatarUrl}`} alt={userData?.name} />
                                            :<img src={userData?.avatarUrl} alt={userData?.name} />
                                        : <span>{userData?.name?.charAt(0).toUpperCase()}</span>
                                        }
                                    </div>
                                </div>

                                <div className="profile-info">
                                    <h2 className="profile-name">{userData?.name}</h2>
                                    <p className="profile-email">
                                        <MdEmail />{userData?.email}
                                    </p>
                                    <p className="member-since">
                                        <SlCalender />{new Date(userData?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="profile-verification">
                                    <p className="verification-status">
                                        <span className="verification-label">Email Verification : </span>
                                        {
                                            userData?.isEmailValid 
                                            ? <span className='verification-badge verified'><FaCheckCircle />Verified</span>
                                            : <span className='verification-badge not-verified'><IoAlertCircle />Not Verified</span>
                                        }
                                    </p>
                                    {
                                        !userData?.isEmailValid
                                        ? <button onClick={() => navigate("/verify-email")}><SiMinutemailer />Verify Now</button>
                                        : <></>
                                    }
                                </div>
                            </div>

                            <div className="profile-actions">
                                <button onClick={() => navigate("/edit-profile")} className='btn'><FaEdit />Edit Profile</button>
                                {
                                    userData?.hasPassword
                                    ? <button onClick={() => navigate("/change-password")} className='btn'><FaKey />Change Password</button>
                                    : <button onClick={() => navigate("/set-password")} className='btn'><FaKey />Set Password</button>
                                }
                                <button onClick={logoutHandler} className='btn'><FaPowerOff />Log Out</button>
                            </div>
                        </div>
                )
        }
    </div>
  )
}

export default Profile
