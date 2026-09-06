import React, { useState, useEffect } from 'react';
import { getMyDisputes } from '../../api';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const MOCK_DISPUTES = [
  { id: 1, category: 'SHORT_WEIGHT', description: 'Received 1850 kg instead of 2000 kg.', status: 'UNDER_REVIEW', created_at: '2024-12-15T10:00:00Z', resolution: null },
  { id: 2, category: 'QUALITY_MISMATCH', description: 'Onions were Grade B but lot was listed as Grade A.', status: 'RESOLVED', created_at: '2024-12-10T10:00:00Z', resolution: 'Price adjusted by ₹50/q. Both parties agreed.' },
];

const CATEGORY_COLORS = {
  SHORT_WEIGHT: 'bg-amber-100 text-amber-700',
  QUALITY_MISMATCH: 'bg-orange-100 text-orange-700',
  PAYMENT_DELAY: 'bg-red-100 text-red-600',
  LOGISTICS_DAMAGE: 'bg-purple-100 text-purple-700',
  OTHER: 'bg-gray-100 text-gray-600',
};

const STATUS_STYLE = {
  OPEN: 'bg-red-100 text-red-600',
  UNDER_REVIEW: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-profit/10 text-profit',
};

const DisputesPage = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyDisputes();
        setDisputes(res.data || []);
      } catch {
        setDisputes(MOCK_DISPUTES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <Layout><div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-primary mb-6">My Disputes</h1>
      {disputes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-500">No disputes filed. All transactions are clean!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${CATEGORY_COLORS[d.category] || 'bg-gray-100 text-gray-500'}`}>
                    {d.category?.replace(/_/g, ' ')}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${STATUS_STYLE[d.status] || 'bg-gray-100 text-gray-500'}`}>
                    {d.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{format(new Date(d.created_at), 'dd MMM yyyy')}</p>
              </div>
              <p className="text-sm text-gray-700 mb-2">{d.description}</p>
              {d.status === 'RESOLVED' && d.resolution && (
                <div className="bg-profit/10 border border-profit/30 rounded-lg p-3 text-sm text-profit">
                  <span className="font-semibold">Resolution: </span>{d.resolution}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default DisputesPage;
