import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Heart } from 'lucide-react';

// Lazy load components for performance
const Auth = lazy(() => import('./components/Auth/Auth'));
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const UploadReport = lazy(() => import('./components/Reports/UploadReport'));
const ReportView = lazy(() => import('./components/Reports/reportView/ReportView'));
const ReportList = lazy(() => import('./components/Reports/ReportList'));
const AddVitals = lazy(() => import('./components/Vitals/AddVitals'));
const VitalsList = lazy(() => import('./components/Vitals/VitalsLists/VitalsList'));
const VitalDetail = lazy(() => import('./components/Vitals/VitalDetails/VitalDetail'));
const Timeline = lazy(() => import('./components/Dashboard/Timeline'));
const Navbar = lazy(() => import('./components/Navbar/Navbar'));
const Profile = lazy(() => import('./components/Navbar/Profile'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'));
const ChangePassword = lazy(() => import('./components/Auth/ChangePassword'));
const Home = lazy(() => import('./components/pages/Home'));
const PageNotFound = lazy(() => import('./components/pages/PageNotFound'));
const SymptomChecker = lazy(() => import('./components/AI/SymptomChecker'));
const FamilyManagement = lazy(() => import('./components/Family/FamilyManagement'));

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

const PageLoader = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
        <Heart size={20} fill="currentColor" className="animate-pulse" />
      </div>
    </div>
    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Initializing Terminal...</p>
  </div>
);

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="min-h-screen pt-20">
        {children}
      </main>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        {user ? (
          <AuthenticatedLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<ReportList />} />
              <Route path="/upload-report" element={<UploadReport />} />
              <Route path="/report/:id" element={<ReportView />} />
              <Route path="/vitals" element={<VitalsList />} />
              <Route path="/vitals/:id" element={<VitalDetail />} />
              <Route path="/add-vitals" element={<AddVitals />} />
              <Route path="/edit-vital/:id" element={<AddVitals />} />
              <Route path="/edit-report/:id" element={<UploadReport />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/ai-assistant" element={<SymptomChecker />} />
              <Route path="/family" element={<FamilyManagement />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </AuthenticatedLayout>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/register" element={<Navigate to="/auth" />} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}
      </Suspense>
    </Router>
  );
}

export default App;