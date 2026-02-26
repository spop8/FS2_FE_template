import React, { useState, useEffect } from "react";
import axios from "axios";

const PAGE_PRODUCTS = "products";
const PAGE_CART = "cart";

const Shopping = (props) => {
  const { searchTerm } = props;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [page, setPage] = useState(PAGE_PRODUCTS);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/ecommerce/products`)
      .then((res) => {
        console.log("data:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, searchTerm]);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCartList(JSON.parse(cartData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartList));
  }, [cartList]);

  const addToCart = (product) => {
    axios.post("http://localhost:3001/api/ecommerce/cart", { product })
      .then((res) => {
        setCartList([...cartList, { ...product }]);
      })
      .catch((err) => console.log(err));
  };

  const removeFromCart = (productId) => {
    axios
      .delete(`http://localhost:3001/api/ecommerce/cart/${productId}`)
      .then((res) => {
        setCartList(cartList.filter((item) => item.id !== productId));
      })
      .catch((err) => console.log(err));
  };

  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };

  const renderProducts = () => (
    <>
      <header id="shopping-head">
        <button onClick={() => navigateTo(PAGE_CART)} id="goToCart">
          Go to Cart ({cartList.length})
        </button>
      </header>
      <div id="shopping">
        {filteredProducts.map((product) => (
          <div key={product.id} id="product">
            <img id="img" src={product.image_url} alt="" />
            <h2>{product.name}</h2>
            <h3>{product.description}</h3>
            <h3>{product.price}</h3>
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
        
        <h1 id="cart-title"> Cart </h1>
        {cartList.map((product) => (
          <div className="card card-container" key={product.id}>
            <div id="product">
              <img src={product.image_url} alt="" />
              <h2> {product.name} </h2>
              <h3> {product.description} </h3>
              <h3> {product.price} </h3>
              <button onClick={() => removeFromCart(product.id)}>
                Remove from Cart
              </button>
            </div>
          </div>
        ))}

      </div>
    </>
  );

  return (
    <div className="main">
      {renderProducts()}
      {page === PAGE_CART && renderCart()}

    </div>
  );
};

export default Shopping;
