import React from 'react';
export default function StockChart({ stock }) {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded text-slate-400 h-64 flex items-center justify-center">
      Chart Placeholder for {stock?.ticker}
    </div>
  );
}