import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Product from "../components/product";

const Cart = () => {
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/cart`
        );
        setCartList(data.rows || []);
        setError(null);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Unable to load cart.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/${productId}`
      );

      setCartList(data.rows || []);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const cartTotal = cartList.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );

  const formatPrice = (price) => {
    if (!price) return "$0.00";
    return currencyFormatter.format(price);
  };

  return (
    <div id="cart-container">
      <button onClick={() => navigate("/shopping")}>
        Back to Shopping
      </button>

      <h1 id="cart-title">Your Cart</h1>

      {isLoading && <p>Loading cart...</p>}
      {error && <p>{error}</p>}

      {!isLoading && cartList.length === 0 && (
        <p>Your cart is empty.</p>
      )}

      {!isLoading &&
        cartList.map((product) => (
          <div className="card card-container" key={product.id}>
            <Product product={product} />

            <button onClick={() => removeFromCart(product.id)}>
              Remove
            </button>
          </div>
        ))}

      {cartList.length > 0 && (
        <>
          <h2>Total: {formatPrice(cartTotal)}</h2>

          <button
            id="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;