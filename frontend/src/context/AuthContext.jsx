import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSelectFamily, setAutoSelectFamily] = useState(null);

  // Restore token & fetch user on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkUser();
    } else {
      setLoading(false);
    }
  }, []);

  const checkUser = async () => {
    try {
      const res = await api.get('/auth/me');
      const userData = res.data.user;
      const storedAccountType = localStorage.getItem('accountType') || 'admin';
      const storedFamilyId = localStorage.getItem('familyMemberId');

      setUser({ 
        ...userData, 
        accountType: storedAccountType,
        isAdmin: storedAccountType === 'admin',
        familyMemberId: storedFamilyId
      });

      if (storedAccountType === 'family' && storedFamilyId) {
        setAutoSelectFamily(storedFamilyId);
      }
    } catch (err) {
      console.error('User check failed:', err.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  //  register function
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const data = res.data.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('accountType', 'admin');
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser({ 
        _id: data._id, 
        name: data.name, 
        email: data.email, 
        mrNumber: data.mrNumber,
        accountType: 'admin',
        isAdmin: true 
      });

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  //  login function (email + password)
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('accountType', 'admin');
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser({ 
        _id: data._id, 
        name: data.name, 
        email: data.email, 
        mrNumber: data.mrNumber,
        accountType: 'admin',
        isAdmin: true
      });

      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Login with MR Number + Password
  const loginWithMR = async (mrNumber, password) => {
    try {
      const res = await api.post('/auth/login-mr', { mrNumber, password });
      const data = res.data.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('accountType', data.accountType || 'admin');
      if (data.familyMemberId) {
        localStorage.setItem('familyMemberId', data.familyMemberId);
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser({ 
        _id: data._id, 
        name: data.name, 
        email: data.email, 
        mrNumber: data.mrNumber,
        accountType: data.accountType || 'admin',
        isAdmin: (data.accountType || 'admin') === 'admin',
        familyMemberId: data.familyMemberId
      });

      // If family member logged in, auto-select them
      if (data.accountType === 'family' && data.familyMemberId) {
        setAutoSelectFamily(data.familyMemberId);
      }

      return { success: true, accountType: data.accountType, familyMemberId: data.familyMemberId };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  //  logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    localStorage.removeItem('familyMemberId');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setAutoSelectFamily(null);
  };

  const value = { 
    user, 
    setUser, 
    login, 
    loginWithMR,
    register,
    logout, 
    loading,
    autoSelectFamily,
    setAutoSelectFamily
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};