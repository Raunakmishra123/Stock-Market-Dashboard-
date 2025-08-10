import React from 'react';
export default function PriceBadge({ rating }) {
  return (
    <span className="px-2 py-1 text-xs font-bold rounded bg-slate-700">
      {rating}
    </span>
  );
}