import React, { useEffect, useState } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

export default function AddToCart() {
  const { user, isLoading } = useAuth0();
  const [userLocal, setUserLocal] = useState([]);
  const [cart, setCart] = useState([]);

  async function getCartItems() {
    const res = await fetch(
      `http://localhost:8000/api/user-by-name/${user.nickname}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const cart = await res.json();
    // console.log(cart);
    if (cart) {
      setCart(cart);
    }
  }
  return <div>
    <button onClick={console.log("added")}>Add to Cart 2</button>
  </div>;
}
