import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/Cart.css";

export default function Cart() {
  const { user, isLoading } = useAuth0();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (user && !isLoading) {
      getCartItems();
    }
  }, [user]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  async function getCartItems() {
    const res = await fetch(
      `https://assignment3-348503.wm.r.appspot.com/api/user-by-name/${user.nickname}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const cart = await res.json();

    var totalPriceTemp = 0;
    if (cart) {
      setCart(cart);
      if (cart.length > 0) {
        cart.map((cartItem) => {
          totalPriceTemp += cartItem.quantity * cartItem.item?.price;
          setTotalPrice(totalPriceTemp);
        });
      } else {
        setTotalPrice(0);
      }
    }
  }

  async function addOne(thisCartId, thisItemId) {
    const res = await fetch(`https://assignment3-348503.wm.r.appspot.com/api/addtocart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId: thisCartId,
        itemId: thisItemId,
      }),
    });
    getCartItems();
  }

  async function removeOne(thisCartId, thisCartItemId) {
    const res = await fetch(`https://assignment3-348503.wm.r.appspot.com/api/removeoneitem`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId: thisCartId,
        cartItemId: thisCartItemId,
      }),
    });
    getCartItems();
  }

  async function removeAllByCartItemId(thisCartItemId) {
    const res = await fetch(
      `https://assignment3-348503.wm.r.appspot.com/api/deletecartitem/${thisCartItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    getCartItems();
  }

  function payCart() {
    alert("PAY!");
    cart.map((cartItem) => {
      removeAllByCartItemId(cartItem.id);
    });
    setTotalPrice(0);
    getCartItems();
  }

  return (
    <div className="App">
      <title>cart</title>
      <Navbar />
      <ul className="item-preview-cart">
        {cart.map((cartItem) => (
          <li className="item-preview" key={cartItem.id}>
            <Link to={`/item/detail/${cartItem.item.id}`}>
              <img src={`${cartItem.item.image}/200`} alt="random image"></img>
              <p>{`${cartItem.item?.title} --- $${cartItem.item?.price}`}</p>
              <p>Quantity: {`${cartItem.quantity}`}</p>
              <p>Subtotal: {cartItem.quantity * cartItem.item?.price}</p>
            </Link>
            <button
              className="add-sub add"
              onClick={() => addOne(cartItem.cartId, cartItem.itemId)}
            >
              +
            </button>
            <button
              className="add-sub sub"
              onClick={() => removeOne(cartItem.cartId, cartItem.id)}
            >
              -
            </button>
            <button
              className="remove"
              onClick={() => removeAllByCartItemId(cartItem.id)}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      <p>
        Total:
        {totalPrice}
      </p>
      <button onClick={() => payCart()}>Pay</button>
    </div>
  );
}
