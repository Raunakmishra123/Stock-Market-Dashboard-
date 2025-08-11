import React from 'react';
export default function SearchBar({ value, onChange }) {
  return (
    <input 
      type="text" 
      placeholder="Search stocks..." 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="p-2 bg-slate-800 border border-slate-700 rounded text-white w-full"
    />
  );
}