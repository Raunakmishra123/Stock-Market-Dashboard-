import React from 'react';
export default function StockCard({ stock }) {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded text-white">
      <h3 className="text-lg font-bold">{stock.ticker}</h3>
      <p className="text-slate-400">{stock.companyName}</p>
      <div className="text-2xl font-bold mt-2">₹{stock.currentPrice}</div>
    </div>
  );
}