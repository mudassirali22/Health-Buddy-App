import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import UploadReport from './components/Reports/UploadReport';
import ReportView from './components/Reports/reportView/ReportView';
import ReportList from './components/Reports/ReportList';
import AddVitals from './components/Vitals/AddVitals';
import VitalsList from './components/Vitals/VitalsLists/VitalsList';
import VitalDetail from './components/Vitals/VitalDetails/VitalDetail';
import Timeline from './components/Dashboard/Timeline';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Navbar/Profile';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Home from './components/pages/Home'; 
import PageNotFound from './components/pages/PageNotFound';
import SymptomChecker from './components/AI/SymptomChecker';
import FamilyManagement from './components/Family/FamilyManagement';
import React from 'react';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

// Layout wrapper for authenticated pages with navbar
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
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
    </Router>
  );
}

export default App;