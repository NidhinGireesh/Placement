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
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Helper to determine active tab if we used routing (optional)
  // For now keeping internal state as per original design

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👨‍🎓' },
    { id: 'recruiters', label: 'Recruiters', icon: '🏢' },
    { id: 'coordinators', label: 'Coordinators', icon: '👔' },
    { id: 'jobs', label: 'Jobs & Placements', icon: '💼' },
    { id: 'courses', label: 'Training & Courses', icon: '📚' },
    { id: 'reports', label: 'Reports', icon: '📑' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-900 border-b border-slate-800">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ADMIN PRO
            </h1>
          ) : (
            <span className="text-xl font-bold mx-auto">AP</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hidden md:block"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group
                    ${activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <span className="text-xl min-w-[1.5rem] flex justify-center transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium truncate">{item.label}</span>
                  )}
                  {activeTab === item.id && !isSidebarOpen && (
                    <div className="absolute left-20 bg-slate-800 text-white p-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b px-8 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-800">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            {activeTab === 'overview' && <DashboardOverview setActiveTab={setActiveTab} />}
            {activeTab === 'students' && <StudentManagement />}
            {activeTab === 'recruiters' && <RecruiterManagement />}
            {activeTab === 'coordinators' && <CoordinatorManagement />}
            {activeTab === 'jobs' && <JobDashboard />}
            {activeTab === 'courses' && <CourseDashboard />}
            {activeTab === 'reports' && <ReportsDashboard />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Add some global styles if not present for scrollbar
// This could be in index.css but handy here for now via style tag if needed
// But since we using Tailwind, we can rely on standard or add custom classes in index.css
