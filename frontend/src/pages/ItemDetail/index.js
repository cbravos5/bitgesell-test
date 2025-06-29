import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpClient } from '../../services/httpClient';
import styles from './styles.module.css';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    httpClient.get('/items/' + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className={styles.itemDetail}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;