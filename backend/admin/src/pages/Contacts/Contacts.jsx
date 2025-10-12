import React from 'react'
import "./Contacts.css"
import { useState } from 'react'
import { useEffect } from 'react';
import axios from "axios"
import {toast} from "react-toastify"
import { useContext } from 'react';

const Contacts = () => {

    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchAllContacts = async () => {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contact/get`);
        if(response.data.success)
        {
            setContacts(response.data.data);
        }
        else
        {
            toast.error(response.data.error)
        }
        setIsLoading(false);
    }

    const deleteContact = async (contactId) => {
        setIsLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact/delete`, {contactId});
        if(response.data.success)
        {
            toast.success(response.data.message);
            fetchAllContacts();
        }
        else
        {
            toast.error(response.data.error)
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAllContacts();
    }, [])

    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

  return (
    <div className='admin-contacts'>
        <h2>Contact Messages</h2>
        {
            contacts.length === 0
            ?   <p>No contacts found.</p>
            :   (
                    contacts.map((contact, index) => {
                        return <div key={index} className="contact-card">
                            <div className="contact-info">
                                <h3>{contact.fullName}</h3>
                                <p><strong>Email:</strong> {contact.email}</p>
                                <p><strong>Subject:</strong> {contact.subject}</p>
                                <p className="contact-message">{contact.message}</p>
                            </div>
                            <button className='delete-btn' onClick={() => deleteContact(contact.id)}>Delete</button>
                        </div>
                    })
                )
        }
    </div>
  )
}

export default Contacts
