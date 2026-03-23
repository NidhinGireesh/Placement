import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, resetPassword } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, setRole, loading: authLoading } = useAuthStore();

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
          <p className="text-slate-500 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginUser(email, password);

    if (result.success) {
      setUser(result);
      setRole(result.role);
      navigate(`/${result.role}`);
    } else {
      // result.error will contain the specific messages from authService.js
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      alert('Password reset link sent to your email!');
      setError('');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden">
      {/* Back to Home */}
      <Link to="/" className="absolute top-8 left-8 text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors z-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>

      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="p-8 rounded-2xl w-full max-w-md relative z-10 bg-white shadow-2xl border border-slate-100">
        <h2 className="text-center text-3xl font-bold mb-2 text-slate-800">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Logging in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
