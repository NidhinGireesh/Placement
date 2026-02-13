import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

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
  });
  const [jobPostings, setJobPostings] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);

  // Applications state (placeholder data for now)
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: 'John Doe',
      course: 'B.Tech CSE',
      status: 'Applied',
      resumeUrl: '#',
    },
    {
      id: 2,
      name: 'Jane Smith',
      course: 'MBA',
      status: 'Applied',
      resumeUrl: '#',
    },
  ]);

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

  const SidebarItem = ({ id, icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className="sidebar-item"
      style={
        activeTab === id
          ? {
              backgroundColor: 'rgba(147, 51, 234, 0.1)',
              color: '#9333ea',
              borderRight: '4px solid #9333ea',
            }
          : {}
      }
    >
      <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>{icon}</span>
      <span style={{ fontWeight: 600 }}>{label}</span>
    </button>
  );

  // Handlers for company profile
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setCompanyProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Hook this to your backend/API as needed
    showNotification('success', 'Company profile saved/updated successfully.');
  };

  // Handlers for job postings
  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) {
      showNotification('error', 'Please enter a job title and description.');
      return;
    }

    if (editingJobId !== null) {
      setJobPostings((prev) =>
        prev.map((job) => (job.id === editingJobId ? { ...job, ...jobForm } : job))
      );
      setEditingJobId(null);
    } else {
      setJobPostings((prev) => [...prev, { id: Date.now(), ...jobForm }]);
    }

    setJobForm({ title: '', description: '', eligibility: '' });
    showNotification(
      'success',
      editingJobId ? 'Job posting updated successfully.' : 'Job posted successfully.'
    );
  };

  const handleEditJob = (job) => {
    setJobForm({
      title: job.title,
      description: job.description,
      eligibility: job.eligibility || '',
    });
    setEditingJobId(job.id);
  };

  const handleDeleteJob = (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobPostings((prev) => prev.filter((job) => job.id !== id));
    }
  };

  // Handlers for applications
  const updateApplicationStatus = (id, status) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
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

  const renderProfileSection = () => (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Recruiter &amp; Company Profile
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Create and update your company profile.
      </p>

      <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={companyProfile.name}
            onChange={handleProfileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={companyProfile.location}
            onChange={handleProfileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="City, Country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={companyProfile.website}
            onChange={handleProfileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Description
          </label>
          <textarea
            name="description"
            value={companyProfile.description}
            onChange={handleProfileChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe your company, culture and values."
          />
        </div>
        <button
          type="submit"
          className="btn bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-purple-700 transition"
        >
          Save Profile
        </button>
      </form>
    </section>
  );

  const renderJobPostingSection = () => (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">Job Posting</h2>
      <p className="text-sm text-gray-500 mb-4">
        Post job roles, define descriptions &amp; eligibility, and manage postings.
      </p>

      <form onSubmit={handleJobSubmit} className="space-y-4 max-w-2xl mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            value={jobForm.title}
            onChange={handleJobFormChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            name="description"
            value={jobForm.description}
            onChange={handleJobFormChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe the role, responsibilities, and tech stack."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eligibility Criteria
          </label>
          <textarea
            name="eligibility"
            value={jobForm.eligibility}
            onChange={handleJobFormChange}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="CGPA, skills, batch, etc."
          />
        </div>
        <button
          type="submit"
          className="btn bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-purple-700 transition"
        >
          {editingJobId ? 'Update Job Posting' : 'Post Job'}
        </button>
      </form>

      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Current Job Postings
      </h3>
      {jobPostings.length === 0 ? (
        <p className="text-sm text-gray-500">No job postings yet.</p>
      ) : (
        <div className="space-y-3">
          {jobPostings.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  {job.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Description:</span>{' '}
                  {job.description}
                </p>
                {job.eligibility && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Eligibility:</span>{' '}
                    {job.eligibility}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleEditJob(job)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderApplicationsSection = () => (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Application Handling
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        View application list, download resumes, shortlist or reject candidates.
      </p>

      {applications.length === 0 ? (
        <p className="text-sm text-gray-500">No applications found.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h4 className="text-base font-semibold text-gray-800">
                  {app.name}
                </h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Course:</span> {app.course}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> {app.status}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View / Download Resume
                </a>
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                  className="text-sm text-green-600 hover:underline"
                >
                  Shortlist
                </button>
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                  className="text-sm text-red-500 hover:underline"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderSelectionSection = () => (
    <section>
      <h2 className="text-2xl font-semibold text-gray-800 mb-1">
        Selection Process
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Schedule interviews (optional), update final selection results, and
        publish the selected candidate list.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Schedule Interview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Schedule Interview (Optional)
          </h3>
          <form onSubmit={handleInterviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                name="candidate"
                value={interviewSchedule.candidate}
                onChange={handleInterviewChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter candidate name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                name="date"
                value={interviewSchedule.date}
                onChange={handleInterviewChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Time
              </label>
              <input
                type="time"
                name="time"
                value={interviewSchedule.time}
                onChange={handleInterviewChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="btn bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-purple-700 transition"
            >
              Schedule Interview
            </button>
          </form>
        </div>

        {/* Final Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Final Selection Results
          </h3>
          <div className="space-y-3 mb-4">
            {selectionList.map((cand) => (
              <div
                key={cand.id}
                className="border border-gray-200 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {cand.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Status:{' '}
                    <span className="font-medium">
                      {cand.selected ? 'Selected' : 'Not Selected'}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSelectedCandidate(cand.id)}
                  className="text-xs text-purple-600 hover:underline"
                >
                  {cand.selected ? 'Mark as Not Selected' : 'Mark as Selected'}
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={publishSelectedList}
            className="btn bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-green-700 transition"
          >
            {isPublished ? 'Re-publish Selected List' : 'Publish Selected List'}
          </button>
          {isPublished && (
            <p className="text-xs text-gray-500 mt-2">
              Selected candidate list has been published.
            </p>
          )}
        </div>
      </div>
    </section>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #9333ea, #7c3aed)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Recruiter Hub
          </h2>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: '0.25rem',
            }}
          >
            Talent Acquisition
          </p>
        </div>

        <nav className="sidebar-nav">
          <SidebarItem
            id="profile"
            icon="🏢"
            label="Recruiter & Company Profile"
          />
          <SidebarItem id="jobPosting" icon="📢" label="Job Posting" />
          <SidebarItem
            id="applicationHandling"
            icon="📄"
            label="Application Handling"
          />
          <SidebarItem
            id="selectionProcess"
            icon="✅"
            label="Selection Process"
          />
        </nav>

        <div
          style={{
            padding: '1.5rem',
            marginTop: 'auto',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#ef4444',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            <span style={{ marginRight: '0.75rem' }}>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header
          className="flex justify-between items-center"
          style={{ marginBottom: '2rem' }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
              }}
            >
              Welcome, <span style={{ color: '#9333ea' }}>{user?.name}</span>
            </h1>
            <p
              style={{
                color: '#6b7280',
                marginTop: '0.25rem',
              }}
            >
              Manage your company profile, job postings, applications and
              selection process.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="btn"
              style={{
                backgroundColor: '#9333ea',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
              onClick={() => setActiveTab('jobPosting')}
            >
              + Post New Job
            </button>
          </div>
        </header>

        {activeTab === 'profile' && (
          <>
            {/* Stats Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              style={{ marginBottom: '2rem' }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #4f46e5)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  color: 'white',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="flex justify-between items-center"
                  style={{ marginBottom: '1rem', opacity: 0.8 }}
                >
                  <h3 style={{ fontWeight: 500 }}>Active Job Postings</h3>
                  <span style={{ fontSize: '1.5rem' }}>📢</span>
                </div>
                <p style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
                  {activeJobsCount}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    marginTop: '0.5rem',
                    opacity: 0.75,
                  }}
                >
                  Positions Open
                </p>
              </div>

              <div
                className="stat-card"
                style={{
                  borderTopWidth: '4px',
                  borderLeftWidth: '0',
                  borderTopColor: '#9333ea',
                }}
              >
                <div
                  className="flex justify-between items-center"
                  style={{ marginBottom: '1rem' }}
                >
                  <h3 style={{ color: '#6b7280', fontWeight: 500 }}>
                    Total Applications
                  </h3>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      backgroundColor: '#f3e8ff',
                      color: '#9333ea',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    📄
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}
                >
                  {totalApplicationsCount}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#16a34a',
                    marginTop: '0.5rem',
                    fontWeight: 500,
                  }}
                >
                  Across all jobs
                </p>
              </div>

              <div
                className="stat-card"
                style={{
                  borderTopWidth: '4px',
                  borderLeftWidth: '0',
                  borderTopColor: '#22c55e',
                }}
              >
                <div
                  className="flex justify-between items-center"
                  style={{ marginBottom: '1rem' }}
                >
                  <h3 style={{ color: '#6b7280', fontWeight: 500 }}>
                    Shortlisted Candidates
                  </h3>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                    }}
                  >
                    ✅
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}
                >
                  {shortlistedCount}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginTop: '0.5rem',
                    fontWeight: 500,
                  }}
                >
                  Candidates
                </p>
              </div>
            </div>

            {renderProfileSection()}
          </>
        )}

        {activeTab === 'jobPosting' && renderJobPostingSection()}
        {activeTab === 'applicationHandling' && renderApplicationsSection()}
        {activeTab === 'selectionProcess' && renderSelectionSection()}
      </main>
    </div>
  );
}