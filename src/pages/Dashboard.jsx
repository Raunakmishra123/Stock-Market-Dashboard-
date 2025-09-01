import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStockData from '../hooks/useStockData';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MarketSummary from '../components/MarketSummary';
import StockCard from '../components/StockCard';
import StockChart from '../components/StockChart';
import StockTable from '../components/StockTable';
import Watchlist from '../components/Watchlist';
import Loader, { CardLoader } from '../components/Loader';
import { FiGrid, FiList, FiRefreshCw } from 'react-icons/fi';
import { clsx } from 'clsx';

/**
 * Dashboard — main page composing all components
 */
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('cards'); // 'cards' | 'table'

  const {
    stocks,
    filteredStocks,
    watchlistedStocks,
    marketStats,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    sortConfig,
    handleSort,
    selectedStock,
    setSelectedStock,
    toggleWatchlist,
    isLoading,
    liveStatus,
    fetchProgress,
    isChartLoading,
  } = useStockData();

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        watchlistedStocks={watchlistedStocks}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        toggleWatchlist={toggleWatchlist}
        stocks={stocks}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          liveStatus={liveStatus}
          fetchProgress={fetchProgress}
        />

        {/* Scrollable main area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          {/* Market Summary */}
          <section>
            <MarketSummary stats={marketStats} />
          </section>

          {/* Chart + Watchlist row */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              {isLoading ? (
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 h-80 flex items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <StockChart stock={selectedStock} isChartLoading={isChartLoading} />
              )}
            </div>
            <div>
              <Watchlist
                stocks={stocks}
                selectedStock={selectedStock}
                onSelect={setSelectedStock}
                onToggle={toggleWatchlist}
              />
            </div>
          </section>

          {/* Stock Cards / Table section */}
          <section>
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-slate-100 font-bold text-lg">
                  {activeFilter === 'all' ? 'All Stocks' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Stocks`}
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {filteredStocks.length} of {stocks.length} stocks
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Refresh indicator (cosmetic) */}
                <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors">
                  <FiRefreshCw className="text-sm" />
                </button>

                {/* View toggle */}
                <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setView('cards')}
                    className={clsx(
                      'p-1.5 rounded-lg transition-all',
                      view === 'cards'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <FiGrid className="text-base" />
                  </button>
                  <button
                    onClick={() => setView('table')}
                    className={clsx(
                      'p-1.5 rounded-lg transition-all',
                      view === 'table'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-500 hover:text-slate-300'
                    )}
                  >
                    <FiList className="text-base" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <CardLoader count={6} />
            ) : view === 'cards' ? (
              <AnimatePresence mode="popLayout">
                {filteredStocks.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {filteredStocks.map((stock) => (
                      <StockCard
                        key={stock.id}
                        stock={stock}
                        isSelected={selectedStock?.id === stock.id}
                        onSelect={setSelectedStock}
                        onToggle={toggleWatchlist}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
                      <FiGrid className="text-2xl text-slate-500" />
                    </div>
                    <h3 className="text-slate-300 font-semibold text-lg">No stocks found</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-xs">
                      Try adjusting your search query or selecting a different filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilter('all');
                      }}
                      className="mt-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-500/20 transition-colors"
                    >
                      Reset filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <StockTable
                stocks={filteredStocks}
                selectedStock={selectedStock}
                onSelect={setSelectedStock}
                onToggle={toggleWatchlist}
                sortConfig={sortConfig}
                onSort={handleSort}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
            )}
          </section>

          {/* Bottom spacing */}
          <div className="h-4" />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

// Refinement configuration - State 42
export function getRefinementState42() {
  return {
    revision: 42,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
