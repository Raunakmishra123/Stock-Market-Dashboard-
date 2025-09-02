import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiBarChart2, FiActivity, FiRefreshCw, FiWifi } from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * Custom tooltip for the main chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-2xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-slate-100 text-sm font-bold">
          ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * SparklineChart — tiny inline chart for stock cards
 */
export const SparklineChart = ({ data, trend }) => {
  const color = trend === 'up' ? '#22C55E' : '#EF4444';
  const gradientId = `sparkline-gradient-${trend}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

/**
 * StockChart — full-featured area/line chart with controls
 */
const StockChart = ({ stock, isChartLoading = false }) => {
  const [chartType, setChartType] = useState('area');

  if (!stock) return null;

  const isUp = stock.dayChange >= 0;
  const color = isUp ? '#22C55E' : '#EF4444';
  const gradientId = 'main-chart-gradient';

  const minPrice = Math.min(...stock.chartData.map((d) => d.price));
  const maxPrice = Math.max(...stock.chartData.map((d) => d.price));
  const padding = (maxPrice - minPrice) * 0.1;

  const chartProps = {
    data: stock.chartData,
    margin: { top: 10, right: 10, bottom: 0, left: 10 },
  };

  return (
    <motion.div
      key={stock.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 backdrop-blur-sm"
    >
      {/* Chart header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-slate-100 font-bold text-lg">{stock.ticker}</h2>
            <span className={clsx(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              isUp
                ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            )}>
              {isUp ? '+' : ''}{stock.dayChangePercent.toFixed(2)}%
            </span>
            {stock.lastUpdated && (
              <span className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <FiWifi className="text-xs" />
                Live · {stock.lastUpdated}
              </span>
            )}
            {isChartLoading && (
              <span className="flex items-center gap-1 text-xs text-yellow-400">
                <FiRefreshCw className="text-xs animate-spin" />
                Loading chart…
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm">{stock.companyName}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-slate-100 text-2xl font-bold tabular-nums">
              ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className={clsx(
              'flex items-center gap-1 text-sm font-semibold',
              isUp ? 'text-green-400' : 'text-red-400'
            )}>
              {isUp ? <FiTrendingUp /> : <FiTrendingDown />}
              {isUp ? '+' : ''}{stock.dayChange.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Chart type toggle */}
          <div className="flex items-center bg-slate-900/60 border border-slate-700 rounded-xl p-1 gap-1">
            <button
              onClick={() => setChartType('area')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                chartType === 'area'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <FiActivity className="text-sm" /> Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                chartType === 'line'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <FiBarChart2 className="text-sm" /> Line
            </button>
          </div>
        </div>
      </div>

      {/* 52W range bar */}
      <div className="mb-4 px-1">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>52W Low ₹{stock.low52Week}</span>
          <span>52W High ₹{stock.high52Week}</span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
            style={{
              width: `${Math.round(
                ((stock.currentPrice - stock.low52Week) /
                  (stock.high52Week - stock.low52Week)) *
                  100
              )}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">Current</span>
          <span className="text-slate-300 font-medium">₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Main chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart {...chartProps}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v.toFixed(0)}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stock.previousClose}
                stroke="#475569"
                strokeDasharray="4 4"
                label={{ value: 'Prev Close', fill: '#475569', fontSize: 9 }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#0F172A' }}
              />
            </AreaChart>
          ) : (
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                tick={{ fill: '#64748B', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v.toFixed(0)}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={stock.previousClose}
                stroke="#475569"
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#0F172A' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Extra stock info row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-700/50">
        {[
          { label: 'P/E Ratio', value: stock.peRatio },
          { label: 'Div. Yield', value: stock.dividendYield },
          { label: 'Volume', value: stock.volume },
          { label: 'Market Cap', value: `₹${stock.marketCap}` },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-slate-500 text-xs mb-0.5">{label}</p>
            <p className="text-slate-200 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default StockChart;

// Refinement configuration - State 43
export function getRefinementState43() {
  return {
    revision: 43,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
