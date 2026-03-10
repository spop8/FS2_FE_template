import React, { useState, useEffect } from "react";
import axios from "axios";

const PAGE_PRODUCTS = "products";
const PAGE_CART = "cart";

const Shopping = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [page, setPage] = useState(PAGE_PRODUCTS);

  // Fetch products
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/ecommerce/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Filter products
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, searchTerm]);

  // Load cart from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) setCartList(JSON.parse(cartData));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartList));
  }, [cartList]);

  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cartList.find((item) => item.id === product.id);
    if (existingItem) {
      setCartList(
        cartList.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartList([...cartList, { ...product, quantity: 1 }]);
    }

    // Post to backend (optional)
    axios.post("http://localhost:3001/api/ecommerce/cart", { product }).catch(console.log);
  };

  // Remove product or decrease quantity
  const removeFromCart = (productId) => {
    const existingItem = cartList.find((item) => item.id === productId);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      setCartList(
        cartList.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCartList(cartList.filter((item) => item.id !== productId));
    }

    // Delete from backend (optional)
    axios
      .delete(`http://localhost:3001/api/ecommerce/cart/${productId}`)
      .catch(console.log);
  };

  const navigateTo = (nextPage) => setPage(nextPage);

  const getCartCount = () => cartList.reduce((sum, item) => sum + item.quantity, 0);

  const renderProducts = () => (
    <>
      <header id="shopping-head">
        
      </header>
      <div id="shopping">
        {filteredProducts.map((product) => (
          <div key={product.id} id="product">
            <img id="img" src={product.image_url} alt="" />
            <h2>{product.name}</h2>
            <h3>{product.description}</h3>
            <h3>${product.price}</h3>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </>
  );

  const renderCart = () => (
    <>
      <div id="cart-container">
        <button onClick={() => navigateTo(PAGE_PRODUCTS)} id="products-btn">
          Back to Products
        </button>

        <h1 id="cart-title">Cart</h1>
        {cartList.length === 0 && <p>Your cart is empty.</p>}
        {cartList.map((product) => (
          <div className="card card-container" key={product.id}>
            <div id="product">
              <img src={product.image_url} alt="" />
              <h2>{product.name}</h2>
              <h3>{product.description}</h3>
              <h3>
                ${product.price} x {product.quantity} = $
                {(product.price * product.quantity).toFixed(2)}
              </h3>
              <button onClick={() => removeFromCart(product.id)}>-</button>
              <button onClick={() => addToCart(product)}>+</button>
            </div>
          </div>
        ))}

      </div>
    </>
  );

  return (
    <div className="main">
      {page === PAGE_PRODUCTS && renderProducts()}
      {page === PAGE_CART && renderCart()}

    </div>
  );
};

export default Shopping;
