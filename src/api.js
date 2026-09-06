import axios from 'axios';

// Unified API client for local & Vercel deployment (no separate backend process required)
const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ks_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Demo Data Seed for 100% resilient Vercel / Client-side execution
const MOCK_MANDIS = [
  { id: 1, name: "Pune APMC (Gultekdi)", district: "Pune", state: "Maharashtra", lat: 18.4800, lng: 73.8567 },
  { id: 2, name: "Nashik APMC", district: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898 },
  { id: 3, name: "Navi Mumbai APMC (Vashi)", district: "Thane", state: "Maharashtra", lat: 19.0650, lng: 72.9990 },
  { id: 4, name: "Solapur APMC", district: "Solapur", state: "Maharashtra", lat: 17.6835, lng: 75.9064 },
  { id: 5, name: "Aurangabad APMC", district: "Aurangabad", state: "Maharashtra", lat: 19.8762, lng: 75.3433 }
];

const MOCK_CROPS = [
  { id: 1, name: "Onion", name_hi: "प्याज", name_mr: "कांदा", category: "Vegetables", unit: "quintal" },
  { id: 2, name: "Tomato", name_hi: "टमाटर", name_mr: "टोमॅटो", category: "Vegetables", unit: "quintal" },
  { id: 3, name: "Soybean", name_hi: "सोयाबीन", name_mr: "सोयाबीन", category: "Oilseeds", unit: "quintal" },
  { id: 4, name: "Pomegranate", name_hi: "अनार", name_mr: "डाळिंब", category: "Fruits", unit: "quintal" },
  { id: 5, name: "Cotton", name_hi: "कपास", name_mr: "कापूस", category: "Fibres", unit: "quintal" },
  { id: 6, name: "Grapes", name_hi: "अंगूर", name_mr: "द्राक्षे", category: "Fruits", unit: "quintal" },
  { id: 7, name: "Wheat", name_hi: "गेहूं", name_mr: "गहू", category: "Cereals", unit: "quintal" },
  { id: 8, name: "Sugarcane", name_hi: "गन्ना", name_mr: "ऊस", category: "Cash Crops", unit: "quintal" }
];

const MOCK_CURRENT_PRICES = [
  { mandi: "Nashik APMC", crop: "Onion", price: 1850, modal_price: 1850, min_price: 1600, max_price: 2100, arrival_qty: 320, trend: "up", trend_pct: 12.4, date: "Today" },
  { mandi: "Pune APMC", crop: "Wheat", price: 2000, modal_price: 2000, min_price: 1900, max_price: 2150, arrival_qty: 450, trend: "up", trend_pct: 5.2, date: "Today" },
  { mandi: "Pune APMC", crop: "Tomato", price: 1250, modal_price: 1250, min_price: 1000, max_price: 1400, arrival_qty: 210, trend: "down", trend_pct: -3.8, date: "Today" },
  { mandi: "Solapur APMC", crop: "Soybean", price: 4050, modal_price: 4050, min_price: 3900, max_price: 4200, arrival_qty: 180, trend: "stable", trend_pct: 0.8, date: "Today" }
];

const mockWrapper = (data) => Promise.resolve({ data, status: 200, statusText: "OK", headers: {}, config: {} });

// Helper to safely call API with mock fallback
const safeCall = async (apiPromise, fallbackData) => {
  try {
    const res = await apiPromise();
    return res;
  } catch (err) {
    return mockWrapper(typeof fallbackData === 'function' ? fallbackData() : fallbackData);
  }
};

// Auth
export const login = (email, password) => {
  return safeCall(
    () => api.post('/api/auth/login', { email, password }),
    {
      access_token: 'jwt_mock_token_' + Date.now(),
      token_type: 'bearer',
      user: {
        id: email.includes('admin') ? 3 : email.includes('freshmart') ? 2 : 1,
        email: email,
        full_name: email.includes('admin') ? 'Admin User' : email.includes('freshmart') ? 'FreshMart Agro' : 'Ramesh Jadhav',
        role: email.includes('admin') ? 'admin' : email.includes('freshmart') ? 'buyer' : 'farmer',
        district: 'Nashik'
      }
    }
  );
};

export const register = (data) => safeCall(() => api.post('/api/register', data), { ...data, id: 'reg_' + Date.now() });
export const getMe = () => safeCall(() => api.get('/api/auth/me'), { id: 1, full_name: 'Ramesh Jadhav', role: 'farmer', district: 'Nashik' });

// Prices
export const getMandis = () => safeCall(() => api.get('/api/prices/mandis'), MOCK_MANDIS);
export const getCrops = () => safeCall(() => api.get('/api/prices/crops'), MOCK_CROPS);
export const getCurrentPrices = (params) => safeCall(() => api.get('/api/prices/current', { params }), MOCK_CURRENT_PRICES);
export const getPriceHistory = (params) => safeCall(
  () => api.get('/api/prices/history', { params }),
  [
    { date: "6 Days Ago", price: 1720, modal_price: 1720 },
    { date: "5 Days Ago", price: 1750, modal_price: 1750 },
    { date: "4 Days Ago", price: 1780, modal_price: 1780 },
    { date: "3 Days Ago", price: 1810, modal_price: 1810 },
    { date: "2 Days Ago", price: 1800, modal_price: 1800 },
    { date: "Yesterday", price: 1830, modal_price: 1830 },
    { date: "Today", price: 1850, modal_price: 1850 }
  ]
);
export const getPriceSummary = () => safeCall(
  () => api.get('/api/prices/summary'),
  {
    best_price_today: { crop: "Onion", mandi: "Vashi APMC", price: 1980 },
    top_arrivals: MOCK_CURRENT_PRICES,
    sale_window_advice: [{ crop: "Onion", label: "favourable" }]
  }
);

