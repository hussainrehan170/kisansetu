import React, { useState, useEffect } from 'react';
import { getTransactions, updatePayment, raiseDispute } from '../../api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const MOCK_TRANSACTIONS = [
  {
    id: 'TXN001', crop_name: 'Tomato', quantity_kg: 2000, final_price_per_quintal: 1150, total_value: 23000,
    buyer_name: 'FreshMart Agro', buyer_verified: true, farmer_district: 'Nashik',
    payment_status: 'PENDING', created_at: '2024-12-15T10:00:00Z',
    lot_details: { variety: 'Pune Red', grade: 'FAQ' },
    bid_details: { offered_price: 1150, pickup_date: '2024-12-20' },
  },
  {
    id: 'TXN002', crop_name: 'Onion', quantity_kg: 5000, final_price_per_quintal: 820, total_value: 41000,
    buyer_name: 'Metro Agro', buyer_verified: true, farmer_district: 'Nashik',
    payment_status: 'COMPLETED', created_at: '2024-12-10T10:00:00Z',
    lot_details: { variety: 'Nasik Red', grade: 'GRADE_A' },
    bid_details: { offered_price: 820, pickup_date: '2024-12-12' },
  },
];

const DISPUTE_CATEGORIES = [
  { value: 'SHORT_WEIGHT', label: 'Short Weight' },
  { value: 'QUALITY_MISMATCH', label: 'Quality Mismatch' },
  { value: 'PAYMENT_DELAY', label: 'Payment Delay' },
  { value: 'LOGISTICS_DAMAGE', label: 'Logistics Damage' },
  { value: 'OTHER', label: 'Other' },
];

const STATUS_STYLE = {
  PENDING: 'bg-red-100 text-red-600',
  PARTIAL: 'bg-amber-100 text-amber-700',
  COMPLETED: 'bg-profit/10 text-profit',
};

const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [disputeModal, setDisputeModal] = useState(null);
  const [disputeForm, setDisputeForm] = useState({ category: 'SHORT_WEIGHT', description: '' });
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [paymentRef, setPaymentRef] = useState({});
  const [payLoading, setPayLoading] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTransactions();
        setTransactions(res.data || []);
      } catch {
        setTransactions(MOCK_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleUpdatePayment = async (txId, status) => {
    setPayLoading(txId);
    try {
      await updatePayment(txId, { payment_status: status, payment_reference: paymentRef[txId] || '' });
      toast.success('Payment status updated!');
      setTransactions((prev) => prev.map((t) => t.id === txId ? { ...t, payment_status: status } : t));
    } catch {
      toast.error('Failed to update payment');
    } finally {
      setPayLoading(null);
    }
  };

  const handleDispute = async () => {
    if (!disputeForm.description) { toast.error('Please enter dispute description'); return; }
    setDisputeLoading(true);
    try {
      await raiseDispute(disputeModal.id, disputeForm);
      toast.success('Dispute raised successfully!');
      setDisputeModal(null);
      setDisputeForm({ category: 'SHORT_WEIGHT', description: '' });
    } catch {
      toast.error('Failed to raise dispute');
    } finally {
      setDisputeLoading(false);
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-primary mb-6">Transactions</h1>
      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center"><p className="text-gray-400 text-lg">No transactions yet.</p></div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Summary row */}
              <div
                className="p-5 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(expanded === tx.id ? null : tx.id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-400">#{tx.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[tx.payment_status] || 'bg-gray-100 text-gray-500'}`}>{tx.payment_status}</span>
                    </div>
                    <p className="font-bold text-gray-900">{tx.crop_name} · {(tx.quantity_kg / 1000).toFixed(1)} MT</p>
                    {user?.role === 'farmer' ? (
                      <p className="text-sm text-gray-500">{tx.buyer_name} {tx.buyer_verified && <span className="text-profit text-xs">✓ Verified</span>}</p>
                    ) : (
                      <p className="text-sm text-gray-500">Farmer District: {tx.farmer_district}</p>
                    )}
                    <p className="text-xs text-gray-400">{format(new Date(tx.created_at), 'dd MMM yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">₹{tx.final_price_per_quintal}/q</p>
                    <p className="text-2xl font-bold text-profit">₹{tx.total_value?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === tx.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-gray-400 text-xs">Grade</p><p className="font-semibold">{tx.lot_details?.grade?.replace('GRADE_', 'Grade ')}</p></div>
                    <div><p className="text-gray-400 text-xs">Variety</p><p className="font-semibold">{tx.lot_details?.variety}</p></div>
                    <div><p className="text-gray-400 text-xs">Pickup Date</p><p className="font-semibold">{tx.bid_details?.pickup_date}</p></div>
                    <div><p className="text-gray-400 text-xs">Bid Price</p><p className="font-semibold">₹{tx.bid_details?.offered_price}/q</p></div>
                  </div>

                  {/* Payment section — buyer only */}
                  {user?.role === 'buyer' && tx.payment_status !== 'COMPLETED' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <p className="font-semibold text-gray-800 mb-3">💳 Payment</p>
                      <input
                        type="text"
                        placeholder="Payment reference / UTR number"
                        value={paymentRef[tx.id] || ''}
                        onChange={(e) => setPaymentRef((p) => ({ ...p, [tx.id]: e.target.value }))}
                        className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePayment(tx.id, 'PARTIAL')}
                          disabled={payLoading === tx.id}
                          className="border border-amber-300 text-amber-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-50 disabled:opacity-50"
                        >
                          Mark Partial
                        </button>
                        <button
                          onClick={() => handleUpdatePayment(tx.id, 'COMPLETED')}
                          disabled={payLoading === tx.id}
                          className="bg-profit text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {/* PDF disabled */}}
                      title={tx.payment_status !== 'COMPLETED' ? 'PDF available after payment' : 'Download Contract'}
                      disabled={tx.payment_status !== 'COMPLETED'}
                      className="border border-gray-300 text-gray-500 px-4 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      📄 Download Contract
                    </button>
                    <button
                      onClick={() => setDisputeModal(tx)}
                      className="border border-red-300 text-red-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-50"
                    >
                      ⚖️ Raise Dispute
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dispute Modal */}
      {disputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-1">Raise Dispute</h2>
            <p className="text-sm text-gray-500 mb-4">Transaction #{disputeModal.id} · {disputeModal.crop_name}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={disputeForm.category}
                  onChange={(e) => setDisputeForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                >
                  {DISPUTE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={disputeForm.description}
                  onChange={(e) => setDisputeForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setDisputeModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg">Cancel</button>
              <button onClick={handleDispute} disabled={disputeLoading} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-semibold disabled:opacity-60">
                {disputeLoading ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default TransactionsPage;
