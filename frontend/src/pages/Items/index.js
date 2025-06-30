import React, { useEffect, useState } from "react";
import { useData } from "../../state/DataContext";
import { Link } from "react-router-dom";
import { useDebounce } from '@uidotdev/usehooks';
import Skeleton from 'react-loading-skeleton';
import { FixedSizeList as List } from 'react-window';

import styles from "./styles.module.css";

const ITEM_HEIGHT = 52;

function Items() {
  const [isLoading, setIsLoading] = useState(true);
  const { items, setItems, fetchItems } = useData();

  const [pagination, setPagination] = useState({ page: 0, hasNextPage: true });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // debounced value to prevent multiple fetch triggers

  const onInputChange = (e) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    if (pagination.page === 0) return;

    let active = true;

    fetchItems({ search: debouncedSearch, page: pagination.page })
      .then((response) => {
        if (active) {
          setItems((state) => state.concat(response.items));
          setPagination((state) => ({ page: state.page, hasNextPage: response.hasNextPage }));
        }
      })
      .catch(console.error)

    return () => { active = false; };
  }, [pagination.page]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchItems({ search: debouncedSearch, page: 0 })
      .then((response) => {
        if (active) {
          setItems(response.items);
          setPagination({ page: 0, hasNextPage: response.hasNextPage });
        }
      })
      .catch(console.error)
      .finally(() => active && setIsLoading(false));

    return () => { active = false; };
  }, [fetchItems, debouncedSearch]);

  const Row = ({ index, style }) => {
    if (isLoading) {
      return (
        <div style={style}>
          <li className={styles.listItem}>
            <Skeleton height={52} />
          </li>
        </div>
      );
    }

    const item = items[index];
    return (
      <div style={style}>
        <Link to={`/items/${item.id}`} className={styles.listItemLink}>
          <li className={`${styles.listItem} ${styles.itemAppear}`}>{item.name}</li>
        </Link>
      </div>
    );
  };

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

      <List
        height={800}
        itemCount={isLoading ? 25 : items.length}
        itemSize={ITEM_HEIGHT}
        className={`${styles.itemsList} virtual-scroll`}
        onItemsRendered={({ visibleStopIndex }) => {
          // tracks bottom of scroll to trigger next page
          if (
            visibleStopIndex >= items.length - 1 &&
            !isLoading &&
            pagination.hasNextPage
          ) {
            setPagination((state) => ({ ...state, page: state.page + 1 }));
          }
        }}
      >
        {Row}
      </List>
    </>
  );
}

export default Items;
