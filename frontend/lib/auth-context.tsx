"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from './api';
import { User, LoginRequest, SignupRequest, LoginResponse } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      const { token: newToken, ...userData } = response.data;

      setToken(newToken);
      setUser({
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify({
        id: userData.id,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      await axiosInstance.post('/auth/signup', data);
      // After signup, automatically login
      await login({ email: data.email, password: data.password });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
