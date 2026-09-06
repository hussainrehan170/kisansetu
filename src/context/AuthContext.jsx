import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const DEFAULT_FARMER = {
  id: 1,
  name: 'Ramesh Jadhav',
  full_name: 'Ramesh Jadhav',
  role: 'farmer',
  phone: '9876543210',
  district: 'Nashik',
  is_verified: true
};

const DEFAULT_BUYER = {
  id: 4,
  name: 'FreshMart Agro Pvt Ltd',
  full_name: 'FreshMart Agro Pvt Ltd',
  role: 'buyer',
  phone: '9876543213',
  district: 'Mumbai',
  is_verified: true,
  entity_type: 'Processor'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(DEFAULT_FARMER);
  const [token, setToken] = useState(localStorage.getItem('ks_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('ks_token');
      const savedReg = localStorage.getItem('krishisetu_registration');

      if (savedToken) {
        try {
          const res = await getMe();
          setUser(res.data);
          setToken(savedToken);
        } catch (e) {
          localStorage.removeItem('ks_token');
          setToken(null);
        }
      }

      if (savedReg) {
        try {
          const reg = JSON.parse(savedReg);
          if (reg && reg.fullName) {
            setUser({
              id: reg.id || 1,
              name: reg.fullName,
              full_name: reg.fullName,
              role: reg.role || 'farmer',
              phone: reg.phone || '9876543210',
              district: reg.villageDistrict || reg.location || 'Nashik',
              is_verified: true
            });
          }
        } catch (err) {}
      }

      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiLogin(email, password);
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('ks_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return newUser;
    } catch (err) {
      // Fallback demo logins if backend is offline
      if (email.includes('farmer') || email.includes('ramesh')) {
        setUser(DEFAULT_FARMER);
        return DEFAULT_FARMER;
      }
      if (email.includes('buyer') || email.includes('freshmart')) {
        setUser(DEFAULT_BUYER);
        return DEFAULT_BUYER;
      }
      throw err;
    }
  };

  const switchRole = (role) => {
    if (role === 'buyer') {
      setUser(DEFAULT_BUYER);
      toast.success('Switched to Buyer Mode (FreshMart Agro)');
    } else {
      setUser(DEFAULT_FARMER);
      toast.success('Switched to Farmer Mode (Ramesh Jadhav)');
    }
  };

  const logout = () => {
    localStorage.removeItem('ks_token');
    localStorage.removeItem('ks_lang');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
