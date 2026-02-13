import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // Student specific
    registerNumber: '',
    passoutYear: '',
    branch: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await registerUser(formData.email, formData.password, formData);

    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 className="auth-title">
          Create Account
        </h2>

        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="admin">Admin</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Student Specific Fields */}
          {formData.role === 'student' && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Register Number
                  </label>
                  <input
                    type="text"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="2024CS001"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Passout Year
                  </label>
                  <input
                    type="text"
                    name="passoutYear"
                    value={formData.passoutYear}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                  <option value="IT">IT</option>
                  <option value="EEE">ECE</option>
                  <option value="RAI">RAI</option>

                </select>
              </div>
            </>
          )}

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="At least 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