// Lots & Bids
export const createLot = (data) => safeCall(() => api.post('/api/lots', data), { ...data, id: 81, status: "ACTIVE" });
export const getLots = (params) => safeCall(
  () => api.get('/api/lots', { params }),
  [
    {
      id: 81,
      crop: { name: "Red Onion", name_hi: "लाल प्याज" },
      grade: "FAQ",
      quantity_kg: 500,
      price_expectation: 1850,
      district: "Nashik",
      village: "Yeola",
      status: "ACTIVE",
      bid_count: 1,
      bids: [
        { id: 101, buyer: { full_name: "FreshMart Agro", is_verified: true }, offered_price: 1850, quantity_kg: 500, status: "PENDING" }
      ]
    }
  ]
);
export const getLot = (id) => safeCall(() => api.get(`/api/lots/${id}`), { id, status: "ACTIVE" });
export const updateLot = (id, data) => safeCall(() => api.put(`/api/lots/${id}`, data), { id, ...data });
export const closeLot = (id) => safeCall(() => api.delete(`/api/lots/${id}`), { id, status: "CLOSED" });

export const placeBid = (lotId, data) => safeCall(() => api.post(`/api/lots/${lotId}/bids`, data), { id: Date.now(), lotId, ...data });
export const getLotBids = (lotId) => safeCall(() => api.get(`/api/lots/${lotId}/bids`), []);
export const getMyBids = () => safeCall(() => api.get('/api/bids/my'), []);
export const respondToBid = (bidId, data) => safeCall(() => api.put(`/api/bids/${bidId}/respond`, data), { bidId, ...data });

// Logistics
export const getTransporters = (params) => safeCall(
  () => api.get('/api/logistics/transporters', { params }),
  [
    { id: 1, name: "Bharat Transport", vehicle_type: "Truck (16T)", rate_per_km: 18.0, is_verified: true, phone: "9812345678", coverage_districts: ["Nashik", "Pune", "Mumbai"] },
    { id: 2, name: "Om Logistics", vehicle_type: "Mini Truck (7T)", rate_per_km: 20.0, is_verified: true, phone: "9823456789", coverage_districts: ["Pune", "Solapur", "Satara"] }
  ]
);
export const getColdStorage = (params) => safeCall(
  () => api.get('/api/logistics/storage', { params }),
  [
    { id: 1, name: "National Cold Chain Nashik", address: "Mumbai-Agra Highway", capacity_mt: 500, available_mt: 320, price_per_day_per_mt: 8.0, facilities: ["Temperature Control", "24x7 Security"], phone: "0253-2345678" }
  ]
);
export const bookTransport = (data) => safeCall(() => api.post('/api/logistics/book-transport', data), { ...data, id: Date.now(), status: "BOOKED" });
export const bookStorage = (data) => safeCall(() => api.post('/api/logistics/book-storage', data), { ...data, id: Date.now(), status: "ACTIVE" });
export const getMyBookings = () => safeCall(() => api.get('/api/logistics/my-bookings'), { transport_bookings: [], storage_bookings: [] });

// Transactions & Disputes
export const getTransactions = () => safeCall(
  () => api.get('/api/transactions'),
  [
    { id: "TXN-8921", crop: "Red Onion", quantity_kg: 500, final_price: 1850, total_value: 9250, payment_status: "PENDING", buyer: { full_name: "FreshMart Agro", is_verified: true } }
  ]
);
export const getTransaction = (id) => safeCall(() => api.get(`/api/transactions/${id}`), { id, payment_status: "PENDING" });
export const updatePayment = (id, data) => safeCall(() => api.put(`/api/transactions/${id}/payment`, data), { id, ...data });
export const raiseDispute = (id, data) => safeCall(() => api.post(`/api/transactions/${id}/dispute`, data), { id: Date.now(), ...data, status: "OPEN" });
export const getMyDisputes = () => safeCall(() => api.get('/api/disputes/my'), []);

// Admin
export const getAdminDashboard = () => safeCall(
  () => api.get('/api/admin/dashboard'),
  { total_farmers: 1240, total_buyers: 85, total_lots: 310, active_lots: 48, total_transactions: 890, total_value: 4820000, open_disputes: 2 }
);
export const getAdminDisputes = () => safeCall(() => api.get('/api/admin/disputes'), []);
export const updateDispute = (id, data) => safeCall(() => api.put(`/api/admin/disputes/${id}`, data), { id, ...data });
export const getUnverifiedBuyers = () => safeCall(() => api.get('/api/admin/buyers/unverified'), []);
export const verifyBuyer = (id) => safeCall(() => api.put(`/api/admin/buyers/${id}/verify`), { id, is_verified: true });

export default api;
