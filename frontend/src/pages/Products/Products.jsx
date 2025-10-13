import React, { useContext, useState } from 'react'
import "./Products.css"
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay'
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { categoryList } from '../../assets/assets';
import { FaLongArrowAltRight } from 'react-icons/fa';

const Products = () => {

    const { productList } = useContext(StoreContext);
    const [category, setCategory] = useState("All");
    const [sortOption, setSortOption] = useState("");
    const [minRating, setMinRating] = useState(0);
    const [priceRange, setPriceRange] = useState(["", ""]);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    const categories = ["All", ...new Set(productList.map(item => item.category))];    

    const handlePriceChange = (e, index) => {
      const value = e.target.value === "" ? "" : Number(e.target.value);
      const newRange = [...priceRange];
      newRange[index] = value;
      setPriceRange(newRange);
    }

  return (
    <div className='section-products' id="p1">
        <div className="container-header">
            <h1 className="section-common--heading">Products</h1>
            <p className="section-common-subheading">
                Quality products at the best prices.
            </p>
        </div>
        
        <div className="products-container">
          <aside className="products-sidebar">
            <h3>Categories</h3>
            <ul className="category-list">
              {
                categories.map((cat, index) => {
                  return <li key={index} className={category === cat ? "active" : ""} onClick={() => setCategory(cat)}> {cat} </li>
                })
              }
            </ul>

            <select className="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {
                categories.map((cat, index) => {
                  return <option key={index} value={cat}>
                    {cat}
                  </option>
                })
              }
            </select>

            <h3>Sort by Price</h3>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Default</option>
              <option value="lowToHigh">Low → High</option>
              <option value="highToLow">High → Low</option>
            </select>
            
            <h3>Minimum Rating</h3>
            <div className="rating-filters">
              <label>
                <input type="radio" checked={minRating === 0} onChange={() => setMinRating(0)} /> All
              </label>
              <label>
                <input type="radio" checked={minRating === 4} onChange={() => setMinRating(4)} /> 4★ & Above
              </label>
              <label>
                <input type="radio" checked={minRating === 2} onChange={() => setMinRating(2)} /> 2★ & Above
              </label>
            </div>

            <h3>Price Range</h3>
            <div className="price-range">
              <input type="number" min="0" max="10000" value={priceRange[0]} onChange={(e) => handlePriceChange(e, 0)} placeholder='Min' />
              <span>to</span>
              <input type="number" min="0" max="10000" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} placeholder='Max' />
            </div>
          </aside>
        
        <ProductDisplay category={category} searchQuery={searchQuery} sortOption={sortOption} minRating={minRating} priceRange={priceRange}  />
      </div>
    </div>
  )
}

export default Products
