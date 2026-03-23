import React, { useState, useEffect } from 'react';
import { getUsersByRole } from '../../services/adminService';

export default function DashboardOverview({ setActiveTab, setStudentFilter }) {
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [coordinators, setCoordinators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const studentResult = await getUsersByRole('student');
            const recruiterResult = await getUsersByRole('recruiter');
            const coordinatorResult = await getUsersByRole('coordinator');

            // Combine students and coordinators for "Total Students" stats
            if (studentResult.success && coordinatorResult.success) {
                setStudents([...studentResult.data, ...coordinatorResult.data]);
            } else if (studentResult.success) {
                setStudents(studentResult.data);
            }

            if (recruiterResult.success) setRecruiters(recruiterResult.data);
            if (coordinatorResult.success) setCoordinators(coordinatorResult.data);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const stats = [
        {
            title: "Total Students",
            value: students.length,
            icon: "👨‍🎓",
            color: "from-blue-500 to-blue-600",
            bg: "bg-blue-50",
            text: "text-blue-600",
            tab: "students",
            filter: "all"
        },
        {
            title: "Approved Students",
            value: students.filter((s) => s.status?.toLowerCase() === 'approved' || s.approved).length,
            icon: "✅",
            color: "from-green-500 to-green-600",
            bg: "bg-green-50",
            text: "text-green-600",
            tab: "students",
            filter: "approved"
        },
        {
            title: "Pending Students",
            value: students.filter((s) => {
                const status = s.status?.toLowerCase();
                // Treat null, undefined, or empty string as pending (like Admin's request earlier)
                return (status === 'pending' || !status) && !s.approved && !s.blocked;
            }).length,
            icon: "⏳",
            color: "from-amber-400 to-amber-600",
            bg: "bg-amber-50",
            text: "text-amber-600",
            tab: "students",
            filter: "pending"
        },
        {
            title: "Blocked Students",
            value: students.filter((s) => s.blocked).length,
            icon: "🚫",
            color: "from-red-500 to-red-600",
            bg: "bg-red-50",
            text: "text-red-600",
            tab: "students",
            filter: "blocked"
        },
        {
            title: "Recruiters",
            value: recruiters.length,
            icon: "🏢",
            color: "from-purple-500 to-purple-600",
            bg: "bg-purple-50",
            text: "text-purple-600",
            tab: "recruiters"
        },
        {
            title: "Coordinators",
            value: coordinators.length,
            icon: "👔",
            color: "from-amber-500 to-amber-600",
            bg: "bg-amber-50",
            text: "text-amber-600",
            tab: "coordinators"
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">System Dashboard</h1>
                <p className="text-slate-500 mt-2">Welcome back to the Faculty Admin Dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <button 
                        key={index} 
                        onClick={() => {
                            if (stat.tab) {
                                setActiveTab(stat.tab);
                                if (stat.filter) setStudentFilter(stat.filter);
                            }
                        }}
                        className={`group bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 text-left ${stat.tab ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                        <div className="relative z-10">
                            <p className="text-white/80 font-bold uppercase tracking-wider text-[10px] mb-1">{stat.title}</p>
                            <h3 className="text-4xl font-black tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] text-white/60 mt-2 font-medium uppercase tracking-widest group-hover:opacity-100 transition-opacity flex items-center gap-1 opacity-0">
                                Click to view details <span className="text-xl">→</span>
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                            <span className="text-9xl grayscale brightness-200">{stat.icon}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Recent Activity or Quick Actions */}
            <div className="mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-2xl">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setActiveTab('students')}
                            className="p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
                        >
                            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">🎓</span>
                            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Add Student</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className="p-4 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-colors text-left group"
                        >
                            <span className="block text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">📢</span>
                            <span className="font-semibold text-slate-700 group-hover:text-purple-700">Post Job</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}