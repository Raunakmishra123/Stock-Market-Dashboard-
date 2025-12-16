import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronUp,
  FiChevronDown,
  FiStar,
  FiTrendingUp,
  FiTrendingDown,
  FiSearch,
} from 'react-icons/fi';
import { clsx } from 'clsx';
import PriceBadge from './PriceBadge';
import { FILTER_OPTIONS } from '../data/stocks';

/**
 * SortIcon — shows sort direction for table headers
 */
const SortIcon = ({ column, sortConfig }) => {
  const isActive = sortConfig.key === column;
  return (
    <span className="inline-flex flex-col ml-1">
      <FiChevronUp
        className={clsx(
          'text-xs -mb-1',
          isActive && sortConfig.direction === 'asc'
            ? 'text-blue-400'
            : 'text-slate-600'
        )}
      />
      <FiChevronDown
        className={clsx(
          'text-xs',
          isActive && sortConfig.direction === 'desc'
            ? 'text-blue-400'
            : 'text-slate-600'
        )}
      />
    </span>
  );
};

/**
 * StockTable — full data table with sort, filter, search, and row animations
 */
const StockTable = ({
  stocks,
  selectedStock,
  onSelect,
  onToggle,
  sortConfig,
  onSort,
  activeFilter,
  setActiveFilter,
}) => {
  const isEmpty = stocks.length === 0;

  const columns = [
    { key: 'name', label: 'Stock', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'change', label: 'Change', sortable: true },
    { key: 'growth', label: 'Growth', sortable: false },
    { key: 'volume', label: 'Volume', sortable: false },
    { key: 'marketcap', label: 'Mkt Cap', sortable: false },
    { key: 'rating', label: 'Rating', sortable: false },
    { key: 'action', label: 'Action', sortable: false },
  ];

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl backdrop-blur-sm overflow-hidden">
      {/* Table header with filter pills */}
      <div className="px-5 py-4 border-b border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-slate-100 font-bold text-base flex-shrink-0">All Stocks</h2>
          {/* Filter pills — scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
            {FILTER_OPTIONS.map(({ label, value }) => (
              <motion.button
                key={value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(value)}
                className={clsx(
                  'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200',
                  activeFilter === value
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-sm'
                    : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'
                )}
              >
                {label}
              </motion.button>
            ))}
          </div>
          <span className="text-slate-500 text-xs flex-shrink-0">
            {stocks.length} stocks
          </span>
        </div>
      </div>

      {/* Table — horizontally scrollable */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-700/40">
              {columns.map(({ key, label, sortable }) => (
                <th
                  key={key}
                  onClick={() => sortable && onSort(key)}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-slate-400 tracking-wider whitespace-nowrap',
                    sortable && 'cursor-pointer hover:text-slate-200 select-none'
                  )}
                >
                  {label}
                  {sortable && <SortIcon column={key} sortConfig={sortConfig} />}
                </th>
              ))}
            </tr>
          </thead>

          {isEmpty ? (
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FiSearch className="text-slate-600 text-3xl" />
                    <p className="text-slate-400 font-medium">No stocks found</p>
                    <p className="text-slate-600 text-sm">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <AnimatePresence mode="popLayout">
              <tbody>
                {stocks.map((stock, i) => {
                  const isUp = stock.dayChange >= 0;
                  const isSelected = selectedStock?.id === stock.id;

                  return (
                    <motion.tr
                      key={stock.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => onSelect(stock)}
                      className={clsx(
                        'border-b border-slate-700/30 cursor-pointer transition-colors duration-150',
                        isSelected
                          ? 'bg-blue-500/10'
                          : 'hover:bg-slate-700/40'
                      )}
                    >
                      {/* Stock name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggle(stock.id);
                            }}
                            className={clsx(
                              'p-1 rounded transition-colors',
                              stock.watchlisted
                                ? 'text-yellow-400'
                                : 'text-slate-600 hover:text-yellow-400'
                            )}
                          >
                            <FiStar className={clsx('text-xs', stock.watchlisted && 'fill-current')} />
                          </button>
                          <div>
                            <p className="text-slate-100 text-sm font-semibold">{stock.ticker}</p>
                            <p className="text-slate-500 text-xs max-w-[160px] truncate">{stock.companyName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <p className="text-slate-100 text-sm font-mono font-semibold">
                          ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-slate-500 text-xs">
                          Prev: ₹{stock.previousClose.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                      </td>

                      {/* Change */}
                      <td className="px-4 py-3">
                        <div className={clsx(
                          'flex items-center gap-1 text-sm font-semibold',
                          isUp ? 'text-green-400' : 'text-red-400'
                        )}>
                          {isUp ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
                          <span>{isUp ? '+' : ''}{stock.dayChange.toFixed(2)}</span>
                        </div>
                        <p className={clsx(
                          'text-xs font-medium',
                          isUp ? 'text-green-500/70' : 'text-red-500/70'
                        )}>
                          {isUp ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%
                        </p>
                      </td>

                      {/* Growth */}
                      <td className="px-4 py-3">
                        <PriceBadge label={stock.growth} />
                      </td>

                      {/* Volume */}
                      <td className="px-4 py-3">
                        <p className="text-slate-300 text-sm font-mono">{stock.volume}</p>
                      </td>

                      {/* Market Cap */}
                      <td className="px-4 py-3">
                        <p className="text-slate-300 text-sm font-mono">₹{stock.marketCap}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <PriceBadge label={stock.rating} size="sm" />
                      </td>

                      {/* Action button */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelect(stock);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold hover:bg-blue-500/20 transition-colors whitespace-nowrap"
                          >
                            View
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </AnimatePresence>
          )}
        </table>
      </div>
    </div>
  );
};

export default StockTable;

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

;
}

;
}

// Refinement configuration - State 184
export function getRefinementState184() {
  return {
    revision: 184,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
