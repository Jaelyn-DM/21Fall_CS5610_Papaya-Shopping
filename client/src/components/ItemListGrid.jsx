import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/ItemListGrid.css";
import { useAuth0 } from "@auth0/auth0-react";

export default function ItemListGrid() {
  const [items, setItems] = useState([]);
  const { user, isLoading } = useAuth0();
  const [userLocal, setUserLocal] = useState([]);

  useEffect(() => {
    getAllItems();
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

  async function getAllItems() {
    const res = await fetch("https://assignment3-348503.wm.r.appspot.com/api/allitems");
    const data = await res.json();

    if (data) {
      setItems(data);
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
    <div className="items-grid-home">
      <title>ItemListGrid</title>
      <ul className="item-preview-list-home">
        {items.map((item) => (
          <li className="item-preview" key={item.id}>
            <Link className="preview" to={`/item/detail/${item.id}`}>
              <img
                className="item-image preview"
                src={`${item.image}/200`}
                alt="random image"
              ></img>
              <h3 className="item-title preview">{`${item?.title}`}</h3>
              <p className="item-price preview">{`$${item?.price}`}</p>
            </Link>
            <button
              className="add-to-cart button"
              onClick={() => addOne(item.id)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
