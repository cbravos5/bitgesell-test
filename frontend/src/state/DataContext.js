import React, { createContext, useCallback, useContext, useState } from 'react';
import { httpClient } from '../services/httpClient';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async ({ search }) => {
     const res = await httpClient.get('/items', { q: search, limit: 500 });
    const json = await res.json();
    return json;
  }, []);

  return (
    <DataContext.Provider value={{ items, setItems, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);