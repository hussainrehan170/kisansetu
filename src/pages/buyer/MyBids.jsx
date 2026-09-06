import React, { useState, useEffect } from 'react';
import { getMyBids } from '../../api';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

const MOCK_BIDS = [
  { id: 10, lot_crop: 'Tomato', lot_district: 'Nashik', offered_price: 1150, quantity_kg: 2000, pickup_date: '2024-12-20', status: 'ACCEPTED', transaction_id: 'TXN001', created_at: new Date().toISOString() },
  { id: 11, lot_crop: 'Onion', lot_district: 'Pune', offered_price: 800, quantity_kg: 3000, pickup_date: '2024-12-22', status: 'PENDING', transaction_id: null, created_at: new Date().toISOString() },
  { id: 12, lot_crop: 'Potato', lot_district: 'Solapur', offered_price: 550, quantity_kg: 1000, pickup_date: '2024-12-25', status: 'COUNTERED', counter_price: 580, transaction_id: null, created_at: new Date().toISOString() },
  { id: 13, lot_crop: 'Soybean', lot_district: 'Aurangabad', offered_price: 4100, quantity_kg: 500, pickup_date: '2024-12-18', status: 'REJECTED', transaction_id: null, created_at: new Date().toISOString() },
];

const STATUS_STYLE = {
  PENDING: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-profit/10 text-profit',
  COUNTERED: 'bg-logistics/10 text-logistics',
  REJECTED: 'bg-gray-100 text-gray-500',
};

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyBids();
        setBids(res.data || []);
      } catch {
        setBids(MOCK_BIDS);
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
      <h1 className="text-2xl font-bold text-primary mb-6">My Bids</h1>
      {bids.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-400 text-lg">No bids placed yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-600 font-semibold">Lot</th>
                <th className="text-right px-5 py-3 text-gray-600 font-semibold">My Bid (₹/q)</th>
                <th className="text-right px-5 py-3 text-gray-600 font-semibold">Quantity</th>
                <th className="text-center px-5 py-3 text-gray-600 font-semibold">Pickup Date</th>
                <th className="text-center px-5 py-3 text-gray-600 font-semibold">Status</th>
                <th className="text-center px-5 py-3 text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium">{bid.lot_crop}</p>
                    <p className="text-xs text-gray-400">{bid.lot_district}</p>
                  </td>
                  <td className="text-right px-5 py-4">
                    <p className="font-bold text-accent">₹{bid.offered_price}</p>
                    {bid.status === 'COUNTERED' && bid.counter_price && (
                      <p className="text-xs text-logistics font-semibold">Counter: ₹{bid.counter_price}</p>
                    )}
                  </td>
                  <td className="text-right px-5 py-4 text-gray-700">{bid.quantity_kg?.toLocaleString()} kg</td>
                  <td className="text-center px-5 py-4 text-gray-600">{bid.pickup_date}</td>
                  <td className="text-center px-5 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_STYLE[bid.status] || 'bg-gray-100 text-gray-500'}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="text-center px-5 py-4">
                    {bid.status === 'ACCEPTED' && bid.transaction_id && (
                      <a href="/transactions" className="text-xs bg-profit text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700">
                        💳 Pay Now
                      </a>
                    )}
                    {bid.status === 'COUNTERED' && bid.counter_price && (
                      <button className="text-xs bg-logistics text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-700">
                        Accept ₹{bid.counter_price}/q
                      </button>
                    )}
                    {(bid.status === 'PENDING' || bid.status === 'REJECTED') && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default MyBids;
