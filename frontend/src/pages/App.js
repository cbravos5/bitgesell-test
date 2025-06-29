import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import styles from './styles.module.css';
import Items from './Items';

function App() {
  return (
    <DataProvider>
      <nav className={styles.navBar}>
        <Link to="/" className={styles.navItem}>Items</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;