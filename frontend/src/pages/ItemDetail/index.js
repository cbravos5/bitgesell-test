import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpClient } from '../../services/httpClient';
import styles from './styles.module.css';
import Skeleton from 'react-loading-skeleton';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  useEffect(() => {
    let active = true;

    httpClient.get('/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then((res) => active && setItem(res))
      .catch(() => navigate('/'));

    return () => { active = false; }
  }, [id, navigate]);

  return (
    <div className={styles.itemDetail}>
      {!item ? (
        <Skeleton height={98} />
      ) : (
        <div>
          <h2>{item.name}</h2>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Price:</strong> ${item.price}</p>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;