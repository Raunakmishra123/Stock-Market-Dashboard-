import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiStar } from 'react-icons/fi';
import { clsx } from 'clsx';
import PriceBadge from './PriceBadge';
import {
  SparklineChart,
} from './StockChart';

/**
 * StockCard — glassmorphism card showing stock overview
 */
const StockCard = ({ stock, isSelected, onSelect, onToggle }) => {
  const isUp = stock.dayChange >= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(stock)}
      className={clsx(
        'relative group rounded-2xl border p-5 cursor-pointer transition-all duration-300 backdrop-blur-sm overflow-hidden',
        isSelected
          ? 'bg-blue-500/10 border-blue-500/40 shadow-lg shadow-blue-500/10'
          : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-slate-900/40'
      )}
    >
      {/* Subtle glow on selected */}
      {isSelected && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top row: ticker + watchlist star */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-slate-100 font-bold text-base tracking-wide">
              {stock.ticker}
            </h3>
            <PriceBadge label={stock.rating} />
          </div>
          <p className="text-slate-500 text-xs mt-0.5 truncate">{stock.companyName}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(stock.id);
          }}
          className={clsx(
            'p-1.5 rounded-lg transition-all duration-200 flex-shrink-0',
            stock.watchlisted
              ? 'text-yellow-400 bg-yellow-500/10'
              : 'text-slate-600 hover:text-yellow-400 hover:bg-yellow-500/10'
          )}
        >
          <FiStar className={clsx('text-sm', stock.watchlisted && 'fill-current')} />
        </button>
      </div>

      {/* Price */}
      <div className="mt-3 mb-2">
        <p className="text-slate-100 text-2xl font-bold tabular-nums">
          ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <div
            className={clsx(
              'flex items-center gap-1 text-sm font-semibold',
              isUp ? 'text-green-400' : 'text-red-400'
            )}
          >
            {isUp ? (
              <FiTrendingUp className="text-xs" />
            ) : (
              <FiTrendingDown className="text-xs" />
            )}
            <span>{isUp ? '+' : ''}{stock.dayChange.toFixed(2)}</span>
            <span className="text-xs">({isUp ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%)</span>
          </div>
          <span className="text-slate-600 text-xs">today</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 mt-2 mb-3">
        <div>
          <p className="text-slate-600 text-xs">Mkt Cap</p>
          <p className="text-slate-300 text-xs font-semibold">₹{stock.marketCap}</p>
        </div>
        <div>
          <p className="text-slate-600 text-xs">Volume</p>
          <p className="text-slate-300 text-xs font-semibold">{stock.volume}</p>
        </div>
        <div>
          <p className="text-slate-600 text-xs">P/E</p>
          <p className="text-slate-300 text-xs font-semibold">{stock.peRatio}</p>
        </div>
        <div className="ml-auto">
          <PriceBadge label={stock.growth} />
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="h-16 mt-1">
        <SparklineChart data={stock.chartData} trend={stock.trend} />
      </div>

      {/* Sector tag */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-slate-600 text-xs px-2 py-0.5 bg-slate-700/50 rounded-full">
          {stock.sector}
        </span>
        <span className={clsx(
          'text-xs font-medium',
          isUp ? 'text-green-400' : 'text-red-400'
        )}>
          52W: ₹{stock.low52Week} – ₹{stock.high52Week}
        </span>
      </div>

      {/* Hover indicator */}
      <div className={clsx(
        'absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-all duration-300',
        isUp ? 'bg-green-500/50' : 'bg-red-500/50',
        'opacity-0 group-hover:opacity-100'
      )} />
    </motion.div>
  );
};

export default StockCard;
