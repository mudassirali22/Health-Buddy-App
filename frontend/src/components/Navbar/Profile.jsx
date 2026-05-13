import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFamily } from '../../context/FamilyContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';
import { 
  Save, 
  Hash, 
  Copy, 
  Check,
  ShieldCheck,
  Lock,
  LogOut,
  ChevronRight,
  Loader2,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2
} from 'lucide-react';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const { selectedFamilyMember, updateFamilyMember } = useFamily();
    const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMR, setCopiedMR] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
  });

  const isPrimary = !selectedFamilyMember;
  const currentIdentity = selectedFamilyMember || user;

  useEffect(() => {
    if (currentIdentity) {
      setFormData({
        name: currentIdentity.name || '',
        email: currentIdentity.email || '',
        phoneNumber: currentIdentity.phoneNumber || '',
        age: currentIdentity.age || '',
        gender: currentIdentity.gender || '',
        bloodGroup: currentIdentity.bloodGroup || '',
        address: currentIdentity.address || '',
      });
    }
  }, [selectedFamilyMember, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = { ...formData };
      if (payload.age) payload.age = Number(payload.age);
      else payload.age = null;

      if (isPrimary) {
        const res = await api.put('/auth/update-profile', payload);
        setUser({ ...user, ...res.data.data, isAdmin: true, accountType: 'admin' });
              } else {
        const result = await updateFamilyMember(currentIdentity._id, payload);
        if (!result.success) throw new Error(result.error);
              }
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
          } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentIdentity) {
      setFormData({
        name: currentIdentity.name || '',
        email: currentIdentity.email || '',
        phoneNumber: currentIdentity.phoneNumber || '',
        age: currentIdentity.age || '',
        gender: currentIdentity.gender || '',
        bloodGroup: currentIdentity.bloodGroup || '',
        address: currentIdentity.address || '',
      });
    }
  };

  const copyMRNumber = () => {
    if (currentIdentity?.mrNumber) {
      navigator.clipboard.writeText(currentIdentity.mrNumber);
      setCopiedMR(true);
            setTimeout(() => setCopiedMR(false), 2000);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/auth');
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none";
  const viewClass = "w-full bg-gray-50 rounded-lg px-4 py-2 text-sm font-bold text-gray-800 border border-transparent min-h-[38px] flex items-center";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-15 h-15 bg-emerald-600 rounded-xl flex items-center justify-center text-3xl font-black text-white shadow-md">
            {currentIdentity?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">{currentIdentity?.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                {isPrimary ? 'Primary Account' : `Family Member · ${selectedFamilyMember?.relation || ''}`}
              </span>
              <button onClick={copyMRNumber} className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 px-2 py-0.5 rounded transition-colors">
                <Hash size={10} /> {currentIdentity?.mrNumber}
                {copiedMR ? <Check size={10} /> : <Copy size={10} className="text-gray-300" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
              </button>
              <button onClick={handleCancel} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-lg font-bold transition-all">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2">
              <User size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} /> : <div className={viewClass}>{formData.name}</div>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} /> : <div className={viewClass}>{formData.email}</div>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                {isEditing ? <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="0300-1234567" /> : <div className={viewClass}>{formData.phoneNumber || 'Not specified'}</div>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                {isEditing ? <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} /> : <div className={viewClass}>{formData.age ? `${formData.age} yrs` : 'Not specified'}</div>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                {isEditing ? (
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : <div className={viewClass}>{formData.gender || 'Not specified'}</div>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Group</label>
                {isEditing ? (
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClass}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                ) : <div className={viewClass}>{formData.bloodGroup || 'Not specified'}</div>}
              </div>
            </div>
            <div className="mt-6 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Residential Address</label>
              {isEditing ? <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} /> : <div className={viewClass}>{formData.address || 'Not specified'}</div>}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4 mb-4">Account Security</h2>
            <div className="space-y-2">
              <button onClick={() => navigate('/change-password')} className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-all group">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-gray-400 group-hover:text-emerald-600" />
                  <span className="text-xs font-bold text-gray-700">Change Password</span>
                </div>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-all group">
                <div className="flex items-center gap-3">
                  <LogOut size={16} className="text-red-500" />
                  <span className="text-xs font-bold text-red-600">Logout</span>
                </div>
                <ChevronRight size={14} className="text-red-300" />
              </button>
            </div>
          </div>

          <div className="bg-emerald-600 rounded-xl p-6 text-white shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={20} />
              <h3 className="font-black text-xs uppercase tracking-widest">Verified Account</h3>
            </div>
            <p className="text-[10px] font-bold text-emerald-100 leading-relaxed">
              Your profile is secured and verified by HealthBuddy. Your data is encrypted and private.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showLogoutModal}
        title="Sign Out"
        message="Are you sure you want to exit?"
        confirmText="Sign Out"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
        type="logout"
      />
    </div>
  );
};

export default Profile;
