import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLots, getMyBids, getTransactions, getPriceSummary } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const StatCard = ({ label, value, icon, colorClass = 'text-primary' }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </div>
);

const MOCK_LOTS = [
  { id: 1, crop_name: 'Tomato', variety: 'Pune Red', grade: 'FAQ', quantity_kg: 2000, expected_price_per_quintal: 1200, status: 'ACTIVE', bids: [{ id: 1, buyer_name: 'FreshMart Agro', offered_price: 1150, quantity_kg: 2000, status: 'PENDING', buyer_verified: true }], created_at: new Date().toISOString() },
  { id: 2, crop_name: 'Onion', variety: 'Nasik Red', grade: 'GRADE_A', quantity_kg: 5000, expected_price_per_quintal: 800, status: 'MATCHED', bids: [], created_at: new Date().toISOString() },
];

const MOCK_TRANSACTIONS = [
  { id: 'TXN001', crop_name: 'Soybean', quantity_kg: 3000, total_value: 18000, buyer_name: 'AgroMart', payment_status: 'COMPLETED', created_at: '2024-12-01T10:00:00Z' },
];

const MOCK_SUMMARY = [
  { crop_name: 'Tomato', window: 'favourable', current_price: 1250, avg_price: 1100, recommendation: 'Good time to sell' },
  { crop_name: 'Onion', window: 'below_average', current_price: 750, avg_price: 850, recommendation: 'Consider cold storage' },
];

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lotsRes, txRes, sumRes] = await Promise.all([
          getLots(),
          getTransactions(),
          getPriceSummary(),
        ]);
        setLots(lotsRes.data || []);
        setTransactions(txRes.data || []);
        setSummary(sumRes.data || []);
      } catch {
        setLots(MOCK_LOTS);
        setTransactions(MOCK_TRANSACTIONS);
        setSummary(MOCK_SUMMARY);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeLots = lots.filter((l) => l.status === 'ACTIVE');
  const pendingBids = lots.reduce((acc, l) => acc + (l.bids?.filter(b => b.status === 'PENDING')?.length || 0), 0);
  const totalEarnings = transactions.filter(t => t.payment_status === 'COMPLETED').reduce((s, t) => s + (t.total_value || 0), 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm">Here's your farming dashboard overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Lots" value={lots.length} icon="📦" />
        <StatCard label="Active Lots" value={activeLots.length} icon="🌱" colorClass="text-accent" />
        <StatCard label="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} icon="💰" colorClass="text-profit" />
        <StatCard label="Pending Bids" value={pendingBids} icon="🤝" colorClass="text-logistics" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/farmer/lots/create" className="bg-accent text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2">
          + Create Lot
        </Link>
        <Link to="/prices" className="border border-primary text-primary px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-colors">
          📊 Market Prices
        </Link>
        <Link to="/farmer/logistics" className="border border-logistics text-logistics px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          🚚 Find Transport
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sale Window Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">🌡️ Sale Window Alerts</h2>
          {summary.length === 0 ? (
            <p className="text-gray-400 text-sm">No price data available</p>
          ) : (
            <div className="space-y-3">
              {summary.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 border ${
                    s.window === 'favourable' ? 'bg-profit/10 border-profit/30 text-profit' :
                    s.window === 'average' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">{s.crop_name}</p>
                    <span className="text-xs bg-white/50 rounded px-1">
                      {s.window === 'favourable' ? '✅ Sell Now' : s.window === 'average' ? '⚠️ Monitor' : '❌ Wait'}
                    </span>
                  </div>
                  <p className="text-xs mt-1">₹{s.current_price}/q · {s.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bids */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">🤝 Recent Bids on My Lots</h2>
          {lots.flatMap(l => (l.bids || []).map(b => ({ ...b, lot: l }))).length === 0 ? (
            <p className="text-gray-400 text-sm">No bids yet. Create a lot to start receiving bids.</p>
          ) : (
            <div className="space-y-3">
              {lots.flatMap(l => (l.bids || []).map(b => ({ ...b, lot: l }))).slice(0, 5).map((bid) => (
              <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{bid.lot.crop_name} · {bid.quantity_kg} kg</p>
                  <p className="text-xs text-gray-500">{bid.buyer_name} {bid.buyer_verified && <span className="text-profit">✓</span>}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">₹{bid.offered_price}/q</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    bid.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    bid.status === 'ACCEPTED' ? 'bg-profit/10 text-profit' :
                    'bg-gray-100 text-gray-500'
                  }`}>{bid.status}</span>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">📋 Recent Transactions</h2>
          <Link to="/transactions" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        {transactions.length === 0 ? (
          <p className="p-5 text-gray-400 text-sm">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{tx.crop_name} · {(tx.quantity_kg / 1000).toFixed(1)} MT</p>
                  <p className="text-xs text-gray-400">{tx.buyer_name} · {format(new Date(tx.created_at), 'dd MMM yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-profit">₹{tx.total_value?.toLocaleString('en-IN')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tx.payment_status === 'COMPLETED' ? 'bg-profit/10 text-profit' :
                    tx.payment_status === 'PARTIAL' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-600'
                  }`}>{tx.payment_status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FarmerDashboard;
