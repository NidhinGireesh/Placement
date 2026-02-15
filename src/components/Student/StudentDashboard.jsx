import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { getStudentProfile } from '../../services/studentService';

// Components
import StudentProfile from './StudentProfile';
import JobBoard from './JobBoard';
import ApplicationTracking from './ApplicationTracking';
import InterviewSchedule from './InterviewSchedule';
import StudentTraining from './StudentTraining';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const result = await getStudentProfile(user.uid);
    if (result.success) {
      setStudentProfile(result);
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false); // Close menu on selection
      }}
      className={`w-full flex items-center px-6 py-4 transition-colors duration-200 
        ${activeTab === id
          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'text-green-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Top Header */}
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Welcome back, <span className="text-blue-600">{user?.name}</span>! 👋
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your applications today.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
                  {user?.name?.charAt(0) || 'S'}
                </div>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`stat-card border-l-4 ${getStatusColor(studentProfile?.approvalStatus).replace('text-', 'border-l-')}`}>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Profile Status</h3>
                <p className={`text-2xl font-bold mt-1 ${getStatusColor(studentProfile?.approvalStatus)}`}>
                  {studentProfile?.approvalStatus || 'Pending'}
                </p>
              </div>

              <div className="stat-card border-l-blue-500">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Apps</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">3</p>
              </div>

              <div className="stat-card border-l-purple-500">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Interviews</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">1</p>
              </div>

              <div className="stat-card border-l-green-500">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Placement</h3>
                <p className="text-xl font-bold text-gray-800 mt-2">Not Yet</p>
              </div>
            </div>

            {/* Quick Actions / Recent Updates */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg mr-3 text-base">📢</span>
                Recent Updates
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800">Complete Your Profile</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Please ensure your profile is 100% complete to apply for upcoming drives.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                    >
                      Action Required
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800">New Job Posted: TechCorp Solutions</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Software Engineer role available in Bangalore.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'profile':
        return <StudentProfile />;
      case 'jobs':
        return <JobBoard />;
      case 'applications':
        return <ApplicationTracking />;
      case 'interviews':
        return <InterviewSchedule />;
      case 'training':
        return <StudentTraining />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-blue-600 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Student Portal
            </h2>
            <p className="text-xs text-gray-400 mt-1">Placement Management System</p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <SidebarItem id="overview" icon="📊" label="Overview" />
          <SidebarItem id="profile" icon="👨‍🎓" label="My Profile" />
          <SidebarItem id="jobs" icon="💼" label="Job Board" />
          <SidebarItem id="applications" icon="📝" label="Applications" />
          <SidebarItem id="interviews" icon="🤝" label="Interviews" />
          <SidebarItem id="training" icon="📚" label="Courses & Training" />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-semibold"
          >
            <span className="mr-3 text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full pt-16 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}