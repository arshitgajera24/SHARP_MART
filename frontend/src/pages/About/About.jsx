import React from 'react'
import "./About.css"
import { assets } from '../../assets/assets'

const About = () => {
  return (
    <div className="about-box">
        <div className="container-header">
            <h1 className="section-common--heading">About Us</h1>
            <p className="section--subheading">
                Discover who we are and what we stand for
            </p>
        </div>
      <div className="center grid grid-two--cols">
        <div className="about-image">
          <img src={assets.about_logo} alt="Logo"/>
        </div>
        <div className="about-text">
          <p>
            <span className="highlight">SHARP MART</span> is your one-stop online grocery store offering fresh produce, pantry staples, and daily essentials. Our goal is to bring quality, convenience, and value straight to your doorstep.
          </p>

          <p>
            Built on a vision to simplify everyday shopping, we focus on offering a wide range of products, user-friendly service, and fast delivery — making grocery shopping easier and faster than ever.
          </p>

          <p>
            From seasonal fruits and vegetables to snacks, beverages, dairy, and cleaning supplies, we’ve got everything you need in one place.
          </p>

          <p>
            At <span className="highlight">SHARP MART</span>, we believe grocery shopping should be stress-free, affordable, and enjoyable. Thank you for making us a part of your daily routine.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
