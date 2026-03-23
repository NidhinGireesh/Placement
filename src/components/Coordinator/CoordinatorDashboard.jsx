import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import CoordinatorSidebar from './CoordinatorSidebar';

// Coordinator Modules
import DashboardOverview from './DashboardOverview';
import StudentManagement from '../Admin/StudentManagement';
import Communication from './Communication';
import TrainingWorkshop from './TrainingWorkshop';
import AnnouncementsView from '../Shared/AnnouncementsView';
import PostAnnouncement from './PostAnnouncement';
import ScheduleInterview from './ScheduleInterview';

// Student Modules (Reused for Coordinator)
import StudentProfile from '../Student/StudentProfile';
import JobBoard from '../Student/JobBoard';
import ApplicationTracking from '../Student/ApplicationTracking';
import InterviewSchedule from '../Student/InterviewSchedule';
import StudentTraining from '../Student/StudentTraining';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentFilter, setStudentFilter] = useState('all');

  const getHeaderContent = () => {
    switch(activeTab) {
      case 'overview':
        return {
          title: <>Welcome back, <span className="text-blue-600">{user?.name || 'Coordinator'}</span>! 👋</>,
          subtitle: "Management Console Overview"
        };
      case 'students':
        return { title: 'Student Management', subtitle: 'Manage student profiles and approvals.' };
      case 'training':
        return { title: 'Training Workshops', subtitle: 'Organize placement training sessions.' };
      case 'announcements':
        return { title: 'Campus Announcements', subtitle: 'Stay updated with placement news and notices.' };
      case 'student-profile':
        return { title: 'My Profile', subtitle: 'Manage your personal and academic information.' };
      case 'student-jobs':
        return { title: 'Placement Opportunities', subtitle: 'Browse and apply for jobs on behalf of students.' };
      case 'student-applications':
        return { title: 'Application Tracking', subtitle: 'Monitor the status of your applications.' };
      case 'student-interviews':
        return { title: 'Interview Schedule', subtitle: 'Keep track of upcoming interviews.' };
      case 'student-training':
        return { title: 'Courses & Training', subtitle: 'Access skill development materials.' };
      default:
        return { title: 'Coordinator Portal', subtitle: 'Placement Management System' };
    }
  };

  const headerContent = getHeaderContent();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardOverview setActiveTab={setActiveTab} setStudentFilter={setStudentFilter} />;
      case 'students': return <StudentManagement initialFilter={studentFilter} />;
      case 'training': return <TrainingWorkshop />;
      case 'announcements': return <AnnouncementsView />;
      case 'student-profile': return <StudentProfile />;
      case 'student-jobs': return <JobBoard />;
      case 'student-applications': return <ApplicationTracking />;
      case 'student-interviews': return <InterviewSchedule />;
      case 'student-training': return <StudentTraining />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-teal-600 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Responsive Sidebar */}
      <div className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <CoordinatorSidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} 
            onLogout={handleLogout} 
        />
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full pt-20 md:pt-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          {/* Unified Top Header */}
          <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 border-b border-gray-200/50 pb-6 relative">
            <div className="flex items-center gap-4">
              {activeTab !== 'overview' && (
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group shrink-0"
                  title="Back to Dashboard"
                >
                  <span className="text-xl group-hover:-translate-x-1 inline-block transition-transform duration-200">⬅️</span>
                </button>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                  {headerContent.title}
                </h1>
                <p className="text-gray-500 mt-2 font-medium">{headerContent.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('announcements')} 
                className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="View Announcements"
              >
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <button
                onClick={() => setActiveTab('student-profile')}
                className="h-12 w-12 rounded-full text-blue-600 flex items-center justify-center font-black text-xl shadow-sm border-2 border-white ring-2 ring-gray-50 overflow-hidden cursor-pointer hover:ring-blue-200 transition-all"
              >
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </button>
            </div>
          </header>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}