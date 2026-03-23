import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getStudentProfile, updateStudentProfile, uploadProfilePicture, uploadResume } from '../../services/studentService';
import { Camera, FileText, Upload, CheckCircle, AlertCircle, X, Plus, Lock } from 'lucide-react';
import AccountSecurity from '../Shared/AccountSecurity';

export default function StudentProfile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    photoUrl: user?.photoUrl || '',
    dob: '',
    cgpa: '',
    backlogs: '',
    skills: [],
    branch: '',
    year: '',
    gender: ''
  });

  useEffect(() => {
    if (user?.uid) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    const profile = await getStudentProfile(user.uid);
    if (profile.success) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: profile.phone || '',
        dob: profile.dob || '',
        cgpa: profile.cgpa || '',
        backlogs: profile.backlogs !== undefined ? String(profile.backlogs) : '',
        skills: Array.isArray(profile.skills) ? profile.skills : (profile.skills ? profile.skills.split(',').map(s => s.trim()) : []),
        resumeLink: profile.resumeUrl || '',
        branch: profile.branch || 'Not Set',
        year: profile.passoutYear || 'Not Set',
        gender: profile.gender || '',
        photoUrl: profile.photoUrl || user?.photoUrl || ''
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
      setSkillInput('');
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);
    const result = await uploadProfilePicture(user.uid, file);
    if (result.success) {
      setFormData(prev => ({ ...prev, photoUrl: result.photoUrl }));
      setUser({ ...user, photoUrl: result.photoUrl }); // Update global state
      alert('Profile picture updated successfully!');
    } else {
      alert('Failed to upload picture: ' + result.error);
    }
    setUploadingPhoto(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: add file content type validation (PDF usually)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or Word document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingResume(true);
    const result = await uploadResume(user.uid, file);
    if (result.success) {
      setFormData(prev => ({ ...prev, resumeLink: result.resumeUrl }));
      alert('Resume uploaded successfully!');
    } else {
      alert('Failed to upload resume: ' + result.error);
    }
    setUploadingResume(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.phone) {
      alert("Name and Phone are required.");
      return;
    }

    try {
      setLoading(true);
      const result = await updateStudentProfile(user.uid, formData);

      if (result.success) {
        // Update local auth store so header/sidebar updates immediately
        setUser({ ...user, name: formData.name, phone: formData.phone });

        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Profile...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <div className="flex justify-end items-center mb-8 pb-4 border-b border-gray-100">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isEditing
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
        <div className="relative">
          {formData.photoUrl ? (
            <img
              src={formData.photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-50 shadow-sm">
              <span className="text-4xl font-bold text-indigo-400">
                {formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {isEditing && (
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors shadow-md group">
              <Camera size={18} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </label>
          )}
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-gray-800">{formData.name}</h3>
          <p className="text-gray-500 capitalize">{user?.role === 'coordinator' ? 'Student Coordinator' : 'Student'} • {formData.branch}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Read-only or Standard Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={true} // Email usually not editable
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Department</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              disabled={true}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passout Year / Batch</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              disabled={true}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
            <input
              type="number"
              step="0.01"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Active Backlogs</label>
            <input
              type="number"
              min="0"
              name="backlogs"
              value={formData.backlogs}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 transition-all"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Resume / CV</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {formData.resumeLink ? "Resume Uploaded" : "No Resume Uploaded"}
                  </h4>
                  {formData.resumeLink && (
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle size={14} /> Verified in Storage
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                {formData.resumeLink && (
                  <a
                    href={formData.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                  >
                    View Resume
                  </a>
                )}
                
                {isEditing && (
                  <label className="flex-1 sm:flex-none text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2">
                    <Upload size={16} />
                    {uploadingResume ? 'Uploading...' : 'Upload New'}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                    />
                  </label>
                )}
              </div>
            </div>
            {isEditing && (
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
            <div className={`p-3 rounded-xl border ${isEditing ? 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent' : 'border-gray-200 bg-gray-50'} transition-all`}>
              <div className="flex flex-col gap-2">
                {formData.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center group bg-indigo-50/50 hover:bg-indigo-50 p-2 rounded-lg border border-indigo-100 transition-colors animate-fadeIn"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                      <span className="text-sm font-bold text-indigo-900">{skill}</span>
                    </div>
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="p-1 text-indigo-400 hover:text-indigo-600 hover:bg-white rounded-md transition-all"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <div className="flex items-center gap-2 mt-1 border-t border-gray-100 pt-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type a skill and press Enter"
                      className="flex-1 px-3 py-2 outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg focus:border-indigo-300"
                    />
                    <button 
                      type="button"
                      onClick={handleAddSkill}
                      disabled={!skillInput.trim()}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                )}
                
                {!isEditing && formData.skills.length === 0 && (
                  <span className="text-gray-400 text-sm italic px-2 py-1 flex items-center gap-2">
                    <AlertCircle size={14} /> No skills added yet.
                  </span>
                )}
              </div>
            </div>
            {isEditing && (
              <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Press Enter or click + to add a skill</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all"
              onClick={handleSubmit}
            >
              Save Profile Changes
            </button>
          </div>
        )}
      </form>

      {/* Account Security Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <AccountSecurity />
      </div>
    </div>
  );
}
