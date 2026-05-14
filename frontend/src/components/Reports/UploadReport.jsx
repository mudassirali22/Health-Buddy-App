import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useFamily } from '../../context/FamilyContext';
import { 
  CloudUpload, 
  ArrowLeft,
  ShieldCheck,
  Zap,
  RotateCw,
  FileText,
  Save,
  Loader2,
  X
} from 'lucide-react';

const UploadReport = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const { selectedFamilyMember } = useFamily();
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    reportType: 'Other',
    date: new Date().toISOString().split('T')[0]
  });
  const [file, setFile] = useState(null);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const reportTypes = [
    "Blood Test", "Urine Test", "X-Ray Report", "MRI Scan", "CT Scan", "Ultrasound",
    "Diabetes Report", "Thyroid Test", "Liver Function", "Kidney Function",
    "Prescription", "Discharge Summary", "Other"
  ];

  useEffect(() => {
    if (isEdit) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      const r = res.data.data;
      setFormData({
        title: r.title || '',
        reportType: r.reportType || 'Other',
        date: new Date(r.date).toISOString().split('T')[0]
      });
    } catch (err) {
      setError('Failed to fetch report details.');
          } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
                setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => validateAndSetFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !file) { setError('Please select a file'); return; }
    
    setUploading(true);
    try {
      const data = new FormData();
      if (file) data.append('file', file);
      data.append('title', formData.title);
      data.append('reportType', formData.reportType);
      data.append('date', formData.date);
      
      if (!isEdit) {
        data.append('familyMember', selectedFamilyMember?._id || 'null');
        const response = await api.post('/reports', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
                setTimeout(() => navigate(`/report/${response.data.data._id}`), 1500);
      } else {
        // For editing, we might use a PUT request. 
        // If file is provided, we use multipart, otherwise JSON is fine.
        if (file) {
           await api.put(`/reports/${id}`, data, {
             headers: { 'Content-Type': 'multipart/form-data' },
           });
        } else {
           await api.put(`/reports/${id}`, {
             title: formData.title,
             reportType: formData.reportType,
             date: formData.date
           });
        }
                setTimeout(() => navigate(`/report/${id}`), 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
          } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] animate-pulse">Syncing Diagnostic Vault...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <CloudUpload size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{isEdit ? 'Edit Report Info' : 'Upload Report'}</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {isEdit ? `Updating metadata for: ${formData.title}` : (selectedFamilyMember ? `Analyzing records for ${selectedFamilyMember.name}` : "Upload your health reports for AI analysis.")}
            </p>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className="bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 flex items-center gap-2 text-xs uppercase tracking-wider relative z-10">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="standard-card p-6 sm:p-8 space-y-6">
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-emerald-600" /> Report Details
                  </h2>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Title</label>
                     <input
                       type="text"
                       name="title"
                       required
                       value={formData.title}
                       onChange={handleChange}
                       placeholder="e.g. CBC Blood Report"
                       className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                        <select
                          name="reportType"
                          value={formData.reportType}
                          onChange={handleChange}
                          className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                        >
                          {reportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Report Date</label>
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full bg-slate-50 border-none rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                        />
                     </div>
                  </div>
               </div>

               {/* Upload Zone - Only show optional for edit */}
               <div 
                 className={`standard-card p-10 border-2 border-dashed transition-all cursor-pointer text-center relative overflow-hidden group ${
                   isDragging ? 'border-emerald-500 bg-emerald-50/50 ' : 'border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/10'
                 }`}
                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                 onDragLeave={() => setIsDragging(false)}
                 onDrop={(e) => { e.preventDefault(); setIsDragging(false); validateAndSetFile(e.dataTransfer.files[0]); }}
                 onClick={() => document.getElementById('file-input').click()}
               >
                 <div className="relative z-10 flex flex-col items-center">
                    <CloudUpload className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={40} />
                    {file ? (
                      <div className="space-y-2">
                        <p className="text-base font-black text-slate-800 uppercase tracking-tight">{file.name}</p>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remove Selected File</button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                           {isEdit ? 'Replace existing document?' : 'Drop your report here'}
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                           {isEdit ? 'Click to browse a new image (optional)' : 'Or click to browse images (JPG/PNG)'}
                        </p>
                      </>
                    )}
                 </div>
                 <input id="file-input" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
               </div>

               {error && (
                 <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
                   <X className="text-red-500" size={18} />
                   <p className="text-red-700 text-[10px] font-black uppercase tracking-widest">{error}</p>
                 </div>
               )}

               <div className="flex gap-4">
                  <button type="submit" disabled={uploading || (!isEdit && !file)} className="flex-1 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-100 opacity-70">
                     {uploading ? 'Processing...' : (isEdit ? 'Update Report Details' : 'Upload Report')}
                  </button>
                  <button type="button" onClick={() => navigate('/reports')} className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                     Cancel
                  </button>
               </div>
            </form>
         </div>

         <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
               <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  <Zap size={24} className="text-emerald-400" />
               </div>
               <h3 className="text-lg font-black tracking-tight mb-2">Metadata Audit</h3>
               <p className="text-slate-300 text-xs font-medium leading-relaxed opacity-90">
                 Editing report details allows you to correct OCR mistakes or categorize your documents for better timeline sorting.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UploadReport;