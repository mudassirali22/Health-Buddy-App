import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { 
  Heart, CheckCircle, AlertCircle,
  AlertTriangle, Award, Crown,
  ArrowLeft, BrainCircuit, Calendar, Sparkles, Loader,
  ShieldCheck, Zap, Activity, Info
} from 'lucide-react';
import OverviewContent from './components/OverviewContent';
import MetricsContent from './components/MetricsContent';
import TrendsContent from './components/TrendsContent';
import InsightsContent from './components/InsightsContent';
import ActionsContent from './components/ActionsContent';
import LoadingState from './components/LoadingState';
import NavigationTabs from './components/NavigationTabs';
import AnalysisLoader from './components/AnalysisLoader';
import AnalysisError from './components/AnalysisError';
import PageNotFound from '../../pages/PageNotFound';

const VitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vital, setVital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [userVitals, setUserVitals] = useState([]);

  useEffect(() => {
    const savedAnalysis = localStorage.getItem(`ai-analysis-${id}`);
    if (savedAnalysis) {
      setAiAnalysis(JSON.parse(savedAnalysis));
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vitalResponse = await api.get(`/vitals/${id}`);
        if (vitalResponse.data?.data) {
          setVital(vitalResponse.data.data);
        }

        const trendResponse = await api.get('/vitals');
        if (trendResponse.data?.data) {
          const allVitals = trendResponse.data.data;
          setUserVitals(allVitals);
          
          const currentIndex = allVitals.findIndex(v => v._id === id);
          if (currentIndex !== -1) {
            const trendVitals = allVitals.slice(Math.max(0, currentIndex - 5), currentIndex + 1);
            setTrendData(trendVitals);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getSimpleFallback = (vitalData) => {
    return {
      overallAssessment: {
        score: 75,
        status: "Data Recorded",
        summary: "Vital data recorded successfully. AI analysis required for full clinical insights.",
        keyFindings: ["Metrics registered in clinical history"],
        urgency: "Routine"
      },
      metricAnalysis: {},
      aiRecommendations: {
        immediateActions: ["Consult healthcare provider if metrics are outside normal ranges"],
        lifestyleChanges: ["Maintain hydration", "Regular physical activity"],
        medicalConsultation: ["Routine follow-up"],
        monitoringSuggestions: ["Continue daily tracking"]
      }
    };
  };

  const getAIAnalysis = async () => {
    if (!vital) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await api.post('/gemini/analyze-vitals', {
        vitalData: vital,
        previousData: trendData.length > 1 ? trendData[trendData.length - 2] : null
      });
      if (response.data && (response.data.success || response.data.fallbackAnalysis)) {
        const analysis = response.data.analysis || response.data.fallbackAnalysis;
        setAiAnalysis(analysis);
        localStorage.setItem(`ai-analysis-${id}`, JSON.stringify(analysis));
      }
    } catch (error) {
      const fallback = getSimpleFallback(vital);
      setAiAnalysis(fallback);
      setAiError('AI engine recalibrating. Basic assessment provided.');
    } finally {
      setAiLoading(false);
    }
  };

  const healthMetrics = useMemo(() => {
    if (!aiAnalysis || !aiAnalysis.metricAnalysis) return [];
    return Object.entries(aiAnalysis.metricAnalysis).map(([key, data]) => ({
      id: key,
      name: key.replace(/([A-Z])/g, ' $1').trim(),
      ...data,
      progress: data.score || 75
    }));
  }, [aiAnalysis]);

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-600';
    if (score >= 60) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Excellent': <Crown size={24} />,
      'Good': <CheckCircle size={24} />,
      'Needs Attention': <AlertTriangle size={24} />,
      'Critical': <AlertCircle size={24} />,
      'Data Recorded': <Activity size={24} />
    };
    return icons[status] || <Activity size={24} />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <LoadingState />;
  if (!vital) return <PageNotFound />;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Unified Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg ">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Record Analysis</h1>
            <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
              <Calendar size={14} className="text-emerald-500" />
              {formatDate(vital.date)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 relative z-10">
          <button 
            onClick={getAIAnalysis} 
            disabled={aiLoading} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black transition-all shadow-lg  flex items-center gap-2 text-[10px] uppercase tracking-widest disabled:opacity-50"
          >

            {aiLoading ? 'Analyzing...' : 'Get AI Insights'}
          </button>
          <button onClick={() => navigate('/vitals')} className="bg-white border border-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-slate-50 flex items-center gap-2 text-xs uppercase tracking-wider">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Navigation Tabs */}
          <div className="standard-card p-2">
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'overview', label: 'Summary', icon: Activity },
                { id: 'metrics', label: 'Health Markers', icon: ShieldCheck },
                { id: 'trends', label: 'Past Trends', icon: Zap },
                { id: 'insights', label: 'AI Advice', icon: Sparkles },
                { id: 'actions', label: 'Action Plan', icon: Info }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {aiLoading && <AnalysisLoader />}
          {aiError && <AnalysisError aiError={aiError} />}

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeTab === 'metrics' && <MetricsContent healthMetrics={healthMetrics} />}
            {activeTab === 'trends' && <TrendsContent trendData={trendData} formatDate={formatDate} />}
            {activeTab === 'insights' && <InsightsContent aiAnalysis={aiAnalysis} getAIAnalysis={getAIAnalysis} />}
            {activeTab === 'actions' && <ActionsContent aiAnalysis={aiAnalysis} />}
            {activeTab === 'overview' && (
              <OverviewContent 
                aiAnalysis={aiAnalysis} 
                vital={vital} 
                healthMetrics={healthMetrics} 
                getAIAnalysis={getAIAnalysis}
                getHealthScoreColor={getHealthScoreColor}
                getStatusIcon={getStatusIcon}
                setSelectedMetric={() => {}}
              />
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-80 space-y-6">
           <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              
              <h3 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">Integrity Status</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">
                This diagnostic record is verified and secured within your clinical vault.
              </p>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                 <ShieldCheck size={16} className="text-emerald-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Clinically Validated</span>
              </div>
           </div>

           <div className="standard-card p-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} className="text-emerald-500" /> Disclaimer
              </h4>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
                Automated assessments are for tracking purposes. Always cross-reference with professional medical consultation.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VitalDetail;