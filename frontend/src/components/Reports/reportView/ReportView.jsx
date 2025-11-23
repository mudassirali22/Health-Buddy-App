import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { ArrowLeft, Download, Trash2, FileText, Stethoscope, Calendar, Info, Bot, MessageCircleQuestion, Apple } from 'lucide-react';

// Import components
import DeleteModal from './DeleteModal';
import Loading from './Loading';
import Error from './Error';
import AnalysisTab from './AnalysisTab';
import QuestionsTab from './QuestionsTab';
import DietTab from './DietTab';
import ReportPreview from './ReportPreview';

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    showSuccess: false,
    showError: false,
    errorMessage: ''
  });

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data.data);
    } catch (error) {
      <Error/>
    } finally {
      setLoading(false);
    }
  };
  
  const openDeleteModal = () => {
    setDeleteModal({
      isOpen: true,
      showSuccess: false,
      showError: false,
      errorMessage: ''
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      showSuccess: false,
      showError: false,
      errorMessage: ''
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/reports/${id}`);
      setDeleteModal(prev => ({
        ...prev,
        showSuccess: true
      }));
      
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
      
    } catch (error) {
      console.error('Error deleting report:', error);
      setDeleteModal(prev => ({
        ...prev,
        showError: true,
        errorMessage: 'Failed to delete report'
      }));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone:'UTC'
    });
  };

  if (loading) return <Loading />;
  if (!report) return <Error onNavigateHome={() => navigate('/dashboard')} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <DeleteModal
        isOpen={deleteModal.isOpen}
        showSuccess={deleteModal.showSuccess}
        showError={deleteModal.showError}
        errorMessage={deleteModal.errorMessage}
        report={report}
        deleting={deleting}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
      />
      
      <div className='pl-8 pb-5'>   
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-green-600 hover:text-green-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg border border-green-100"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-3">
            <a
              href={report.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 hover:text-green-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg border border-green-100"
            >
              <Download className="w-5 h-5" />
              Download
            </a>
            <button
              onClick={openDeleteModal}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-lg disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              {deleting ? 'Deleting...' : 'Delete Report'}
            </button>
          </div>
        </div>

        {/* Main Report Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-green-100">
          {/* Report Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <FileText className="text-green-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {report.reportType}
                    </span>
                    <span className="flex items-center gap-2 text-gray-600 bg-green-50 px-4 py-2 rounded-full">
                      <Calendar className="w-4 h-4 text-green-600" />
                      {formatDate(report.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Preview  */}
          <ReportPreview fileUrl={report.fileUrl} />
        </div>

        {/* AI Analysis Section */}
        {report.aiSummary && (
          <AIAnalysisSection 
            aiSummary={report.aiSummary}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
    </div>
  );
};

const AIAnalysisSection = ({ aiSummary, activeTab, onTabChange }) => (
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
    <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
    
    <div className="p-8">
      {activeTab === 'analysis' && <AnalysisTab aiSummary={aiSummary} />}
      {activeTab === 'questions' && <QuestionsTab questionsForDoctor={aiSummary.questionsForDoctor} />}
      {activeTab === 'diet' && <DietTab aiSummary={aiSummary} />}
      
      <Disclaimer disclaimer={aiSummary.disclaimer} />
    </div>
  </div>
);

const TabNavigation = ({ activeTab, onTabChange }) => (
  <div className="bg-green-50 px-6 py-4  border-b border-green-100">
    <div className="flex flex-col md:flex-row space-x-1">
      {[
        { id: 'analysis', label: 'AI Analysis', icon: Bot },
        { id: 'questions', label: 'Doctor Questions', icon: MessageCircleQuestion },
        { id: 'diet', label: 'Diet & Lifestyle', icon: Apple }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3  rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
            activeTab === tab.id
              ? 'bg-green-500 text-white shadow-lg'
              : 'text-gray-600 hover:text-green-600 hover:bg-white'
          }`}
        >
          <tab.icon className="w-5 h-5 " />
          {tab.label}
        </button>
      ))}
    </div>
  </div>
);

const Disclaimer = ({ disclaimer }) => (
  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-2xl p-6 mt-8">
    <div className="flex items-start gap-3">
      <Info className="text-yellow-600 w-5 h-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs sm:text-sm text-yellow-800">
          <strong className="font-semibold">Medical Disclaimer:</strong>
          {disclaimer || 'This analysis is generated by AI and should not replace professional medical advice. Please consult with a qualified healthcare provider for diagnosis and treatment.'}
        </p>
      </div>
    </div>
  </div>
);

export default ReportView;