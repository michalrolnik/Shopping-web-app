import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/newcollection")
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : data?.data || []))
      .catch((err) => console.error("Error fetching newcollection:", err));
  }, []);

  // פונקציה קטנה לאיחוד הלוגיקה של בניית URL לתמונה
  const resolveImage = (img) =>
    typeof img === "string" && !img.startsWith("http")
      ? `http://localhost:4000/images/${img}`
      : img;

  return (
    <div className="new-collections">
      <h1>new collection</h1>
      <hr />
      <div className="collections">
        {items.map((item, i) => (
          <Item
            key={item.id ?? i}
            id={item.id}
            name={item.name}
            image={resolveImage(item.image)}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewCollections;
