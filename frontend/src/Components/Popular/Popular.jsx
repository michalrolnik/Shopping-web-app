import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
  const [popular_products, setPopular_products] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/popularinwomen")
      .then((res) => res.json())
      .then((data) => setPopular_products(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="popular">
      <h1>Popular in Women</h1>
      <hr />
      <div className="popular-item">
        {popular_products.map((item, i) => {
          // בונים URL מלא אם קיבלנו רק שם קובץ
          let imageSrc = item.image;
          if (typeof imageSrc === "string" && !imageSrc.startsWith("http")) {
            imageSrc = `http://localhost:4000/images/${imageSrc}`;
          }

          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={imageSrc}
              new_price={item.new_price}
              old_price={item.old_price} // ← תוקן
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
