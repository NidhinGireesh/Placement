import { useState } from 'react';
import { updateSecurityCredentials } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { Lock, Mail, Key, AlertCircle, CheckCircle } from 'lucide-react';

export default function AccountSecurity() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    currentPassword: '',
    newEmail: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.currentPassword) {
      setErrorMsg('Current password is required to make security changes.');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    const emailToUpdate = formData.newEmail !== user.email ? formData.newEmail : null;
    const passwordToUpdate = formData.newPassword ? formData.newPassword : null;

    if (!emailToUpdate && !passwordToUpdate) {
      setErrorMsg('No changes detected.');
      return;
    }

    setLoading(true);
    const result = await updateSecurityCredentials(
      formData.currentPassword,
      emailToUpdate,
      passwordToUpdate
    );

    if (result.success) {
      setSuccessMsg('Security credentials updated successfully.');
      if (emailToUpdate) {
        setUser({ ...user, email: emailToUpdate });
      }
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } else {
      setErrorMsg(result.error || 'Failed to update credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8 animate-fadeIn">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
          <Lock size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Account Security</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm flex items-start space-x-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm flex items-start space-x-3">
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Required Authentication</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={16} className="text-gray-400" />
              </div>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter current password to authorize changes"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Update Information</p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="newEmail"
                value={formData.newEmail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter new email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Leave blank to keep same"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Re-type new password"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.currentPassword}
            className={`
              px-6 py-2.5 rounded-lg font-bold text-white shadow-md transition-all
              ${(loading || !formData.currentPassword) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}
            `}
          >
            {loading ? 'Updating securely...' : 'Save Security Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
