import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Dashboard from './components/layout/dashboard';
import Inventory from './components/features/inventory/inventory';
import PricingChart from './components/features/pricing/pricing-chart';
import RoomStatus from './components/features/rooms/room-status';
import RevenueReport from './components/features/revenue/revenue-report';
import Forecasting from './components/features/forecasting/forecasting';
import './App.css';

/**
 * Main application component with routing to different dashboard sections
 */
const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Dashboard>
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/pricing" element={<PricingChart />} />
            <Route path="/room-status" element={<RoomStatus />} />
            <Route path="/revenue" element={<RevenueReport />} />
            <Route path="/forecasting" element={<Forecasting />} />
          </Routes>
        </Dashboard>
      </Box>
    </Router>
  );
};

export default App;
