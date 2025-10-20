import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiMoon,
  FiMenu,
  FiTrendingUp,
  FiWifi,
  FiWifiOff,
  FiLoader,
} from 'react-icons/fi';
import { clsx } from 'clsx';
import SearchBar from './SearchBar';

/**
 * Navbar — top navigation bar
 * Shows live data fetch progress and status badge
 */
const Navbar = ({
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
  liveStatus,
  fetchProgress,
}) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Live status pill config
  const statusConfig = {
    idle: null,
    fetching: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      dot: 'bg-yellow-400',
      ping: true,
      label: `Fetching ${fetchProgress?.current || '...'} (${fetchProgress?.done || 0}/${fetchProgress?.total || 15})`,
      icon: FiLoader,
    },
    live: {
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
      dot: 'bg-green-500',
      ping: true,
      label: 'LIVE',
      icon: FiWifi,
    },
    limited: {
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
      dot: 'bg-orange-400',
      ping: false,
      label: 'Quota Limit',
      icon: FiWifiOff,
    },
    mock: {
      color: 'text-slate-400',
      bg: 'bg-slate-700/50 border-slate-600/30',
      dot: 'bg-slate-400',
      ping: false,
      label: 'Mock Data',
      icon: FiWifiOff,
    },
  };

  const status = statusConfig[liveStatus];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800"
    >
      <div className="flex items-center gap-3 px-4 md:px-6 h-16">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Title */}
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-green-400 text-lg" />
            <h1 className="text-base font-bold text-slate-100 tracking-tight">
              Market Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500">{dateStr} · {timeStr} IST</p>
        </div>

        {/* Search bar — center */}
        <div className="flex-1 max-w-xl mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Live status pill */}
          <AnimatePresence mode="wait">
            {status && (
              <motion.div
                key={liveStatus}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={clsx(
                  'hidden sm:flex items-center gap-1.5 px-3 py-1.5 border rounded-full',
                  status.bg
                )}
              >
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  {status.ping && (
                    <span className={clsx(
                      'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                      status.dot
                    )} />
                  )}
                  <span className={clsx(
                    'relative inline-flex rounded-full h-2 w-2',
                    status.dot
                  )} />
                </span>
                <span className={clsx('text-xs font-semibold', status.color)}>
                  {status.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fetch progress bar — shows only during fetch */}
          {liveStatus === 'fetching' && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((fetchProgress?.done || 0) / (fetchProgress?.total || 15)) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Notification bell */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <FiBell className="text-xl" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
          </button>

          {/* Dark mode toggle (cosmetic) */}
          <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <FiMoon className="text-xl" />
          </button>

          {/* Profile avatar */}
          <button className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-slate-700 hover:ring-blue-500/50 transition-all">
            RM
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;

;
}

;
}

;
}

;
}

// Refinement configuration - State 107
export function getRefinementState107() {
  return {
    revision: 107,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
