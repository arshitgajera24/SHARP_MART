import React, {useState} from 'react'
import "./ExploreCategory.css"
import { categoryList } from '../../assets/assets.js'

const ExploreCategory = ({category, setCategory}) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className='explore-menu'>
      <div>
        <h2 className='explore-menu-heading'>Explore Menu</h2>
        <p className='explore-menu-text'>Enjoy top quality, great value, and easy shopping all in one place.</p>
      </div>
      <div className="explore-menu-list">
        {
          categoryList.map((item, index) => {
            return <div onClick={() => setCategory(prev => prev===item.category ? "All" : item.category)} key={index} className="explore-menu-list-item">
              <img className={category === item.category ? "active" : ""} src={item.categoryImage} alt="Item" loading='lazy' decoding="async" onLoad={() => setLoaded(true)} style={{filter: loaded ? "none" : "blur(20px)", transition: "filter 0.3s ease-out"}} />
              <p>{item.categoryName}</p>
            </div>
          })
        }
      </div>
      <hr />

    </div>
  )
}

export default ExploreCategory
