import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function AdminDashboard() {
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
      style={{
        color: activeTab === id ? 'white' : '#9ca3af',
        backgroundColor: activeTab === id ? '#1f2937' : 'transparent',
        borderRight: activeTab === id ? '4px solid #ef4444' : 'none'
      }}
      onMouseEnter={(e) => { if (activeTab !== id) { e.currentTarget.style.backgroundColor = '#1f2937'; e.currentTarget.style.color = 'white'; } }}
      onMouseLeave={(e) => { if (activeTab !== id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9ca3af'; } }}
    >
      <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{icon}</span>
      <span style={{ fontWeight: 600 }}>{label}</span>
    </button>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar" style={{ backgroundColor: '#111827', color: 'white' }}>
        <div className="sidebar-header" style={{ borderBottom: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', letterSpacing: '0.05em' }}>
            ADMIN<span style={{ color: '#ef4444' }}>.</span>
          </h2>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Control</p>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: '1rem' }}>
          <SidebarItem id="overview" icon="🖥️" label="Dashboard" />
          <SidebarItem id="users" icon="👥" label="User Management" />
          <SidebarItem id="settings" icon="⚙️" label="System Config" />
          <SidebarItem id="logs" icon="📜" label="Audit Logs" />
        </nav>

        <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid #1f2937' }}>
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
              fontSize: '1rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ef4444'}
          >
            <span style={{ marginRight: '0.75rem' }}>🛑</span>
            <span>Logout System</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ backgroundColor: '#f9fafb' }}>
        <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
              System Overview
            </h1>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Monitoring active system status.</p>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#22c55e', borderRadius: '50%', marginRight: '0.5rem' }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>System Online</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
          <div className="stat-card" style={{ borderTopWidth: '4px', borderLeftWidth: '0', borderTopColor: '#2563eb' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>0</p>
          </div>

          <div className="stat-card" style={{ borderTopWidth: '4px', borderLeftWidth: '0', borderTopColor: '#0d9488' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coordinators</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>0</p>
          </div>

          <div className="stat-card" style={{ borderTopWidth: '4px', borderLeftWidth: '0', borderTopColor: '#9333ea' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recruiters</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>0</p>
          </div>

          <div className="stat-card" style={{ borderTopWidth: '4px', borderLeftWidth: '0', borderTopColor: '#dc2626' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Alerts</h3>
            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginTop: '0.5rem' }}>0</p>
          </div>
        </div>
      </main>
    </div>
  );
}