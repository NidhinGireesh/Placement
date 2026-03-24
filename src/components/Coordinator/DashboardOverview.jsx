import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getCoordinatorDetails, getStudentsByClass } from '../../services/coordinatorService';
import { getAllJobs } from '../../services/jobService';
import { getStudentProfile } from '../../services/studentService';

const DashboardOverview = ({ setActiveTab, setStudentFilter }) => {
    const { user } = useAuthStore();
    const [students, setStudents] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [coordProfile, setCoordProfile] = useState(null);
    const [profileError, setProfileError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        // Fetch Coordinator's own student profile for verification status
        const profileResult = await getStudentProfile(user.uid);
        if (profileResult.success) {
            setCoordProfile(profileResult);
            setProfileError(false);
        } else {
            setProfileError(true);
        }

        const coordResult = await getCoordinatorDetails(user.uid);
        if (coordResult.success) {
            const result = await getStudentsByClass(coordResult.branch, coordResult.passoutYear);
            if (result.success) {
                setStudents(result.data);
            }
        }
        
        // Fetch recent jobs for "Recent Updates"
        const jobsResult = await getAllJobs();
        if (jobsResult.success) {
            const viewedJobs = JSON.parse(localStorage.getItem(`viewed_jobs_${user.uid}`) || '[]');
            // Filter out viewed jobs and show only the 3 most recent
            const unviewed = jobsResult.data
                .filter(job => !viewedJobs.includes(job.id))
                .slice(0, 3);
            setRecentJobs(unviewed);
        }

        setLoading(false);
    };

    const handleViewJob = (jobId) => {
        const viewedJobs = JSON.parse(localStorage.getItem(`viewed_jobs_${user.uid}`) || '[]');
        if (!viewedJobs.includes(jobId)) {
            viewedJobs.push(jobId);
            localStorage.setItem(`viewed_jobs_${user.uid}`, JSON.stringify(viewedJobs));
        }
        // Remove from local state immediately for a smooth experience
        setRecentJobs(prev => prev.filter(job => job.id !== jobId));
        // Also navigate to the job board
        setActiveTab('student-jobs');
    };

    const totalStudents = students.length;
    const approvedStudents = students.filter(s => s.status?.toLowerCase() === 'approved' || s.approved).length;
    const pendingStudents = students.filter(s => {
        const st = s.status?.toLowerCase();
        // Pending if no approved flag AND (status is pending OR status is missing)
        return (st === 'pending' || !st) && !s.approved && !s.blocked;
    }).length;
    const placedStudents = students.filter(s => s.status?.toLowerCase() === 'hired' || s.placed).length;

    const StatCard = ({ title, value, icon, gradient, shadow, to, filter }) => (
        <button 
            onClick={() => {
                if (to) setActiveTab(to);
                if (filter) setStudentFilter(filter);
            }}
            className={`group bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl ${shadow} relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left w-full`}
        >
            <div className="relative z-10">
                <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">{title}</p>
                <h3 className="text-4xl font-black tracking-tight">{value}</h3>
                <p className="text-[10px] text-white/60 mt-2 font-medium uppercase tracking-widest group-hover:opacity-100 transition-opacity flex items-center gap-1 opacity-0">
                    Click to view details <span className="text-xl">→</span>
                </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                <span className="text-9xl grayscale brightness-200">{icon}</span>
            </div>
        </button>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                <StatCard
                    title="Profile Status"
                    value={(coordProfile && coordProfile.phone && coordProfile.cgpa !== undefined && coordProfile.resumeUrl) ? 'Verified' : 'Pending'}
                    icon="👤"
                    gradient="from-blue-600 to-indigo-700"
                    shadow="shadow-blue-100"
                    to="student-profile"
                />
                <StatCard
                    title="Total Students"
                    value={totalStudents}
                    icon="👥"
                    gradient="from-indigo-500 to-blue-600"
                    shadow="shadow-indigo-100"
                    to="students"
                    filter="all"
                />
                <StatCard
                    title="Approved Students"
                    value={approvedStudents}
                    icon="✅"
                    gradient="from-emerald-500 to-teal-600"
                    shadow="shadow-emerald-100"
                    to="students"
                    filter="approved"
                />
                <StatCard
                    title="Pending Students"
                    value={pendingStudents}
                    icon="⏳"
                    gradient="from-orange-400 to-amber-600"
                    shadow="shadow-amber-100"
                    to="students"
                    filter="pending"
                />
                <StatCard
                    title="Placed Students"
                    value={placedStudents}
                    icon="🎓"
                    gradient="from-purple-500 to-indigo-600"
                    shadow="shadow-purple-100"
                    to="students"
                />
            </div>

            {/* Recent Updates Area */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-xl mr-4 text-xl">📢</span>
                    Recent Updates
                </h2>

                <div className="space-y-6">
                    {/* Profile Status Feature (Same as Student) */}
                    {(!coordProfile || !coordProfile.phone || !coordProfile.dob || !coordProfile.gender || coordProfile.cgpa === undefined || coordProfile.cgpa === null || !coordProfile.resumeUrl) ? (
                        <div className="p-6 bg-yellow-50/50 rounded-2xl border border-yellow-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-yellow-50 transition-all duration-300">
                            <div>
                                <h4 className="font-bold text-gray-800 text-base">Complete Your Profile</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Please fill all mandatory fields to apply for upcoming drives.
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveTab('student-profile')}
                                className="text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-800 px-5 py-2.5 rounded-xl hover:bg-yellow-200 transition-all shadow-sm active:scale-95"
                            >
                                Action Required
                            </button>
                        </div>
                    ) : (
                        <div className="p-6 bg-green-50/30 rounded-2xl border border-green-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:bg-green-50/50 transition-all duration-300">
                            <div>
                                <h4 className="font-bold text-gray-800 text-base">Profile 100% Complete</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    Your profile is ready. You can now apply for all eligible jobs.
                                </p>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-5 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-green-200/50">
                                <span className="text-lg">✓</span> Verified
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 pt-2">
                        {recentJobs.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-sm font-medium text-gray-400 italic">No new placement updates at the moment.</p>
                            </div>
                        ) : (
                            recentJobs.map((job) => (
                                <div 
                                    key={job.id} 
                                    className="group p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-blue-50/40 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                🏢
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-black text-gray-800 group-hover:text-blue-600 transition-all tracking-tight leading-tight">
                                                    {job.role || job.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span className="text-blue-600">{job.company}</span>
                                                    <span className="text-slate-300">•</span>
                                                    <span>{job.location || 'Multiple Locations'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewJob(job.id)}
                                            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md active:scale-95"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
