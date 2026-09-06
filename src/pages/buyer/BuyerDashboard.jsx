import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLots, getMyBids, getTransactions } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { placeBid } from '../../api';
import { format } from 'date-fns';

const MOCK_LOTS = [
  { id: 3, crop_name: 'Tomato', hindi_name: 'टमाटर', grade: 'FAQ', quantity_kg: 3000, expected_price_per_quintal: 1100, district: 'Pune', village: 'Uruli Kanchan', created_at: new Date().toISOString() },
  { id: 4, crop_name: 'Onion', hindi_name: 'प्याज़', grade: 'GRADE_A', quantity_kg: 8000, expected_price_per_quintal: 750, district: 'Nashik', village: 'Lasalgaon', created_at: new Date().toISOString() },
  { id: 5, crop_name: 'Potato', hindi_name: 'आलू', grade: 'FAQ', quantity_kg: 4000, expected_price_per_quintal: 600, district: 'Pune', village: 'Khed', created_at: new Date().toISOString() },
  { id: 6, crop_name: 'Soybean', hindi_name: 'सोयाबीन', grade: 'GRADE_B', quantity_kg: 2500, expected_price_per_quintal: 4200, district: 'Aurangabad', village: 'Phulambri', created_at: new Date().toISOString() },
];

const MOCK_BIDS = [
  { id: 10, lot_crop: 'Tomato', lot_district: 'Nashik', offered_price: 1150, quantity_kg: 2000, status: 'ACCEPTED', created_at: new Date().toISOString() },
  { id: 11, lot_crop: 'Onion', lot_district: 'Pune', offered_price: 800, quantity_kg: 3000, status: 'PENDING', created_at: new Date().toISOString() },
];

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [lots, setLots] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidModal, setBidModal] = useState(null);
  const [bidForm, setBidForm] = useState({ offered_price: '', quantity_kg: '', pickup_date: '', message: '' });
  const [bidLoading, setBidLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [lotsRes, bidsRes, txRes] = await Promise.all([
          getLots({ status: 'ACTIVE', limit: 4 }),
          getMyBids(),
          getTransactions(),
        ]);
        setLots(lotsRes.data || []);
        setMyBids(bidsRes.data || []);
        setTransactions(txRes.data || []);
      } catch {
        setLots(MOCK_LOTS);
        setMyBids(MOCK_BIDS);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeBids = myBids.filter((b) => b.status === 'PENDING');
  const wonLots = transactions.filter((t) => t.payment_status === 'COMPLETED').length;
  const totalPurchased = transactions.reduce((s, t) => s + (t.total_value || 0), 0);
  const pendingPayments = transactions.filter((t) => t.payment_status === 'PENDING').length;

  const handleOpenBid = (lot) => {
    setBidModal(lot);
    setBidForm({ offered_price: lot.expected_price_per_quintal, quantity_kg: lot.quantity_kg, pickup_date: '', message: '' });
  };

  const handlePlaceBid = async () => {
    if (!bidForm.offered_price || !bidForm.quantity_kg || !bidForm.pickup_date) {
      toast.error('Please fill all required fields'); return;
    }
    setBidLoading(true);
    try {
      await placeBid(bidModal.id, bidForm);
      toast.success('Bid placed successfully!');
      setBidModal(null);
    } catch {
      toast.error('Failed to place bid');
    } finally {
      setBidLoading(false);
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></Layout>;
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm">Buyer Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">Active Bids</p><p className="text-2xl font-bold text-accent">{activeBids.length}</p></div>
        <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">Won Lots</p><p className="text-2xl font-bold text-profit">{wonLots}</p></div>
        <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">Total Purchased</p><p className="text-2xl font-bold text-primary">₹{totalPurchased.toLocaleString('en-IN')}</p></div>
        <div className="bg-white rounded-xl border p-5"><p className="text-sm text-gray-500">Pending Payments</p><p className="text-2xl font-bold text-red-500">{pendingPayments}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* New Lots */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800">🌾 New Lots Available</h2>
            <Link to="/buyer/lots" className="text-sm text-primary hover:underline">Browse all →</Link>
          </div>
          <div className="space-y-3">
            {lots.slice(0, 4).map((lot) => (
              <div key={lot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{lot.crop_name} · {lot.quantity_kg?.toLocaleString()} kg</p>
                  <p className="text-xs text-gray-500">{lot.district} · {lot.grade?.replace('GRADE_', 'Grade ')}</p>
                </div>
                <div className="text-right flex items-center gap-2">
                  <p className="font-bold text-primary">₹{lot.expected_price_per_quintal}/q</p>
                  <button onClick={() => handleOpenBid(lot)} className="bg-accent text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-amber-600">Bid</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">📋 Recent Bid Activity</h2>
          {myBids.length === 0 ? (
            <p className="text-gray-400 text-sm">No bids placed yet. Browse lots to start bidding.</p>
          ) : (
            <div className="space-y-3">
              {myBids.slice(0, 5).map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{bid.lot_crop} · {bid.lot_district}</p>
                    <p className="text-xs text-gray-500">{bid.quantity_kg?.toLocaleString()} kg</p>
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

      {/* Bid Modal */}
      {bidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-1">Place Bid</h2>
            <p className="text-sm text-gray-500 mb-4">{bidModal.crop_name} · {bidModal.district}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer (₹/quintal) *</label>
                <input type="number" value={bidForm.offered_price} onChange={(e) => setBidForm((f) => ({ ...f, offered_price: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
                <input type="number" max={bidModal.quantity_kg} value={bidForm.quantity_kg} onChange={(e) => setBidForm((f) => ({ ...f, quantity_kg: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                <input type="date" value={bidForm.pickup_date} onChange={(e) => setBidForm((f) => ({ ...f, pickup_date: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea rows={2} value={bidForm.message} onChange={(e) => setBidForm((f) => ({ ...f, message: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setBidModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg">Cancel</button>
              <button onClick={handlePlaceBid} disabled={bidLoading} className="flex-1 bg-accent text-white py-2.5 rounded-lg font-semibold disabled:opacity-60">
                {bidLoading ? 'Placing...' : 'Place Bid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BuyerDashboard;
