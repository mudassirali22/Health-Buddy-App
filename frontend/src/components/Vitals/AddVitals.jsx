import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useFamily } from '../../context/FamilyContext';
import { 
  ArrowLeft, 
  Activity, 
  Droplets,
  Scale,
  Thermometer,
  Heart,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  RotateCw,
  X,
  FileText,
  Save,
  Loader2
} from 'lucide-react';

const AddVitals = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { selectedFamilyMember } = useFamily();
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    systolic: '',
    diastolic: '',
    bloodSugar: '',
    weight: '',
    temperature: '',
    heartRate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchVital();
    }
  }, [id]);

  const fetchVital = async () => {
    try {
      const res = await api.get(`/vitals/${id}`);
      const v = res.data.data;
      setFormData({
        date: new Date(v.date).toISOString().split('T')[0],
        systolic: v.bloodPressure?.systolic || '',
        diastolic: v.bloodPressure?.diastolic || '',
        bloodSugar: v.bloodSugar || '',
        weight: v.weight || '',
        temperature: v.temperature || '',
        heartRate: v.heartRate || '',
        notes: v.notes || ''
      });
    } catch (err) {
      setError('Failed to fetch vital record.');
          } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.systolic && !formData.bloodSugar && !formData.weight && !formData.temperature && !formData.heartRate) {
      setError('Please enter at least one health record.');
      return;
    }
    setLoading(true);
    try {
      const dataToSend = { date: formData.date, notes: formData.notes };
      if (formData.systolic && formData.diastolic) {
        dataToSend.bloodPressure = { systolic: parseFloat(formData.systolic), diastolic: parseFloat(formData.diastolic) };
      }
      if (formData.bloodSugar) dataToSend.bloodSugar = parseFloat(formData.bloodSugar);
      if (formData.weight) dataToSend.weight = parseFloat(formData.weight);
      if (formData.temperature) dataToSend.temperature = parseFloat(formData.temperature);
      if (formData.heartRate) dataToSend.heartRate = parseFloat(formData.heartRate);
      
      if (!isEdit) {
        dataToSend.familyMember = selectedFamilyMember?._id || null;
        await api.post('/vitals', dataToSend);
              } else {
        await api.put(`/vitals/${id}`, dataToSend);
              }
      navigate('/vitals');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
          } finally {
      setLoading(false);
    }
  };

  const vitalInputs = [
    { label: "Blood Pressure", icon: Activity, fields: [{ name: 'systolic', unit: 'SYS' }, { name: 'diastolic', unit: 'DIA' }] },
    { label: "Glucose Levels", icon: Droplets, fields: [{ name: 'bloodSugar', unit: 'mg/dL' }] },
    { label: "Body Weight", icon: Scale, fields: [{ name: 'weight', unit: 'kg' }] },
    { label: "Body Temperature", icon: Thermometer, fields: [{ name: 'temperature', unit: '°F' }] },
    { label: "Heart Rate", icon: Heart, fields: [{ name: 'heartRate', unit: 'BPM' }] }
  ];

  if (fetching) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Syncing Vital Statistics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{isEdit ? 'Edit Record' : 'Record Vitals'}</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {isEdit ? `Updating health record from ${formData.date}` : (selectedFamilyMember ? `Saving health records for ${selectedFamilyMember.name}` : "Keep track of your daily health profile.")}
            </p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 flex items-center gap-2 text-xs uppercase tracking-wider">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="standard-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-emerald-500" size={18} />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Record Date</label>
                  </div>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vitalInputs.map((input, idx) => (
                    <div key={idx} className="standard-card p-6 group">
                       <div className="flex items-center gap-3 mb-6">
                          <input.icon size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{input.label}</h3>
                       </div>
                       <div className="space-y-3">
                          {input.fields.map(field => (
                            <div key={field.name} className="relative">
                               <input
                                 type="number"
                                 name={field.name}
                                 step="any"
                                 min="0"
                                 value={formData[field.name]}
                                 onChange={handleChange}
                                 placeholder={`Enter ${field.unit}`}
                                 className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                               />
                               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300 uppercase tracking-widest">{field.unit}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>

               <div className="standard-card p-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block ml-1">Health Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe any current symptoms or general observations..."
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                  />
               </div>

               {error && (
                 <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                   <X className="text-red-500" size={18} />
                   <p className="text-red-700 text-[10px] font-black uppercase tracking-widest">{error}</p>
                 </div>
               )}

               <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="flex-1 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                    {loading ? 'Processing...' : (isEdit ? 'Update Record' : 'Save Record')}
                  </button>
                  <button type="button" onClick={() => navigate('/vitals')} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                     Cancel
                  </button>
               </div>
            </form>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
               <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Normal Health Ranges</h3>
               <div className="space-y-3">
                  {[
                    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg' },
                    { label: 'Fasting Glucose', value: '70-100', unit: 'mg/dL' },
                    { label: 'Body Temperature', value: '98.6', unit: '°F' },
                    { label: 'Resting Pulse', value: '60-100', unit: 'BPM' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3.5 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                       <div className="text-right">
                          <span className="text-xs font-black text-white">{item.value}</span>
                          <span className="text-[8px] font-black text-emerald-500 uppercase ml-2 tracking-widest">{item.unit}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="standard-card p-6 border-emerald-100 bg-emerald-50/20">
               <div className="flex items-center gap-3 mb-4">
                  <Zap size={18} className="text-emerald-500" />
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">AI Analysis</h3>
               </div>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                 "Our AI engine analyzes these metrics against global standards to identify potential health patterns."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AddVitals;