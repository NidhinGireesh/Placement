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

    // Placeholder applications state
    const [applications, setApplications] = useState([
        { id: 1, student: 'John Doe', company: 'TCS', status: 'Applied' },
        { id: 2, student: 'Jane Smith', company: 'Infosys', status: 'Interview' },
    ]);

    const filteredJobs = filterType === 'All' ? jobs : jobs.filter(j => j.type === filterType);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800">
                    {filterType === 'All' ? 'Job & Placement Management' : `${filterType} Management`}
                </h1>
                <p className="text-slate-500 mt-1">Manage job listings, internships, and student applications.</p>
            </div>

            <div className="flex gap-2 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'listings'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    {filterType === 'All' ? 'All Listings' : `${filterType} Listings`}
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'create'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Post New Opportunity
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'applications'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                >
                    Applications
                </button>
            </div>

            <div className="animate-fadeIn">
                {activeTab === 'listings' && <JobListings jobs={filteredJobs} />}
                {activeTab === 'create' && <CreateJobForm setJobs={setJobs} setActiveTab={setActiveTab} defaultType={filterType} />}
                {activeTab === 'applications' && <ApplicationsTable applications={applications} setApplications={setApplications} />}
            </div>
        </div>
    );
}

function JobListings({ jobs }) {
    if (jobs.length === 0) {
        return <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">No job listings found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-100 p-3 rounded-lg text-2xl">🏢</div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.type === 'Internship' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {job.type}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{job.role}</h3>
                    <p className="text-slate-600 font-medium mb-4">{job.company}</p>

                    <div className="space-y-2 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <span>💰</span> {job.package}
                        </div>
                        <div className="flex items-center gap-2">
                            <span>🎓</span> {job.eligibility.branch} | {job.eligibility.cgpa}+ CGPA
                        </div>
                        <div className="flex items-center gap-2">
                            <span>📅</span> Batch {job.eligibility.batch}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <button className="flex-1 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                            Edit
                        </button>
                        <button className="flex-1 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                            Delete
                        </button>
                    </div>
                </div>
            ))}
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
        setActiveTab('listings');
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Post New Opportunity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Opportunity Type</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Job">Full Time Job</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Package / Stipend</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 10 LPA or 20k/mo"
                            value={formData.package}
                            onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Min CGPA</label>
                        <input
                            type="number"
                            required
                            step="0.1"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.cgpa}
                            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Branch</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.branch}
                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        >
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="MECH">MECH</option>
                            <option value="EEE">EEE</option>
                            <option value="All">All Branches</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Batch</label>
                        <select
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.batch}
                            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                        >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                        Post Opportunity
                    </button>
                </div>
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Student Applications</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-800">{app.student}</td>
                                <td className="px-6 py-4 text-slate-600">{app.company}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                        className="text-sm border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500 bg-white"
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
        </div>
    );
}

function getStatusBadge(status) {
    if (status === 'Selected') return 'bg-green-100 text-green-800';
    if (status === 'Rejected') return 'bg-red-100 text-red-800';
    if (status === 'Interview') return 'bg-purple-100 text-purple-800';
    return 'bg-blue-100 text-blue-800';
}