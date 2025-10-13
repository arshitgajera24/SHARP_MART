import React, { useEffect } from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'
import AOS from "aos";
import { FaArrowCircleRight, FaDiscord, FaEnvelope, FaInstagram, FaYoutube } from "react-icons/fa";
import { assets } from '../../assets/assets';

const Footer = () => {

  return (
    <div>
      
        <div className="section-contact--homepage" id="section-contact--homepage">
            <div className="container grid grid-two--cols">

                <div className="contact-content-footer">
                    <h2 className="contact-title"> Let’s revolutionize the way you shop groceries </h2>
                    <p> Shop Smarter & Fast with <strong>SHARP MART</strong> </p>
                    <div className="c-btn">
                        <Link to="/products#p1"> 
                            Start Shopping Now <FaArrowCircleRight />
                        </Link>
                    </div>
                </div>

                <div className="contact-image">
                    <img src={assets.contact} alt="Contact Image" width="300px"/>
                </div>

            </div>
        </div>

        <footer className="section-footer">
        <div className="footer-container container">

            <div className="content_1">
            <img src={assets.logo_footer} alt="logo" />
            <p>Welcome to <strong>SHARP MART</strong>, your trusted store for daily groceries, farm-fresh Quality products, everyday savings!</p>
            <img src="https://i.postimg.cc/Nj9dgJ98/cards.png" alt="Cards"/>

                <div className="social-footer--icons">
                        <a href="https://discord.com/" target="_blank"> 
                            <FaDiscord />
                        </a>

                        <a href="https://youtube.com/" target="_blank"> 
                            <FaYoutube />
                        </a>

                        <a href="https://instagram.com/" target="_blank"> 
                            <FaInstagram />
                        </a>
                </div>
            </div>

            <div className="content_2">
            <h4>SHOPPING</h4>
            <a href="#"> Vegetables </a>
            <a href="#"> Fruits </a>
            <a href="#"> Dairy </a>
            <a href="#"> Grains </a>
            </div>

            <div className="content_3">
            <h4>EXPERIENCE</h4>
            <Link to="/contact"> Contact Us </Link>
            <a href="#p1"> Track Your Order </a>
            <a href="#p1"> Secure Payments </a>
            <a href="#p1"> Fast Delivery </a>
            </div>

            <div className="content_4">
            <h4>NEWSLETTER</h4>
            <p>Fresh picks, hot deals,<br/> straight to your inbox.</p>
            <form action="https://formspree.io/f/xovldepr" method="post">
                <div className="input-group">
                    <FaEnvelope />
                    <input type="email" name="subscribedEmail" placeholder="Your Email" />
                </div>
                <button type="submit"></button>
            </form>
            </div>

        </div>

        <div className="f-design">
            <div className="f-design-txt">
            <p> Copyright {new Date().getFullYear()} © <strong>SHARP MART</strong> All Right Reserved. </p>
            <hr />
            <p> Code & Design by <span>ARSHIT GAJERA</span></p>
            </div>
        </div>
    </footer>

    </div>
  )
}

export default Footer
