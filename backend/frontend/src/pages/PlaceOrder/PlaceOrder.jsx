import React, { useContext, useState } from 'react'
import "./PlaceOrder.css"
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {

  const {getTotalCartAmount, user, cartItems } = useContext(StoreContext);
  const [isLoading, setIsLoading] = useState(false);

  const itemsInCart = cartItems.map(cart => ({
        ...cart.product,
        quantity: cart.quantity,
        cartId: cart.id
    }))

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    status: "Pending",
  })

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData(prev => ({...prev, [name]:value}));
  }

  let orderId;

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZOR_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'SHARP MART ORDER PAYMENT',
      description: "ORDER PAYMENT",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          setIsLoading(true);
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/verify`, response, {
              withCredentials: true,
          })
          if(res.data.success)
          {
            toast.success(res.data.message);
            navigate("/myorders");
          }
          else
          {
            toast.error(res.data.error);
            navigate("/cart");
          }
          setIsLoading(false);
        } catch (error) {
          console.log(error)
          toast.error(error.message);
        }
      },
      modal: {
        ondismiss: async () => {
          try {
            setIsLoading(true);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/cancel`, {orderId}, {
                withCredentials: true,
            })
            if(response.data.success)
            {
              toast.success(response.data.message);
              navigate("/cart");
            }
            else
            {
              toast.error(response.data.error);
            }
            setIsLoading(false);
          } catch (error) {
            console.log(error)
            toast.error(error.message);
          }
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const placeOrderOnline = async () => {
    const isConfirmed = window.confirm("Are You Sure You want to Place Order ?");
    if(!isConfirmed) return;
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/place`, data, {
      withCredentials: true
    });
    orderId = response.data.orderId;

    if(response.data.success)
    {
      initPay(response.data.data);
    }
    else
    {
      toast.error(response.data.error);
    }
  }

  const placeOrderCashOnDelivery = async () => {
    const isConfirmed = window.confirm("Are You Sure You want to Place Order ?");
    if(!isConfirmed) return;
    setIsLoading(true);
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/cod`, data, {
      withCredentials: true
    });

    if(response.data.success)
    {
      toast.success(response.data.message);
      navigate("/myorders");
    }
    else
    {
      toast.error(response.data.error);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if(user === undefined) return;
    if(!user)
    {
      toast.error("Please Login First");
      return navigate("/cart");
    }
  }, [user])

  if (isLoading) {
        return (
            <div className='verify'>
              <div class="loader-truck">
                  <div class="truckWrapper">
                      <div class="truckBody">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 198 93" class="trucksvg" >
                          <path stroke-width="3" stroke="#282828" fill="#F83D3D" d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"></path>
                          <path stroke-width="3" stroke="#282828" fill="#7D7C7C" d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z" ></path>
                          <path stroke-width="2" stroke="#282828" fill="#282828" d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z" ></path>
                          <rect stroke-width="2" stroke="#282828" fill="#FFFCAB" rx="1" height="7" width="5" y="63" x="187" ></rect>
                          <rect stroke-width="2" stroke="#282828" fill="#282828" rx="1" height="11" width="4" y="81" x="193" ></rect>
                          <rect stroke-width="3" stroke="#282828" fill="#DFDFDF" rx="2.5" height="90" width="121" y="1.5" x="6.5" ></rect>
                          <rect stroke-width="2" stroke="#282828" fill="#DFDFDF" rx="2" height="4" width="6" y="84" x="1" ></rect>
                      </svg>
                      </div>
                      <div class="truckTires">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class="tiresvg">
                          <circle stroke-width="3" stroke="#282828" fill="#282828" r="13.5" cy="15" cx="15" ></circle>
                          <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" class="tiresvg">
                          <circle stroke-width="3" stroke="#282828" fill="#282828" r="13.5" cy="15" cx="15" ></circle>
                          <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                      </svg>
                      </div>
                      <div class="road"></div>

                      <svg xml:space="preserve" viewBox="0 0 453.459 453.459" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="Capa_1" version="1.1" fill="#000000" class="lampPost" >
                          <path d="M252.882,0c-37.781,0-68.686,29.953-70.245,67.358h-6.917v8.954c-26.109,2.163-45.463,10.011-45.463,19.366h9.993
                              c-1.65,5.146-2.507,10.54-2.507,16.017c0,28.956,23.558,52.514,52.514,52.514c28.956,0,52.514-23.558,52.514-52.514
                              c0-5.478-0.856-10.872-2.506-16.017h9.992c0-9.354-19.352-17.204-45.463-19.366v-8.954h-6.149C200.189,38.779,223.924,16,252.882,16
                              c29.952,0,54.32,24.368,54.32,54.32c0,28.774-11.078,37.009-25.105,47.437c-17.444,12.968-37.216,27.667-37.216,78.884v113.914
                              h-0.797c-5.068,0-9.174,4.108-9.174,9.177c0,2.844,1.293,5.383,3.321,7.066c-3.432,27.933-26.851,95.744-8.226,115.459v11.202h45.75
                              v-11.202c18.625-19.715-4.794-87.527-8.227-115.459c2.029-1.683,3.322-4.223,3.322-7.066c0-5.068-4.107-9.177-9.176-9.177h-0.795
                              V196.641c0-43.174,14.942-54.283,30.762-66.043c14.793-10.997,31.559-23.461,31.559-60.277C323.202,31.545,291.656,0,252.882,0z
                              M232.77,111.694c0,23.442-19.071,42.514-42.514,42.514c-23.442,0-42.514-19.072-42.514-42.514c0-5.531,1.078-10.957,3.141-16.017
                              h78.747C231.693,100.736,232.77,106.162,232.77,111.694z"></path>
                      </svg>
                  </div>
              </div>
          </div>
        )
    }

  return (
    <div className='cart'>
      <div className="container-header">
        <h1 className="section-common--heading">Checkout</h1>
        <p className='section-common-subheading'>Enter Your Details and Choose Your Preferred Payment Method to Place Your Order.</p>
      </div>
      <form className='place-order'>

        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
            <input name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
          </div>
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email Address' />
          <input name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
          <div className="multi-fields">
            <input name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
            <input name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
          </div>
          <div className="multi-fields">
            <input name='zipCode' onChange={onChangeHandler} value={data.zipCode} type="number" placeholder='Zip Code' />
            <input name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
          </div>
          <input name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone Number' />
        </div>
        <div className="place-order-right">
          <div className="order-products">
            <h2>Order items</h2>
            <ul>
              {
                itemsInCart.map((item, index) => {
                  return <li key={index} className='order-product-item'>
                    <span className="item-name">{item.name}</span>
                    <span className="item-details">&#8377;{item.price} x {item.quantity} = &#8377;{item.price * item.quantity}</span>
                  </li>
                })
              }
            </ul>
          </div>
          <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                  <div className="cart-total-details">
                      <p>Sub Total</p>
                      <p>&#8377; {getTotalCartAmount()}</p>
                  </div>
                  <hr />
                  <div className="cart-total-details">
                      <p>Delivery Fee</p>
                      <p>&#8377; {100}</p>
                  </div>
                  <hr />
                  <div className="cart-total-details">
                      <b>Total</b>
                      <b>&#8377; {getTotalCartAmount() + 100}</b>
                  </div>
              </div>
              <div className='payment-options'>
                <button type='button' onClick={placeOrderCashOnDelivery} className='remove-btn'>CASH ON DELIVERY</button>
                <button type='button' onClick={placeOrderOnline} className='remove-btn'>PAY ONLINE</button>
              </div>
          </div>
        </div>

      </form>
    </div>
  )
}

export default PlaceOrder
