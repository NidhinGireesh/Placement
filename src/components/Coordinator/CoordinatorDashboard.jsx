import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function CoordinatorDashboard() {
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
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        color: '#0d9488',
        borderRight: '4px solid #0d9488'
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
            background: 'linear-gradient(to right, #0d9488, #10b981)',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Coordinator
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Management Console</p>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem id="overview" icon="📊" label="Overview" />
          <SidebarItem id="approvals" icon="✅" label="Approvals" />
          <SidebarItem id="students" icon="👨‍🎓" label="Students" />
          <SidebarItem id="drives" icon="🏢" label="Placement Drives" />
          <SidebarItem id="analytics" icon="📈" label="Analytics" />
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
              Hello, <span style={{ color: '#0d9488' }}>{user?.name}</span>
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Manage extensive placement activities effectively.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div style={{
              height: '2.5rem',
              width: '2.5rem',
              borderRadius: '50%',
              backgroundColor: '#ccfbf1',
              color: '#0f766e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}>
              {user?.name?.charAt(0) || 'C'}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2rem' }}>
          <div className="stat-card" style={{ borderBottomWidth: '4px', borderLeftWidth: '0', borderBottomColor: '#eab308' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#6b7280', fontWeight: 500 }}>Pending Approvals</h3>
              <span style={{ fontSize: '1.25rem', backgroundColor: '#fef9c3', color: '#ca8a04', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>⚠️</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>0</p>
            <p style={{ fontSize: '0.875rem', color: '#ca8a04', marginTop: '0.5rem', fontWeight: 500 }}>Action Required</p>
          </div>

          <div className="stat-card" style={{ borderBottomWidth: '4px', borderLeftWidth: '0', borderBottomColor: '#14b8a6' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#6b7280', fontWeight: 500 }}>Eligible Students</h3>
              <span style={{ fontSize: '1.25rem', backgroundColor: '#ccfbf1', color: '#0f766e', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>👥</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>0</p>
            <p style={{ fontSize: '0.875rem', color: '#16a34a', marginTop: '0.5rem', fontWeight: 500 }}>+0 this week</p>
          </div>

          <div className="stat-card" style={{ borderBottomWidth: '4px', borderLeftWidth: '0', borderBottomColor: '#3b82f6' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: '#6b7280', fontWeight: 500 }}>Placed Students</h3>
              <span style={{ fontSize: '1.25rem', backgroundColor: '#dbeafe', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>🎓</span>
            </div>
            <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>0</p>
            <p style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: '0.5rem', fontWeight: 500 }}>0% Placement Rate</p>
          </div>
        </div>

        {/* Action Area */}
        <div className="grid grid-cols-2 gap-6">
          <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button style={{
                padding: '1rem',
                border: '2px dashed #d1d5db',
                borderRadius: '0.75rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#4b5563',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.backgroundColor = '#f0fdfa'; e.currentTarget.style.color = '#0f766e'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4b5563'; }}
              >
                Create Drive
              </button>
              <button style={{
                padding: '1rem',
                border: '2px dashed #d1d5db',
                borderRadius: '0.75rem',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#4b5563',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.backgroundColor = '#f0fdfa'; e.currentTarget.style.color = '#0f766e'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#4b5563'; }}
              >
                Review Resumes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}