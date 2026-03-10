import React, { useEffect, useState } from "react";
import axios from "axios";
import productImg from "../images/productImg.png";

const Featured = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:3001/api/ecommerce/products";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(API_BASE);
        setProducts(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div id="gallery-head">
        <h1>Gallery</h1>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      <div id="card-container">
        {products.length === 0 && !loading && <p>No products available</p>}

        {products.map((product) => (
          <div key={product.id} className="featured-card">
            <img
              className="img"
              src={product.image_url || productImg}
              alt={product.name}
            />
            <h2>{product.name}</h2>
            <h3>{product.description}</h3>
            <h3>${product.price}</h3>
            <button onClick={() => addToCart && addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Featured;
