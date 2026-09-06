import React, { useState, useEffect } from 'react';
import { getTransporters, getColdStorage, bookTransport, bookStorage, getMyBookings, getLots } from '../../api';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';

const MOCK_TRANSPORTERS = [
  { id: 1, name: 'Ramkumar Transport', vehicle_type: 'Mini Truck (1T)', coverage_districts: ['Nashik', 'Pune', 'Aurangabad'], rate_per_km: 18, phone: '9876543210', verified: true },
  { id: 2, name: 'Shiva Logistics', vehicle_type: 'Medium Truck (5T)', coverage_districts: ['Nashik', 'Nagpur'], rate_per_km: 25, phone: '9123456789', verified: true },
  { id: 3, name: 'Green Carriers', vehicle_type: 'Large Truck (10T)', coverage_districts: ['Pune', 'Solapur', 'Kolhapur'], rate_per_km: 35, phone: '9988776655', verified: false },
];

const MOCK_STORAGE = [
  { id: 1, name: 'Nashik Cold Storage', district: 'Nashik', address: 'MIDC, Satpur, Nashik', capacity_mt: 500, available_mt: 120, price_per_day_per_mt: 8, facilities: ['Temperature Control', 'Humidity Control', '24/7 Security'], phone: '0253-2345678' },
  { id: 2, name: 'Maharashtra Cold Chain', district: 'Pune', address: 'Hadapsar Industrial Estate, Pune', capacity_mt: 1000, available_mt: 350, price_per_day_per_mt: 10, facilities: ['Temperature Control', 'Power Backup', 'CCTV'], phone: '020-26879000' },
];

