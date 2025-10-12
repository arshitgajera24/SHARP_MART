import React from 'react'
import "./MyOrders.css"
import { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(StoreContext);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setIsLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/userorders`, {}, {
            withCredentials: true,
        });

        if(response.data.success)
        {
            setData(response.data.data);
        }
        else{
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
            await fetchOrders();
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
    <div className='my-orders'>
        <div className="container-header">
            <h1 className="section-common--heading">My Orders</h1>
            <p className='section-common-subheading'>Here’s a Summary of Everything You’ve Ordered.</p>
        </div>
        <div className="container">
            {
                data.map((order, index) => {
                    let totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                    return <div key={index} className="my-orders-order">
                        <div className="order-header">
                            <img src={assets.parcel_icon} alt="Parcel Icon" />
                            <div>
                                <p><b>Order ID : </b>{order.orderId}</p>
                                <p><b>Status : </b><span className={`status-text ${order.status.toLowerCase()}`}>{order.status}</span></p>
                                <p><b>Placed On : </b>{new Date(order.createdAt).toLocaleDateString()}</p>
                                <p><b>Payment : </b><span className={`status-text ${order.payment ? "success" : "pending"}`}>{order.payment ? "Success" : "Pending"}</span></p>
                            </div>
                        </div>

                        <div className="order-items">
                            {
                                order.items.map((item, index) => {
                                    return <div key={index} className="order-item">
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.productImage}`} alt={item.productName} />
                                        <p>{item.productName}</p>
                                        <p>&#8377; {item.productPrice} x {item.quantity}</p>
                                        <p><b>&#8377; {item.itemPrice}</b></p>
                                    </div>
                                })
                            }
                        </div>

                        <div className="order-summary">
                            <p><b>Total Items : </b>{totalItems}</p>
                            <p><b>Total Amount : </b>&#8377; {order.amount}.00</p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    </div>
                })
            }
        </div>
    </div>
  )
}

export default MyOrders
