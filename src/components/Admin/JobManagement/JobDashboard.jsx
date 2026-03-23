import React, { useState, useEffect } from 'react';
import { postOpportunity, getAllJobs, deleteJob, updateJob, getAllApplications, updateApplicationStatus } from '../../../services/jobService';

export default function JobDashboard({ filterType = 'All' }) {
    const [activeTab, setActiveTab] = useState('listings');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingJob, setEditingJob] = useState(null);

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
                    onClick={() => {
                        setEditingJob(null);
                        setActiveTab('create');
                    }}
                    className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${activeTab === 'create'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                        }`}
                >
                    {editingJob ? 'Edit Opportunity' : 'Post New Opportunity'}
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
                        <JobListings
                            jobs={filteredJobs}
                            onDelete={handleDelete}
                            onEdit={(job) => {
                                setEditingJob(job);
                                setActiveTab('create');
                            }}
                        />
                    )
                )}

                {activeTab === 'create' && (
                    <CreateJobForm
                        onSuccess={() => {
                            fetchJobs();
                            setEditingJob(null);
                            setActiveTab('listings');
                        }}
                        defaultType={filterType}
                        initialData={editingJob}
                        onCancel={() => {
                            setEditingJob(null);
                            setActiveTab('listings');
                        }}
                    />
                )}

                {activeTab === 'applications' && <AdminApplicationsView jobs={filteredJobs} />}
            </div>
        </div>
    );
}

function JobListings({ jobs, onDelete, onEdit }) {
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
                        <button
                            onClick={() => onEdit && onEdit(job)}
                            className="flex-1 py-2 text-slate-700 hover:text-indigo-600 font-bold text-sm transition-colors"
                        >
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

function CreateJobForm({ onSuccess, defaultType = 'Job', initialData = null, onCancel }) {
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        type: defaultType === 'All' ? 'Job' : defaultType,
        package: '',
        cgpa: '0',
        description: '',
        applyLink: '',
        deadline: '',
        targetBranches: ['All'],
        targetYears: ['All']
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                deadline: initialData.deadline || ''
            });
        }
    }, [initialData]);

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
        let result;
        if (initialData && initialData.id) {
            result = await updateJob(initialData.id, { ...formData, postedBy: user.uid });
        } else {
            result = await postOpportunity({ ...formData, postedBy: user.uid });
        }

        if (result.success) {
            alert(initialData ? 'Opportunity updated successfully!' : 'Opportunity posted successfully!');
            onSuccess();
        } else {
            alert('Error saving: ' + result.error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-4xl">
            <div className="p-8 bg-indigo-600 text-white flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold">{initialData ? 'Edit Opportunity' : 'Post New Opportunity'}</h3>
                    <p className="opacity-80">{initialData ? 'Update the details below.' : 'Fill in the details to broadcast this to eligible students.'}</p>
                </div>
                {initialData && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold transition-colors"
                    >
                        Cancel Edit
                    </button>
                )}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Application Deadline</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>
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
                    <p className="text-slate-400 text-sm italic">Double check all details before saving.</p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 active:scale-95"
                    >
                        {loading ? 'Processing...' : (initialData ? 'Save Changes' : 'Broadcast Opportunity')}
                    </button>
                </div>
            </form>
        </div>
    );
}

function AdminApplicationsView({ jobs }) {
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        setLoadingApps(true);
        const result = await getAllApplications();
        if (result.success) setApplications(result.data);
        setLoadingApps(false);
    };

    // Group applications by jobId and filter by visible jobs
    const visibleJobIds = new Set(jobs.map(j => j.id));
    const filteredApplications = applications.filter(app => visibleJobIds.has(app.jobId));
    
    const appsByJob = {};
    filteredApplications.forEach(app => {
        if (!appsByJob[app.jobId]) appsByJob[app.jobId] = [];
        appsByJob[app.jobId].push(app);
    });

    const enrichedJobs = jobs.map(job => ({
        ...job,
        applicants: appsByJob[job.id] || []
    }));

    if (loadingApps) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // CSV download helper
    const downloadCSV = (jobApps, job) => {
        const headers = ['Name', 'Course', 'CGPA', 'Backlogs', 'Status', 'Resume URL', 'Applied At'];
        const rows = jobApps.map(app => [
            app.name || '',
            app.course || '',
            app.cgpa || '',
            app.backlogs ?? '',
            app.status || 'Applied',
            app.resumeUrl || '',
            app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleDateString() : ''
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${job.company}_${job.role}_applicants.csv`.replace(/\s+/g, '_');
        a.click();
        URL.revokeObjectURL(url);
    };

    // — Detail panel for a selected job —
    if (selectedJob) {
        const allJobApps = appsByJob[selectedJob.id] || [];
        const statuses = ['All', ...Array.from(new Set(allJobApps.map(a => a.status || 'Applied')))];
        const filtered = statusFilter === 'All' ? allJobApps : allJobApps.filter(a => (a.status || 'Applied') === statusFilter);

        return (
            <div>
                {/* Back + Download toolbar */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <button
                        onClick={() => { setSelectedJob(null); setStatusFilter('All'); }}
                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        ← Back to All Jobs
                    </button>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Status filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {statuses.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${statusFilter === s
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        {/* Download */}
                        <button
                            onClick={() => downloadCSV(filtered, selectedJob)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                        >
                            ⬇ Download CSV
                        </button>
                    </div>
                </div>

                {/* Job header */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-3xl">
                                {selectedJob.type === 'Internship' ? '🎓' : '💼'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedJob.role}</h2>
                                <p className="text-slate-600 font-semibold">{selectedJob.company}</p>
                                <p className="text-xs text-slate-400 mt-1">{selectedJob.package} · {selectedJob.type} · Batches: {selectedJob.targetYears?.join(', ')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="bg-indigo-50 text-indigo-700 font-black text-sm px-4 py-2 rounded-full">
                                {allJobApps.length} Total Applicant{allJobApps.length !== 1 ? 's' : ''}
                            </span>
                            {statusFilter !== 'All' && (
                                <span className="text-xs text-slate-400">Showing {filtered.length} {statusFilter}</span>
                            )}
                        </div>
                    </div>
                    {selectedJob.description && (
                        <p className="mt-4 text-sm text-slate-500 border-t border-slate-100 pt-4">{selectedJob.description}</p>
                    )}
                </div>

                {/* Applicants table — read only */}
                {filtered.length === 0 ? (
                    <div className="py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-slate-500 font-semibold">No applicants match this filter.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100 bg-slate-50">
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">CGPA</th>
                                        <th className="px-6 py-4">Backlogs</th>
                                        <th className="px-6 py-4">Resume</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map(app => (
                                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {app.photoUrl ? (
                                                        <img src={app.photoUrl} alt={app.name} className="w-10 h-10 rounded-full object-cover border border-purple-100" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                                                            {(app.name || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{app.name}</p>
                                                        <p className="text-xs text-slate-400">{app.course}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{app.cgpa || '—'}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700">{app.backlogs ?? '—'}</td>
                                            <td className="px-6 py-4">
                                                {app.resumeUrl ? (
                                                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1">
                                                        📄 View
                                                    </a>
                                                ) : <span className="text-xs text-slate-300 italic">None</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight ${getStatusBadge(app.status)}`}>
                                                    {app.status || 'Applied'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // — Job list overview —
    if (enrichedJobs.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-lg font-bold text-slate-800">No job postings yet</h3>
                <p className="text-slate-500">Jobs posted by recruiters will appear here.</p>
            </div>
        );
    }

    const totalApplicants = filteredApplications.length;
    const shortlisted = filteredApplications.filter(a => a.status === 'Shortlisted').length;
    const interviewScheduled = filteredApplications.filter(a => a.status === 'Interview Scheduled').length;
    const hired = filteredApplications.filter(a => a.status === 'Hired').length;

    return (
        <div>
            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applications', value: totalApplicants, color: 'bg-indigo-50 text-indigo-700' },
                    { label: 'Shortlisted', value: shortlisted, color: 'bg-amber-50 text-amber-700' },
                    { label: 'Interview Scheduled', value: interviewScheduled, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Hired', value: hired, color: 'bg-emerald-50 text-emerald-700' },
                ].map(stat => (
                    <div key={stat.label} className={`rounded-2xl p-5 ${stat.color}`}>
                        <p className="text-3xl font-black">{stat.value}</p>
                        <p className="text-sm font-semibold mt-1 opacity-80">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Job cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrichedJobs.map(job => (
                    <button
                        key={job.id}
                        onClick={() => { setSelectedJob(job); setStatusFilter('All'); }}
                        className="text-left group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                    {job.type === 'Internship' ? '🎓' : '💼'}
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${job.type === 'Internship' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {job.type}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors mb-1">{job.role}</h3>
                            <p className="text-sm text-slate-500 font-semibold mb-4">{job.company}</p>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-sm text-slate-500">{job.package}</span>
                                <span className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full ${
                                    job.applicants.length > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    👥 {job.applicants.length} Applied
                                </span>
                            </div>
                        </div>
                        <div className="px-6 py-3 bg-indigo-600 text-white text-xs font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            View Applicants →
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function getStatusBadge(status) {
    if (status === 'Hired') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Rejected') return 'bg-rose-100 text-rose-700';
    if (status === 'Shortlisted') return 'bg-indigo-100 text-indigo-700';
    return 'bg-blue-100 text-blue-700';
}
