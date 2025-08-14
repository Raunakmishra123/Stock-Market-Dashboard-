import React from 'react';
export default function MarketSummary({ stocks }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-slate-900 rounded border border-slate-800">
        <div className="text-slate-400">Total Stocks</div>
        <div className="text-2xl font-bold text-white">{stocks.length}</div>
      </div>
    </div>
  );
}