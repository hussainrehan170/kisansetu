import React, { useState, useEffect } from 'react';
import { getAdminDashboard, getAdminDisputes, updateDispute, getUnverifiedBuyers, verifyBuyer } from '../../api';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const MOCK_DASHBOARD = {
  total_farmers: 3,
  total_buyers_verified: 2,
  total_buyers_unverified: 1,
  active_lots: 5,
  completed_transactions: 8,
  total_trade_value: 284000,
  open_disputes: 2,
};

const MOCK_DISPUTES = [
  { id: 1, transaction_id: 'TXN001', raised_by: 'Ramesh Jadhav', category: 'SHORT_WEIGHT', description: 'Received 1850 kg instead of 2000 kg promised.', status: 'OPEN', created_at: '2024-12-15T10:00:00Z' },
  { id: 2, transaction_id: 'TXN003', raised_by: 'FreshMart Agro', category: 'QUALITY_MISMATCH', description: 'Quality of onions did not match Grade A as listed.', status: 'UNDER_REVIEW', created_at: '2024-12-12T10:00:00Z' },
];

const MOCK_UNVERIFIED = [
  { id: 10, name: 'AgroExport Ltd', gst_number: '27AAECA1234F1Z5', entity_type: 'Exporter', created_at: '2024-12-14T10:00:00Z' },
];

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [unverified, setUnverified] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolveModal, setResolveModal] = useState(null);
  const [resolution, setResolution] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, dispRes, unbRes] = await Promise.all([
          getAdminDashboard(),
          getAdminDisputes(),
          getUnverifiedBuyers(),
        ]);
        setDashboard(dashRes.data);
        setDisputes(dispRes.data || []);
        setUnverified(unbRes.data || []);
      } catch {
        setDashboard(MOCK_DASHBOARD);
        setDisputes(MOCK_DISPUTES);
        setUnverified(MOCK_UNVERIFIED);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDisputeAction = async (id, status, res) => {
    setActionLoading(id);
    try {
      await updateDispute(id, { status, ...(res && { resolution: res }) });
      toast.success(`Dispute ${status.toLowerCase().replace('_', ' ')}!`);
      setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status } : d));
      setResolveModal(null);
      setResolution('');
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerify = async (id) => {
    setActionLoading(id);
    try {
      await verifyBuyer(id);
      toast.success('Buyer verified!');
      setUnverified((prev) => prev.filter((b) => b.id !== id));
      if (dashboard) setDashboard((d) => ({ ...d, total_buyers_verified: d.total_buyers_verified + 1, total_buyers_unverified: d.total_buyers_unverified - 1 }));
    } catch {
      toast.error('Verification failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Layout><div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></Layout>;
  }

  const stats = [
    { label: 'Total Farmers', value: dashboard?.total_farmers, icon: '🧑🌾', color: 'text-primary' },
    { label: 'Verified Buyers', value: dashboard?.total_buyers_verified, icon: '✅', color: 'text-profit' },
    { label: 'Unverified Buyers', value: dashboard?.total_buyers_unverified, icon: '⏳', color: 'text-accent' },
    { label: 'Active Lots', value: dashboard?.active_lots, icon: '📦', color: 'text-logistics' },
    { label: 'Completed Transactions', value: dashboard?.completed_transactions, icon: '💳', color: 'text-profit' },
    { label: 'Total Trade Value', value: `₹${dashboard?.total_trade_value?.toLocaleString('en-IN')}`, icon: '💰', color: 'text-primary' },
  ];

  const disputeStatusColors = { OPEN: 'bg-red-100 text-red-600', UNDER_REVIEW: 'bg-amber-100 text-amber-700', RESOLVED: 'bg-profit/10 text-profit' };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-primary mb-6">⚙️ Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">⚖️ Open Disputes</h2>
        </div>
        {disputes.length === 0 ? (
          <p className="p-5 text-gray-400 text-sm">No disputes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Txn</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Raised By</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Description</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-semibold">Status</th>
                  <th className="text-center px-4 py-3 text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">#{d.id}</td>
                    <td className="px-4 py-3 font-mono text-xs">{d.transaction_id}</td>
                    <td className="px-4 py-3">{d.raised_by}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{d.category?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="truncate">{d.description}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${disputeStatusColors[d.status] || 'bg-gray-100 text-gray-500'}`}>{d.status?.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {d.status === 'OPEN' && (
                          <button
                            onClick={() => handleDisputeAction(d.id, 'UNDER_REVIEW')}
                            disabled={actionLoading === d.id}
                            className="text-xs bg-amber-500 text-white px-2 py-1 rounded font-semibold hover:bg-amber-600 disabled:opacity-50"
                          >
                            Review
                          </button>
                        )}
                        {d.status !== 'RESOLVED' && (
                          <button
                            onClick={() => setResolveModal(d)}
                            className="text-xs bg-profit text-white px-2 py-1 rounded font-semibold hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Unverified Buyers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">🏢 Unverified Buyers</h2>
        </div>
        {unverified.length === 0 ? (
          <p className="p-5 text-gray-400 text-sm">All buyers verified. ✅</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {unverified.map((b) => (
              <div key={b.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{b.name}</p>
                  <p className="text-xs text-gray-500">GST: {b.gst_number} · {b.entity_type}</p>
                  <p className="text-xs text-gray-400">Registered: {format(new Date(b.created_at), 'dd MMM yyyy')}</p>
                </div>
                <button
                  onClick={() => handleVerify(b.id)}
                  disabled={actionLoading === b.id}
                  className="bg-profit text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading === b.id ? 'Verifying...' : '✓ Verify Buyer'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg mb-1">Resolve Dispute #{resolveModal.id}</h2>
            <p className="text-sm text-gray-500 mb-4">{resolveModal.category?.replace(/_/g, ' ')} · {resolveModal.raised_by}</p>
            <textarea
              rows={4}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter resolution details..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setResolveModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg">Cancel</button>
              <button
                onClick={() => handleDisputeAction(resolveModal.id, 'RESOLVED', resolution)}
                disabled={!resolution || actionLoading === resolveModal.id}
                className="flex-1 bg-profit text-white py-2.5 rounded-lg font-semibold disabled:opacity-60"
              >
                {actionLoading === resolveModal.id ? 'Resolving...' : 'Mark Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminDashboard;
