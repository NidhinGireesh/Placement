import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getCurrentUser, updateUserProfile } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import {
  postOpportunity,
  getJobsByRecruiter,
  deleteJob,
  updateJob,
  getApplicationsForRecruiter,
  updateApplicationStatus
} from '../../services/jobService';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Company profile state
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    location: '',
    website: '',
    description: '',
  });

  // Job postings state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    eligibility: '',
    targetBranches: [],
    targetYears: [],
    minCgpa: '',
    maxBacklogs: '',
    deadline: '',
    packageDetails: '',
    location: '',
  });
  const [jobPostings, setJobPostings] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [filterJob, setFilterJob] = useState('All Jobs');
  const [filterClass, setFilterClass] = useState('All Classes');

  const uniqueJobs = ['All Jobs', ...new Set(jobPostings.map(job => job.title))];
  const uniqueClasses = ['All Classes', ...new Set(applications.map(app => app.course).filter(Boolean))];

  const jobMap = jobPostings.reduce((acc, job) => {
    acc[job.id] = job.title;
    return acc;
  }, {});

  const filteredApplications = applications.filter(app => {
    const jobTitle = jobMap[app.jobId];
    if (!jobTitle) return false; // Filter out applications for deleted jobs
    const matchJob = filterJob === 'All Jobs' || jobTitle === filterJob;
    const matchClass = filterClass === 'All Classes' || app.course === filterClass;
    return matchJob && matchClass;
  });

  // Fetch data
  useEffect(() => {
    if (user?.uid) {
      fetchJobs();
      fetchApplications();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const result = await getCurrentUser(user.uid);
    if (result.success) {
      setCompanyProfile({
        name: result.company || '',
        location: result.location || '',
        website: result.website || '',
        description: result.description || '',
      });
    }
  };

  const fetchJobs = async () => {
    const result = await getJobsByRecruiter(user.uid);
    if (result.success) setJobPostings(result.data);
  };

  const fetchApplications = async () => {
    const result = await getApplicationsForRecruiter(user.uid);
    if (result.success) setApplications(result.data);
  };

  // Selection process state
  const [interviewSchedule, setInterviewSchedule] = useState({
    candidate: '',
    date: '',
    time: '',
  });
  const [selectionList, setSelectionList] = useState([
    { id: 1, name: 'John Doe', selected: false },
    { id: 2, name: 'Jane Smith', selected: false },
  ]);
  const [isPublished, setIsPublished] = useState(false);

  // Notification / toast state
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  // Auto-hide notification after a short delay
  useEffect(() => {
    if (!notification) return;
    const timeout = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timeout);
  }, [notification]);

  // Derived metrics for dashboard stats
  const activeJobsCount = jobPostings.length;
  const totalApplicationsCount = applications.length;
  const shortlistedCount = applications.filter(
    (app) => app.status === 'Shortlisted'
  ).length;

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  // Handlers for company profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setCompanyProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await updateUserProfile(user.uid, {
        company: companyProfile.name,
        location: companyProfile.location,
        website: companyProfile.website,
        description: companyProfile.description,
    });
    if (result.success) {
        showNotification('success', 'Company profile saved/updated successfully.');
    } else {
        showNotification('error', result.error);
    }
  };

  // Handlers for job postings
  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetBranches') {
      const branches = Array.from(e.target.selectedOptions, option => option.value);
      setJobForm((prev) => ({ ...prev, [name]: branches }));
    } else {
      setJobForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) {
      showNotification('error', 'Please enter a job title and description.');
      return;
    }

    const jobData = {
      ...jobForm,
      postedBy: user.uid,
      company: companyProfile.name || user.name || 'Company',
    };

    if (editingJobId !== null) {
      const result = await updateJob(editingJobId, jobData);
      if (result.success) {
        showNotification('success', 'Job posting updated successfully.');
        setEditingJobId(null);
        fetchJobs();
      } else {
        showNotification('error', result.error);
      }
    } else {
      const result = await postOpportunity(jobData);
      if (result.success) {
        showNotification('success', 'Job posted successfully.');
        fetchJobs();
      } else {
        showNotification('error', result.error);
      }
    }

    setJobForm({
      title: '',
      description: '',
      eligibility: '',
      targetBranches: [],
      targetYears: [],
      minCgpa: '',
      maxBacklogs: '',
      deadline: '',
      packageDetails: '',
      location: '',
    });
  };

  const handleEditJob = (job) => {
    setJobForm({
      title: job.title || '',
      description: job.description || '',
      eligibility: job.eligibility || '',
      targetBranches: job.targetBranches || [],
      targetYears: job.targetYears || [],
      minCgpa: job.minCgpa || '',
      maxBacklogs: job.maxBacklogs || '',
      deadline: job.deadline || '',
      packageDetails: job.packageDetails || '',
      location: job.location || '',
    });
    setEditingJobId(job.id);
    // Optionally switch to form view or scroll to form
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      const result = await deleteJob(id);
      if (result.success) {
        showNotification('success', 'Job deleted successfully.');
        fetchJobs();
      } else {
        showNotification('error', result.error);
      }
    }
  };

  // Handlers for applications
  const handleUpdateApplicationStatus = async (id, status) => {
    const result = await updateApplicationStatus(id, status);
    if (result.success) {
      showNotification('success', `Application has been marked as ${status}.`);
      fetchApplications();
    } else {
      showNotification('error', result.error);
    }
  };

  // Handlers for selection process
  const handleInterviewChange = (e) => {
    const { name, value } = e.target;
    setInterviewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterviewSubmit = (e) => {
    e.preventDefault();
    showNotification('success', 'Interview scheduled successfully.');
    setInterviewSchedule({ candidate: '', date: '', time: '' });
  };

  const toggleSelectedCandidate = (id) => {
    setSelectionList((prev) =>
      prev.map((cand) =>
        cand.id === id ? { ...cand, selected: !cand.selected } : cand
      )
    );
  };

  const publishSelectedList = () => {
    setIsPublished(true);
    showNotification('success', 'Selected candidate list published.');
  };

  const navItems = [
    { id: 'profile', label: 'Company Profile', icon: '🏢' },
    { id: 'jobPosting', label: 'Job Posting', icon: '📢' },
    { id: 'applicationHandling', label: 'Applications', icon: '📄' },
    { id: 'selectionProcess', label: 'Selection Process', icon: '✅' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl z-20
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-slate-900 border-b border-slate-800">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              RECRUITER
            </h1>
          ) : (
            <span className="text-xl font-bold mx-auto">RH</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hidden md:block"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group
                    ${activeTab === item.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <span className="text-xl min-w-[1.5rem] flex justify-center transform group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium truncate">{item.label}</span>
                  )}
                  {activeTab === item.id && !isSidebarOpen && (
                    <div className="absolute left-20 bg-slate-800 text-white p-2 rounded shadow-lg text-xs whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b px-8 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome, <span className="text-purple-600">{user?.name}</span>
            </h2>
            <p className="text-sm text-slate-500">Recruiter Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('jobPosting')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-transform transform hover:-translate-y-0.5"
            >
              + Post New Job
            </button>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border-2 border-white shadow-sm">
              R
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50">
          {notification && (
            <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white animate-fadeIn ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
              }`}>
              {notification.message}
            </div>
          )}

          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">

            {/* PROFILE SECTION */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-purple-100 font-medium mb-1">Active Job Postings</p>
                      <h3 className="text-4xl font-bold">{activeJobsCount}</h3>
                      <p className="text-xs text-purple-200 mt-2">Positions open for applications</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                      <span className="text-9xl">📢</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 font-medium mb-1">Total Applications</p>
                        <h3 className="text-3xl font-bold text-slate-800">{totalApplicationsCount}</h3>
                      </div>
                      <span className="bg-blue-50 text-blue-600 p-2 rounded-lg text-xl">📄</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-slate-500 font-medium mb-1">Shortlisted</p>
                        <h3 className="text-3xl font-bold text-slate-800">{shortlistedCount}</h3>
                      </div>
                      <span className="bg-green-50 text-green-600 p-2 rounded-lg text-xl">✅</span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Company Profile</h3>
                    <p className="text-sm text-slate-500">Update your company details and description</p>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                          <input
                            type="text"
                            name="name"
                            value={companyProfile.name}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter company name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={companyProfile.location}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                          <input
                            type="url"
                            name="website"
                            value={companyProfile.website}
                            onChange={handleProfileChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">Company Description</label>
                          <textarea
                            name="description"
                            value={companyProfile.description}
                            onChange={handleProfileChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="Describe your company culture, values, and vision..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition-colors"
                        >
                          Save Profile
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* JOB POSTING SECTION */}
            {activeTab === 'jobPosting' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Job Form */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-md border border-slate-200 sticky top-6">
                    <div className="px-6 py-4 border-b border-slate-100 bg-purple-50">
                      <h3 className="text-lg font-bold text-purple-800">
                        {editingJobId ? 'Edit Job Posting' : 'Create New Job'}
                      </h3>
                    </div>
                    <div className="p-6">
                      <form onSubmit={handleJobSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                          <input
                            type="text"
                            name="title"
                            value={jobForm.title}
                            onChange={handleJobFormChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="e.g. Senior Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                          <textarea
                            name="description"
                            value={jobForm.description}
                            onChange={handleJobFormChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Job details..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Eligibility Descriptions</label>
                          <textarea
                            name="eligibility"
                            value={jobForm.eligibility}
                            onChange={handleJobFormChange}
                            rows={2}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="General Requirements..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Target Departments</label>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {['All', 'CSE', 'ECE', 'EEE', 'ME', 'RAI', 'IT'].map(branch => (
                              <label key={branch} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={jobForm.targetBranches.includes(branch)}
                                  onChange={(e) => {
                                    setJobForm(prev => {
                                      const current = prev.targetBranches || [];
                                      if (branch === 'All') {
                                        return { ...prev, targetBranches: current.includes('All') ? [] : ['All'] };
                                      }
                                      const newBranches = current.includes(branch)
                                        ? current.filter(b => b !== branch)
                                        : [...current.filter(b => b !== 'All'), branch];
                                      return { ...prev, targetBranches: newBranches };
                                    });
                                  }}
                                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                  {branch === 'All' ? 'All Branches' : branch}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Target Passout Years</label>
                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {['All', '2024', '2025', '2026', '2027', '2028'].map(year => (
                              <label key={year} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={(jobForm.targetYears || []).includes(year)}
                                  onChange={(e) => {
                                    setJobForm(prev => {
                                      const current = prev.targetYears || [];
                                      if (year === 'All') {
                                        return { ...prev, targetYears: current.includes('All') ? [] : ['All'] };
                                      }
                                      const newYears = current.includes(year)
                                        ? current.filter(y => y !== year)
                                        : [...current.filter(y => y !== 'All'), year];
                                      return { ...prev, targetYears: newYears };
                                    });
                                  }}
                                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-slate-700">
                                  {year === 'All' ? 'All Batches' : year}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Min CGPA</label>
                              <input
                                type="number"
                                step="0.01"
                                name="minCgpa"
                                value={jobForm.minCgpa}
                                onChange={handleJobFormChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g. 7.5"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Max Backlogs</label>
                              <input
                                type="number"
                                name="maxBacklogs"
                                value={jobForm.maxBacklogs}
                                onChange={handleJobFormChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g. 0"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Application Deadline</label>
                            <input
                              type="date"
                              name="deadline"
                              value={jobForm.deadline}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium shadow transition-colors"
                          >
                            {editingJobId ? 'Update Job' : 'Post Job'}
                          </button>
                          {editingJobId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingJobId(null);
                                setJobForm({ title: '', description: '', eligibility: '' });
                              }}
                              className="w-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 py-2 rounded-lg font-medium transition-colors"
                            >
                              Cancel Edit
                            </button>
                          )}
                      </form>
                    </div>
                  </div>
                </div>

                {/* Job List */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Current Openings</h3>
                  {jobPostings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                      <span className="text-4xl block mb-2">📭</span>
                      <p className="text-slate-500">No active job postings. Create one to get started.</p>
                    </div>
                  ) : (
                    jobPostings.map((job) => (
                      <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-800">{job.title}</h4>
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full mt-1 inline-block">Active</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditJob(job)}
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase">Description</p>
                            <p className="text-sm text-slate-700 mt-1">{job.description}</p>
                          </div>
                          {job.eligibility && (
                            <div>
                              <p className="text-xs font-semibold text-slate-500 uppercase">Eligibility</p>
                              <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-2 rounded border border-slate-100 inline-block font-mono text-xs">
                                {job.eligibility}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* APPLICATIONS SECTION */}
            {activeTab === 'applicationHandling' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">Received Applications</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Class:</span>
                        <select 
                            value={filterClass} 
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="text-sm border-slate-300 rounded-md shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        >
                            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Job:</span>
                        <select 
                            value={filterJob} 
                            onChange={(e) => setFilterJob(e.target.value)}
                            className="text-sm border-slate-300 rounded-md shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                        >
                            {uniqueJobs.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                    </div>
                  </div>
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No applications match your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app) => (
                      <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                              👨‍🎓
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                              {app.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 mb-1">{app.name}</h4>
                          <p className="text-sm text-slate-700 font-medium mb-1">{jobMap[app.jobId] || 'Unknown Job'}</p>
                          <p className="text-xs text-slate-500 mb-4">{app.course}</p>

                          <a href={app.resumeUrl} className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 mb-4">
                            <span>📄</span> View Resume
                          </a>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'Shortlisted')}
                            className="flex items-center justify-center gap-1 bg-white border border-green-200 text-green-700 hover:bg-green-50 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            ✅ Shortlist
                          </button>
                          <button
                            onClick={() => handleUpdateApplicationStatus(app.id, 'Rejected')}
                            className="flex items-center justify-center gap-1 bg-white border border-red-200 text-red-700 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SELECTION PROCESS SECTION */}
            {activeTab === 'selectionProcess' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interview Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-indigo-50">
                    <h3 className="text-lg font-bold text-indigo-900">📅 Schedule Interview</h3>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handleInterviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Candidate Name</label>
                        <input
                          type="text"
                          name="candidate"
                          value={interviewSchedule.candidate}
                          onChange={handleInterviewChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="Enter name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                          <input
                            type="date"
                            name="date"
                            value={interviewSchedule.date}
                            onChange={handleInterviewChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                          <input
                            type="time"
                            name="time"
                            value={interviewSchedule.time}
                            onChange={handleInterviewChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium shadow transition-colors"
                      >
                        Schedule Interview
                      </button>
                    </form>
                  </div>
                </div>

                {/* Final Selection List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-green-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-green-900">🏆 Final Selection</h3>
                    {isPublished && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Published</span>}
                  </div>
                  <div className="p-6">
                    <p className="text-slate-500 text-sm mb-4">Select candidates to mark them as final selects for your company.</p>
                    <div className="space-y-3 mb-6">
                      {selectionList.map((cand) => (
                        <div
                          key={cand.id}
                          className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${cand.selected ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${cand.selected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                              {cand.name.charAt(0)}
                            </div>
                            <div>
                              <p className={`font-medium ${cand.selected ? 'text-green-900' : 'text-slate-700'}`}>{cand.name}</p>
                              <p className="text-xs text-slate-500">{cand.selected ? 'Selected' : 'Pending Review'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleSelectedCandidate(cand.id)}
                            className={`text-sm font-medium px-3 py-1 rounded-md transition-colors ${cand.selected
                              ? 'bg-white text-red-600 border border-red-100 hover:bg-red-50'
                              : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                          >
                            {cand.selected ? 'Remove' : 'Select'}
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={publishSelectedList}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>🚀</span>
                      {isPublished ? 'Update Published List' : 'Publish Final List'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}