import React from 'react';
export default function StockTable({ stocks, onSelect }) {
  return (
    <table className="w-full text-left text-slate-300 border-collapse">
      <thead>
        <tr className="border-b border-slate-800 text-slate-500">
          <th className="p-3">Ticker</th>
          <th className="p-3">Price</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map(s => (
          <tr key={s.id} onClick={() => onSelect(s)} className="cursor-pointer border-b border-slate-800 hover:bg-slate-800/50">
            <td className="p-3 font-bold text-white">{s.ticker}</td>
            <td className="p-3">₹{s.currentPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}