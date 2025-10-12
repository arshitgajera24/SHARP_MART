import React, { useState } from 'react'
import "./Home.css"
import Header from '../../components/Header/Header'
import AppDownload from '../../components/AppDownload/AppDownload'
import ExploreCategory from '../../components/ExploreCategory/ExploreCategory'
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const Home = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const { productList } = useContext(StoreContext);
  const location = useLocation();

  useEffect(() => {
    if(productList.length === 0)
      setIsLoading(true);
    else
      setIsLoading(false);
  }, [productList]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if(params.get("login") === "success")
    {
      toast.success("Sign in Successfully");
      window.history.replaceState({}, document.title, "/");
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <ExploreCategory category={category} setCategory={setCategory} />
      <ProductDisplay category={category} searchQuery="" sortOption="" minRating={0} priceRange={["", ""]}  />
      <AppDownload />
    </div>
  )
}

export default Home
