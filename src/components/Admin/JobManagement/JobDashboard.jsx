import React, { useState, useEffect } from 'react';
import { postOpportunity, getAllJobs, deleteJob } from '../../../services/jobService';

export default function JobDashboard({ filterType = 'All' }) {
    const [activeTab, setActiveTab] = useState('listings');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder applications state
    const [applications, setApplications] = useState([
        { id: 1, student: 'John Doe', company: 'TCS', status: 'Applied' },
        { id: 2, student: 'Jane Smith', company: 'Infosys', status: 'Interview' },
    ]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        const result = await getAllJobs();
        if (result.success) {
            setJobs(result.data);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            const result = await deleteJob(jobId);
            if (result.success) {
                setJobs(jobs.filter(j => j.id !== jobId));
            } else {
                alert('Failed to delete: ' + result.error);
            }
        }
    };

    const filteredJobs = filterType === 'All' ? jobs : jobs.filter(j => j.type === filterType);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {filterType === 'All' ? 'Jobs & Placements' : `${filterType} Portal`}
                </h1>
                <p className="text-slate-500 mt-2 text-lg">Create and manage opportunities for your students.</p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'listings'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    {filterType === 'All' ? 'Active Listings' : `${filterType}s`}
                </button>
                <button
                    onClick={() => setActiveTab('create')}
                    className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'create'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Post New Opportunity
                </button>
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'applications'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    Manage Applications
                </button>
            </div>

            <div className="mt-6">
                {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-100">{error}</div>}

                {activeTab === 'listings' && (
                    loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <JobListings jobs={filteredJobs} onDelete={handleDelete} />
                    )
                )}

                {activeTab === 'create' && (
                    <CreateJobForm
                        onSuccess={() => {
                            fetchJobs();
                            setActiveTab('listings');
                        }}
                        defaultType={filterType}
                    />
                )}

                {activeTab === 'applications' && <ApplicationsTable applications={applications} setApplications={setApplications} />}
            </div>
        </div>
    );
}

function JobListings({ jobs, onDelete }) {
    if (jobs.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-4">📢</div>
                <h3 className="text-lg font-bold text-slate-800">No opportunities yet</h3>
                <p className="text-slate-500">Post your first job or internship to get started.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
                <div key={job.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {job.type === 'Internship' ? '🎓' : '💼'}
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${job.type === 'Internship' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                {job.type}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{job.role}</h3>
                        <p className="text-slate-600 font-semibold mb-6 flex items-center gap-2">
                            {job.company}
                        </p>

                        <div className="space-y-3 pt-6 border-t border-slate-100 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-3">
                                <span className="w-5 text-center">💰</span>
                                <span className="text-slate-700">{job.package}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-5 text-center">🏢</span>
                                <span className="truncate">{job.targetBranches.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-5 text-center">📅</span>
                                <span>Batch: {job.targetYears.join(', ')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <button className="flex-1 py-2 text-slate-700 hover:text-indigo-600 font-bold text-sm transition-colors">
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(job.id)}
                            className="flex-1 py-2 text-slate-400 hover:text-red-600 font-bold text-sm transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CreateJobForm({ onSuccess, defaultType = 'Job' }) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        type: defaultType === 'All' ? 'Job' : defaultType,
        package: '',
        cgpa: '0',
        description: '',
        applyLink: '',
        targetBranches: ['All'],
        targetYears: ['All']
    });

    const [loading, setLoading] = useState(false);

    const branches = ['All', 'CSE', 'ECE', 'MECH', 'EEE', 'IT', 'RAI'];
    const batches = ['All', '2024', '2025', '2026', '2027', '2028', '2029'];

    const handleCheckboxChange = (type, value) => {
        setFormData(prev => {
            const current = prev[type];
            let next;
            if (value === 'All') {
                next = current.includes('All') ? [] : ['All'];
            } else {
                next = current.includes(value)
                    ? current.filter(i => i !== value)
                    : [...current.filter(i => i !== 'All'), value];
                if (next.length === 0) next = ['All'];
            }
            return { ...prev, [type]: next };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await postOpportunity(formData);
        if (result.success) {
            alert('Opportunity posted successfully!');
            onSuccess();
        } else {
            alert('Error posting: ' + result.error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl">
            <div className="p-8 bg-indigo-600 text-white">
                <h3 className="text-2xl font-bold">Post New Opportunity</h3>
                <p className="opacity-80">Fill in the details to broadcast this to eligible students.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Company Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. Google"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Position Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. Full Stack Developer"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Offer Category</label>
                        <select
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Job">Full Time Job</option>
                            <option value="Internship">Internship Training</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Financial Package</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. 10 LPA or 40k/month"
                            value={formData.package}
                            onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Job Description</label>
                    <textarea
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all min-h-[120px]"
                        placeholder="Detail the role, responsibilities, and key requirements..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Direct Application Link</label>
                    <input
                        type="url"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        placeholder="https://company.com/careers/job-123"
                        value={formData.applyLink}
                        onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target Departments</label>
                        <div className="flex flex-wrap gap-3">
                            {branches.map(b => (
                                <button
                                    key={b}
                                    type="button"
                                    onClick={() => handleCheckboxChange('targetBranches', b)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.targetBranches.includes(b)
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Eligible Batches</label>
                        <div className="flex flex-wrap gap-3">
                            {batches.map(b => (
                                <button
                                    key={b}
                                    type="button"
                                    onClick={() => handleCheckboxChange('targetYears', b)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${formData.targetYears.includes(b)
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-6 pt-10 border-t border-slate-100">
                    <p className="text-slate-400 text-sm italic">Double check all details before posting.</p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Processing...' : 'Broadcast Opportunity'}
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
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">Student Applications</h3>
                <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500 uppercase">{applications.length} Total</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                            <th className="px-8 py-5">Profile</th>
                            <th className="px-8 py-5">Target Company</th>
                            <th className="px-8 py-5 text-center">Current Status</th>
                            <th className="px-8 py-5 text-right">Workflow Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                            {app.student.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-800 tracking-tight">{app.student}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-slate-600 font-semibold">{app.company}</td>
                                <td className="px-8 py-6 text-center">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter ${getStatusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <select
                                        value={app.status}
                                        onChange={(e) => updateStatus(app.id, e.target.value)}
                                        className="text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white shadow-sm cursor-pointer transition-all"
                                    >
                                        <option value="Applied">Received</option>
                                        <option value="Interview">Shortlisted</option>
                                        <option value="Selected">Hired</option>
                                        <option value="Rejected">Not Selected</option>
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
    if (status === 'Selected') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Rejected') return 'bg-rose-100 text-rose-700';
    if (status === 'Interview') return 'bg-indigo-100 text-indigo-700';
    return 'bg-blue-100 text-blue-700';
}
