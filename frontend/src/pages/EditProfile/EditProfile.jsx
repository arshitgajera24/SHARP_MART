import React from 'react'
import "./EditProfile.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { useEffect } from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProfile = () => {

    const [isLoading, setIsLoading] = useState(false);
    const {user, setUser, userData, fetchUserData} = useContext(StoreContext);

    const [data, setData] = useState({
        avatar: "",
        name: userData?.name || "",
    })
    

    const navigate = useNavigate();
    
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData(prev => ({...prev, [name]:value}));
    }

    const editProfile = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        if(data.avatar) formData.append("avatar", data.avatar);

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/edit-profile`, formData, {
            withCredentials: true,
        })
        if(response.data.success)
        {
          toast.success(response.data.message);
          navigate("/profile");
        }
        else
        {
          toast.error(response.data.error);
        }
        setIsLoading(false);
    }

    const removeProfilePhoto = async (userId) => {
        setIsLoading(true);

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/edit-profile`, {userId}, {
            withCredentials: true,
        })
        if(response.data.success)
        {
          toast.success(response.data.message);
          navigate("/edit-profile");
          await fetchUserData();
        }
        else
        {
          toast.error(response.data.error);
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
            setIsLoading(true);
            await fetchUserData();
            setIsLoading(false);
        }
        load();
    }, [user])

    useEffect(() => {
        setData(prev => ({
            ...prev,
            name: userData?.name || ""
        }))
    }, [userData])

    if (isLoading) {
        return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
        );
    }

  return (
    <div className='edit-profile'>
        <div className="container-header">
            <h1 className="section-common--heading">Edit Your Profile</h1>
            <p className='section-common-subheading'>Change Your Profile Details to Identify.</p>
        </div>

        <div className="shortener-form">
            <form onSubmit={editProfile} method='post' className='url-form' encType='multipart/form-data'>
                <div className="avatar-upload">
                    <div className="avatar-preview">
                        {
                            data.avatar
                            ?   <div className="avatar-placeholder">
                                    <img src={data.avatar ? URL.createObjectURL(data.avatar) : assets.profile_icon} alt="" />
                                </div>
                            :   userData?.avatarUrl
                                ?   <img src={userData?.avatarUrl} alt={userData?.name} />
                                :   <span>{userData?.name?.charAt(0).toUpperCase()}</span>
                        }
                    </div>

                    <div className="avatar-edit">
                        <label htmlFor="Change Photo"><FaCamera />Change Photo</label>
                        <input onChange={(e) => setData(data => ({...data, avatar: e.target.files[0]}))} type="file" name='avatar' id='Change Photo' className="avatar-input" accept='image/*' />
                        {
                            userData?.avatarUrl
                            ?   <button onClick={() => removeProfilePhoto(userData?.id)} className='remove-avatar-btn'><FaTrash />Remove</button>
                            :   <></>
                        }
                    </div>
                </div>

                <div className="form-grp">
                    <label htmlFor="name"></label>
                    <div className="input-wrapper">
                        <MdAccountCircle />
                        <input onChange={onChangeHandler} value={data?.name} type="text" name='name' placeholder='Name' />
                    </div>
                </div>
                <div className="form-grp form-btn">
                    <button type='submit' className='form-submit'>Save Changes</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditProfile
