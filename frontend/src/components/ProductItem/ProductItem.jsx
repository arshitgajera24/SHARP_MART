import React, { useContext, useState } from 'react'
import "./ProductItem.css"
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import { useEffect } from 'react';

const ProductItem = ({id, name, price, originalPrice, ratings, description, image, category}) => {
  
    const {cartItems, addToCart, decreaseFromCart} = useContext(StoreContext)

    const cartItem = cartItems.find(item => item.product.id === id);

  return (
    <div className='food-item'>
      <span className='category'>{category}</span>
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        {
            !cartItem
            ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add Item" />
            : <div className='food-item-counter'>
                <img onClick={() => decreaseFromCart(id)} src={assets.remove_icon_red} alt="Remove Item" />
                <p>{cartItem.quantity}</p>
                <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add Item" />
            </div>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
            <p>{name}</p>
            <p>
              {ratings}
              <img src={assets.rating_starts} alt="rating" />
            </p>
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">&#8377; {price} &nbsp; <span>&#8377;{originalPrice}</span></p>
      </div>
    </div>
  )
}

export default ProductItem
