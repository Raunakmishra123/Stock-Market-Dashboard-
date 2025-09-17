import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiDollarSign,
  FiActivity,
} from 'react-icons/fi';

/**
 * AnimatedCounter — counts up from 0 to a target number
 */
const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const target = parseFloat(String(value).replace(/,/g, ''));
    const duration = 1200;
    const startTime = performance.now();
    const startValue = 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;

      if (decimals > 0) {
        node.textContent = prefix + current.toFixed(decimals) + suffix;
      } else {
        node.textContent = prefix + Math.round(current).toLocaleString('en-IN') + suffix;
      }

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, prefix, suffix, decimals]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
};

/**
 * MarketSummary — 5 KPI cards at top of dashboard
 */
const MarketSummary = ({ stats }) => {
  const cards = [
    {
      label: 'Total Stocks',
      value: stats.total,
      prefix: '',
      suffix: '',
      icon: FiBarChart2,
      color: 'blue',
      gradient: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Gainers',
      value: stats.gainers,
      prefix: '',
      suffix: '',
      icon: FiTrendingUp,
      color: 'green',
      gradient: 'from-green-500/20 to-green-600/5',
      border: 'border-green-500/20',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      sub: `${Math.round((stats.gainers / stats.total) * 100)}% of market`,
      subColor: 'text-green-400',
    },
    {
      label: 'Losers',
      value: stats.losers,
      prefix: '',
      suffix: '',
      icon: FiTrendingDown,
      color: 'red',
      gradient: 'from-red-500/20 to-red-600/5',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      sub: `${Math.round((stats.losers / stats.total) * 100)}% of market`,
      subColor: 'text-red-400',
    },
    {
      label: 'Avg. Change',
      value: Math.abs(stats.avgGrowth),
      prefix: stats.avgGrowth >= 0 ? '+' : '-',
      suffix: '%',
      decimals: 2,
      icon: FiActivity,
      color: stats.avgGrowth >= 0 ? 'green' : 'red',
      gradient: stats.avgGrowth >= 0
        ? 'from-green-500/20 to-green-600/5'
        : 'from-red-500/20 to-red-600/5',
      border: stats.avgGrowth >= 0 ? 'border-green-500/20' : 'border-red-500/20',
      iconBg: stats.avgGrowth >= 0 ? 'bg-green-500/20' : 'bg-red-500/20',
      iconColor: stats.avgGrowth >= 0 ? 'text-green-400' : 'text-red-400',
      sub: 'Today',
      subColor: stats.avgGrowth >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Portfolio Value',
      value: stats.portfolioValue,
      prefix: '₹',
      suffix: '',
      icon: FiDollarSign,
      color: 'purple',
      gradient: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      sub: 'Watchlist (10 shares each)',
      subColor: 'text-slate-500',
      isLargeNumber: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.border} p-4 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
          >
            {/* Background glow */}
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${card.iconBg} blur-2xl opacity-60`} />

            <div className="relative">
              <div className={`inline-flex p-2 rounded-xl ${card.iconBg} mb-3`}>
                <Icon className={`text-lg ${card.iconColor}`} />
              </div>
              <p className="text-slate-400 text-xs font-medium mb-1">{card.label}</p>
              <p className={`text-xl font-bold text-slate-100 tabular-nums`}>
                {card.isLargeNumber ? (
                  <span>{card.prefix}{Number(String(card.value).replace(/,/g, '')).toLocaleString('en-IN')}</span>
                ) : (
                  <AnimatedCounter
                    value={typeof card.value === 'string' ? parseFloat(card.value.replace(/,/g, '')) : card.value}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    decimals={card.decimals || 0}
                  />
                )}
              </p>
              {card.sub && (
                <p className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MarketSummary;

;
}

// Refinement configuration - State 63
export function getRefinementState63() {
  return {
    revision: 63,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
