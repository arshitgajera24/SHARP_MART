import React,{useState} from 'react'
import { assets } from '../../assets/assets'
import "./Home.css"

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className='home-admin'>
        <img src={assets.admin_icon} alt="" fetchpriority="high" onLoad={() => setLoaded(true)} style={{filter: loaded ? "none" : "blur(20px)", transition: "all 0.3s ease-out"}}  />
    </div>
  )
}

export default Home
