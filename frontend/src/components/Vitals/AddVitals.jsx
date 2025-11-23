import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  ArrowLeft, 
  Heart, 
  Thermometer, 
  Scale, 
  Activity, 
  Droplets,
  Calendar,
  Stethoscope,
  ClipboardList,
  Save,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Dot
} from 'lucide-react';

const AddVitals = () => {
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate at least one vital is entered
    if (!formData.systolic && !formData.bloodSugar && !formData.weight && 
        !formData.temperature && !formData.heartRate) {
      setError('Please enter at least one vital sign');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        date: formData.date,
        notes: formData.notes
      };

      if (formData.systolic && formData.diastolic) {
        dataToSend.bloodPressure = {
          systolic: parseFloat(formData.systolic),
          diastolic: parseFloat(formData.diastolic)
        };
      }

      // Add other vitals if provided
      if (formData.bloodSugar) dataToSend.bloodSugar = parseFloat(formData.bloodSugar);
      if (formData.weight) dataToSend.weight = parseFloat(formData.weight);
      if (formData.temperature) dataToSend.temperature = parseFloat(formData.temperature);
      if (formData.heartRate) dataToSend.heartRate = parseFloat(formData.heartRate);

      await api.post('/vitals', dataToSend);
      
      setSuccess('Vital signs recorded successfully!');
      setTimeout(() => {
        navigate('/vitals');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vital signs');
    } finally {
      setLoading(false);
    }
  };

  const vitalCards = [
    {
      title: "Blood Pressure",
      icon: Activity,
      fields: [
        { name: 'systolic', label: 'Systolic (Upper)', unit: 'mmHg', placeholder: '120', min: 0, max: 300 },
        { name: 'diastolic', label: 'Diastolic (Lower)', unit: 'mmHg', placeholder: '80', min: 0, max: 200 }
      ],
      note: "Normal range: 90/60 to 120/80 mmHg",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Blood Sugar",
      icon: Droplets,
      fields: [
        { name: 'bloodSugar', label: 'Blood Sugar', unit: 'mg/dL', placeholder: '95', min: 0, max: 600, step: 0.1 }
      ],
      note: "Fasting normal range: 70-100 mg/dL",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Weight",
      icon: Scale,
      fields: [
        { name: 'weight', label: 'Weight', unit: 'kg', placeholder: '70', min: 0, max: 300, step: 0.1 }
      ],
      note: "Measure at the same time daily",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Temperature",
      icon: Thermometer,
      fields: [
        { name: 'temperature', label: 'Temperature', unit: '°F', placeholder: '98.6', min: 90, max: 110, step: 0.1 }
      ],
      note: "Normal range: 97-99°F (36.1-37.2°C)",
      color: "from-orange-500 to-amber-600"
    },
    {
      title: "Heart Rate",
      icon: Heart,
      fields: [
        { name: 'heartRate', label: 'Heart Rate', unit: 'bpm', placeholder: '72', min: 30, max: 200 }
      ],
      note: "Normal resting range: 60-100 bpm",
      color: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className='pb-5'>
         <button
            onClick={() => navigate(-1)}
            className="bg-white text-green-600 hover:text-green-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back 
          </button>
        </div>
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
         
          <div className="flex-1 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Record Vital Signs
            </h1>
            <p className="text-gray-600 text-md sm:text-lg mt-2">Track your daily health metrics</p>
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

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Date Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Measurement Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white"
                  />
                </div>

                {/* Vital Signs Grid */}
                <div className="space-y-6">
                  {vitalCards.map((card, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-green-200 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center`}>
                          <card.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-md sm:text-lg font-bold text-gray-900">{card.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{card.note}</p>
                        </div>
                      </div>

                      <div className={`grid gap-4 ${card.fields.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {card.fields.map((field) => (
                          <div key={field.name} className="space-y-2">
                            <label htmlFor={field.name} className="block text-xs sm:text-sm font-medium text-gray-700">
                              {field.label} ({field.unit})
                            </label>
                            <input
                              type="number"
                              id={field.name}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              step={field.step || 1}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white hover:bg-gray-50"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes Section */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                  <label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="How are you feeling today? Any symptoms, medications, or other observations..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-2 sm:px-6 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 sm:gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Vitals...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Vital Signs
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
            {/* Health Tips */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-green-200" />
                Measurement Tips
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Blood Pressure</p>
                    <p className="text-green-100 text-sm">Measure in the morning before eating</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Droplets className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Blood Sugar</p>
                    <p className="text-green-100 text-sm">Check as per doctor's advice timing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Weight</p>
                    <p className="text-green-100 text-sm">Weigh at same time each day</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-green-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Heart Rate</p>
                    <p className="text-green-100 text-sm">Measure after 5 minutes of rest</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Normal Ranges */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-green-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Normal Ranges
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="font-medium text-gray-700">Blood Pressure</span>
                  <span className="text-green-600 font-semibold">120/80 mmHg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="font-medium text-gray-700">Blood Sugar</span>
                  <span className="text-blue-600 font-semibold">70-100 mg/dL</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="font-medium text-gray-700">Heart Rate</span>
                  <span className="text-purple-600 font-semibold">60-100 bpm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="font-medium text-gray-700">Temperature</span>
                  <span className="text-orange-600 font-semibold">97-99°F</span>
                </div>
              </div>
            </div>

            {/* Importance Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                Why Track Vitals?
              </h3>
              <div className="space-y-2  text-sm text-gray-600">
                <p className='flex'> <Dot/>Early detection of health issues</p>
                <p className='flex'> <Dot/>Better communication with doctors</p>
                <p className='flex'> <Dot/>Track treatment effectiveness</p>
                <p className='flex'> <Dot/>Maintain health awareness</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;