const LogisticsPage = () => {
  const [tab, setTab] = useState('transport');
  const [districtFilter, setDistrictFilter] = useState('');
  const [transporters, setTransporters] = useState([]);
  const [storage, setStorage] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transportModal, setTransportModal] = useState(null);
  const [storageModal, setStorageModal] = useState(null);
  const [lots, setLots] = useState([]);

  // Transport booking form
  const [tForm, setTForm] = useState({ pickup_district: '', delivery_district: '', pickup_date: '', distance_km: '' });
  // Storage booking form
  const [sForm, setSForm] = useState({ lot_id: '', quantity_mt: '', start_date: '', end_date: '' });
  const [bookLoading, setBookLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, sRes, bRes, lRes] = await Promise.all([
          getTransporters(),
          getColdStorage(),
          getMyBookings(),
          getLots(),
        ]);
        setTransporters(tRes.data || []);
        setStorage(sRes.data || []);
        setBookings(bRes.data || {});
        setLots(lRes.data || []);
      } catch {
        setTransporters(MOCK_TRANSPORTERS);
        setStorage(MOCK_STORAGE);
        setBookings({ transport: [], storage: [] });
        setLots([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredTransporters = transporters.filter((t) =>
    !districtFilter || t.coverage_districts?.some((d) => d.toLowerCase().includes(districtFilter.toLowerCase()))
  );

  const filteredStorage = storage.filter((s) =>
    !districtFilter || s.district?.toLowerCase().includes(districtFilter.toLowerCase())
  );

  const handleBookTransport = async () => {
    if (!tForm.pickup_district || !tForm.delivery_district || !tForm.pickup_date || !tForm.distance_km) {
      toast.error('Please fill all fields'); return;
    }
    setBookLoading(true);
    try {
      await bookTransport({ transporter_id: transportModal.id, ...tForm });
      toast.success('Transport booked successfully!');
      setTransportModal(null);
      setTForm({ pickup_district: '', delivery_district: '', pickup_date: '', distance_km: '' });
    } catch {
      toast.error('Booking failed. Try again.');
    } finally {
      setBookLoading(false);
    }
  };

  const handleBookStorage = async () => {
    if (!sForm.lot_id || !sForm.quantity_mt || !sForm.start_date) {
      toast.error('Please fill all fields'); return;
    }
    setBookLoading(true);
    try {
      await bookStorage({ storage_id: storageModal.id, ...sForm });
      toast.success('Storage booked successfully!');
      setStorageModal(null);
      setSForm({ lot_id: '', quantity_mt: '', start_date: '', end_date: '' });
    } catch {
      toast.error('Booking failed. Try again.');
    } finally {
      setBookLoading(false);
    }
  };

  const storageCost = storageModal && sForm.quantity_mt && sForm.start_date && sForm.end_date
    ? Math.ceil((new Date(sForm.end_date) - new Date(sForm.start_date)) / 86400000) * parseFloat(sForm.quantity_mt) * storageModal.price_per_day_per_mt
    : null;

  if (loading) {
    return <Layout><div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-primary mb-6">Logistics</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('transport')} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${tab === 'transport' ? 'bg-logistics text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>🚚 Find Transport</button>
        <button onClick={() => setTab('storage')} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${tab === 'storage' ? 'bg-logistics text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>🏭 Find Storage</button>
      </div>

      {/* District filter */}
      <div className="mb-5">
        <input
          type="text"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          placeholder="Filter by district..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-logistics"
        />
      </div>

      {/* Transporters Tab */}
      {tab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {filteredTransporters.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{t.name}</h3>
                  {t.verified && <span className="text-profit text-xs font-semibold">✓ Verified</span>}
                </div>
                <span className="bg-logistics/10 text-logistics text-xs px-2 py-1 rounded-full">{t.vehicle_type}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {t.coverage_districts?.map((d) => (
                  <span key={d} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{d}</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-1">₹{t.rate_per_km}/km · 📞 {t.phone}</p>
              <button
                onClick={() => setTransportModal(t)}
                className="w-full mt-3 bg-accent text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600"
              >
                Book Transport
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Storage Tab */}
      {tab === 'storage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {filteredStorage.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{s.address}</p>
              <div className="flex gap-4 text-sm mb-3">
                <div><p className="text-gray-400 text-xs">Available</p><p className="font-bold text-profit">{s.available_mt} MT</p></div>
                <div><p className="text-gray-400 text-xs">Total Capacity</p><p className="font-semibold">{s.capacity_mt} MT</p></div>
                <div><p className="text-gray-400 text-xs">Rate</p><p className="font-bold text-accent">₹{s.price_per_day_per_mt}/MT/day</p></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {s.facilities?.map((f) => <span key={f} className="bg-blue-50 text-logistics text-xs px-2 py-0.5 rounded">{f}</span>)}
              </div>
              <p className="text-xs text-gray-400 mb-3">📞 {s.phone}</p>
              <button
                onClick={() => setStorageModal(s)}
                className="w-full bg-accent text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600"
              >
                Book Storage
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Bookings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-800 mb-4">My Bookings</h2>
        <p className="text-sm text-gray-400">No bookings yet. Book transport or storage above.</p>
      </div>

      {/* Transport Modal */}
      {transportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Book — {transportModal.name}</h2>
            <div className="space-y-3">
              {[['pickup_district', 'Pickup District', 'text'], ['delivery_district', 'Delivery District', 'text'], ['pickup_date', 'Pickup Date', 'date'], ['distance_km', 'Estimated Distance (km)', 'number']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={tForm[key]}
                    onChange={(e) => setTForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-logistics"
                  />
                </div>
              ))}
              {tForm.distance_km && (
                <div className="bg-logistics/10 rounded-lg p-3 text-sm text-logistics font-semibold">
                  Estimated Cost: ₹{(parseFloat(tForm.distance_km) * transportModal.rate_per_km).toLocaleString('en-IN')}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setTransportModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg">Cancel</button>
              <button onClick={handleBookTransport} disabled={bookLoading} className="flex-1 bg-accent text-white py-2 rounded-lg font-semibold disabled:opacity-60">
                {bookLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Storage Modal */}
      {storageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Book Storage — {storageModal.name}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Lot</label>
                <select
                  value={sForm.lot_id}
                  onChange={(e) => setSForm((f) => ({ ...f, lot_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-logistics"
                >
                  <option value="">Select lot...</option>
                  {lots.filter(l => l.status === 'MATCHED').map((l) => <option key={l.id} value={l.id}>{l.crop_name} · {l.quantity_kg} kg</option>)}
                  {lots.filter(l => l.status === 'MATCHED').length === 0 && <option disabled>No matched lots available</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (MT)</label>
                <input type="number" value={sForm.quantity_mt} onChange={(e) => setSForm((f) => ({ ...f, quantity_mt: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={sForm.start_date} onChange={(e) => setSForm((f) => ({ ...f, start_date: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={sForm.end_date} onChange={(e) => setSForm((f) => ({ ...f, end_date: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              {storageCost && (
                <div className="bg-logistics/10 rounded-lg p-3 text-sm text-logistics font-semibold">
                  Estimated Cost: ₹{storageCost.toLocaleString('en-IN')}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setStorageModal(null)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg">Cancel</button>
              <button onClick={handleBookStorage} disabled={bookLoading} className="flex-1 bg-accent text-white py-2 rounded-lg font-semibold disabled:opacity-60">
                {bookLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LogisticsPage;
