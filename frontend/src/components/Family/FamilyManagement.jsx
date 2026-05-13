import { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';
import api from '../../services/api';
import { 
  Plus, 
  User, 
  Trash2, 
  Edit2, 
  Shield, 
  UserPlus,
  Hash,
  Eye,
  EyeOff,
  KeyRound,
  ShieldAlert,
  X,
  Users,
  Send,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin
} from 'lucide-react';

const FamilyManagement = () => {
  const { familyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember, loading } = useFamily();
  const { user } = useAuth();
    const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: 'Other',
    age: '',
    gender: '',
    bloodGroup: '',
    phoneNumber: '',
    email: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const [sendingEmail, setSendingEmail] = useState({});
  const [emailInputs, setEmailInputs] = useState({});
  const [emailStatus, setEmailStatus] = useState({}); // { [memberId]: { success: bool, msg: string } }
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  const isAdmin = user?.isAdmin;

  const relations = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Sibling', 'Brother', 'Sister', 'Wife', 'Husband', 'Uncle', 'Aunt', 'Cousin', 'Guardian', 'Grandparent', 'Other'];
  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
           <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium">Only the Primary Account holder can manage family members.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all">
           Return to Dashboard
        </button>
      </div>
    );
  }

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({ 
      name: '', 
      relation: 'Other', 
      age: '', 
      gender: '', 
      bloodGroup: '',
      phoneNumber: '',
      email: '',
      address: ''
    });
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      relation: member.relation || 'Other',
      age: member.age || '',
      gender: member.gender || '',
      bloodGroup: member.bloodGroup || '',
      phoneNumber: member.phoneNumber || '',
      email: member.email || '',
      address: member.address || ''
    });
    setError('');
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = { ...formData };
    if (data.age) data.age = parseInt(data.age);
    else delete data.age;

    let result = editingMember
      ? await updateFamilyMember(editingMember._id, data)
      : await addFamilyMember(data);

    if (result.success) {
      setShowAddModal(false);
          } else {
      setError(result.error);
          }
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendCredentials = async (memberId) => {
    const email = emailInputs[memberId];
    if (!email) return;

    setSendingEmail(prev => ({ ...prev, [memberId]: true }));
    setEmailStatus(prev => ({ ...prev, [memberId]: null }));
    try {
      await api.post(`/family/${memberId}/send-credentials`, { email });
      setEmailStatus(prev => ({ ...prev, [memberId]: { success: true, msg: `Sent to ${email}` } }));
      setEmailInputs(prev => ({ ...prev, [memberId]: '' }));
          } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send';
      setEmailStatus(prev => ({ ...prev, [memberId]: { success: false, msg } }));
          } finally {
      setSendingEmail(prev => ({ ...prev, [memberId]: false }));
      setTimeout(() => setEmailStatus(prev => ({ ...prev, [memberId]: null })), 4000);
    }
  };

  const handleDeleteMember = (id, name) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    const { id, name } = deleteModal;
    try {
      await deleteFamilyMember(id);
            setDeleteModal({ isOpen: false, id: null, name: '' });
    } catch (err) {
          }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Scanning Family Directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Family Management</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Manage your family members and their health records.
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg  hover:bg-emerald-700 transition-all flex items-center gap-2 text-xs uppercase tracking-wider"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="standard-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Total Members</p>
            <p className="text-3xl font-black text-slate-800">{familyMembers.length}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Users size={22} />
          </div>
        </div>
        <div className="standard-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary Account</p>
            <p className="text-base font-black text-slate-800 truncate max-w-[140px]">{user?.name}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
            <span className="text-lg font-black">{user?.name?.charAt(0)}</span>
          </div>
        </div>
        <div className="standard-card p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Security</p>
            <p className="text-base font-black text-emerald-600">Encrypted</p>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100">
            <Shield size={22} />
          </div>
        </div>
      </div>

      {/* Member Cards */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
          <User size={14} className="text-emerald-500" /> Member Directory
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <div key={member._id} className="standard-card p-6 group flex flex-col h-full hover:border-emerald-200 transition-all">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl border border-emerald-100 shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 group-hover:text-emerald-600 transition-colors truncate max-w-[130px]">{member.name}</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{member.relation}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(member)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteMember(member._id, member.name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Credentials Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patient ID</span>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-widest">{member.mrNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Password</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600">
                      {showPasswords[member._id] ? (member.plainPassword || '••••••••') : '••••••••'}
                    </span>
                    <button onClick={() => togglePasswordVisibility(member._id)} className="text-slate-300 hover:text-emerald-500 transition-colors">
                      {showPasswords[member._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Info Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">{member.bloodGroup || 'Blood N/A'}</span>
                <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{member.age ? `${member.age} yrs` : 'Age N/A'}</span>
                {member.gender && <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{member.gender}</span>}
              </div>

              {/* Contact Info if available */}
              <div className="space-y-1 mb-5">
                {member.phoneNumber && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={10} />
                    <span className="text-[9px] font-bold">{member.phoneNumber}</span>
                  </div>
                )}
                {member.address && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={10} />
                    <span className="text-[9px] font-bold truncate max-w-[200px]">{member.address}</span>
                  </div>
                )}
              </div>

              {/* Send Credentials */}
              <div className="mt-auto pt-4 border-t border-slate-50 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Send Login Details via Email</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={emailInputs[member._id] || (member.email || '')}
                      onChange={(e) => setEmailInputs(prev => ({ ...prev, [member._id]: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2.5 text-[10px] font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleSendCredentials(member._id)}
                    disabled={sendingEmail[member._id] || (!emailInputs[member._id] && !member.email)}
                    className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {sendingEmail[member._id] ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    Send
                  </button>
                </div>
                {emailStatus[member._id] && (
                  <div className={`flex items-center gap-2 p-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${
                    emailStatus[member._id].success
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {emailStatus[member._id].success
                      ? <CheckCircle2 size={12} />
                      : <AlertCircle size={12} />
                    }
                    {emailStatus[member._id].msg}
                  </div>
                )}
              </div>
            </div>
          ))}

          {familyMembers.length === 0 && (
            <div className="col-span-full py-20 text-center standard-card border-dashed">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Users size={28} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No members added yet</p>
              <button onClick={handleOpenAdd} className="mt-4 text-emerald-600 font-bold hover:underline text-xs uppercase tracking-widest">Add First Member</button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-none">
              {error && <p className="p-4 bg-red-50 text-red-600 text-[10px] font-bold rounded-xl border border-red-100 uppercase tracking-widest">{error}</p>}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. Ahmed Ali"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relation *</label>
                  <select
                    required
                    value={formData.relation}
                    onChange={(e) => setFormData({...formData, relation: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    {relations.map(rel => <option key={rel} value={rel}>{rel}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="">Not specified</option>
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    <option value="">Not specified</option>
                    {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. 0300-1234567"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. family@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none"
                  placeholder="e.g. House 5, Street 3, Lahore"
                />
              </div>

              {!editingMember && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center gap-3">
                  <KeyRound size={16} className="text-emerald-500 shrink-0" />
                  <p className="text-[9px] font-bold text-emerald-700 leading-relaxed tracking-wider">
                    A unique Patient ID and password will be auto-generated for this member.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg  transition-all active:scale-95"
              >
                {editingMember ? 'Save Changes' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Remove Member"
        message={`Delete ${deleteModal.name} permanently?`}
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: null, name: '' })}
        type="danger"
      />
    </div>
  );
};

export default FamilyManagement;
