import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const FamilyContext = createContext();

export const FamilyProvider = ({ children }) => {
  const { user, autoSelectFamily, setAutoSelectFamily } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null); // null means Primary user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
    } else {
      setFamilyMembers([]);
      setSelectedFamilyMember(null);
      localStorage.removeItem('selectedFamilyMemberId');
      setLoading(false);
    }
  }, [user]);

  // Handle restoring selection once family members are loaded
  useEffect(() => {
    if (familyMembers.length > 0 && !selectedFamilyMember) {
      const savedMemberId = localStorage.getItem('selectedFamilyMemberId');
      if (savedMemberId && savedMemberId !== 'null') {
        const member = familyMembers.find(m => m._id === savedMemberId);
        if (member) {
          setSelectedFamilyMember(member);
        }
      }
    }
  }, [familyMembers]);

  // Auto-select family member after MR# login
  useEffect(() => {
    if (user?.accountType === 'family' && user?.familyMemberId) {
      // Force selection for family member login
      const member = familyMembers.find(m => m._id === user.familyMemberId);
      if (member) {
        setSelectedFamilyMember(member);
      }
    } else if (autoSelectFamily && familyMembers.length > 0) {
      const member = familyMembers.find(m => m._id === autoSelectFamily);
      if (member) {
        setSelectedFamilyMember(member);
        setAutoSelectFamily(null);
      }
    }
  }, [autoSelectFamily, familyMembers, user]);

  const fetchFamilyMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/family');
      setFamilyMembers(res.data.data);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFamilyMember = async (memberData) => {
    try {
      const res = await api.post('/family', memberData);
      setFamilyMembers(prev => [res.data.data, ...prev]);
      return { success: true, data: res.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add family member' };
    }
  };

  const updateFamilyMember = async (id, memberData) => {
    try {
      const config = memberData instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const res = await api.put(`/family/${id}`, memberData, config);
      setFamilyMembers(prev => prev.map(m => m._id === id ? res.data.data : m));
      if (selectedFamilyMember?._id === id) {
        setSelectedFamilyMember(res.data.data);
      }
      return { success: true, data: res.data.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update family member' };
    }
  };

  const deleteFamilyMember = async (id) => {
    try {
      await api.delete(`/family/${id}`);
      setFamilyMembers(prev => prev.filter(m => m._id !== id));
      if (selectedFamilyMember?._id === id) {
        setSelectedFamilyMember(null);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete family member' };
    }
  };

  const selectMember = (memberId) => {
    if (!memberId) {
      setSelectedFamilyMember(null);
      localStorage.setItem('selectedFamilyMemberId', 'null');
      return;
    }
    const member = familyMembers.find(m => m._id === memberId);
    if (member) {
      setSelectedFamilyMember(member);
      localStorage.setItem('selectedFamilyMemberId', memberId);
    }
  };

  return (
    <FamilyContext.Provider value={{
      familyMembers,
      selectedFamilyMember,
      loading,
      fetchFamilyMembers,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      selectMember
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
