import React from "react";
import logo from "../images/logo.png";

const Hero = () => {
  return (
    <>
      <div id="hero">
        <img id="logo_big" src={logo} alt="Logo" />
        <h3 id="hero-promo"> Arabesque Apparel </h3>
        <p id="hero-text">Bringing dancewear to you</p>
        <br />
      </div>
    </>
  );
};

export default Hero;