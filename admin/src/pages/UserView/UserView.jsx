import React from 'react'
import "./UserView.css"
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from 'react';
import { useEffect } from 'react';
import {useNavigate,useLocation} from "react-router-dom"

const UserView = () => {

    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = location.state;

    const fetchUserDetails = async () => {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/details/${userId}`, {
            withCredentials: true,
        })

        if(response.data.success)
        {
            setUserDetails(response.data.data);
        }
        else
        {
            toast.error(response.data.error)
            if(response.data.redirect)
            {
                navigate(response.data.redirect)
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchUserDetails();        
    }, [userId]);

    if (isLoading || !userDetails) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    }

    const { user, summary, recentOrders } = userDetails;

  return (
    <div className='user-view-container'>
        <h3>User Details</h3>
        <div className="user-card">
            {
                user?.avatarUrl
                ?   <img src={user?.avatarUrl} alt={user?.name} />
                :   <span>{user?.name?.charAt(0).toUpperCase()}</span>
            }
            <div className="user-info">
                <h2>{user?.name}</h2>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Email Verified:</strong> {user?.isEmailValid ? "Yes" : "No"}</p>
                <p><strong>Provider(s):</strong> {user?.providers}</p>
                <p><strong>Created At:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                <p><strong>Updated At:</strong> {new Date(user?.updatedAt).toLocaleDateString()}</p>
            </div>
        </div>

        {
            recentOrders.length === 0
            ?   <></>
            :   <><h3>Order Summary</h3>
                <div className="summary-card">
                    <p><strong>Total Orders:</strong> {summary.totalOrders}</p>
                    <p><strong>Total Spent:</strong> ₹{summary.totalSpent}</p>
                    <p><strong>Last Order Date:</strong> {summary.lastOrderDate}</p>
                    <p><strong>Last Order Amount:</strong> ₹{summary.lastOrderAmount}</p>
                </div></>
        }

        <div className="recent-orders">
            {
                recentOrders.length !== 0
                ? <><h3>Recent Orders</h3></>
                : <></>
            }
            {
                recentOrders.length === 0
                ?   <h3>No recent orders found.</h3>
                :   recentOrders.map((order, index) => {
                        return <div key={index} className="order-card">
                            <div className="order-header">
                                <p><strong>Order ID:</strong> #{order.id}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Amount:</strong> ₹{order.amount}</p>
                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="order-items">
                                {
                                    order.items.map((item, index) => {
                                        return <div key={index} className="order-item">
                                            <img src={item.productImage} className='product-image' alt="Image" />
                                            <div className="item-info">
                                                <p>{item.productName}</p>
                                                <p>Qty: {item.quantity}</p>
                                                <p>Price: ₹{item.price}</p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    })
            }
        </div>
    </div>
  )
}

export default UserView
