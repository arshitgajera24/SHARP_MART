import React, { useContext } from 'react'
import "./Cart.css"
import { StoreContext } from '../../context/StoreContext'
import { RiCoupon2Fill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';

const Cart = () => {

    const [isLoading, setIsLoading] = useState(false);
    const {cartItems, removeFromCart, decreaseFromCart, addToCart, getTotalCartAmount } = useContext(StoreContext);

    const navigate = useNavigate();

    const itemsInCart = cartItems.map(cart => ({
        ...cart.product,
        quantity: cart.quantity,
        cartId: cart.id
    }))

    useEffect(() => {
        if(cartItems.length === 0)
        {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 200);

            return () => clearTimeout(timer);
        }
        else
            setIsLoading(false);
    }, [cartItems]);

    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        )
    }

  return (
    <div className='cart'>
      {
        itemsInCart.length === 0
        ? <></> 
        : <div className="container-header">
            <h1 className="section-common--heading">Your Cart</h1>
            <p className='section-common-subheading'>Review Your Items Before Checkout.</p>
          </div>
      }
      <div className="cart-items">
        {
            itemsInCart.length > 0 
            ? <><div className="cart-items-title">
                    <p>Items</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
              </>
            : <></>
        }
        
        {
            itemsInCart.length > 0 
            ?   (   itemsInCart.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`} alt="Item Image" />
                                    <p>{item.name}</p>
                                    <p>&#8377; {item.price}</p>
                                    <div className="stockElement">
                                        <button className="cartIncrement" onClick={() => addToCart(item.id)}>+</button>
                                            <p className="productQuantity">{item.quantity}</p>
                                        <button className="cartDecrement" onClick={() => decreaseFromCart(item.id)}>-</button>
                                    </div>
                                    <p>&#8377; {item.price * item.quantity}</p>
                                    <p onClick={() => removeFromCart(item.id)}>
                                        <button className='remove-btn'>Remove</button>
                                    </p>
                                </div>
                                <hr />
                            </div>
                        );
                    })
                ) 
            :   (
                    <>
                    <p className='no-products'>No Products in the Cart
                        <br /><button onClick={() => navigate("/products")}><FaArrowCircleLeft />Start Shopping Now</button></p>
                    </>
                )
        }
      </div>
      {
        itemsInCart.length > 0 
        ?   <div className="cart-bottom">
                <div className="cart-promocode">
                    <div>
                        <p>If You have a Promo Code, Enter it Here</p>
                        <div className='cart-promocode-input input-grp'>
                            <RiCoupon2Fill />
                            <input type="text" placeholder='Promo Code' />
                            <button>Apply</button>
                        </div>
                    </div>
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
                    <button className='remove-btn' onClick={() => navigate("/order")}>PROCEED TO CHECKOUT</button>
                </div>
            </div>
        :   <></>
      }
    </div>
  )
}

export default Cart
