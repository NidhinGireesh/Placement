import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getTargetedJobs } from '../../services/jobService';

export default function JobBoard() {
    const { user } = useAuthStore();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

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
        setLoading(false);
    };

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApply = (applyLink) => {
        if (applyLink) {
            window.open(applyLink, '_blank', 'noopener,noreferrer');
        } else {
            alert('No application link provided for this opportunity.');
        }
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
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Placement Opportunities</h2>
                    <p className="text-slate-500 mt-2">Tailored listings based on your branch ({user.department || 'Not Set'}) and batch ({user.passoutYear || 'Not Set'})</p>
                </div>
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
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{job.role}</h3>
                                        <p className="text-indigo-600 font-bold text-sm tracking-wide uppercase mt-1">{job.company}</p>
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

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                            <button
                                onClick={() => handleApply(job.applyLink)}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:bg-indigo-600"
                            >
                                Apply Now
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredJobs.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                        <div className="text-6xl mb-6 opacity-20">🔍</div>
                        <h3 className="text-xl font-bold text-slate-800">No matching opportunities</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">Check back later or try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
