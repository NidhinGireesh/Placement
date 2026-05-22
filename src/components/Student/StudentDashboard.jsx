import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { getStudentProfile } from '../../services/studentService';
import { getAllJobs } from '../../services/jobService';
import { db } from '../../config/firebaseConfig';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';

// Components
import StudentProfile from './StudentProfile';
import JobBoard from './JobBoard';
import ApplicationTracking from './ApplicationTracking';
import InterviewSchedule from './InterviewSchedule';
import StudentTraining from './StudentTraining';
import AnnouncementsView from '../Shared/AnnouncementsView';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [latestInterview, setLatestInterview] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasNotifications(!snapshot.empty);
    }, (error) => {
      console.error("Error checking announcements:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchProfile();
      fetchApplications();
      fetchRecentJobs();
    }
  }, [user]);

  const fetchRecentJobs = async () => {
    setLoadingRecent(true);
    const result = await getAllJobs();
    if (result.success) {
      const viewedJobs = JSON.parse(localStorage.getItem(`viewed_jobs_${user.uid}`) || '[]');
      const unviewed = result.data
        .filter(job => !viewedJobs.includes(job.id))
        .slice(0, 3);
      setRecentJobs(unviewed);
    }
    setLoadingRecent(false);
  };

  const handleViewJob = (jobId) => {
    const viewedJobs = JSON.parse(localStorage.getItem(`viewed_jobs_${user.uid}`) || '[]');
    if (!viewedJobs.includes(jobId)) {
      viewedJobs.push(jobId);
      localStorage.setItem(`viewed_jobs_${user.uid}`, JSON.stringify(viewedJobs));
    }
    setRecentJobs(prev => prev.filter(j => j.id !== jobId));
    setActiveTab('jobs');
  };

  const fetchProfile = async () => {
    const result = await getStudentProfile(user.uid);
    if (result.success) {
      setStudentProfile(result);
    }
  };

  const fetchApplications = async () => {
    const { getApplicationsForStudent } = await import('../../services/jobService');
    const result = await getApplicationsForStudent(user.uid);
    if (result.success) {
      setApplications(result.data);
      
      // Check for newly scheduled interviews
      const scheduledInterviews = result.data.filter(app => app.status === 'Interview Scheduled');
      if (scheduledInterviews.length > 0) {
        // Find the most recently scheduled one (assuming appliedAt is a proxy or we just show the first unviewed)
        // For simplicity, we show the first one found in this session
        setLatestInterview(scheduledInterviews[0]);
        
        // Only show modal if it hasn't been dismissed in this session (or use localStorage for persistence)
        const dismissed = sessionStorage.getItem(`interview_modal_dismissed_${scheduledInterviews[0].id}`);
        if (!dismissed) {
          setShowInterviewModal(true);
        }
      }
    }
  };

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      logout();
      navigate('/login');
    }
  };

  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false); // Close menu on selection
      }}
      className={`w-full flex items-center px-6 py-4 transition-colors duration-200 
        ${activeTab === id
          ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'text-green-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getHeaderContent = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: <>Welcome back, <span className="text-blue-600">{user?.name}</span>! 👋</>,
          subtitle: "Here's what's happening with your applications today."
        };
      case 'profile':
        return {
          title: "My Profile",
          subtitle: "Manage your personal and academic information"
        };
      case 'jobs':
        return {
          title: "Placement Opportunities",
          subtitle: `Tailored listings based on your branch (${user?.department || 'Not Set'}) and batch (${user?.passoutYear || 'Not Set'})`
        };
      case 'applications':
        return {
          title: "Application Tracking",
          subtitle: "Monitor the status of your applied jobs and internships."
        };
      case 'interviews':
        return {
          title: "Interview Schedule",
          subtitle: "Keep track of your upcoming interviews and past results."
        };
    case 'training':
        return {
          title: "Courses & Training",
          subtitle: "Enhance your skills with our curated learning materials."
        };
      case 'announcements':
        return {
          title: "Campus Announcements",
          subtitle: "Stay updated with placement news and notices."
        };
      default:
        return { title: "Dashboard", subtitle: "Placement Management System" };
    }
  };

  const headerContent = getHeaderContent();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`group bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left`}
              >
                <div className="relative z-10">
                  <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">Profile Status</p>
                  <h3 className="text-3xl font-black tracking-tight">{(studentProfile?.approvalStatus === 'approved' || (studentProfile && studentProfile.phone && studentProfile.cgpa !== undefined && studentProfile.resumeUrl)) ? 'Verified' : 'Pending'}</h3>
                  <p className="text-[10px] text-white/60 mt-2 font-medium uppercase tracking-widest group-hover:opacity-100 transition-opacity flex items-center gap-1 opacity-0">
                    View profile details <span className="text-xl">→</span>
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                  <span className="text-9xl grayscale brightness-200">👨‍🎓</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('applications')}
                className="group bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
              >
                <div className="relative z-10">
                  <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">Active Applications</p>
                  <h3 className="text-4xl font-black tracking-tight">{applications.length}</h3>
                  <p className="text-[10px] text-white/60 mt-2 font-medium uppercase tracking-widest group-hover:opacity-100 transition-opacity flex items-center gap-1 opacity-0">
                    Track applications <span className="text-xl">→</span>
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                  <span className="text-9xl grayscale brightness-200">📄</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('interviews')}
                className="group bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-2xl p-6 text-white shadow-xl shadow-fuchsia-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
              >
                <div className="relative z-10">
                  <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">Pending Interviews</p>
                  <h3 className="text-4xl font-black tracking-tight">{applications.filter(app => app.status === 'Interview Scheduled').length}</h3>
                  <p className="text-[10px] text-white/60 mt-2 font-medium uppercase tracking-widest group-hover:opacity-100 transition-opacity flex items-center gap-1 opacity-0">
                    View schedule <span className="text-xl">→</span>
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                  <span className="text-9xl grayscale brightness-200">🤝</span>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('applications')}
                className="group bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left"
              >
                <div className="relative z-10">
                  <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">Placement</p>
                  <h3 className="text-2xl font-black tracking-tight">{applications.some(app => app.status === 'Hired') ? 'Placed' : 'Not Yet'}</h3>
                  <p className="text-[10px] text-white/60 mt-2 font-medium uppercase tracking-widest group-hover:opacity-100 transition-opacity flex items-center gap-1 opacity-0">
                    Status overview <span className="text-xl">→</span>
                  </p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                  <span className="text-9xl grayscale brightness-200">🎓</span>
                </div>
              </button>
            </div>

            {/* Quick Actions / Recent Updates */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg mr-3 text-base">📢</span>
                Recent Updates
              </h2>

              <div className="space-y-4">
                {(!studentProfile || !studentProfile.phone || !studentProfile.dob || !studentProfile.gender || studentProfile.cgpa === undefined || studentProfile.cgpa === null || !studentProfile.resumeUrl) ? (
                  <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">Complete Your Profile</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Please fill all mandatory fields to apply for upcoming drives.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('profile')}
                        className="text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors shadow-sm"
                      >
                        Action Required
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50/30 rounded-lg border border-green-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">Profile 100% Complete</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Your profile is ready. You can now apply for all eligible jobs.
                        </p>
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <span>✓</span> Verified
                      </div>
                    </div>
                  </div>
                )}

                    {recentJobs.length === 0 ? (
                        <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100 italic text-gray-400 text-center py-8">
                            No new placement updates. You're all caught up!
                        </div>
                    ) : (
                        recentJobs.map((job) => (
                            <div key={job.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800">New Job Posted: {job.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {job.company} - {job.location || 'Multiple Locations'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleViewJob(job.id)}
                                        className="text-xs font-black uppercase tracking-widest bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-600 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
          </>
        );
      case 'profile':
        return <StudentProfile />;
      case 'jobs':
        return <JobBoard />;
      case 'applications':
        return <ApplicationTracking />;
      case 'interviews':
        return <InterviewSchedule />;
      case 'training':
        return <StudentTraining />;
      case 'announcements':
        return <AnnouncementsView />;
      default:
        return <div>Select a tab</div>;
    }
  };

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

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Student Portal
            </h2>
            <p className="text-xs text-gray-400 mt-1">Placement Management System</p>
          </div>
        </div>

        <div className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem id="overview" icon="📊" label="Dashboard" />
          <SidebarItem id="jobs" icon="💼" label="Job Board" />
          <SidebarItem id="applications" icon="📝" label="Applications" />
          <SidebarItem id="interviews" icon="🤝" label="Interviews" />
          <SidebarItem id="training" icon="📚" label="Courses & Training" />
        </div>

        <div className="p-6 border-t border-gray-100 mt-auto pb-8">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-semibold"
          >
            <span className="mr-3 text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full pt-16 md:pt-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
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
                {hasNotifications && (
                  <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
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
          
          {renderContent()}
        </div>
      </main>
      {/* Interview Notification Modal */}
      {showInterviewModal && latestInterview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[320px] w-full overflow-hidden transform transition-all animate-scaleUp border border-white/20">
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-4 text-white relative">
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => {
                    setShowInterviewModal(false);
                    sessionStorage.setItem(`interview_modal_dismissed_${latestInterview.id}`, 'true');
                  }}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md shadow-lg border border-white/10 mx-auto">
                <span className="text-2xl animate-bounce">📅</span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-black mb-0.5 tracking-tight">Interview Alert!</h3>
                <p className="text-indigo-100 text-[11px] font-medium opacity-90">You have an upcoming interview.</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-lg shadow-sm border border-slate-50">🏢</div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1 opacity-70">Company</p>
                    <p className="text-slate-800 font-black text-sm leading-none">{latestInterview.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-lg shadow-sm border border-slate-50">📍</div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1 opacity-70">Venue</p>
                    <p className="text-slate-800 font-black text-sm leading-none break-words">{latestInterview.interviewVenue || 'Check Details'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-lg shadow-sm border border-slate-50">⏰</div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1 opacity-70">Timing</p>
                    <p className="text-slate-800 font-black text-sm leading-none">{latestInterview.interviewDate} @ {latestInterview.interviewTime}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab('interviews');
                    setShowInterviewModal(false);
                    sessionStorage.setItem(`interview_modal_dismissed_${latestInterview.id}`, 'true');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-lg shadow-lg shadow-indigo-100 text-sm transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  View My Schedule
                </button>
                <button
                  onClick={() => {
                    setShowInterviewModal(false);
                    sessionStorage.setItem(`interview_modal_dismissed_${latestInterview.id}`, 'true');
                  }}
                  className="w-full text-slate-400 hover:text-slate-600 font-bold py-1 text-[11px] transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}