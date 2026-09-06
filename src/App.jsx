import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import CoverPage from './pages/CoverPage';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import MarketPrices from './pages/MarketPrices';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import MyLots from './pages/farmer/MyLots';
import CreateLot from './pages/farmer/CreateLot';
import LogisticsPage from './pages/farmer/LogisticsPage';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BrowseLots from './pages/buyer/BrowseLots';
import MyBids from './pages/buyer/MyBids';
import TransactionsPage from './pages/shared/TransactionsPage';
import DisputesPage from './pages/shared/DisputesPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const AppRoutes = () => (
  <Routes>
    {/* Animated Cover Page as the default entrance */}
    <Route path="/" element={<CoverPage />} />
    <Route path="/cover" element={<CoverPage />} />
    <Route path="/overview" element={<Landing />} />

    {/* Auth & Public Pages */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/prices" element={<MarketPrices />} />

    {/* Protected Farmer Routes */}
    <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={['farmer','fpo']}><FarmerDashboard /></ProtectedRoute>} />
    <Route path="/farmer/lots" element={<ProtectedRoute allowedRoles={['farmer','fpo']}><MyLots /></ProtectedRoute>} />
    <Route path="/farmer/lots/create" element={<ProtectedRoute allowedRoles={['farmer','fpo']}><CreateLot /></ProtectedRoute>} />
    <Route path="/farmer/logistics" element={<ProtectedRoute allowedRoles={['farmer','fpo']}><LogisticsPage /></ProtectedRoute>} />

    {/* Protected Buyer Routes */}
    <Route path="/buyer/dashboard" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
    <Route path="/buyer/lots" element={<ProtectedRoute allowedRoles={['buyer']}><BrowseLots /></ProtectedRoute>} />
    <Route path="/buyer/bids" element={<ProtectedRoute allowedRoles={['buyer']}><MyBids /></ProtectedRoute>} />

    {/* Protected Shared Ledger & Disputes */}
    <Route path="/transactions" element={<ProtectedRoute allowedRoles={['farmer','fpo','buyer']}><TransactionsPage /></ProtectedRoute>} />
    <Route path="/disputes" element={<ProtectedRoute allowedRoles={['farmer','fpo','buyer']}><DisputesPage /></ProtectedRoute>} />

    {/* Protected Admin Oversight */}
    <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
