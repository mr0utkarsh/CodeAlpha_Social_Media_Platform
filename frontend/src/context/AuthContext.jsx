import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { demoData } from '../utils/demoData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDemo = api.isDemoMode;

  useEffect(() => {
    if (isDemo) {
      // In demo mode, check if user was "logged in" before
      const demoLoggedIn = localStorage.getItem('pulse_demo_user');
      if (demoLoggedIn) {
        setUser(demoData.currentUser);
      }
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('pulse_token');
    if (token) {
      api.setToken(token);
      api.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('pulse_token');
          api.setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isDemo]);

  const login = async (credentials) => {
    if (isDemo) {
      // Demo login - accept any credentials
      setUser(demoData.currentUser);
      localStorage.setItem('pulse_demo_user', 'true');
      return { user: demoData.currentUser, token: 'demo' };
    }
    const data = await api.login(credentials);
    api.setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    if (isDemo) {
      const newUser = { ...demoData.currentUser, ...userData, id: 'demo-user' };
      setUser(newUser);
      localStorage.setItem('pulse_demo_user', 'true');
      return { user: newUser, token: 'demo' };
    }
    const data = await api.register(userData);
    api.setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    localStorage.removeItem('pulse_demo_user');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, setUser, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
