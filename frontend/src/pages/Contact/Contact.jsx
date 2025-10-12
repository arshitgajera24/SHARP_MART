import React from 'react'
import "./Contact.css"
import { assets } from '../../assets/assets'
import { useState } from 'react'
import axios from "axios"
import {toast} from "react-toastify"
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useEffect } from 'react'

const Contact = () => {

  const {user} = useContext(StoreContext);
  
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData(prev => ({...prev, [name]:value}));
  }

  const onSubmitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact/send`, data);
    if(response.data.success)
    {
      toast.success(response.data.message);
      setData({
        fullName: "",
        email: "",
        subject: "",
        message: ""
      });
    }
    else
    {
      toast.error(response.data.error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (user) {
      setData(prev => ({ 
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="section-contact">
      <div className="container-header">
        <h2 className="section-common--heading">Contact Us</h2>
        <p className="section-common-subheading">
          Get in touch with us. We are always here to help you.
        </p>
      </div>

      <div className="container-main grid grid-two--cols">
        <div className="contact-content">
          <form method="post" onSubmit={onSubmitHandler}>
            <div className="name-email grid grid-two-cols mb-3">

              <div>
                <label htmlFor="fullName">Full Name</label>
                <input onChange={onChangeHandler} value={data.fullName} type="text" name="fullName" id="fullName" autoComplete="off" placeholder="Enter Full Name"/>
              </div>
              

              <div>
                <label htmlFor="email">Email Address</label>
                <input onChange={onChangeHandler} value={data.email} type="text" name="email" id="email" autoComplete="off" placeholder="Your Email Address"/>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="subject">Subject</label>
              <input onChange={onChangeHandler} value={data.subject} type="text" name="subject" id="subject" autoComplete="off" placeholder="Title of Your Message"/>
            </div>

            <div className="mb-3">
              <label htmlFor="message">Message</label>
              <textarea onChange={onChangeHandler} value={data.message} name="message" id="message " cols="30" rows="10" placeholder="We are Always Here to Help You."></textarea>
            </div>

            <div className="mt-3">
              <button type="submit" className="btn contact-btn">SEND MESSAGE</button>
            </div>

          </form>
        </div>
        <div className="contact-map">
            <img src={assets.about_logo} alt="Logo" />
        </div>
      </div>
    </div>
  )
}

export default Contact
