/**
 * Alpha Vantage API Service
 * Key: stored as env var or passed directly
 * Free tier: 25 requests/day, 1 request/second burst limit
 *
 * Strategy:
 *  - Cache all results in sessionStorage to preserve quota across re-renders
 *  - Fetch GLOBAL_QUOTE for all stocks on app load (sequentially, 1s apart)
 *  - Fetch TIME_SERIES_DAILY only for selected stock (on demand)
 *  - Graceful fallback to mock data if rate-limited or API unavailable
 */

const API_KEY = '72B7YRUSURIN0N3U';
const BASE_URL = 'https://www.alphavantage.co/query';

// Map our tickers to Alpha Vantage BSE symbols
export const AV_SYMBOL_MAP = {
  IRFC: 'IRFC.BSE',
  IREDA: 'IREDA.BSE',
  RELIANCE: 'RELIANCE.BSE',
  TCS: 'TCS.BSE',
  INFY: 'INFY.BSE',
  HDFCBANK: 'HDFCBANK.BSE',
  SBIN: 'SBIN.BSE',
  TATAMOTORS: 'TATAMOTORS.BSE',
  BEL: 'BEL.BSE',
  HAL: 'HAL.BSE',
  NHPC: 'NHPC.BSE',
  RVNL: 'RVNL.BSE',
  BHEL: 'BHEL.BSE',
  NTPC: 'NTPC.BSE',
  POWERGRID: 'POWERGRID.BSE',
};

/** Session cache helpers */
const cacheGet = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    // Cache valid for 5 minutes
    if (Date.now() - ts < 5 * 60 * 1000) return data;
    sessionStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
};

const cacheSet = (key, data) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // sessionStorage full — ignore
  }
};

/** Sleep helper for rate limiting */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch GLOBAL_QUOTE for a single ticker
 * Returns parsed quote object or null on failure
 */
export const fetchGlobalQuote = async (ticker) => {
  const cacheKey = `av_quote_${ticker}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const symbol = AV_SYMBOL_MAP[ticker];
  if (!symbol) return null;

  try {
    const res = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    const json = await res.json();

    // Rate-limited or error
    if (json.Information || json.Note || !json['Global Quote']) return null;

    const q = json['Global Quote'];
    if (!q['05. price']) return null;

    const parsed = {
      currentPrice: parseFloat(q['05. price']),
      previousClose: parseFloat(q['08. previous close']),
      dayChange: parseFloat(q['09. change']),
      dayChangePercent: parseFloat(q['10. change percent'].replace('%', '')),
      volume: formatVolume(parseInt(q['06. volume'])),
      lastTradeDate: q['07. latest trading day'],
      open: parseFloat(q['03. high']),
      high: parseFloat(q['03. high']),
      low: parseFloat(q['04. low']),
    };

    cacheSet(cacheKey, parsed);
    return parsed;
  } catch {
    return null;
  }
};

/**
 * Fetch TIME_SERIES_DAILY for a ticker — returns last 30 days as chartData
 * Returns null on failure/rate-limit
 */
export const fetchDailySeries = async (ticker) => {
  const cacheKey = `av_daily_${ticker}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const symbol = AV_SYMBOL_MAP[ticker];
  if (!symbol) return null;

  try {
    const res = await fetch(
      `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`
    );
    const json = await res.json();

    if (json.Information || json.Note || !json['Time Series (Daily)']) return null;

    const series = json['Time Series (Daily)'];
    const entries = Object.entries(series)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30); // last 30 trading days

    const chartData = entries.map(([date, values]) => ({
      date: new Date(date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      }),
      price: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));

    cacheSet(cacheKey, chartData);
    return chartData;
  } catch {
    return null;
  }
};

/**
 * Batch fetch quotes for all stocks
 * Fetches sequentially with 1.1s delay to respect 1 req/sec limit
 * Stops early if rate limit is hit (preserves daily quota)
 */
export const fetchAllQuotes = async (tickers, onProgress) => {
  const results = {};
  let rateLimited = false;

  for (let i = 0; i < tickers.length; i++) {
    if (rateLimited) break;

    const ticker = tickers[i];
    const cacheKey = `av_quote_${ticker}`;
    const cached = cacheGet(cacheKey);

    if (cached) {
      results[ticker] = cached;
      onProgress?.(i + 1, tickers.length, ticker, true);
      continue;
    }

    const symbol = AV_SYMBOL_MAP[ticker];
    if (!symbol) continue;

    try {
      const res = await fetch(
        `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
      );
      const json = await res.json();

      if (json.Information || json.Note) {
        // Rate limited — stop fetching to preserve quota
        rateLimited = true;
        onProgress?.(i + 1, tickers.length, ticker, false, true);
        break;
      }

      const q = json['Global Quote'];
      if (q && q['05. price']) {
        const parsed = {
          currentPrice: parseFloat(q['05. price']),
          previousClose: parseFloat(q['08. previous close']),
          dayChange: parseFloat(q['09. change']),
          dayChangePercent: parseFloat(q['10. change percent'].replace('%', '')),
          volume: formatVolume(parseInt(q['06. volume'])),
          lastTradeDate: q['07. latest trading day'],
          high: parseFloat(q['03. high']),
          low: parseFloat(q['04. low']),
        };
        results[ticker] = parsed;
        cacheSet(cacheKey, parsed);
      }

      onProgress?.(i + 1, tickers.length, ticker, false, false);
    } catch {
      // Network error — skip this ticker
      onProgress?.(i + 1, tickers.length, ticker, false, false);
    }

    // Rate limit: wait 1.1s between requests (free tier = 1 req/sec)
    if (i < tickers.length - 1) {
      await sleep(1100);
    }
  }

  return { results, rateLimited };
};

/** Format large volume numbers */
const formatVolume = (vol) => {
  if (vol >= 10_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return String(vol);
};

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

// Refinement configuration - State 139
export function getRefinementState139() {
  return {
    revision: 139,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
