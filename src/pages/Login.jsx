import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const roleRoute = (role) => {
  if (role === 'farmer' || role === 'fpo') return '/farmer/dashboard';
  if (role === 'buyer') return '/buyer/dashboard';
  if (role === 'admin') return '/admin';
  return '/';
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome, ${user.name}!`);
      navigate(roleRoute(user.role));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (em, pw) => {
    setEmail(em);
    setPassword(pw);
    setError('');
    setLoading(true);
    try {
      const user = await login(em, pw);
      toast.success(`Welcome, ${user.name}!`);
      navigate(roleRoute(user.role));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <span className="text-4xl">🌾</span>
            <h1 className="text-2xl font-bold text-primary mt-2">Login to KisanSetu</h1>
            <p className="text-gray-500 text-sm mt-1">किसान का डिजिटल मंडी</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-green-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="border rounded-lg p-4 bg-amber-50 mt-6">
            <p className="text-sm font-semibold text-amber-800 mb-3">🎯 Demo Credentials</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('ramesh@kisansetu.in', 'password123')}
                disabled={loading}
                className="w-full text-left bg-white border border-amber-200 text-amber-900 px-3 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors"
              >
                🧑🌾 Login as Farmer (Ramesh Jadhav)
              </button>
              <button
                onClick={() => quickLogin('freshmart@kisansetu.in', 'password123')}
                disabled={loading}
                className="w-full text-left bg-white border border-amber-200 text-amber-900 px-3 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors"
              >
                🏢 Login as Buyer (FreshMart Agro)
              </button>
              <button
                onClick={() => quickLogin('admin@kisansetu.in', 'admin123')}
                disabled={loading}
                className="w-full text-left bg-white border border-amber-200 text-amber-900 px-3 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors"
              >
                ⚙️ Login as Admin
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            New to KisanSetu?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
