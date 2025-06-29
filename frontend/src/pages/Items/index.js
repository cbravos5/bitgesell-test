import React, { useEffect, useState } from "react";
import { useData } from "../../state/DataContext";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

function Items() {
  const [isLoading, setIsLoading] = useState(true);
  const { items, setItems, fetchItems } = useData();

  useEffect(() => {
    let active = true;

    fetchItems()
      .then((response) => active && setItems(response))
      .catch(console.error)
      .finally(() => active && setIsLoading(false));

    return () => {
      active = false;
    };
  }, [fetchItems]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.searchContainer}>
        <input className={styles.search} type="text" id="search" placeholder="Search items..." />
      </div>

      <div className={styles.itemsContainer}>
        <ul className={styles.itemsList}>
          {items.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <Link to={"/items/" + item.id} className={styles.listItemLink}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Items;
