import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLots, closeLot, respondToBid } from '../../api';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const MOCK_LOTS = [
  {
    id: 1, crop_name: 'Tomato', variety: 'Pune Red', grade: 'FAQ', quantity_kg: 2000,
    expected_price_per_quintal: 1200, status: 'ACTIVE', created_at: new Date().toISOString(),
    district: 'Nashik', village: 'Dindori',
    bids: [
      { id: 1, buyer_name: 'FreshMart Agro', buyer_verified: true, offered_price: 1150, quantity_kg: 2000, pickup_date: '2024-12-20', status: 'PENDING', message: 'Good quality needed' },
      { id: 2, buyer_name: 'AgroExport Ltd', buyer_verified: false, offered_price: 1100, quantity_kg: 1500, pickup_date: '2024-12-22', status: 'PENDING', message: '' },
    ],
  },
  {
    id: 2, crop_name: 'Onion', variety: 'Nasik Red', grade: 'GRADE_A', quantity_kg: 5000,
    expected_price_per_quintal: 800, status: 'MATCHED', created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    district: 'Nashik', village: 'Lasalgaon',
    bids: [{ id: 3, buyer_name: 'Metro Agro', buyer_verified: true, offered_price: 820, quantity_kg: 5000, pickup_date: '2024-12-18', status: 'ACCEPTED', message: '' }],
  },
];

const GRADE_COLORS = {
  FAQ: 'bg-profit/10 text-profit',
  GRADE_A: 'bg-logistics/10 text-logistics',
  GRADE_B: 'bg-amber-100 text-amber-700',
  REJECT: 'bg-red-100 text-red-700',
};

const STATUS_COLORS = {
  ACTIVE: 'bg-amber-100 text-amber-700',
  MATCHED: 'bg-logistics/10 text-logistics',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  SETTLED: 'bg-profit/10 text-profit',
  CLOSED: 'bg-gray-100 text-gray-500',
};

const MyLots = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLot, setExpandedLot] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [counterForms, setCounterForms] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getLots();
        setLots(res.data || []);
      } catch {
        setLots(MOCK_LOTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleClose = async (id) => {
    if (!window.confirm('Close this lot? Buyers will no longer be able to bid.')) return;
    try {
      await closeLot(id);
      setLots((prev) => prev.filter((l) => l.id !== id));
      toast.success('Lot closed.');
    } catch {
      toast.error('Failed to close lot');
    }
  };

  const handleBidAction = async (bidId, action, counter_price) => {
    setActionLoading(bidId);
    try {
      await respondToBid(bidId, { action, ...(counter_price && { counter_price }) });
      toast.success(`Bid ${action.toLowerCase()}ed!`);
      const res = await getLots();
      setLots(res.data || MOCK_LOTS);
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const statuses = ['ALL', 'ACTIVE', 'MATCHED', 'IN_TRANSIT', 'SETTLED', 'CLOSED'];
  const filtered = statusFilter === 'ALL' ? lots : lots.filter((l) => l.status === statusFilter);

  if (loading) {
    return <Layout><div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></Layout>;
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-primary">My Lots</h1>
        <Link to="/farmer/lots/create" className="bg-accent text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-600 inline-flex items-center gap-1">
          + Create Lot
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-lg mb-3">No lots found.</p>
          <Link to="/farmer/lots/create" className="bg-accent text-white px-5 py-2 rounded-lg font-semibold hover:bg-amber-600">Create your first lot</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lot) => (
            <div key={lot.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedLot(expandedLot === lot.id ? null : lot.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{lot.crop_name}</h3>
                      {lot.variety && <span className="text-sm text-gray-500">· {lot.variety}</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GRADE_COLORS[lot.grade] || 'bg-gray-100 text-gray-500'}`}>
                        {lot.grade?.replace('GRADE_', 'Grade ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{lot.district}, {lot.village} · {lot.quantity_kg?.toLocaleString()} kg · ₹{lot.expected_price_per_quintal}/q</p>
                    <p className="text-xs text-gray-400 mt-0.5">{format(new Date(lot.created_at), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {lot.bids?.length > 0 && (
                      <span className="bg-accent text-white text-xs px-2 py-1 rounded-full font-bold">{lot.bids.length} bid{lot.bids.length > 1 ? 's' : ''}</span>
                    )}
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[lot.status] || 'bg-gray-100 text-gray-500'}`}>
                      {lot.status?.replace('_', ' ')}
                    </span>
                    {lot.status === 'ACTIVE' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClose(lot.id); }}
                        className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Close
                      </button>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedLot === lot.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded bids */}
              {expandedLot === lot.id && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {lot.bids?.length === 0 ? (
                    <p className="p-4 text-sm text-gray-400">No bids yet on this lot.</p>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {lot.bids.map((bid) => (
                        <div key={bid.id} className="p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{bid.buyer_name}</p>
                                {bid.buyer_verified && <span className="text-profit text-xs font-bold">✓ Verified</span>}
                              </div>
                              <p className="text-sm text-gray-600 mt-0.5">{bid.quantity_kg?.toLocaleString()} kg · Pickup: {bid.pickup_date}</p>
                              {bid.message && <p className="text-xs text-gray-400 italic mt-0.5">"{bid.message}"</p>}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-accent text-lg">₹{bid.offered_price}/q</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                bid.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                bid.status === 'ACCEPTED' ? 'bg-profit/10 text-profit' :
                                bid.status === 'COUNTERED' ? 'bg-logistics/10 text-logistics' :
                                'bg-gray-100 text-gray-500'
                              }`}>{bid.status}</span>
                            </div>
                          </div>

                          {/* Actions for PENDING bids */}
                          {bid.status === 'PENDING' && (
                            <div className="mt-3 flex flex-wrap gap-2 items-start">
                              <button
                                onClick={() => handleBidAction(bid.id, 'ACCEPT')}
                                disabled={actionLoading === bid.id}
                                className="bg-profit text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                              >
                                ✓ Accept
                              </button>
                              <button
                                onClick={() => handleBidAction(bid.id, 'REJECT')}
                                disabled={actionLoading === bid.id}
                                className="border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-50 disabled:opacity-50"
                              >
                                ✗ Reject
                              </button>
                              <button
                                onClick={() => setCounterForms((f) => ({ ...f, [bid.id]: f[bid.id] === undefined ? '' : undefined }))}
                                className="border border-logistics text-logistics px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50"
                              >
                                ↔ Counter
                              </button>
                              {counterForms[bid.id] !== undefined && (
                                <div className="flex items-center gap-2 mt-1 w-full">
                                  <span className="text-sm text-gray-600">₹</span>
                                  <input
                                    type="number"
                                    value={counterForms[bid.id]}
                                    onChange={(e) => setCounterForms((f) => ({ ...f, [bid.id]: e.target.value }))}
                                    placeholder="Counter price/q"
                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-36 focus:ring-2 focus:ring-logistics"
                                  />
                                  <button
                                    onClick={() => handleBidAction(bid.id, 'COUNTER', counterForms[bid.id])}
                                    disabled={!counterForms[bid.id]}
                                    className="bg-logistics text-white px-3 py-1 rounded text-sm font-semibold disabled:opacity-50"
                                  >
                                    Send
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyLots;
