import { useState } from 'react';
import { mockStocks } from '../data/stocks';

export function useStockData() {
  const [stocks, setStocks] = useState(mockStocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);

  const toggleWatchlist = (id) => {
    setStocks(stocks.map(s => s.id === id ? { ...s, watchlisted: !s.watchlisted } : s));
  };

  return {
    stocks,
    filteredStocks: stocks.filter(s => s.ticker.includes(searchQuery.toUpperCase())),
    searchQuery,
    setSearchQuery,
    selectedStock,
    setSelectedStock,
    toggleWatchlist
  };
}