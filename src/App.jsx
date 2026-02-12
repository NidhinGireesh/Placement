
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setupAuthListener } from './services/authService';
import { useAuthStore } from './store/authStore';

// Pages
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Dashboards
import StudentDashboard from './components/Student/StudentDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import CoordinatorDashboard from './components/Coordinator/CoordinatorDashboard';
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard';

// Coordinator Modules
import DashboardOverview from './components/Coordinator/DashboardOverview';
import StudentVerification from './components/Coordinator/StudentVerification';
// JobMonitoring removed as per requirements
// ApplicationTracking removed as per requirements
// InterviewCoordination removed as per requirements
import Communication from './components/Coordinator/Communication';
import TrainingWorkshop from './components/Coordinator/TrainingWorkshop';
import PostAnnouncement from './components/Coordinator/PostAnnouncement';
import ScheduleInterview from './components/Coordinator/ScheduleInterview';

// Not Found
import NotFound from './pages/NotFound';

function App() {
  const { setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = setupAuthListener((user) => {
      if (user) {
        setUser(user);
        setRole(user.role);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setRole, setLoading]);

  return (

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/coordinator"
        element={
          <ProtectedRoute requiredRole="coordinator">
            <CoordinatorDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="verification" element={<StudentVerification />} />
        {/* JobMonitoring route removed */}
        {/* ApplicationTracking route removed */}
        {/* InterviewCoordination route removed */}
        <Route path="communication" element={<Communication />} />
        <Route path="training" element={<TrainingWorkshop />} />
        <Route path="post-announcement" element={<PostAnnouncement />} />
        <Route path="schedule-interview" element={<ScheduleInterview />} />
      </Route>
      <Route
        path="/recruiter/*"
        element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>

  );
}

export default App;
