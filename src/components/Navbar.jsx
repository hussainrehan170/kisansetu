import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { KISAN_SETU_LOGO } from '../assets/logo';
import i18n from '../i18n';

const Navbar = () => {
  const { user, logout, switchRole, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('ks_lang', lang);
  };

  const handleRoleChange = (role) => {
    switchRole(role);
    if (role === 'farmer') {
      navigate('/farmer/dashboard');
    } else {
      navigate('/buyer/dashboard');
    }
  };

  const navLinks = [
    { to: '/prices', label: '📊 ' + (t('nav.prices') || 'Market Prices') },
    { to: '/farmer/dashboard', label: '🧑‍🌾 ' + (t('nav.farmer') || 'Farmer Portal') },
    { to: '/buyer/lots', label: '🏢 ' + (t('nav.browse') || 'Buyer Market') },
    { to: '/farmer/logistics', label: '🚚 ' + (t('nav.logistics') || 'Logistics') },
    { to: '/transactions', label: '⚖️ ' + (t('nav.transactions') || 'Transactions') },
  ];

  const activeLinkClass = ({ isActive }) =>
    `text-xs sm:text-sm font-semibold transition-all px-3 py-1.5 rounded-xl ${
      isActive
        ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
        : 'text-stone-200 hover:text-white hover:bg-white/10'
    }`;

  return (
    <nav className="bg-[#15803D] shadow-md sticky top-0 z-50 border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Official Logo & Branding */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl p-0.5 bg-white border border-emerald-200 shadow-xs flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={KISAN_SETU_LOGO} alt="KisanSetu Logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-black text-base tracking-tight leading-none">KISAN SETU</span>
              <span className="text-[9px] font-bold text-emerald-200 tracking-wider mt-0.5">जुड़ाव से समृद्धि</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={activeLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side: Role Selector + Language Switcher + Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher */}
            <select
              value={user?.role === 'buyer' ? 'buyer' : 'farmer'}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="text-xs font-bold bg-white text-stone-900 border border-emerald-300 rounded-xl px-2.5 py-1.5 focus:outline-none shadow-xs cursor-pointer"
            >
              <option value="farmer">🧑‍🌾 Ramesh (Farmer)</option>
              <option value="buyer">🏢 FreshMart (Buyer)</option>
            </select>

            {/* Language Toggle */}
            <div className="flex bg-emerald-900/40 p-0.5 rounded-xl border border-white/20">
              {['en', 'hi', 'mr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-black uppercase transition-all ${
                    (localStorage.getItem('ks_lang') || i18n.language || 'en').startsWith(lang)
                      ? 'bg-amber-400 text-stone-950 shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* User Profile / Logout */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-white hover:text-amber-200 transition-colors bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/20 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center text-stone-950 font-black text-xs">
                  {user?.role === 'buyer' ? '🏢' : '🧑‍🌾'}
                </div>
                <span className="text-xs font-bold truncate max-w-[100px]">{user?.name?.split(' ')[0]}</span>
                <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 z-50 border border-stone-100 animate-fade-in">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-black text-stone-900">{user?.name}</p>
                    <p className="text-[10px] font-bold text-emerald-700 capitalize mt-0.5">Role: {user?.role}</p>
                    <p className="text-[10px] text-stone-400">{user?.district || 'Sonipat / Nashik'}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); handleRoleChange(user?.role === 'buyer' ? 'farmer' : 'buyer'); }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Switch to {user?.role === 'buyer' ? 'Farmer Mode' : 'Buyer Mode'}
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border-t border-stone-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <select
              value={user?.role === 'buyer' ? 'buyer' : 'farmer'}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="text-[11px] font-bold bg-white text-stone-900 rounded-lg px-2 py-1"
            >
              <option value="farmer">🧑‍🌾 Farmer</option>
              <option value="buyer">🏢 Buyer</option>
            </select>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1 rounded-lg hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-emerald-900 border-t border-emerald-800 px-4 py-3 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-semibold text-white/90 hover:text-white py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-emerald-800">
            {['en', 'hi', 'mr'].map((lang) => (
              <button
                key={lang}
                onClick={() => { changeLanguage(lang); setMenuOpen(false); }}
                className="text-xs px-2.5 py-1 rounded bg-white/10 text-white font-bold uppercase"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
