import React from 'react';
export default function Sidebar({ watchlist, onSelect }) {
  return (
    <div className="w-64 bg-slate-950 p-4 text-white border-r border-slate-800">
      <h2 className="text-lg font-bold mb-4">Watchlist</h2>
      <ul>
        {watchlist.map(s => (
          <li key={s.id} onClick={() => onSelect(s)} className="cursor-pointer p-2 hover:bg-slate-800 rounded">
            {s.ticker}
          </li>
        ))}
      </ul>
    </div>
  );
}