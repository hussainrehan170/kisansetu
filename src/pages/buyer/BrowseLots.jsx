import React, { useState, useEffect } from 'react';
import { getLots, placeBid } from '../../api';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';

const MOCK_LOTS = [
  { id: 3, crop_name: 'Tomato', hindi_name: 'टमाटर', grade: 'FAQ', quantity_kg: 3000, expected_price_per_quintal: 1100, district: 'Pune', village: 'Uruli Kanchan', created_at: new Date().toISOString() },
  { id: 4, crop_name: 'Onion', hindi_name: 'प्याज़', grade: 'GRADE_A', quantity_kg: 8000, expected_price_per_quintal: 750, district: 'Nashik', village: 'Lasalgaon', created_at: new Date().toISOString() },
  { id: 5, crop_name: 'Potato', hindi_name: 'आलू', grade: 'FAQ', quantity_kg: 4000, expected_price_per_quintal: 600, district: 'Pune', village: 'Khed', created_at: new Date().toISOString() },
  { id: 6, crop_name: 'Soybean', hindi_name: 'सोयाबीन', grade: 'GRADE_B', quantity_kg: 2500, expected_price_per_quintal: 4200, district: 'Aurangabad', village: 'Phulambri', created_at: new Date().toISOString() },
  { id: 7, crop_name: 'Cotton', hindi_name: 'कपास', grade: 'GRADE_A', quantity_kg: 10000, expected_price_per_quintal: 6500, district: 'Nagpur', village: 'Katol', created_at: new Date().toISOString() },
  { id: 8, crop_name: 'Wheat', hindi_name: 'गेहूं', grade: 'FAQ', quantity_kg: 6000, expected_price_per_quintal: 2200, district: 'Solapur', village: 'Barshi', created_at: new Date().toISOString() },
];

const GRADE_COLORS = {
  FAQ: 'bg-profit/10 text-profit border-profit/20',
  GRADE_A: 'bg-logistics/10 text-logistics border-logistics/20',
  GRADE_B: 'bg-amber-50 text-amber-700 border-amber-200',
  REJECT: 'bg-red-50 text-red-600 border-red-200',
};

const BrowseLots = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidModal, setBidModal] = useState(null);
  const [bidForm, setBidForm] = useState({ offered_price: '', quantity_kg: '', pickup_date: '', message: '' });
  const [bidLoading, setBidLoading] = useState(false);

  // Filters
  const [cropFilter, setCropFilter] = useState([]);
  const [gradeFilter, setGradeFilter] = useState([]);
  const [districtFilter, setDistrictFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minQty, setMinQty] = useState('');

  const uniqueCrops = [...new Set(MOCK_LOTS.map((l) => l.crop_name))];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getLots({ status: 'ACTIVE' });
        setLots(res.data || []);
      } catch {
        setLots(MOCK_LOTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleCrop = (crop) =>
    setCropFilter((prev) => prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]);

  const toggleGrade = (grade) =>
    setGradeFilter((prev) => prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]);

  const filtered = lots.filter((l) => {
    if (cropFilter.length && !cropFilter.includes(l.crop_name)) return false;
    if (gradeFilter.length && !gradeFilter.includes(l.grade)) return false;
    if (districtFilter && !l.district?.toLowerCase().includes(districtFilter.toLowerCase())) return false;
    if (maxPrice && l.expected_price_per_quintal > parseFloat(maxPrice)) return false;
    if (minQty && l.quantity_kg < parseFloat(minQty)) return false;
    return true;
  });

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

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-primary mb-6">Browse Lots</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h2 className="font-bold text-gray-800 mb-4">Filters</h2>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Crop</p>
              {uniqueCrops.map((crop) => (
                <label key={crop} className="flex items-center gap-2 mb-1 cursor-pointer">
                  <input type="checkbox" checked={cropFilter.includes(crop)} onChange={() => toggleCrop(crop)} className="accent-primary" />
                  <span className="text-sm text-gray-700">{crop}</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Grade</p>
              {['FAQ', 'GRADE_A', 'GRADE_B'].map((g) => (
                <label key={g} className="flex items-center gap-2 mb-1 cursor-pointer">
                  <input type="checkbox" checked={gradeFilter.includes(g)} onChange={() => toggleGrade(g)} className="accent-primary" />
                  <span className="text-sm text-gray-700">{g.replace('GRADE_', 'Grade ')}</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">District</p>
              <input
                type="text"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                placeholder="e.g. Nashik"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Max Price (₹/q)</p>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Min Quantity (kg)</p>
              <input
                type="number"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>

            <button
              onClick={() => { setCropFilter([]); setGradeFilter([]); setDistrictFilter(''); setMaxPrice(''); setMinQty(''); }}
              className="w-full border border-gray-300 text-gray-600 py-1.5 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Lots Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <p className="text-gray-400 text-lg">No lots match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((lot) => (
                <div key={lot.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{lot.crop_name}</h3>
                      <p className="text-sm text-gray-400">{lot.hindi_name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${GRADE_COLORS[lot.grade] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {lot.grade?.replace('GRADE_', 'Grade ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div><p className="text-gray-400 text-xs">Quantity</p><p className="font-semibold">{lot.quantity_kg?.toLocaleString()} kg</p></div>
                    <div><p className="text-gray-400 text-xs">District</p><p className="font-semibold">{lot.district}</p></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Expected Price</p>
                      <p className="text-2xl font-bold text-primary">₹{lot.expected_price_per_quintal}<span className="text-sm font-normal text-gray-400">/q</span></p>
                    </div>
                    <button
                      onClick={() => handleOpenBid(lot)}
                      className="bg-accent text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                    >
                      Place Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Bid Modal */}
      {bidModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-bold text-lg">Place Bid</h2>
                <p className="text-sm text-gray-500">{bidModal.crop_name} · {bidModal.district}, {bidModal.village}</p>
              </div>
              <button onClick={() => setBidModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offered Price (₹/quintal) *</label>
                <input type="number" value={bidForm.offered_price} onChange={(e) => setBidForm((f) => ({ ...f, offered_price: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
                <input type="number" max={bidModal.quantity_kg} value={bidForm.quantity_kg} onChange={(e) => setBidForm((f) => ({ ...f, quantity_kg: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
                <p className="text-xs text-gray-400 mt-0.5">Max: {bidModal.quantity_kg?.toLocaleString()} kg</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                <input type="date" value={bidForm.pickup_date} onChange={(e) => setBidForm((f) => ({ ...f, pickup_date: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea rows={2} value={bidForm.message} onChange={(e) => setBidForm((f) => ({ ...f, message: e.target.value }))} placeholder="Any specific requirements..." className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              {bidForm.offered_price && bidForm.quantity_kg && (
                <div className="bg-profit/10 rounded-lg p-3 text-sm text-profit font-semibold">
                  Total Bid Value: ₹{((parseFloat(bidForm.quantity_kg) / 100) * parseFloat(bidForm.offered_price)).toLocaleString('en-IN')}
                </div>
              )}
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

export default BrowseLots;
