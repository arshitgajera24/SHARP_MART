import React from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <p>For Better Experince Download <br /> <b>SHARP MART</b> App</p>
        <div className="app-download-platforms">
            <img onClick={() => window.open("https://play.google.com/", "_blank")} src={assets.play_store} alt="PlayStore" />
            <img onClick={() => window.open("https://www.apple.com/in/app-store/", "_blank")} src={assets.app_store} alt="AppStore" />
        </div>
    </div>
  )
}

export default AppDownload
