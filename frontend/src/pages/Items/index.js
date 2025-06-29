import React, { useEffect, useState } from "react";
import { useData } from "../../state/DataContext";
import { Link } from "react-router-dom";
import { useDebounce } from '@uidotdev/usehooks';
import Skeleton from 'react-loading-skeleton';
import styles from "./styles.module.css";

function Items() {
  const [isLoading, setIsLoading] = useState(true);
  const { items, setItems, fetchItems } = useData();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // debounced value to prevent multiple fetch triggers

  const onInputChange = (e) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchItems({ search: debouncedSearch })
      .then((response) => active && setItems(response))
      .catch(console.error)
      .finally(() => active && setIsLoading(false));

    return () => {
      active = false;
    };
  }, [fetchItems, debouncedSearch]);

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          className={styles.search}
          aria-label="Search items"
          type="text"
          placeholder="Search items..."
          onChange={onInputChange}
        />
      </div>

      <div className={styles.itemsContainer}>
        <ul className={styles.itemsList}>
          {isLoading && Array.from({ length: 25 }).map((_, i) => (
            <li key={i}>
              <Skeleton height={52} />
            </li>
          ))}
          {!isLoading && items.map((item) => (
            <li key={item.id} className={`${styles.listItem} ${styles.itemAppear}`}>
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
