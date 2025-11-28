import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiStar, FiX } from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * Watchlist — standalone component (also embedded inside Sidebar)
 * Displays watchlisted stocks with add/remove and selection highlight
 */
const Watchlist = ({ stocks, selectedStock, onSelect, onToggle }) => {
  const watchlisted = stocks.filter((s) => s.watchlisted);

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <FiStar className="text-yellow-400 text-base" />
        <h2 className="text-slate-100 font-bold text-base">Watchlist</h2>
        <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full font-medium ml-auto">
          {watchlisted.length} stocks
        </span>
      </div>

      {watchlisted.length === 0 ? (
        <div className="py-8 text-center">
          <FiStar className="text-slate-600 text-2xl mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No stocks in watchlist</p>
          <p className="text-slate-600 text-xs mt-1">Click ⭐ on any stock card to add</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {watchlisted.map((stock) => {
              const isUp = stock.dayChange >= 0;
              const isSelected = selectedStock?.id === stock.id;

              return (
                <motion.div
                  key={stock.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    onClick={() => onSelect(stock)}
                    className={clsx(
                      'group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border',
                      isSelected
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'border-transparent hover:bg-slate-700/50 hover:border-slate-600/50'
                    )}
                  >
                    {/* Trend icon */}
                    <div className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isUp ? 'bg-green-500/10' : 'bg-red-500/10'
                    )}>
                      {isUp
                        ? <FiTrendingUp className="text-green-400 text-sm" />
                        : <FiTrendingDown className="text-red-400 text-sm" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-slate-200 text-sm font-semibold">{stock.ticker}</p>
                        <p className={clsx(
                          'text-xs font-bold',
                          isUp ? 'text-green-400' : 'text-red-400'
                        )}>
                          {isUp ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-slate-500 text-xs truncate">
                          ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <p className={clsx(
                          'text-xs',
                          isUp ? 'text-green-500/70' : 'text-red-500/70'
                        )}>
                          {isUp ? '+' : ''}{stock.dayChange.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggle(stock.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

;
}

;
}

;
}

;
}

;
}

;
}

;
}

;
}

// Refinement configuration - State 160
export function getRefinementState160() {
  return {
    revision: 160,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
