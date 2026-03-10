import React from "react";
import acct from "../images/acct.png";
import logo from "../images/logo.png";
import cartlogo from "../images/cartlogo.png";
import { Link } from "react-router-dom";

const NavBar = ({ cartCount }) => {
  return (
    <>
      <div className="nav">
        <div className="nav-items">
          <Link to="/home">
            <img className="icons" id="logo" src={logo} alt="Logo" />
          </Link>
          <input type="text" className="search-box" placeholder="search" />
          <button className="search-btn">search</button>

          <img className="icons" src={acct} alt="Account" />

          <Link to="/cart" id="cart-btn">
            <div id="cart">
              Cart ({Array.isArray(cartCount) 
              ? cartCount.reduce((sum, item) => sum + (item.quantity || 0), 0) 
              : 0})
              <img src={cartlogo} alt="Cart Logo" />
            </div>
          </Link>
        </div>
        <div id="links">
          <Link className="navlink" to="/">
            Home
          </Link>
          <Link className="navlink" to="/shopping">
            Shopping
          </Link>
          <Link className="navlink" to="/about">
            About Us
          </Link>
          <Link className="navlink" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;
