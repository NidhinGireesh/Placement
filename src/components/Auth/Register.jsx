import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, getExistingCompanies } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const [role, setRole] = useState('');
  const [step, setStep] = useState(1);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user && user.role) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Checking Authentication...</p>
        </div>
      </div>
    );
  }

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
    gender: '', // New field
    lateralEntry: 'no', // Default to 'no'
    // Coordinator specific
    coordinatorClass: '', // "class" is a reserved keyword
    // Recruiter specific
    company: '',
    designation: '',
    website: '',
    industry: '',
    location: '',
    // Admin specific
    department: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingCompanies, setExistingCompanies] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (formData.role === 'recruiter') {
      getExistingCompanies().then(companies => setExistingCompanies(companies));
    }
  }, [formData.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompanyChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, company: value }));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (companyName) => {
    setFormData(prev => ({ ...prev, company: companyName }));
    setShowSuggestions(false);
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

    try {
      const result = await registerUser(formData.email, formData.password, formData);

      if (result.success) {
        alert(result.message || 'Registration successful! Your account is pending faculty admin approval.');
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error in UI:', err);
      setError('An unexpected error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden py-20">

      {/* Back to Home */}
      <Link to="/" className="absolute top-8 left-8 text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="p-8 rounded-2xl w-full max-w-2xl relative z-10 bg-white shadow-2xl border border-slate-100">
        <h2 className="text-center text-3xl font-bold mb-2 text-slate-800">
          Create Account
        </h2>
        <p className="text-center text-slate-500 mb-8">Join the platform today</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['student', 'coordinator', 'admin', 'recruiter'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`py-2 px-1 rounded-lg text-sm font-medium capitalize transition-all ${formData.role === role
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {role === 'coordinator' ? 'Student Coordinator' : role === 'admin' ? 'Faculty Admin' : role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="9876543210"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Student & Coordinator Shared Fields */}
          {(formData.role === 'student' || formData.role === 'coordinator') && (
            <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 space-y-4">
              <h4 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">Academic Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Register Number
                  </label>
                  <input
                    type="text"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="2024CS001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Passout Year / Batch
                  </label>
                  <select
                    name="passoutYear"
                    value={formData.passoutYear}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="IT">IT</option>
                    <option value="EEE">EEE</option>
                    <option value="RAI">RAI</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lateral Entry?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="lateralEntry"
                        value="yes"
                        checked={formData.lateralEntry === 'yes'}
                        onChange={handleChange}
                        className="accent-indigo-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="lateralEntry"
                        value="no"
                        checked={formData.lateralEntry === 'no'}
                        onChange={handleChange}
                        className="accent-indigo-500"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Gender
                </label>
                <div className="flex gap-4">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="accent-indigo-500"
                        required={formData.role === 'student' || formData.role === 'coordinator'}
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recruiter Specific Fields */}
          {formData.role === 'recruiter' && (
            <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 space-y-4">
              <h4 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">Company & Professional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleCompanyChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Tech Solutions Inc."
                    required
                  />
                  {showSuggestions && formData.company && existingCompanies.filter(c => c.toLowerCase().includes(formData.company.toLowerCase()) && c !== formData.company).length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {existingCompanies
                        .filter(c => c.toLowerCase().includes(formData.company.toLowerCase()) && c !== formData.company)
                        .map((c, i) => (
                          <li
                            key={i}
                            className="p-3 hover:bg-indigo-50 cursor-pointer text-slate-700"
                            onClick={() => handleSuggestionClick(c)}
                          >
                            {c}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. HR Manager"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Industry Type
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="">Select Industry</option>
                    <option value="IT">IT / Software</option>
                    <option value="Core">Core Engineering</option>
                    <option value="Finance">Finance / Banking</option>
                    <option value="Consulting">Consulting</option>
                    <option value="EdTech">EdTech</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location (City)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Bangalore"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Admin Specific Fields */}
          {formData.role === 'admin' && (
            <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 space-y-4">
              <h4 className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2">Faculty Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="IT">IT</option>
                    <option value="EEE">EEE</option>
                    <option value="RAI">RAI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="e.g. Assistant Professor"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="6+ chars"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div >
  );
}
