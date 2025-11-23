import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  User, Mail, Phone, Cake, 
  VenusAndMars, Droplets, MapPin, 
  Edit, Save, Shield, Download, 
  Calendar, Star, CheckCircle, 
  RefreshCw,AlertTriangle,HeartPulse,
} from 'lucide-react';

const Profile = () => {
const { user, setUser } = useAuth();
const [isEditing, setIsEditing] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [saveStatus, setSaveStatus] = useState('');
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phoneNumber: '',
  age: '',
  gender: '',
  bloodGroup: '',
  address: '',
});

useEffect(() => {
  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/auth/me');
      const profile = res.data.user;
      if (profile) {
        setUser(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          age: profile.age || '',
          gender: profile.gender || '',
          bloodGroup: profile.bloodGroup || '',
          address: profile.address || '',
        });
      }
    } catch (err) {
      console.error('Profile fetch failed:', err);
    } finally {
     setIsLoading(false);
    }
  };
  fetchProfile();
}, [setUser]);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setSaveStatus('');
};

const handleSave = async () => {
  setIsLoading(true);
    ('saving');
  try {
    const res = await api.put('/auth/update-profile', formData);
    const updated = res.data.data;
    setUser(updated);
    setFormData(updated);
    setSaveStatus('success');
    setTimeout(() => {
      setIsEditing(false);
      setSaveStatus('');
    }, 2000);} catch (err) {
  console.error('Update failed:', err);
  setSaveStatus('error');
} finally {
  setIsLoading(false);
  }
};


const getMemberSince = (dateString) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

const getCompletionPercentage = () => {
  const fields = Object.values(formData);
  const filledFields = fields.filter(value => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return value !== '';
    return Boolean(value);
  }).length;
  return Math.round((filledFields / fields.length) * 100);
};

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <User className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h2>
        <p className="text-gray-600 text-lg mb-6">Please login to view your profile</p>
        <NavLink
         to ="/login" 
         className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          Sign In
        </NavLink>
      </div>
    </div>
  );

  const fields = [
    { name: 'name', icon: <User className="text-blue-500 w-5 h-5" />, label: 'Full Name', type: 'text' },
    { name: 'email', icon: <Mail className="text-green-500 w-5 h-5" />, label: 'Email Address', type: 'email' },
    { name: 'phoneNumber', icon: <Phone className="text-purple-500 w-5 h-5" />, label: 'Phone Number', type: 'tel' },
    { name: 'age', icon: <Cake className="text-pink-500 w-5 h-5" />, label: 'Age', type: 'number' },
    { 
      name: 'gender', 
      icon: <VenusAndMars className="text-red-500 w-5 h-5" />, 
      label: 'Gender', 
      type: 'select',
      options: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    { 
      name: 'bloodGroup', 
      icon: <Droplets className="text-red-600 w-5 h-5" />, 
      label: 'Blood Group', 
       type: 'select',
      options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    { name: 'address', icon: <MapPin className="text-orange-500 w-5 h-5" />, label: 'Address', type: 'textarea' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header*/}
        <div className="relative bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 rounded-3xl shadow-2xl p-8 mb-8 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-6 lg:mb-0">
              <div className="relative">
              <div className="w-23 h-23 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-2xl">
                <User className="w-10 h-10" />
              </div>
            </div>
              <div>
                <h1 className=" text-2xl sm:text-3xl font-bold mb-2">{formData.name || 'User Profile'}</h1>
                <p className="text-green-100 opacity-90 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {formData.email}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium">
                    {getCompletionPercentage()}% Complete
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    Patient
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center bg-white/20 backdrop-blur-lg rounded-2xl px-15 py-3 sm:py-2 sm:px-5   border border-white/30 shadow-lg">
              <div className="text-sm font-semibold text-green-100">Member Since</div>
              <div className="text-lg sm:text-2xl font-bold text-white mt-1">{getMemberSince(user.createdAt)}</div>
              <div className="w-15 sm:w-12 h-1 bg-green-300 rounded-full mx-auto mt-2"></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Card */}
          <div className="xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="text-white w-6 h-6" />
                    </div>
                    <div>
                      Personal Information
                      <div className="w-50 sm:w-60 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1"></div>
                    </div>
                  </h2>
                  
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                    >
                      <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform" /> 
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                {isLoading && !isEditing ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : isEditing ? (
                  <div className="space-y-8">

                    {/* Save Status Indicator */}
                    {saveStatus && (
                      <div className={`p-4 rounded-xl border ${
                        saveStatus === 'saving' ? 'bg-blue-50 border-blue-200' :
                        saveStatus === 'success' ? 'bg-green-50 border-green-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          {saveStatus === 'saving' && <RefreshCw className="animate-spin text-blue-500 w-5 h-5" />}
                          {saveStatus === 'success' && <CheckCircle className="text-green-500 w-5 h-5" />}
                          <span className={`font-medium ${
                            saveStatus === 'saving' ? 'text-blue-700' :
                            saveStatus === 'success' ? 'text-green-700' :
                            'text-red-700'
                          }`}>
                            {saveStatus === 'saving' ? 'Saving changes...' :
                            saveStatus === 'success' ? 'Profile updated successfully!' :
                            'Error updating profile. Please try again.'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {fields.map((field) => (
                        <div key={field.name} className="space-y-3">
                          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                            {field.icon}
                            {field.label}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          
                          {field.type === 'select' ? (
                            <select
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              rows="3"
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300 resize-none break-words whitespace-pre-wrap overflow-wrap-anywhere"
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleChange}
                              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white hover:border-gray-300"
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 sm:px-10 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                        }}
                        disabled={isLoading}
                        className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 px-6  sm:px-9 sm:py-4 rounded-xl transition-all duration-300 font-semibold disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
                      <div key={field.name} className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                            {field.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 font-semibold mb-2 ">{field.label}</p>
                            <p className="text-gray-800 font-semibold sm:font-bold  text-md sm:text-lg break-words whitespace-pre-wrap overflow-wrap-anywhere">
                              {formData[field.name] || (
                                <span className="text-gray-400 italic font-normal">Not provided</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Medical Status Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-white/20">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <HeartPulse className="text-white w-5 h-5" />
                </div>
                Medical Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                  <span className="text-gray-600 font-medium">Blood Group</span>
                  <span className="font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                    {formData.bloodGroup || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
                  <span className="text-gray-600 font-medium">Age</span>
                  <span className="font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200">
                    {formData.age || 'N/A'} years
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Gender</span>
                  <span className="font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                    {formData.gender || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Profile Completion Card */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl shadow-2xl p-6 text-white">
              <h3 className="font-bold mb-4 text-white flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-300 fill-current" />
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-100">Progress</span>
                  <span className="text-2xl font-bold">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-amber-100 text-sm">
                  {getCompletionPercentage() === 100 
                    ? 'Perfect! Your profile is complete!'
                    : `Complete ${100 - getCompletionPercentage()}% `
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  export default Profile;