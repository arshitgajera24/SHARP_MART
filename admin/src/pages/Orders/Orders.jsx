import React from 'react'
import "./Orders.css"
import { useState } from 'react'
import axios from "axios"
import {toast} from "react-toastify"
import { useEffect } from 'react'

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllOrders = async () => {
    setIsLoading(true);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/list`);
    if(response.data.success)
    {
      setOrders(response.data.data);
    }
    else
    {
      toast.error(response.data.error);
    }
    setIsLoading(false);
  }

  const statusHandler = async (e, orderId) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/status`, {orderId, status: e.target.value});
    if(response.data.success)
    {
      await fetchAllOrders();
      toast.success(response.data.message)
    }
    else
    {
      toast.error(response.data.error);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  if (isLoading) {
      return (
          <div className="loader-container">
              <div className="loader"></div>
          </div>
      );
  }

  return (
    <div className='admin-orders'>
        <h2>All Orders</h2>
        {
          orders.length === 0 
          ?   <p>No Orders Found.</p>
          :   (
                  orders.map((order, index) => {
                    return <div key={index} className='order-card'>
                        <div className="order-header">
                          <h3>Order #{order.orderId}</h3>
                          <span className='order-date'>
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="order-address">
                          <p><strong>Name:</strong> {order.address.firstName} {order.address.lastName}</p>
                          <p><strong>Email:</strong> {order.address.email}</p>
                          <p><strong>Phone:</strong> {order.address.phone}</p>
                          <p><strong>Address:</strong> {order.address.street}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipCode}</p>
                        </div>

                        <div className={`payment-status ${order.paymentStatus ? 'success' : 'failed'}`}>
                          <p>
                            <strong>Payment:</strong> {order.paymentStatus ? 'Success' : 'Pending'}
                          </p>
                        </div>

                        <div className="order-items">
                            {
                              order.items.map((item, index) => {
                                return <div key={index}>
                                  <img src={item.productImage} alt="Product" />
                                  <div className="item-details">
                                    <p className="item-name">{item.productName}</p>
                                    <p>&#8377; {item.productPrice} x {item.quantity}</p>
                                    <p><b>&#8377; {item.itemPrice}</b></p>
                                  </div>
                                </div>
                              })
                            }  
                        </div>

                        <div className="order-footer">
                          <div>
                            <strong>Total: &#8377; {order.amount}</strong>
                          </div>
                          <div className="status-select">
                            <select name="status" onChange={(e) => statusHandler(e, order.orderId)} value={order.status}>
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                    </div>
                  })
              )
        }
    </div>
  )
}

export default Orders
