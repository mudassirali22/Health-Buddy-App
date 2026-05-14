import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import {
  ArrowLeft, Download, Trash2, FileText,
  Stethoscope, Calendar, Info, Bot,
  MessageCircleQuestion, Apple, ShieldCheck,
  Zap, Share2, Printer, Maximize2,
  Brain, ClipboardCheck, Activity,
  CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';

// Import components
import ConfirmModal from '../../common/ConfirmModal';
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

  const isReportAbnormal = (rep) => {
    const values = rep?.aiSummary?.abnormalValues;
    if (!values || values.length === 0) return false;
    
    const text = values.join(' ').toLowerCase().trim();
    const safePhrases = [
      'information not available',
      'analysis unavailable',
      'none',
      'normal',
      'no abnormal',
      'nothing abnormal',
      'within normal'
    ];
    
    return !safePhrases.some(phrase => text.includes(phrase));
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
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

  const handleDownloadPDF = () => {
    window.print();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <Loading />;
  if (!report) return <Error onNavigateHome={() => navigate('/dashboard')} />;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-500 print:p-0 print:max-w-none print:m-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 1.5cm !important; }
          .no-print, nav, header { display: none !important; }
          .print-only { display: block !important; }
          .standard-card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
          .bg-slate-800 { background: #0f172a !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-emerald-600 { background: #059669 !important; color: white !important; -webkit-print-color-adjust: exact; }
          @page { margin: 0; }
        }
      `}} />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Medical Report"
        message={`Are you sure you want to permanently delete "${report.title}"? This action cannot be undone and will remove all associated AI analysis.`}
        confirmText={deleting ? "Deleting..." : "Delete Report"}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        type="danger"
      />

      {/* Navigation & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
        <button
          onClick={() => navigate('/reports')}
          className="group flex items-center gap-3 text-slate-500 hover:text-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest"
        >
          Back to Reports
        </button>

        <div className="flex items-center gap-2">
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg ">
            <Download size={14} /> Download PDF
          </button>
          <button
            onClick={openDeleteModal}
            className="ml-2 p-2.5 bg-red-50 border border-red-100 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Print-Only Header Logo */}
      <div className="hidden print-only flex items-center justify-between border-b-2 border-emerald-600 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl">HB</div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">HealthBuddy</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Medical Analysis Report</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report ID</p>
          <p className="text-xs font-black text-slate-800">{report.mrNumber || 'HB-RECORD'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8 print:col-span-12 print:w-full">

          {/* Report Header */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-md  relative overflow-hidden print:border-none print:p-0 print:shadow-none print:mb-6">

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-sm  shrink-0 print:w-16 print:h-16">
                  <ClipboardCheck size={36} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2 uppercase print:text-2xl">{report.title}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="bg-slate-800 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest print:bg-slate-100 print:text-slate-800">
                      {report.reportType}
                    </span>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest print:border print:border-slate-300 print:bg-transparent ${isReportAbnormal(report) ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {isReportAbnormal(report) ? 'Abnormal' : 'Stable'}
                    </span>
                    <span className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 print:bg-transparent print:border-none print:p-0">
                      <Calendar size={14} className="text-emerald-500 print:text-slate-400" />
                      {formatDate(report.date)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-black transition-all hover:bg-emerald-600 hover:text-white flex items-center gap-3 text-[10px] uppercase tracking-widest border border-emerald-100 no-print"
              >
                Save as PDF
              </button>
            </div>

            {/* AI Summary */}
            {report.aiSummary && (
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic print:bg-slate-50/50 print:border-none print:mt-4 print:p-4">
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  "{typeof report.aiSummary === 'string' ? report.aiSummary : (report.aiSummary.mainObservations?.[0] || 'Report analyzed successfully.')}"
                </p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md  overflow-hidden print:shadow-none print:border-none">
            <div className="px-6 py-4 border-b border-slate-50 no-print">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'analysis', label: 'Detailed Analysis' },
                  { id: 'questions', label: 'What to ask Doctor' },
                  { id: 'diet', label: 'Diet & Lifestyle' },
                  { id: 'preview', label: 'Original Report' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-md '
                        : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 print:p-0">
              <div className={activeTab === 'analysis' ? 'block' : 'hidden print:block'}>
                <h2 className="hidden print-only text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Analysis Results</h2>
                <AnalysisTab aiSummary={report.aiSummary} />
              </div>

              <div className={activeTab === 'questions' ? 'block' : 'hidden print:block'}>
                <div className="mt-12">
                  <h2 className="hidden print-only text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Questions for Doctor</h2>
                  <QuestionsTab questionsForDoctor={report.aiSummary.questionsForDoctor} />
                </div>
              </div>

              <div className={activeTab === 'diet' ? 'block' : 'hidden print:block'}>
                <div className="mt-12">
                  <h2 className="hidden print-only text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Diet & Lifestyle Tips</h2>
                  <DietTab aiSummary={report.aiSummary} />
                </div>
              </div>

              <div className={activeTab === 'preview' ? 'block' : 'hidden print:block'}>
                <div className="mt-12">
                   <h2 className="hidden print-only text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Original Report</h2>
                   <ReportPreview fileUrl={report.fileUrl} />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-50">
                <div className="bg-amber-50/80 border-l-4 border-amber-500 p-6 rounded-2xl flex items-start gap-4 print:bg-slate-50 print:border-slate-300">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-amber-100 no-print">
                    <Info className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-amber-900 uppercase tracking-widest mb-1">Health Note</p>
                    <p className="text-xs font-bold text-amber-800 leading-relaxed opacity-90">
                      {report.aiSummary.disclaimer || "HealthBuddy AI analysis is for tracking purposes. Please talk to your doctor for any medical diagnosis."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8 no-print">

          {/* AI Score Card */}
          <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black tracking-tight mb-4 uppercase">AI Status</h3>
              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                Your medical data is analyzed using global health standards.
              </p>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Brain size={20} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Engine</p>
                    <p className="text-xs font-black uppercase tracking-widest">Optimized</p>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Secure Storage</p>
                    <p className="text-xs font-black uppercase tracking-widest">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Sidebar */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 group hover:bg-white hover:shadow-md transition-all duration-500">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
              <ShieldCheck size={18} className="text-emerald-500" /> Security Check
            </h4>
            <p className="text-[11px] font-black text-slate-600 leading-relaxed uppercase tracking-widest">
              This report is saved to your secure health vault (ID: {report.mrNumber || 'HB-771'}).
            </p>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print-only mt-12 pt-8 border-t border-slate-200 text-center">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">REPORT BY HEALTHBUDDY AI</p>
        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tight mt-1">© {new Date().getFullYear()} HealthBuddy. Private Record.</p>
      </div>
    </div>
  );
};

export default ReportView;