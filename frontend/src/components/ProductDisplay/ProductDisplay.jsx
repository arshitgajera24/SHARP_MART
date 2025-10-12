import React, { useContext, useEffect, useState } from 'react'
import "./ProductDisplay.css"
import { StoreContext } from '../../context/StoreContext'
import ProductItem from '../ProductItem/ProductItem';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductDisplay = ({category, searchQuery, sortOption, minRating, priceRange = ["", ""]}) => {

    const {productList} = useContext(StoreContext);
    const location = useLocation();
    const navigate = useNavigate();

    const filteredProducts = productList.filter(item => {
        if(!item.isAvailable) return false;

        const matchCategory = category === "All" || item.category === category;
        const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery) || item.category.toLowerCase().includes(searchQuery);
        const matchRating = item.ratings >= minRating;

        const minPrice = priceRange[0] === "" ? 0 : Number(priceRange[0]);
        const maxPrice = priceRange[1] === "" ? Infinity : Number(priceRange[1]);
        const matchPrice = item.price >= minPrice && item.price <= maxPrice;

        return matchCategory && matchSearch && matchRating && matchPrice;
    })

    const sortedProducts = [...filteredProducts].sort((a,b) => {
        if(sortOption === "lowToHigh") return a.price - b.price;
        if(sortOption === "highToLow") return b.price - a.price;
        return 0;
    })

    useEffect(() => {
        if(searchQuery)
        {
            navigate("/products", {replace: true});
        }
    }, [])

  return (
    <div className='food-display'>
        {
            location.pathname === "/" 
            ? <h2>Top Items are Here</h2>
            : <></>
        }
        <div className="food-display-list">
            {
                sortedProducts.map((item, index) => {
                    return <ProductItem key={index} id={item.id} name={item.name} description={item.description} price={item.price} originalPrice={item.originalPrice} category={item.category} ratings={item.ratings} image={item.image}/>
                })
            }
            {
                sortedProducts.length === 0 && <p className='no-product'>No Products Found</p>
            }
        </div>
    </div>
  )
}

export default ProductDisplay
