import React from 'react'
import "./VerifyEmail.css"
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import {useNavigate,useSearchParams} from "react-router-dom"
import { useState } from 'react'

const VerifyEmail = () => {

    const {user} = useContext(StoreContext);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const tokenUrl = searchParams.get("token");
    const emailUrl = searchParams.get("email");

    useEffect(() => {
        if(user === undefined) return;
        if(!user)
        {
            return navigate("/")
        }
    }, [user]);

    useEffect(() => {
        if(tokenUrl && emailUrl)
        {
            verifyEmailTokenFromLink(tokenUrl, emailUrl)
        }
    }, [tokenUrl, emailUrl])

    const verifyEmailTokenFromLink = async (token, email) => {
        setIsLoading(true);

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-email-token`, {
            params: {token, email},
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

    const resendVerificationLink = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/resend-verification-link`, {}, {
            withCredentials: true,
        });
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

    const verifyEmailToken = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-email-token`, {
            params: {
                token,
                email: user?.email
            },
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

    if (isLoading) {
        return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
        );
    }

  return (
    <div className='main-container'>
        <div className="container-header">
            <h1 className="section-common--heading">Verify Your Email</h1>
            <p className='section-common-subheading'>Verify your email to secure your account.</p>
        </div>

        <div className="card">
            <div className="card-body">
                <p className="info-text"><strong>Email : </strong>{user?.email}</p>
                <p className="info-text">Your email has not been verified yet. Please verify your email by entering the 8-digit code or request a new verification link.</p>
                <form onSubmit={(e) => resendVerificationLink(e)} method='post' className='form-inline'>
                    <button type='submit' className='btn-secondary'> Resend Verification Link </button>
                </form>
            </div>
        </div>

        <div className="card mt-20">
            <div className="card-body">
                <form onSubmit={verifyEmailToken} method="get" className="form">
                    <div className="form-group">
                        <input onChange={(e) => setToken(e.target.value)} type="text" name='token' className='form-control' maxLength="8" pattern='\d{8}' placeholder='Enter 8-Digit Code' />
                        <button type='submit' className='btn-primary'>Verify Code</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail
