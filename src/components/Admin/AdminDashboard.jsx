import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
// We will import these later as we create them
import JobDashboard from './JobManagement/JobDashboard';
import CourseDashboard from './CourseManagement/CourseDashboard';
import ReportsDashboard from './Reports/ReportsDashboard';
import CoordinatorManagement from './CoordinatorManagement';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobFilter, setJobFilter] = useState('All'); // 'All', 'Job', 'Internship'
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);

  // Dummy Data
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', email: 'john@gmail.com', status: 'pending', blocked: false },
    { id: 2, name: 'Alice John', email: 'alice@gmail.com', status: 'approved', blocked: false },
  ]);

  const [recruiters, setRecruiters] = useState([
    { id: 1, company: 'TCS', email: 'hr@tcs.com' },
  ]);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const approveStudent = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: 'approved' } : student
      )
    );
  };

  const toggleBlockStudent = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, blocked: !student.blocked } : student
      )
    );
  };

  const addRecruiter = () => {
    const company = prompt('Enter Company Name');
    const email = prompt('Enter Company Email');

    if (company && email) {
      setRecruiters((prev) => [...prev, { id: Date.now(), company, email }]);
    }
  };

  const removeRecruiter = (id) => {
    setRecruiters((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#111827',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f2937' }}>
            <h2>
              ADMIN<span style={{ color: '#ef4444' }}>.</span>
            </h2>
          </div>

          <nav style={{ marginTop: '1rem' }}>
            <SidebarItem
              id="overview"
              icon="🖥️"
              label="Dashboard"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <SidebarItem
              id="users"
              icon="👥"
              label="User Management"
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1.5rem',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'jobs' ? '#1f2937' : 'transparent',
                  color: activeTab === 'jobs' ? 'white' : '#9ca3af',
                  borderRight: activeTab === 'jobs'
                    ? '4px solid #ef4444'
                    : '4px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>💼</span>
                  <span style={{ fontWeight: 600 }}>Job & Placement</span>
                </div>
                <span style={{ fontSize: '0.8rem' }}>{isJobMenuOpen ? '▼' : '▶'}</span>
              </button>

              {isJobMenuOpen && (
                <div style={{ backgroundColor: '#111827', paddingLeft: '3rem' }}>
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                      setJobFilter('Job');
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0',
                      background: 'transparent',
                      border: 'none',
                      color: jobFilter === 'Job' ? '#fff' : '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    • Full Time Jobs
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('jobs');
                      setJobFilter('Internship');
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0',
                      background: 'transparent',
                      border: 'none',
                      color: jobFilter === 'Internship' ? '#fff' : '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
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
              label="Coordinator Mgmt"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </nav>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            🛑 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f9fafb' }}>
        {activeTab === 'overview' && (
          <DashboardOverview students={students} recruiters={recruiters} />
        )}

        {activeTab === 'users' && (
          <UserManagement
            students={students}
            recruiters={recruiters}
            approveStudent={approveStudent}
            toggleBlockStudent={toggleBlockStudent}
            addRecruiter={addRecruiter}
            removeRecruiter={removeRecruiter}
          />
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
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        width: '100%',
        textAlign: 'left',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isActive ? '#1f2937' : 'transparent',
        color: isActive ? 'white' : '#9ca3af',
        borderRight: isActive
          ? '4px solid #ef4444'
          : '4px solid transparent',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#1f2937';
          e.currentTarget.style.color = 'white';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#9ca3af';
        }
      }}
    >
      <span style={{ marginRight: '0.75rem', fontSize: '1.1rem' }}>
        {icon}
      </span>
      <span style={{ fontWeight: 600 }}>{label}</span>
    </button>
  );
}
