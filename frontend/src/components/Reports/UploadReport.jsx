import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Upload, 
  FileText, 
  Calendar, 
  Type, 
  AlertCircle, 
  CheckCircle, 
  ArrowLeft,
  CloudUpload,
  Zap,
  Languages,
  Stethoscope,
  Dot
} from 'lucide-react';

const UploadReport = () => {
  const [formData, setFormData] = useState({
    title: '',
    reportType: 'Other',
    date: new Date().toISOString().split('T')[0]
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

const reportTypes = [
  "Blood Test",
  "Urine Test",
  "X-Ray Report",
  "MRI Scan",
  "CT Scan",
  "Ultrasound",
  "Blood Pressure",
  "Diabetes Report",
  "Thyroid Test",
  "Liver Function Test",
  "Kidney Function Test",
  "Vitamin Test",
  "Cholesterol Report",
  "Dental Report",
  "Eye Checkup",
  "Allergy Test",
  "Prescription",
  "Discharge Summary",
  "Surgery Report",
  "Physiotherapy",
  "Vaccination Record",
  "Other"
]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Only  image files (JPG, PNG) are allowed');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('reportType', formData.reportType);
      formDataToSend.append('date', formData.date);

    const response = await api.post('/reports', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });


      setSuccess('Report uploaded successfully! AI is analyzing your report...');
      setTimeout(() => {
        navigate(`/report/${response.data.data._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload report. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className='pb-5'>
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-green-600 hover:text-green-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back 
          </button>
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Upload Medical Report
            </h1>
            <p className="text-gray-600 text-lg mt-2">Get AI Health Analysis</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type className="w-4 h-4 text-green-600" />
                    Report Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g,Complete Blood Count - Month - Year"
                    className="w-full text-sm sm:text-md px-2 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                  />
                </div>

                {/* Report Type and Date Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="reportType" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <FileText className="w-4 h-4 text-green-600" />
                      Report Type *
                    </label>
                    <select
                      id="reportType"
                      name="reportType"
                      value={formData.reportType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    >
                      {reportTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Report Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Upload className="w-4 h-4 text-green-600" />
                    Upload File * (JPG, PNG - Max 10MB)
                  </label>
                  <div
                    className={`mt-1 border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? 'border-green-500 bg-green-50 scale-105'
                        : file
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file').click()}
                  >
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                        <CloudUpload className={`w-8 h-8 ${file ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-900">
                          {file ? 'File Selected' : 'Choose file or drag & drop'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {file ? file.name : ' PNG, JPG up to 10MB'}
                        </p>
                      </div>

                      {!file && (
                        <button
                          type="button"
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          Browse Files
                        </button>
                      )}

                      {file && (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                          <CheckCircle className="w-5 h-5" />
                          Ready to upload
                        </div>
                      )}
                    </div>
                    
                    <input
                      id="file"
                      name="file"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading || !file}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-3 sm:px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading & Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload Report
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* Analysis Benefits */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-300" />
                AI Analysis Benefits
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Languages className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Bilingual Summary</p>
                    <p className="text-green-100 text-sm">Get insights in English </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Doctor Questions</p>
                    <p className="text-green-100 text-sm">Smart questions for your next visit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supported Formats */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Supported Formats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">JPEG Images</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-700">PNG Images</span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            {/* Processing Time */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Processing Time
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className='flex'> <Dot/> Image analysis: 15-30 seconds</p>
                <p className='flex'><Dot/>Complex reports: Up to 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReport;