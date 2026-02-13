import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { user, role } = useAuthStore();

  return (
    <div className="home-bg">
      {/* Navigation */}
      <nav className="nav-transparent">
        <div className="home-container nav-content">
          <h1 className="brand-title">Placement System</h1>
          <div className="nav-actions">
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
                  className="btn btn-outline"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="home-container hero-section">
        <h2 className="hero-title">
          College Placement Management System
        </h2>
        <p className="hero-subtitle">
          Streamline your college placements with our comprehensive platform
        </p>

        <div className="features-grid">
          <div className="card-glass">
            <h3 className="card-title">👨‍🎓 Students</h3>
            <p className="card-desc">Apply for jobs, track applications, and manage your profile</p>
          </div>
          <div className="card-glass">
            <h3 className="card-title">👨‍💼 Coordinators</h3>
            <p className="card-desc">Approve student profiles and monitor placements</p>
          </div>
          <div className="card-glass">
            <h3 className="card-title">🏢 Recruiters</h3>
            <p className="card-desc">Post jobs and manage candidate applications</p>
          </div>
          <div className="card-glass">
            <h3 className="card-title">👨‍💻 Admins</h3>
            <p className="card-desc">Manage entire system and generate reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}
