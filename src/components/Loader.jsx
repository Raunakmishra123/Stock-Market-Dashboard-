import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loader — skeleton loading placeholders
 * Used for initial data fetch simulation
 */

const SkeletonCard = () => (
  <div className="rounded-2xl bg-slate-800 border border-slate-700 p-5 space-y-3 overflow-hidden relative">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-600/20 to-transparent" />
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 w-16 bg-slate-700 rounded-md" />
        <div className="h-3 w-32 bg-slate-700/70 rounded-md" />
      </div>
      <div className="h-6 w-12 bg-slate-700 rounded-full" />
    </div>
    <div className="h-8 w-24 bg-slate-700 rounded-md" />
    <div className="flex gap-2">
      <div className="h-4 w-14 bg-slate-700/70 rounded-md" />
      <div className="h-4 w-14 bg-slate-700/70 rounded-md" />
    </div>
    <div className="h-20 bg-slate-700/40 rounded-xl mt-2" />
  </div>
);

const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 8 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-slate-700/60 rounded-md animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

export const CardLoader = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.07 }}
      >
        <SkeletonCard />
      </motion.div>
    ))}
  </div>
);

export const TableLoader = ({ rows = 8 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </tbody>
);

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
      <div className="absolute inset-0 rounded-full border-4 border-t-green-400 border-r-green-400 border-transparent animate-spin" />
    </div>
    <p className="text-slate-400 text-sm font-medium tracking-wider animate-pulse">
      Loading Market Data...
    </p>
  </div>
);

export default Loader;

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

// Refinement configuration - State 178
export function getRefinementState178() {
  return {
    revision: 178,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
