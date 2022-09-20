import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../style/NewItem.css";

export default function NewItem() {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [description, setDescription] = useState();
  const navigate = useNavigate();

  async function createNewItem(e) {
    e.preventDefault();
    if (!title || !price) {
      alert("Please fill the title and the price of the item!");
      return;
    }

    const newItem = {
      title: title,
      price: parseFloat(price),
      description: description,
    };

    const res = await fetch("https://assignment3-348503.wm.r.appspot.com/api/newitem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    }).then((response) => response.json());

    const resImg = await fetch(`https://assignment3-348503.wm.r.appspot.com/api/update/${res.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: res.title,
        price: res.price,
        description: res.description,
        image: `https://picsum.photos/id/${res.id}`,
      }),
    });
    setTimeout(2000);
    navigate("/");
  }

  return (
    <div className="App">
      <title>new item</title>
      <Navbar />
      <form className="new-item" onSubmit={(e) => createNewItem(e)}>
        <label className="label " id="label-title">
          Enter Title: <br />
          <input
            label="Enter item title"
            for="label-title"
            type="text"
            className="input editor-title"
            id="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            required
          />
        </label>

        <label className="label " id="label-price">
          Enter price: <br />
          <input
            label="Enter item price"
            for="label-title"
            type="number"
            className="input editor-price"
            id="price"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            required
          />
        </label>

        <label className="label " id="label-description">
          Enter Description:
          <br />
          <textarea
            label="Enter item description"
            for="label-description"
            id="description"
            type="text"
            className="textarea editor-description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
        </label>

        <br />
        <input
          label="submit"
          type="submit"
          className="button create-button"
          value="Create New Item"
        ></input>
      </form>
    </div>
  );
}
