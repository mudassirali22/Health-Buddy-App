import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import UploadReport from './components/Reports/UploadReport';
import ReportView from './components/Reports/reportView/ReportView';
import ReportList from './components/Reports/ReportList';
import AddVitals from './components/Vitals/AddVitals';
import VitalsList from './components/Vitals/VitalsLists/VitalsList';
import VitalDetail from './components/Vitals/VitalDetails/VitalDetail';
import Timeline from './components/Dashboard/Timeline';
import Navbar from './components/Layout/Navbar';
import Profile from './components/Layout/Profile';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Home from './components/Layout/Home'; 
import PageNotFound from './components/Layout/PageNotFound';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        {user && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={ user ? <Dashboard/> : <Home />}
            
          />
          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload-report"
            element={
              <ProtectedRoute>
                <UploadReport />
              </ProtectedRoute>
            }
          />

          {/*report details route */}
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <ReportView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vitals"
            element={
              <ProtectedRoute>
                <VitalsList />
              </ProtectedRoute>
            }
          />

          {/*vital details route */}
          <Route path="/vitals/:id" element={
            <ProtectedRoute>
              <VitalDetail />
            </ProtectedRoute>
            
            } />

          <Route
            path="/add-vitals"
            element={
              <ProtectedRoute>
                <AddVitals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <Timeline />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;