# 📈 StockPulse — Professional Stock Market Dashboard

A beautiful, production-quality Stock Market Dashboard built with **React 18 + Vite**, inspired by TradingView, Groww, and Zerodha Kite.

![StockPulse Dashboard](./preview.png)

## ✨ Features

- **15 Indian Stocks** — IRFC, IREDA, RELIANCE, TCS, INFY, HDFCBANK, SBIN, TATAMOTORS, BEL, HAL, NHPC, RVNL, BHEL, NTPC, POWERGRID
- **Interactive Charts** — Area & Line charts with gradient fill, 30-day price history, custom tooltips
- **Smart Search** — Instant search by ticker, company name, or sector
- **Filter Pills** — All | Gainers | Losers | Buy | Hold | Watchlist | PSU | IT | Banking
- **Multi-Column Sort** — Sort by price, change %, name
- **Watchlist** — Add/remove stocks with toast notifications
- **Market Summary** — 5 animated KPI cards (Gainers, Losers, Avg Growth, Portfolio Value)
- **Skeleton Loaders** — Smooth loading experience
- **Dark Theme** — Professional dark UI with glassmorphism effects
- **Fully Responsive** — Desktop, tablet, and mobile layouts
- **Animated UI** — Framer Motion animations throughout

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Recharts | Charts |
| React Icons | Icon library |
| React Hot Toast | Notifications |
| clsx | Class merging utility |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or navigate to project directory
cd "Stock Market"

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/
├── components/
│   ├── Loader.jsx        # Skeleton loader + spinner
│   ├── MarketSummary.jsx # 5 KPI summary cards
│   ├── Navbar.jsx        # Top navigation bar
│   ├── PriceBadge.jsx    # Buy/Hold/Sell pill badges
│   ├── SearchBar.jsx     # Animated search input
│   ├── Sidebar.jsx       # Collapsible left sidebar + watchlist
│   ├── StockCard.jsx     # Glassmorphism stock card
│   ├── StockChart.jsx    # Full area/line chart + sparklines
│   ├── StockTable.jsx    # Sortable, filterable data table
│   └── Watchlist.jsx     # Standalone watchlist panel
├── data/
│   └── stocks.js         # 15 stock mock data with 30-day chart data
├── hooks/
│   └── useStockData.js   # Custom hook for all stock state
├── pages/
│   └── Dashboard.jsx     # Main dashboard page
├── App.jsx               # Root component
├── main.jsx              # Entry point
└── index.css             # Global styles + Tailwind
```

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#0F172A` |
| Cards | `#1E293B` |
| Green (gain) | `#22C55E` |
| Red (loss) | `#EF4444` |
| Blue (accent) | `#3B82F6` |
| Text | `#F8FAFC` |
| Muted | `#94A3B8` |

## 🔧 Key Features Explained

### `useStockData` Hook
Custom hook centralizing all data logic:
- `filteredStocks` — derived via useMemo (search + filter + sort)
- `marketStats` — derived KPIs (gainers, losers, avg change, portfolio value)
- `toggleWatchlist` — memoized callback with toast notification
- `handleSort` — toggle sort direction per column

### Chart System
- **SparklineChart** — tiny inline chart embedded in each StockCard
- **StockChart** — full feature chart with Area/Line toggle, 52-week range bar, custom tooltip, previous close reference line

### Responsive Layout
- **Desktop**: Fixed sidebar + main content scrolls
- **Mobile**: Sidebar becomes a slide-in drawer with backdrop overlay

---

Made with ❤️ — StockPulse Pro Dashboard


<!-- Final release verification -->


<!-- Verified release build -->


<!-- Verified release build -->


<!-- Verified release build -->
