import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const features = [
  { icon: '📊', title: 'Real-time Market Prices', desc: 'Live mandi prices from 5 APMCs across Maharashtra. Make informed selling decisions.' },
  { icon: '🤝', title: 'Direct Lot Trading', desc: 'Create crop lots and receive bids directly from verified buyers. No middlemen.' },
  { icon: '🚚', title: 'Logistics Finder', desc: 'Connect with verified transporters and cold storage facilities near your farm.' },
  { icon: '💳', title: 'Secure Transactions', desc: 'Transparent payment tracking with digital contract generation.' },
  { icon: '⚖️', title: 'Dispute Resolution', desc: 'Fair dispute resolution with admin oversight for quality, weight, and payment issues.' },
];

const Landing = () => (
  <div className="min-h-screen bg-muted">
    <Navbar />
    {/* Hero */}
    <section className="bg-primary text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-3">🌾 KisanSetu</h1>
        <p className="text-amber-300 text-2xl font-semibold mb-6">किसान का डिजिटल मंडी</p>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          A transparent digital marketplace connecting farmers directly with verified buyers across Maharashtra.
          Real-time mandi prices, direct lot trading, integrated logistics — all in one platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login?role=farmer"
            className="bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            🧑🌾 Farmer Login
          </Link>
          <Link
            to="/login?role=buyer"
            className="bg-accent text-white font-bold px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors text-lg"
          >
            🏢 Buyer Login
          </Link>
        </div>
        <p className="mt-6 text-white/60 text-sm">New user? <Link to="/register" className="text-amber-300 underline">Register here</Link></p>
      </div>
    </section>

    {/* Stats bar */}
    <section className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
        {[['5', 'APMCs'], ['8', 'Crops'], ['3', 'Active Farmers'], ['Live', 'Prices']].map(([val, label]) => (
          <div key={label}>
            <p className="text-2xl font-bold text-primary">{val}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Feature cards */}
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-10">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-bold text-primary mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Quick access */}
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h3 className="text-xl font-bold text-primary mb-4">Explore Without Login</h3>
        <Link
          to="/prices"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-900 transition-colors"
        >
          📊 View Market Prices
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-primary text-white/60 text-sm text-center py-6 mt-8">
      <p>KisanSetu © 2024 · SIH Project ID: <strong className="text-white">SIH26132</strong></p>
      <p className="mt-1">Built for Smart India Hackathon 2024 · Ministry of Agriculture & Farmers Welfare</p>
    </footer>
  </div>
);

export default Landing;
