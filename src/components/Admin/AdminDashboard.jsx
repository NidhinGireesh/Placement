import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import DashboardOverview from './DashboardOverview';
import StudentManagement from './StudentManagement';
import RecruiterManagement from './RecruiterManagement';
// We will import these later as we create them
import JobDashboard from './JobManagement/JobDashboard';
import CourseDashboard from './CourseManagement/CourseDashboard';
import ReportsDashboard from './Reports/ReportsDashboard';
import CoordinatorManagement from './CoordinatorManagement';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobFilter, setJobFilter] = useState('All'); // 'All', 'Job', 'Internship'
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-header">
            <h2>
              ADMIN<span className="brand-dot">.</span>
            </h2>
          </div>

          <nav className="sidebar-nav">
            <SidebarItem
              id="overview"
              icon="🖥️"
              label="Dashboard"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <SidebarItem
              id="students"
              icon="🎓"
              label="Student Management"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <SidebarItem
              id="recruiters"
              icon="🏢"
              label="Recruiter Management"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {/* Job & Placement with Sub-menu */}
            <div>
              <button
                onClick={() => {
                  setActiveTab('jobs');
                  setIsJobMenuOpen(!isJobMenuOpen);
                  setJobFilter('All');
                }}
                className={`sidebar-item ${activeTab === 'jobs' ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="sidebar-icon">💼</span>
                  <span className="sidebar-label">Job & Placement</span>
                </div>
                <span className="submenu-toggle-icon">{isJobMenuOpen ? '▼' : '▶'}</span>
              </button>

              {isJobMenuOpen && (
                <div className="submenu-container">
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                      setJobFilter('Job');
                    }}
                    className={`submenu-item ${jobFilter === 'Job' ? 'active' : ''}`}
                  >
                    • Full Time Jobs
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                      setJobFilter('Internship');
                    }}
                    className={`submenu-item ${jobFilter === 'Internship' ? 'active' : ''}`}
                  >
                    • Internships
                  </button>
                </div>
              )}
            </div>

            <SidebarItem
              id="courses"
              icon="📚"
              label="Course Management"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <SidebarItem
              id="reports"
              icon="📊"
              label="Communication & Reports"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <SidebarItem
              id="coordinators"
              icon="👔"
              label="Coordinator Management"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </nav>
        </div>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            🛑 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <DashboardOverview />
        )}

        {activeTab === 'students' && (
          <StudentManagement />
        )}

        {activeTab === 'recruiters' && (
          <RecruiterManagement />
        )}

        {activeTab === 'jobs' && <JobDashboard filterType={jobFilter} />}
        {activeTab === 'courses' && <CourseDashboard />}
        {activeTab === 'reports' && <ReportsDashboard />}
        {activeTab === 'coordinators' && <CoordinatorManagement />}
      </main>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function SidebarItem({ id, icon, label, activeTab, setActiveTab }) {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`sidebar-item ${isActive ? 'active' : ''}`}
    >
      <span className="sidebar-icon">
        {icon}
      </span>
      <span className="sidebar-label">{label}</span>
    </button>
  );
}
