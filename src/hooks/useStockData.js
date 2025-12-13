import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { stocks as initialStocks } from '../data/stocks';
import { fetchAllQuotes, fetchDailySeries } from '../services/alphaVantage';
import toast from 'react-hot-toast';

/**
 * useStockData — custom hook for all stock data management
 *
 * Live data strategy:
 *  1. Load immediately with mock data (fast, zero wait)
 *  2. Fetch live quotes from Alpha Vantage in background (sequential, rate-safe)
 *  3. Merge live data over mock data as each quote arrives
 *  4. Fetch live chart data for selected stock on demand
 *  5. Graceful fallback: if rate-limited, keep mock data with a notice
 */
const useStockData = () => {
  const [stocks, setStocks] = useState(initialStocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedStock, setSelectedStock] = useState(initialStocks[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Live data fetch state
  const [liveStatus, setLiveStatus] = useState('idle'); // 'idle' | 'fetching' | 'live' | 'limited' | 'mock'
  const [fetchProgress, setFetchProgress] = useState({ done: 0, total: 15, current: '' });
  const [isChartLoading, setIsChartLoading] = useState(false);
  const fetchedRef = useRef(false);

  // ── Initial skeleton loader (show UI immediately) ──────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Batch live quote fetch on mount ───────────────────────────────────
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const tickers = initialStocks.map((s) => s.ticker);
    setLiveStatus('fetching');

    const toastId = toast.loading('Fetching live prices…', {
      style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' },
    });

    fetchAllQuotes(tickers, (done, total, ticker, fromCache, rateLimited) => {
      setFetchProgress({ done, total, current: ticker });

      if (rateLimited) {
        toast.error('API rate limit reached — showing cached/mock data', {
          id: toastId,
          style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' },
          duration: 5000,
        });
        setLiveStatus('limited');
        return;
      }

      // Merge live quote into stocks state as each one arrives
      setStocks((prev) =>
        prev.map((s) => {
          if (s.ticker !== ticker) return s;
          // Will be updated once results come back
          return s;
        })
      );
    }).then(({ results, rateLimited }) => {
      if (!rateLimited) {
        toast.success(
          `Live prices loaded for ${Object.keys(results).length} stocks`,
          {
            id: toastId,
            style: { background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' },
            duration: 3000,
          }
        );
        setLiveStatus(Object.keys(results).length > 0 ? 'live' : 'mock');
      }

      // Merge all fetched results into stocks
      if (Object.keys(results).length > 0) {
        setStocks((prev) =>
          prev.map((stock) => {
            const live = results[stock.ticker];
            if (!live) return stock;
            return {
              ...stock,
              currentPrice: live.currentPrice,
              previousClose: live.previousClose,
              dayChange: live.dayChange,
              dayChangePercent: live.dayChangePercent,
              volume: live.volume,
              trend: live.dayChange >= 0 ? 'up' : 'down',
              lastUpdated: live.lastTradeDate,
            };
          })
        );

        // Also update selectedStock
        setSelectedStock((prev) => {
          if (!prev) return prev;
          const live = results[prev.ticker];
          if (!live) return prev;
          return {
            ...prev,
            currentPrice: live.currentPrice,
            previousClose: live.previousClose,
            dayChange: live.dayChange,
            dayChangePercent: live.dayChangePercent,
            volume: live.volume,
            trend: live.dayChange >= 0 ? 'up' : 'down',
            lastUpdated: live.lastTradeDate,
          };
        });
      }
    });
  }, []);

  // ── Fetch live chart data when selected stock changes ─────────────────
  useEffect(() => {
    if (!selectedStock) return;

    const fetchChart = async () => {
      setIsChartLoading(true);
      const chartData = await fetchDailySeries(selectedStock.ticker);
      setIsChartLoading(false);

      if (chartData && chartData.length > 0) {
        // Update selected stock's chart data
        setSelectedStock((prev) => ({ ...prev, chartData }));
        // Also update in main stocks list
        setStocks((prev) =>
          prev.map((s) =>
            s.ticker === selectedStock.ticker ? { ...s, chartData } : s
          )
        );
      }
    };

    fetchChart();
  }, [selectedStock?.ticker]); // Only re-run when ticker changes, not on every price update

  // ── Watchlist toggle ───────────────────────────────────────────────────
  const toggleWatchlist = useCallback((stockId) => {
    setStocks((prev) =>
      prev.map((s) => {
        if (s.id !== stockId) return s;
        const updated = { ...s, watchlisted: !s.watchlisted };
        toast(
          updated.watchlisted
            ? `✅ ${s.ticker} added to watchlist`
            : `❌ ${s.ticker} removed from watchlist`,
          {
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid #334155',
            },
          }
        );
        return updated;
      })
    );
  }, []);

  // ── Handle sort ───────────────────────────────────────────────────────
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // ── Handle stock selection (also update with live chart) ──────────────
  const handleSelectStock = useCallback((stock) => {
    setSelectedStock(stock);
  }, []);

  // ── Derived: filtered + sorted stock list ─────────────────────────────
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    switch (activeFilter) {
      case 'gainers':
        result = result.filter((s) => s.dayChange > 0);
        break;
      case 'losers':
        result = result.filter((s) => s.dayChange < 0);
        break;
      case 'buy':
        result = result.filter((s) => s.rating === 'Buy');
        break;
      case 'hold':
        result = result.filter((s) => s.rating === 'Hold');
        break;
      case 'watchlist':
        result = result.filter((s) => s.watchlisted);
        break;
      case 'PSU':
      case 'IT':
      case 'Banking':
        result = result.filter((s) => s.sector === activeFilter);
        break;
      default:
        break;
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal, bVal;
        switch (sortConfig.key) {
          case 'price':
            aVal = a.currentPrice;
            bVal = b.currentPrice;
            break;
          case 'change':
            aVal = a.dayChangePercent;
            bVal = b.dayChangePercent;
            break;
          case 'name':
            return sortConfig.direction === 'asc'
              ? a.ticker.localeCompare(b.ticker)
              : b.ticker.localeCompare(a.ticker);
          default:
            aVal = a.currentPrice;
            bVal = b.currentPrice;
        }
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return result;
  }, [stocks, searchQuery, activeFilter, sortConfig]);

  // ── Derived: watchlisted stocks ────────────────────────────────────────
  const watchlistedStocks = useMemo(
    () => stocks.filter((s) => s.watchlisted),
    [stocks]
  );

  // ── Derived: market summary KPIs ──────────────────────────────────────
  const marketStats = useMemo(() => {
    const gainers = stocks.filter((s) => s.dayChange > 0).length;
    const losers = stocks.filter((s) => s.dayChange < 0).length;
    const avgGrowth =
      stocks.reduce((acc, s) => acc + s.dayChangePercent, 0) / stocks.length;
    const portfolioValue = stocks
      .filter((s) => s.watchlisted)
      .reduce((acc, s) => acc + s.currentPrice * 10, 0);

    return {
      total: stocks.length,
      gainers,
      losers,
      avgGrowth: parseFloat(avgGrowth.toFixed(2)),
      portfolioValue: portfolioValue.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
      }),
    };
  }, [stocks]);

  return {
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
    setSelectedStock: handleSelectStock,
    toggleWatchlist,
    isLoading,
    liveStatus,
    fetchProgress,
    isChartLoading,
  };
};

export default useStockData;

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

// Refinement configuration - State 180
export function getRefinementState180() {
  return {
    revision: 180,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
