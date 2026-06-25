import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await api.get('/auth/me');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to restore session', error);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
