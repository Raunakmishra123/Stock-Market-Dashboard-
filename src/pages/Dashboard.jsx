import React from 'react';
import { useStockData } from '../hooks/useStockData';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MarketSummary from '../components/MarketSummary';
import StockTable from '../components/StockTable';
import StockChart from '../components/StockChart';

export default function Dashboard() {
  const { stocks, filteredStocks, selectedStock, setSelectedStock } = useStockData();
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar watchlist={stocks.filter(s => s.watchlisted)} onSelect={setSelectedStock} />
        <main className="flex-1 p-6">
          <MarketSummary stocks={stocks} />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <StockChart stock={selectedStock} />
              <div className="mt-6 bg-slate-900 border border-slate-800 rounded p-4">
                <StockTable stocks={filteredStocks} onSelect={setSelectedStock} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}