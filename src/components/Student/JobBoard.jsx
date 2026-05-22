import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getTargetedJobs, applyForJob, getApplicationsForStudent } from '../../services/jobService';
import { getStudentProfile } from '../../services/studentService';

export default function JobBoard() {
    const { user } = useAuthStore();
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchJobs();
        }
    }, [user]);

    const fetchJobs = async () => {
        setLoading(true);
        // Use department and passoutYear from auth store (synced from Firestore)
        const result = await getTargetedJobs(user.department || '', user.passoutYear || '');
        if (result.success) {
            setJobs(result.data);
        } else {
            setError(result.error);
        }

        const appsResult = await getApplicationsForStudent(user.uid);
        if (appsResult.success) {
            setAppliedJobs(appsResult.data.map(app => app.jobId));
        }

        setLoading(false);
    };

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [applying, setApplying] = useState(false);

    const handleApply = async (job) => {
        if (!job) return;

        if (job.minCgpa && user.cgpa && parseFloat(user.cgpa) < parseFloat(job.minCgpa)) {
            if (!window.confirm("Your CGPA is below the minimum requirement. Are you sure you still want to apply?")) return;
        }
        if (job.maxBacklogs && user.backlogs && parseInt(user.backlogs) > parseInt(job.maxBacklogs)) {
            if (!window.confirm("You have more active backlogs than allowed. Are you sure you still want to apply?")) return;
        }
        if (job.deadline && new Date(job.deadline) < new Date()) {
            alert("The application deadline for this job has passed.");
            return;
        }

        setApplying(true);
        const profileResult = await getStudentProfile(user.uid);
        const resumeUrl = profileResult.success ? profileResult.resumeUrl : '';
        const photoUrl = profileResult.success ? profileResult.photoUrl : (user.photoUrl || '');

        if (!resumeUrl) {
            alert("Please upload your resume in the Profile section before applying.");
            setApplying(false);
            return;
        }

        const recruiterId = job.postedBy || job.recruiterId || null;
        // No longer strictly requiring recruiterId to allow applications for Admin-posted jobs.

        const result = await applyForJob(job.id, recruiterId, user.uid, {
            name: user.name,
            course: user.department || user.branch || profileResult.branch || '',
            cgpa: profileResult.cgpa || user.cgpa || 0,
            backlogs: profileResult.backlogs !== undefined ? profileResult.backlogs : (user.backlogs || 0),
            resumeUrl,
            photoUrl
        });
        setApplying(false);

        if (result.success) {
            alert("Application submitted successfully!");
            setAppliedJobs(prev => [...prev, job.id]);
            closeModal();
        } else {
            console.error("Apply Error Details:", result.error);
            alert(`Application failed: ${result.error}`);
        }
    };

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedJob(null), 300); // Wait for transition
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Finding the best opportunities for you...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex flex-col items-end">
                <div className="relative group w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search company or role..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                </div>
            </div>

            {error && <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-2xl border border-red-100">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredJobs.map(job => (
                    <div key={job.id} className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-slate-100 transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="p-8 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-500 shadow-inner">
                                        {job.type === 'Internship' ? '🎓' : '💼'}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">{job.role || job.title}</h3>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <p className="text-indigo-600 font-black text-[10px] tracking-widest uppercase">{job.company}</p>
                                            <span className="text-slate-200">•</span>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">{job.location || 'Location Not Specified'}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full tracking-widest uppercase shadow-sm ${job.type === 'Internship' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {job.type}
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-slate-600 font-medium">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sm">💰</div>
                                    <span className="text-slate-800">{job.package}</span>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 italic">
                                    "{job.description}"
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 py-4 border-t border-slate-50">
                                {job.targetBranches.map((branch, idx) => (
                                    <span key={idx} className="bg-slate-50 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-100 uppercase">
                                        {branch}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => handleViewDetails(job)}
                                className="flex-1 bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                            >
                                View Details
                            </button>
                            {job.applyLink ? (
                                <a
                                    href={job.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 group-hover:bg-indigo-600"
                                >
                                    View Job
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            ) : (
                                <button
                                    onClick={() => handleApply(job)}
                                    disabled={applying || appliedJobs.includes(job.id)}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${appliedJobs.includes(job.id)
                                            ? 'bg-emerald-500 text-white cursor-not-allowed shadow-none'
                                            : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 group-hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {appliedJobs.includes(job.id) ? 'Applied \u2713' : 'Apply'}
                                    {!appliedJobs.includes(job.id) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Details Modal */}
            {isModalOpen && selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative z-20 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div className="overflow-y-auto p-6 sm:p-10 hide-scrollbar flex-1">
                            {/* Modal Header */}
                            <div className="flex items-start gap-6 mb-8 border-b border-slate-100 pb-8 pr-12">
                                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0">
                                    {selectedJob.type === 'Internship' ? '🎓' : '💼'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedJob.role || selectedJob.title}</h3>
                                        <span className={`px-4 py-1.5 text-xs font-black rounded-full tracking-widest uppercase ${selectedJob.type === 'Internship' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {selectedJob.type}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-indigo-600 mb-4">{selectedJob.company}</p>

                                    <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">💰</div>
                                            <span>{selectedJob.package}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">📍</div>
                                            <span>{selectedJob.location || 'Not specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">⏰</div>
                                            <span>Deadline: {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                <div className="md:col-span-2 space-y-8">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <span className="text-indigo-500">📝</span> Description
                                        </h3>
                                        <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedJob.description}
                                        </div>
                                    </section>

                                    {selectedJob.requirements && (
                                        <section>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <span className="text-indigo-500">✅</span> Requirements & Skills
                                            </h3>
                                            <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {selectedJob.requirements}
                                            </div>
                                        </section>
                                    )}

                                    {selectedJob.selectionProcess && (
                                        <section>
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <span className="text-indigo-500">🏢</span> Selection Process
                                            </h3>
                                            <div className="bg-indigo-50/30 border border-indigo-100 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {selectedJob.selectionProcess}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-6">
                                        <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                            <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-tight">
                                                Eligibility Criteria
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 flex justify-between items-center group hover:border-indigo-200 transition-all">
                                                        <span className="text-slate-600 font-bold">Min CGPA</span>
                                                        <span className="text-2xl font-black text-indigo-600">{selectedJob.minCgpa || selectedJob.cgpa || '0'}</span>
                                                    </div>
                                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-50 flex justify-between items-center group hover:border-indigo-200 transition-all">
                                                        <span className="text-slate-600 font-bold">Max Backlogs</span>
                                                        <span className="text-2xl font-black text-indigo-600">{selectedJob.maxBacklogs || '0'}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4">
                                                    <p className="text-[10px] text-indigo-400 font-black mb-3 uppercase tracking-widest px-1">Eligible Branches</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedJob.targetBranches?.map((branch, idx) => (
                                                            <span key={idx} className="bg-white text-indigo-600 text-[11px] font-black px-4 py-2 rounded-xl border border-indigo-50 shadow-sm uppercase">
                                                                {branch}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    <p className="text-[10px] text-indigo-400 font-black mb-3 uppercase tracking-widest px-1">Eligible Batches</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedJob.targetYears?.map((year, idx) => (
                                                            <span key={idx} className="bg-white text-indigo-600 text-[11px] font-black px-4 py-2 rounded-xl border border-indigo-50 shadow-sm">
                                                                {year}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex flex-col sm:flex-row gap-4">
                            {selectedJob.applyLink ? (
                                <a
                                    href={selectedJob.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                                >
                                    View Job ↗
                                </a>
                            ) : (
                                <button
                                    onClick={() => handleApply(selectedJob)}
                                    disabled={applying || appliedJobs.includes(selectedJob.id)}
                                    className={`flex-[2] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${appliedJobs.includes(selectedJob.id)
                                            ? 'bg-emerald-500 text-white cursor-not-allowed shadow-none'
                                            : 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed'
                                        }`}
                                >
                                    {appliedJobs.includes(selectedJob.id)
                                        ? 'Applied \u2713'
                                        : (applying ? 'Submitting Application...' : `Register Internally For ${selectedJob.type}`)}
                                    {!appliedJobs.includes(selectedJob.id) && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {filteredJobs.length === 0 && (
                <div className="col-span-full py-24 text-center">
                    <div className="text-6xl mb-6 opacity-20">🔍</div>
                    <h3 className="text-xl font-bold text-slate-800">No matching opportunities</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Check back later or try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
}
