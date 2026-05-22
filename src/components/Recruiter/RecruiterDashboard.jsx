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

import UserProfile from '../Shared/UserProfile';
import AnnouncementsView from '../Shared/AnnouncementsView';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Company profile state
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    location: '',
    website: '',
    description: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Job postings state
  const [jobForm, setJobForm] = useState({
    role: '',
    description: '',
    minCgpa: '',
    maxBacklogs: '',
    targetBranches: [],
    targetYears: [],
    deadline: '',
    package: '',
    location: '',
    selectionProcess: '',
    applyLink: '',
  });
  const [jobPostings, setJobPostings] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [filterJob, setFilterJob] = useState('All Jobs');
  const [filterClass, setFilterClass] = useState('All Classes');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const uniqueJobs = ['All Jobs', ...new Set(jobPostings.map(job => job.role || job.title))];
  const uniqueClasses = ['All Classes', ...new Set(applications.map(app => app.course).filter(Boolean))];

  const jobMap = jobPostings.reduce((acc, job) => {
    acc[job.id] = job.role || job.title;
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
      if (result.company) setIsEditingProfile(false);
      else setIsEditingProfile(true);
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
    venue: '',
    message: '',
  });
  const [selectionList, setSelectionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // Sync Selection List with Shortlisted & Scheduled Candidates
  useEffect(() => {
    const targets = applications.filter(app =>
      app.status?.toLowerCase() === 'shortlisted' ||
      app.status?.toLowerCase() === 'interview scheduled'
    );
    setSelectionList(targets.map(app => ({
      id: app.id,
      name: app.name,
      selected: false,
      ...app
    })));
  }, [applications]);

  // Derived metrics for dashboard stats (Only counting applications for existing jobs)
  const activeJobsCount = jobPostings.filter(job => !job.status || job.status.toLowerCase() === 'active').length;
  
  // Ensure we only count applications for jobs that currently exist to avoid phantom counts
  const validApplications = applications.filter(app => jobMap[app.jobId]);
  
  const totalApplicationsCount = validApplications.length;
  const shortlistedCount = validApplications.filter(
    (app) => app.status?.toLowerCase() === 'shortlisted'
  ).length;
  const interviewScheduledCount = validApplications.filter(
    (app) => app.status?.toLowerCase() === 'interview scheduled'
  ).length;

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'profile':
        return {
          title: <>Welcome, <span className="text-blue-600">{user?.name}</span>! 👋</>,
          subtitle: "Recruiter Dashboard & Profile"
        };
      case 'jobPosting':
        return { title: 'Job Postings', subtitle: 'Create and manage your recruitment drives.' };
      case 'applicationHandling':
        return { title: 'Applications', subtitle: 'Review candidate profiles and shortlist.' };
      case 'selectionProcess':
        return { title: 'Selection Process', subtitle: 'Schedule interviews and finalize hires.' };
      case 'announcements':
        return { title: 'Campus Announcements', subtitle: 'Stay updated with placement news and notices.' };
      default:
        return { title: 'Recruiter Dashboard', subtitle: 'Hiring Portal' };
    }
  };

  const headerContent = getHeaderContent();

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
        showNotification('success', 'Company profile saved successfully.');
        setIsEditingProfile(false);
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
    if (!jobForm.role || !jobForm.description) {
      showNotification('error', 'Please enter a job role and description.');
      return;
    }

    const jobData = {
      ...jobForm,
      title: jobForm.role, // Maintain title for backward compatibility
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
      role: '',
      description: '',
      minCgpa: '',
      maxBacklogs: '',
      targetBranches: [],
      targetYears: [],
      deadline: '',
      package: '',
      location: '',
      selectionProcess: '',
      applyLink: '',
    });
  };

  const handleEditJob = (job) => {
    setJobForm({
      role: job.role || job.title || '',
      description: job.description || '',
      minCgpa: job.minCgpa || job.cgpa || '',
      maxBacklogs: job.maxBacklogs || '0',
      targetBranches: job.targetBranches || [],
      targetYears: job.targetYears || [],
      deadline: job.deadline || '',
      package: job.package || job.packageDetails || '',
      location: job.location || '',
      selectionProcess: job.selectionProcess || '',
      applyLink: job.applyLink || '',
    });
    setEditingJobId(job.id);
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

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    const selectedCandidates = selectionList.filter(cand => cand.selected);
    if (selectedCandidates.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one candidate.' });
      return;
    }

    if (!interviewSchedule.date || !interviewSchedule.time || !interviewSchedule.venue) {
      setNotification({ type: 'error', message: 'Date, Time, and Venue are required.' });
      return;
    }

    if (!interviewSchedule.date || !interviewSchedule.time) {
      showNotification('error', 'Please fill in both Date and Time.');
      return;
    }

    let successCount = 0;
    for (const cand of selectedCandidates) {
      const result = await updateApplicationStatus(cand.id, 'Interview Scheduled', {
        interviewDate: interviewSchedule.date,
        interviewTime: interviewSchedule.time,
        interviewVenue: interviewSchedule.venue,
        interviewMessage: interviewSchedule.message || ''
      });
      if (result.success) successCount++;
    }

    if (successCount > 0) {
      showNotification('success', `Scheduled interview for ${successCount} candidates.`);
      fetchApplications();
      setInterviewSchedule({ candidate: '', date: '', time: '', message: '' });
    } else {
      showNotification('error', 'Failed to schedule interviews.');
    }
  };

  const toggleSelectedCandidate = (id) => {
    setSelectionList((prev) =>
      prev.map((cand) =>
        cand.id === id ? { ...cand, selected: !cand.selected } : cand
      )
    );
  };

  const handleDeleteInterview = async (candId) => {
    if (!window.confirm('Are you sure you want to delete this interview schedule? The candidate will be moved back to Shortlisted.')) return;
    
    const result = await updateApplicationStatus(candId, 'Shortlisted', {
      interviewDate: null,
      interviewTime: null,
      interviewVenue: null,
      interviewMessage: null
    });
    
    if (result.success) {
      showNotification('success', 'Interview schedule deleted successfully.');
      fetchApplications();
    } else {
      showNotification('error', result.error);
    }
  };

  const handleEditInterview = (cand) => {
    setInterviewSchedule({
      candidate: cand.id,
      date: cand.interviewDate || '',
      time: cand.interviewTime || '',
      venue: cand.interviewVenue || '',
      message: cand.interviewMessage || ''
    });
    
    // Auto-select ONLY this candidate for easier editing
    setSelectionList(prev => prev.map(c => ({
      ...c,
      selected: c.id === cand.id
    })));
    
    // Scroll to form (optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publishSelectedList = () => {
    setIsPublished(true);
    showNotification('success', 'Selected candidate list published.');
  };

  const unpublishSelectedList = () => {
    setIsPublished(false);
    showNotification('success', 'Selected candidate list unpublished.');
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'jobPosting', label: 'Job Posting', icon: '📢' },
    { id: 'applicationHandling', label: 'Applications', icon: '📄' },
    { id: 'selectionProcess', label: 'Selection Process', icon: '✅' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-blue-600 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <span className="text-2xl">✕</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 
          w-64 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'} 
          bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          {isSidebarOpen ? (
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                RECRUITER
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Hiring Portal</p>
            </div>
          ) : (
            <span className="text-xl font-black text-blue-600 mx-auto">RC</span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hidden md:block transition-colors border border-transparent hover:border-gray-200"
          >
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    flex items-center w-full px-3 py-3 rounded-xl transition-all duration-200 group relative
                    ${activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  {activeTab === item.id && (
                    <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  <span className={`text-xl min-w-[1.5rem] flex justify-center transform group-hover:scale-110 transition-all duration-300 ${activeTab === item.id ? 'text-blue-600' : 'grayscale group-hover:grayscale-0'}`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className={`ml-3 font-semibold truncate ${activeTab === item.id ? 'text-blue-700' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {activeTab === item.id && !isSidebarOpen && (
                    <div className="absolute left-16 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-gray-100 mt-auto pb-8">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group
              ${!isSidebarOpen && 'justify-center'}
            `}
          >
            <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
            {isSidebarOpen && <span className="ml-3 font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col bg-gray-50/50">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 custom-scrollbar">
          {notification && (
            <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white animate-fadeIn ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
              {notification.message}
            </div>
          )}

          <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
            {/* Unified Top Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 border-b border-gray-200/50 pb-6 relative">
              <div className="flex items-center gap-4">
                {activeTab !== 'overview' && (
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group shrink-0"
                    title="Back to Dashboard"
                  >
                    <span className="text-xl group-hover:-translate-x-1 inline-block transition-transform duration-200">⬅️</span>
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {headerContent.title}
                  </h1>
                  <p className="text-gray-500 mt-2 font-medium">{headerContent.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setActiveTab('announcements')} 
                  className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View Announcements"
                >
                  <span className="text-2xl">🔔</span>
                  <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <button
                  onClick={() => setActiveTab('my-profile')}
                  className="h-12 w-12 rounded-full text-blue-600 flex items-center justify-center font-black text-xl shadow-sm border-2 border-white ring-2 ring-gray-50 overflow-hidden cursor-pointer hover:ring-blue-200 transition-all"
                >
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </button>
              </div>
            </header>

            {/* PROFILE SECTION */}
            {activeTab === 'my-profile' && <UserProfile />}
            {activeTab === 'announcements' && <AnnouncementsView />}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <button 
                    onClick={() => setActiveTab('jobPosting')}
                    className="group bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
                  >
                    <div className="relative z-10">
                      <p className="text-blue-100 font-bold uppercase tracking-wider text-[10px] mb-1">Active Job Postings</p>
                      <h3 className="text-4xl font-black">{activeJobsCount}</h3>
                      <p className="text-xs text-blue-200 mt-2 font-medium">Positions open for applications</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                      <span className="text-9xl grayscale brightness-200">📢</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('applicationHandling')}
                    className="group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
                  >
                    <div className="relative z-10">
                      <p className="text-indigo-100 font-bold uppercase tracking-wider text-[10px] mb-1">Total Applications</p>
                      <h3 className="text-4xl font-black">{totalApplicationsCount}</h3>
                      <p className="text-xs text-indigo-200 mt-2 font-medium">Candidates applied for jobs</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                      <span className="text-9xl grayscale brightness-200">📄</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('applicationHandling')}
                    className="group bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-2xl p-6 text-white shadow-xl shadow-fuchsia-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
                  >
                    <div className="relative z-10">
                      <p className="text-fuchsia-100 font-bold uppercase tracking-wider text-[10px] mb-1">Interviews Scheduled</p>
                      <h3 className="text-4xl font-black">{interviewScheduledCount}</h3>
                      <p className="text-xs text-fuchsia-200 mt-2 font-medium">Candidates with interview dates</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                      <span className="text-9xl grayscale brightness-200">🤝</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('selectionProcess')}
                    className="group bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
                  >
                    <div className="relative z-10">
                      <p className="text-emerald-100 font-bold uppercase tracking-wider text-[10px] mb-1">Shortlisted</p>
                      <h3 className="text-4xl font-black">{shortlistedCount}</h3>
                      <p className="text-xs text-emerald-200 mt-2 font-medium">Selected for next rounds</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                      <span className="text-9xl grayscale brightness-200">✅</span>
                    </div>
                  </button>
                </div>

                  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">Company Profile</h3>
                        <p className="text-sm text-slate-500">
                          {isEditingProfile ? 'Update your company details' : 'Your company information'}
                        </p>
                      </div>
                    {!isEditingProfile && (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all active:scale-95"
                      >
                        ✏️ Edit Profile
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    {isEditingProfile ? (
                      <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company Name</label>
                            <input
                              type="text"
                              name="name"
                              value={companyProfile.name}
                              onChange={handleProfileChange}
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                              placeholder="Enter company name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Location</label>
                            <input
                              type="text"
                              name="location"
                              value={companyProfile.location}
                              onChange={handleProfileChange}
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                              placeholder="City, Country"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Website URL</label>
                            <input
                              type="url"
                              name="website"
                              value={companyProfile.website}
                              onChange={handleProfileChange}
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                              placeholder="https://example.com"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Company Description</label>
                            <textarea
                              name="description"
                              value={companyProfile.description}
                              onChange={handleProfileChange}
                              rows={4}
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700 resize-none translate-y-0"
                              placeholder="Describe your company culture, values, and vision..."
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Corporation</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">{companyProfile.name || 'Not Set'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Headquarters</p>
                            <p className="text-lg font-bold text-slate-600">{companyProfile.location || 'Not Specified'}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Official Site</p>
                            <a 
                              href={companyProfile.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-lg font-bold text-indigo-600 hover:underline inline-flex items-center gap-2"
                            >
                              {companyProfile.website ? (
                                <>🌐 {new URL(companyProfile.website).hostname}</>
                              ) : 'None'}
                            </a>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">About the Company</p>
                          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                             <p className="text-slate-600 leading-relaxed font-medium">
                               {companyProfile.description || 'No description provided yet. Click edit to add details about your company.'}
                             </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* JOB POSTING SECTION */}
            {activeTab === 'jobPosting' && (
              <div className="grid grid-cols-1 gap-10">
                {/* Header with New Posting Toggle */}
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Opportunities</h3>
                    <p className="text-sm text-slate-500 font-medium">Create and manage your campus recruitment drives.</p>
                  </div>
                  <button
                    onClick={() => {
                        setEditingJobId(null);
                        setJobForm({
                            role: '',
                            description: '',
                            minCgpa: '',
                            maxBacklogs: '',
                            targetBranches: [],
                            targetYears: [],
                            deadline: '',
                            package: '',
                            location: '',
                            selectionProcess: '',
                            applyLink: '',
                        });
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                  >
                    <span>+</span> New Posting
                  </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                  {/* Job Posting Form */}
                  <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden sticky top-8">
                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative">
                      <h4 className="text-2xl font-black tracking-tight">{editingJobId ? 'Edit Posting' : 'Create New Posting'}</h4>
                      <p className="text-indigo-100 text-xs font-medium opacity-80 mt-1">Provide exhaustive details to reach the best candidates.</p>
                      <div className="absolute right-6 top-6 text-5xl opacity-10">📝</div>
                    </div>
                    
                    <form onSubmit={handleJobSubmit} className="p-8 space-y-8">
                      {/* Section: Job Basics */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">01</span>
                           <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest">Job Basics</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                             <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Role / Position</label>
                            <input
                              type="text"
                              name="role"
                              required
                              value={jobForm.role}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                              placeholder="e.g. Frontend Developer"
                            />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Location</label>
                            <input
                              type="text"
                              name="location"
                              required
                              value={jobForm.location}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                              placeholder="e.g. Bangalore, Remote"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section: Eligibility & Package */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px]">02</span>
                           <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest">Eligibility</h5>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Package</label>
                            <input
                              type="text"
                              name="package"
                              required
                              value={jobForm.package}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                              placeholder="e.g. 8 LPA"
                            />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Min CGPA</label>
                            <input
                              type="number"
                              step="0.01"
                              name="minCgpa"
                              required
                              value={jobForm.minCgpa}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Max Backlogs</label>
                            <input
                              type="number"
                              name="maxBacklogs"
                              required
                              value={jobForm.maxBacklogs}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section: Targets */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-indigo-900 uppercase tracking-widest px-1">Branches</label>
                           <div className="flex flex-wrap gap-1.5">
                              {['CSE', 'ECE', 'MECH', 'EEE', 'IT', 'RAI'].map(b => (
                                <button
                                  key={b}
                                  type="button"
                                  onClick={() => {
                                     const current = jobForm.targetBranches || [];
                                     const next = current.includes(b) ? current.filter(x => x !== b) : [...current, b];
                                     setJobForm(prev => ({ ...prev, targetBranches: next }));
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight transition-all border ${jobForm.targetBranches?.includes(b)
                                    ? 'bg-indigo-600 text-white border-transparent'
                                    : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'
                                  }`}
                                >
                                  {b}
                                </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-indigo-900 uppercase tracking-widest px-1">Batches</label>
                           <div className="flex flex-wrap gap-1.5">
                              {['2024', '2025', '2026', '2027', '2028', '2029'].map(y => (
                                <button
                                  key={y}
                                  type="button"
                                  onClick={() => {
                                     const current = jobForm.targetYears || [];
                                     const next = current.includes(y) ? current.filter(x => x !== y) : [...current, y];
                                     setJobForm(prev => ({ ...prev, targetYears: next }));
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight transition-all border ${jobForm.targetYears?.includes(y)
                                    ? 'bg-indigo-600 text-white border-transparent'
                                    : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-100'
                                  }`}
                                >
                                  {y}
                                </button>
                              ))}
                           </div>
                        </div>
                      </div>

                      {/* Section: Description & Process */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Deadline</label>
                            <input
                              type="date"
                              name="deadline"
                              required
                              value={jobForm.deadline}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1">Direct link (opt)</label>
                            <input
                              type="url"
                              name="applyLink"
                              value={jobForm.applyLink}
                              onChange={handleJobFormChange}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-bold text-slate-700 text-sm"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest px-1 uppercase mb-2 block">Detailed Description & Requirements</label>
                          <textarea
                            name="description"
                            required
                            rows="4"
                            value={jobForm.description}
                            onChange={handleJobFormChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-medium text-slate-700 text-[13px] resize-none"
                            placeholder="Role responsibilities..."
                          ></textarea>
                        </div>
                        <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1 uppercase mb-2 block">Selection Process (Venue, Date, Time)</label>
                          <textarea
                            name="selectionProcess"
                            rows="3"
                            value={jobForm.selectionProcess}
                            onChange={handleJobFormChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-50 focus:bg-white outline-none transition-all font-medium text-slate-700 text-[13px] resize-none"
                            placeholder="Venue, Interview timings..."
                          ></textarea>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-4"
                      >
                        {editingJobId ? 'Update Opportunity' : 'Launch Broadcast'}
                      </button>
                    </form>
                  </div>

                  {/* Job List */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                       Active Drives <span className="w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px]">{jobPostings.length}</span>
                    </h3>
                    {jobPostings.length === 0 ? (
                      <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-100 p-12 text-center">
                        <span className="text-5xl block mb-4">📢</span>
                        <p className="text-slate-400 font-bold">Launch your first drive today!</p>
                      </div>
                    ) : (
                      jobPostings.map((job) => (
                        <div key={job.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[4rem] -translate-y-8 translate-x-8 -z-0 group-hover:scale-110 transition-transform"></div>
                          
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                  {job.role || job.title}
                                </h4>
                                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mt-1">
                                  <span className="text-indigo-600">{job.company}</span>
                                  <span className="text-slate-200">•</span>
                                  <span>{job.location}</span>
                                  <span className="text-slate-200">•</span>
                                  <span className="text-slate-300 font-medium">Applied: {applications.filter(a => a.jobId === job.id).length}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditJob(job)}
                                  className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Package</p>
                                <p className="text-sm font-black text-slate-700">{job.package || job.packageDetails}</p>
                              </div>
                              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Eligibility</p>
                                <p className="text-sm font-black text-indigo-600">{job.minCgpa || job.cgpa} CGPA</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {job.targetBranches?.map(b => (
                                <span key={b} className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tight">
                                  {b}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
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
                            {/* Student Photo */}
                            {app.photoUrl ? (
                              <img
                                src={app.photoUrl}
                                alt={app.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-purple-100 shadow-sm"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-xl font-bold text-purple-600 border-2 border-purple-50 shadow-sm">
                                {(app.name || '?').charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                              app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                              {app.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 mb-1">{app.name}</h4>
                          <p className="text-sm text-slate-700 font-medium mb-1">{jobMap[app.jobId] || 'Unknown Job'}</p>
                          <p className="text-xs text-slate-500 mb-1">{app.course}</p>
                          {app.cgpa && <p className="text-xs text-slate-500 mb-3">CGPA: <span className="font-semibold text-slate-700">{app.cgpa}</span></p>}

                          {/* Resume Link */}
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 mb-2 hover:underline"
                            >
                              <span>📄</span> View Resume
                            </a>
                          ) : (
                            <p className="text-xs text-slate-400 mb-2 italic">No resume uploaded</p>
                          )}
                          <button 
                            onClick={() => setSelectedApplication(app)}
                            className="mt-3 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-sm transition-colors"
                          >
                            👤 View Full Profile
                          </button>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-wrap gap-2">
                          {app.status !== 'Shortlisted' && app.status !== 'Interview Scheduled' && (
                              <button
                                onClick={() => handleUpdateApplicationStatus(app.id, 'Shortlisted')}
                                className="flex items-center gap-1 bg-white border border-green-200 text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                              >
                                ✅ Shortlist
                              </button>
                          )}

                          {app.status !== 'Rejected' && (
                              <button
                                onClick={() => handleUpdateApplicationStatus(app.id, 'Rejected')}
                                className="flex items-center gap-1 bg-white border border-red-200 text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                              >
                                ❌ Reject
                              </button>
                          )}
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
                        <p className="text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3">
                          💡 <span className="text-slate-700">Select candidates</span> from the checklist on the right to schedule them for interview.
                        </p>
                        {selectionList.some(c => c.selected) && (
                          <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wide mb-2">Target Candidates ({selectionList.filter(c => c.selected).length})</label>
                            <div className="flex flex-wrap gap-1.5">
                              {selectionList.filter(c => c.selected).map(c => (
                                <span key={c.id} className="inline-flex items-center bg-white text-indigo-700 border border-indigo-200 px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
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
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Venue / Location</label>
                        <input
                          type="text"
                          name="venue"
                          required
                          value={interviewSchedule.venue}
                          onChange={handleInterviewChange}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="e.g. Conference Room A, Google Meet Link, or Office Address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Additional Instructions (Optional)</label>
                        <textarea
                          name="message"
                          value={interviewSchedule.message}
                          onChange={handleInterviewChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                          placeholder="Add instructions, location, or setup links..."
                        ></textarea>
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

                {/* Scheduled Interviews List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Scheduled Interviews</h3>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {applications.filter(app => app.status?.toLowerCase() === 'interview scheduled').length} total
                    </span>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px] flex-1">
                    {applications.filter(app => app.status?.toLowerCase() === 'interview scheduled').length === 0 ? (
                      <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                        <span className="text-4xl block mb-2">🤝</span>
                        No interviews scheduled yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {applications.filter(app => app.status?.toLowerCase() === 'interview scheduled').map((cand) => (
                          <div key={cand.id} className="p-5 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-slate-50 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-4">
                                {cand.photoUrl ? (
                                  <img src={cand.photoUrl} alt={cand.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                                    {cand.name?.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-black text-slate-800 text-base">{cand.name}</h4>
                                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">{jobMap[cand.jobId]}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditInterview(cand)}
                                  className="p-1 px-2.5 rounded-lg bg-white border border-slate-100 text-indigo-600 hover:bg-indigo-50 transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-1.5"
                                  title="Edit Schedule"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteInterview(cand.id)}
                                  className="p-1 px-2.5 rounded-lg bg-white border border-slate-100 text-red-600 hover:bg-red-50 transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-1.5"
                                  title="Delete Schedule"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-white p-2 rounded-xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                                <p className="text-[11px] font-bold text-slate-700">{cand.interviewDate}</p>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time</p>
                                <p className="text-[11px] font-bold text-slate-700">{cand.interviewTime}</p>
                              </div>
                              <div className="bg-white p-2 rounded-xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Venue</p>
                                <p className="text-[11px] font-bold text-slate-700 truncate">{cand.interviewVenue}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Selection List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-green-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-green-900">👥 Shortlisted Candidates</h3>
                    {isPublished && <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Published</span>}
                  </div>
                  <div className="p-6">
                    <p className="text-slate-500 text-sm mb-4">Select candidates to mark them as final selects for your company.</p>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="🔍 Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-3 mb-6">
                      {selectionList.filter(cand => (cand.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((cand) => (
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
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={publishSelectedList}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-medium shadow-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <span>🚀</span>
                        {isPublished ? 'Update Published List' : 'Publish Final List'}
                      </button>
                      {isPublished && (
                        <button
                          onClick={unpublishSelectedList}
                          className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2 rounded-lg font-medium transition-colors"
                        >
                          Unpublish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Student Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Applicant Details</h3>
              <button 
                  onClick={() => setSelectedApplication(null)}
                  className="text-slate-400 hover:bg-white hover:text-slate-600 p-2 rounded-full transition-colors shadow-sm bg-white"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {selectedApplication.photoUrl ? (
                  <img src={selectedApplication.photoUrl} alt="Profile" className="w-24 h-24 rounded-2xl shadow-md object-cover border-4 border-white shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-indigo-100 text-indigo-500 flex items-center justify-center text-4xl font-bold uppercase shadow-sm shrink-0">
                    {selectedApplication.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedApplication.name}</h2>
                  <p className="text-slate-900 font-medium">{selectedApplication.email}</p>
                  <p className="text-slate-900">{selectedApplication.phone || 'No phone provided'}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                      {selectedApplication.course}
                    </span>
                    {selectedApplication.cgpa && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                        CGPA: {selectedApplication.cgpa}
                      </span>
                    )}
                    {selectedApplication.backlogs !== undefined && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-semibold">
                        Backlogs: {selectedApplication.backlogs}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedApplication.bio && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About</h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedApplication.bio}
                    </p>
                  </div>
              )}

              {/* Skills */}
              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Resume</h4>
                {selectedApplication.resumeUrl ? (
                  <a 
                    href={selectedApplication.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-medium px-4 py-3 rounded-xl transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    View & Download Resume
                  </a>
                ) : (
                  <p className="text-slate-900 italic">No resume provided.</p>
                )}
              </div>
            </div>
            
            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end items-center shrink-0">
                {selectedApplication.status !== 'Shortlisted' && selectedApplication.status !== 'Interview Scheduled' && (
                    <button
                        onClick={() => { handleUpdateApplicationStatus(selectedApplication.id, 'Shortlisted'); setSelectedApplication(null); }}
                        className="bg-white border border-green-200 text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        ✅ Shortlist
                    </button>
                )}
                {selectedApplication.status !== 'Rejected' && (
                    <button
                        onClick={() => { handleUpdateApplicationStatus(selectedApplication.id, 'Rejected'); setSelectedApplication(null); }}
                        className="bg-white border border-red-200 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        ❌ Reject
                    </button>
                )}
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}