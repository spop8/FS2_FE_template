import React from "react";
import productImg from "../images/productImg.png";

const Featured = ({ products = [], addToCart }) => {
  return (
    <>
      <div id="gallery-head">
        <h1>Gallery</h1>
      </div>

      <div id="card-container">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="featured-card">
              <img
                className="img"
                src={product.image_url || productImg}
                alt={product.name}
              />
              <h2>{product.name}</h2>
              <h3>{product.description}</h3>
              <h3>${product.price}</h3>
              <button
                onClick={() => addToCart && addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Featured;
