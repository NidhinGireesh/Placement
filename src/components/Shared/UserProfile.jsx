import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Camera } from 'lucide-react';
import { uploadProfilePicture } from '../../services/studentService'; // Reusing the same storage service
import AccountSecurity from './AccountSecurity';

export default function UserProfile() {
  const { user, setUser } = useAuthStore();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [localPhoto, setLocalPhoto] = useState(user?.photoUrl || '');

  useEffect(() => {
    setLocalPhoto(user?.photoUrl || '');
  }, [user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    // Reuse studentService upload logic for global profile picture uploads using user.uid
    const result = await uploadProfilePicture(user.uid, file);
    if (result.success) {
      setLocalPhoto(result.photoUrl);
      setUser({ ...user, photoUrl: result.photoUrl }); 
      alert('Profile picture updated successfully!');
    } else {
      alert('Failed to upload picture: ' + result.error);
    }
    setUploadingPhoto(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
        <div className="flex flex-col items-center pb-8 border-b border-gray-100">
          <div className="relative mb-6">
            {localPhoto ? (
              <img
                src={localPhoto}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-100 shadow-sm"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-4 border-blue-50 shadow-sm">
                <span className="text-5xl font-black text-blue-400">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <label className="absolute bottom-1 right-1 p-3 bg-blue-600 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-lg group">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </label>
          </div>
          
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">{user?.name || 'User Profile'}</h2>
          <p className="text-blue-600 font-bold uppercase tracking-wider text-sm mt-1">{user?.role || 'User'}</p>
        </div>

        <div className="pt-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-medium cursor-not-allowed">
              {user?.name || 'Not Set'}
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">To modify your name, please contact the system administrator.</p>
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <AccountSecurity />
      </div>
    </div>
  );
}
