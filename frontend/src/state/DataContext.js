import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async ({ search }) => {
    const params = new URLSearchParams({ q: search, limit: 500 });

    const res = await fetch('http://localhost:3001/api/items?' + params.toString());
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