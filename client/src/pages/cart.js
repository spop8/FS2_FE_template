import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = ({ updateCartCount = () => {} }) => {
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:3001/api/ecommerce/cart";

  // Load cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(API_BASE);

        // make sure quantity exists
        const cartWithQuantity = data.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));

        setCartList(cartWithQuantity);

        const totalItems = cartWithQuantity.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        updateCartCount(totalItems);

        setError(null);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Unable to load cart.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [updateCartCount]);

  // ADD TO CART
  const addToCart = (product) => {
    const existingItem = cartList.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      updatedCart = cartList.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartList, { ...product, quantity: 1 }];
    }

    setCartList(updatedCart);

    const totalItems = updatedCart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    updateCartCount(totalItems);
  };

  // REMOVE FROM CART
  const removeFromCart = (productId) => {
    const existingItem = cartList.find((item) => item.id === productId);

    if (!existingItem) return;

    let updatedCart;

    if (existingItem.quantity > 1) {
      updatedCart = cartList.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    } else {
      updatedCart = cartList.filter((item) => item.id !== productId);
    }

    setCartList(updatedCart);

    const totalItems = updatedCart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    updateCartCount(totalItems);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formatPrice = (price) =>
    price ? currencyFormatter.format(price) : "$0.00";

  const cartTotal = cartList.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <div id="cart-page">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div id="cart-header">
        <button onClick={() => navigate("/shopping")} id="back-btn">
          ← Back to Shopping
        </button>
        <h1>Your Cart</h1>
      </div>

      {isLoading && <p>Loading cart...</p>}
      {error && <p>{error}</p>}

      {!isLoading && cartList.length === 0 && <p>Your cart is empty.</p>}

      {!isLoading && cartList.length > 0 && (
        <div id="cart-items">
          {cartList.map((product) => (
            <div className="cart-item" key={product.id}>
              <img
                src={product.image_url}
                alt={product.name}
                className="cart-item-img"
              />

              <div className="cart-item-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <p>
                  {formatPrice(product.price)} x {product.quantity} ={" "}
                  {formatPrice(product.price * product.quantity)}
                </p>

                <div className="cart-item-buttons">
                  <button onClick={() => removeFromCart(product.id)}>
                    -
                  </button>

                  <button onClick={() => addToCart(product)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div id="cart-summary">
            <h2>Total: {formatPrice(cartTotal)}</h2>

            <button
              id="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
