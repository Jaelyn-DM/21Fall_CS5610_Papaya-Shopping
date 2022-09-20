import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NotFound from "./NotFound";
import "../style/ItemDetail.css";

export default function ItemDetail() {
  const params = useParams();
  const [itemDetail, setItemDetail] = useState([]);
  const { user, isLoading } = useAuth0();
  const [userLocal, setUserLocal] = useState([]);

  useEffect(() => {
    getItemDetail();
    if (user && !isLoading) {
      getUserCart();
    }
  }, [user]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  async function getUserCart() {
    const res = await fetch(
      `https://assignment3-348503.wm.r.appspot.com/api/user-cart-by-name/${user.nickname}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const userFetched = await res.json();
    if (userFetched) {
      setUserLocal(userFetched);
    }
  }

  async function getItemDetail() {
    const res = await fetch(`https://assignment3-348503.wm.r.appspot.com/api/item/${params.itemId}`);
    const data = await res.json();

    if (data) {
      setItemDetail(data);
    }
  }

  async function addOne(thisItemId) {
    if (!user) {
      alert("please login");
      return;
    }

    const res = await fetch(`https://assignment3-348503.wm.r.appspot.com/api/addtocart`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartId: userLocal.cart.id,
        itemId: thisItemId,
      }),
    });
    alert("added");
  }

  return (
    <div className="App">
      <title>Item detail page</title>
      {itemDetail ? (
        <div>
          <Navbar />
          <div className="item-detail">
            <img
              className="item-img-detail"
              src={`${itemDetail.image}/400`}
              alt="random image"
            ></img>
            <p>Title: {itemDetail.title}</p>
            <p>Price: {itemDetail.price}</p>
            <p>Description: {itemDetail.description}</p>
            <button className="button" onClick={() => addOne(itemDetail.id)}>
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
}
