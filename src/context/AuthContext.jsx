import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.status === 'success' && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (phone, password) => {
    try {
      const res = await api.post('/auth/login', { phone, password });
      if (res.data?.status === 'success') {
        if (res.data.token) {
          localStorage.setItem('aeromarine_token', res.data.token);
        }
        setUser(res.data.user);
        return res.data;
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      throw new Error(msg);
    }
  };

  const register = async ({ phone, password, inviteCode }) => {
    try {
      const res = await api.post('/auth/register', { phone, password, inviteCode });
      if (res.data?.status === 'success') {
        if (res.data.token) {
          localStorage.setItem('aeromarine_token', res.data.token);
        }
        setUser(res.data.user);
        return res.data;
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('aeromarine_token');
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet: user?.wallet || { availableBalance: 0, rechargeBalance: 0, totalIncome: 0, totalWithdrawn: 0 },
        bankAccount: user?.bankAccount || {},
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
