import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import CoordinatorSidebar from './CoordinatorSidebar';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
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
        <CoordinatorSidebar onLogout={handleLogout} />
      </div>

      <main className="flex-1 p-8 overflow-y-auto w-full pt-16 md:pt-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Hello, <span className="text-teal-600">{user?.name || 'Coordinator'}</span>
            </h1>
            <p className="text-gray-500 mt-1">Manage all placement activities from one place.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold shadow-sm">
              {user?.name?.charAt(0) || 'C'}
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}