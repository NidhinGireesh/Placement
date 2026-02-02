import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const navigate = useNavigate();
  const { user, role } = useAuthStore();

  return (
    <div className="home-bg">
      {/* Navigation */}
      <nav className="nav-transparent">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl" style={{ fontWeight: 'bold' }}>Placement System</h1>
          <div className="space-x-4 flex">
            {user ? (
              <button
                onClick={() => navigate(`/${role}`)}
                className="btn btn-white"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-white"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn"
                  style={{ border: '2px solid white', color: 'white' }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          College Placement Management System
        </h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.9 }}>
          Streamline your college placements with our comprehensive platform
        </p>

        <div className="grid grid-cols-4 gap-6" style={{ marginTop: '4rem' }}>
          <div className="card-glass">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>👨‍🎓 Students</h3>
            <p>Apply for jobs, track applications, and manage your profile</p>
          </div>
          <div className="card-glass">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>👨‍💼 Coordinators</h3>
            <p>Approve student profiles and monitor placements</p>
          </div>
          <div className="card-glass">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>🏢 Recruiters</h3>
            <p>Post jobs and manage candidate applications</p>
          </div>
          <div className="card-glass">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>👨‍💻 Admins</h3>
            <p>Manage entire system and generate reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}