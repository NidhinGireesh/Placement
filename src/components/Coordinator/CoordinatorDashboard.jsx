
import { Outlet, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import CoordinatorSidebar from './CoordinatorSidebar';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CoordinatorSidebar onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-8 overflow-y-auto">
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