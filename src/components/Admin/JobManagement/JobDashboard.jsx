import React, { useState } from 'react';

export default function JobDashboard({ filterType = 'All' }) {
    const [activeTab, setActiveTab] = useState('listings');
    const [jobs, setJobs] = useState([
        {
            id: 1,
            company: 'TCS',
            role: 'Software Engineer',
            type: 'Job',
            package: '7 LPA',
            eligibility: { cgpa: 7.0, branch: 'CSE', batch: '2025' },
        },
        {
            id: 2,
            company: 'Infosys',
            role: 'System Engineer',
            type: 'Internship',
            package: '20k/mo',
            eligibility: { cgpa: 6.5, branch: 'All', batch: '2025' },
        },
    ]);

    const filteredJobs = filterType === 'All' ? jobs : jobs.filter(j => j.type === filterType);

    // ... (rest of state: applications)

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                {filterType === 'All' ? 'Job & Placement Management' : `${filterType} Management`}
            </h1>

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setActiveTab('listings')}
                    style={activeTab === 'listings' ? activeTabStyle : tabStyle}
                >
                    {filterType === 'All' ? 'All Listings' : `${filterType} Listings`}
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    style={activeTab === 'create' ? activeTabStyle : tabStyle}
                >
                    Post New
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    style={activeTab === 'applications' ? activeTabStyle : tabStyle}
                >
                    Applications
                </button>
            </div>

            {activeTab === 'listings' && <JobListings jobs={filteredJobs} />}
            {activeTab === 'create' && <CreateJobForm setJobs={setJobs} setActiveTab={setActiveTab} defaultType={filterType} />}
            {activeTab === 'applications' && <ApplicationsTable applications={applications} setApplications={setApplications} />}
        </div>
    );
}

function JobListings({ jobs }) {
    return (
        <div style={cardStyle}>
            <h3>Active Job Openings</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Type</th>
                        <th>Package/Stipend</th>
                        <th>Eligibility</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td>{job.company}</td>
                            <td>{job.role}</td>
                            <td>
                                <span style={{
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '4px',
                                    background: job.type === 'Internship' ? '#fef3c7' : '#e0e7ff',
                                    color: job.type === 'Internship' ? '#92400e' : '#3730a3',
                                    fontSize: '0.85rem'
                                }}>
                                    {job.type}
                                </span>
                            </td>
                            <td>{job.package}</td>
                            <td>
                                {job.eligibility.branch} | {job.eligibility.cgpa}+ CGPA
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CreateJobForm({ setJobs, setActiveTab, defaultType = 'Job' }) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        type: defaultType === 'All' ? 'Job' : defaultType,
        package: '',
        cgpa: '',
        branch: 'CSE',
        batch: '2025',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newJob = {
            id: Date.now(),
            company: formData.company,
            role: formData.role,
            type: formData.type,
            package: formData.package,
            eligibility: {
                cgpa: formData.cgpa,
                branch: formData.branch,
                batch: formData.batch,
            },
        };
        setJobs((prev) => [...prev, newJob]);
        alert('Job Posted Successfully!');
        setActiveTab('listings');
    };

    return (
        <div style={cardStyle}>
            <h3>Post New Job Opportunity</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
                <input
                    type="text"
                    placeholder="Company Name"
                    required
                    style={inputStyle}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Job Role"
                    required
                    style={inputStyle}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        style={inputStyle}
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                        <option value="Job">Full Time Job</option>
                        <option value="Internship">Internship</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Package / Stipend"
                        required
                        style={inputStyle}
                        value={formData.package}
                        onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="number"
                        placeholder="Min CGPA"
                        required
                        step="0.1"
                        style={inputStyle}
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    />
                    <select
                        style={inputStyle}
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    >
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="MECH">MECH</option>
                        <option value="EEE">EEE</option>
                        <option value="All">All Branches</option>
                    </select>
                    <select
                        style={inputStyle}
                        value={formData.batch}
                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {formData.type === 'Internship' && (
                        <input
                            type="text"
                            placeholder="Duration (e.g., 6 months)"
                            required
                            style={inputStyle}
                            value={formData.duration || ''}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    )}
                    <input
                        type="date"
                        placeholder="Deadline"
                        style={inputStyle}
                    />
                </div>

                <button type="submit" style={submitBtn}>Post {formData.type}</button>
            </form>
        </div>
    );
}

function ApplicationsTable({ applications, setApplications }) {
    const updateStatus = (id, newStatus) => {
        setApplications((prev) =>
            prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
    };

    return (
        <div style={cardStyle}>
            <h3>Student Applications</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((app) => (
                        <tr key={app.id}>
                            <td>{app.student}</td>
                            <td>{app.company}</td>
                            <td>
                                <span style={getStatusBadge(app.status)}>{app.status}</span>
                            </td>
                            <td>
                                <select
                                    value={app.status}
                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                    style={{ padding: '0.3rem', borderRadius: '4px' }}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Styles
const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
};

const tableStyle = {
    width: '100%',
    marginTop: '1rem',
    borderCollapse: 'collapse',
    textAlign: 'left',
};

const tabStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    borderRadius: '6px',
    color: '#6b7280',
    fontWeight: '600',
};

const activeTabStyle = {
    ...tabStyle,
    background: '#2563eb',
    color: 'white',
};

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    width: '100%',
};

const submitBtn = {
    padding: '0.75rem',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '1rem',
};

function getStatusBadge(status) {
    const base = { padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' };
    if (status === 'Selected') return { ...base, backgroundColor: '#dcfce7', color: '#166534' };
    if (status === 'Rejected') return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
    return { ...base, backgroundColor: '#e0f2fe', color: '#075985' };
}
