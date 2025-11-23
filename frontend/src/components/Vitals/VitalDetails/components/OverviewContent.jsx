import { 
  Crown,  ShieldCheck, Clock, TrendingUpIcon, TargetIcon, 
  Lightbulb, BarChart3, Zap, Database, FileText, Heart, Thermometer, 
  Scale, Activity, Droplets, Brain, Ruler, Eye, Ear, Gauge,
  Stethoscope, Microscope,Syringe, AlertTriangle, CheckCircle,
  AlertCircle, TrendingUp, Target,Calendar,Utensils, Dumbbell,
  Moon, Sun, ActivityIcon, Shield,Info
} from 'lucide-react';
import { FaExclamationTriangle, FaLungs } from 'react-icons/fa';

const OverviewContent = ({ 
  aiAnalysis, 
  vital, 
  healthMetrics, 
  getAIAnalysis, 
  getHealthScoreColor, 
  getStatusIcon, 
  setSelectedMetric 
}) => {
  if (!aiAnalysis) {
    return (
      <div className="text-center py-12">
        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Brain className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4">No Analysis Available</h3>
        <p className="text-gray-600 mb-6 text-sm sm:text-md ">Generate AI analysis to see comprehensive health overview</p>
        <button
          onClick={getAIAnalysis}
          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
        >
          Generate Comprehensive Analysis
        </button>
      </div>
    );
  }

  // Helper function to get icon for vital type
  const getVitalIcon = (vitalType) => {
    const icons = {
      bloodPressure: <Activity className="w-6 h-6 text-white" />,
      heartRate: <Heart className="w-6 h-6 text-white" />,
      temperature: <Thermometer className="w-6 h-6 text-white" />,
      oxygenSaturation: <Droplets className="w-6 h-6 text-white" />,
      weight: <Scale className="w-6 h-6 text-white" />,
      height: <Ruler className="w-6 h-6 text-white" />,
      bmi: <Gauge className="w-6 h-6 text-white" />,
      bloodGlucose: <Microscope className="w-6 h-6 text-white" />,
      cholesterol: <Syringe className="w-6 h-6 text-white" />,
      bloodOxygen: <FaLungs className="w-6 h-6 text-white" />,
      respiratoryRate: <FaLungs className="w-6 h-6 text-white" />,
      bloodSugar: <Droplets className="w-6 h-6 text-white" />,
      vision: <Eye className="w-6 h-6 text-white" />,
      hearing: <Ear className="w-6 h-6 text-white" />,
      default: <Stethoscope className="w-6 h-6 text-white" />
    };
    return icons[vitalType] || icons.default;
  };

  // Helper function to get color for vital type
  const getVitalColor = (vitalType) => {
    const colors = {
      bloodPressure: 'from-red-500 to-pink-600',
      heartRate: 'from-green-500 to-emerald-600',
      temperature: 'from-orange-500 to-amber-600',
      oxygenSaturation: 'from-purple-500 to-indigo-600',
      weight: 'from-blue-500 to-cyan-600',
      height: 'from-indigo-500 to-blue-600',
      bmi: 'from-teal-500 to-green-600',
      bloodGlucose: 'from-yellow-500 to-amber-600',
      cholesterol: 'from-red-500 to-orange-600',
      bloodOxygen: 'from-purple-500 to-pink-600',
      respiratoryRate: 'from-cyan-500 to-blue-600',
      bloodSugar: 'from-purple-500 to-indigo-600',
      vision: 'from-violet-500 to-purple-600',
      hearing: 'from-slate-500 to-gray-600',
      default: 'from-gray-500 to-slate-600'
    };
    return colors[vitalType] || colors.default;
  };

  // Helper function to format vital value
  const formatVitalValue = (vitalType, value) => {
    if (!value) return 'N/A';
    
    const formatters = {
      bloodPressure: (bp) => `${bp.systolic || 'N/A'}/${bp.diastolic || 'N/A'}`,
      heartRate: (hr) => `${hr} BPM`,
      temperature: (temp) => `${temp}°C`,
      oxygenSaturation: (spo2) => `${spo2}%`,
      weight: (weight) => `${weight} kg`,
      height: (height) => `${height} cm`,
      bmi: (bmi) => bmi?.toFixed(1) || 'N/A',
      bloodGlucose: (glucose) => `${glucose} mg/dL`,
      cholesterol: (chol) => `${chol.total || 'N/A'} mg/dL`,
      bloodOxygen: (o2) => `${o2}%`,
      respiratoryRate: (rr) => `${rr} breaths/min`,
      bloodSugar: (sugar) => `${sugar} mg/dL`,
      vision: (vision) => `${vision || 'N/A'}/20`,
      hearing: (hearing) => `${hearing || 'N/A'} dB`,
      default: (val) => val?.toString() || 'N/A'
    };
    
    const formatter = formatters[vitalType] || formatters.default;
    return formatter(value);
  };

  // Helper function to get unit for vital type
  const getVitalUnit = (vitalType) => {
    const units = {
      bloodPressure: 'mmHg',
      heartRate: 'BPM',
      temperature: '°C',
      oxygenSaturation: '% SpO2',
      weight: 'kg',
      height: 'cm',
      bmi: 'BMI',
      bloodGlucose: 'mg/dL',
      cholesterol: 'mg/dL',
      bloodOxygen: '%',
      respiratoryRate: 'breaths/min',
      bloodSugar: 'mg/dL',
      vision: 'visual acuity',
      hearing: 'decibels',
      default: 'units'
    };
    return units[vitalType] || units.default;
  };

  // Get all available vital data points from the API response
 const getAvailableVitals = () => {
    if (!vital) return [];
    
    const vitalFields = [
      'bloodPressure', 'heartRate', 'temperature', 'oxygenSaturation', 
      'weight', 'height', 'bmi', 'bloodGlucose', 'cholesterol', 
      'respiratoryRate', 'bloodSugar', 'vision', 'hearing', 'bloodOxygen'
    ];
    
    return vitalFields
      .filter(field => vital[field] !== undefined && vital[field] !== null)
      .map(field => ({
        type: field,
        value: vital[field],
        icon: getVitalIcon(field),
        color: getVitalColor(field),
        unit: getVitalUnit(field),
        formattedValue: formatVitalValue(field, vital[field])
      }));
  };

  const availableVitals = getAvailableVitals();

  // Get all AI recommendations with fallbacks
  const getAllRecommendations = () => {
    const recommendations = aiAnalysis.aiRecommendations || {};
    
    return {
      immediateActions: recommendations.immediateActions || [
        'Schedule follow-up appointment',
        'Continue current health monitoring',
        'Maintain healthy lifestyle habits'
      ],
      lifestyleChanges: recommendations.lifestyleChanges || [
        'Balanced nutrition with portion control',
        'Regular physical activity',
        'Adequate sleep and stress management'
      ],
      medicalConsultation: recommendations.medicalConsultation || [
        'Annual health check-up',
        'Preventive screening as per guidelines'
      ],
      monitoringSuggestions: recommendations.monitoringSuggestions || [
        'Regular vital signs tracking',
        'Symptom diary maintenance',
        'Follow-up testing as needed'
      ],
      dietaryRecommendations: recommendations.dietaryRecommendations || [
        'Increase fruit and vegetable intake',
        'Reduce processed food consumption',
        'Maintain proper hydration'
      ],
      exerciseRecommendations: recommendations.exerciseRecommendations || [
        '150 minutes moderate exercise weekly',
        'Strength training 2-3 times per week',
        'Flexibility and balance exercises'
      ],
      sleepRecommendations: recommendations.sleepRecommendations || [
        '7-9 hours quality sleep nightly',
        'Consistent sleep schedule',
        'Optimize sleep environment'
      ],
      stressManagement: recommendations.stressManagement || [
        'Practice mindfulness meditation',
        'Regular breaks and relaxation',
        'Healthy work-life balance'
      ]
    };
  };

  const allRecommendations = getAllRecommendations();

  // Get risk indicators
  const getRiskIndicators = () => {
    return {
      redFlags: aiAnalysis.redFlags || ['No critical issues detected'],
      positiveIndicators: aiAnalysis.positiveIndicators || ['Baseline health maintained'],
      trendInsights: aiAnalysis.trendInsights || 'Stable health patterns observed',
      nextSteps: aiAnalysis.nextSteps || ['Continue current health maintenance routine']
    };
  };

  const riskIndicators = getRiskIndicators();

  return (
    <>
         {/* Disclaimer */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 mb-5 rounded-2xl p-6 mt-8">
            <div className="flex items-start gap-3">
                <Info className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                <p className="text-sm text-yellow-800">
                <strong className="font-semibold">Medical Disclaimer:</strong>
                {aiAnalysis.aiMetadata.disclaimer||'This analysis is generated by AI and should not replace professional medical advice. Please consult with a qualified healthcare provider for diagnosis and treatment.'}
                </p>
                </div>
            </div>
        </div>
      {/*  Health Score Card */}
      <div className={`bg-gradient-to-r ${getHealthScoreColor(aiAnalysis.overallAssessment?.score || 75)} rounded-3xl shadow-2xl p-8 mb-8  relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="relative z-10">
       
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className=" text-lg sm:text-3xl md:text-4xl  font-bold md:flex items-center  justify-between gap-4 mb-2">
                <Crown className="w-10 h-10"/>
                Comprehensive Health Assessment
                  <span className="text-xs flex  bg-white/30 py-1 mt-2 px-2 w-40 md:w-auto  md:pl-3   md:px-3 md:py-1  rounded-full font-medium">
                    AI-POWERED ANALYSIS 
                  </span>
              </h2>
              <div className="flex items-center gap-4 text-white/80 flex-wrap">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Confidence: {aiAnalysis.overallAssessment?.confidence || "90%"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Stability: {aiAnalysis.overallAssessment?.stability || "High"}
                </div>
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4" />
                  Urgency:{aiAnalysis.overallAssessment?.urgency || "unknown"}
                </div>
                {aiAnalysis.aiMetadata?.analyzedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Analyzed: {new Date(aiAnalysis.aiMetadata.analyzedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-end justify-between  mb-8">
            <div className='text-center'>
              <div className="text-6xl sm:text-8xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {aiAnalysis.overallAssessment?.score || 75}
              </div>
              <div className="flex items-center sm:gap-4">
                {getStatusIcon(aiAnalysis.overallAssessment?.status || 'Good')}
                <span className="sm:text-6xl text-3xl font-semibold">{aiAnalysis.overallAssessment?.status || 'Good'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-2xl mb-2">Risk Level</div>
              <div className="text-3xl sm:text-4xl font-bold">{aiAnalysis.overallAssessment?.riskLevel || 'Low'}</div>
              <div className="text-white/80 text-lg sm:text-xl mt-2">
                <TargetIcon className="w-5 h-5 inline mr-2" />
                {aiAnalysis.overallAssessment?.urgency || 'Routine'} Priority
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-white/30 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-white to-emerald-200 h-3 rounded-full transition-all duration-2000 ease-out shadow-lg shadow-emerald-500/50"
                style={{ width: `${aiAnalysis.overallAssessment?.score || 75}%` }}
              ></div>
            </div>
            <p className="text-white/90 text:lg sm:text-xl leading-relaxed font-light">
              {aiAnalysis.overallAssessment?.summary || 'Comprehensive health analysis completed.'}
            </p>
          </div>

          {/* Key Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(aiAnalysis.overallAssessment?.keyFindings || ['All vital parameters within acceptable ranges']).map((finding, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium">{finding}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Health Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-center">
              <div className="text-white/80 text-sm">Vitals Tracked</div>
              <div className="text-white text-lg sm:text-xl font-bold">{availableVitals.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-center">
              <div className="text-white/80 text-sm">Risk Factors</div>
              <div className="text-white text-lg sm:text-xl font-bold">{riskIndicators.redFlags.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-center">
              <div className="text-white/80 text-sm">Positive Signs</div>
              <div className="text-white text-lg sm:text-xl font-bold">{riskIndicators.positiveIndicators.length}</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl text-center">
              <div className="text-white/80 text-sm">Recommendations</div>
              <div className="text-white text-lg sm:text-xl font-bold">
                {Object.values(allRecommendations).flat().length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  AI Recommendations Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Main Recommendations Panel */}
        <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-emerald-200">
          <h3 className=" text-lg sm:text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <Brain className="w-7 h-7 text-emerald-600" />
            AI-Powered Health Recommendations
          </h3>

          {/* Immediate Actions */}
          <div className="mb-8">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-amber-700">
              <Zap className="w-5 h-5" />
              Immediate Actions
              <span className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                Priority
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allRecommendations.immediateActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm leading-relaxed text-gray-700">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle Changes */}
          <div className="mb-8">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              Lifestyle Optimization
            </h4>
            <div className="space-y-3">
              {allRecommendations.lifestyleChanges.map((change, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Consultation */}
          <div className="mb-8">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-blue-700">
              <Stethoscope className="w-5 h-5" />
              Medical Consultation
            </h4>
            <div className="space-y-3">
              {allRecommendations.medicalConsultation.map((consult, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{consult}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring Plan */}
          <div>
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-purple-700">
              <ActivityIcon className="w-5 h-5" />
              Monitoring Plan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allRecommendations.monitoringSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <Target className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dietary Recommendations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-orange-200">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-orange-700">
              <Utensils className="w-5 h-5" />
              Nutrition Plan
            </h4>
            <div className="space-y-2">
              {allRecommendations.dietaryRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 leading-relaxed">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Recommendations */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-200">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-blue-700">
              <Dumbbell className="w-5 h-5" />
              Fitness Plan
            </h4>
            <div className="space-y-2">
              {allRecommendations.exerciseRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-gray-700 leading-relaxed">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep & Stress Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-indigo-200">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-indigo-700">
              <Moon className="w-5 h-5" />
              Recovery & Wellness
            </h4>
            
            <div className="mb-4">
              <h5 className="font-semibold text-sm mb-2 text-indigo-600 flex items-center gap-1">
                <Moon className="w-4 h-4" />
                Sleep Optimization
              </h5>
              <div className="space-y-1">
                {allRecommendations.sleepRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 leading-relaxed">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-sm mb-2 text-indigo-600 flex items-center gap-1">
                <Sun className="w-4 h-4" />
                Stress Management
              </h5>
              <div className="space-y-1">
                {allRecommendations.stressManagement.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-xs text-gray-700 leading-relaxed">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-red-200">
            <h4 className="text-md sm:text-lg font-bold mb-4 flex items-center gap-2 text-red-700">
              <Shield className="w-5 h-5" />
              Risk Assessment
            </h4>
            
            <div className="mb-4">
              <h5 className="font-semibold text-sm mb-2 text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Areas Needing Attention
              </h5>
              <div className="space-y-1">
                {riskIndicators.redFlags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700 leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-sm mb-2 text-green-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Positive Indicators
              </h5>
              <div className="space-y-1">
                {riskIndicators.positiveIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700 leading-relaxed">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Interactive Metrics Dashboard */}
      {healthMetrics && healthMetrics.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-emerald-200 mb-8">
          <h3 className="text-lg sm:text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800">
            <BarChart3 className="w-7 h-7 text-emerald-600" />
            Comprehensive Metrics Analysis
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {healthMetrics.map((metric) => (
              <div
                key={metric.id}
                onClick={() => setSelectedMetric(metric)}
                className="bg-white hover:bg-emerald-50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                      {metric.icon || "📊"}
                    </div>
                    <div>
                      <div className="font-bold text-md sm:text-lg text-gray-800 capitalize">
                        {metric.name.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-gray-600">{metric.normalRange || 'Standard range'}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      metric.risk === 'very-low' ? 'text-green-600' :
                      metric.risk === 'low' ? 'text-emerald-600' :
                      metric.risk === 'medium' ? 'text-yellow-600' :
                      metric.risk === 'high' ? 'text-orange-600' : 
                      metric.risk === 'critical' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.score || 75}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">{metric.risk || 'unknown'} risk</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-3">
                  {metric.assessment || 'No specific assessment available.'}
                </div>
                <div className="text-emerald-600 text-sm font-medium">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  {metric.suggestion || 'Continue monitoring and maintain healthy habits.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps & Action Plan */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 mb-8">
        <h3 className="text-lg sm:text-2xl font-bold mb-6 flex items-center gap-3 text-white">
          <Target className="w-7 h-7 text-white" />
          Next Steps & Implementation Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskIndicators.nextSteps.map((step, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <span className="text-white text-sm font-medium pt-2">{step}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" />
            <span>{riskIndicators.trendInsights}</span>
          </div>
        </div>
      </div>

      {/*Raw Data Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-400 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        <h3 className="text-lg sm:text-2xl font-bold mb-8 flex items-center gap-3 text-white">
          <Database className="w-7 h-7 text-white" />
          Comprehensive Biometric Data
          <span className="text-sm bg-white/30 px-3 pl-5 pr-5 text-center sm:pl-4 py-2 sm:py-1 rounded-full font-medium">
            {availableVitals.length} Metrics
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {availableVitals.map((vitalData, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/30 group hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer"
              onClick={() => {
                const metric = healthMetrics?.find(m => m.id === vitalData.type);
                if (metric) setSelectedMetric(metric);
              }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-14 h-14 bg-gradient-to-r ${vitalData.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {vitalData.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/90 uppercase tracking-wide">
                    {vitalData.type.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className=" text-lg sm:text-2xl font-bold text-white">
                    {vitalData.formattedValue}
                  </p>        
                </div>
              </div>
              <p className="text-xs text-white/80 font-medium">
                {vitalData.unit} • {vitalData.type.includes('blood') ? 'Circulatory' : 'Biometric'}
              </p>
            </div>
          ))}
        </div>

        {/* Clinical Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {vital.notes && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl break-words p-6 border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                CLINICAL NOTES & OBSERVATIONS
              </p>
              <p className="text-gray-800 leading-relaxed">{vital.notes}</p>
            </div>
          )}
        </div>

        {(vital.createdAt || vital.updatedAt || vital.source) && (
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
            <p className="text-xs font-semibold text-white/90 mb-2">RECORD METADATA</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/80">
              {vital.createdAt && (
                <div>Created: {new Date(vital.createdAt).toLocaleDateString()}</div>
              )}
              {vital.updatedAt && (
                <div>Updated: {new Date(vital.updatedAt).toLocaleDateString()}</div>
              )}
              {vital.source && (
                <div>Source: {vital.source}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewContent;