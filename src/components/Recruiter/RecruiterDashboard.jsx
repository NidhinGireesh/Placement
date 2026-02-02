import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function RecruiterDashboard() {
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
      className="sidebar-item"
      style={activeTab === id ? {
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        color: '#9333ea',
        borderRight: '4px solid #9333ea'
      } : {}}
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
            background: 'linear-gradient(to right, #9333ea, #7c3aed)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Recruiter Hub
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Talent Acquisition</p>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem id="overview" icon="📊" label="Overview" />
          <SidebarItem id="jobs" icon="📢" label="My Postings" />
          <SidebarItem id="candidates" icon="👥" label="Candidates" />
          <SidebarItem id="interviews" icon="🗓️" label="Interviews" />
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
        <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
              Welcome, <span style={{ color: '#9333ea' }}>{user?.name}</span>
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Find your next star employee here.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn" style={{
              backgroundColor: '#9333ea',
              color: 'white',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              transform: 'translateY(0)',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              + Post New Job
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7, #4f46e5)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem', opacity: 0.8 }}>
              <h3 style={{ fontWeight: 500 }}>Active Jobs</h3>
              <span style={{ fontSize: '1.5rem' }}>📢</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>0</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', opacity: 0.75 }}>Positions Open</p>
          </div>

          <div className="stat-card" style={{ borderTopWidth: '4px', borderLeftWidth: '0', borderTopColor: '#9333ea' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#6b7280', fontWeight: 500 }}>Total Applications</h3>
              <span style={{ fontSize: '1.25rem', backgroundColor: '#f3e8ff', color: '#9333ea', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>📄</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>0</p>
            <p style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.5rem', fontWeight: 500 }}>New today</p>
          </div>

          <div className="stat-card" style={{ borderTopWidth: '4px', borderLeftWidth: '0', borderTopColor: '#22c55e' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#6b7280', fontWeight: 500 }}>Shortlisted</h3>
              <span style={{ fontSize: '1.25rem', backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>✅</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>0</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', fontWeight: 500 }}>Candidates</p>
          </div>
        </div>
      </main>
    </div>
  );
}