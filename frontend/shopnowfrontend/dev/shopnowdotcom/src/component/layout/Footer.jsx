import React, { useEffect } from 'react'
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { getAllCategories } from '../../store/features/categorySlice';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

const Footer = () => {
    const categories = useSelector((state) => state.category.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCategories())
    },[dispatch])

    return (
        <footer className='mega-footer'>
            <div className='footer-container'>
                <div className='footer-section'>
                    <h3>About us</h3>
                    <p>Lorem ipsum dolor sit amet consectetur</p>
                </div>

                <div className='footer-section'>
                    <h3>Category</h3>
                    <ul >
                        {
                            categories.map((category,index)=>
                                <li key={index}><Link to={`/products/category/${category.id}/products`}>{category.name}</Link></li>
                            )
                        }
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Email: vaibhavganjure@gmail.com.com</p>
                    <p>Phone: +91 9999999999</p>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>

                    <div className="social-icons">

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaTwitter />
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaInstagram />
                        </a>

                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 shopnow.com. All rights reserved.</p>
                </div>


            </div>

        </footer>
    )
}

export default Footer
