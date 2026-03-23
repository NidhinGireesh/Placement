import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import DashboardOverview from './DashboardOverview';
import StudentManagement from './StudentManagement';
import RecruiterManagement from './RecruiterManagement';
import CoordinatorManagement from './CoordinatorManagement';
import JobDashboard from './JobManagement/JobDashboard';
import CourseDashboard from './CourseManagement/CourseDashboard';
import ReportsDashboard from './Reports/ReportsDashboard';
import AdminManagement from './AdminManagement';
import UploadDrives from './UploadDrives';
import AnnouncementsView from '../Shared/AnnouncementsView';
import UserProfile from '../Shared/UserProfile';
import PostAnnouncement from '../Coordinator/PostAnnouncement';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [studentFilter, setStudentFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: <>Welcome back, <span className="text-blue-600">{user?.name || 'Admin'}</span>! 👋</>,
          subtitle: "Here's an overview of the placement activities."
        };
      case 'students':
        return { title: 'Student Management', subtitle: 'Manage student profiles and approvals.' };
      case 'recruiters':
        return { title: 'Recruiter Management', subtitle: 'Manage company profiles and access.' };
      case 'coordinators':
        return { title: 'Student Coordinators', subtitle: 'Manage coordinator roles and privileges.' };
      case 'jobs':
        return { title: 'Jobs & Placements', subtitle: 'Overview of all active drives and job postings.' };
      case 'courses':
        return { title: 'Training & Courses', subtitle: 'Manage learning materials and offline training sessions.' };
      case 'reports':
        return { title: 'Reports & Analytics', subtitle: 'View and export detailed placement statistics.' };
      case 'admins':
        return { title: 'Faculty Admins', subtitle: 'Manage system administrators and privileges.' };
      case 'uploaddrives':
        return { title: 'Upcoming Drives', subtitle: 'Publish and manage new campus placement drives.' };
      case 'announcements':
        return { title: 'Campus Announcements', subtitle: 'Stay updated with placement news and notices.' };
      case 'profile':
        return { title: 'Admin Profile', subtitle: 'Manage your personal details.' };
      default:
        return { title: 'Dashboard', subtitle: 'Admin Portal' };
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

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'recruiters', label: 'Recruiters', icon: '🏢' },
    { id: 'coordinators', label: 'Student Coordinators', icon: '👔' },
    { id: 'jobs', label: 'Jobs & Placements', icon: '💼' },
    { id: 'courses', label: 'Training & Courses', icon: '📚' },


    { id: 'reports', label: 'Reports', icon: '📑' },
    { id: 'admins', label: 'Faculty Admins', icon: '🛡️' }, // Admin Management Tab
    { id: 'uploaddrives', label: 'Upload Drives', icon: '🚀' },
  ];

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

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {isSidebarOpen ? (
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                FACULTY ADMIN
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Management Portal</p>
            </div>
          ) : (
            <span className="text-xl font-black text-blue-600 mx-auto">FA</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hidden md:block transition-colors border border-transparent hover:border-gray-200"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 group relative
                    ${activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  <span className={`text-xl min-w-[1.5rem] flex justify-center transform group-hover:scale-110 transition-all duration-300 ${activeTab === item.id ? 'text-blue-600' : 'grayscale group-hover:grayscale-0'}`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className={`ml-3 font-semibold truncate ${activeTab === item.id ? 'text-blue-700' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {activeTab === item.id && !isSidebarOpen && (
                    <div className="absolute left-16 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-100 mt-auto pb-8">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
            {isSidebarOpen && <span className="ml-3 font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
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
                  onClick={() => setActiveTab('profile')}
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
            {activeTab === 'overview' && (
              <DashboardOverview 
                setActiveTab={setActiveTab} 
                setStudentFilter={setStudentFilter} 
              />
            )}
            {activeTab === 'students' && (
              <StudentManagement 
                initialFilter={studentFilter} 
                setInitialFilter={setStudentFilter}
              />
            )}
            {activeTab === 'recruiters' && <RecruiterManagement />}
            {activeTab === 'coordinators' && <CoordinatorManagement />}
            {activeTab === 'jobs' && <JobDashboard user={user} />}
            {activeTab === 'courses' && <CourseDashboard />}
            {activeTab === 'reports' && <ReportsDashboard />}
            {activeTab === 'admins' && <AdminManagement />}
            {activeTab === 'uploaddrives' && <UploadDrives />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'profile' && <UserProfile />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Add some global styles if not present for scrollbar
// This could be in index.css but handy here for now via style tag if needed
// But since we using Tailwind, we can rely on standard or add custom classes in index.css
