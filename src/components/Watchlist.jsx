import React from 'react';
export default function Watchlist({ stocks, onSelect }) {
  return (
    <div className="p-2">
      {stocks.filter(s => s.watchlisted).map(s => (
        <div key={s.id} onClick={() => onSelect(s)} className="cursor-pointer p-2 hover:bg-slate-800 text-white">
          {s.ticker}
        </div>
      ))}
    </div>
  );
}