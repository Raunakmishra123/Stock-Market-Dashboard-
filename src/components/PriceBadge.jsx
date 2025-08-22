import React from 'react';
import { clsx } from 'clsx';

/**
 * PriceBadge — colored pill showing Buy/Hold/Sell or Up/Down
 */
const PriceBadge = ({ label, size = 'sm' }) => {
  const isPositive =
    label === 'Buy' || label === 'up' || label === 'Strong' || label === 'Stable';
  const isNegative = label === 'Sell' || label === 'down';
  const isNeutral = label === 'Hold' || label === 'Moderate';

  const displayLabel =
    label === 'up' ? '▲ Up' : label === 'down' ? '▼ Down' : label;

  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full border',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        isPositive &&
          'bg-green-500/15 text-green-400 border-green-500/30',
        isNegative &&
          'bg-red-500/15 text-red-400 border-red-500/30',
        isNeutral &&
          'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
      )}
    >
      {displayLabel}
    </span>
  );
};

export default PriceBadge;
