import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiBarChart2,
  FiHome,
  FiPieChart,
  FiSettings,
  FiX,
  FiPlus,
} from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * Watchlist sub-component (used inside Sidebar)
 */
const WatchlistItem = ({ stock, isSelected, onSelect, onToggle }) => {
  const isUp = stock.dayChange >= 0;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={() => onSelect(stock)}
      className={clsx(
        'group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
        isSelected
          ? 'bg-blue-500/20 border border-blue-500/30'
          : 'hover:bg-slate-800/80 border border-transparent'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-slate-200 text-sm font-semibold truncate">
            {stock.ticker}
          </span>
          <span
            className={clsx(
              'text-xs font-bold',
              isUp ? 'text-green-400' : 'text-red-400'
            )}
          >
            {isUp ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-slate-500 text-xs truncate">
            ₹{stock.currentPrice.toLocaleString('en-IN')}
          </span>
          {isUp ? (
            <FiTrendingUp className="text-green-400 text-xs" />
          ) : (
            <FiTrendingDown className="text-red-400 text-xs" />
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(stock.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
        title="Remove from watchlist"
      >
        <FiX className="text-xs" />
      </button>
    </motion.div>
  );
};

/**
 * Sidebar — collapsible left navigation with watchlist
 */
const Sidebar = ({
  isOpen,
  onClose,
  watchlistedStocks,
  selectedStock,
  setSelectedStock,
  toggleWatchlist,
  stocks,
}) => {
  const navItems = [
    { icon: FiHome, label: 'Dashboard', active: true },
    { icon: FiBarChart2, label: 'Markets' },
    { icon: FiPieChart, label: 'Portfolio' },
    { icon: FiSettings, label: 'Settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg shadow-green-500/20">
            <FiTrendingUp className="text-white text-lg" />
          </div>
          <div>
            <p className="text-slate-100 font-bold text-base tracking-tight">StockPulse</p>
            <p className="text-slate-500 text-xs">Pro Dashboard</p>
          </div>
        </div>
      </div>

      {/* Market status */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-green-400 text-xs font-semibold">Market Open</span>
          <span className="ml-auto text-slate-500 text-xs">NSE/BSE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-3 border-b border-slate-800">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1',
              active
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            )}
          >
            <Icon className="text-base flex-shrink-0" />
            {label}
            {active && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Watchlist */}
      <div className="flex-1 overflow-hidden flex flex-col px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiStar className="text-yellow-400 text-sm" />
            <span className="text-slate-300 text-sm font-semibold">Watchlist</span>
            <span className="px-1.5 py-0.5 text-xs bg-slate-700 text-slate-400 rounded-full">
              {watchlistedStocks.length}
            </span>
          </div>
          {/* Quick-add button - selects first non-watchlisted stock */}
          <button
            onClick={() => {
              const toAdd = stocks.find((s) => !s.watchlisted);
              if (toAdd) toggleWatchlist(toAdd.id);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-all"
            title="Add stock to watchlist"
          >
            <FiPlus className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 pr-1">
          <AnimatePresence>
            {watchlistedStocks.length > 0 ? (
              watchlistedStocks.map((stock) => (
                <WatchlistItem
                  key={stock.id}
                  stock={stock}
                  isSelected={selectedStock?.id === stock.id}
                  onSelect={setSelectedStock}
                  onToggle={toggleWatchlist}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <FiStar className="text-slate-600 text-2xl mb-2" />
                <p className="text-slate-500 text-xs">No stocks in watchlist</p>
                <p className="text-slate-600 text-xs mt-1">
                  Click ⭐ on any stock to add
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            RM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-xs font-semibold truncate">Raunak Mishra</p>
            <p className="text-slate-500 text-xs">Pro Investor</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 overflow-hidden flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <FiX className="text-lg" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

;
}

;
}

;
}

// Refinement configuration - State 87
export function getRefinementState87() {
  return {
    revision: 87,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
