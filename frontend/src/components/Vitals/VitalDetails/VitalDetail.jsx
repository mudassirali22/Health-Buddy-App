import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { 
  Heart, CheckCircle, AlertCircle,
  AlertTriangle, Award, Crown
} from 'lucide-react';
import OverviewContent from './components/OverviewContent';
import MetricsContent from './components/MetricsContent';
import TrendsContent from './components/TrendsContent';
import InsightsContent from './components/InsightsContent';
import ActionsContent from './components/ActionsContent';
import LoadingState from './components/LoadingState';
import NavigationTabs from './components/NavigationTabs';
import PremiumHeader from './components/PremiumHeader';
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
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [userVitals, setUserVitals] = useState([]);

  // Load saved analysis from localStorage 
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

  //  fallback for when AI fails
  const getSimpleFallback = (vitalData) => {
    const vitalCount = Object.keys(vitalData).filter(key => 
      vitalData[key] !== null && vitalData[key] !== undefined &&
      !['notes', 'date', 'createdAt', 'updatedAt', 'source'].includes(key)
    ).length;

    return {
      overallAssessment: {
        score: 75,
        status: "Data Recorded",
        riskLevel: "Unknown",
        summary: "Vital data recorded successfully. AI analysis temporarily unavailable.",
        keyFindings: [`${vitalCount} vital parameters recorded`],
        urgency: "Routine",
        confidence: "Low",
        improvement: 0,
        stability: "Unknown"
      },
      metricAnalysis: {},
      aiRecommendations: {
        immediateActions: ["Try AI analysis again later", "Consult healthcare provider if concerned"],
        lifestyleChanges: ["Maintain healthy habits", "Regular exercise", "Balanced nutrition"],
        medicalConsultation: ["Schedule routine check-up"],
        monitoringSuggestions: ["Continue tracking vital signs"],
        dietaryRecommendations: [],
        exerciseRecommendations: [],
        sleepRecommendations: [],
        stressManagement: []
      },
      trendInsights: "AI analysis required for detailed insights",
      redFlags: ["No AI analysis available"],
      positiveIndicators: ["Vital data successfully recorded"],
      nextSteps: ["Retry AI analysis", "Consult medical professional"],
      aiMetadata: {
        analyzedAt: new Date().toISOString(),
        model: "Basic Fallback",
        confidence: 0,
        disclaimer: "AI analysis unavailable. Basic data recording only.",
        version: "1.0"
      }
    };
  };

  // AI Analysis
  const getAIAnalysis = async () => {
    if (!vital) return;
    
    setAiLoading(true);
    setAiError(null);
    
    try {
      const response = await api.post('/gemini/analyze-vitals', {
        vitalData: vital,
        previousData: trendData.length > 1 ? trendData[trendData.length - 2] : null
      });
      
      let analysis;
      
      if (response.data && response.data.success) {
        analysis = response.data.analysis;
      } else if (response.data && response.data.fallbackAnalysis) {
        analysis = response.data.fallbackAnalysis;
        setAiError('AI service returned analysis');
      } else {
        throw new Error('Invalid response format');
      }

      // Save to localStorage
      setAiAnalysis(analysis);
      localStorage.setItem(`ai-analysis-${id}`, JSON.stringify(analysis));
      
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiError('AI analysis service temporarily unavailable');
      
      const fallback = getSimpleFallback(vital);
      setAiAnalysis(fallback);
      localStorage.setItem(`ai-analysis-${id}`, JSON.stringify(fallback));
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
    if (score >= 90) return 'from-emerald-500 to-green-600';
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-amber-600';
    if (score >= 60) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Excellent': <Crown className="w-6 h-6" />,
      'Very Good': <Award className="w-6 h-6" />,
      'Good': <CheckCircle className="w-6 h-6" />,
      'Fair': <AlertCircle className="w-6 h-6" />,
      'Needs Attention': <AlertTriangle className="w-6 h-6" />,
      'Critical': <AlertTriangle className="w-6 h-6" />,
      'Data Recorded': <Heart className="w-6 h-6" />
    };
    return icons[status] || <Heart className="w-6 h-6" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'metrics':
        return <MetricsContent healthMetrics={healthMetrics} />;
      case 'trends':
        return <TrendsContent trendData={trendData} formatDate={formatDate} />;
      case 'insights':
        return <InsightsContent aiAnalysis={aiAnalysis} getAIAnalysis={getAIAnalysis} />;
      case 'actions':
        return <ActionsContent aiAnalysis={aiAnalysis} />;
      default:
        return (
          <OverviewContent 
            aiAnalysis={aiAnalysis} 
            vital={vital} 
            healthMetrics={healthMetrics} 
            getAIAnalysis={getAIAnalysis}
            getHealthScoreColor={getHealthScoreColor}
            getStatusIcon={getStatusIcon}
            setSelectedMetric={setSelectedMetric}
          />
        );
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!vital) {
    return <PageNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 text-gray-700">
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 animate-pulse"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <PremiumHeader 
            navigate={navigate}
            vital={vital}
            formatDate={formatDate}
            getAIAnalysis={getAIAnalysis}
            aiLoading={aiLoading}
          />

          <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {aiLoading && <AnalysisLoader />}

          {aiError && <AnalysisError aiError={aiError} />}

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default VitalDetail;