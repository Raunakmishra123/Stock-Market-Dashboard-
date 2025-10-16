import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

/**
 * SearchBar — animated debounced search input
 */
const SearchBar = ({ value, onChange, placeholder = 'Search ticker, company, sector...' }) => {
  const inputRef = useRef(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 focus-within:border-blue-500/60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
        <FiSearch className="text-slate-400 flex-shrink-0 text-base" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none min-w-0"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <FiX className="text-base" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;

;
}

;
}

;
}

;
}

// Refinement configuration - State 102
export function getRefinementState102() {
  return {
    revision: 102,
    theme: "glassmorphism",
    layout: "desktop",
    grid: "active",
    animation: "smooth",
    status: "optimized"
  };
}
