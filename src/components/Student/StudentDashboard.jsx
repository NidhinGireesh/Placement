import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`sidebar-item ${activeTab === id ? 'active' : ''}`}
    >
      <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{icon}</span>
      <span style={{ fontWeight: 600 }}>{label}</span>
    </button>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Student Portal
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Placement Management System</p>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem id="overview" icon="📊" label="Overview" />
          <SidebarItem id="profile" icon="👨‍🎓" label="My Profile" />
          <SidebarItem id="jobs" icon="💼" label="Job Board" />
          <SidebarItem id="applications" icon="📝" label="Applications" />
          <SidebarItem id="interviews" icon="🤝" label="Interviews" />
        </nav>

        <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#ef4444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            <span style={{ marginRight: '0.75rem' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
              Welcome back, <span style={{ color: '#2563eb' }}>{user?.name}</span>! 👋
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Here's what's happening with your applications today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div style={{
              height: '2.5rem',
              width: '2.5rem',
              borderRadius: '50%',
              backgroundColor: '#dbeafe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              {user?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <div className="stat-card" style={{ borderLeftColor: '#facc15' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile Status</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.25rem' }}>Pending</p>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Apps</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>0</p>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#a855f7' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interviews</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.25rem' }}>0</p>
          </div>

          <div className="stat-card" style={{ borderLeftColor: '#22c55e' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placement</h3>
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>Not Yet</p>
          </div>
        </div>

        {/* Content Area Example */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#dbeafe', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', marginRight: '0.75rem', fontSize: '1rem' }}>📢</span>
            Recent Updates
          </h2>

          <div className="space-y-4">
            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#1f2937' }}>Profile Complete?</h4>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>Please ensure your profile is 100% complete to apply for upcoming drives.</p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>Action Required</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}