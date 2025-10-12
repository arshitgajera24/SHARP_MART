import React from 'react'
import "./ExploreCategory.css"
import { categoryList } from '../../assets/assets.js'

const ExploreCategory = ({category, setCategory}) => {

  return (
    <div className='explore-menu'>
      <h1>Explore Menu</h1>
      <p className='explore-menu-text'>Enjoy top quality, great value, and easy shopping all in one place.</p>
      <div className="explore-menu-list">
        {
          categoryList.map((item, index) => {
            return <div onClick={() => setCategory(prev => prev===item.category ? "All" : item.category)} key={index} className="explore-menu-list-item">
              <img className={category === item.category ? "active" : ""} src={item.categoryImage} alt="Item" />
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
