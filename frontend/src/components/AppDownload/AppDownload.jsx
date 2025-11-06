import React, {useState} from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'

const AppDownload = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className='app-download' id='app-download'>
        <p>For Better Experince Download <br /> <b>SHARP MART</b> App</p>
        <div className="app-download-platforms">
            <img onClick={() => window.open("https://play.google.com/", "_blank")} src={assets.play_store} alt="PlayStore" loading='lazy' decoding="async" onLoad={() => setLoaded(true)} style={{filter: loaded ? "none" : "blur(20px)", transition: "filter 0.3s ease-out"} />
            <img onClick={() => window.open("https://www.apple.com/in/app-store/", "_blank")} src={assets.app_store} alt="AppStore" loading='lazy' decoding="async" onLoad={() => setLoaded(true)} style={{filter: loaded ? "none" : "blur(20px)", transition: "filter 0.3s ease-out"} />
        </div>
    </div>
  )
}

export default AppDownload
