import React from 'react';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';

/**
 * App — root component with global toast provider
 */
const App = () => {
  return (
    <>
      <Dashboard />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
};

export default App;
